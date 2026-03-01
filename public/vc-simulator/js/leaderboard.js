/**
 * Leaderboard System v2 - Progress tracking + 자랑용 리더보드
 * 서버 없음: localStorage 기반
 */
const LeaderboardSystem = (() => {
  const PROGRESS_KEY  = 'startup_rpg_progress';
  const LEGACY_STATS_KEY = 'startup_rpg_global_stats';
  const LEGACY_LB_KEY    = 'startup_rpg_leaderboard';

  // 시뮬레이션된 글로벌 기저 통계 (경쟁심 자극용)
  const BASE_GLOBAL = {
    totalPlays: 4827,
    founderPlays: 3291,
    vcPlays: 1536,
    founderClearRate: 0.034,
    vcClearRate: 0.182,
    deathsByStage: {
      CH1: { count: 823, pct: 25 }, CH2: { count: 1147, pct: 35 },
      CH3: { count: 891, pct: 27 }, CH4: { count: 331, pct: 10 },
      CLEAR: { count: 99, pct: 3 },
    },
  };

  const ENDING_LABELS = {
    easy_smart_survivor: '스마트 서바이버',
    easy_pivot_master:   '피봇의 달인',
    easy_burnout:        '번아웃',
    easy_runway_end:     '런웨이 종료',
    easy_bad_terms:      '독이 든 성배',
    normal_series_a_win: 'Series A 클로저',
    normal_bootstrap:    '부트스트랩 마스터',
    normal_burnout:      '번아웃 (Series A)',
    normal_runway_end:   '런웨이 종료 (Series A)',
    normal_bad_terms:    '독소 조항 서명',
    hard_global_round:   '글로벌 라운드 클로저',
    hard_strategic_ally: '전략적 파트너십',
    hard_burnout_global: '글로벌 번아웃',
    hard_deal_collapse:  '딜 붕괴',
    hard_poison_terms:   '독소 조항 (Series B)',
  };

  // ===== PROGRESS STORAGE =====
  function loadProgress() {
    try {
      const data = localStorage.getItem(PROGRESS_KEY);
      if (data) return JSON.parse(data);
    } catch {}
    return {
      founder: {
        easy_cleared:   false, normal_cleared: false, hard_cleared: false,
        easy_best_ending:   null, normal_best_ending: null, hard_best_ending: null,
        easy_best_score:    0,    normal_best_score:  0,    hard_best_score:  0,
        play_count: 0,
      },
    };
  }

  function saveProgress(difficulty, endingId, score) {
    const p = loadProgress();
    const d = difficulty;
    p.founder.play_count++;
    p.founder[`${d}_cleared`] = true;
    if (score > p.founder[`${d}_best_score`]) {
      p.founder[`${d}_best_score`]  = score;
      p.founder[`${d}_best_ending`] = endingId;
    }
    try { localStorage.setItem(PROGRESS_KEY, JSON.stringify(p)); } catch {}
  }

  function incrementPlayCount() {
    const p = loadProgress();
    p.founder.play_count++;
    try { localStorage.setItem(PROGRESS_KEY, JSON.stringify(p)); } catch {}
  }

  function isUnlocked(difficulty) {
    const p = loadProgress().founder;
    if (difficulty === 'easy')   return true;
    if (difficulty === 'normal') return p.easy_cleared;
    if (difficulty === 'hard')   return p.normal_cleared;
    return false;
  }

  function getBestScore(difficulty) {
    return loadProgress().founder[`${difficulty}_best_score`] || 0;
  }

  function isCleared(difficulty) {
    return loadProgress().founder[`${difficulty}_cleared`] === true;
  }

  function getBestEnding(difficulty) {
    return loadProgress().founder[`${difficulty}_best_ending`];
  }

  // ===== LEADERBOARD TRACKING (게임 종료 시) =====
  function recordRun(gameState, ending) {
    const isSuccess = GameEngine.isSuccessEnding(ending.id);

    if (isSuccess) {
      const score = GameEngine.calculateScore(ending.id);
      saveProgress(gameState.difficulty, ending.id, score);
    } else {
      incrementPlayCount();
    }

    // 레거시 stats (사망 통계용)
    try {
      const raw = localStorage.getItem(LEGACY_STATS_KEY);
      const stats = raw ? JSON.parse(raw) : { plays: 0, clears: 0, deaths: [] };
      stats.plays++;
      if (isSuccess) stats.clears++;
      stats.deaths.push({ chapter: gameState.chapter, cause: ending.title, role: gameState.role, timestamp: Date.now() });
      localStorage.setItem(LEGACY_STATS_KEY, JSON.stringify(stats));
    } catch {}

    // 레거시 history
    try {
      const raw = localStorage.getItem(LEGACY_LB_KEY);
      const history = raw ? JSON.parse(raw) : [];
      history.push({
        role: gameState.role,
        difficulty: gameState.difficulty,
        ending: ending.id,
        endingTitle: ending.title,
        endingEmoji: ending.emoji,
        chapter: gameState.chapter,
        stats: {
          runway:     gameState.stats.runway     ? gameState.stats.runway.value     : null,
          mental:     gameState.stats.mental     ? gameState.stats.mental.value     : null,
          persuasion: gameState.stats.persuasion ? gameState.stats.persuasion.value : null,
        },
        score: GameEngine.isSuccessEnding(ending.id) ? GameEngine.calculateScore(ending.id) : 0,
        timestamp: Date.now(),
      });
      localStorage.setItem(LEGACY_LB_KEY, JSON.stringify(history.slice(-50)));
    } catch {}
  }

  // ===== RENDER: 난이도 선택 화면의 "내 기록" 패널 =====
  function renderMyRecord() {
    const p = loadProgress().founder;

    const difficulties = [
      { id: 'easy',   icon: '🌱', name: 'Seed Round',  label: 'EASY' },
      { id: 'normal', icon: '🚀', name: 'Series A',    label: 'NORMAL' },
      { id: 'hard',   icon: '🌍', name: 'Series B',    label: 'HARD' },
    ];

    let html = '<div class="my-record">';
    html += '<div class="my-record-title">📊 내 기록</div>';

    for (const diff of difficulties) {
      const cleared  = p[`${diff.id}_cleared`];
      const score    = p[`${diff.id}_best_score`];
      const endingId = p[`${diff.id}_best_ending`];
      const unlocked = isUnlocked(diff.id);

      html += `<div class="my-record-row ${!unlocked ? 'locked' : ''}">`;
      html += `<span class="my-record-icon">${diff.icon}</span>`;
      html += `<div class="my-record-info">`;
      html += `<span class="my-record-name">${diff.name}</span>`;

      if (!unlocked) {
        html += `<span class="my-record-locked-msg">🔒 잠금</span>`;
      } else if (cleared && score > 0) {
        const pct = GameEngine.getPercentileLabel(score, diff.id);
        const endingLabel = ENDING_LABELS[endingId] || endingId || '-';
        html += `<span class="my-record-cleared">✅ CLEARED</span>`;
        html += `<span class="my-record-score">최고 ${score.toLocaleString()}점 | ${pct.badge} ${pct.label}</span>`;
        html += `<span class="my-record-ending">달성 엔딩: ${endingLabel}</span>`;
      } else {
        html += `<span class="my-record-not-played">아직 도전하지 않음</span>`;
      }

      html += '</div></div>';
    }

    html += `<div class="my-record-plays">총 플레이: ${p.play_count}회</div>`;
    html += '</div>';
    return html;
  }

  // ===== RENDER: 사망 통계 (기존 leaderboard 화면) =====
  function renderDeathStats(role) {
    try {
      const raw = localStorage.getItem(LEGACY_STATS_KEY);
      const local = raw ? JSON.parse(raw) : { plays: 0, clears: 0, deaths: [] };
      const rawH  = localStorage.getItem(LEGACY_LB_KEY);
      const history = (rawH ? JSON.parse(rawH) : []).filter(h => !role || h.role === role);

      const totalPlays = BASE_GLOBAL.totalPlays + local.plays;
      const rolePlays  = role === 'founder'
        ? BASE_GLOBAL.founderPlays + history.filter(h => h.role === 'founder').length
        : role === 'vc'
          ? BASE_GLOBAL.vcPlays + history.filter(h => h.role === 'vc').length
          : totalPlays;

      const baseClearRate = role === 'founder' ? BASE_GLOBAL.founderClearRate : BASE_GLOBAL.vcClearRate;
      const localClears   = history.filter(h => GameEngine.isSuccessEnding(h.ending)).length;
      const clearRate     = ((baseClearRate * (role === 'founder' ? BASE_GLOBAL.founderPlays : BASE_GLOBAL.vcPlays) + localClears) / rolePlays * 100).toFixed(1);

      const deathMap = {};
      for (let i = 1; i <= 4; i++) {
        const key = `CH${i}`;
        deathMap[key] = BASE_GLOBAL.deathsByStage[key].count;
      }
      deathMap.CLEAR = BASE_GLOBAL.deathsByStage.CLEAR.count;
      history.forEach(h => {
        const key = GameEngine.isSuccessEnding(h.ending) ? 'CLEAR' : `CH${h.chapter}`;
        deathMap[key] = (deathMap[key] || 0) + 1;
      });

      const total = Object.values(deathMap).reduce((a, b) => a + b, 0);
      const roleLabel = role === 'founder' ? '창업자' : 'VC';

      let html = `
        <div class="lb-header">
          <div class="lb-pixel-skull">☠</div>
          <div class="lb-title">사망 통계</div>
          <div class="lb-subtitle">${totalPlays.toLocaleString()}명이 도전했다</div>
        </div>
        <div class="lb-clear-rate">
          <div class="lb-rate-label">${roleLabel} 클리어율</div>
          <div class="lb-rate-value">${clearRate}%</div>
          <div class="lb-rate-bar"><div class="lb-rate-fill" style="width:${Math.min(parseFloat(clearRate), 100)}%"></div></div>
          <div class="lb-rate-comment">${parseFloat(clearRate) < 5 ? '거의 불가능에 가깝다' : '소수만이 살아남았다'}</div>
        </div>
        <div class="lb-deaths"><div class="lb-section-title">어디서 죽었나?</div>
      `;
      Object.entries(deathMap).forEach(([stage, count]) => {
        const pct   = Math.round(count / total * 100);
        const label = stage === 'CLEAR' ? '✨ 클리어' : `💀 ${stage}`;
        const color = stage === 'CLEAR' ? 'var(--success)' : 'var(--danger)';
        html += `<div class="lb-death-row">
          <span class="lb-death-label">${label}</span>
          <div class="lb-death-bar"><div class="lb-death-fill" style="width:${pct}%;background:${color}"></div></div>
          <span class="lb-death-pct">${pct}%</span>
        </div>`;
      });
      html += '</div>';

      const recentDeaths = history.slice(-10).reverse();
      if (recentDeaths.length > 0) {
        html += '<div class="lb-recent"><div class="lb-section-title">내 전사 기록</div>';
        recentDeaths.forEach(d => {
          html += `<div class="lb-recent-row">${d.endingEmoji} CH${d.chapter} — ${d.endingTitle}</div>`;
        });
        html += '</div>';
      }

      html += `<div class="lb-mystats"><span>내 도전: ${local.plays}회</span><span>클리어: ${local.clears}회</span></div>`;
      return html;
    } catch {
      return '<div class="lb-error">기록을 불러올 수 없습니다.</div>';
    }
  }

  // 구 recordDeath 호환 (ui.js에서 호출)
  function recordDeath(gameState, ending) {
    recordRun(gameState, ending);
  }

  return {
    loadProgress,
    saveProgress,
    incrementPlayCount,
    isUnlocked,
    getBestScore,
    isCleared,
    getBestEnding,
    recordRun,
    recordDeath,
    renderMyRecord,
    renderDeathStats,
    // 구 API 호환
    renderLeaderboard: renderDeathStats,
  };
})();
