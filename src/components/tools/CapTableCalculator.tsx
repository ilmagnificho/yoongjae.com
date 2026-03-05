import { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend, type PieLabelRenderProps } from 'recharts';

declare global { interface Window { __ga4?: { trackToolUse: (tool: string, action: string, params?: Record<string, unknown>) => void } } }

// ─── Types ──────────────────────────────────────────────────────

interface Shareholder {
  id: string;
  name: string;
  type: 'founder' | 'co-founder' | 'angel' | 'vc' | 'esop' | 'other';
  shares: number;
}

interface InvestmentRound {
  id: string;
  name: string;
  roundLabel: string;
  type: 'equity' | 'safe' | 'rcps' | 'cps';
  preMoneyValuation: number;
  investmentAmount: number;
  safeValuationCap: number;
  safeDiscount: number;
  safeConversionRound: string;
  conversionRatio: number; // 전환비율 (1주당 보통주 N주), default 1
  esopEnabled: boolean;
  esopPoolPercent: number;
  esopTiming: 'pre' | 'post';
}

interface RoundResult {
  roundName: string;
  shareholders: { name: string; type: string; shares: number; percent: number }[];
  totalShares: number;
}

// ─── Calculation Logic ──────────────────────────────────────────

function calculateCumulativeRounds(
  initialShareholders: Shareholder[],
  rounds: InvestmentRound[],
): RoundResult[] {
  const results: RoundResult[] = [];

  // Initial state
  let currentShareholders = initialShareholders.map((s) => ({
    name: s.name,
    type: s.type,
    shares: s.shares,
  }));

  const totalInitial = currentShareholders.reduce((sum, s) => sum + s.shares, 0);
  results.push({
    roundName: '현재',
    shareholders: currentShareholders.map((s) => ({
      ...s,
      percent: totalInitial > 0 ? (s.shares / totalInitial) * 100 : 0,
    })),
    totalShares: totalInitial,
  });

  for (const round of rounds) {
    if (round.investmentAmount <= 0 || round.preMoneyValuation <= 0) continue;

    let workingShareholders = currentShareholders.map((s) => ({ ...s }));
    let totalShares = workingShareholders.reduce((sum, s) => sum + s.shares, 0);

    // ESOP pool (pre-money)
    if (round.esopEnabled && round.esopPoolPercent > 0 && round.esopTiming === 'pre') {
      const esopShares = Math.round((totalShares * round.esopPoolPercent) / (100 - round.esopPoolPercent));
      const existing = workingShareholders.find((s) => s.type === 'esop');
      if (existing) {
        existing.shares += esopShares;
      } else {
        workingShareholders.push({ name: 'ESOP Pool', type: 'esop', shares: esopShares });
      }
      totalShares += esopShares;
    }

    // Calculate new shares for investor
    let newShares: number;

    if (round.type === 'safe') {
      // SAFE conversion
      const pricePerShareAtRound = (round.preMoneyValuation * 1e8) / totalShares;
      const priceAtCap = round.safeValuationCap > 0
        ? (round.safeValuationCap * 1e8) / totalShares
        : Infinity;
      const priceAtDiscount = round.safeDiscount > 0
        ? pricePerShareAtRound * (1 - round.safeDiscount / 100)
        : Infinity;
      const conversionPrice = Math.min(priceAtCap, priceAtDiscount, pricePerShareAtRound);
      newShares = conversionPrice > 0
        ? Math.round((round.investmentAmount * 1e8) / conversionPrice)
        : 0;
    } else {
      // Equity / RCPS / CPS: standard dilution
      const postMoney = round.preMoneyValuation + round.investmentAmount;
      const investorPercent = round.investmentAmount / postMoney;
      const baseShares = Math.round((totalShares * investorPercent) / (1 - investorPercent));
      // RCPS/CPS: apply conversion ratio (전환 시 보통주 전환비율)
      const ratio = (round.type === 'rcps' || round.type === 'cps') ? (round.conversionRatio || 1) : 1;
      newShares = Math.round(baseShares * ratio);
    }

    workingShareholders.push({
      name: `${round.roundLabel} 투자자`,
      type: 'vc',
      shares: newShares,
    });
    totalShares += newShares;

    // ESOP pool (post-money)
    if (round.esopEnabled && round.esopPoolPercent > 0 && round.esopTiming === 'post') {
      const esopShares = Math.round((totalShares * round.esopPoolPercent) / (100 - round.esopPoolPercent));
      const existing = workingShareholders.find((s) => s.type === 'esop');
      if (existing) {
        existing.shares += esopShares;
      } else {
        workingShareholders.push({ name: 'ESOP Pool', type: 'esop', shares: esopShares });
      }
      totalShares += esopShares;
    }

    currentShareholders = workingShareholders;

    results.push({
      roundName: round.roundLabel,
      shareholders: workingShareholders.map((s) => ({
        ...s,
        percent: totalShares > 0 ? (s.shares / totalShares) * 100 : 0,
      })),
      totalShares,
    });
  }

  return results;
}

