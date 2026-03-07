/**
 * 8-bit Sound Effects via Web Audio API
 * Procedurally generated retro game sounds
 */
const GameAudio = (() => {
  let ctx = null;
  let enabled = true;

  function getCtx() {
    if (!ctx) {
      try {
        ctx = new (window.AudioContext || window.webkitAudioContext)();
      } catch (e) {
        enabled = false;
      }
    }
    return ctx;
  }

  function resume() {
    const c = getCtx();
    if (c && c.state === 'suspended') c.resume();
  }

  // Play a sequence of tones
  function playTones(notes, type, volume) {
    if (!enabled) return;
    const c = getCtx();
    if (!c) return;

    const gain = c.createGain();
    gain.gain.value = volume || 0.15;
    gain.connect(c.destination);

    let time = c.currentTime;
    notes.forEach(([freq, dur]) => {
      const osc = c.createOscillator();
      osc.type = type || 'square';
      osc.frequency.value = freq;
      osc.connect(gain);
      osc.start(time);
      osc.stop(time + dur);
      time += dur;
    });

    // Fade out at end
    gain.gain.setValueAtTime(volume || 0.15, time - 0.02);
    gain.gain.linearRampToValueAtTime(0, time);
  }

  // === SOUND EFFECTS ===

  function select() {
    playTones([[660, 0.06], [880, 0.08]], 'square', 0.1);
  }

  function confirm() {
    playTones([[523, 0.08], [659, 0.08], [784, 0.1]], 'square', 0.12);
  }

  function statUp() {
    playTones([[440, 0.06], [554, 0.06], [659, 0.08]], 'square', 0.1);
  }

  function statDown() {
    playTones([[440, 0.06], [349, 0.06], [262, 0.1]], 'square', 0.1);
  }

  function chapterStart() {
    playTones([
      [392, 0.12], [440, 0.12], [523, 0.12], [659, 0.18]
    ], 'square', 0.12);
  }

  function gameOver() {
    playTones([
      [440, 0.15], [415, 0.15], [392, 0.15], [349, 0.2],
      [330, 0.25], [262, 0.4]
    ], 'square', 0.15);
  }

  function ending() {
    playTones([
      [523, 0.1], [659, 0.1], [784, 0.1], [1047, 0.15],
      [784, 0.08], [1047, 0.25]
    ], 'triangle', 0.12);
  }

  function typing() {
    if (!enabled) return;
    const c = getCtx();
    if (!c) return;
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = 'square';
    osc.frequency.value = 600 + Math.random() * 200;
    gain.gain.value = 0.03;
    osc.connect(gain);
    gain.connect(c.destination);
    osc.start();
    osc.stop(c.currentTime + 0.02);
  }

  function toggle() {
    enabled = !enabled;
    return enabled;
  }

  function isEnabled() {
    return enabled;
  }

  // Listen for first user interaction to unlock audio context
  document.addEventListener('click', resume, { once: true });
  document.addEventListener('touchstart', resume, { once: true });

  return {
    select, confirm, statUp, statDown,
    chapterStart, gameOver, ending, typing,
    toggle, isEnabled, resume,
  };
})();
