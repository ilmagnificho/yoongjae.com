import { useState } from 'react';
import type { DashboardData } from './data';
import { DAY_KO, WEEKS, getGrade } from './data';
import { useChartCanvas } from './useChart';
import { V, Card, SectionTitle, GradeBadge } from './ui';

export default function WeeklyPanel({ data, Chart }: { data: DashboardData; Chart: any }) {
  const [weekIdx, setWeekIdx] = useState(0);
  const cur = WEEKS[weekIdx];
  const prev = WEEKS[weekIdx + 1];

  const filterWeek = (w: typeof cur) => data.engagement.filter(d => d.date >= w.start && d.date <= w.end);
  const curData = filterWeek(cur);
  const prevData = prev ? filterWeek(prev) : null;

  const curImp = curData.reduce((s, d) => s + d.impressions, 0);
  const curEng = curData.reduce((s, d) => s + d.engagement, 0);
  const curRate = curImp > 0 ? (curEng / curImp * 100).toFixed(2) : '0';
  const curFol = data.followers.filter(d => d.date >= cur.start && d.date <= cur.end).reduce((s, d) => s + d.new_followers, 0);

  const prevImp = prevData ? prevData.reduce((s, d) => s + d.impressions, 0) : 0;
  const prevEng = prevData ? prevData.reduce((s, d) => s + d.engagement, 0) : 0;
  const prevFol = prev ? data.followers.filter(d => d.date >= prev.start && d.date <= prev.end).reduce((s, d) => s + d.new_followers, 0) : 0;

  const delta = (c: number, p: number) => {
    if (!p) return null;
    const pct = Math.round((c - p) / p * 100);
    return <div style={{ fontSize: '0.75rem', marginTop: 2, color: pct >= 0 ? V.accent3 : V.accent4 }}>{pct >= 0 ? '▲' : '▼'} {Math.abs(pct)}%</div>;
  };

  const weekByDay = (wData: typeof curData) => {
    const res = [0, 0, 0, 0, 0, 0, 0];
    wData.forEach(d => { const dow = new Date(d.date).getDay(); const idx = [6, 0, 1, 2, 3, 4, 5][dow]; res[idx] += d.impressions; });
    return res;
  };

  const compareRef = useChartCanvas(Chart, {
    type: 'bar',
    data: {
      labels: DAY_KO,
      datasets: [
        { label: cur.label, data: weekByDay(curData), backgroundColor: 'rgba(37,99,235,0.65)', borderRadius: 4 },
        ...(prevData ? [{ label: prev!.label, data: weekByDay(prevData), backgroundColor: 'rgba(26,26,26,0.10)', borderRadius: 4 }] : []),
      ],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { labels: { boxWidth: 12, padding: 12 } } },
      scales: { x: { grid: { display: false } }, y: { grid: { color: 'rgba(26,26,26,0.06)' } } },
    },
  }, [weekIdx, data]);

  const weekPosts = [...data.posts].filter(p => p.date >= cur.start && p.date <= cur.end).sort((a, b) => b.engagement - a.engagement);
  const best = weekPosts[0];

  return (
    <div>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 20, flexWrap: 'wrap' }}>
        <div style={{ fontSize: '0.82rem', color: V.text2 }}>기간 선택:</div>
        <select value={weekIdx} onChange={e => setWeekIdx(Number(e.target.value))} style={{
          background: V.surface2, border: `1px solid ${V.border}`, borderRadius: 8,
          padding: '8px 12px', color: V.text, fontFamily: "'Noto Sans KR', sans-serif", fontSize: '0.82rem', outline: 'none',
        }}>
          {WEEKS.map((w, i) => <option key={i} value={i}>{w.start.replace('2026-', '2026.')} - {w.end.slice(5)} ({w.label})</option>)}
        </select>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, padding: 16, background: V.surface2, borderRadius: 12, marginBottom: 16 }}>
        {[
          { val: curImp.toLocaleString(), lbl: '노출수', d: delta(curImp, prevImp) },
          { val: `${curRate}%`, lbl: '평균 참여율', d: delta(parseFloat(curRate), prevImp > 0 ? prevEng / prevImp * 100 : 0) },
          { val: `+${curFol}`, lbl: '신규 팔로워', d: delta(curFol, prevFol) },
        ].map((k, i) => (
          <div key={i} style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.8rem', color: V.accent }}>{k.val}</div>
            <div style={{ fontSize: '0.7rem', color: V.text2, marginTop: 2 }}>{k.lbl}</div>
            {k.d}
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }} className="grid-resp-2">
        <Card>
          <SectionTitle>이번 주 vs 전주</SectionTitle>
          <div style={{ position: 'relative', height: 260 }}><canvas ref={compareRef} /></div>
        </Card>
        <Card>
          <SectionTitle>베스트 포스트</SectionTitle>
          {best ? (
            <div style={{ background: V.surface2, borderRadius: 10, padding: 16, border: `1px solid ${V.border}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <GradeBadge grade={getGrade(best.eng_rate)} />
                <span style={{ fontSize: '0.78rem', color: V.text2 }}>{best.date} ({best.dayname})</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 12 }}>
                {[
                  { v: best.impressions.toLocaleString(), l: '노출수', c: V.accent },
                  { v: best.engagement.toString(), l: '참여', c: V.accent3 },
                  { v: `${best.eng_rate}%`, l: '참여율', c: V.accent5 },
                ].map((s, i) => (
                  <div key={i} style={{ textAlign: 'center' }}>
                    <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.8rem', color: s.c }}>{s.v}</div>
                    <div style={{ fontSize: '0.7rem', color: V.text2 }}>{s.l}</div>
                  </div>
                ))}
              </div>
              {best.short_url && <a href={`https://www.linkedin.com/feed/update/urn:li:activity:${best.short_url}`} target="_blank" rel="noopener noreferrer" style={{ color: V.accent2, fontSize: '0.78rem' }}>🔗 LinkedIn에서 보기</a>}
            </div>
          ) : <div style={{ color: V.text2, fontSize: '0.82rem', padding: '20px 0' }}>이 주에 포스트가 없습니다.</div>}
        </Card>
      </div>

      <Card>
        <SectionTitle>주간 인사이트 요약</SectionTitle>
        <div style={{ fontSize: '0.85rem', lineHeight: 2, color: V.text2 }}>
          📈 {cur.label} 총 노출수: <strong style={{ color: V.text }}>{curImp.toLocaleString()}</strong>
          {prevImp > 0 && ` (전주 대비 ${Math.round((curImp - prevImp) / prevImp * 100)}%)`}<br />
          👥 신규 팔로워: <strong style={{ color: V.accent3 }}>+{curFol}명</strong><br />
          💬 평균 참여율: <strong style={{ color: V.accent }}>{curRate}%</strong> (업계 평균 1.0% 기준 {parseFloat(curRate) >= 1.0 ? '▲ 초과' : '▼ 미달'})<br />
          {best && <>⭐ 베스트 포스트: {best.date} 발행, 참여율 <strong style={{ color: V.accent5 }}>{best.eng_rate}%</strong><br /></>}
          💡 <strong>인사이트:</strong>{' '}
          {weekIdx === 0 ? '2월 17-23주는 2월 최고 성과 주간입니다. 주 후반 바이럴 효과가 두드러졌습니다.'
            : weekIdx === 1 ? '3주차는 안정적인 성장세를 보인 주간입니다. 화요일 포스팅의 효율이 가장 높았습니다.'
            : '초기 성장 국면으로, 월/화 포스팅이 가장 높은 참여율을 기록했습니다.'}
        </div>
      </Card>
    </div>
  );
}
