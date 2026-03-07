/**
 * Fund Me If You Can - Game Engine
 * State management, turn progression, conditional branching, flags system
 */

const GameEngine = (() => {
  // Game state
  let state = {
    phase: 'title',       // title | roleSelect | playing | result | ending | gameover
    role: null,            // 'founder' | 'vc'
    chapter: 0,
    eventIndex: 0,
    stats: {},
    flags: [],
    choiceHistory: [],
    currentEvent: null,
    showingResult: false,
  };

  // Stat definitions per role
  const STAT_DEFS = {
    founder: [
      { key: 'hype', emoji: '\uD83D\uDD25', label: '\uD558\uC774\uD504', initial: 30, color: 'var(--hype-color)' },
      { key: 'credibility', emoji: '\uD83C\uDFAF', label: '\uC2E0\uB8B0\uB3C4', initial: 70, color: 'var(--credibility-color)' },
      { key: 'product', emoji: '\u2699\uFE0F', label: '\uD504\uB85C\uB355\uD2B8', initial: 20, color: 'var(--product-color)' },
    ],
    vc: [
      { key: 'conviction', emoji: '\uD83D\uDC8E', label: '\uD655\uC2E0', initial: 50, color: 'var(--conviction-color)' },
      { key: 'reputation', emoji: '\uD83D\uDCCA', label: '\uD3C9\uD310', initial: 70, color: 'var(--reputation-color)' },
      { key: 'diligence', emoji: '\uD83D\uDD0D', label: '\uC2E4\uC0AC\uB825', initial: 50, color: 'var(--diligence-color)' },
    ],
  };

  // Game over stat per role
  const GAMEOVER_STAT = {
    founder: 'credibility',
    vc: 'reputation',
  };

  function getState() {
    return { ...state };
  }

  function getStatDefs() {
    return STAT_DEFS[state.role] || [];
  }

  function getScenario() {
    if (state.role === 'founder') return window.FounderScenario || [];
    if (state.role === 'vc') return window.VCScenario || [];
    return [];
  }

  function reset() {
    state = {
      phase: 'title',
      role: null,
      chapter: 0,
      eventIndex: 0,
      stats: {},
      flags: [],
      choiceHistory: [],
      currentEvent: null,
      showingResult: false,
    };
  }

  function selectRole(role) {
    state.role = role;
    state.stats = {};
    STAT_DEFS[role].forEach(s => {
      state.stats[s.key] = s.initial;
    });
    state.phase = 'playing';
    state.eventIndex = 0;
    state.chapter = 0;
    state.flags = [];
    state.choiceHistory = [];
    state.showingResult = false;
    advanceToNextEvent();
  }

  function advanceToNextEvent() {
    const scenario = getScenario();
    let found = false;

    while (state.eventIndex < scenario.length) {
      const event = scenario[state.eventIndex];

      // Check condition
      if (event.condition) {
        const hasFlag = state.flags.includes(event.condition.flag);
        const pass = event.condition.negate ? !hasFlag : hasFlag;
        if (!pass) {
          state.eventIndex++;
          continue;
        }
      }

      // Check probability
      if (event.probability !== null && event.probability !== undefined) {
        if (Math.random() > event.probability) {
          state.eventIndex++;
          continue;
        }
      }

      state.currentEvent = event;
      state.chapter = event.chapter;
      found = true;
      break;
    }

    if (!found) {
      // No more events - trigger ending
      triggerEnding();
    }
  }

  function jumpToEvent(eventId) {
    const scenario = getScenario();
    const idx = scenario.findIndex(e => e.id === eventId);
    if (idx !== -1) {
      state.eventIndex = idx;
      advanceToNextEvent();
    } else {
      state.eventIndex++;
      advanceToNextEvent();
    }
  }

  function makeChoice(choiceIndex) {
    const event = state.currentEvent;
    if (!event || !event.choices[choiceIndex]) return null;

    const choice = event.choices[choiceIndex];

    // Handle probability-based effects
    let effects = choice.effects;
    let resultText = choice.result;
    let probabilityResult = null;

    if (choice.probability) {
      const roll = Math.random();
      if (roll <= choice.probability.chance) {
        effects = choice.probability.success.effects;
        resultText = choice.probability.success.result;
        probabilityResult = 'success';
      } else {
        effects = choice.probability.failure.effects;
        resultText = choice.probability.failure.result;
        probabilityResult = 'failure';
      }
    }

    // Apply effects
    const changes = {};
    if (effects) {
      for (const [key, val] of Object.entries(effects)) {
        if (state.stats[key] !== undefined) {
          const oldVal = state.stats[key];
          state.stats[key] = Math.max(0, Math.min(100, oldVal + val));
          changes[key] = val;
        }
      }
    }

    // Add flags
    if (choice.flags) {
      choice.flags.forEach(f => {
        if (!state.flags.includes(f)) {
          state.flags.push(f);
        }
      });
    }

    // Record choice
    state.choiceHistory.push({
      eventId: event.id,
      choiceIndex,
      choiceText: choice.text,
    });

    state.showingResult = true;

    return {
      resultText,
      resultSpeaker: choice.resultSpeaker || { name: '\uB098\uB808\uC774\uD130', emoji: '\uD83C\uDFAD' },
      effects: changes,
      probabilityResult,
    };
  }

  function checkGameOver() {
    const goStat = GAMEOVER_STAT[state.role];
    if (goStat && state.stats[goStat] <= 0) {
      return goStat;
    }
    return null;
  }

  function proceedAfterResult() {
    state.showingResult = false;

    // Check game over
    const goStat = checkGameOver();
    if (goStat) {
      state.phase = 'gameover';
      return { type: 'gameover', stat: goStat };
    }

    // Check if the choice has a nextEvent
    const lastChoice = state.choiceHistory[state.choiceHistory.length - 1];
    const event = state.currentEvent;
    const choice = event.choices[lastChoice.choiceIndex];

    if (choice.nextEvent) {
      jumpToEvent(choice.nextEvent);
    } else {
      state.eventIndex++;
      advanceToNextEvent();
    }

    if (state.phase === 'ending') {
      return { type: 'ending' };
    }

    // Check if chapter changed
    const newEvent = state.currentEvent;
    if (newEvent && newEvent.chapter !== event.chapter) {
      return { type: 'newChapter', chapter: newEvent.chapter, title: newEvent.title };
    }

    return { type: 'continue' };
  }

  function triggerEnding() {
    state.phase = 'ending';
    const ending = window.EndingsEngine
      ? window.EndingsEngine.determine(state.role, state.stats, state.flags)
      : { name: 'Unknown', emoji: '?', description: '' };
    state.ending = ending;
  }

  function getEnding() {
    return state.ending || null;
  }

  // Public API
  return {
    getState,
    getStatDefs,
    reset,
    selectRole,
    makeChoice,
    proceedAfterResult,
    getEnding,
    checkGameOver,
  };
})();
