import type { DashboardData } from './data';
import { DAY_KEYS, DAY_KO, DAY_KO_FULL, getGrade } from './data';
import { useChartCanvas } from './useChart';
import { V, Card, SectionTitle, BarFill, GradeBadge, GRADE_COLORS_LIGHT } from './ui';

export default function PostsPanel({ data, Chart }: { data: DashboardData; Chart: any }) {
  const maxImp = Math.max(...data.posts.map(p => p.impressions));
  const sorted = [...data.posts].sort((a, b) => b.eng_rate - a.eng_rate);
  const grades = { A: 0, B: 0, C: 0, D: 0 };
  data.posts.forEach(p => { grades[getGrade(p.eng_rate)]++; });

  const gradeRef = useChartCanvas(Chart, {
    type: 'doughnut',
    data: {
      labels: ['A등급', 'B등급', 'C등급', 'D등급'],
      datasets: [{ data: [grades.A, grades.B, grades.C, grades.D], backgroundColor: ['rgba(22,163,74,0.7)', 'rgba(37,99,235,0.7)', 'rgba(217,119,6,0.7)', 'rgba(220,38,38,0.7)'], borderWidth: 0 }],
    },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' as const, labels: { boxWidth: 12, padding: 12 } } }, cutout: '65%' },
  }, [data]);

  const dayPatRef = useChartCanvas(Chart, {
    type: 'bar',
    data: {
      labels: DAY_KO,
      datasets: [{
        label: '평균 참여율 (%)',
        data: DAY_KEYS.map(d => data.dayAvg[d]?.eng_rate ?? 0),
        backgroundColor: DAY_KEYS.map(d => {
          const r = data.dayAvg[d]?.eng_rate ?? 0;
          return r >= 2.5 ? 'rgba(22,163,74,0.7)' : r >= 1.5 ? 'rgba(37,99,235,0.7)' : 'rgba(220,38,38,0.5)';
        }),
        borderRadius: 6,
      }],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: { x: { grid: { display: false } }, y: { grid: { color: 'rgba(26,26,26,0.06)' }, title: { display: true, text: '참여율 (%)' } } },
    },
  }, [data]);

  const tdStyle = { padding: 12, borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: '0.82rem' } as const;

  return (
    <div>
      <Card>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 16 }}>
          {(['A', 'B', 'C', 'D'] as const).map(g => (
            <div key={g} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', background: GRADE_COLORS_LIGHT[g].bg.replace('0.2', '0.1'), borderRadius: 8, fontSize: '0.8rem' }}>
              <GradeBadge grade={g} />
              <span>{g === 'A' ? '참여율 ≥ 2.5%' : g === 'B' ? '1.5% - 2.49%' : g === 'C' ? '0.8% - 1.49%' : '0.8% 미만'}</span>
            </div>
          ))}
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['등급', '날짜', '요일', '노출수', '참여', '참여율', '퍼포먼스', '링크'].map(h => (
                  <th key={h} style={{ textAlign: 'left', fontSize: '0.7rem', letterSpacing: 1.5, textTransform: 'uppercase', color: V.text2, padding: '8px 12px', borderBottom: `1px solid ${V.border}` }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map((p, i) => {
                const grade = getGrade(p.eng_rate);
                const barW = maxImp > 0 ? (p.impressions / maxImp * 100) : 0;
                return (
                  <tr key={i} onMouseEnter={e => (e.currentTarget.style.background = V.surface2)} onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                    <td style={{ ...tdStyle, verticalAlign: 'middle' }}><GradeBadge grade={grade} /></td>
                    <td style={tdStyle}>{p.date.slice(5)}</td>
                    <td style={tdStyle}>{DAY_KO_FULL[p.dayname] || p.dayname}</td>
                    <td style={tdStyle}>{p.impressions.toLocaleString()}</td>
                    <td style={tdStyle}>{p.engagement}</td>
                    <td style={{ ...tdStyle, color: GRADE_COLORS_LIGHT[grade].text, fontWeight: 500 }}>{p.eng_rate}%</td>
                    <td style={{ ...tdStyle, width: 120 }}><BarFill width={barW} gradient={`linear-gradient(90deg,${V.accent},${V.accent2})`} /></td>
                    <td style={tdStyle}>
                      {p.short_url && <a href={`https://www.linkedin.com/feed/update/urn:li:activity:${p.short_url}`} target="_blank" rel="noopener noreferrer" style={{ color: V.accent2, fontSize: '0.72rem', textDecoration: 'none' }}>🔗 보기</a>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginTop: 24 }} className="grid-resp-2">
        <Card>
          <SectionTitle>고성과 vs 저성과 요일 패턴</SectionTitle>
          <div style={{ position: 'relative', height: 260 }}><canvas ref={dayPatRef} /></div>
        </Card>
        <Card>
          <SectionTitle>등급별 분포</SectionTitle>
          <div style={{ position: 'relative', height: 200 }}><canvas ref={gradeRef} /></div>
          <div style={{ marginTop: 16, fontSize: '0.8rem', lineHeight: 1.8, color: V.text2 }}>
            🟢 A등급: {grades.A}개 (참여율 2.5%+)<br />
            🔵 B등급: {grades.B}개 (1.5-2.5%)<br />
            🟡 C등급: {grades.C}개 (0.8-1.5%)<br />
            🔴 D등급: {grades.D}개 (0.8% 미만)<br /><br />
            <strong style={{ color: V.text }}>→ 상위 50%가 전체 참여의 90%+를 차지합니다.</strong>
          </div>
        </Card>
      </div>
    </div>
  );
}
