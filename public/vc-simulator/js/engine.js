/**
 * Game Engine - State management, turn progression, condition branching
 * v2: Extreme difficulty mode with random disasters
 */
const GameEngine = (() => {
  let state = {
    role: null,
    chapter: 0,
    eventIndex: 0,
    stats: {},
    flags: [],
    history: [],
    disasterCount: 0,
    deathStage: null,   // track where player died for leaderboard
    survivalScore: 0,   // how far they got
  };

  const FOUNDER_STATS = {
    runway: { value: 8, icon: '💰', label: '런웨이', unit: '개월', max: 12 },
    mental: { value: 80, icon: '🧠', label: '멘탈', unit: '%', max: 100 },
    persuasion: { value: 40, icon: '💬', label: '설득력', unit: '', max: 100 },
  };

  const VC_STATS = {
    powder: { value: 100, icon: '💰', label: '파우더', unit: '억', max: 100 },
    bossGaze: { value: 50, icon: '👔', label: '보스눈치', unit: '', max: 100 },
    eye: { value: 50, icon: '👁️', label: '심미안', unit: '', max: 100 },
  };

  // Random disasters that can strike between events (founder only)
  const DISASTERS = [
    { id: 'cto_quit', text: '⚡ 긴급! CTO가 "저 이직해요"라고 카톡을 보냈다. 새벽 2시에.', effects: { mental: -10, persuasion: -5 }, emoji: '💥' },
    { id: 'competitor', text: '⚡ 네이버가 당신과 똑같은 서비스를 출시했다. IR덱 1페이지를 다시 써야 한다.', effects: { mental: -8, persuasion: -8 }, emoji: '💥' },
    { id: 'server_down', text: '⚡ 데모 서버가 터졌다. VC 미팅 30분 전이다.', effects: { mental: -10 }, emoji: '🔥' },
    { id: 'cofounder_fight', text: '⚡ 공동창업자와 지분 다툼이 시작됐다. "나 없으면 이 회사 못 해"', effects: { mental: -12 }, emoji: '💥' },
    { id: 'bad_review', text: '⚡ 앱스토어에 별 1개 리뷰가 올라왔다. "사기 앱" — 스크린샷과 함께 트위터에서 바이럴.', effects: { mental: -8, persuasion: -3 }, emoji: '📱' },
    { id: 'tax_bomb', text: '⚡ 세무사에게서 전화가 왔다. "대표님, 부가세 신고 안 하셨는데요..." 가산세 포함 800만원.', effects: { runway: -0.5, mental: -5 }, emoji: '💸' },
    { id: 'investor_ghost', text: '⚡ 투자 확정이라던 엔젤 투자자가 잠수를 탔다. 전화도 안 받는다.', effects: { mental: -10 }, emoji: '👻' },
    { id: 'office_evict', text: '⚡ 공유오피스에서 퇴거 통보가 왔다. "임대료 2개월 연체이신데요..."', effects: { runway: -0.5, mental: -5 }, emoji: '🏢' },
    { id: 'key_hire_reject', text: '⚡ 3개월 동안 구애했던 핵심 인력이 대기업 오퍼를 선택했다. "스타트업은 좀..."', effects: { mental: -8, persuasion: -3 }, emoji: '💔' },
    { id: 'regulation', text: '⚡ 정부가 새 규제를 발표했다. 당신의 비즈니스 모델이 직격탄을 맞았다.', effects: { persuasion: -10, mental: -5 }, emoji: '⚖️' },
    { id: 'demo_fail', text: '⚡ VC 앞에서 라이브 데모를 했는데 로딩이 안 된다. 30초의 침묵이 30년처럼 느껴진다.', effects: { persuasion: -8, mental: -8 }, emoji: '💀' },
    { id: 'family_pressure', text: '⚡ 명절에 친척이 물었다. "그래서 회사가 돈은 벌어?" 온 가족이 당신을 쳐다본다.', effects: { mental: -10 }, emoji: '🏠' },
  ];

  function init(role) {
    state = {
      role,
      chapter: 1,
      eventIndex: 0,
      stats: {},
      flags: [],
      history: [],
      disasterCount: 0,
      deathStage: null,
      survivalScore: 0,
    };

    const template = role === 'founder' ? FOUNDER_STATS : VC_STATS;
    for (const key in template) {
      state.stats[key] = { ...template[key] };
    }
  }

  function getState() {
    return { ...state };
  }

  function getStats() {
    return state.stats;
  }

  function getScenarios() {
    return state.role === 'founder' ? FounderScenarios : VCScenarios;
  }

  function getCurrentEvent() {
    const scenarios = getScenarios();
    const chapter = scenarios.find(ch => ch.chapter === state.chapter);
    if (!chapter) return null;

    while (state.eventIndex < chapter.events.length) {
      const event = chapter.events[state.eventIndex];
      if (checkCondition(event.condition)) {
        return event;
      }
      state.eventIndex++;
    }
    return null;
  }

  function checkCondition(condition) {
    if (!condition) return true;
    if (condition.flag) return state.flags.includes(condition.flag);
    if (condition.notFlag) return !state.flags.includes(condition.notFlag);
    if (condition.stat) {
      const s = state.stats[condition.stat];
      if (!s) return false;
      if (condition.gte !== undefined) return s.value >= condition.gte;
      if (condition.lte !== undefined) return s.value <= condition.lte;
      if (condition.gt !== undefined) return s.value > condition.gt;
      if (condition.lt !== undefined) return s.value < condition.lt;
    }
    if (condition.or) return condition.or.some(c => checkCondition(c));
    if (condition.and) return condition.and.every(c => checkCondition(c));
    return true;
  }

  function applyChoice(choiceIndex) {
    const event = getCurrentEvent();
    if (!event) return null;

    const choice = event.choices[choiceIndex];
    if (!choice) return null;

    state.history.push({
      chapter: state.chapter,
      eventId: event.id,
      choiceIndex,
      choiceText: choice.text,
    });

    state.survivalScore++;

    const effects = {};
    if (choice.effects) {
      for (const key in choice.effects) {
        if (state.stats[key]) {
          const prev = state.stats[key].value;
          state.stats[key].value = Math.max(0, Math.min(
            state.stats[key].max,
            state.stats[key].value + choice.effects[key]
          ));
          effects[key] = {
            delta: choice.effects[key],
            prev,
            current: state.stats[key].value,
            label: state.stats[key].label,
            icon: state.stats[key].icon,
          };
        }
      }
    }

    if (choice.flags) {
      choice.flags.forEach(f => {
        if (!state.flags.includes(f)) state.flags.push(f);
      });
    }

    if (choice.removeFlags) {
      state.flags = state.flags.filter(f => !choice.removeFlags.includes(f));
    }

    const gameOver = checkGameOver();
    if (gameOver) {
      state.deathStage = `CH${state.chapter} - ${event.id}`;
    }

    return {
      result: choice.result,
      resultSpeaker: choice.resultSpeaker || null,
      effects,
      flags: choice.flags || [],
      gameOver,
      nextEvent: choice.nextEvent || null,
    };
  }

  function checkGameOver() {
    if (state.role === 'founder') {
      if (state.stats.runway.value <= 0) return 'runway_zero';
      if (state.stats.mental.value <= 0) return 'burnout';
    } else {
      if (state.stats.bossGaze.value <= 0) return 'fired';
    }
    return null;
  }

  function advanceEvent() {
    state.eventIndex++;
    const event = getCurrentEvent();
    if (event) return true;

    state.chapter++;
    state.eventIndex = 0;
    const scenarios = getScenarios();
    const nextChapter = scenarios.find(ch => ch.chapter === state.chapter);
    return !!nextChapter;
  }

  function jumpToEvent(eventId) {
    const scenarios = getScenarios();
    for (const chapter of scenarios) {
      for (let i = 0; i < chapter.events.length; i++) {
        if (chapter.events[i].id === eventId) {
          state.chapter = chapter.chapter;
          state.eventIndex = i;
          return true;
        }
      }
    }
    return false;
  }

  function applyChapterDecay() {
    if (state.role === 'founder') {
      // 1 month runway per chapter (time passes)
      state.stats.runway.value = Math.max(0, state.stats.runway.value - 1);
    }
  }

  // Roll for random disaster (founder only, ~20% chance per event transition)
  function rollDisaster() {
    if (state.role !== 'founder') return null;
    if (Math.random() > 0.20) return null;

    // Pick a random disaster not yet triggered
    const used = state.flags.filter(f => f.startsWith('disaster_'));
    const available = DISASTERS.filter(d => !used.includes('disaster_' + d.id));
    if (available.length === 0) return null;

    const disaster = available[Math.floor(Math.random() * available.length)];
    state.flags.push('disaster_' + disaster.id);
    state.disasterCount++;

    // Apply effects
    const effects = {};
    for (const key in disaster.effects) {
      if (state.stats[key]) {
        const prev = state.stats[key].value;
        state.stats[key].value = Math.max(0, Math.min(
          state.stats[key].max,
          state.stats[key].value + disaster.effects[key]
        ));
        effects[key] = {
          delta: disaster.effects[key],
          prev,
          current: state.stats[key].value,
          label: state.stats[key].label,
          icon: state.stats[key].icon,
        };
      }
    }

    return { ...disaster, effects };
  }

  function hasFlag(flag) {
    return state.flags.includes(flag);
  }

  function addFlag(flag) {
    if (!state.flags.includes(flag)) state.flags.push(flag);
  }

  function evaluateEnding() {
    return EndingsSystem.evaluate(state);
  }

  function setDeathStage(stage) {
    state.deathStage = stage;
  }

  return {
    init,
    getState,
    getStats,
    getCurrentEvent,
    applyChoice,
    advanceEvent,
    jumpToEvent,
    applyChapterDecay,
    rollDisaster,
    hasFlag,
    addFlag,
    checkCondition,
    evaluateEnding,
    checkGameOver,
    setDeathStage,
  };
})();
