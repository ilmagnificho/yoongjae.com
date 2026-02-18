import { useState, useMemo } from 'react';

// ─── Types ──────────────────────────────────────────────────────

interface SimulationResult {
  capPrice: number;
  discountPrice: number;
  effectivePrice: number;
  triggerMethod: 'cap' | 'discount' | 'none';
  sharesIssued: number;
  ownershipPercent: number;
  impliedPostMoney: number;
}

// ─── Main Component ─────────────────────────────────────────────

export default function SafeSimulator() {
  const [investmentAmount, setInvestmentAmount] = useState(5); // 억 원
  const [valuationCap, setValuationCap] = useState(100); // 억 원
  const [discountRate, setDiscountRate] = useState(20); // %
  const [preMoneyValuation, setPreMoneyValuation] = useState(150); // 억 원 (Series A pre-money)
  const [totalShares, setTotalShares] = useState(1000000); // 기존 발행 주식수

  const result = useMemo<SimulationResult>(() => {
    if (totalShares <= 0 || preMoneyValuation <= 0) {
      return { capPrice: 0, discountPrice: 0, effectivePrice: 0, triggerMethod: 'none', sharesIssued: 0, ownershipPercent: 0, impliedPostMoney: 0 };
    }

    const pricePerShare = (preMoneyValuation * 1e8) / totalShares; // 원 단위

    // Cap price: valuation cap / total shares
    const capPrice = valuationCap > 0 ? (valuationCap * 1e8) / totalShares : Infinity;

    // Discount price: current price * (1 - discount%)
    const discountPrice = discountRate > 0 ? pricePerShare * (1 - discountRate / 100) : Infinity;

    // Investor gets the lower price (more shares)
    let effectivePrice: number;
    let triggerMethod: 'cap' | 'discount' | 'none';

    if (capPrice <= discountPrice) {
      effectivePrice = capPrice;
      triggerMethod = 'cap';
    } else {
      effectivePrice = discountPrice;
      triggerMethod = 'discount';
    }

    if (!isFinite(effectivePrice) || effectivePrice <= 0) {
      effectivePrice = pricePerShare;
      triggerMethod = 'none';
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
    };
  }, [investmentAmount, valuationCap, discountRate, preMoneyValuation, totalShares]);

  const pricePerShare = totalShares > 0 ? (preMoneyValuation * 1e8) / totalShares : 0;

  // Bar chart widths (relative to max price)
  const maxPrice = Math.max(pricePerShare, result.capPrice || 0, result.discountPrice || 0, 1);

  return (
    <div className="mt-6 space-y-8">
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
        <InputField
          label="Valuation Cap (억 원)"
          value={valuationCap}
          onChange={setValuationCap}
          min={0}
          step={1}
          hint="전환 시 적용 최대 기업가치"
        />
        <InputField
          label="Discount Rate (%)"
          value={discountRate}
          onChange={setDiscountRate}
          min={0}
          max={50}
          step={1}
          hint="다음 라운드 가격 대비 할인율"
        />
        <InputField
          label="현재 Pre-money Valuation (억 원)"
          value={preMoneyValuation}
          onChange={setPreMoneyValuation}
          min={1}
          step={1}
          hint="SAFE 전환 시점의 라운드 밸류에이션"
        />
        <InputField
          label="기존 발행주식 수"
          value={totalShares}
          onChange={setTotalShares}
          min={1}
          step={10000}
          hint="전환 전 총 발행주식 수"
        />
      </div>

      {/* Price Comparison Bar */}
      <div className="border border-ink/10 rounded-lg p-5">
        <h3 className="text-xs font-semibold text-ink/50 mb-4">전환가격 비교</h3>
        <div className="space-y-3">
          <PriceBar
            label="라운드 주당가격"
            price={pricePerShare}
            maxPrice={maxPrice}
            color="bg-ink/20"
            active={false}
          />
          {result.capPrice > 0 && (
            <PriceBar
              label="Cap 기준 가격"
              price={result.capPrice}
              maxPrice={maxPrice}
              color="bg-accent-blue"
              active={result.triggerMethod === 'cap'}
            />
          )}
          {result.discountPrice > 0 && (
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
            : '→ Cap과 Discount 중 더 낮은 가격이 적용됩니다.'}
        </p>
      </div>

      {/* Results */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <ResultCard label="적용 주당가격" value={`₩${Math.round(result.effectivePrice).toLocaleString()}`} />
        <ResultCard label="발행 주식 수" value={result.sharesIssued.toLocaleString()} unit="주" />
        <ResultCard label="투자자 지분율" value={result.ownershipPercent.toFixed(2)} unit="%" highlight />
        <ResultCard label="Implied Post-money" value={result.impliedPostMoney.toFixed(1)} unit="억 원" />
      </div>

      {/* Disclaimer */}
      <p className="text-[11px] text-ink/30 leading-relaxed border-t border-ink/5 pt-4">
        본 시뮬레이터는 참고용이며, 실제 SAFE 전환 시에는 법률·세무 전문가의 검토를 받으시기 바랍니다.
        Pro-rata, MFN 등 추가 조항에 따라 실제 전환 결과가 달라질 수 있습니다.
      </p>
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
