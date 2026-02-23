import type { DashboardData } from './data';
import { DAY_KEYS } from './data';
import { useChartCanvas } from './useChart';
import { V, Card, SectionTitle } from './ui';

export default function OverviewPanel({ data, Chart }: { data: DashboardData; Chart: any }) {
  const totalImp = data.engagement.reduce((s, d) => s + d.impressions, 0);
  const totalEng = data.engagement.reduce((s, d) => s + d.engagement, 0);
  const lastFol = data.followers[data.followers.length - 1]?.cumulative ?? 0;
  const avgRate = totalImp > 0 ? (totalEng / totalImp * 100).toFixed(2) : '0';

  const impRef = useChartCanvas(Chart, {
    type: 'line',
    data: {
      labels: data.engagement.map(d => d.date.slice(5)),
      datasets: [{ label: '노출수', data: data.engagement.map(d => d.impressions), borderColor: V.accent, backgroundColor: 'rgba(79,140,255,0.08)', borderWidth: 2, pointRadius: 2, fill: true, tension: 0.3 }],
    },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { maxTicksLimit: 8 } }, y: { grid: { color: 'rgba(255,255,255,0.04)' } } } },
  }, [data]);

  const folRef = useChartCanvas(Chart, {
    type: 'line',
    data: {
      labels: data.followers.map(d => d.date.slice(5)),
      datasets: [{ label: '팔로워 누적', data: data.followers.map(d => d.cumulative), borderColor: V.accent3, backgroundColor: 'rgba(0,229,160,0.08)', borderWidth: 2, pointRadius: 2, fill: true, tension: 0.3 }],
    },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { maxTicksLimit: 8 } }, y: { grid: { color: 'rgba(255,255,255,0.04)' } } } },
  }, [data]);

  const dayLabels = ['월(Mon)', '화(Tue)', '수(Wed)', '목(Thu)', '금(Fri)', '토(Sat)', '일(Sun)'];
  const maxImp = Math.max(...DAY_KEYS.map(d => data.dayAvg[d]?.impressions ?? 0));
  const maxEng = Math.max(...DAY_KEYS.map(d => data.dayAvg[d]?.eng_rate ?? 0));

  const statCards = [
    { title: '총 노출수', value: totalImp.toLocaleString(), sub: `${data.engagement.length}일 누적`, gradient: `linear-gradient(135deg,${V.accent},${V.accent2})` },
    { title: '현재 팔로워', value: (421 + lastFol).toString(), sub: `기간 중 +${lastFol}명 증가`, color: V.accent3 },
    { title: '회원 도달', value: '3,065', sub: '고유 LinkedIn 회원', color: V.accent5 },
    { title: '평균 참여율', value: `${avgRate}%`, sub: '업계 평균 1.0% 대비 ↑', color: V.accent4 },
  ];

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }} className="grid-resp-4">
        {statCards.map((c, i) => (
          <Card key={i}>
            <div style={{ fontSize: '0.75rem', letterSpacing: 2, textTransform: 'uppercase', color: V.text2, marginBottom: 12 }}>{c.title}</div>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2.8rem', lineHeight: 1, ...(c.gradient ? { background: c.gradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' } : { color: c.color }) }}>{c.value}</div>
            <div style={{ fontSize: '0.78rem', color: V.text2, marginTop: 4 }}>{c.sub}</div>
          </Card>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }} className="grid-resp-2">
        <Card><SectionTitle>일별 노출수 추이</SectionTitle><div style={{ position: 'relative', height: 260 }}><canvas ref={impRef} /></div></Card>
        <Card><SectionTitle>팔로워 성장 누적</SectionTitle><div style={{ position: 'relative', height: 260 }}><canvas ref={folRef} /></div></Card>
      </div>

      <Card>
        <SectionTitle>요일별 평균 히트맵</SectionTitle>
        <div style={{ display: 'grid', gridTemplateColumns: '60px repeat(7, 1fr)', gap: 4, marginTop: 8 }}>
          <div />
          {dayLabels.map(d => <div key={d} style={{ fontSize: '0.65rem', color: V.text2, textAlign: 'center', padding: 4, fontWeight: 500 }}>{d}</div>)}

          <div style={{ fontSize: '0.7rem', color: V.text2, display: 'flex', alignItems: 'center' }}>노출수</div>
          {DAY_KEYS.map(dk => {
            const val = data.dayAvg[dk]?.impressions ?? 0;
            const r = maxImp > 0 ? val / maxImp : 0;
            return <div key={`i-${dk}`} style={{ height: 36, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 500, background: `rgba(79,140,255,${0.1 + r * 0.85})`, color: r > 0.5 ? 'white' : V.text2 }}>{Math.round(val)}</div>;
          })}

          <div style={{ fontSize: '0.7rem', color: V.text2, display: 'flex', alignItems: 'center' }}>참여율</div>
          {DAY_KEYS.map(dk => {
            const val = data.dayAvg[dk]?.eng_rate ?? 0;
            const r = maxEng > 0 ? val / maxEng : 0;
            return <div key={`e-${dk}`} style={{ height: 36, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 500, background: `rgba(79,140,255,${0.1 + r * 0.85})`, color: r > 0.5 ? 'white' : V.text2 }}>{val.toFixed(1)}%</div>;
          })}
        </div>
        <div style={{ marginTop: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.75rem', color: V.text2 }}>강도:</span>
          {['낮음', '보통', '높음', '최고'].map((l, i) => (
            <span key={l} style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: 4, background: `rgba(79,140,255,${[0.1, 0.3, 0.6, 0.9][i]})`, color: i >= 2 ? 'white' : V.accent }}>{l}</span>
          ))}
        </div>
      </Card>
    </div>
  );
}
