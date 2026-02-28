/**
 * Leaderboard System - Track failures with localStorage + simulated global stats
 */
const LeaderboardSystem = (() => {
  const STORAGE_KEY = 'startup_rpg_leaderboard';
  const STATS_KEY = 'startup_rpg_global_stats';

  // Simulated "global" base stats (가짜 글로벌 통계 - 경쟁심 자극용)
  const BASE_GLOBAL = {
    totalPlays: 4827,
    founderPlays: 3291,
    vcPlays: 1536,
    founderClearRate: 0.034,  // 3.4% 클리어율
    vcClearRate: 0.182,
    deathsByStage: {
      'CH1': { count: 823, pct: 25 },
      'CH2': { count: 1147, pct: 35 },
      'CH3': { count: 891, pct: 27 },
      'CH4': { count: 331, pct: 10 },
      'CLEAR': { count: 99, pct: 3 },
    },
    commonDeaths: [
      { cause: '런웨이 종료', pct: 42 },
      { cause: '번아웃', pct: 31 },
      { cause: '딜 파토', pct: 15 },
      { cause: '독소 조항', pct: 8 },
      { cause: '클리어', pct: 4 },
    ],
  };

  function getLocalStats() {
    try {
      const data = localStorage.getItem(STATS_KEY);
      return data ? JSON.parse(data) : { plays: 0, clears: 0, deaths: [] };
    } catch { return { plays: 0, clears: 0, deaths: [] }; }
  }

  function saveLocalStats(stats) {
    try { localStorage.setItem(STATS_KEY, JSON.stringify(stats)); } catch {}
  }

  function getHistory() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch { return []; }
  }

  function saveHistory(history) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(-50))); } catch {}
  }

  function recordDeath(gameState, ending) {
    const stats = getLocalStats();
    stats.plays++;

    const isCleared = ending.id === 'smart_survivor' || ending.id === 'star_analyst';
    if (isCleared) stats.clears++;

    const chapter = gameState.chapter;
    stats.deaths.push({
      chapter,
      cause: ending.title,
      role: gameState.role,
      timestamp: Date.now(),
    });

    saveLocalStats(stats);

    // Save to history
    const history = getHistory();
    history.push({
      role: gameState.role,
      ending: ending.id,
      endingTitle: ending.title,
      endingEmoji: ending.emoji,
      chapter,
      stats: {
        runway: gameState.stats.runway ? gameState.stats.runway.value : null,
        mental: gameState.stats.mental ? gameState.stats.mental.value : null,
        persuasion: gameState.stats.persuasion ? gameState.stats.persuasion.value : null,
      },
      score: gameState.survivalScore || 0,
      timestamp: Date.now(),
    });
    saveHistory(history);
  }

  function getLeaderboardData(role) {
    const local = getLocalStats();
    const history = getHistory().filter(h => !role || h.role === role);

    // Merge local stats with base global for display
    const totalPlays = BASE_GLOBAL.totalPlays + local.plays;
    const rolePlays = role === 'founder'
      ? BASE_GLOBAL.founderPlays + history.filter(h => h.role === 'founder').length
      : role === 'vc'
        ? BASE_GLOBAL.vcPlays + history.filter(h => h.role === 'vc').length
        : totalPlays;

    // Calculate clear rate
    const baseClearRate = role === 'founder' ? BASE_GLOBAL.founderClearRate : BASE_GLOBAL.vcClearRate;
    const localClears = history.filter(h =>
      h.ending === 'smart_survivor' || h.ending === 'star_analyst' ||
      h.ending === 'valuation_up'
    ).length;
    const clearRate = ((baseClearRate * (role === 'founder' ? BASE_GLOBAL.founderPlays : BASE_GLOBAL.vcPlays) + localClears) / rolePlays * 100).toFixed(1);

    // Death distribution
    const deathMap = {};
    for (let i = 1; i <= 4; i++) {
      const key = `CH${i}`;
      deathMap[key] = BASE_GLOBAL.deathsByStage[key].count;
    }
    deathMap['CLEAR'] = BASE_GLOBAL.deathsByStage['CLEAR'].count;

    history.forEach(h => {
      const key = h.ending === 'smart_survivor' || h.ending === 'star_analyst' ? 'CLEAR' : `CH${h.chapter}`;
      deathMap[key] = (deathMap[key] || 0) + 1;
    });

    const total = Object.values(deathMap).reduce((a, b) => a + b, 0);
    const deathDistribution = Object.entries(deathMap).map(([stage, count]) => ({
      stage,
      count,
      pct: Math.round(count / total * 100),
    }));

    // Recent deaths (user's own)
    const recentDeaths = history.slice(-10).reverse().map(h => ({
      emoji: h.endingEmoji,
      title: h.endingTitle,
      chapter: h.chapter,
      score: h.score,
    }));

    return {
      totalPlays,
      rolePlays,
      clearRate,
      deathDistribution,
      recentDeaths,
      myPlays: local.plays,
      myClears: local.clears,
    };
  }

  function renderLeaderboard(role) {
    const data = getLeaderboardData(role);
    const roleLabel = role === 'founder' ? '창업자' : 'VC';

    let html = `
      <div class="lb-header">
        <div class="lb-pixel-skull">☠</div>
        <div class="lb-title">사망 통계</div>
        <div class="lb-subtitle">${data.totalPlays.toLocaleString()}명이 도전했다</div>
      </div>

      <div class="lb-clear-rate">
        <div class="lb-rate-label">${roleLabel} 클리어율</div>
        <div class="lb-rate-value">${data.clearRate}%</div>
        <div class="lb-rate-bar">
          <div class="lb-rate-fill" style="width:${Math.min(data.clearRate, 100)}%"></div>
        </div>
        <div class="lb-rate-comment">${parseFloat(data.clearRate) < 5 ? '거의 불가능에 가깝다' : parseFloat(data.clearRate) < 10 ? '소수만이 살아남았다' : '그래도 해볼 만하다'}</div>
      </div>

      <div class="lb-deaths">
        <div class="lb-section-title">어디서 죽었나?</div>
    `;

    data.deathDistribution.forEach(d => {
      const label = d.stage === 'CLEAR' ? '✨ 클리어' : `💀 ${d.stage}`;
      const barColor = d.stage === 'CLEAR' ? 'var(--success)' : 'var(--danger)';
      html += `
        <div class="lb-death-row">
          <span class="lb-death-label">${label}</span>
          <div class="lb-death-bar">
            <div class="lb-death-fill" style="width:${d.pct}%;background:${barColor}"></div>
          </div>
          <span class="lb-death-pct">${d.pct}%</span>
        </div>
      `;
    });

    html += '</div>';

    // User's recent deaths
    if (data.recentDeaths.length > 0) {
      html += '<div class="lb-recent"><div class="lb-section-title">내 전사 기록</div>';
      data.recentDeaths.forEach(d => {
        html += `<div class="lb-recent-row">${d.emoji} CH${d.chapter} — ${d.title}</div>`;
      });
      html += '</div>';
    }

    // My stats
    html += `
      <div class="lb-mystats">
        <span>내 도전: ${data.myPlays}회</span>
        <span>클리어: ${data.myClears}회</span>
      </div>
    `;

    return html;
  }

  return {
    recordDeath,
    getLeaderboardData,
    renderLeaderboard,
  };
})();
