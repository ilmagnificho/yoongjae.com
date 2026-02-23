import { useState } from 'react';
import type { DashboardData } from './data';
import { useChartCanvas } from './useChart';
import { V, Card, SectionTitle, SimCard, BigNum } from './ui';

export default function SimulatorPanel({ data, Chart }: { data: DashboardData; Chart: any }) {
  const [postsPerWeek, setPostsPerWeek] = useState(2);
  const lastFol = data.followers[data.followers.length - 1]?.cumulative ?? 0;
  const currentFollowers = 421 + lastFol;
  const needed = 1000 - currentFollowers;
  const baseRate = 2.5;
  const rate = baseRate * (postsPerWeek / 2);
  const weeks = Math.ceil(Math.max(needed, 0) / rate);
  const targetDate = new Date('2026-02-23');
  targetDate.setDate(targetDate.getDate() + weeks * 7);

  const labels = ['현재'];
  const projData = [currentFollowers];
  for (let w = 1; w <= Math.min(weeks + 4, 52); w++) {
    const d = new Date('2026-02-23');
    d.setDate(d.getDate() + w * 7);
    labels.push(`${d.getMonth() + 1}/${d.getDate()}`);
    projData.push(Math.min(currentFollowers + rate * w, 1200));
  }

  const projRef = useChartCanvas(Chart, {
    type: 'line',
    data: {
      labels,
      datasets: [
        { label: '예상 팔로워', data: projData, borderColor: V.accent3, backgroundColor: 'rgba(0,229,160,0.08)', borderWidth: 2, pointRadius: 2, fill: true, tension: 0.3 },
        { label: '목표 (1,000)', data: labels.map(() => 1000), borderColor: 'rgba(255,217,61,0.5)', borderWidth: 1, borderDash: [6, 4], pointRadius: 0, fill: false },
      ],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { labels: { boxWidth: 12, padding: 12 } } },
      scales: { x: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { maxTicksLimit: 8 } }, y: { grid: { color: 'rgba(255,255,255,0.04)' }, min: 400, max: 1100 } },
    },
  }, [postsPerWeek, data]);

  const totalImp = data.engagement.reduce((s, d) => s + d.impressions, 0);
  const totalEng = data.engagement.reduce((s, d) => s + d.engagement, 0);
  const avgRate = totalImp > 0 ? (totalEng / totalImp * 100).toFixed(2) : '0';

  const scenarios = [
    { title: '현재 유지 (주 2회)', wk: Math.ceil(needed / (baseRate * 1)), color: V.text2, barW: 30 },
    { title: '발행 2배 (주 4회)', wk: Math.ceil(needed / (baseRate * 2)), color: V.accent, barW: 60 },
    { title: '바이럴 1회 포함', wk: Math.ceil(Math.max(needed - 50, 0) / (baseRate * 2)), color: V.accent3, barW: 90 },
  ];

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }} className="grid-resp-2">
        <Card>
          <SectionTitle>팔로워 1,000명 달성 시뮬레이터</SectionTitle>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <SimCard label="현재 팔로워"><BigNum value={`${currentFollowers}명`} color={V.text} /></SimCard>
            <SimCard label="목표까지 남은 팔로워"><BigNum value={`${Math.max(needed, 0)}명`} color={V.accent3} /></SimCard>
            <div>
              <div style={{ fontSize: '0.78rem', color: V.text2, marginBottom: 6 }}>
                주간 발행 횟수 조절: <strong style={{ color: V.accent }}>{postsPerWeek}회/주</strong>
              </div>
              <input type="range" min={1} max={7} value={postsPerWeek}
                onChange={e => setPostsPerWeek(Number(e.target.value))}
                style={{ width: '100%', accentColor: V.accent }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: V.text2 }}>
                <span>1회</span><span>4회</span><span>7회</span>
              </div>
            </div>
            <SimCard label="예상 도달 주수">
              <BigNum value={`${weeks}주`} color={V.accent3} />
              <div style={{ fontSize: '0.72rem', color: V.text2, marginTop: 4 }}>약 {targetDate.toLocaleDateString('ko-KR')} 도달 예상</div>
            </SimCard>
          </div>
        </Card>
        <Card>
          <SectionTitle>팔로워 성장 예측 그래프</SectionTitle>
          <div style={{ position: 'relative', height: 260 }}><canvas ref={projRef} /></div>
          <div style={{ marginTop: 12, padding: 12, background: V.surface2, borderRadius: 8, fontSize: '0.78rem', color: V.text2, lineHeight: 1.6 }}>
            현재 기간 평균: <strong style={{ color: V.text }}>2.5명/주</strong><br />
            최근 2주 (바이럴 이후): <strong style={{ color: V.accent3 }}>~18명/주</strong><br />
            시뮬레이터는 발행 횟수에 비례해 성장률을 예측합니다.
          </div>
        </Card>
      </div>

      <Card>
        <SectionTitle>시나리오별 비교</SectionTitle>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginTop: 20 }} className="grid-resp-3">
          {scenarios.map((s, i) => (
            <div key={i} style={{ background: V.surface2, border: `1px solid ${i === 2 ? V.accent3 : i === 1 ? V.accent : V.border}`, borderRadius: 12, padding: 18, textAlign: 'center' }}>
              <h4 style={{ fontSize: '0.75rem', color: V.text2, marginBottom: 10, letterSpacing: 1 }}>{s.title}</h4>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2.5rem', lineHeight: 1, color: s.color }}>~{s.wk}주</div>
              <div style={{ width: '100%', background: V.border, borderRadius: 3, height: 6, margin: '10px 0' }}>
                <div style={{ width: `${s.barW}%`, height: '100%', background: s.color, borderRadius: 3 }} />
              </div>
              <p style={{ fontSize: '0.72rem', color: V.text2 }}>{i === 2 ? '바이럴 1회 = +50명 가정' : `약 ${Math.round(s.wk / 4)}개월 소요`}</p>
            </div>
          ))}
        </div>
      </Card>

      <div style={{ marginTop: 24 }}>
        <Card>
          <SectionTitle>노출수/참여도 목표 트래커</SectionTitle>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }} className="grid-resp-3">
            {[
              { label: '노출수 목표 (월)', cur: totalImp.toLocaleString(), goal: '15,000', pct: Math.min(Math.round(totalImp / 150), 100), g: `linear-gradient(90deg,${V.accent},${V.accent2})`, c: V.accent },
              { label: '팔로워 목표', cur: currentFollowers.toString(), goal: '1,000', pct: Math.round(currentFollowers / 10), g: `linear-gradient(90deg,${V.accent2},${V.accent4})`, c: V.accent2 },
              { label: '참여율 목표', cur: `${avgRate}%`, goal: '3.0%', pct: Math.round(parseFloat(avgRate) / 3 * 100), g: `linear-gradient(90deg,${V.accent3},${V.accent})`, c: V.accent3 },
            ].map((t, i) => (
              <div key={i} style={{ background: V.surface2, border: `1px solid ${V.border}`, borderRadius: 12, padding: 20 }}>
                <div style={{ fontSize: '0.78rem', color: V.text2 }}>{t.label}</div>
                <div style={{ fontSize: '0.8rem', color: V.text2, marginBottom: 8 }}>현재: {t.cur} / 목표: {t.goal}</div>
                <div style={{ height: 10, background: V.border, borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${t.pct}%`, background: t.g, borderRadius: 3 }} />
                </div>
                <div style={{ fontSize: '0.75rem', color: t.c, marginTop: 6, fontWeight: 500 }}>{t.pct}% 달성</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