// ─── Constants ──────────────────────────────────────────────────

const SHAREHOLDER_TYPES = [
  { value: 'founder', label: '창업자' },
  { value: 'co-founder', label: '공동창업자' },
  { value: 'angel', label: '엔젤' },
  { value: 'vc', label: 'VC' },
  { value: 'esop', label: 'ESOP풀' },
  { value: 'other', label: '기타' },
] as const;

const ROUND_PRESETS = ['Pre-Seed', 'Seed', 'Series A', 'Series B', 'Custom'] as const;

const COLORS = ['#1A1A1A', '#FF6719', '#2563EB', '#059669', '#8B5CF6', '#EC4899', '#F59E0B', '#6B7280', '#14B8A6', '#EF4444'];

let idCounter = 0;
const uid = () => `id-${++idCounter}-${Date.now()}`;

// ─── Sub-components ─────────────────────────────────────────────

function Tab({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm font-medium rounded-t-lg border-b-2 transition-colors ${
        active
          ? 'border-ink text-ink bg-ink/[0.03]'
          : 'border-transparent text-ink/40 hover:text-ink/60 hover:border-ink/20'
      }`}
    >
      {label}
    </button>
  );
}

// ─── Main Component ─────────────────────────────────────────────

export default function CapTableCalculator() {
  const [activeTab, setActiveTab] = useState(0);

  // Tab 1: Shareholders
  const [shareholders, setShareholders] = useState<Shareholder[]>([
    { id: uid(), name: '창업자', type: 'founder', shares: 600000 },
    { id: uid(), name: '공동창업자', type: 'co-founder', shares: 400000 },
  ]);

  // Tab 2: Rounds
  const [rounds, setRounds] = useState<InvestmentRound[]>([
    {
      id: uid(),
      name: 'Seed',
      roundLabel: 'Seed',
      type: 'equity',
      preMoneyValuation: 30,
      investmentAmount: 5,
      safeValuationCap: 30,
      safeDiscount: 20,
      safeConversionRound: '',
      conversionRatio: 1,
      esopEnabled: false,
      esopPoolPercent: 10,
      esopTiming: 'pre',
    },
  ]);

  // Tab 3: Slider overrides
  const [sliderOverrides, setSliderOverrides] = useState<Record<string, Partial<InvestmentRound>>>({});

  // Merged rounds with slider overrides
  const effectiveRounds = useMemo(
    () =>
      rounds.map((r) => ({
        ...r,
        ...sliderOverrides[r.id],
      })),
    [rounds, sliderOverrides],
  );

  const results = useMemo(
    () => calculateCumulativeRounds(shareholders, effectiveRounds),
    [shareholders, effectiveRounds],
  );

  // ── Shareholder CRUD ──

  const addShareholder = () => {
    setShareholders((prev) => [
      ...prev,
      { id: uid(), name: '', type: 'other', shares: 0 },
    ]);
  };

  const updateShareholder = (id: string, field: keyof Shareholder, value: string | number) => {
    setShareholders((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s)),
    );
  };

  const removeShareholder = (id: string) => {
    setShareholders((prev) => prev.filter((s) => s.id !== id));
  };

  // ── Round CRUD ──

  const addRound = () => {
    if (rounds.length >= 3) return;
    const presets = ['Pre-Seed', 'Seed', 'Series A'];
    const label = presets[rounds.length] || 'Series B';
    setRounds((prev) => [
      ...prev,
      {
        id: uid(),
        name: label,
        roundLabel: label,
        type: 'equity',
        preMoneyValuation: 50,
        investmentAmount: 10,
        safeValuationCap: 50,
        safeDiscount: 20,
        safeConversionRound: '',
        conversionRatio: 1,
        esopEnabled: false,
        esopPoolPercent: 10,
        esopTiming: 'pre',
      },
    ]);
    window.__ga4?.trackToolUse('cap-table', 'add_round', { round_label: label, total_rounds: rounds.length + 1 });
  };

  const updateRound = (id: string, field: keyof InvestmentRound, value: unknown) => {
    setRounds((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)),
    );
  };

  const removeRound = (id: string) => {
    setRounds((prev) => prev.filter((r) => r.id !== id));
    setSliderOverrides((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  // ── Slider update ──

  const updateSlider = (roundId: string, field: keyof InvestmentRound, value: number) => {
    setSliderOverrides((prev) => ({
      ...prev,
      [roundId]: { ...prev[roundId], [field]: value },
    }));
  };

  // ── Totals for Tab 1 ──

  const totalShares = shareholders.reduce((sum, s) => sum + s.shares, 0);

  // ── Render ────────────────────────────────────────────────────

  return (
    <div className="mt-6">
      {/* Tabs */}
      <div className="flex border-b border-ink/10 mb-6 gap-1 overflow-x-auto">
        <Tab label="1. 현재 주주 구성" active={activeTab === 0} onClick={() => setActiveTab(0)} />
        <Tab label="2. 투자 조건 설정" active={activeTab === 1} onClick={() => setActiveTab(1)} />
        <Tab label="3. 결과 시뮬레이션" active={activeTab === 2} onClick={() => setActiveTab(2)} />
      </div>

      {/* ─── Tab 1: 현재 주주 구성 ──────────────────────────── */}
      {activeTab === 0 && (
        <div>
          {/* Column headers */}
          <div className="hidden sm:flex items-center gap-2 mb-1 px-1 text-[10px] text-ink/35">
            <span className="flex-1 min-w-[100px]">주주명</span>
            <span className="min-w-[100px]">구분</span>
            <span className="w-[120px] text-right">주식 수 (주)</span>
            <span className="w-[50px] text-right">지분율</span>
            <span className="w-[24px]" />
          </div>
          <div className="space-y-3">
            {shareholders.map((s) => (
              <div key={s.id} className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                <input
                  type="text"
                  placeholder="주주명"
                  value={s.name}
                  onChange={(e) => updateShareholder(s.id, 'name', e.target.value)}
                  className="flex-1 min-w-[100px] bg-transparent border-b border-ink/15 py-2 px-1 text-sm focus:outline-none focus:border-ink/40 placeholder:text-ink/30"
                />
                <select
                  value={s.type}
                  onChange={(e) => updateShareholder(s.id, 'type', e.target.value)}
                  className="bg-transparent border-b border-ink/15 py-2 px-1 text-sm focus:outline-none focus:border-ink/40 min-w-[100px]"
                >
                  {SHAREHOLDER_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  placeholder="주식 수"
                  value={s.shares || ''}
                  onChange={(e) => updateShareholder(s.id, 'shares', Number(e.target.value) || 0)}
                  className="w-[120px] bg-transparent border-b border-ink/15 py-2 px-1 text-sm text-right focus:outline-none focus:border-ink/40 placeholder:text-ink/30"
                />
                <span className="text-xs text-ink/40 w-[50px] text-right">
                  {totalShares > 0 ? ((s.shares / totalShares) * 100).toFixed(1) : '0.0'}%
                </span>
                <button
                  onClick={() => removeShareholder(s.id)}
                  className="text-ink/25 hover:text-red-500 transition-colors text-lg leading-none px-1"
                  title="삭제"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={addShareholder}
            className="mt-4 text-sm text-accent-blue hover:text-accent-blue/80 transition-colors"
          >
            + 주주 추가
          </button>

          <div className="mt-6 pt-4 border-t border-ink/8 flex justify-between text-sm">
            <span className="text-ink/50">총 발행주식수</span>
            <span className="font-medium">{totalShares.toLocaleString()}주</span>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={() => setActiveTab(1)}
              className="px-5 py-2 bg-ink text-paper text-sm rounded-lg hover:bg-ink/80 transition-colors"
            >
              다음: 투자 조건 설정 &rarr;
            </button>
          </div>
        </div>
      )}

      {/* ─── Tab 2: 투자 조건 설정 ──────────────────────────── */}
      {activeTab === 1 && (
        <div className="space-y-6">
          {rounds.map((round, idx) => (
            <div key={round.id} className="border border-ink/10 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-serif font-semibold">라운드 {idx + 1}</h3>
                {rounds.length > 1 && (
                  <button
                    onClick={() => removeRound(round.id)}
                    className="text-xs text-ink/30 hover:text-red-500 transition-colors"
                  >
                    삭제
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Round label */}
                <div>
                  <label className="text-xs text-ink/45 block mb-1">라운드명</label>
                  <select
                    value={ROUND_PRESETS.includes(round.roundLabel as any) ? round.roundLabel : 'Custom'}
                    onChange={(e) => {
                      const v = e.target.value;
                      updateRound(round.id, 'roundLabel', v === 'Custom' ? round.name : v);
                      updateRound(round.id, 'name', v === 'Custom' ? round.name : v);
                    }}
                    className="w-full bg-transparent border-b border-ink/15 py-2 px-1 text-sm focus:outline-none focus:border-ink/40"
                  >
                    {ROUND_PRESETS.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>

                {/* Type */}
                <div>
                  <label className="text-xs text-ink/45 block mb-1">투자 방식</label>
                  <select
                    value={round.type}
                    onChange={(e) => updateRound(round.id, 'type', e.target.value)}
                    className="w-full bg-transparent border-b border-ink/15 py-2 px-1 text-sm focus:outline-none focus:border-ink/40"
                  >
                    <option value="equity">보통주 신규 발행</option>
                    <option value="rcps">RCPS (상환전환우선주)</option>
                    <option value="cps">CPS (전환우선주)</option>
                    <option value="safe">SAFE</option>
                  </select>
                </div>

                {/* Pre-money */}
                <div>
                  <label className="text-xs text-ink/45 block mb-1">Pre-money Valuation (억 원)</label>
                  <input
                    type="number"
                    value={round.preMoneyValuation || ''}
                    onChange={(e) => updateRound(round.id, 'preMoneyValuation', Number(e.target.value) || 0)}
                    className="w-full bg-transparent border-b border-ink/15 py-2 px-1 text-sm focus:outline-none focus:border-ink/40"
                  />
                </div>

                {/* Investment amount */}
                <div>
                  <label className="text-xs text-ink/45 block mb-1">투자금액 (억 원)</label>
                  <input
                    type="number"
                    value={round.investmentAmount || ''}
                    onChange={(e) => updateRound(round.id, 'investmentAmount', Number(e.target.value) || 0)}
                    className="w-full bg-transparent border-b border-ink/15 py-2 px-1 text-sm focus:outline-none focus:border-ink/40"
                  />
                </div>

                {/* Post-money (calculated) */}
                <div className="sm:col-span-2">
                  <label className="text-xs text-ink/45 block mb-1">Post-money Valuation</label>
                  <div className="py-2 px-1 text-sm font-medium">
                    {(round.preMoneyValuation + round.investmentAmount).toLocaleString()}억 원
                  </div>
                </div>
              </div>

              {/* SAFE settings */}
              {round.type === 'safe' && (
                <div className="mt-4 pt-4 border-t border-ink/8">
                  <h4 className="text-xs font-semibold text-ink/50 mb-3">SAFE 설정</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-ink/45 block mb-1">Valuation Cap (억 원)</label>
                      <input
                        type="number"
                        value={round.safeValuationCap || ''}
                        onChange={(e) => updateRound(round.id, 'safeValuationCap', Number(e.target.value) || 0)}
                        className="w-full bg-transparent border-b border-ink/15 py-2 px-1 text-sm focus:outline-none focus:border-ink/40"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-ink/45 block mb-1">Discount Rate (%)</label>
                      <input
                        type="number"
                        value={round.safeDiscount || ''}
                        onChange={(e) => updateRound(round.id, 'safeDiscount', Number(e.target.value) || 0)}
                        className="w-full bg-transparent border-b border-ink/15 py-2 px-1 text-sm focus:outline-none focus:border-ink/40"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* RCPS / CPS settings */}
              {(round.type === 'rcps' || round.type === 'cps') && (
                <div className="mt-4 pt-4 border-t border-ink/8">
                  <h4 className="text-xs font-semibold text-ink/50 mb-3">
                    {round.type === 'rcps' ? 'RCPS 설정' : 'CPS 설정'}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-ink/45 block mb-1">전환비율 (우선주 1주당 보통주)</label>
                      <input
                        type="number"
                        step="0.1"
                        min="0.1"
                        value={round.conversionRatio || ''}
                        onChange={(e) => updateRound(round.id, 'conversionRatio', Number(e.target.value) || 1)}
                        className="w-full bg-transparent border-b border-ink/15 py-2 px-1 text-sm focus:outline-none focus:border-ink/40"
                      />
                      <p className="text-[10px] text-ink/35 mt-1">기본 1:1, 희석방지 조항 적용 시 1:1 이상</p>
                    </div>
                  </div>
                </div>
              )}

              {/* ESOP settings */}
              <div className="mt-4 pt-4 border-t border-ink/8">
                <div className="flex items-center gap-3 mb-3">
                  <h4 className="text-xs font-semibold text-ink/50">ESOP 옵션풀</h4>
                  <button
                    onClick={() => updateRound(round.id, 'esopEnabled', !round.esopEnabled)}
                    className={`relative w-9 h-5 rounded-full transition-colors ${
                      round.esopEnabled ? 'bg-accent-blue' : 'bg-ink/15'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform shadow-sm ${
                        round.esopEnabled ? 'translate-x-4' : ''
                      }`}
                    />
                  </button>
                </div>
                {round.esopEnabled && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-ink/45 block mb-1">옵션풀 비율 (%)</label>
                      <input
                        type="number"
                        value={round.esopPoolPercent || ''}
                        onChange={(e) => updateRound(round.id, 'esopPoolPercent', Number(e.target.value) || 0)}
                        className="w-full bg-transparent border-b border-ink/15 py-2 px-1 text-sm focus:outline-none focus:border-ink/40"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-ink/45 block mb-1">적용 시점</label>
                      <select
                        value={round.esopTiming}
                        onChange={(e) => updateRound(round.id, 'esopTiming', e.target.value)}
                        className="w-full bg-transparent border-b border-ink/15 py-2 px-1 text-sm focus:outline-none focus:border-ink/40"
                      >
                        <option value="pre">투자 전 (Pre-money)</option>
                        <option value="post">투자 후 (Post-money)</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {rounds.length < 3 && (
            <button
              onClick={addRound}
              className="w-full border border-dashed border-ink/15 rounded-lg py-3 text-sm text-ink/40 hover:text-ink/60 hover:border-ink/25 transition-colors"
            >
              + 라운드 추가 (최대 3개)
            </button>
          )}

          <div className="flex justify-between">
            <button
              onClick={() => setActiveTab(0)}
              className="px-5 py-2 border border-ink/15 text-sm rounded-lg hover:bg-ink/[0.03] transition-colors"
            >
              &larr; 이전
            </button>
            <button
              onClick={() => setActiveTab(2)}
              className="px-5 py-2 bg-ink text-paper text-sm rounded-lg hover:bg-ink/80 transition-colors"
            >
              결과 확인 &rarr;
            </button>
          </div>
        </div>
      )}

      {/* ─── Tab 3: 결과 시뮬레이션 ─────────────────────────── */}
      {activeTab === 2 && (
        <div>
          {/* Sliders */}
          <div className="mb-8 space-y-4 border border-ink/10 rounded-lg p-4">
            <h3 className="text-xs font-semibold text-ink/50 mb-2">변수 조정 (슬라이더)</h3>
            {rounds.map((round) => {
              const eff = effectiveRounds.find((r) => r.id === round.id)!;
              return (
                <div key={round.id} className="space-y-3">
                  <p className="text-sm font-medium">{round.roundLabel}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-[11px] text-ink/45 flex justify-between">
                        <span>Pre-money (억)</span>
                        <span className="font-medium text-ink">{eff.preMoneyValuation}</span>
                      </label>
                      <input
                        type="range"
                        min={1}
                        max={500}
                        step={1}
                        value={eff.preMoneyValuation}
                        onChange={(e) => updateSlider(round.id, 'preMoneyValuation', Number(e.target.value))}
                        className="w-full accent-ink h-1"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-ink/45 flex justify-between">
                        <span>투자금액 (억)</span>
                        <span className="font-medium text-ink">{eff.investmentAmount}</span>
                      </label>
                      <input
                        type="range"
                        min={0.5}
                        max={100}
                        step={0.5}
                        value={eff.investmentAmount}
                        onChange={(e) => updateSlider(round.id, 'investmentAmount', Number(e.target.value))}
                        className="w-full accent-ink h-1"
                      />
                    </div>
                    {round.type === 'safe' && (
                      <div>
                        <label className="text-[11px] text-ink/45 flex justify-between">
                          <span>Discount (%)</span>
                          <span className="font-medium text-ink">{eff.safeDiscount}</span>
                        </label>
                        <input
                          type="range"
                          min={0}
                          max={50}
                          step={1}
                          value={eff.safeDiscount}
                          onChange={(e) => updateSlider(round.id, 'safeDiscount', Number(e.target.value))}
                          className="w-full accent-ink h-1"
                        />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Results layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-ink/10">
                    <th className="text-left py-2 pr-3 text-xs text-ink/45 font-medium">주주명</th>
                    {results.map((r) => (
                      <th key={r.roundName} className="text-right py-2 px-2 text-xs text-ink/45 font-medium">
                        {r.roundName}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    const allNames = new Set<string>();
                    for (const r of results) {
                      for (const s of r.shareholders) allNames.add(s.name);
                    }
                    return Array.from(allNames).map((name) => (
                      <tr key={name} className="border-b border-ink/5">
                        <td className="py-2 pr-3 font-medium">{name}</td>
                        {results.map((r) => {
                          const s = r.shareholders.find((sh) => sh.name === name);
                          return (
                            <td key={r.roundName} className="text-right py-2 px-2 text-ink/70 tabular-nums">
                              {s ? `${s.percent.toFixed(1)}%` : '-'}
                            </td>
                          );
                        })}
                      </tr>
                    ));
                  })()}
                </tbody>
              </table>
            </div>

            {/* Pie Chart */}
            <div>
              <PieChartSection results={results} />
            </div>
          </div>

          {/* Dilution summary cards */}
          {results.length > 1 && (
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {(() => {
                const initial = results[0];
                return initial.shareholders.map((initSh) => {
                  const final = results[results.length - 1].shareholders.find(
                    (s) => s.name === initSh.name,
                  );
                  const finalPct = final?.percent ?? 0;
                  const diff = finalPct - initSh.percent;
                  return (
                    <div
                      key={initSh.name}
                      className="border border-ink/8 rounded-lg p-3"
                    >
                      <p className="text-sm font-medium">{initSh.name}</p>
                      <p className="text-xs text-ink/50 mt-1">
                        {initSh.percent.toFixed(1)}% &rarr; {finalPct.toFixed(1)}%
                        <span
                          className={`ml-1 font-medium ${diff < 0 ? 'text-red-500' : 'text-emerald-600'}`}
                        >
                          ({diff > 0 ? '+' : ''}{diff.toFixed(1)}%p)
                        </span>
                      </p>
                    </div>
                  );
                });
              })()}
            </div>
          )}

          {/* Actions */}
          <div className="mt-8">
            <button
              onClick={() => setActiveTab(1)}
              className="px-5 py-2 border border-ink/15 text-sm rounded-lg hover:bg-ink/[0.03] transition-colors"
            >
              &larr; 조건 수정
            </button>
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="mt-10 border-t border-ink/5 pt-4 space-y-1">
        <p className="text-[11px] text-ink/30 leading-relaxed">
          본 계산기는 참고용이며, 실제 투자 계약 시에는 법률·세무 전문가의 검토를 받으시기 바랍니다.
          계산 결과는 입력된 가정에 기반한 추정치로, 실제 지분 구조와 다를 수 있습니다.
        </p>
        <p className="text-[11px] text-ink/30 leading-relaxed">
          모든 데이터는 브라우저에서만 처리되며, 서버에 전송되거나 저장되지 않습니다.
        </p>
      </div>
    </div>
  );
}

// ─── Pie label renderer ─────────────────────────────────────────

const RADIAN = Math.PI / 180;

function renderPieLabel(props: PieLabelRenderProps) {
  const { cx, cy, midAngle, outerRadius, value } = props;
  const cxN = Number(cx);
  const cyN = Number(cy);
  const orN = Number(outerRadius);
  const radius = orN + 16;
  const x = cxN + radius * Math.cos(-Number(midAngle) * RADIAN);
  const y = cyN + radius * Math.sin(-Number(midAngle) * RADIAN);
  return (
    <text
      x={x}
      y={y}
      textAnchor={x > cxN ? 'start' : 'end'}
      dominantBaseline="central"
      fontSize={11}
      fill="rgba(26,26,26,0.7)"
    >
      {Number(value).toFixed(1)}%
    </text>
  );
}

// ─── Pie Chart Sub-component ────────────────────────────────────

function PieChartSection({ results }: { results: RoundResult[] }) {
  const [selectedRound, setSelectedRound] = useState(results.length - 1);
  const safeIdx = Math.min(selectedRound, results.length - 1);
  const data = results[safeIdx].shareholders.map((s) => ({
    name: s.name,
    value: Number(s.percent.toFixed(1)),
  }));

  return (
    <div>
      <div className="flex gap-1 mb-3 flex-wrap">
        {results.map((r, i) => (
          <button
            key={r.roundName}
            onClick={() => setSelectedRound(i)}
            className={`text-xs px-2.5 py-1 rounded-full transition-colors ${
              safeIdx === i
                ? 'bg-ink text-paper'
                : 'bg-ink/[0.05] text-ink/50 hover:text-ink'
            }`}
          >
            {r.roundName}
          </button>
        ))}
      </div>
      <ResponsiveContainer width="100%" height={340}>
        <PieChart margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
          <Pie
            data={data}
            cx="50%"
            cy="42%"
            innerRadius={50}
            outerRadius={85}
            paddingAngle={2}
            dataKey="value"
            label={renderPieLabel}
            labelLine={{ stroke: 'rgba(26,26,26,0.15)', strokeWidth: 1 }}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => `${value}%`}
            contentStyle={{
              background: '#F5F0EB',
              border: '1px solid rgba(26,26,26,0.1)',
              borderRadius: '8px',
              fontSize: '12px',
            }}
          />
          <Legend
            verticalAlign="bottom"
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: '11px', color: 'rgba(26,26,26,0.55)', paddingTop: '8px' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
