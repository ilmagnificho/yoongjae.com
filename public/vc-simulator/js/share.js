/**
 * Share System - Result card canvas generation + SNS sharing
 * v2: Difficulty / score / grade support
 */
const ShareSystem = (() => {
  let lastEnding = null;
  let lastScore  = 0;
  let lastGrade  = null;

  function generateCard(ending, score, grade) {
    lastEnding = ending;
    lastScore  = score  || 0;
    lastGrade  = grade  || null;

    const canvas = document.getElementById('share-canvas');
    const ctx = canvas.getContext('2d');

    const W = 600;
    const H = 880;
    canvas.width  = W;
    canvas.height = H;

    const isSuccess  = GameEngine.isSuccessEnding(ending.id);
    const accentColor = isSuccess ? '#00b894' : '#6c5ce7';

    // Background
    ctx.fillStyle = '#0a0a1a';
    ctx.fillRect(0, 0, W, H);

    // Border
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 3;
    ctx.strokeRect(10, 10, W - 20, H - 20);

    // === HEADER ===
    const diffLabels = { easy: 'Seed Round [EASY]', normal: 'Series A [NORMAL]', hard: 'Series B [HARD]' };
    const diffLabel  = ending.difficulty ? (diffLabels[ending.difficulty] || '') : '';
    const headerText = diffLabel
      ? `투자 못 받는 시뮬레이터  |  ${diffLabel}`
      : '투자 못 받는 시뮬레이터  |  EP.1 Pre-A';

    ctx.fillStyle  = '#666';
    ctx.font       = '13px "Noto Sans KR", sans-serif';
    ctx.textAlign  = 'center';
    ctx.fillText(headerText, W / 2, 42);

    const roleLabel = ending.role === 'founder' ? '창업자 루트' : 'VC 루트';
    ctx.fillStyle = '#888';
    ctx.font      = '14px "Noto Sans KR", sans-serif';
    ctx.fillText(roleLabel, W / 2, 72);

    ctx.font = '48px serif';
    ctx.fillText(ending.emoji, W / 2, 130);

    ctx.fillStyle = '#fff';
    ctx.font      = 'bold 26px "Noto Sans KR", sans-serif';
    ctx.fillText(ending.title, W / 2, 170);

    ctx.fillStyle = accentColor;
    ctx.font      = '16px "Noto Sans KR", sans-serif';
    ctx.fillText(`"${ending.subtitle}"`, W / 2, 198);

    drawDivider(ctx, 218, W);

    // === QUOTE ===
    const quoteY    = 240;
    const quoteText = ending.quote;

    ctx.font = 'bold 22px "Noto Sans KR", sans-serif';
    const qLines     = measureWrap(ctx, quoteText, W - 120);
    const quoteBlockH = qLines * 34 + 60;

    ctx.fillStyle = '#120f24';
    roundRect(ctx, 26, quoteY - 14, W - 52, quoteBlockH, 16);
    ctx.fill();

    ctx.fillStyle = '#fd79a8';
    ctx.fillRect(26, quoteY + 6, 4, quoteBlockH - 40);

    ctx.fillStyle = 'rgba(253, 121, 168, 0.15)';
    ctx.font      = 'bold 80px serif';
    ctx.textAlign = 'left';
    ctx.fillText('\u201C', 38, quoteY + 58);
    ctx.textAlign = 'right';
    ctx.fillText('\u201D', W - 38, quoteY + quoteBlockH - 30);

    ctx.fillStyle = '#fd79a8';
    ctx.font      = 'bold 22px "Noto Sans KR", sans-serif';
    ctx.textAlign = 'center';
    wrapText(ctx, quoteText, W / 2, quoteY + 30, W - 130, 34);

    let y = quoteY + quoteBlockH + 16;

    drawDivider(ctx, y, W);
    y += 24;

    // === SCORE / GRADE (success only) ===
    if (isSuccess && lastScore > 0 && lastGrade) {
      ctx.fillStyle = '#00b894';
      ctx.font      = 'bold 20px "Noto Sans KR", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`${lastGrade.badge} ${lastGrade.label}  ·  ${lastScore.toLocaleString()}점`, W / 2, y);
      y += 32;
      drawDivider(ctx, y, W);
      y += 24;
    }

    // === STATS ===
    ctx.textAlign = 'left';
    const stats = ending.stats;
    for (const key in stats) {
      const s = stats[key];
      const pct = s.value / s.max;
      const displayValue = s.unit === '개월' ? `${s.value}${s.unit}`
        : s.unit === '억' ? `${s.value}${s.unit}`
        : `${s.value}${s.unit || ''}`;

      let statColor   = '#999';
      let statusLabel = '';
      if (pct <= 0.15) { statusLabel = ' (위험!)'; statColor = '#ff3838'; }
      else if (pct <= 0.3) { statusLabel = ' (주의)'; statColor = '#fdcb6e'; }

      ctx.fillStyle = statColor;
      ctx.font      = '15px "Noto Sans KR", sans-serif';
      ctx.fillText(`${s.icon} ${s.label}: ${displayValue}${statusLabel}`, 60, y);
      y += 26;
    }

    y += 12;

    // === FOOTER ===
    ctx.textAlign = 'center';
    if (!isSuccess) {
      ctx.fillStyle = '#e17055';
      ctx.font      = '13px "Noto Sans KR", sans-serif';
      ctx.fillText('대다수의 창업자가 여기서 쓰러졌습니다', W / 2, y);
      y += 26;
    } else {
      ctx.fillStyle = '#00b894';
      ctx.font      = 'bold 14px "Noto Sans KR", sans-serif';
      ctx.fillText('클리어 달성!', W / 2, y);
      y += 26;
    }

    ctx.fillStyle = accentColor;
    ctx.font      = 'bold 15px "Noto Sans KR", sans-serif';
    ctx.fillText('나도 도전하기 → vc-vs-founder.vercel.app', W / 2, y);
    y += 20;

    // Resize canvas to actual content
    const actualH = y + 20;
    const imgData = ctx.getImageData(0, 0, W, actualH);
    canvas.height = actualH;
    ctx.putImageData(imgData, 0, 0);

    // Redraw bottom border
    ctx.strokeStyle = accentColor;
    ctx.lineWidth   = 3;
    ctx.beginPath();
    ctx.moveTo(10, actualH - 10);
    ctx.lineTo(W - 10, actualH - 10);
    ctx.lineTo(W - 10, 10);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(10, actualH - 10);
    ctx.lineTo(10, 10);
    ctx.stroke();

    downloadCanvas(canvas);
  }

  // ===== Canvas helpers =====
  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  function measureWrap(ctx, text, maxWidth) {
    const chars = text.split('');
    let line  = '';
    let count = 1;
    for (let i = 0; i < chars.length; i++) {
      const testLine = line + chars[i];
      if (ctx.measureText(testLine).width > maxWidth && line.length > 0) {
        count++;
        line = chars[i];
      } else {
        line = testLine;
      }
    }
    return count;
  }

  function drawDivider(ctx, y, W) {
    ctx.strokeStyle = '#333';
    ctx.lineWidth   = 1;
    ctx.beginPath();
    ctx.moveTo(50, y);
    ctx.lineTo(W - 50, y);
    ctx.stroke();
  }

  function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const chars = text.split('');
    let line  = '';
    const lines = [];

    for (let i = 0; i < chars.length; i++) {
      const testLine = line + chars[i];
      if (ctx.measureText(testLine).width > maxWidth && line.length > 0) {
        lines.push(line);
        line = chars[i];
      } else {
        line = testLine;
      }
    }
    lines.push(line);
    lines.forEach((l, idx) => ctx.fillText(l, x, y + idx * lineHeight));
    return lines.length;
  }

  function downloadCanvas(canvas) {
    const link = document.createElement('a');
    link.download = 'investment-simulator-result.png';
    link.href     = canvas.toDataURL('image/png');
    link.click();
  }

  // ===== Share text =====
  function getShareText() {
    if (!lastEnding) return '';
    const roleLabel  = lastEnding.role === 'founder' ? '창업자' : 'VC';
    const diffShort  = { easy: 'Seed', normal: 'Series A', hard: 'Series B' };
    const diffStr    = lastEnding.difficulty ? ` [${diffShort[lastEnding.difficulty] || ''}]` : '';
    const scoreStr   = (lastScore > 0 && lastGrade)
      ? `\n점수: ${lastScore.toLocaleString()}점 (${lastGrade.badge} ${lastGrade.label})`
      : '';
    return `${lastEnding.emoji} 투자 못 받는 시뮬레이터 - ${roleLabel}${diffStr} 루트\n결과: ${lastEnding.title}${scoreStr}\n"${lastEnding.subtitle}"\n나도 도전하기 →`;
  }

  function shareToX() {
    const text = encodeURIComponent(getShareText());
    const url  = encodeURIComponent(window.location.href);
    window.open(`https://x.com/intent/tweet?text=${text}&url=${url}`, '_blank');
  }

  function shareToKakao() {
    const text = getShareText() + '\n' + window.location.href;
    navigator.clipboard.writeText(text).then(() => {
      alert('클립보드에 복사되었습니다! 카카오톡에 붙여넣기 해주세요.');
    }).catch(() => {
      prompt('아래 텍스트를 복사해주세요:', text);
    });
  }

  function shareToLinkedIn() {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
  }

  function copyLink() {
    navigator.clipboard.writeText(window.location.href).then(() => {
      alert('링크가 복사되었습니다!');
    }).catch(() => {
      prompt('아래 링크를 복사해주세요:', window.location.href);
    });
  }

  return {
    generateCard,
    shareToX,
    shareToKakao,
    shareToLinkedIn,
    copyLink,
  };
})();
