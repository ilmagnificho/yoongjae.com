import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { questions, matchSpots, spots, type Spot } from './cherryBlossomData';

declare global {
  interface Window {
    __ga4?: {
      trackToolUse: (tool: string, action: string, params?: Record<string, unknown>) => void;
    };
  }
}

/* ─── Petal Animation ─── */
function PetalAnimation({ count = 6 }: { count?: number }) {
  const petals = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 6,
        duration: 6 + Math.random() * 6,
        size: 10 + Math.random() * 14,
        opacity: 0.4 + Math.random() * 0.4,
        rotate: Math.random() * 360,
      })),
    [count]
  );

  return (
    <div className="cherry-petals" aria-hidden="true">
      {petals.map((p) => (
        <div
          key={p.id}
          className="cherry-petal"
          style={{
            left: `${p.left}%`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            opacity: p.opacity,
            '--rotate': `${p.rotate}deg`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

/* ─── Intro Screen ─── */
function IntroScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="cherry-card text-center py-12 px-6 relative overflow-hidden">
      <PetalAnimation count={8} />
      <div className="relative z-10">
        <div className="text-6xl mb-6">🌸</div>
        <h2
          className="text-2xl font-bold mb-3"
          style={{ fontFamily: "'Noto Serif KR', 'Newsreader', serif", color: '#8B6F5E' }}
        >
          나의 벚꽃 명소 찾기
        </h2>
        <p className="text-sm mb-8" style={{ color: '#8B6F5E', opacity: 0.7 }}>
          4가지 질문으로 올해 봄,
          <br />
          당신에게 딱 맞는 벚꽃 여행지를 찾아드려요
        </p>
        <button
          onClick={onStart}
          className="cherry-btn"
        >
          시작하기
        </button>
        <p className="text-xs mt-8" style={{ color: '#C76B8A', opacity: 0.5 }}>
          yoongjae.com | 2026 벚꽃 시즌
        </p>
      </div>
    </div>
  );
}

/* ─── Quiz Screen ─── */
function QuizScreen({
  questionIndex,
  onSelect,
}: {
  questionIndex: number;
  onSelect: (tag: string) => void;
}) {
  const q = questions[questionIndex];
  const progress = ((questionIndex + 1) / questions.length) * 100;

  return (
    <div className="cherry-card py-8 px-6">
      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex justify-between text-xs mb-2" style={{ color: '#C76B8A' }}>
          <span>Q{questionIndex + 1} / {questions.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full h-1.5 rounded-full" style={{ backgroundColor: '#FDE8ED' }}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${progress}%`, backgroundColor: '#F4A7B9' }}
          />
        </div>
      </div>

      {/* Question */}
      <h3
        className="text-xl font-bold mb-6 text-center"
        style={{ fontFamily: "'Noto Serif KR', 'Newsreader', serif", color: '#8B6F5E' }}
      >
        {q.question}
      </h3>

      {/* Options */}
      <div className="space-y-3">
        {q.options.map((opt) => (
          <button
            key={opt.tag}
            onClick={() => onSelect(opt.tag)}
            className="cherry-option"
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─── Timeline Bar ─── */
function TimelineChart({ recommended }: { recommended: Spot }) {
  const allRegions = [
    { label: '제주', spots: spots.filter((s) => s.region === '제주') },
    { label: '남부', spots: spots.filter((s) => ['경남', '부산', '경북', '대구'].includes(s.region)) },
    { label: '수도권', spots: spots.filter((s) => ['서울', '경기'].includes(s.region) && !['yangpyeong', 'gapyeong'].includes(s.id)) },
    { label: '강원/근교', spots: spots.filter((s) => s.region === '강원' || ['yangpyeong', 'gapyeong'].includes(s.id)) },
  ];

  // Timeline range: 3/20 to 4/17 = 28 days
  const startDate = new Date(2026, 2, 20); // March 20
  const totalDays = 28;

  function parseDate(str: string): Date {
    const [m, d] = str.split('/').map(Number);
    return new Date(2026, m - 1, d);
  }

  function dayOffset(dateStr: string): number {
    const d = parseDate(dateStr);
    return Math.max(0, Math.round((d.getTime() - startDate.getTime()) / 86400000));
  }

  // Generate week markers
  const weekMarkers = [];
  for (let i = 0; i <= totalDays; i += 7) {
    const d = new Date(startDate.getTime() + i * 86400000);
    weekMarkers.push({ offset: i, label: `${d.getMonth() + 1}/${d.getDate()}` });
  }

  return (
    <div className="mt-8 p-4 rounded-xl" style={{ backgroundColor: '#FFF5F7' }}>
      <h4
        className="text-sm font-bold mb-4 text-center"
        style={{ color: '#8B6F5E', fontFamily: "'Noto Serif KR', 'Newsreader', serif" }}
      >
        🌸 2026 전국 벚꽃 타임라인
      </h4>

      {/* Week labels */}
      <div className="relative h-5 mb-1 text-[10px]" style={{ color: '#C76B8A' }}>
        {weekMarkers.map((m) => (
          <span
            key={m.offset}
            className="absolute"
            style={{ left: `${(m.offset / totalDays) * 100}%`, transform: 'translateX(-50%)' }}
          >
            {m.label}
          </span>
        ))}
      </div>

      {allRegions.map((region) => {
        // Get the earliest bloom and latest peak in the region
        const earliestBloom = Math.min(...region.spots.map((s) => dayOffset(s.bloomStart)));
        const latestPeak = Math.max(...region.spots.map((s) => dayOffset(s.peakEnd)));
        const isHighlighted = region.spots.some((s) => s.id === recommended.id);

        return (
          <div key={region.label} className="flex items-center gap-2 mb-2">
            <span
              className="text-[11px] w-16 text-right flex-shrink-0 font-medium"
              style={{ color: isHighlighted ? '#C76B8A' : '#8B6F5E' }}
            >
              {region.label}
            </span>
            <div className="flex-1 relative h-5">
              {/* Track */}
              <div
                className="absolute inset-0 rounded-full"
                style={{ backgroundColor: '#FDE8ED' }}
              />
              {/* Bar */}
              <div
                className="absolute top-0 h-full rounded-full transition-all"
                style={{
                  left: `${(earliestBloom / totalDays) * 100}%`,
                  width: `${((latestPeak - earliestBloom) / totalDays) * 100}%`,
                  backgroundColor: isHighlighted ? '#C76B8A' : '#F4A7B9',
                  opacity: isHighlighted ? 1 : 0.6,
                }}
              />
            </div>
          </div>
        );
      })}

      <p className="text-[10px] text-center mt-3" style={{ color: '#C76B8A', opacity: 0.6 }}>
        ※ 기상 조건에 따라 ±3~7일 차이가 있을 수 있습니다
      </p>
    </div>
  );
}

/* ─── Result Screen ─── */
function ResultScreen({
  mainSpot,
  altSpots,
  onRestart,
  onShare,
}: {
  mainSpot: Spot;
  altSpots: Spot[];
  onRestart: () => void;
  onShare: (type: 'image' | 'link' | 'text') => void;
}) {
  const resultRef = useRef<HTMLDivElement>(null);

  return (
    <div className="space-y-6">
      {/* Main result card */}
      <div ref={resultRef} className="cherry-card relative overflow-hidden py-6 px-5" id="cherry-result-card">
        <PetalAnimation count={5} />
        <div className="relative z-10">
          <p
            className="text-sm text-center mb-4 font-medium"
            style={{ color: '#C76B8A' }}
          >
            🌸 당신의 벚꽃 명소는...
          </p>

          {/* Spot image placeholder */}
          <div
            className="w-full rounded-xl mb-4 flex items-center justify-center overflow-hidden"
            style={{
              aspectRatio: '3/2',
              background: 'linear-gradient(135deg, #FDE8ED, #F4A7B9)',
            }}
          >
            <span className="text-6xl">🌸</span>
          </div>

          {/* Spot name */}
          <h3
            className="text-xl font-bold text-center mb-1"
            style={{
              fontFamily: "'Noto Serif KR', 'Newsreader', serif",
              color: '#8B6F5E',
            }}
          >
            ✦ {mainSpot.name}
          </h3>
          <p className="text-xs text-center mb-4" style={{ color: '#C76B8A' }}>
            {mainSpot.location}
          </p>

          {/* Dates */}
          <div
            className="rounded-lg p-3 mb-4 space-y-1.5"
            style={{ backgroundColor: '#FFF5F7' }}
          >
            <p className="text-sm" style={{ color: '#8B6F5E' }}>
              📅 개화 예상: <strong>{mainSpot.bloomStart} - {mainSpot.bloomEnd}</strong>
            </p>
            <p className="text-sm" style={{ color: '#8B6F5E' }}>
              🌸 만개 예상: <strong>{mainSpot.peakStart} - {mainSpot.peakEnd}</strong>
            </p>
            {mainSpot.festival && (
              <p className="text-sm" style={{ color: '#8B6F5E' }}>
                🎪 {mainSpot.festival}: <strong>{mainSpot.festivalDates}</strong>
              </p>
            )}
          </div>

          {/* Description */}
          <p
            className="text-sm leading-relaxed mb-4 text-center italic"
            style={{ color: '#8B6F5E' }}
          >
            &ldquo;{mainSpot.description}&rdquo;
          </p>

          {/* Tip */}
          <div className="mb-3">
            <p className="text-sm" style={{ color: '#8B6F5E' }}>
              💡 <strong>팁:</strong> {mainSpot.tip}
            </p>
          </div>

          {/* Meta info */}
          <div
            className="border-t pt-3 space-y-1.5"
            style={{ borderColor: 'rgba(244, 167, 185, 0.3)' }}
          >
            <p className="text-xs" style={{ color: '#8B6F5E' }}>
              📸 사진 포인트: {mainSpot.photoPoint}
            </p>
            <p className="text-xs" style={{ color: '#8B6F5E' }}>
              🚌 접근성: {mainSpot.accessibility} &nbsp;|&nbsp; 👥 혼잡도: {mainSpot.crowdLevel}
            </p>
          </div>

          {/* Credits */}
          <div className="mt-4 pt-3 text-center" style={{ borderTop: '1px solid rgba(244,167,185,0.2)' }}>
            <p className="text-[10px]" style={{ color: '#C76B8A', opacity: 0.5 }}>
              사진: {mainSpot.imageCredit}
            </p>
            <p className="text-[10px]" style={{ color: '#C76B8A', opacity: 0.5 }}>
              yoongjae.com/tools/cherry | 2026 벚꽃 시즌
            </p>
          </div>
        </div>
      </div>

      {/* Share buttons */}
      <div className="flex gap-2 justify-center">
        <button onClick={() => onShare('image')} className="cherry-share-btn">
          📷 이미지 저장
        </button>
        <button onClick={() => onShare('link')} className="cherry-share-btn">
          🔗 링크 복사
        </button>
        <button onClick={() => onShare('text')} className="cherry-share-btn">
          💬 텍스트 복사
        </button>
      </div>

      {/* Alternative spots */}
      {altSpots.length > 0 && (
        <div className="cherry-card py-5 px-5">
          <h4
            className="text-sm font-bold mb-3"
            style={{
              fontFamily: "'Noto Serif KR', 'Newsreader', serif",
              color: '#8B6F5E',
            }}
          >
            이런 곳도 좋아요 ✨
          </h4>
          <div className="space-y-3">
            {altSpots.map((spot) => (
              <div
                key={spot.id}
                className="rounded-lg p-3"
                style={{ backgroundColor: '#FFF5F7' }}
              >
                <p className="text-sm font-semibold" style={{ color: '#8B6F5E' }}>
                  {spot.name}
                  <span className="font-normal text-xs ml-2" style={{ color: '#C76B8A' }}>
                    {spot.location}
                  </span>
                </p>
                <p className="text-xs mt-1" style={{ color: '#8B6F5E', opacity: 0.7 }}>
                  🌸 만개: {spot.peakStart} - {spot.peakEnd}
                </p>
                <p className="text-xs mt-0.5" style={{ color: '#8B6F5E', opacity: 0.6 }}>
                  {spot.description.split('.')[0]}.
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Timeline */}
      <TimelineChart recommended={mainSpot} />

      {/* Disclaimer */}
      <p className="text-[11px] text-center px-4" style={{ color: '#C76B8A', opacity: 0.5 }}>
        ※ 날짜는 예측치이며 실제와 다를 수 있습니다.
        <br />
        출발 전 기상청 개화 현황을 확인하세요.
      </p>

      {/* Restart */}
      <div className="text-center pb-4">
        <button onClick={onRestart} className="cherry-btn">
          🔄 다시 하기
        </button>
      </div>
    </div>
  );
}

/* ─── Toast notification ─── */
function Toast({ message, visible }: { message: string; visible: boolean }) {
  if (!visible) return null;
  return (
    <div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full text-sm shadow-lg transition-all"
      style={{ backgroundColor: '#C76B8A', color: '#fff' }}
    >
      {message}
    </div>
  );
}

/* ─── Main Component ─── */
export default function CherryBlossomQuiz() {
  const [stage, setStage] = useState<'intro' | 'quiz' | 'result'>('intro');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [results, setResults] = useState<Spot[]>([]);
  const [toast, setToast] = useState({ message: '', visible: false });
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Check URL for shared result
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const resultId = params.get('r');
    if (resultId) {
      const spotIndex = parseInt(resultId, 10);
      if (!isNaN(spotIndex) && spotIndex >= 0 && spotIndex < spots.length) {
        const mainSpot = spots[spotIndex];
        // Show this spot as the main result with 2 alternatives
        const alts = spots.filter((s) => s.id !== mainSpot.id).slice(0, 2);
        setResults([mainSpot, ...alts]);
        setStage('result');
      }
    }
  }, []);

  const showToast = useCallback((message: string) => {
    setToast({ message, visible: true });
    setTimeout(() => setToast({ message: '', visible: false }), 2000);
  }, []);

  const transition = useCallback((callback: () => void) => {
    setIsTransitioning(true);
    setTimeout(() => {
      callback();
      setIsTransitioning(false);
    }, 300);
  }, []);

  const handleStart = useCallback(() => {
    window.__ga4?.trackToolUse('cherry-blossom', 'quiz_start');
    transition(() => {
      setStage('quiz');
      setQuestionIndex(0);
      setSelectedTags([]);
    });
  }, [transition]);

  const handleSelect = useCallback(
    (tag: string) => {
      const newTags = [...selectedTags, tag];
      setSelectedTags(newTags);

      if (questionIndex < questions.length - 1) {
        transition(() => setQuestionIndex(questionIndex + 1));
      } else {
        // Calculate result
        const matched = matchSpots(newTags);
        setResults(matched);
        window.__ga4?.trackToolUse('cherry-blossom', 'quiz_complete', {
          result: matched[0]?.id,
          tags: newTags.join(','),
        });
        transition(() => setStage('result'));
      }
    },
    [selectedTags, questionIndex, transition]
  );

  const handleRestart = useCallback(() => {
    window.__ga4?.trackToolUse('cherry-blossom', 'quiz_restart');
    // Clean URL
    if (window.location.search) {
      window.history.replaceState({}, '', window.location.pathname);
    }
    transition(() => {
      setStage('intro');
      setQuestionIndex(0);
      setSelectedTags([]);
      setResults([]);
    });
  }, [transition]);

  const handleShare = useCallback(
    async (type: 'image' | 'link' | 'text') => {
      const mainSpot = results[0];
      if (!mainSpot) return;

      window.__ga4?.trackToolUse('cherry-blossom', `share_${type}`, { spot: mainSpot.id });

      const spotIndex = spots.findIndex((s) => s.id === mainSpot.id);

      if (type === 'image') {
        try {
          const { default: html2canvas } = await import('html2canvas');
          const el = document.getElementById('cherry-result-card');
          if (!el) return;
          const canvas = await html2canvas(el, {
            backgroundColor: '#FFF5F7',
            scale: 2,
            useCORS: true,
          });
          const link = document.createElement('a');
          link.download = `cherry-blossom-${mainSpot.id}.png`;
          link.href = canvas.toDataURL('image/png');
          link.click();
          showToast('이미지가 저장되었습니다!');
        } catch {
          showToast('이미지 저장에 실패했습니다');
        }
      } else if (type === 'link') {
        const url = `${window.location.origin}${window.location.pathname}?r=${spotIndex}`;
        try {
          await navigator.clipboard.writeText(url);
          showToast('링크가 복사되었습니다!');
        } catch {
          showToast('링크 복사에 실패했습니다');
        }
      } else if (type === 'text') {
        const text = `나의 벚꽃 명소는 ${mainSpot.name}! 🌸\n만개 예상: ${mainSpot.peakStart} - ${mainSpot.peakEnd}\n나도 찾아보기 → ${window.location.origin}${window.location.pathname}?r=${spotIndex}`;
        try {
          await navigator.clipboard.writeText(text);
          showToast('텍스트가 복사되었습니다!');
        } catch {
          showToast('텍스트 복사에 실패했습니다');
        }
      }
    },
    [results, showToast]
  );

  return (
    <>
      <style>{`
        .cherry-card {
          background: rgba(255, 245, 247, 0.95);
          border: 1px solid rgba(244, 167, 185, 0.3);
          border-radius: 16px;
          backdrop-filter: blur(8px);
        }
        .cherry-btn {
          display: inline-block;
          padding: 12px 32px;
          background: linear-gradient(135deg, #F4A7B9, #C76B8A);
          color: white;
          border: none;
          border-radius: 50px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          box-shadow: 0 4px 15px rgba(199, 107, 138, 0.3);
        }
        .cherry-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(199, 107, 138, 0.4);
        }
        .cherry-btn:active {
          transform: translateY(0);
        }
        .cherry-option {
          width: 100%;
          padding: 14px 20px;
          background: white;
          border: 2px solid rgba(244, 167, 185, 0.3);
          border-radius: 12px;
          font-size: 15px;
          color: #8B6F5E;
          cursor: pointer;
          transition: all 0.2s;
          text-align: left;
        }
        .cherry-option:hover {
          border-color: #F4A7B9;
          background: #FFF5F7;
          transform: translateX(4px);
        }
        .cherry-option:active {
          background: #FDE8ED;
        }
        .cherry-share-btn {
          padding: 8px 16px;
          background: white;
          border: 1px solid rgba(244, 167, 185, 0.4);
          border-radius: 50px;
          font-size: 13px;
          color: #8B6F5E;
          cursor: pointer;
          transition: all 0.2s;
        }
        .cherry-share-btn:hover {
          background: #FFF5F7;
          border-color: #F4A7B9;
        }
        /* Petal animation */
        .cherry-petals {
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
        }
        .cherry-petal {
          position: absolute;
          top: -20px;
          border-radius: 50% 0 50% 50%;
          background: linear-gradient(135deg, #F4A7B9, #FDE8ED);
          animation: petalFall linear infinite;
        }
        @keyframes petalFall {
          0% {
            transform: translateY(-20px) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(calc(100vh)) rotate(var(--rotate, 360deg));
            opacity: 0;
          }
        }
        /* Transition */
        .cherry-fade-enter {
          opacity: 0;
          transform: translateY(10px);
        }
        .cherry-fade-active {
          opacity: 1;
          transform: translateY(0);
          transition: opacity 0.3s, transform 0.3s;
        }
      `}</style>

      <div
        className="max-w-md mx-auto"
        style={{
          opacity: isTransitioning ? 0 : 1,
          transform: isTransitioning ? 'translateY(10px)' : 'translateY(0)',
          transition: 'opacity 0.3s, transform 0.3s',
        }}
      >
        {stage === 'intro' && <IntroScreen onStart={handleStart} />}
        {stage === 'quiz' && (
          <QuizScreen questionIndex={questionIndex} onSelect={handleSelect} />
        )}
        {stage === 'result' && results.length > 0 && (
          <ResultScreen
            mainSpot={results[0]}
            altSpots={results.slice(1)}
            onRestart={handleRestart}
            onShare={handleShare}
          />
        )}
      </div>

      <Toast message={toast.message} visible={toast.visible} />
    </>
  );
}
