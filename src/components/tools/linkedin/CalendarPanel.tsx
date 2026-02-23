import { useState, useEffect } from 'react';
import type { DashboardData } from './data';
import { V, Card, SectionTitle, BarFill } from './ui';

export default function CalendarPanel({ data }: { data: DashboardData }) {
  const [kanban, setKanban] = useState(() => {
    if (typeof window !== 'undefined') {
      const s = localStorage.getItem('li-kanban');
      if (s) return JSON.parse(s);
    }
    return {
      backlog: ['유니콘 투자 VC의 삽질 회고 #6', '바이브코딩으로 만든 첫 SaaS'],
      progress: ['투자 vs 빌딩: 내가 배운 것'],
      done: ['삽질 회고 #5 (2/20 발행)', '삽질 회고 #4 (2/19 발행)'],
    };
  });
  const [newIdea, setNewIdea] = useState('');

  useEffect(() => { localStorage.setItem('li-kanban', JSON.stringify(kanban)); }, [kanban]);

  const addIdea = () => {
    if (!newIdea.trim()) return;
    setKanban((p: any) => ({ ...p, backlog: [newIdea.trim(), ...p.backlog] }));
    setNewIdea('');
  };

  const bestDays = [
    { rank: '🥇', name: '월요일', rate: '3.01%', width: 100, color: V.accent3, label: 'Best' },
    { rank: '🥈', name: '화요일', rate: '2.88%', width: 95, color: V.accent, label: '2위' },
    { rank: '🥉', name: '금요일', rate: '2.34%', width: 78, color: V.accent2, label: '3위' },
    { rank: '⚠️', name: '수요일', rate: '1.05%', width: 35, color: V.accent4, label: '회피' },
    { rank: '⚠️', name: '목요일', rate: '1.06%', width: 35, color: V.accent4, label: '회피' },
  ];

  const start = new Date('2026-02-23');
  const startDay = start.getDay();
  const calDays: (null | { date: number; isRec: boolean })[] = [];
  for (let i = 0; i < startDay; i++) calDays.push(null);
  for (let i = 0; i < 28; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    calDays.push({ date: d.getDate(), isRec: [1, 2, 5].includes(d.getDay()) });
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }} className="grid-resp-2">
        <Card>
          <SectionTitle>최적 발행 요일 분석</SectionTitle>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {bestDays.map((d, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0' }}>
                <div style={{ width: 28, fontSize: '1rem' }}>{d.rank}</div>
                <div style={{ flex: 1, fontSize: '0.82rem' }}><strong>{d.name}</strong>{' '}<span style={{ fontSize: '0.72rem', color: V.text2 }}>— 참여율 {d.rate}</span></div>
                <div style={{ width: 120 }}><BarFill width={d.width} gradient={d.color} /></div>
                <div style={{ fontSize: '0.78rem', color: d.color, width: 40, textAlign: 'right' }}>{d.label}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 20, padding: 14, background: V.surface2, borderRadius: 10, borderLeft: `3px solid ${V.accent3}` }}>
            <div style={{ fontSize: '0.75rem', color: V.accent3, marginBottom: 6, fontWeight: 500 }}>💡 추천 발행 리듬</div>
            <div style={{ fontSize: '0.82rem', lineHeight: 1.7 }}>
              <strong>월 + 화</strong> (주 2회 기준) 혹은<br /><strong>월 + 화 + 금</strong> (주 3회 기준)<br />
              <span style={{ color: V.text2, fontSize: '0.75rem' }}>수/목 발행 시 참여율 50% 이상 하락</span>
            </div>
          </div>
        </Card>

        <Card>
          <SectionTitle>다음 4주 추천 발행 스케줄</SectionTitle>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
            {['일', '월', '화', '수', '목', '금', '토'].map(d => (
              <div key={d} style={{ textAlign: 'center', fontSize: '0.68rem', color: V.text2, padding: 4 }}>{d}</div>
            ))}
            {calDays.map((d, i) => d ? (
              <div key={i} style={{
                aspectRatio: '1', borderRadius: 8, display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', fontSize: '0.72rem', gap: 2,
                border: d.isRec ? `1px solid ${V.accent3}` : '1px solid transparent',
                background: d.isRec ? 'rgba(22,163,74,0.08)' : V.surface2,
              }}>
                <span style={{ fontWeight: 500, fontSize: '0.8rem' }}>{d.date}</span>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: d.isRec ? V.accent3 : 'transparent' }} />
              </div>
            ) : <div key={i} />)}
          </div>
          <div style={{ marginTop: 16, display: 'flex', gap: 12, fontSize: '0.72rem' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 20, background: 'rgba(22,163,74,0.1)', border: '1px solid rgba(22,163,74,0.3)', color: V.accent3 }}>🟢 추천 발행일</span>
            <span style={{ color: V.text2 }}>빈 날 = 쉬는 날</span>
          </div>
        </Card>
      </div>

      <Card>
        <SectionTitle>게시물 아이디어 칸반</SectionTitle>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }} className="grid-resp-3">
          {[
            { key: 'backlog', label: '📝 아이디어', color: V.text2 },
            { key: 'progress', label: '✍️ 작성 중', color: V.accent5 },
            { key: 'done', label: '✅ 발행 완료', color: V.accent3 },
          ].map(col => (
            <div key={col.key}>
              <div style={{ fontSize: '0.72rem', color: col.color, letterSpacing: 1, marginBottom: 10 }}>{col.label}</div>
              <div style={{ minHeight: 120, background: V.surface2, borderRadius: 10, padding: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
                {(kanban as any)[col.key]?.map((item: string, i: number) => (
                  <div key={i} style={{ background: V.surface, border: `1px solid ${V.border}`, borderRadius: 6, padding: '8px 10px', fontSize: '0.78rem', lineHeight: 1.4 }}>{item}</div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
          <input value={newIdea} onChange={e => setNewIdea(e.target.value)} onKeyDown={e => e.key === 'Enter' && addIdea()} placeholder="새 아이디어 입력..."
            style={{ flex: 1, background: V.surface2, border: `1px solid ${V.border}`, borderRadius: 8, padding: '8px 12px', color: V.text, fontFamily: "'Noto Sans KR', sans-serif", fontSize: '0.82rem', outline: 'none' }} />
          <button onClick={addIdea} style={{ background: V.accent, border: 'none', borderRadius: 8, padding: '8px 16px', color: 'white', cursor: 'pointer', fontSize: '0.82rem' }}>추가</button>
        </div>
      </Card>
    </div>
  );
}
