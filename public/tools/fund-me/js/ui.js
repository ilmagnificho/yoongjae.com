/**
 * Fund Me If You Can - UI Rendering
 * Title screen, role selection, event display, typing effect, stat bars
 */
const GameUI = (() => {
  const container = document.getElementById('game-container');
  let typingTimeout = null;
  let isTyping = false;
  let skipTyping = false;
  let lastChapter = 0;

  function init() {
    showTitleScreen();
  }

  // ===== TITLE SCREEN =====
  function showTitleScreen() {
    GameEngine.reset();
    container.innerHTML = `
      <div class="title-screen fade-in">
        <div class="title-main">FUND ME<br>IF YOU CAN</div>
        <div class="title-sub">실패하면 사기, 성공하면 비전</div>
        <div class="title-tagline">실리콘밸리 최대 논란 AI 스타트업의<br>실화 기반 풍자 텍스트 RPG</div>
        <div class="role-select">
          <button class="role-card founder" id="btn-founder">
            <div class="role-emoji">🧑‍💻</div>
            <div class="role-name">Founder: Roi Kim</div>
            <div class="role-quote">"세상은 규칙을 깨는 사람이 바꾼다. 아니면 감옥에 간다."</div>
            <div class="role-difficulty">난이도: ★★★★★ (줄타기)</div>
          </button>
          <button class="role-card vc" id="btn-vc">
            <div class="role-emoji">🧑‍💼</div>
            <div class="role-name">VC: Byron Park</div>
            <div class="role-quote">"모멘텀이 해자다. 다만 해자 안에 뭐가 있는지는 나중에 안다."</div>
            <div class="role-difficulty">난이도: ★★★☆☆ (남의 돈이니까)</div>
          </button>
        </div>
        <div class="disclaimer">이 게임은 픽션이며, 실제 인물/기업/사건과 무관합니다.</div>
      </div>
    `;

    document.getElementById('btn-founder').addEventListener('click', () => startGame('founder'));
    document.getElementById('btn-vc').addEventListener('click', () => startGame('vc'));
  }

  // ===== START GAME =====
  function startGame(role) {
    // Set CSS accent based on role
    const root = document.documentElement;
    if (role === 'founder') {
      root.style.setProperty('--accent', 'var(--founder-main)');
      root.style.setProperty('--accent-sub', 'var(--founder-sub)');
    } else {
      root.style.setProperty('--accent', 'var(--vc-main)');
      root.style.setProperty('--accent-sub', 'var(--vc-sub)');
    }

    GameEngine.selectRole(role);
    lastChapter = 0;

    const state = GameEngine.getState();
    if (state.phase === 'playing' && state.currentEvent) {
      showChapterTitle(state.currentEvent.chapter, state.currentEvent.title, () => {
        renderGameScreen();
      });
    }
  }

  // ===== CHAPTER TITLE =====
  function showChapterTitle(chapter, title, callback) {
    lastChapter = chapter;
    const overlay = document.createElement('div');
    overlay.className = 'chapter-title-overlay';
    overlay.innerHTML = `<div class="chapter-title-text">${title || '챕터 ' + chapter}</div>`;
    document.body.appendChild(overlay);

    setTimeout(() => {
      overlay.remove();
      if (callback) callback();
    }, 2500);
  }

  // ===== GAME SCREEN =====
  function renderGameScreen() {
    const state = GameEngine.getState();
    const event = state.currentEvent;

    if (!event) {
      showEndingScreen();
      return;
    }

    container.innerHTML = `
      <div class="game-screen">
        <div class="stat-bar-container" id="stat-bars"></div>
        <div class="event-area" id="event-area"></div>
        <div class="choices-container" id="choices-area"></div>
      </div>
    `;

    renderStatBars();
    playEvent(event);
  }

  // ===== STAT BARS =====
  function renderStatBars() {
    const state = GameEngine.getState();
    const statDefs = GameEngine.getStatDefs();
    const statsEl = document.getElementById('stat-bars');
    if (!statsEl) return;

    statsEl.innerHTML = '';
    statDefs.forEach(def => {
      const val = state.stats[def.key] || 0;
      const pct = Math.max(0, Math.min(100, val));
      const item = document.createElement('div');
      item.className = 'stat-item';
      item.id = `stat-${def.key}`;
      item.innerHTML = `
        <div class="stat-label">
          <span class="stat-emoji">${def.emoji}</span>
          <span class="stat-value">${val}</span>
        </div>
        <div class="stat-track">
          <div class="stat-fill" style="width:${pct}%;background:${def.color}"></div>
        </div>
      `;
      statsEl.appendChild(item);
    });
  }

  // ===== PLAY EVENT =====
  async function playEvent(event) {
    const area = document.getElementById('event-area');
    if (!area) return;
    area.innerHTML = '';

    // Show narration
    if (event.narration) {
      const narBox = document.createElement('div');
      narBox.className = 'narration-box fade-in';
      narBox.addEventListener('click', () => { if (isTyping) skipTyping = true; });
      area.appendChild(narBox);
      await typeText(narBox, event.narration);
      await delay(300);
    }

    // Show dialogue
    if (event.speaker && event.text) {
      const dBox = document.createElement('div');
      dBox.className = 'dialogue-box fade-in';
      dBox.innerHTML = `
        <div class="dialogue-portrait">${event.speaker.emoji}</div>
        <div class="dialogue-content">
          <div class="dialogue-speaker">${event.speaker.name}</div>
          <div class="dialogue-text" id="dialogue-text"></div>
        </div>
      `;
      area.appendChild(dBox);

      // Click to skip typing
      dBox.addEventListener('click', () => {
        if (isTyping) skipTyping = true;
      });

      const textEl = dBox.querySelector('#dialogue-text');
      await typeText(textEl, event.text);
      await delay(300);
    }

    // Show choices
    showChoices(event);
  }

  // ===== SHOW CHOICES =====
  function showChoices(event) {
    const choicesArea = document.getElementById('choices-area');
    if (!choicesArea) return;
    choicesArea.innerHTML = '';

    const state = GameEngine.getState();

    let visibleIdx = 0;
    event.choices.forEach((choice, actualIdx) => {
      // Check choice-level conditions
      if (choice.condition) {
        const hasFlag = state.flags.includes(choice.condition.flag);
        const pass = choice.condition.negate ? !hasFlag : hasFlag;
        if (!pass) return;
      }

      const btn = document.createElement('button');
      btn.className = 'choice-btn fade-in';
      btn.style.animationDelay = `${visibleIdx * 0.08}s`;

      const label = String.fromCharCode(65 + visibleIdx);
      btn.textContent = `${label}) ${choice.text}`;
      btn.addEventListener('click', () => handleChoice(actualIdx));
      choicesArea.appendChild(btn);
      visibleIdx++;
    });
  }

  // ===== HANDLE CHOICE =====
  async function handleChoice(choiceIndex) {
    const outcome = GameEngine.makeChoice(choiceIndex);
    if (!outcome) return;

    // Hide choices
    const choicesArea = document.getElementById('choices-area');
    if (choicesArea) choicesArea.innerHTML = '';

    // Show stat effects
    if (outcome.effects && Object.keys(outcome.effects).length > 0) {
      showStatEffects(outcome.effects);
      renderStatBars();
    }

    // Show result text
    if (outcome.resultText) {
      await showResult(outcome.resultText, outcome.resultSpeaker);
    }

    // Proceed
    const next = GameEngine.proceedAfterResult();

    if (next.type === 'gameover') {
      await delay(300);
      showGameOverScreen(next.stat);
      return;
    }

    if (next.type === 'ending') {
      await delay(300);
      showEndingScreen();
      return;
    }

    if (next.type === 'newChapter') {
      showChapterTitle(next.chapter, next.title, () => {
        renderGameScreen();
      });
      return;
    }

    // Continue to next event
    renderGameScreen();
  }

  // ===== SHOW RESULT =====
  function showResult(text, speaker) {
    return new Promise((resolve) => {
      const area = document.getElementById('event-area');
      if (!area) { resolve(); return; }

      const box = document.createElement('div');
      box.className = 'result-box fade-in';
      box.innerHTML = `
        <div class="result-speaker">${speaker.emoji} ${speaker.name}</div>
        <div class="result-text" id="result-text"></div>
      `;
      area.appendChild(box);

      // Click to skip typing on the result box
      box.addEventListener('click', () => {
        if (isTyping) skipTyping = true;
      });

      const textEl = box.querySelector('#result-text');

      typeText(textEl, text).then(() => {
        const btn = document.createElement('button');
        btn.className = 'continue-btn fade-in';
        btn.textContent = '계속...';
        btn.addEventListener('click', () => resolve());
        area.appendChild(btn);
      });
    });
  }

  // ===== STAT EFFECTS POPUP =====
  function showStatEffects(effects) {
    const statDefs = GameEngine.getStatDefs();

    for (const [key, delta] of Object.entries(effects)) {
      if (delta === 0) continue;
      const def = statDefs.find(s => s.key === key);
      if (!def) continue;

      const statEl = document.getElementById(`stat-${key}`);
      if (!statEl) continue;

      const popup = document.createElement('div');
      popup.className = `stat-popup ${delta > 0 ? 'positive' : 'negative'}`;
      popup.textContent = `${delta > 0 ? '+' : ''}${delta} ${def.emoji}`;
      statEl.appendChild(popup);

      setTimeout(() => popup.remove(), 1200);
    }
  }

  // ===== SHOW RESULT EFFECTS TEXT =====
  function formatEffectsText(effects) {
    const statDefs = GameEngine.getStatDefs();
    const parts = [];
    for (const [key, delta] of Object.entries(effects)) {
      if (delta === 0) continue;
      const def = statDefs.find(s => s.key === key);
      if (!def) continue;
      parts.push(`${def.emoji} ${delta > 0 ? '+' : ''}${delta}`);
    }
    return parts.join('  ');
  }

  // ===== GAME OVER SCREEN =====
  function showGameOverScreen(stat) {
    const statDefs = GameEngine.getStatDefs();
    const def = statDefs.find(s => s.key === stat);
    const statName = def ? def.label : stat;

    container.innerHTML = `
      <div class="gameover-screen fade-in">
        <div class="gameover-title">GAME OVER</div>
        <div class="ending-emoji">💀</div>
        <div class="gameover-reason">${statName}이(가) 0에 도달했습니다.<br>업계에서 퇴출당했습니다.</div>
        <div class="ending-quote" style="border-left-color:var(--accent)">
          "${EndingsEngine.QUOTES[Math.floor(Math.random() * EndingsEngine.QUOTES.length)]}"
        </div>
        <div class="ending-actions">
          <button class="ending-btn primary" id="btn-retry">다시 도전하기</button>
          <button class="ending-btn" id="btn-title">타이틀로 돌아가기</button>
        </div>
        <div class="disclaimer" style="margin-top:16px">이 게임은 픽션이며, 실제 인물/기업/사건과 무관합니다.</div>
      </div>
    `;

    document.getElementById('btn-retry').addEventListener('click', () => {
      const state = GameEngine.getState();
      startGame(state.role);
    });
    document.getElementById('btn-title').addEventListener('click', showTitleScreen);
  }

  // ===== ENDING SCREEN =====
  function showEndingScreen() {
    const ending = GameEngine.getEnding();
    if (!ending) return;

    const state = GameEngine.getState();
    const statDefs = GameEngine.getStatDefs();
    const otherRole = state.role === 'founder' ? 'vc' : 'founder';
    const otherLabel = state.role === 'founder'
      ? '투자자는 당신을 어떻게 봤을까? → VC 루트 도전하기'
      : '창업자에게도 사정이 있었다면? → Founder 루트 도전하기';

    let statsHtml = '';
    statDefs.forEach(def => {
      const val = ending.stats[def.key] || 0;
      const pct = Math.max(0, Math.min(100, val));
      statsHtml += `
        <div class="ending-stat-row">
          <span class="ending-stat-emoji">${def.emoji}</span>
          <div class="ending-stat-track">
            <div class="ending-stat-fill" style="width:${pct}%;background:${def.color}"></div>
          </div>
          <span class="ending-stat-value">${val}</span>
        </div>
      `;
    });

    container.innerHTML = `
      <div class="ending-screen fade-in">
        <div class="ending-emoji">${ending.emoji}</div>
        <div class="ending-name">${ending.name}</div>
        <div class="ending-description">${ending.description}</div>
        <div class="ending-stats">${statsHtml}</div>
        <div class="ending-quote" style="border-left-color:var(--accent)">
          "${ending.quote}"
        </div>
        <div class="ending-actions">
          <button class="ending-btn primary" id="btn-other-route">${otherLabel}</button>
          <button class="ending-btn" id="btn-retry">같은 루트 다시 도전하기</button>
          <button class="ending-btn" id="btn-title">타이틀로 돌아가기</button>
          <button class="ending-btn" id="btn-vc-sim">한국 스타트업 버전도 있습니다 → VC Simulator</button>
        </div>
        <div class="disclaimer" style="margin-top:16px">이 게임은 픽션이며, 실제 인물/기업/사건과 무관합니다.</div>
      </div>
    `;

    document.getElementById('btn-other-route').addEventListener('click', () => startGame(otherRole));
    document.getElementById('btn-retry').addEventListener('click', () => startGame(state.role));
    document.getElementById('btn-title').addEventListener('click', showTitleScreen);
    document.getElementById('btn-vc-sim').addEventListener('click', () => {
      window.location.href = '/vc-simulator/';
    });
  }

  // ===== TYPING EFFECT =====
  function typeText(element, text) {
    return new Promise((resolve) => {
      skipTyping = false;
      isTyping = true;

      let i = 0;
      const speed = 25;

      function type() {
        if (skipTyping) {
          element.textContent = text;
          isTyping = false;
          resolve();
          return;
        }
        if (i < text.length) {
          element.textContent = text.substring(0, i + 1);
          i++;
          typingTimeout = setTimeout(type, speed);
        } else {
          isTyping = false;
          resolve();
        }
      }
      type();
    });
  }

  function delay(ms) {
    return new Promise(r => setTimeout(r, ms));
  }

  // ===== INIT ON LOAD =====
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  return { showTitleScreen, startGame };
})();
