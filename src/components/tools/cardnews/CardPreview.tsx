import { useRef, forwardRef } from 'react';
import type { CardData, CardSettings, TextBlock } from './types';
import type { Theme } from './themes';

interface CardPreviewProps {
  card: CardData;
  settings: CardSettings;
  theme: Theme;
  scale?: number;
  onTextBlockClick?: (blockId: string) => void;
  selectedTextBlockId?: string | null;
}

const CARD_W = 1080;
const CARD_H = 1080;

function renderTextContent(content: string, accentColor: string, isAccent: boolean): React.ReactNode[] {
  const lines = content.split('\n');
  return lines.map((line, i) => (
    <span key={i}>
      {isAccent ? <span style={{ color: accentColor }}>{line}</span> : line}
      {i < lines.length - 1 && <br />}
    </span>
  ));
}

const CardPreview = forwardRef<HTMLDivElement, CardPreviewProps>(
  ({ card, settings, theme, scale = 0.35, onTextBlockClick, selectedTextBlockId }, ref) => {
    const hasBg = !!card.bgImage;

    const verticalJustify = card.verticalAlign === 'top' ? 'flex-start' : card.verticalAlign === 'bottom' ? 'flex-end' : 'center';

    return (
      <div
        ref={ref}
        style={{
          width: CARD_W,
          height: CARD_H,
          backgroundColor: theme.bg,
          position: 'relative',
          overflow: 'hidden',
          fontFamily: '"Pretendard Variable", Pretendard, -apple-system, sans-serif',
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          flexShrink: 0,
        }}
      >
        {/* Background image */}
        {hasBg && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `url(${card.bgImage})`,
              backgroundSize: `${card.bgScale}%`,
              backgroundPosition: `${card.bgPositionX}% ${card.bgPositionY}%`,
              backgroundRepeat: 'no-repeat',
              filter: `brightness(${card.bgBrightness}%) contrast(${card.bgContrast}%)`,
            }}
          />
        )}

        {/* Dark overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: `rgba(0,0,0,${card.overlayOpacity / 100})`,
            zIndex: 1,
          }}
        />

        {/* Content */}
        <div
          style={{
            position: 'relative',
            zIndex: 2,
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            padding: 72,
          }}
        >
          {/* Header: series name */}
          <div style={{ textAlign: 'center', marginBottom: 16 }}>
            <div
              style={{
                fontSize: 24,
                fontWeight: 500,
                color: theme.sub,
                lineHeight: 1.5,
                letterSpacing: 1,
                whiteSpace: 'pre-line',
              }}
            >
              {settings.seriesName}
            </div>
          </div>

          {/* Sub-header: date | brand | tag */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 48,
              fontSize: 22,
              color: theme.muted,
            }}
          >
            <span>{settings.date}</span>
            <span>{settings.brandName}</span>
            <span
              style={{
                backgroundColor: theme.tagBg,
                color: theme.tagText,
                padding: '6px 18px',
                borderRadius: 4,
                fontSize: 20,
                fontWeight: 700,
                letterSpacing: 2,
              }}
            >
              {settings.categoryTag}
            </span>
          </div>

          {/* Main text blocks */}
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: verticalJustify,
              gap: 24,
            }}
          >
            {card.textBlocks.map((block) => (
              <div
                key={block.id}
                onClick={() => onTextBlockClick?.(block.id)}
                style={{
                  fontSize: block.fontSize,
                  fontWeight: block.fontWeight,
                  color: block.isAccent ? settings.accentColor : block.color,
                  lineHeight: block.lineHeight,
                  letterSpacing: block.letterSpacing,
                  textAlign: block.textAlign,
                  whiteSpace: 'pre-line',
                  wordBreak: 'keep-all',
                  cursor: onTextBlockClick ? 'pointer' : 'default',
                  outline: selectedTextBlockId === block.id ? `3px solid ${settings.accentColor}` : 'none',
                  outlineOffset: 8,
                  borderRadius: 4,
                  transition: 'outline 0.15s',
                }}
              >
                {block.content}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
);

CardPreview.displayName = 'CardPreview';
export default CardPreview;
export { CARD_W, CARD_H };
