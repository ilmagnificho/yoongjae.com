import { useState, useRef, useCallback } from 'react';
import type { CardData, CardSettings } from './types';
import { THEMES, DEFAULT_THEME } from './themes';
import { createDefaultCard, createDefaultSettings, generateCardsFromText, aiResultToCardData, TONE_OPTIONS } from './utils';
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
  const [rawText, setRawText] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [tone, setTone] = useState('professional');
  const [generating, setGenerating] = useState(false);
  const [genError, setGenError] = useState('');
  // cardRefs no longer needed - download renders hidden full-size card

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

  const handleFileUpload = useCallback((dataUrl: string) => {
    setCards((prev) => prev.map((c, i) => (i === activeCardIndex ? { ...c, bgImage: dataUrl } : c)));
  }, [activeCardIndex]);

  // Save/Load
  const SAVE_KEY = 'cn_project';
  const saveProject = useCallback(() => {
    try {
      const data = JSON.stringify({ settings, cards, cardCount, themeKey });
      localStorage.setItem(SAVE_KEY, data);
      alert('저장되었습니다.');
    } catch {
      alert('저장 실패');
    }
  }, [settings, cards, cardCount, themeKey]);

  const loadProject = useCallback(() => {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) { alert('저장된 프로젝트가 없습니다.'); return; }
      const data = JSON.parse(raw);
      if (data.cards) setCards(data.cards);
      if (data.settings) setSettings(data.settings);
      if (data.cardCount) setCardCount(data.cardCount);
      if (data.themeKey) setThemeKey(data.themeKey);
      setActiveCardIndex(0);
      alert('불러오기 완료');
    } catch {
      alert('불러오기 실패');
    }
  }, []);

  const exportJson = useCallback(() => {
    const data = JSON.stringify({ settings, cards, cardCount, themeKey }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const link = document.createElement('a');
    link.download = 'cardnews_project.json';
    link.href = URL.createObjectURL(blob);
    link.click();
    URL.revokeObjectURL(link.href);
  }, [settings, cards, cardCount, themeKey]);

  const importJson = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result as string);
        if (data.cards) setCards(data.cards);
        if (data.settings) setSettings(data.settings);
        if (data.cardCount) setCardCount(data.cardCount);
        if (data.themeKey) setThemeKey(data.themeKey);
        setActiveCardIndex(0);
      } catch { alert('파일 형식이 올바르지 않습니다.'); }
    };
    reader.readAsText(file);
    e.target.value = '';
  }, []);

  const handleDownloadCard = useCallback(async (index: number) => {
    // Render a hidden full-size card for capture (scale=1, no transform)
    const container = document.createElement('div');
    container.style.cssText = 'position:fixed;left:-9999px;top:0;z-index:-1;';
    document.body.appendChild(container);
    try {
      const { createRoot } = await import('react-dom/client');
      const root = createRoot(container);
      await new Promise<void>((resolve) => {
        root.render(
          <CardPreview card={cards[index]} settings={settings} theme={theme} scale={1} />
        );
        setTimeout(resolve, 300);
      });
      const el = container.firstElementChild as HTMLElement;
      if (!el) return;
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
      root.unmount();
    } catch (err) {
      console.error('Download failed:', err);
    } finally {
      document.body.removeChild(container);
    }
  }, [cards, settings, theme]);

  const handleDownloadAll = useCallback(async () => {
    for (let i = 0; i < cards.length; i++) {
      await handleDownloadCard(i);
      await new Promise((r) => setTimeout(r, 500));
    }
  }, [cards.length, handleDownloadCard]);

  const startManual = () => {
    handleCardCountChange(pendingCardCount);
    setSetupDone(true);
    window.__ga4?.trackToolUse('cardnews', 'start_manual', { cardCount: pendingCardCount, theme: themeKey });
  };

  const startWithAI = async () => {
    if (!apiKey.trim()) { setGenError('API 키를 입력해주세요.'); return; }
    if (!rawText.trim()) { setGenError('텍스트를 입력해주세요.'); return; }
    setGenerating(true);
    setGenError('');
    try {
      const result = await generateCardsFromText(rawText, apiKey.trim(), pendingCardCount, tone);
      const generatedCards = aiResultToCardData(result.cards);
      setCards(generatedCards);
      setCardCount(generatedCards.length);
      setSettings((prev) => ({ ...prev, seriesName: result.seriesTitle }));
      setSetupDone(true);
      window.__ga4?.trackToolUse('cardnews', 'start_ai', { cardCount: generatedCards.length, theme: themeKey });
    } catch (err: any) {
      setGenError(err.message || 'AI 생성 중 오류가 발생했습니다.');
    } finally {
      setGenerating(false);
    }
  };

  // Setup screen
  if (!setupDone) {
    return (
      <div style={{ minHeight: '100vh', background: '#111113', color: '#e5e5e5', fontFamily: '"Pretendard Variable", Pretendard, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ background: '#1a1a1a', borderRadius: 20, padding: 40, width: 480, maxWidth: '90vw' }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8, color: '#fff' }}>CardNews Studio</h1>
          <p style={{ fontSize: 14, color: '#888', marginBottom: 24 }}>텍스트를 붙여넣으면 AI가 자동으로 카드를 만들어줍니다.</p>

          {/* AI Text Input */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 13, color: '#aaa', display: 'block', marginBottom: 6 }}>원문 텍스트 (기사, 에세이, 메모 등)</label>
            <textarea
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder="카드뉴스로 만들고 싶은 텍스트를 붙여넣으세요..."
              rows={8}
              style={{ width: '100%', background: '#222', border: '1px solid #444', borderRadius: 8, padding: 12, color: '#fff', fontSize: 13, fontFamily: 'inherit', resize: 'vertical', lineHeight: 1.6 }}
            />
          </div>

          {/* API Key */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 13, color: '#aaa', display: 'block', marginBottom: 6 }}>Anthropic API Key</label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-ant-..."
              style={{ width: '100%', background: '#222', border: '1px solid #444', borderRadius: 8, padding: '10px 12px', color: '#fff', fontSize: 13 }}
            />
            <p style={{ fontSize: 11, color: '#666', marginTop: 4 }}>키는 브라우저에만 저장되며 서버로 전송되지 않습니다.</p>
          </div>

          {/* Card count + Tone + Theme row */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 12, color: '#aaa', display: 'block', marginBottom: 6 }}>카드 수</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button onClick={() => setPendingCardCount((p) => Math.max(1, p - 1))} style={{ width: 32, height: 32, background: '#333', border: 'none', color: '#fff', borderRadius: 6, fontSize: 18, cursor: 'pointer' }}>-</button>
                <span style={{ fontSize: 20, fontWeight: 700, color: '#fff', minWidth: 30, textAlign: 'center' }}>{pendingCardCount}</span>
                <button onClick={() => setPendingCardCount((p) => Math.min(15, p + 1))} style={{ width: 32, height: 32, background: '#333', border: 'none', color: '#fff', borderRadius: 6, fontSize: 18, cursor: 'pointer' }}>+</button>
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 12, color: '#aaa', display: 'block', marginBottom: 6 }}>톤</label>
              <select value={tone} onChange={(e) => setTone(e.target.value)} style={{ width: '100%', background: '#222', border: '1px solid #444', borderRadius: 6, padding: '8px', color: '#fff', fontSize: 12 }}>
                {TONE_OPTIONS.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
          </div>

          {/* Theme */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 12, color: '#aaa', display: 'block', marginBottom: 6 }}>테마</label>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {Object.entries(THEMES).map(([key, t]) => (
                <button
                  key={key}
                  onClick={() => setThemeKey(key)}
                  style={{
                    padding: '6px 14px', borderRadius: 6, cursor: 'pointer', fontSize: 12,
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

          {/* Error message */}
          {genError && (
            <div style={{ padding: '10px 14px', background: '#2a1a1a', border: '1px solid #4a2020', borderRadius: 8, color: '#ff6b6b', fontSize: 12, marginBottom: 16 }}>
              {genError}
            </div>
          )}

          {/* Buttons */}
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={startWithAI}
              disabled={generating}
              style={{ flex: 2, padding: '14px 0', background: generating ? '#555' : theme.accent, color: theme.tagText, border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: generating ? 'wait' : 'pointer', opacity: generating ? 0.7 : 1 }}
            >
              {generating ? 'AI 생성 중...' : 'AI로 자동 생성'}
            </button>
            <button
              onClick={startManual}
              style={{ flex: 1, padding: '14px 0', background: '#333', color: '#ccc', border: '1px solid #555', borderRadius: 12, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
            >
              수동 편집
            </button>
          </div>
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
          {/* Save/Load */}
          <button onClick={saveProject} style={{ background: '#333', border: '1px solid #555', color: '#ccc', borderRadius: 6, padding: '6px 12px', fontSize: 11, cursor: 'pointer' }}>
            저장
          </button>
          <button onClick={loadProject} style={{ background: '#333', border: '1px solid #555', color: '#ccc', borderRadius: 6, padding: '6px 12px', fontSize: 11, cursor: 'pointer' }}>
            불러오기
          </button>
          <button onClick={exportJson} style={{ background: '#333', border: '1px solid #555', color: '#ccc', borderRadius: 6, padding: '6px 12px', fontSize: 11, cursor: 'pointer' }}>
            JSON 내보내기
          </button>
          <label style={{ background: '#333', border: '1px solid #555', color: '#ccc', borderRadius: 6, padding: '6px 12px', fontSize: 11, cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}>
            JSON 가져오기
            <input type="file" accept=".json" onChange={importJson} style={{ display: 'none' }} />
          </label>
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
          onFileUpload={handleFileUpload}
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
