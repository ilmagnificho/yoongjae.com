import { useState, useMemo } from 'react';

// ─── Types ──────────────────────────────────────────────────────

type SafeType = 'cap_only' | 'discount_only' | 'cap_and_discount' | 'mfn';

interface SimulationResult {
  capPrice: number;
  discountPrice: number;
  effectivePrice: number;
  triggerMethod: 'cap' | 'discount' | 'round' | 'none';
  sharesIssued: number;
  ownershipPercent: number;
  impliedPostMoney: number;
  postMoneyOwnership: number; // Post-money SAFE 기준 지분율
}

const SAFE_TYPES: { value: SafeType; label: string; desc: string }[] = [
  { value: 'cap_only', label: 'Valuation Cap, No Discount', desc: '가장 일반적 (미국 SAFE의 61%)' },
  { value: 'discount_only', label: 'Discount, No Valuation Cap', desc: '할인율만 적용' },
  { value: 'cap_and_discount', label: 'Valuation Cap + Discount', desc: '둘 다 적용, 유리한 조건 선택' },
  { value: 'mfn', label: 'MFN (Most Favored Nation)', desc: 'Cap/Discount 없이, 향후 더 유리한 조건 자동 적용' },
];

// ─── Main Component ─────────────────────────────────────────────

export default function SafeSimulator() {
  const [safeType, setSafeType] = useState<SafeType>('cap_only');
  const [investmentAmount, setInvestmentAmount] = useState(5); // 억 원
  const [valuationCap, setValuationCap] = useState(100); // 억 원 (post-money)
  const [discountRate, setDiscountRate] = useState(20); // %
  const [preMoneyValuation, setPreMoneyValuation] = useState(150); // 억 원
  const [totalShares, setTotalShares] = useState(1000000);

  const hasCap = safeType === 'cap_only' || safeType === 'cap_and_discount';
  const hasDiscount = safeType === 'discount_only' || safeType === 'cap_and_discount';
  const isMfn = safeType === 'mfn';

  const result = useMemo<SimulationResult>(() => {
    if (totalShares <= 0 || preMoneyValuation <= 0) {
      return { capPrice: 0, discountPrice: 0, effectivePrice: 0, triggerMethod: 'none', sharesIssued: 0, ownershipPercent: 0, impliedPostMoney: 0, postMoneyOwnership: 0 };
    }

    const pricePerShare = (preMoneyValuation * 1e8) / totalShares;

    // Post-money SAFE: ownership = investment / post-money valuation cap
    const postMoneyOwnership = hasCap && valuationCap > 0
      ? (investmentAmount / valuationCap) * 100
      : 0;

    // Cap price
    const capPrice = hasCap && valuationCap > 0
      ? (valuationCap * 1e8) / totalShares
      : Infinity;

    // Discount price
    const discountPrice = hasDiscount && discountRate > 0
      ? pricePerShare * (1 - discountRate / 100)
      : Infinity;

    // MFN: converts at round price (no benefit)
    let effectivePrice: number;
    let triggerMethod: 'cap' | 'discount' | 'round' | 'none';

    if (isMfn) {
      effectivePrice = pricePerShare;
      triggerMethod = 'round';
    } else if (hasCap && hasDiscount) {
      // Both: pick the lower (better for investor)
      if (capPrice <= discountPrice) {
        effectivePrice = capPrice;
        triggerMethod = 'cap';
      } else {
        effectivePrice = discountPrice;
        triggerMethod = 'discount';
      }
    } else if (hasCap) {
      effectivePrice = Math.min(capPrice, pricePerShare);
      triggerMethod = capPrice < pricePerShare ? 'cap' : 'round';
    } else if (hasDiscount) {
      effectivePrice = discountPrice;
      triggerMethod = 'discount';
    } else {
      effectivePrice = pricePerShare;
      triggerMethod = 'round';
    }

    if (!isFinite(effectivePrice) || effectivePrice <= 0) {
      effectivePrice = pricePerShare;
      triggerMethod = 'round';
    }

    const sharesIssued = Math.round((investmentAmount * 1e8) / effectivePrice);
    const totalAfter = totalShares + sharesIssued;
    const ownershipPercent = totalAfter > 0 ? (sharesIssued / totalAfter) * 100 : 0;
    const impliedPostMoney = effectivePrice * totalAfter / 1e8;

    return {
      capPrice: capPrice === Infinity ? 0 : capPrice,
      discountPrice: discountPrice === Infinity ? 0 : discountPrice,
      effectivePrice,
      triggerMethod,
      sharesIssued,
      ownershipPercent,
      impliedPostMoney,
      postMoneyOwnership,
    };
  }, [investmentAmount, valuationCap, discountRate, preMoneyValuation, totalShares, safeType, hasCap, hasDiscount, isMfn]);

  const pricePerShare = totalShares > 0 ? (preMoneyValuation * 1e8) / totalShares : 0;
  const maxPrice = Math.max(pricePerShare, result.capPrice || 0, result.discountPrice || 0, 1);

  return (
    <div className="mt-6 space-y-8">
      {/* SAFE Type Selector */}
      <div>
        <h3 className="text-xs font-semibold text-ink/50 mb-3">SAFE 유형 선택 (YC Post-Money SAFE 기준)</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {SAFE_TYPES.map((type) => (
            <button
              key={type.value}
              onClick={() => setSafeType(type.value)}
              className={`text-left border rounded-lg p-3 transition-all ${
                safeType === type.value
                  ? 'border-accent-blue bg-accent-blue/[0.04]'
                  : 'border-ink/10 hover:border-ink/20'
              }`}
            >
              <p className={`text-xs font-bold ${safeType === type.value ? 'text-accent-blue' : 'text-ink'}`}>
                {type.label}
              </p>
              <p className="text-[10px] text-ink/40 mt-0.5">{type.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <InputField
          label="투자금액 (억 원)"
          value={investmentAmount}
          onChange={setInvestmentAmount}
          min={0.1}
          step={0.5}
          hint="SAFE 투자 금액"
        />
        {hasCap && (
          <InputField
            label="Post-Money Valuation Cap (억 원)"
            value={valuationCap}
            onChange={setValuationCap}
            min={1}
            step={1}
            hint="투자금 포함 기업가치 상한 (Post-money 기준)"
          />
        )}
        {hasDiscount && (
          <InputField
            label="Discount Rate (%)"
            value={discountRate}
            onChange={setDiscountRate}
            min={1}
            max={50}
            step={1}
            hint="다음 라운드 가격 대비 할인율 (보통 15–25%)"
          />
        )}
        <InputField
          label="다음 라운드 Pre-money Valuation (억 원)"
          value={preMoneyValuation}
          onChange={setPreMoneyValuation}
          min={1}
          step={1}
          hint="SAFE가 전환되는 Equity Financing 라운드의 밸류에이션"
        />
        <InputField
          label="기존 발행주식 수"
          value={totalShares}
          onChange={setTotalShares}
          min={1}
          step={10000}
          hint="전환 전 총 발행주식 수 (ESOP 풀 포함)"
        />
      </div>

      {/* MFN Info */}
      {isMfn && (
        <div className="border border-amber-500/20 bg-amber-500/[0.04] rounded-lg p-4">
          <p className="text-xs text-ink/70 leading-relaxed">
            <strong>MFN (Most Favored Nation)</strong>: Cap이나 Discount 없이 투자합니다.
            이후 회사가 더 유리한 조건(Cap 또는 Discount)의 SAFE를 발행하면,
            MFN 투자자는 해당 조건으로 자동 전환을 요청할 수 있습니다.
            현재 시뮬레이션에서는 라운드 가격 그대로 전환되는 시나리오를 보여줍니다.
          </p>
        </div>
      )}

      {/* Post-money ownership (Cap only) */}
      {hasCap && result.postMoneyOwnership > 0 && (
        <div className="border border-accent-blue/20 bg-accent-blue/[0.03] rounded-lg p-4">
          <p className="text-xs text-ink/60 leading-relaxed">
            <strong>Post-Money SAFE 기준:</strong> 투자금 {investmentAmount}억 ÷ Cap {valuationCap}억 = {' '}
            <span className="font-bold text-accent-blue">{result.postMoneyOwnership.toFixed(2)}%</span> 지분
            (다음 라운드 밸류에이션과 무관하게 확정)
          </p>
        </div>
      )}

      {/* Price Comparison Bar */}
      {!isMfn && (
        <div className="border border-ink/10 rounded-lg p-5">
          <h3 className="text-xs font-semibold text-ink/50 mb-4">전환가격 비교</h3>
          <div className="space-y-3">
            <PriceBar
              label="라운드 주당가격"
              price={pricePerShare}
              maxPrice={maxPrice}
              color="bg-ink/20"
              active={result.triggerMethod === 'round'}
            />
            {hasCap && result.capPrice > 0 && (
              <PriceBar
                label="Cap 기준 가격"
                price={result.capPrice}
                maxPrice={maxPrice}
                color="bg-accent-blue"
                active={result.triggerMethod === 'cap'}
              />
            )}
            {hasDiscount && result.discountPrice > 0 && (
              <PriceBar
                label={`Discount (${discountRate}%) 기준`}
                price={result.discountPrice}
                maxPrice={maxPrice}
                color="bg-accent-orange"
                active={result.triggerMethod === 'discount'}
              />
            )}
          </div>
          <p className="text-[11px] text-ink/40 mt-3">
            {result.triggerMethod === 'cap'
              ? '→ Valuation Cap 가격이 더 낮으므로, Cap 기준으로 전환됩니다.'
              : result.triggerMethod === 'discount'
              ? '→ Discount 가격이 더 낮으므로, 할인율 기준으로 전환됩니다.'
              : result.triggerMethod === 'round'
              ? '→ 라운드 가격 그대로 전환됩니다 (Cap/Discount 혜택 없음).'
              : ''}
          </p>
        </div>
      )}

      {/* Results */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <ResultCard label="적용 주당가격" value={`₩${Math.round(result.effectivePrice).toLocaleString()}`} />
        <ResultCard label="발행 주식 수" value={result.sharesIssued.toLocaleString()} unit="주" />
        <ResultCard label="투자자 지분율" value={result.ownershipPercent.toFixed(2)} unit="%" highlight />
        <ResultCard label="Implied Post-money" value={result.impliedPostMoney.toFixed(1)} unit="억 원" />
      </div>

      {/* Disclaimer */}
      <div className="border-t border-ink/5 pt-4 space-y-1">
        <p className="text-[11px] text-ink/30 leading-relaxed">
          본 시뮬레이터는 Y Combinator Post-Money SAFE 구조를 기반으로 한 참고용 도구이며,
          실제 SAFE 전환 시에는 법률·세무 전문가의 검토를 받으시기 바랍니다.
        </p>
        <p className="text-[11px] text-ink/30 leading-relaxed">
          Pro-rata 권리, MFN 조항, 청산우선권, 후속 SAFE 간 상호작용 등에 따라 실제 전환 결과가 달라질 수 있습니다.
          계산 결과는 입력된 가정에 기반한 추정치로, 실제 지분 구조와 다를 수 있습니다.
          모든 데이터는 브라우저에서만 처리되며, 서버에 전송되거나 저장되지 않습니다.
        </p>
      </div>
    </div>
  );
}

// ─── Sub-components ─────────────────────────────────────────────

function InputField({
  label, value, onChange, min = 0, max, step = 1, hint,
}: {
  label: string; value: number; onChange: (v: number) => void;
  min?: number; max?: number; step?: number; hint?: string;
}) {
  return (
    <div>
      <label className="text-xs text-ink/45 block mb-1">{label}</label>
      <input
        type="number"
        value={value || ''}
        onChange={(e) => onChange(Number(e.target.value) || 0)}
        min={min}
        max={max}
        step={step}
        className="w-full bg-transparent border-b border-ink/15 py-2 px-1 text-sm focus:outline-none focus:border-ink/40"
      />
      {hint && <p className="text-[10px] text-ink/30 mt-1">{hint}</p>}
    </div>
  );
}

function PriceBar({
  label, price, maxPrice, color, active,
}: {
  label: string; price: number; maxPrice: number; color: string; active: boolean;
}) {
  const width = maxPrice > 0 ? Math.max((price / maxPrice) * 100, 2) : 2;
  return (
    <div>
      <div className="flex justify-between text-[11px] mb-1">
        <span className={active ? 'text-ink font-bold' : 'text-ink/50'}>
          {label} {active && '✓'}
        </span>
        <span className={active ? 'text-ink font-bold tabular-nums' : 'text-ink/50 tabular-nums'}>
          ₩{Math.round(price).toLocaleString()}
        </span>
      </div>
      <div className="h-2.5 bg-ink/[0.04] rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${color} ${active ? 'opacity-100' : 'opacity-40'}`}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}

function ResultCard({
  label, value, unit, highlight,
}: {
  label: string; value: string; unit?: string; highlight?: boolean;
}) {
  return (
    <div className={`border rounded-lg p-3 ${highlight ? 'border-accent-blue/30 bg-accent-blue/[0.03]' : 'border-ink/8'}`}>
      <p className="text-[11px] text-ink/45">{label}</p>
      <p className={`text-lg font-bold mt-1 tabular-nums ${highlight ? 'text-accent-blue' : 'text-ink'}`}>
        {value}
        {unit && <span className="text-xs font-normal text-ink/40 ml-0.5">{unit}</span>}
      </p>
    </div>
  );
}
