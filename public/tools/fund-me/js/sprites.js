/**
 * Pixel Sprite Renderer - Canvas-based character portraits
 * 16x16 pixel art characters rendered on canvas
 */
const Sprites = (() => {
  const SPRITE_SIZE = 16;
  const RENDER_SCALE = 5; // Each pixel = 5x5 on screen

  // Color palette
  const C = {
    _: null,           // transparent
    K: '#1a1a2e',      // dark/black
    W: '#f0e6d3',      // white/skin light
    S: '#d4a574',      // skin medium
    D: '#8b6914',      // skin dark / hair brown
    H: '#2a2a2a',      // hair black
    R: '#c0392b',      // red
    B: '#2980b9',      // blue
    G: '#27ae60',      // green
    Y: '#f39c12',      // yellow/gold
    P: '#8e44ad',      // purple
    T: '#34495e',      // dark gray (suit)
    L: '#95a5a6',      // light gray
    O: '#e67e22',      // orange
    N: '#2c3e50',      // navy
    I: '#ecf0f1',      // ice white
  };

  // 16x16 pixel art character definitions
  // Each row is a string of 16 color keys
  const SPRITES = {
    roi: {
      label: 'Roi Kim',
      pixels: [
        '____HHHHHH______',
        '___HHHHHHHHH____',
        '___HHHHHHHHH____',
        '___HSSSSSSSH____',
        '___SWWWWWWWS____',
        '___SWKWWWKWS____',
        '___SSWWWWWSS____',
        '____SWRRWS______',
        '____SSWWSS______',
        '_____KKKK_______',
        '____KNNNNK______',
        '___KNNNNNK______',
        '___KNNNNNNK_____',
        '___KNNNNNNK_____',
        '____KK__KK______',
        '____KK__KK______',
      ],
    },
    neil: {
      label: 'Neil Sharma',
      pixels: [
        '____HHHHHH______',
        '___HHHHHHHH_____',
        '___HHHHHHHHH____',
        '___HDDDDDDDH____',
        '___DWWWWWWD_____',
        '___DWKWWWKWD____',
        '___DDWWWWWDD____',
        '____DWWWWD______',
        '____DDWWDD______',
        '_____KKKK_______',
        '____KTTTTK______',
        '___KTTTTTTK_____',
        '___KTTITTTTK____',
        '___KTTTTTTK_____',
        '____KK__KK______',
        '____KK__KK______',
      ],
    },
    byron: {
      label: 'Byron Park',
      pixels: [
        '____HHHHHH______',
        '___HHHHHHHH_____',
        '___HHHHHHHHH____',
        '___HSSSSSSH_____',
        '___SWWWWWWS_____',
        '___SWKWWWKWS____',
        '___SSWWWWWSS____',
        '____SWWWWS______',
        '____SSWWSS______',
        '_____KKKK_______',
        '____KNNNK_______',
        '___KNIINNK______',
        '___KNNNNNK______',
        '___KNNNNNNK_____',
        '____KK__KK______',
        '____KK__KK______',
      ],
    },
    gp: {
      label: 'GP',
      pixels: [
        '____LLLLLL______',
        '___LLLLLLLL_____',
        '___LLLLLLLLL____',
        '___LSSSSSSSL____',
        '___SWWWWWWS_____',
        '___SWKWWWKWS____',
        '___SSWWWWWSS____',
        '____SWWWWS______',
        '____SSWWSS______',
        '_____KKKK_______',
        '____KTTTTK______',
        '___KTTTTTTK_____',
        '___KTTITTTTK____',
        '___KTTTTTTK_____',
        '____KK__KK______',
        '____KK__KK______',
      ],
    },
    reporter: {
      label: 'Reporter',
      pixels: [
        '____DDDDDD______',
        '___DDDDDDDD_____',
        '___DDDDDDDDD____',
        '___DWWWWWWWD____',
        '___WWWWWWWW_____',
        '___WWKWWWKWW____',
        '___WWWWWWWWW____',
        '____WWWWWW______',
        '____WWRRWW______',
        '_____KKKK_______',
        '____KRRRRK______',
        '___KRRRRRK______',
        '___KRRRRRRK_____',
        '___KRRRRRRK_____',
        '____KK__KK______',
        '____KK__KK______',
      ],
    },
    colleague: {
      label: 'Colleague',
      pixels: [
        '____HHHHHH______',
        '___HHHHHHHH_____',
        '___HHHHHHHHH____',
        '___HSSSSSSH_____',
        '___SWWWWWWS_____',
        '___SWKWWWKWS____',
        '___SSWWWWWSS____',
        '____SWWWWS______',
        '____SSWWSS______',
        '_____KKKK_______',
        '____KBBBBK______',
        '___KBBIBBK______',
        '___KBBBBBBK_____',
        '___KBBBBBBK_____',
        '____KK__KK______',
        '____KK__KK______',
      ],
    },
    marketing: {
      label: 'Marketing',
      pixels: [
        '____DDDDDD______',
        '___DDDDDDDDD____',
        '___DDDDDDDDD____',
        '___DWWWWWWWD____',
        '___WWWWWWWW_____',
        '___WWKWWWKWW____',
        '___WWWWWWWWW____',
        '____WWWWWW______',
        '____WWRRWW______',
        '_____KKKK_______',
        '____KOOOOK______',
        '___KOOOOOOK_____',
        '___KOOOOOOK_____',
        '___KOOOOOOK_____',
        '____KK__KK______',
        '____KK__KK______',
      ],
    },
    seedvc: {
      label: 'Seed VC',
      pixels: [
        '____HHHHHH______',
        '___HHHHHHHH_____',
        '___HHHHHHHHH____',
        '___HSSSSSSH_____',
        '___SWWWWWWS_____',
        '___SWKWWWKWS____',
        '___SSWWWWWSS____',
        '____SWWRWS______',
        '____SSWWSS______',
        '_____KKKK_______',
        '____KTTTTK______',
        '___KYYTTTTK_____',
        '___KTTTTTTK_____',
        '___KTTTTTTK_____',
        '____KK__KK______',
        '____KK__KK______',
      ],
    },
    narrator: {
      label: 'Narrator',
      pixels: [
        '____PPPPPP______',
        '___PPPPPPPP_____',
        '___PPPPPPPPP____',
        '___PIIIIIIIP____',
        '___IWWWWWWI_____',
        '___IWKWWWKWI____',
        '___IIWWWWWII____',
        '____IWWWWI______',
        '____IIWWII______',
        '_____PPPP_______',
        '____PPPPP_______',
        '___PPPPPPPP_____',
        '___PPPPPPPP_____',
        '___PPPPPPPP_____',
        '____PP__PP______',
        '____PP__PP______',
      ],
    },
    campus: {
      label: 'Campus Office',
      pixels: [
        '____LLLLLL______',
        '___LLLLLLLL_____',
        '___LLLLLLLLL____',
        '___LSSSSSSSL____',
        '___SWWWWWWS_____',
        '___SLKWWWKLS____',
        '___SSWWWWWSS____',
        '____SWWWWS______',
        '____SSWWSS______',
        '_____KKKK_______',
        '____KGGGGK______',
        '___KGGGGGK______',
        '___KGGGGGGK_____',
        '___KGGGGGGK_____',
        '____KK__KK______',
        '____KK__KK______',
      ],
    },
  };

  /**
   * Render a sprite to a canvas element
   * @param {string} spriteKey - Key from SPRITES
   * @returns {HTMLCanvasElement|null}
   */
  function render(spriteKey) {
    const sprite = SPRITES[spriteKey];
    if (!sprite) return null;

    const canvas = document.createElement('canvas');
    const w = SPRITE_SIZE * RENDER_SCALE;
    canvas.width = w;
    canvas.height = w;
    canvas.style.imageRendering = 'pixelated';
    canvas.style.width = (SPRITE_SIZE * RENDER_SCALE) + 'px';
    canvas.style.height = (SPRITE_SIZE * RENDER_SCALE) + 'px';

    const ctx = canvas.getContext('2d');

    sprite.pixels.forEach((row, y) => {
      for (let x = 0; x < row.length && x < SPRITE_SIZE; x++) {
        const colorKey = row[x];
        if (colorKey === '_' || colorKey === ' ') continue;
        const color = C[colorKey];
        if (!color) continue;
        ctx.fillStyle = color;
        ctx.fillRect(x * RENDER_SCALE, y * RENDER_SCALE, RENDER_SCALE, RENDER_SCALE);
      }
    });

    return canvas;
  }

  /**
   * Check if a sprite key exists
   */
  function has(spriteKey) {
    return !!SPRITES[spriteKey];
  }

  return { render, has };
})();
