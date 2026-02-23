import { useState, useRef, useCallback } from 'react';
import { DEMO_DATA, type DashboardData } from './linkedin/data';
import { parseLinkedInXlsx } from './linkedin/parseXlsx';
import { useChart } from './linkedin/useChart';
import { V } from './linkedin/ui';
import OverviewPanel from './linkedin/OverviewPanel';
import CalendarPanel from './linkedin/CalendarPanel';
import SimulatorPanel from './linkedin/SimulatorPanel';
import PostsPanel from './linkedin/PostsPanel';
import AudiencePanel from './linkedin/AudiencePanel';
import WeeklyPanel from './linkedin/WeeklyPanel';

const TABS = [
  { id: 'overview', icon: '📊', label: '개요' },
  { id: 'calendar', icon: '📅', label: '캘린더' },
  { id: 'simulator', icon: '🎯', label: '시뮬레이터' },
  { id: 'posts', icon: '📋', label: '포스트 등급' },
  { id: 'audience', icon: '👥', label: '오디언스' },
  { id: 'weekly', icon: '📈', label: '주간 리포트' },
];

export default function LinkedInDashboard() {
  const [tab, setTab] = useState('overview');
  const [data, setData] = useState<DashboardData>(DEMO_DATA);
  const [notif, setNotif] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const ChartMod = useChart();

  const handleFile = useCallback(async (file: File) => {
    setNotif('✅ 파일이 업로드되었습니다. 데이터를 분석 중입니다...');
    const parsed = await parseLinkedInXlsx(file);
    if (parsed) { setData(parsed); setTimeout(() => setNotif(''), 3000); }
    else { setNotif('⚠️ 파일 형식을 인식할 수 없습니다.'); setTimeout(() => setNotif(''), 5000); }
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragOver(false);
    const f = e.dataTransfer.files[0]; if (f) handleFile(f);
  }, [handleFile]);

  const startDate = data.engagement[0]?.date ?? '';
  const endDate = data.engagement[data.engagement.length - 1]?.date ?? '';

  return (
    <div style={{ background: V.bg, color: V.text, fontFamily: "'Noto Sans KR', sans-serif", fontWeight: 300, minHeight: '100vh', position: 'relative' }}>
      {/* Grid background */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, backgroundImage: 'linear-gradient(rgba(79,140,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(79,140,255,0.03) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 1400, margin: '0 auto', padding: '0 24px 60px' }}>
        {/* Header */}
        <header style={{ padding: '40px 0 32px', borderBottom: `1px solid ${V.border}`, marginBottom: 36, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(2.2rem, 5vw, 3.6rem)', letterSpacing: 2, lineHeight: 1, background: `linear-gradient(135deg, ${V.accent}, ${V.accent2})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>LinkedIn Analytics</h1>
            <p style={{ color: V.text2, fontSize: '0.85rem', marginTop: 6, letterSpacing: 1 }}>YoongJae Cho · 콘텐츠 성과 대시보드</p>
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end', flexWrap: 'wrap' }}>
            <label htmlFor="xlsx-upload"
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={onDrop}
              style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.82rem', border: `2px dashed ${dragOver ? V.accent : V.border}`, borderRadius: 16, cursor: 'pointer', background: dragOver ? 'rgba(79,140,255,0.05)' : 'transparent', transition: 'all 0.2s' }}>
              📂 새 엑셀 파일 업로드
            </label>
            <input id="xlsx-upload" ref={fileRef} type="file" accept=".xlsx,.xls" style={{ display: 'none' }}
              onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
            <div style={{ background: V.surface2, border: `1px solid ${V.border}`, borderRadius: 8, padding: '10px 16px', fontSize: '0.8rem', color: V.text2, textAlign: 'right', lineHeight: 1.6 }}>
              <strong style={{ color: V.accent, display: 'block', fontSize: '0.95rem' }}>
                {startDate.replace(/-/g, '.')} - {endDate.replace(/-/g, '.').slice(5)}
              </strong>
              분석 기간 {data.engagement.length}일 · 포스트 {data.posts.length}개
            </div>
          </div>
        </header>

        {/* Notification */}
        {notif && (
          <div style={{ background: 'rgba(0,229,160,0.1)', border: '1px solid rgba(0,229,160,0.3)', borderRadius: 8, padding: '10px 14px', fontSize: '0.8rem', color: V.accent3, marginBottom: 16 }}>{notif}</div>
        )}

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 32, background: V.surface, border: `1px solid ${V.border}`, borderRadius: 12, padding: 6, overflowX: 'auto' }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              flex: 1, minWidth: 120, padding: '10px 16px', border: 'none', borderRadius: 8,
              background: tab === t.id ? `linear-gradient(135deg, ${V.accent}, ${V.accent2})` : 'transparent',
              color: tab === t.id ? 'white' : V.text2,
              fontFamily: "'Noto Sans KR', sans-serif", fontSize: '0.8rem', cursor: 'pointer',
              transition: 'all 0.2s', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center',
              gap: 6, justifyContent: 'center', fontWeight: tab === t.id ? 500 : 400,
            }}>{t.icon} {t.label}</button>
          ))}
        </div>

        {/* Privacy note */}
        <div style={{ fontSize: '0.72rem', color: V.text2, textAlign: 'center', marginBottom: 24, opacity: 0.6 }}>
          🔒 모든 데이터는 브라우저에서만 처리됩니다. 서버 전송 없음.
        </div>

        {/* Panels */}
        {tab === 'overview' && <OverviewPanel data={data} Chart={ChartMod} />}
        {tab === 'calendar' && <CalendarPanel data={data} />}
        {tab === 'simulator' && <SimulatorPanel data={data} Chart={ChartMod} />}
        {tab === 'posts' && <PostsPanel data={data} Chart={ChartMod} />}
        {tab === 'audience' && <AudiencePanel Chart={ChartMod} />}
        {tab === 'weekly' && <WeeklyPanel data={data} Chart={ChartMod} />}
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @media (max-width: 900px) { .grid-resp-4 { grid-template-columns: repeat(2, 1fr) !important; } .grid-resp-2, .grid-resp-3 { grid-template-columns: 1fr !important; } }
        @media (max-width: 600px) { .grid-resp-4 { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}
