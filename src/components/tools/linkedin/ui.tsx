import type { ReactNode } from 'react';

/** Design tokens — matches yoongjae.com (paper/ink/accent-blue) */
export const V = {
  bg: '#FAFAF8',
  surface: '#FFFFFF',
  surface2: '#F5F0EB',
  border: 'rgba(26,26,26,0.10)',
  borderStrong: 'rgba(26,26,26,0.20)',
  accent: '#2563EB',
  accent2: '#FF6719',
  accent3: '#16a34a',
  accent4: '#dc2626',
  accent5: '#d97706',
  text: '#1A1A1A',
  text2: 'rgba(26,26,26,0.55)',
  fontSerif: "'Newsreader', Georgia, serif",
  fontSans: "'NanumSquare', Inter, system-ui, sans-serif",
};

export const GRADE_COLORS_LIGHT = {
  A: { bg: 'rgba(22,163,74,0.10)', text: '#16a34a', border: '#16a34a' },
  B: { bg: 'rgba(37,99,235,0.10)', text: '#2563EB', border: '#2563EB' },
  C: { bg: 'rgba(217,119,6,0.10)', text: '#d97706', border: '#d97706' },
  D: { bg: 'rgba(220,38,38,0.10)', text: '#dc2626', border: '#dc2626' },
};

export function Card({ children, accentColor }: { children: ReactNode; accentColor?: string }) {
  return (
    <div style={{
      background: V.surface,
      border: `1px solid ${V.border}`,
      borderRadius: 12,
      padding: 24,
      position: 'relative',
      overflow: 'hidden',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    }}>
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 2,
        background: accentColor ?? `linear-gradient(90deg, ${V.accent}, ${V.accent2}, transparent)`,
      }} />
      {children}
    </div>
  );
}

export function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <div style={{
      fontFamily: V.fontSerif,
      fontWeight: 600,
      fontSize: '0.95rem',
      color: V.text,
      marginBottom: 16,
      display: 'flex',
      alignItems: 'center',
      gap: 10,
    }}>
      {children}
      <span style={{ flex: 1, height: 1, background: V.border }} />
    </div>
  );
}

export function BarFill({ width, gradient }: { width: number; gradient: string }) {
  return (
    <div style={{ height: 6, background: V.border, borderRadius: 3, overflow: 'hidden' }}>
      <div style={{
        height: '100%', borderRadius: 3, width: `${Math.min(width, 100)}%`,
        background: gradient, transition: 'width 0.8s ease',
      }} />
    </div>
  );
}

export function GradeBadge({ grade }: { grade: 'A' | 'B' | 'C' | 'D' }) {
  const c = GRADE_COLORS_LIGHT[grade];
  return (
    <span style={{
      display: 'inline-block', width: 28, height: 28, borderRadius: 6,
      textAlign: 'center', lineHeight: '28px', fontWeight: 700, fontSize: '0.85rem',
      background: c.bg, color: c.text, border: `1px solid ${c.border}`,
    }}>{grade}</span>
  );
}

export function SimCard({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div style={{
      background: V.surface2,
      border: `1px solid ${V.border}`,
      borderRadius: 10,
      padding: 16,
    }}>
      <div style={{ fontSize: '0.78rem', color: V.text2, marginBottom: 6 }}>{label}</div>
      {children}
    </div>
  );
}

export function BigNum({ value, color }: { value: string; color: string }) {
  return (
    <div style={{
      fontFamily: V.fontSerif,
      fontWeight: 700,
      fontSize: '2rem',
      color,
      lineHeight: 1.1,
    }}>{value}</div>
  );
}
