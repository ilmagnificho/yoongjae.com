import { useState, useMemo } from 'react';

// ─── Fun "what can I buy" thresholds ────────────────────────────

const MILESTONES = [
  { threshold: 50_000, label: '에어팟 프로' },
  { threshold: 200_000, label: '아이패드 프로' },
  { threshold: 500_000, label: '맥북 프로 M4' },
  { threshold: 1_000_000, label: '명품 가방 하나' },
  { threshold: 2_000_000, label: '부모님 효도 여행' },
  { threshold: 3_000_000, label: '중고차 한 대' },
  { threshold: 5_000_000, label: '제주도 한 달 살기' },
  { threshold: 10_000_000, label: '유럽 한 달 배낭여행' },
  { threshold: 20_000_000, label: '신차 한 대 (아반떼급)' },
  { threshold: 50_000_000, label: '테슬라 모델 3' },
  { threshold: 80_000_000, label: '벤츠 E-Class' },
  { threshold: 100_000_000, label: '강남 전세 보증금' },
  { threshold: 150_000_000, label: 'MBA 유학 2년 (학비+생활비)' },
  { threshold: 200_000_000, label: '포르쉐 911' },
  { threshold: 300_000_000, label: '서울 아파트 (비강남)' },
  { threshold: 500_000_000, label: '서울 주요지역 아파트' },
  { threshold: 700_000_000, label: '강남 아파트 30평대' },
  { threshold: 1_000_000_000, label: '10억 클럽 가입' },
  { threshold: 2_000_000_000, label: '건물 한 채 (지방)' },
  { threshold: 3_000_000_000, label: '한남더힐 전세' },
  { threshold: 5_000_000_000, label: '강남 빌딩 매입' },
  { threshold: 10_000_000_000, label: '파이어(FIRE) + 자녀 교육비 해결' },
  { threshold: 30_000_000_000, label: '제주도 호텔 하나 인수' },
  { threshold: 50_000_000_000, label: 'Forbes Korea 등재 가능' },
  { threshold: 100_000_000_000, label: '슈퍼카 컬렉션 + 전세기' },
];

function getWhatCanIBuy(amount: number): { current: string; next: string | null; nextAmount: number } {
  let currentIdx = -1;
  for (let i = MILESTONES.length - 1; i >= 0; i--) {
    if (amount >= MILESTONES[i].threshold) {
      currentIdx = i;
      break;
    }
  }

  const current = currentIdx >= 0 ? MILESTONES[currentIdx].label : '커피 한 잔';
  const next = currentIdx < MILESTONES.length - 1 ? MILESTONES[currentIdx + 1] : null;

  return {
    current,
    next: next ? next.label : null,
    nextAmount: next ? next.threshold : 0,
  };
}

// ─── Main Component ─────────────────────────────────────────────

