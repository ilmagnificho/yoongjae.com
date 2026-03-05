import { useState, useRef, useCallback } from 'react';

declare global { interface Window { __ga4?: { trackToolUse: (tool: string, action: string, params?: Record<string, unknown>) => void } } }
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
  const [isDemo, setIsDemo] = useState(true);
  const [notif, setNotif] = useState('');
  const [notifType, setNotifType] = useState<'success' | 'warn'>('success');
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const ChartMod = useChart();

  const showNotif = (msg: string, type: 'success' | 'warn' = 'success', ms = 3000) => {
    setNotif(msg); setNotifType(type);
    setTimeout(() => setNotif(''), ms);
  };

  const handleFile = useCallback(async (file: File) => {
    showNotif('파일을 분석 중입니다...', 'success', 60000);
    const parsed = await parseLinkedInXlsx(file);
    if (parsed) {
      setData(parsed);
      setIsDemo(false);
      showNotif('✅ 파일이 업로드되었습니다.', 'success', 3000);
      window.__ga4?.trackToolUse('linkedin-analytics', 'file_upload', {
        post_count: parsed.posts.length,
        date_range_days: parsed.engagement.length,
      });
    } else {
      showNotif('⚠️ 파일 형식을 인식할 수 없습니다.', 'warn', 5000);
      window.__ga4?.trackToolUse('linkedin-analytics', 'file_upload_fail');
    }
  }, []);

  const handleReset = useCallback(() => {
    setData(DEMO_DATA);
    setIsDemo(true);
    if (fileRef.current) fileRef.current.value = '';
    showNotif('데모 데이터로 돌아갔습니다.', 'success', 2000);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragOver(false);
    const f = e.dataTransfer.files[0]; if (f) handleFile(f);
  }, [handleFile]);

  const startDate = data.engagement[0]?.date ?? '';
  const endDate = data.engagement[data.engagement.length - 1]?.date ?? '';

  return (
    <div style={{ background: V.bg, color: V.text, fontFamily: V.fontSans, fontSize: '0.9rem', minHeight: '60vh' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 24px 60px' }}>

        {/* Header */}
        <header style={{ padding: '32px 0 24px', borderBottom: `1px solid ${V.border}`, marginBottom: 0, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 style={{ fontFamily: V.fontSerif, fontWeight: 700, fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', lineHeight: 1.1, color: V.text, margin: 0 }}>
              LinkedIn Analytics
            </h1>
            <p style={{ color: V.text2, fontSize: '0.82rem', marginTop: 4 }}>콘텐츠 성과 대시보드</p>
          </div>

          {/* Period badge */}
          <div style={{ background: V.surface2, border: `1px solid ${V.border}`, borderRadius: 8, padding: '8px 14px', fontSize: '0.78rem', color: V.text2, lineHeight: 1.6 }}>
            <strong style={{ color: V.accent, display: 'block', fontSize: '0.85rem' }}>
              {startDate.replace(/-/g, '.')} – {endDate.slice(5).replace(/-/g, '.')}
            </strong>
            {data.engagement.length}일 · 포스트 {data.posts.length}개
          </div>
        </header>

        {/* ─── Privacy banner ─── */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          padding: '10px 16px', margin: '16px 0', borderRadius: 8,
          background: V.surface, border: `1px solid ${V.border}`,
          fontSize: '0.78rem', color: V.text2,
        }}>
          <span style={{ fontSize: '1rem' }}>🔒</span>
          <span>모든 데이터는 <strong style={{ color: V.text }}>브라우저에서만</strong> 처리됩니다. 서버에 전송되거나 저장되지 않습니다.</span>
        </div>

        {/* ─── Data source bar ─── */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 16px', marginBottom: 24, borderRadius: 8, flexWrap: 'wrap', gap: 10,
          background: isDemo ? 'rgba(37,99,235,0.05)' : 'rgba(22,163,74,0.06)',
          border: `1px solid ${isDemo ? 'rgba(37,99,235,0.15)' : 'rgba(22,163,74,0.2)'}`,
        }}>
          {isDemo ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.82rem' }}>
                <span style={{ background: 'rgba(255,103,25,0.12)', border: '1px solid rgba(255,103,25,0.3)', color: V.accent2, padding: '2px 8px', borderRadius: 12, fontSize: '0.7rem', fontWeight: 600 }}>DEMO</span>
                <span style={{ color: V.text2 }}>샘플 데이터로 보고 있습니다.</span>
              </div>
              <label htmlFor="xlsx-upload"
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={onDrop}
                style={{
                  padding: '6px 14px', display: 'inline-flex', alignItems: 'center', gap: 6,
                  fontSize: '0.78rem', fontWeight: 500,
                  border: `1px solid ${dragOver ? V.accent : V.borderStrong}`,
                  borderRadius: 6, cursor: 'pointer',
                  background: dragOver ? `rgba(37,99,235,0.08)` : V.surface,
                  color: V.accent, transition: 'all 0.2s',
                }}>
                📂 내 LinkedIn 엑셀 업로드
              </label>
            </>
          ) : (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.82rem' }}>
                <span style={{ background: 'rgba(22,163,74,0.12)', border: '1px solid rgba(22,163,74,0.3)', color: V.accent3, padding: '2px 8px', borderRadius: 12, fontSize: '0.7rem', fontWeight: 600 }}>내 데이터</span>
                <span style={{ color: V.text2 }}>업로드한 엑셀 파일로 분석 중입니다.</span>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <label htmlFor="xlsx-upload" style={{
                  padding: '6px 12px', fontSize: '0.78rem',
                  border: `1px solid ${V.border}`, borderRadius: 6, cursor: 'pointer',
                  background: V.surface, color: V.text2,
                }}>
                  다른 파일 업로드
                </label>
                <button onClick={handleReset} style={{
                  padding: '6px 14px', fontSize: '0.78rem', fontWeight: 500,
                  border: `1px solid rgba(220,38,38,0.3)`, borderRadius: 6,
                  background: 'rgba(220,38,38,0.06)', color: V.accent4,
                  cursor: 'pointer', transition: 'all 0.15s',
                }}>
                  데모 데이터로 돌아가기
                </button>
              </div>
            </>
          )}
        </div>
        <input id="xlsx-upload" ref={fileRef} type="file" accept=".xlsx,.xls" style={{ display: 'none' }}
          onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />

        {/* Notification */}
        {notif && (
          <div style={{
            background: notifType === 'success' ? 'rgba(22,163,74,0.08)' : 'rgba(217,119,6,0.08)',
            border: `1px solid ${notifType === 'success' ? 'rgba(22,163,74,0.3)' : 'rgba(217,119,6,0.3)'}`,
            borderRadius: 8, padding: '10px 14px', fontSize: '0.82rem',
            color: notifType === 'success' ? V.accent3 : V.accent5, marginBottom: 16,
          }}>{notif}</div>
        )}

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 2, marginBottom: 28, background: V.surface2, border: `1px solid ${V.border}`, borderRadius: 10, padding: 4, overflowX: 'auto' }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => { setTab(t.id); window.__ga4?.trackToolUse('linkedin-analytics', 'tab_switch', { tab_id: t.id }); }} style={{
              flex: 1, minWidth: 100, padding: '8px 12px', border: 'none', borderRadius: 7,
              background: tab === t.id ? V.surface : 'transparent',
              color: tab === t.id ? V.text : V.text2,
              fontFamily: V.fontSans, fontSize: '0.78rem', cursor: 'pointer',
              transition: 'all 0.15s', whiteSpace: 'nowrap',
              display: 'flex', alignItems: 'center', gap: 5, justifyContent: 'center',
              fontWeight: tab === t.id ? 600 : 400,
              boxShadow: tab === t.id ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              borderBottom: tab === t.id ? `2px solid ${V.accent}` : '2px solid transparent',
            }}>{t.icon} {t.label}</button>
          ))}
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
        @media (max-width: 900px) { .grid-resp-4 { grid-template-columns: repeat(2, 1fr) !important; } .grid-resp-2, .grid-resp-3 { grid-template-columns: 1fr !important; } }
        @media (max-width: 600px) { .grid-resp-4 { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}
