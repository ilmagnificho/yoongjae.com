/**
 * Share System - Result card canvas generation + SNS sharing
 */
const ShareSystem = (() => {
  let lastEnding = null;

  function generateCard(ending) {
    lastEnding = ending;
    const canvas = document.getElementById('share-canvas');
    const ctx = canvas.getContext('2d');

    const W = 600;
    const H = 1000;
    canvas.width = W;
    canvas.height = H;

    const isSuccess = ending.id === 'smart_survivor' || ending.id === 'star_analyst';
    const accentColor = isSuccess ? '#00b894' : '#6c5ce7';

    // Background
    ctx.fillStyle = '#0a0a1a';
    ctx.fillRect(0, 0, W, H);

    // Border
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 3;
    ctx.strokeRect(10, 10, W - 20, H - 20);

    // Inner glow border
    ctx.strokeStyle = isSuccess ? 'rgba(0, 184, 148, 0.3)' : 'rgba(108, 92, 231, 0.3)';
    ctx.lineWidth = 1;
    ctx.strokeRect(16, 16, W - 32, H - 32);

    // Title
    ctx.fillStyle = accentColor;
    ctx.font = 'bold 22px "Noto Sans KR", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('투자 못 받는 시뮬레이터', W / 2, 55);

    ctx.fillStyle = '#888';
    ctx.font = '14px "Noto Sans KR", sans-serif';
    ctx.fillText('EP.1 - Pre-A 라운드', W / 2, 80);

    // Divider
    drawDivider(ctx, 98, W);

    // Role
    const roleLabel = ending.role === 'founder' ? '창업자 루트' : 'VC 루트';
    ctx.fillStyle = '#aaa';
    ctx.font = '16px "Noto Sans KR", sans-serif';
    ctx.fillText(roleLabel, W / 2, 126);

    // Ending emoji (large)
    ctx.font = '72px serif';
    ctx.fillText(ending.emoji, W / 2, 206);

    // Ending title
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 32px "Noto Sans KR", sans-serif';
    ctx.fillText(ending.title, W / 2, 258);

    // Subtitle
    ctx.fillStyle = accentColor;
    ctx.font = '18px "Noto Sans KR", sans-serif';
    ctx.fillText(`"${ending.subtitle}"`, W / 2, 292);

    // Description
    ctx.fillStyle = '#bbb';
    ctx.font = '15px "Noto Sans KR", sans-serif';
    const descLines = wrapText(ctx, ending.description, W / 2, 335, W - 120, 24);
    let y = 335 + descLines * 24 + 16;

    // Divider
    drawDivider(ctx, y, W);
    y += 30;

    // Stats (text-based, matching the ending screen)
    ctx.textAlign = 'left';
    const stats = ending.stats;
    for (const key in stats) {
      const s = stats[key];
      const pct = s.value / s.max;
      const displayValue = s.unit === '개월' ? `${s.value}${s.unit}`
        : s.unit === '억' ? `${s.value}${s.unit}`
        : `${s.value}${s.unit || ''}`;

      let statusLabel = '';
      let statColor = '#ccc';
      if (pct <= 0.15) { statusLabel = ' (위험!)'; statColor = '#ff3838'; }
      else if (pct <= 0.3) { statusLabel = ' (주의)'; statColor = '#fdcb6e'; }

      ctx.fillStyle = statColor;
      ctx.font = '17px "Noto Sans KR", sans-serif';
      ctx.fillText(`${s.icon} ${s.label}: ${displayValue}${statusLabel}`, 60, y);
      y += 32;
    }

    y += 8;

    // Divider
    drawDivider(ctx, y, W);
    y += 28;

    // Quote
    ctx.textAlign = 'center';
    ctx.fillStyle = '#fd79a8';
    ctx.font = 'italic 14px "Noto Sans KR", sans-serif';
    const quoteLines = wrapText(ctx, `"${ending.quote}"`, W / 2, y, W - 100, 22);
    y += quoteLines * 22 + 20;

    // Failure/Success message
    if (!isSuccess) {
      // Failure box
      ctx.strokeStyle = '#e17055';
      ctx.lineWidth = 1;
      ctx.setLineDash([6, 4]);
      ctx.strokeRect(50, y - 4, W - 100, 44);
      ctx.setLineDash([]);

      ctx.fillStyle = '#e17055';
      ctx.font = '14px "Noto Sans KR", sans-serif';
      ctx.fillText('당신은 다수의 편에 섰습니다.', W / 2, y + 17);
      ctx.fillText('96.6%의 창업자가 여기서 쓰러졌습니다.', W / 2, y + 36);
      y += 60;
    } else {
      ctx.strokeStyle = '#00b894';
      ctx.lineWidth = 1;
      ctx.strokeRect(50, y - 4, W - 100, 34);

      ctx.fillStyle = '#00b894';
      ctx.font = 'bold 14px "Noto Sans KR", sans-serif';
      ctx.fillText('✨ 당신은 상위 3.4%입니다. 실화입니까?', W / 2, y + 20);
      y += 50;
    }

    // CTA
    ctx.fillStyle = accentColor;
    ctx.font = 'bold 16px "Noto Sans KR", sans-serif';
    ctx.fillText('나도 도전하기 →', W / 2, Math.min(y + 10, H - 30));

    // Resize canvas to actual content height if needed
    const actualH = Math.min(y + 40, H);
    if (actualH < H) {
      const imgData = ctx.getImageData(0, 0, W, actualH);
      canvas.height = actualH;
      ctx.putImageData(imgData, 0, 0);
      // Redraw bottom border
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(10, actualH - 10);
      ctx.lineTo(W - 10, actualH - 10);
      ctx.stroke();
    }

    // Download
    downloadCanvas(canvas);
  }

  function drawDivider(ctx, y, W) {
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(50, y);
    ctx.lineTo(W - 50, y);
    ctx.stroke();
  }

  function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const chars = text.split('');
    let line = '';
    let lines = [];

    for (let i = 0; i < chars.length; i++) {
      const testLine = line + chars[i];
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && line.length > 0) {
        lines.push(line);
        line = chars[i];
      } else {
        line = testLine;
      }
    }
    lines.push(line);

    lines.forEach((l, idx) => {
      ctx.fillText(l, x, y + idx * lineHeight);
    });

    return lines.length;
  }

  function downloadCanvas(canvas) {
    const link = document.createElement('a');
    link.download = 'investment-simulator-result.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  }

  function getShareText() {
    if (!lastEnding) return '';
    const roleLabel = lastEnding.role === 'founder' ? '창업자' : 'VC';
    return `${lastEnding.emoji} 투자 못 받는 시뮬레이터 - ${roleLabel} 루트\n결과: ${lastEnding.title}\n"${lastEnding.subtitle}"\n클리어율 3.4% | 나도 도전하기 →`;
  }

  function shareToX() {
    const text = encodeURIComponent(getShareText());
    const url = encodeURIComponent(window.location.href);
    window.open(`https://x.com/intent/tweet?text=${text}&url=${url}`, '_blank');
  }

  function shareToKakao() {
    // Fallback: copy to clipboard for Kakao share
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
