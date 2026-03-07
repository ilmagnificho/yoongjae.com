/**
 * Enhanced GA4 Tracking for yoongjae.com
 * ─────────────────────────────────────────
 * - Content group tagging (home, writing, tools, companies, about, bts, lecture, privacy)
 * - Language dimension (ko / en)
 * - Scroll depth (25/50/75/100%)
 * - Reading time for blog posts (milestones + final)
 * - Outbound link clicks
 * - CTA / navigation clicks
 * - Share button clicks (blog, BTS)
 * - Newsletter form submissions (Stibee)
 * - Related post clicks
 * - Tool usage events (calculator, file uploads, copy, etc.)
 * - Tool engagement milestones + session end
 * - iframe postMessage bridge (cardnews, vc-simulator)
 * - BTS-specific: language switch, checklist, affiliate clicks, section views
 * - 404 detection
 * - Own traffic exclusion
 */
(function () {
  'use strict';

  // Skip analytics for the site owner
  if (localStorage.getItem('skip_analytics') === 'true') return;

  function track(event, params) {
    if (typeof gtag === 'function') gtag('event', event, params || {});
  }

  // ─── Content grouping ───────────────────────────────────────────
  var path = location.pathname.replace(/\/$/, '') || '/';
  var contentGroup = 'other';
  if (path === '/' || path === '/en') contentGroup = 'home';
  else if (path.startsWith('/writing') || path.startsWith('/en/writing')) contentGroup = 'writing';
  else if (path.startsWith('/tools') || path.startsWith('/en/tools')) contentGroup = 'tools';
  else if (path.startsWith('/companies') || path.startsWith('/en/companies')) contentGroup = 'companies';
  else if (path.startsWith('/about') || path.startsWith('/en/about')) contentGroup = 'about';
  else if (path.startsWith('/bts')) contentGroup = 'bts';
  else if (path.startsWith('/lecture')) contentGroup = 'lecture';
  else if (path.startsWith('/privacy')) contentGroup = 'privacy';

  // Set content group + language on the config
  var lang = path.startsWith('/en') ? 'en' : 'ko';
  gtag('set', { content_group: contentGroup, language: lang });

  // ─── Scroll depth tracking ──────────────────────────────────────
  var scrollMarks = { 25: false, 50: false, 75: false, 100: false };

  function getScrollPercent() {
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight <= 0) return 100;
    return Math.round((window.scrollY / docHeight) * 100);
  }

  var scrollTimer = null;
  window.addEventListener('scroll', function () {
    if (scrollTimer) return;
    scrollTimer = setTimeout(function () {
      scrollTimer = null;
      var pct = getScrollPercent();
      [25, 50, 75, 100].forEach(function (mark) {
        if (!scrollMarks[mark] && pct >= mark) {
          scrollMarks[mark] = true;
          track('scroll_depth', {
            percent: mark,
            content_group: contentGroup,
            page_path: path,
          });
        }
      });
    }, 200);
  }, { passive: true });

  // ─── Reading time (blog / writing pages) ────────────────────────
  if (contentGroup === 'writing') {
    var startTime = Date.now();
    var readingReported = {};

    function checkReadingTime() {
      var elapsed = Math.floor((Date.now() - startTime) / 1000);
      [30, 60, 120, 300].forEach(function (sec) {
        if (!readingReported[sec] && elapsed >= sec) {
          readingReported[sec] = true;
          track('reading_time', {
            seconds: sec,
            page_path: path,
          });
        }
      });
    }

    setInterval(checkReadingTime, 5000);

    // Send final reading time on page leave
    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState === 'hidden') {
        var total = Math.floor((Date.now() - startTime) / 1000);
        if (total >= 5) {
          track('reading_complete', {
            total_seconds: total,
            page_path: path,
          });
        }
      }
    });
  }

  // ─── Click tracking (outbound, nav, share, related, affiliate) ─
  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href]');
    var btn = e.target.closest('button');

    if (link) {
      var href = link.getAttribute('href') || '';

      // Outbound links
      if (href.startsWith('http') && !href.includes(location.hostname)) {
        // Coupang affiliate link tracking (BTS page)
        if (href.includes('link.coupang.com')) {
          track('affiliate_click', {
            url: href,
            link_text: (link.textContent || '').trim().substring(0, 100),
            page_path: path,
            affiliate: 'coupang',
          });
        } else {
          track('outbound_click', {
            url: href,
            link_text: (link.textContent || '').trim().substring(0, 100),
            page_path: path,
            content_group: contentGroup,
          });
        }
      }

      // Internal navigation clicks (header/footer nav)
      var nav = link.closest('header, footer, nav');
      if (nav && !href.startsWith('http')) {
        track('nav_click', {
          destination: href,
          nav_location: nav.tagName.toLowerCase(),
          page_path: path,
        });
      }

      // Related post clicks (blog pages)
      if (contentGroup === 'writing' && link.closest('section') && href.startsWith('/writing/')) {
        var isRelated = link.closest('section')?.querySelector('h2');
        if (isRelated && (isRelated.textContent || '').includes('관련')) {
          track('related_post_click', {
            destination: href,
            link_text: (link.textContent || '').trim().substring(0, 100),
            page_path: path,
          });
        }
      }
    }

    // Share button clicks (both blog ShareButtons and BTS ShareFloat)
    if (btn || link) {
      var el = btn || link;
      var action = el.getAttribute('data-action') || '';

      // Blog share buttons
      if (action === 'copy' || action === 'twitter' || action === 'linkedin') {
        track('share_click', {
          method: action,
          page_path: path,
          content_group: contentGroup,
        });
      }
    }
  });

  // ─── Newsletter form submissions (Stibee) ─────────────────────
  document.addEventListener('submit', function (e) {
    var form = e.target;
    if (!form || !form.action) return;
    if (form.action.includes('stibee.com')) {
      var emailInput = form.querySelector('input[name="email"], input[type="email"]');
      track('newsletter_signup', {
        form_location: contentGroup,
        page_path: path,
        has_email: emailInput && emailInput.value ? 'yes' : 'no',
      });
    }
  });

  // ─── Tool usage tracking ────────────────────────────────────────
  // Expose a global helper for React components to call
  window.__ga4 = {
    trackToolUse: function (toolName, action, params) {
      track('tool_use', Object.assign({
        tool_name: toolName,
        tool_action: action,
        page_path: path,
      }, params || {}));
    },
    trackEvent: track,
  };

  // Auto-detect tool interactions via common patterns
  if (contentGroup === 'tools') {
    // Track tool page engagement
    var toolStart = Date.now();
    var toolName = path.split('/').pop() || 'unknown';

    // Report engagement milestones
    var toolMilestones = {};
    setInterval(function () {
      var elapsed = Math.floor((Date.now() - toolStart) / 1000);
      [30, 60, 180, 300].forEach(function (sec) {
        if (!toolMilestones[sec] && elapsed >= sec) {
          toolMilestones[sec] = true;
          track('tool_engagement', {
            tool_name: toolName,
            seconds: sec,
          });
        }
      });
    }, 10000);

    // Track file uploads (LinkedIn Analytics, etc.)
    document.addEventListener('change', function (e) {
      if (e.target && e.target.type === 'file') {
        var files = e.target.files;
        if (files && files.length > 0) {
          track('tool_use', {
            tool_name: toolName,
            tool_action: 'file_upload',
            file_type: files[0].name.split('.').pop(),
          });
        }
      }
    });

    // Track copy-to-clipboard (PromptForge, etc.)
    document.addEventListener('copy', function () {
      track('tool_use', {
        tool_name: toolName,
        tool_action: 'copy',
      });
    });

    // Send total time on leave
    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState === 'hidden') {
        var total = Math.floor((Date.now() - toolStart) / 1000);
        if (total >= 5) {
          track('tool_session_end', {
            tool_name: toolName,
            total_seconds: total,
          });
        }
      }
    });

    // ─── iframe postMessage bridge (cardnews, vc-simulator) ──────
    if (toolName === 'cardnews' || toolName === 'vc-simulator') {
      window.addEventListener('message', function (e) {
        if (!e.data || typeof e.data !== 'object') return;
        if (e.data.type === 'ga4_event' && e.data.event) {
          track('tool_use', Object.assign({
            tool_name: toolName,
            tool_action: e.data.event,
            page_path: path,
          }, e.data.params || {}));
        }
      });
    }
  }

  // ─── BTS page tracking ────────────────────────────────────────
  if (contentGroup === 'bts') {
    var btsStart = Date.now();

    // BTS engagement milestones
    var btsMilestones = {};
    setInterval(function () {
      var elapsed = Math.floor((Date.now() - btsStart) / 1000);
      [30, 60, 180, 300, 600].forEach(function (sec) {
        if (!btsMilestones[sec] && elapsed >= sec) {
          btsMilestones[sec] = true;
          track('bts_engagement', {
            seconds: sec,
            language: new URLSearchParams(location.search).get('lang') || 'en',
          });
        }
      });
    }, 10000);

    // BTS session end
    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState === 'hidden') {
        var total = Math.floor((Date.now() - btsStart) / 1000);
        if (total >= 5) {
          track('bts_session_end', {
            total_seconds: total,
            language: new URLSearchParams(location.search).get('lang') || 'en',
          });
        }
      }
    });

    // Track BTS section views with IntersectionObserver
    var observedSections = {};
    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var sectionId = entry.target.getAttribute('data-section') ||
            entry.target.querySelector('h2')?.textContent?.trim().substring(0, 50) || 'unknown';
          if (!observedSections[sectionId]) {
            observedSections[sectionId] = true;
            track('bts_section_view', {
              section: sectionId,
              language: new URLSearchParams(location.search).get('lang') || 'en',
            });
          }
        }
      });
    }, { threshold: 0.3 });

    // Observe sections after DOM is ready
    setTimeout(function () {
      document.querySelectorAll('[data-animate]').forEach(function (el) {
        sectionObserver.observe(el);
      });
    }, 1000);
  }

  // ─── Lecture page tracking ────────────────────────────────────
  if (contentGroup === 'lecture') {
    var lectureStart = Date.now();
    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState === 'hidden') {
        var total = Math.floor((Date.now() - lectureStart) / 1000);
        if (total >= 5) {
          track('lecture_session_end', {
            total_seconds: total,
            page_path: path,
          });
        }
      }
    });
  }

  // ─── 404 detection ──────────────────────────────────────────────
  if (document.title.includes('404') || document.querySelector('[data-404]')) {
    track('page_not_found', {
      page_path: path,
      referrer: document.referrer,
    });
  }

})();
