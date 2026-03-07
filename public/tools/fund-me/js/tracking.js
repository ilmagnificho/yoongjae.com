/**
 * GA4 Event Tracking for Fund Me If You Can
 * Wraps gtag() with standalone page access + engagement ping
 */
const Tracking = (() => {
  let gameStartTime = 0;
  let choiceCount = 0;
  let engagementInterval = null;
  let currentRole = null;
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

  function gameStart(role) {
    currentRole = role;
    gameStartTime = Date.now();
    choiceCount = 0;
    lastEndingId = null;
    trackEvent('game_start', {
      game: 'fund_me',
      role,
    });
    startEngagementTracking();
  }

  function chapterEnter(chapter) {
    trackEvent('chapter_enter', {
      game: 'fund_me',
      role: currentRole,
      chapter,
    });
  }

  function choiceMade(chapter, eventId, choiceIndex, choiceText) {
    choiceCount++;
    trackEvent('choice_made', {
      game: 'fund_me',
      role: currentRole,
      chapter,
      event_id: eventId,
      choice_index: choiceIndex,
      choice_text: (choiceText || '').substring(0, 100),
    });
  }

  function gameOver(chapter, cause) {
    stopEngagementTracking();
    trackEvent('game_over', {
      game: 'fund_me',
      role: currentRole,
      chapter,
      cause,
    });
    trackEvent('game_complete', {
      game: 'fund_me',
      role: currentRole,
      ending_id: 'game_over_' + cause,
      play_time_seconds: Math.floor((Date.now() - gameStartTime) / 1000),
      total_choices: choiceCount,
    });
  }

  function endingReached(ending, stats) {
    stopEngagementTracking();
    lastEndingId = ending.id || ending.name;
    trackEvent('ending_reached', {
      game: 'fund_me',
      role: currentRole,
      ending_id: ending.id || ending.name,
      ending_name: ending.name,
    });
    trackEvent('game_complete', {
      game: 'fund_me',
      role: currentRole,
      ending_id: ending.id || ending.name,
      play_time_seconds: Math.floor((Date.now() - gameStartTime) / 1000),
      total_choices: choiceCount,
    });
  }

  function shareClick(platform) {
    trackEvent('share_click', {
      game: 'fund_me',
      role: currentRole,
      ending_id: lastEndingId || '',
      share_platform: platform,
    });
  }

  function crossRouteClick(fromRole, toRole) {
    trackEvent('cross_route_click', {
      game: 'fund_me',
      from_role: fromRole,
      to_role: toRole,
    });
  }

  function replayClick(previousEnding) {
    trackEvent('replay_click', {
      game: 'fund_me',
      role: currentRole,
      previous_ending: previousEnding || '',
    });
  }

  function startEngagementTracking() {
    stopEngagementTracking();
    engagementInterval = setInterval(() => {
      trackEvent('engagement_ping', {
        game: 'fund_me',
        role: currentRole,
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