export default function EsopCalculator() {
  const [optionsGranted, setOptionsGranted] = useState(10000);
  const [strikePrice, setStrikePrice] = useState(1000); // 원
  const [exitValuation, setExitValuation] = useState(1000); // 억 원
  const [totalShares, setTotalShares] = useState(10000000);

  const result = useMemo(() => {
    if (totalShares <= 0 || exitValuation <= 0) {
      return { sharePriceAtExit: 0, grossValue: 0, exerciseCost: 0, netProfit: 0, multiple: 0 };
    }

    const sharePriceAtExit = (exitValuation * 1e8) / totalShares;
    const grossValue = optionsGranted * sharePriceAtExit;
    const exerciseCost = optionsGranted * strikePrice;
    const netProfit = Math.max(grossValue - exerciseCost, 0);
    const multiple = exerciseCost > 0 ? grossValue / exerciseCost : 0;

    return { sharePriceAtExit, grossValue, exerciseCost, netProfit, multiple };
  }, [optionsGranted, strikePrice, exitValuation, totalShares]);

  const profitRatio = result.grossValue > 0
    ? ((result.grossValue - result.exerciseCost) / result.grossValue) * 100
    : 0;

  const whatCanIBuy = useMemo(() => getWhatCanIBuy(result.netProfit), [result.netProfit]);

  return (
    <div className="mt-6 space-y-8">
      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="text-xs text-ink/45 block mb-1">부여받은 옵션 수</label>
          <input
            type="number"
            value={optionsGranted || ''}
            onChange={(e) => setOptionsGranted(Number(e.target.value) || 0)}
            min={1}
            className="w-full bg-transparent border-b border-ink/15 py-2 px-1 text-sm focus:outline-none focus:border-ink/40"
          />
          <p className="text-[10px] text-ink/30 mt-1">스톡옵션 계약서상 부여 주식 수</p>
        </div>
        <div>
          <label className="text-xs text-ink/45 block mb-1">행사가격 (원)</label>
          <input
            type="number"
            value={strikePrice || ''}
            onChange={(e) => setStrikePrice(Number(e.target.value) || 0)}
            min={0}
            className="w-full bg-transparent border-b border-ink/15 py-2 px-1 text-sm focus:outline-none focus:border-ink/40"
          />
          <p className="text-[10px] text-ink/30 mt-1">옵션 행사 시 지불하는 주당 가격</p>
        </div>
        <div>
          <label className="text-xs text-ink/45 block mb-1">총 발행주식 수</label>
          <input
            type="number"
            value={totalShares || ''}
            onChange={(e) => setTotalShares(Number(e.target.value) || 0)}
            min={1}
            className="w-full bg-transparent border-b border-ink/15 py-2 px-1 text-sm focus:outline-none focus:border-ink/40"
          />
          <p className="text-[10px] text-ink/30 mt-1">회사 전체 발행주식 수 (ESOP 풀 포함)</p>
        </div>
        <div>
          <label className="text-xs text-ink/45 block mb-1">목표 Exit 밸류에이션 (억 원)</label>
          <input
            type="number"
            value={exitValuation || ''}
            onChange={(e) => setExitValuation(Number(e.target.value) || 0)}
            min={1}
            className="w-full bg-transparent border-b border-ink/15 py-2 px-1 text-sm focus:outline-none focus:border-ink/40"
          />
        </div>
      </div>

      {/* Exit Valuation Slider — log scale: 10억 → 100억 → 1,000억 → 1조 */}
      <div className="border border-ink/10 rounded-lg p-5">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-xs font-semibold text-ink/50">Exit 밸류에이션 시나리오</h3>
          <span className="text-sm font-bold text-ink tabular-nums">
            {exitValuation >= 10000 ? '1조' : `${exitValuation.toLocaleString()}억`} 원
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={100}
          step={0.5}
          value={Math.max(0, Math.min(100, (Math.log10(Math.max(exitValuation, 10)) - 1) * (100 / 3)))}
          onChange={(e) => {
            const pct = Number(e.target.value);
            const raw = Math.round(Math.pow(10, 1 + pct * 3 / 100));
            setExitValuation(Math.min(10000, Math.max(10, raw)));
          }}
          className="w-full accent-ink h-1.5"
        />
        {/* Tick labels at exact log positions: 0%=10억, 33.3%=100억, 66.7%=1,000억, 100%=1조 */}
        <div className="relative text-[10px] text-ink/30 mt-1 h-4">
          <span className="absolute left-0">10억</span>
          <span className="absolute" style={{ left: '33.3%', transform: 'translateX(-50%)' }}>100억</span>
          <span className="absolute" style={{ left: '66.7%', transform: 'translateX(-50%)' }}>1,000억</span>
          <span className="absolute right-0">1조</span>
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <ResultCard label="Exit 시 주당가격" value={`₩${Math.round(result.sharePriceAtExit).toLocaleString()}`} />
        <ResultCard label="행사비용 (총)" value={formatKRW(result.exerciseCost)} />
        <ResultCard label="총 가치" value={formatKRW(result.grossValue)} />
        <ResultCard label="순이익" value={formatKRW(result.netProfit)} highlight />
      </div>

      {/* Profit margin bar */}
      <div className="border border-ink/10 rounded-lg p-5">
        <h3 className="text-xs font-semibold text-ink/50 mb-3">수익 구조</h3>
        <div className="h-8 bg-ink/[0.04] rounded-full overflow-hidden flex">
          {result.exerciseCost > 0 && result.grossValue > 0 && (
            <div
              className="h-full bg-ink/15 flex items-center justify-center text-[10px] text-ink/50 font-medium"
              style={{ width: `${Math.min((result.exerciseCost / result.grossValue) * 100, 100)}%` }}
            >
              {result.exerciseCost / result.grossValue < 0.15 ? '' : '행사비용'}
            </div>
          )}
          {result.netProfit > 0 && result.grossValue > 0 && (
            <div
              className="h-full bg-emerald-500 flex items-center justify-center text-[10px] text-white font-bold"
              style={{ width: `${profitRatio}%` }}
            >
              순이익 {profitRatio.toFixed(0)}%
            </div>
          )}
        </div>
        {result.multiple > 0 && (
          <p className="text-xs text-ink/50 mt-2">
            투자 대비 <span className="font-bold text-ink">{result.multiple.toFixed(1)}x</span> 수익
          </p>
        )}
      </div>

      {/* What can I buy */}
      {result.netProfit > 0 && (
        <div className="border border-ink/10 rounded-lg p-5">
          <p className="text-xs text-ink/40 mb-2 text-center">이 금액이면?</p>
          <p className="font-serif text-xl font-bold text-ink text-center">
            {whatCanIBuy.current}
          </p>
          <p className="text-xs text-ink/40 mt-1 text-center">
            순이익 {formatKRW(result.netProfit)} 기준
          </p>
          {whatCanIBuy.next && (
            <p className="text-[11px] text-ink/30 mt-3 text-center border-t border-ink/5 pt-3">
              다음 목표: <span className="font-bold text-ink/50">{whatCanIBuy.next}</span>
              <span className="text-ink/25"> ({formatKRW(whatCanIBuy.nextAmount)} 필요)</span>
            </p>
          )}
        </div>
      )}

      {/* Disclaimer */}
      <div className="border-t border-ink/5 pt-4 space-y-1">
        <p className="text-[11px] text-ink/30 leading-relaxed">
          본 계산기는 참고용이며, 실제 스톡옵션 행사 시에는 세금(근로소득세, 양도소득세),
          베스팅 조건, 우선주 청산 우선권 등을 반드시 고려하셔야 합니다.
        </p>
        <p className="text-[11px] text-ink/30 leading-relaxed">
          계산 결과는 입력된 가정에 기반한 추정치로, 실제 수익과 다를 수 있습니다.
          모든 데이터는 브라우저에서만 처리되며, 서버에 전송되거나 저장되지 않습니다.
        </p>
      </div>
    </div>
  );
}

// ─── Helpers ────────────────────────────────────────────────────

function formatKRW(amount: number): string {
  if (amount >= 1e12) return `${(amount / 1e12).toFixed(1)}조 원`;
  if (amount >= 1e8) return `${(amount / 1e8).toFixed(1)}억 원`;
  if (amount >= 1e4) return `${(amount / 1e4).toFixed(0)}만 원`;
  return `${amount.toLocaleString()}원`;
}

function ResultCard({
  label, value, highlight,
}: {
  label: string; value: string; highlight?: boolean;
}) {
  return (
    <div className={`border rounded-lg p-3 ${highlight ? 'border-emerald-500/30 bg-emerald-500/[0.03]' : 'border-ink/8'}`}>
      <p className="text-[11px] text-ink/45">{label}</p>
      <p className={`text-base font-bold mt-1 tabular-nums ${highlight ? 'text-emerald-600' : 'text-ink'}`}>
        {value}
      </p>
    </div>
  );
}
