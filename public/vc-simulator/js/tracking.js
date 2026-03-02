/**
 * GA4 Event Tracking for VC Simulator
 * Wraps gtag() with iframe-safe access + engagement ping
 */
const Tracking = (() => {
  let gameStartTime = 0;
  let choiceCount = 0;
  let engagementInterval = null;
  let currentRole = null;
  let currentDifficulty = null;
  let lastEndingId = null;

  function getGtag() {
    try {
      if (typeof gtag === 'function') return gtag;
      if (typeof parent !== 'undefined' && typeof parent.gtag === 'function') return parent.gtag;
    } catch (e) { /* cross-origin */ }
    return null;
  }

  function trackEvent(eventName, params) {
    const fn = getGtag();
    if (fn) fn('event', eventName, params);
  }

  // (1) game_start
  function gameStart(role, difficulty) {
    currentRole = role;
    currentDifficulty = difficulty || null;
    gameStartTime = Date.now();
    choiceCount = 0;
    lastEndingId = null;
    trackEvent('game_start', { role, difficulty: difficulty || 'none' });
    startEngagementTracking();
  }

  // (2) chapter_enter
  function chapterEnter(chapter) {
    trackEvent('chapter_enter', {
      role: currentRole,
      chapter,
      difficulty: currentDifficulty || 'none',
    });
  }

  // (3) choice_made
  function choiceMade(chapter, eventId, choiceIndex) {
    choiceCount++;
    trackEvent('choice_made', {
      role: currentRole,
      chapter,
      event_id: eventId,
      choice_index: choiceIndex,
      difficulty: currentDifficulty || 'none',
    });
  }

  // (4) game_over
  function gameOver(chapter, cause) {
    stopEngagementTracking();
    trackEvent('game_over', {
      role: currentRole,
      chapter,
      cause,
      difficulty: currentDifficulty || 'none',
    });
    trackEvent('game_complete', {
      role: currentRole,
      ending_id: 'game_over_' + cause,
      difficulty: currentDifficulty || 'none',
      play_time_seconds: Math.floor((Date.now() - gameStartTime) / 1000),
      total_choices: choiceCount,
    });
  }

  // (5) ending_reached + (game_complete with play time)
  function endingReached(ending, stats) {
    stopEngagementTracking();
    lastEndingId = ending.id;
    trackEvent('ending_reached', {
      role: currentRole,
      ending_id: ending.id,
      ending_name: ending.title,
      difficulty: currentDifficulty || 'none',
      final_runway: stats.runway ? stats.runway.value : undefined,
      final_mental: stats.mental ? stats.mental.value : undefined,
      final_persuasion: stats.persuasion ? stats.persuasion.value : undefined,
    });
    trackEvent('game_complete', {
      role: currentRole,
      ending_id: ending.id,
      difficulty: currentDifficulty || 'none',
      play_time_seconds: Math.floor((Date.now() - gameStartTime) / 1000),
      total_choices: choiceCount,
    });
  }

  // (6) share_click
  function shareClick(platform) {
    trackEvent('share_click', {
      role: currentRole,
      ending_id: lastEndingId || '',
      share_platform: platform,
    });
  }

  // (7) cross_route_click
  function crossRouteClick(fromRole, toRole) {
    trackEvent('cross_route_click', { from_role: fromRole, to_role: toRole });
  }

  // (8) replay_click
  function replayClick(previousEnding) {
    trackEvent('replay_click', {
      role: currentRole,
      previous_ending: previousEnding || '',
    });
  }

  // Engagement ping every 30s while playing
  function startEngagementTracking() {
    stopEngagementTracking();
    engagementInterval = setInterval(() => {
      trackEvent('engagement_ping', {
        role: currentRole,
        chapter: GameEngine ? GameEngine.getState().chapter : 0,
        elapsed_seconds: Math.floor((Date.now() - gameStartTime) / 1000),
      });
    }, 30000);
  }

  function stopEngagementTracking() {
    if (engagementInterval) {
      clearInterval(engagementInterval);
      engagementInterval = null;
    }
  }

  function getLastEndingId() { return lastEndingId; }

  return {
    gameStart,
    chapterEnter,
    choiceMade,
    gameOver,
    endingReached,
    shareClick,
    crossRouteClick,
    replayClick,
    getLastEndingId,
  };
})();
