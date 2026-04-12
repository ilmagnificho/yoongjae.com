import { useState, useRef, useCallback } from 'react';
import type { CardData, CardSettings } from './types';
import { THEMES, DEFAULT_THEME } from './themes';
import { createDefaultCard, createDefaultSettings } from './utils';
import CardPreview, { CARD_W, CARD_H } from './CardPreview';
import EditorPanel from './EditorPanel';
import ImageSearchModal from './ImageSearchModal';

declare global {
  interface Window {
    __ga4?: { trackToolUse: (tool: string, action: string, params?: Record<string, unknown>) => void };
  }
}

export default function CardNewsEditor() {
  const [cardCount, setCardCount] = useState(5);
  const [cards, setCards] = useState<CardData[]>(() =>
    Array.from({ length: 5 }, (_, i) => createDefaultCard(i))
  );
  const [settings, setSettings] = useState<CardSettings>(createDefaultSettings);
  const [themeKey, setThemeKey] = useState(DEFAULT_THEME);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [selectedTextBlockId, setSelectedTextBlockId] = useState<string | null>(null);
  const [imageSearchOpen, setImageSearchOpen] = useState(false);
  const [setupDone, setSetupDone] = useState(false);
  const [pendingCardCount, setPendingCardCount] = useState(5);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const theme = THEMES[themeKey] || THEMES[DEFAULT_THEME];

  const updateCard = useCallback((index: number, updated: CardData) => {
    setCards((prev) => prev.map((c, i) => (i === index ? updated : c)));
  }, []);

  const handleCardCountChange = useCallback((count: number) => {
    const clamped = Math.max(1, Math.min(15, count));
    setCardCount(clamped);
    setCards((prev) => {
      if (clamped > prev.length) {
        return [...prev, ...Array.from({ length: clamped - prev.length }, (_, i) => createDefaultCard(prev.length + i))];
      }
      return prev.slice(0, clamped);
    });
    if (activeCardIndex >= clamped) setActiveCardIndex(clamped - 1);
  }, [activeCardIndex]);

  const handleImageSelect = useCallback((url: string) => {
    setCards((prev) => prev.map((c, i) => (i === activeCardIndex ? { ...c, bgImage: url } : c)));
  }, [activeCardIndex]);

  const handleDownloadCard = useCallback(async (index: number) => {
    const el = cardRefs.current[index];
    if (!el) return;
    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(el, {
        width: CARD_W,
        height: CARD_H,
        scale: 1,
        useCORS: true,
        allowTaint: true,
        backgroundColor: theme.bg,
      });
      const link = document.createElement('a');
      link.download = `card_${index + 1}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Download failed:', err);
    }
  }, [theme.bg]);

  const handleDownloadAll = useCallback(async () => {
    for (let i = 0; i < cards.length; i++) {
      await handleDownloadCard(i);
      await new Promise((r) => setTimeout(r, 500));
    }
  }, [cards.length, handleDownloadCard]);

  const startSetup = () => {
    handleCardCountChange(pendingCardCount);
    setSetupDone(true);
    window.__ga4?.trackToolUse('cardnews', 'start', { cardCount: pendingCardCount, theme: themeKey });
  };

  // Setup screen
  if (!setupDone) {
    return (
      <div style={{ minHeight: '100vh', background: '#111113', color: '#e5e5e5', fontFamily: '"Pretendard Variable", Pretendard, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ background: '#1a1a1a', borderRadius: 20, padding: 40, width: 480, maxWidth: '90vw' }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8, color: '#fff' }}>CardNews Studio</h1>
          <p style={{ fontSize: 14, color: '#888', marginBottom: 32 }}>카드뉴스를 만들어보세요. 아래 설정을 먼저 해주세요.</p>

          {/* Card count */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ fontSize: 13, color: '#aaa', display: 'block', marginBottom: 8 }}>카드 수 (1~15)</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <button onClick={() => setPendingCardCount((p) => Math.max(1, p - 1))} style={{ width: 40, height: 40, background: '#333', border: 'none', color: '#fff', borderRadius: 8, fontSize: 20, cursor: 'pointer' }}>−</button>
              <span style={{ fontSize: 32, fontWeight: 800, color: '#fff', minWidth: 50, textAlign: 'center' }}>{pendingCardCount}</span>
              <button onClick={() => setPendingCardCount((p) => Math.min(15, p + 1))} style={{ width: 40, height: 40, background: '#333', border: 'none', color: '#fff', borderRadius: 8, fontSize: 20, cursor: 'pointer' }}>+</button>
            </div>
          </div>

          {/* Theme */}
          <div style={{ marginBottom: 32 }}>
            <label style={{ fontSize: 13, color: '#aaa', display: 'block', marginBottom: 8 }}>테마</label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {Object.entries(THEMES).map(([key, t]) => (
                <button
                  key={key}
                  onClick={() => setThemeKey(key)}
                  style={{
                    padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontSize: 13,
                    background: themeKey === key ? t.accent : '#222',
                    color: themeKey === key ? (t.tagText || '#000') : '#ccc',
                    border: themeKey === key ? `2px solid ${t.accent}` : '2px solid #333',
                    fontWeight: themeKey === key ? 700 : 400,
                  }}
                >
                  {t.name}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={startSetup}
            style={{ width: '100%', padding: '14px 0', background: theme.accent, color: theme.tagText, border: 'none', borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: 'pointer' }}
          >
            시작하기
          </button>
        </div>
      </div>
    );
  }

  // Main editor
  return (
    <div style={{ minHeight: '100vh', background: '#111113', color: '#e5e5e5', fontFamily: '"Pretendard Variable", Pretendard, sans-serif' }}>
      {/* Top bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 24px', borderBottom: '1px solid #222', background: '#161616' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <h1 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: '#fff' }}>CardNews Studio</h1>
          <span style={{ fontSize: 12, color: '#666' }}>카드 {activeCardIndex + 1} / {cards.length}</span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {/* Card count adjuster */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: '#222', borderRadius: 6, padding: '4px 8px' }}>
            <span style={{ fontSize: 11, color: '#888', marginRight: 4 }}>카드 수</span>
            <button onClick={() => handleCardCountChange(cardCount - 1)} style={{ width: 24, height: 24, background: '#333', border: 'none', color: '#fff', borderRadius: 4, cursor: 'pointer', fontSize: 14 }}>−</button>
            <span style={{ fontSize: 13, fontWeight: 600, minWidth: 24, textAlign: 'center' }}>{cardCount}</span>
            <button onClick={() => handleCardCountChange(cardCount + 1)} style={{ width: 24, height: 24, background: '#333', border: 'none', color: '#fff', borderRadius: 4, cursor: 'pointer', fontSize: 14 }}>+</button>
          </div>
          {/* Theme selector */}
          <select
            value={themeKey}
            onChange={(e) => setThemeKey(e.target.value)}
            style={{ background: '#222', border: '1px solid #444', borderRadius: 6, padding: '4px 8px', color: '#fff', fontSize: 12, cursor: 'pointer' }}
          >
            {Object.entries(THEMES).map(([key, t]) => (
              <option key={key} value={key}>{t.name}</option>
            ))}
          </select>
          <button onClick={handleDownloadAll} style={{ background: theme.accent, color: theme.tagText, border: 'none', borderRadius: 6, padding: '6px 16px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
            전체 다운로드
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', height: 'calc(100vh - 52px)' }}>
        {/* Card strip (left) */}
        <div style={{ width: 120, background: '#161616', borderRight: '1px solid #222', overflowY: 'auto', padding: 8 }}>
          {cards.map((card, i) => (
            <div
              key={card.id}
              onClick={() => { setActiveCardIndex(i); setSelectedTextBlockId(null); }}
              style={{
                marginBottom: 8, cursor: 'pointer', borderRadius: 8, overflow: 'hidden',
                border: activeCardIndex === i ? `2px solid ${theme.accent}` : '2px solid transparent',
                position: 'relative',
              }}
            >
              <div style={{ pointerEvents: 'none' }}>
                <CardPreview card={card} settings={settings} theme={theme} scale={0.09} />
              </div>
              <div style={{ position: 'absolute', bottom: 4, left: 0, right: 0, textAlign: 'center', fontSize: 10, color: '#888' }}>{i + 1}</div>
            </div>
          ))}
        </div>

        {/* Center preview */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'auto', padding: 24, background: '#0d0d0d' }}>
          <div style={{ position: 'relative' }}>
            <CardPreview
              ref={(el) => { cardRefs.current[activeCardIndex] = el; }}
              card={cards[activeCardIndex]}
              settings={settings}
              theme={theme}
              scale={0.55}
              onTextBlockClick={setSelectedTextBlockId}
              selectedTextBlockId={selectedTextBlockId}
            />
            {/* Download single card */}
            <button
              onClick={() => handleDownloadCard(activeCardIndex)}
              style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.6)', border: 'none', color: '#fff', padding: '6px 12px', borderRadius: 6, fontSize: 11, cursor: 'pointer' }}
            >
              ↓ 다운로드
            </button>
          </div>
        </div>

        {/* Right editor panel */}
        <EditorPanel
          card={cards[activeCardIndex]}
          settings={settings}
          selectedTextBlockId={selectedTextBlockId}
          onCardChange={(updated) => updateCard(activeCardIndex, updated)}
          onSettingsChange={setSettings}
          onSelectTextBlock={setSelectedTextBlockId}
          onSearchImages={() => setImageSearchOpen(true)}
        />
      </div>

      <ImageSearchModal
        open={imageSearchOpen}
        onClose={() => setImageSearchOpen(false)}
        onSelect={handleImageSelect}
        accentColor={settings.accentColor}
      />
    </div>
  );
}
