/**
 * OG Image Generator for Fund Me If You Can
 * Generates 1200x630 PNG matching the game's visual style
 */
const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

const W = 1200, H = 630;
const canvas = createCanvas(W, H);
const ctx = canvas.getContext('2d');

// ── Color palette (from sprites.js) ──
const C = {
  _: null,
  K: '#1a1a2e',
  W: '#f0e6d3',
  S: '#d4a574',
  D: '#8b6914',
  H: '#2a2a2a',
  R: '#c0392b',
  B: '#2980b9',
  N: '#2c3e50',
  I: '#ecf0f1',
  T: '#34495e',
  Y: '#f39c12',
};

// ── Sprite data ──
const roiPixels = [
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
];

const byronPixels = [
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
];

// ── 1. Checkered background ──
const sq = 30;
for (let y = 0; y < H; y += sq) {
  for (let x = 0; x < W; x += sq) {
    const even = ((x / sq) + (y / sq)) % 2 === 0;
    ctx.fillStyle = even ? '#2a2a2e' : '#323236';
    ctx.fillRect(x, y, sq, sq);
  }
}

// ── 2. Yellow top & bottom border ──
ctx.fillStyle = '#f5c518';
ctx.fillRect(0, 0, W, 6);
ctx.fillRect(0, H - 6, W, 6);

// ── 3. Title: "Fund Me If You Can" ──
ctx.fillStyle = '#ffffff';
ctx.font = 'bold 72px "Arial Black", "Helvetica Neue", Arial, sans-serif';
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
ctx.fillText('Fund Me If You Can', W / 2, 75);

// ── 4. Subtitle: "실패하면 사기, 성공하면 비전" ──
ctx.fillStyle = '#ffffff';
ctx.font = 'bold 36px "Apple SD Gothic Neo", "Malgun Gothic", "Noto Sans KR", sans-serif';
ctx.fillText('실패하면 사기, 성공하면 비전', W / 2, 145);

// ── 5. "BLUFF ON EVERYTHING" ──
ctx.fillStyle = '#f5c518';
ctx.font = 'bold 22px "Courier New", monospace';
ctx.fillText('BLUFF ON EVERYTHING', W / 2, 200);

// Red underline
const bluffW = ctx.measureText('BLUFF ON EVERYTHING').width;
ctx.strokeStyle = '#c0392b';
ctx.lineWidth = 3;
ctx.beginPath();
ctx.moveTo((W - bluffW) / 2, 215);
ctx.lineTo((W + bluffW) / 2, 215);
ctx.stroke();

// ── 6. Render sprites ──
function drawSprite(pixels, cx, cy, scale) {
  pixels.forEach((row, py) => {
    for (let px = 0; px < row.length; px++) {
      const key = row[px];
      if (key === '_' || key === ' ') continue;
      const color = C[key];
      if (!color) continue;
      ctx.fillStyle = color;
      ctx.fillRect(cx + px * scale, cy + py * scale, scale, scale);
    }
  });
}

const spriteScale = 7;
const spriteW = 16 * spriteScale;
const spriteH = 16 * spriteScale;
const founderX = 340 - spriteW / 2;
const investorX = 860 - spriteW / 2;
const spriteY = 270;

// Yellow pedestal under founder
ctx.fillStyle = '#f5c518';
ctx.fillRect(founderX + 10, spriteY + spriteH - 10, spriteW - 20, 14);

drawSprite(roiPixels, founderX, spriteY, spriteScale);
drawSprite(byronPixels, investorX, spriteY, spriteScale);

// ── 7. VS text ──
ctx.fillStyle = '#7ec850';
ctx.font = 'bold 48px "Arial Black", "Helvetica Neue", Arial, sans-serif';
ctx.textAlign = 'center';
ctx.fillText('VS', W / 2, 350);

// ── 8. Role labels ──
ctx.font = 'bold 20px "Courier New", monospace';
ctx.fillStyle = '#f5c518';
ctx.fillText('FOUNDER', 340, spriteY + spriteH + 30);
ctx.fillStyle = '#aabbcc';
ctx.fillText('INVESTOR', 860, spriteY + spriteH + 30);

// ── 9. Purple/blue dots on sides ──
const dotColor = '#5544cc';
const dotR = 4;
for (let i = 0; i < 9; i++) {
  const dy = 250 + i * 30;
  // Left dots
  ctx.fillStyle = dotColor;
  ctx.beginPath();
  ctx.arc(40, dy, dotR, 0, Math.PI * 2);
  ctx.fill();
  // Right dots
  ctx.beginPath();
  ctx.arc(W - 40, dy, dotR, 0, Math.PI * 2);
  ctx.fill();
}

// ── 10. Footer URL ──
ctx.fillStyle = '#999999';
ctx.font = '18px "Courier New", monospace';
ctx.textAlign = 'center';
ctx.fillText('yoongjae.com/tools/fund-me', W / 2, 555);

// ── 11. Disclaimer ──
ctx.fillStyle = '#555555';
ctx.font = '12px sans-serif';
ctx.fillText('* 이 게임은 픽션이며 실제 인물/기업/사건과 무관합니다.', W / 2, 590);

// ── Save ──
const out = path.join(__dirname, '..', 'og-image.png');
const buf = canvas.toBuffer('image/png');
fs.writeFileSync(out, buf);
console.log('Generated:', out, '(' + buf.length + ' bytes)');
