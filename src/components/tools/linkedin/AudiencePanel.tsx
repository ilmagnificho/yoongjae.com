import { useState } from 'react';
import { PROFILE_DATA, FIT_CHECKS, INDUSTRY_CHART_DATA } from './data';
import { useChartCanvas } from './useChart';
import { V, Card, SectionTitle, BarFill } from './ui';

export default function AudiencePanel({ Chart }: { Chart: any }) {
  const [fitChecked, setFitChecked] = useState<boolean[]>(new Array(FIT_CHECKS.length).fill(false));
  const maxWeight = FIT_CHECKS.reduce((s, c) => s + c.weight, 0);
  const fitScore = FIT_CHECKS.reduce((s, c, i) => s + (fitChecked[i] ? c.weight : 0), 0);
  const fitPct = Math.round(fitScore / maxWeight * 100);

  const indRef = useChartCanvas(Chart, {
    type: 'doughnut',
    data: {
      labels: INDUSTRY_CHART_DATA.labels,
      datasets: [{
        data: INDUSTRY_CHART_DATA.data,
        backgroundColor: ['rgba(79,140,255,0.8)', 'rgba(124,92,252,0.8)', 'rgba(0,229,160,0.8)', 'rgba(255,217,61,0.8)', 'rgba(255,107,107,0.8)', 'rgba(100,100,120,0.5)'],
        borderWidth: 0,
      }],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { position: 'right' as const, labels: { boxWidth: 12, padding: 10, font: { size: 11 } } } },
      cutout: '60%',
    },
  }, []);

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }} className="grid-resp-2">
        <Card>
          <SectionTitle>오디언스 프로파일</SectionTitle>
          {PROFILE_DATA.map(cat => (
            <div key={cat.label} style={{ marginBottom: 14 }}>
              <div style={{ fontSize: '0.7rem', color: V.text2, letterSpacing: 1, marginBottom: 6 }}>{cat.label}</div>
              {cat.items.map(([name, pct]) => (
                <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <div style={{ flex: 1, fontSize: '0.82rem' }}>{name}</div>
                  <div style={{ width: 120 }}><BarFill width={Math.min(pct * 2, 100)} gradient={`linear-gradient(90deg,${V.accent},${V.accent2})`} /></div>
                  <div style={{ fontSize: '0.78rem', color: V.text2, width: 40, textAlign: 'right' }}>{pct}%</div>
                </div>
              ))}
            </div>
          ))}
        </Card>
        <Card>
          <SectionTitle>업계 분포</SectionTitle>
          <div style={{ position: 'relative', height: 260 }}><canvas ref={indRef} /></div>
        </Card>
      </div>

      <Card>
        <SectionTitle>오디언스 핏 스코어카드</SectionTitle>
        <div style={{ fontSize: '0.8rem', color: V.text2, marginBottom: 20 }}>포스팅 주제에 해당하는 항목을 체크하면 내 오디언스 매칭 점수를 계산합니다.</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }} className="grid-resp-2">
          <div>
            {FIT_CHECKS.map((c, i) => (
              <label key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 8, cursor: 'pointer', fontSize: '0.82rem' }}
                onMouseEnter={e => (e.currentTarget.style.background = V.surface2)}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                <input type="checkbox" checked={fitChecked[i]}
                  onChange={() => setFitChecked(prev => prev.map((v, j) => j === i ? !v : v))}
                  style={{ width: 16, height: 16, accentColor: V.accent, cursor: 'pointer' }} />
                <div>
                  <div>{c.label}</div>
                  <div style={{ fontSize: '0.7rem', color: V.text2 }}>{c.hint}</div>
                </div>
              </label>
            ))}
          </div>
          <div style={{ textAlign: 'center', padding: 24 }}>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '5rem', lineHeight: 1, color: fitPct >= 70 ? V.accent3 : fitPct >= 40 ? V.accent : V.text2 }}>{fitPct}</div>
            <div style={{ fontSize: '0.85rem', color: V.text2, marginTop: 8 }}>오디언스 핏 점수</div>
            <div style={{ marginTop: 16, fontSize: '0.8rem' }}>
              {fitPct >= 70
                ? <span>✅ <strong style={{ color: V.accent3 }}>오디언스 핏 매우 높음</strong><br />이 주제는 내 팔로워의 관심사와 매우 잘 맞습니다.</span>
                : fitPct >= 40
                ? <span>🟡 <strong style={{ color: V.accent }}>오디언스 핏 보통</strong><br />일부 오디언스에 맞지만, 더 타겟팅이 필요합니다.</span>
                : fitPct > 0
                ? <span>🔴 <strong style={{ color: V.accent4 }}>오디언스 핏 낮음</strong><br />현재 팔로워와 잘 맞지 않을 수 있습니다.</span>
                : <span style={{ color: V.text2 }}>위 항목을 체크해주세요</span>}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
