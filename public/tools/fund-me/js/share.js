/**
 * Share Module - Result card canvas generation + SNS sharing
 */
const ShareModule = (() => {
  const CARD_W = 600;
  const CARD_H = 800;

  /**
   * Generate a result card image as a canvas
   */
  function generateCard(ending, statDefs) {
    const canvas = document.createElement('canvas');
    canvas.width = CARD_W;
    canvas.height = CARD_H;
    const ctx = canvas.getContext('2d');

    // Background
    const bg = ctx.createLinearGradient(0, 0, 0, CARD_H);
    bg.addColorStop(0, '#0a0a1e');
    bg.addColorStop(0.5, '#0f0f2a');
    bg.addColorStop(1, '#0a0a0f');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, CARD_W, CARD_H);

    // Subtle accent glow
    const isFounder = ending.role === 'founder';
    const accentColor = isFounder ? '#FF4444' : '#6644FF';
    const glowGrad = ctx.createRadialGradient(CARD_W / 2, 200, 0, CARD_W / 2, 200, 300);
    glowGrad.addColorStop(0, isFounder ? 'rgba(255,68,68,0.08)' : 'rgba(102,68,255,0.08)');
    glowGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = glowGrad;
    ctx.fillRect(0, 0, CARD_W, CARD_H);

    // Border
    ctx.strokeStyle = '#444';
    ctx.lineWidth = 3;
    ctx.strokeRect(8, 8, CARD_W - 16, CARD_H - 16);

    // Header
    ctx.fillStyle = '#888';
    ctx.font = '14px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('FUND ME IF YOU CAN', CARD_W / 2, 60);

    // Ending emoji
    ctx.font = '64px serif';
    ctx.fillText(ending.emoji, CARD_W / 2, 150);

    // Ending name
    ctx.fillStyle = accentColor;
    ctx.font = 'bold 22px "Press Start 2P", monospace';
    const nameLines = wrapText(ctx, ending.name, CARD_W - 80);
    let nameY = 200;
    nameLines.forEach(line => {
      ctx.fillText(line, CARD_W / 2, nameY);
      nameY += 32;
    });

    // Ending description
    ctx.fillStyle = '#ccc';
    ctx.font = '16px sans-serif';
    const descLines = wrapText(ctx, '"' + ending.description + '"', CARD_W - 100);
    let descY = nameY + 16;
    descLines.forEach(line => {
      ctx.fillText(line, CARD_W / 2, descY);
      descY += 24;
    });

    // Stat bars
    let barY = descY + 30;
    ctx.textAlign = 'left';
    statDefs.forEach(def => {
      const val = ending.stats[def.key] || 0;
      const pct = Math.max(0, Math.min(100, val));

      // Emoji + value
      ctx.font = '16px sans-serif';
      ctx.fillStyle = '#aaa';
      ctx.fillText(def.emoji + ' ' + def.label, 60, barY);

      ctx.font = '12px "Press Start 2P", monospace';
      ctx.fillStyle = '#fff';
      ctx.textAlign = 'right';
      ctx.fillText(String(val), CARD_W - 60, barY);
      ctx.textAlign = 'left';

      // Bar track
      const barX = 60;
      const barW = CARD_W - 120;
      const barH = 12;
      barY += 8;

      ctx.fillStyle = '#1a1a2e';
      ctx.fillRect(barX, barY, barW, barH);

      // Bar fill
      ctx.fillStyle = def.color.startsWith('var(')
        ? getComputedColor(def.key)
        : def.color;
      ctx.fillRect(barX, barY, barW * (pct / 100), barH);

      // Bar border
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 1;
      ctx.strokeRect(barX, barY, barW, barH);

      barY += 28;
    });

    // Quote
    barY += 10;
    ctx.fillStyle = accentColor;
    ctx.fillRect(58, barY, 3, 60);

    ctx.fillStyle = '#888';
    ctx.font = 'italic 14px sans-serif';
    ctx.textAlign = 'left';
    const quoteLines = wrapText(ctx, '"' + ending.quote + '"', CARD_W - 140);
    let qY = barY + 16;
    quoteLines.forEach(line => {
      ctx.fillText(line, 72, qY);
      qY += 22;
    });

    // Footer
    ctx.fillStyle = '#555';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('yoongjae.com/tools/fund-me', CARD_W / 2, CARD_H - 40);

    ctx.fillStyle = '#333';
    ctx.font = '10px sans-serif';
    ctx.fillText('This game is fiction and unrelated to real persons/companies.', CARD_W / 2, CARD_H - 20);

    return canvas;
  }

  function getComputedColor(key) {
    const colorMap = {
      hype: '#FF4444',
      credibility: '#44AAFF',
      product: '#44FF88',
      conviction: '#FFD700',
      reputation: '#6644FF',
      diligence: '#44FFCC',
    };
    return colorMap[key] || '#888';
  }

  function wrapText(ctx, text, maxWidth) {
    const lines = [];
    let line = '';
    for (const char of text) {
      const test = line + char;
      if (ctx.measureText(test).width > maxWidth && line.length > 0) {
        lines.push(line);
        line = char;
      } else {
        line = test;
      }
    }
    if (line) lines.push(line);
    return lines;
  }

  /**
   * Download the card as PNG
   */
  function downloadCard(canvas) {
    const link = document.createElement('a');
    link.download = 'fund-me-result.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  }

  /**
   * Share via Web Share API (mobile) or fallback to clipboard
   */
  async function shareResult(ending) {
    const shareText = `[Fund Me If You Can] ${ending.emoji} ${ending.name}\n"${ending.description}"\n\nyoongjae.com/tools/fund-me`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Fund Me If You Can',
          text: shareText,
        });
        return true;
      } catch (e) {
        // User cancelled or error
      }
    }

    // Fallback: copy to clipboard
    return copyToClipboard(shareText);
  }

  /**
   * Copy text to clipboard
   */
  async function copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (e) {
      // Fallback for older browsers
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.left = '-9999px';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
      return true;
    }
  }

  /**
   * Share to X (Twitter)
   */
  function shareToX(ending) {
    const text = encodeURIComponent(
      `[Fund Me If You Can] ${ending.emoji} ${ending.name}\n"${ending.description}"\n\n`
    );
    const url = encodeURIComponent('https://yoongjae.com/tools/fund-me');
    window.open(`https://x.com/intent/tweet?text=${text}&url=${url}`, '_blank');
  }

  return { generateCard, downloadCard, shareResult, shareToX, copyToClipboard };
})();
