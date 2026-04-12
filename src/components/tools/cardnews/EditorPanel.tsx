import { useState } from 'react';
import type { CardData, TextBlock, CardSettings } from './types';

interface EditorPanelProps {
  card: CardData;
  settings: CardSettings;
  selectedTextBlockId: string | null;
  onCardChange: (card: CardData) => void;
  onSettingsChange: (settings: CardSettings) => void;
  onSelectTextBlock: (id: string | null) => void;
  onSearchImages: () => void;
}

function SliderRow({ label, value, min, max, step, onChange, unit }: {
  label: string; value: number; min: number; max: number; step?: number;
  onChange: (v: number) => void; unit?: string;
}) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#aaa', marginBottom: 4 }}>
        <span>{label}</span>
        <span>{value}{unit || ''}</span>
      </div>
      <input
        type="range" min={min} max={max} step={step || 1} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ width: '100%', accentColor: '#F5C518' }}
      />
    </div>
  );
}

export default function EditorPanel({
  card, settings, selectedTextBlockId, onCardChange, onSettingsChange, onSelectTextBlock, onSearchImages,
}: EditorPanelProps) {
  const [tab, setTab] = useState<'text' | 'bg' | 'header'>('text');

  const updateBlock = (blockId: string, updates: Partial<TextBlock>) => {
    onCardChange({
      ...card,
      textBlocks: card.textBlocks.map((b) =>
        b.id === blockId ? { ...b, ...updates } : b
      ),
    });
  };

  const addTextBlock = () => {
    const newBlock: TextBlock = {
      id: `tb_${Date.now()}`,
      content: '새 텍스트',
      fontSize: 32,
      fontWeight: 400,
      color: '#ffffff',
      isAccent: false,
      lineHeight: 1.5,
      letterSpacing: 0,
      textAlign: 'left',
    };
    onCardChange({ ...card, textBlocks: [...card.textBlocks, newBlock] });
    onSelectTextBlock(newBlock.id);
  };

  const removeTextBlock = (id: string) => {
    if (card.textBlocks.length <= 1) return;
    onCardChange({ ...card, textBlocks: card.textBlocks.filter((b) => b.id !== id) });
    if (selectedTextBlockId === id) onSelectTextBlock(null);
  };

  const moveBlock = (id: string, dir: -1 | 1) => {
    const idx = card.textBlocks.findIndex((b) => b.id === id);
    if (idx < 0) return;
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= card.textBlocks.length) return;
    const blocks = [...card.textBlocks];
    [blocks[idx], blocks[newIdx]] = [blocks[newIdx], blocks[idx]];
    onCardChange({ ...card, textBlocks: blocks });
  };

  const selectedBlock = card.textBlocks.find((b) => b.id === selectedTextBlockId);

  const tabStyle = (active: boolean) => ({
    flex: 1,
    padding: '8px 0',
    background: active ? '#333' : 'transparent',
    color: active ? '#fff' : '#888',
    border: 'none',
    cursor: 'pointer' as const,
    fontSize: 13,
    fontWeight: active ? 600 : 400,
    borderRadius: 6,
  });

  return (
    <div style={{ width: 320, background: '#1a1a1a', borderRadius: 12, padding: 16, overflowY: 'auto', maxHeight: '100%', fontSize: 13, color: '#ddd' }}>
      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 16, background: '#111', borderRadius: 8, padding: 4 }}>
        <button style={tabStyle(tab === 'text')} onClick={() => setTab('text')}>텍스트</button>
        <button style={tabStyle(tab === 'bg')} onClick={() => setTab('bg')}>배경</button>
        <button style={tabStyle(tab === 'header')} onClick={() => setTab('header')}>헤더</button>
      </div>

      {tab === 'text' && (
        <div>
          {/* Text block list */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontWeight: 600 }}>텍스트 블록</span>
              <button onClick={addTextBlock} style={{ background: '#333', border: 'none', color: '#F5C518', padding: '4px 12px', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}>+ 추가</button>
            </div>
            {card.textBlocks.map((block, i) => (
              <div
                key={block.id}
                onClick={() => onSelectTextBlock(block.id)}
                style={{
                  padding: '8px 12px',
                  background: selectedTextBlockId === block.id ? '#333' : '#222',
                  borderRadius: 6,
                  marginBottom: 4,
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  border: selectedTextBlockId === block.id ? '1px solid #F5C518' : '1px solid transparent',
                }}
              >
                <span style={{ fontSize: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 180 }}>
                  {block.content.split('\n')[0] || `블록 ${i + 1}`}
                </span>
                <div style={{ display: 'flex', gap: 4 }}>
                  <button onClick={(e) => { e.stopPropagation(); moveBlock(block.id, -1); }} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: 14 }}>↑</button>
                  <button onClick={(e) => { e.stopPropagation(); moveBlock(block.id, 1); }} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: 14 }}>↓</button>
                  <button onClick={(e) => { e.stopPropagation(); removeTextBlock(block.id); }} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', fontSize: 14 }}>×</button>
                </div>
              </div>
            ))}
          </div>

          {/* Selected block editor */}
          {selectedBlock && (
            <div style={{ borderTop: '1px solid #333', paddingTop: 16 }}>
              <div style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 12, color: '#aaa', display: 'block', marginBottom: 4 }}>내용 (Enter로 줄바꿈)</label>
                <textarea
                  value={selectedBlock.content}
                  onChange={(e) => updateBlock(selectedBlock.id, { content: e.target.value })}
                  rows={4}
                  style={{ width: '100%', background: '#222', border: '1px solid #444', borderRadius: 6, padding: 8, color: '#fff', fontSize: 13, resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.5 }}
                />
              </div>

              <SliderRow label="폰트 크기" value={selectedBlock.fontSize} min={16} max={120} onChange={(v) => updateBlock(selectedBlock.id, { fontSize: v })} unit="px" />
              <SliderRow label="폰트 두께" value={selectedBlock.fontWeight} min={100} max={900} step={100} onChange={(v) => updateBlock(selectedBlock.id, { fontWeight: v })} />
              <SliderRow label="줄 높이" value={selectedBlock.lineHeight} min={0.8} max={2.5} step={0.1} onChange={(v) => updateBlock(selectedBlock.id, { lineHeight: v })} />
              <SliderRow label="자간" value={selectedBlock.letterSpacing} min={-3} max={10} step={0.5} onChange={(v) => updateBlock(selectedBlock.id, { letterSpacing: v })} unit="px" />

              {/* Color */}
              <div style={{ marginBottom: 12, display: 'flex', gap: 8, alignItems: 'center' }}>
                <label style={{ fontSize: 12, color: '#aaa' }}>색상</label>
                <input type="color" value={selectedBlock.color} onChange={(e) => updateBlock(selectedBlock.id, { color: e.target.value })} style={{ width: 32, height: 24, border: 'none', background: 'none', cursor: 'pointer' }} />
                <label style={{ fontSize: 12, color: '#aaa', marginLeft: 8 }}>
                  <input type="checkbox" checked={selectedBlock.isAccent} onChange={(e) => updateBlock(selectedBlock.id, { isAccent: e.target.checked })} style={{ marginRight: 4 }} />
                  강조색 사용
                </label>
              </div>

              {/* Text align */}
              <div style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 12, color: '#aaa', display: 'block', marginBottom: 4 }}>정렬</label>
                <div style={{ display: 'flex', gap: 4 }}>
                  {(['left', 'center', 'right'] as const).map((align) => (
                    <button
                      key={align}
                      onClick={() => updateBlock(selectedBlock.id, { textAlign: align })}
                      style={{
                        flex: 1, padding: '6px 0', background: selectedBlock.textAlign === align ? '#444' : '#222',
                        border: selectedBlock.textAlign === align ? '1px solid #F5C518' : '1px solid #333',
                        color: '#fff', borderRadius: 4, cursor: 'pointer', fontSize: 12,
                      }}
                    >
                      {align === 'left' ? '좌' : align === 'center' ? '중앙' : '우'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Vertical align */}
          <div style={{ borderTop: '1px solid #333', paddingTop: 12, marginTop: 12 }}>
            <label style={{ fontSize: 12, color: '#aaa', display: 'block', marginBottom: 4 }}>텍스트 수직 위치</label>
            <div style={{ display: 'flex', gap: 4 }}>
              {(['top', 'center', 'bottom'] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => onCardChange({ ...card, verticalAlign: v })}
                  style={{
                    flex: 1, padding: '6px 0', background: card.verticalAlign === v ? '#444' : '#222',
                    border: card.verticalAlign === v ? '1px solid #F5C518' : '1px solid #333',
                    color: '#fff', borderRadius: 4, cursor: 'pointer', fontSize: 12,
                  }}
                >
                  {v === 'top' ? '상단' : v === 'center' ? '중앙' : '하단'}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'bg' && (
        <div>
          {/* Image search button */}
          <button
            onClick={onSearchImages}
            style={{ width: '100%', padding: '10px 0', background: '#333', border: '1px solid #555', color: '#F5C518', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600, marginBottom: 16 }}
          >
            🔍 이미지 검색
          </button>

          {/* Direct URL input */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, color: '#aaa', display: 'block', marginBottom: 4 }}>이미지 URL 직접 입력</label>
            <input
              type="text"
              value={card.bgImage}
              onChange={(e) => onCardChange({ ...card, bgImage: e.target.value })}
              placeholder="https://..."
              style={{ width: '100%', background: '#222', border: '1px solid #444', borderRadius: 6, padding: 8, color: '#fff', fontSize: 12 }}
            />
          </div>

          <SliderRow label="확대/축소" value={card.bgScale} min={80} max={250} onChange={(v) => onCardChange({ ...card, bgScale: v })} unit="%" />
          <SliderRow label="가로 위치" value={card.bgPositionX} min={0} max={100} onChange={(v) => onCardChange({ ...card, bgPositionX: v })} unit="%" />
          <SliderRow label="세로 위치" value={card.bgPositionY} min={0} max={100} onChange={(v) => onCardChange({ ...card, bgPositionY: v })} unit="%" />
          <SliderRow label="밝기" value={card.bgBrightness} min={0} max={150} onChange={(v) => onCardChange({ ...card, bgBrightness: v })} unit="%" />
          <SliderRow label="대비" value={card.bgContrast} min={50} max={200} onChange={(v) => onCardChange({ ...card, bgContrast: v })} unit="%" />
          <SliderRow label="오버레이 불투명도" value={card.overlayOpacity} min={0} max={100} onChange={(v) => onCardChange({ ...card, overlayOpacity: v })} unit="%" />
        </div>
      )}

      {tab === 'header' && (
        <div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 12, color: '#aaa', display: 'block', marginBottom: 4 }}>시리즈명 (Enter로 줄바꿈)</label>
            <textarea
              value={settings.seriesName}
              onChange={(e) => onSettingsChange({ ...settings, seriesName: e.target.value })}
              rows={2}
              style={{ width: '100%', background: '#222', border: '1px solid #444', borderRadius: 6, padding: 8, color: '#fff', fontSize: 13, fontFamily: 'inherit' }}
            />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 12, color: '#aaa', display: 'block', marginBottom: 4 }}>날짜</label>
            <input type="text" value={settings.date} onChange={(e) => onSettingsChange({ ...settings, date: e.target.value })}
              style={{ width: '100%', background: '#222', border: '1px solid #444', borderRadius: 6, padding: 8, color: '#fff', fontSize: 13 }} />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 12, color: '#aaa', display: 'block', marginBottom: 4 }}>브랜드명</label>
            <input type="text" value={settings.brandName} onChange={(e) => onSettingsChange({ ...settings, brandName: e.target.value })}
              style={{ width: '100%', background: '#222', border: '1px solid #444', borderRadius: 6, padding: 8, color: '#fff', fontSize: 13 }} />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 12, color: '#aaa', display: 'block', marginBottom: 4 }}>카테고리 태그</label>
            <input type="text" value={settings.categoryTag} onChange={(e) => onSettingsChange({ ...settings, categoryTag: e.target.value })}
              style={{ width: '100%', background: '#222', border: '1px solid #444', borderRadius: 6, padding: 8, color: '#fff', fontSize: 13 }} />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 12, color: '#aaa', display: 'block', marginBottom: 4 }}>강조 색상</label>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <input type="color" value={settings.accentColor} onChange={(e) => onSettingsChange({ ...settings, accentColor: e.target.value })}
                style={{ width: 40, height: 30, border: 'none', background: 'none', cursor: 'pointer' }} />
              <span style={{ fontSize: 12, color: '#888' }}>{settings.accentColor}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
