import type { ReactNode } from 'react';
import { GRADE_COLORS } from './data';

export const V = {
  bg: '#0a0a0f', surface: '#12121a', surface2: '#1a1a26', border: '#2a2a3a',
  accent: '#4f8cff', accent2: '#7c5cfc', accent3: '#00e5a0', accent4: '#ff6b6b', accent5: '#ffd93d',
  text: '#e8e8f0', text2: '#8888aa',
};

export function Card({ children }: { children: ReactNode }) {
  return (
    <div style={{
      background: V.surface, border: `1px solid ${V.border}`, borderRadius: 16,
      padding: 24, position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 2,
        background: `linear-gradient(90deg, ${V.accent}, ${V.accent2}, transparent)`,
      }} />
      {children}
    </div>
  );
}

export function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <div style={{
      fontFamily: "'Bebas Neue', sans-serif", fontSize: '1rem', letterSpacing: 2,
      color: V.text, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10,
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
        height: '100%', borderRadius: 3, width: `${width}%`,
        background: gradient, transition: 'width 0.8s ease',
      }} />
    </div>
  );
}

export function GradeBadge({ grade }: { grade: 'A' | 'B' | 'C' | 'D' }) {
  const c = GRADE_COLORS[grade];
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
      background: V.surface2, border: `1px solid ${V.border}`,
      borderRadius: 12, padding: 20,
    }}>
      <div style={{ fontSize: '0.78rem', color: V.text2 }}>{label}</div>
      {children}
    </div>
  );
}

export function BigNum({ value, color }: { value: string; color: string }) {
  return (
    <div style={{
      fontFamily: "'Bebas Neue', sans-serif", fontSize: '2.2rem', color,
    }}>{value}</div>
  );
}
