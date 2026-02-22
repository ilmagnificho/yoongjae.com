import { useState, useEffect, useRef } from 'react';
import type { BtsLang } from './translations';
import { LANGS, getT } from './translations';

const TARGET = new Date('2026-03-21T20:00:00+09:00').getTime();
const END = new Date('2026-03-21T23:59:59+09:00').getTime();

interface Props {
  lang: BtsLang;
  onLangChange: (l: BtsLang) => void;
}

export default function HeroCountdown({ lang, onLangChange }: Props) {
  const t = getT(lang);
  const [now, setNow] = useState(Date.now());
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  // Particle effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2 + 0.5,
      color: ['#A855F7', '#F5C842', '#FFFFFF'][Math.floor(Math.random() * 3)],
      opacity: Math.random(),
      speed: Math.random() * 0.3 + 0.1,
      dir: Math.random() * Math.PI * 2,
    }));

    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.opacity += (Math.random() - 0.5) * 0.05;
        p.opacity = Math.max(0.1, Math.min(0.8, p.opacity));
        p.x += Math.cos(p.dir) * p.speed;
        p.y += Math.sin(p.dir) * p.speed;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.fill();
      });
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  const diff = TARGET - now;
  const isToday = diff <= 0 && now < END;
  const isEnded = now >= END;

  const days = Math.max(0, Math.floor(diff / 86400000));
  const hrs = Math.max(0, Math.floor((diff % 86400000) / 3600000));
  const mins = Math.max(0, Math.floor((diff % 3600000) / 60000));
  const secs = Math.max(0, Math.floor((diff % 60000) / 1000));

  const countdownBlocks = [
    { value: days, label: lang === 'ko' ? '일' : lang === 'ja' ? '日' : 'DAYS' },
    { value: hrs, label: lang === 'ko' ? '시간' : lang === 'ja' ? '時間' : 'HRS' },
    { value: mins, label: lang === 'ko' ? '분' : lang === 'ja' ? '分' : 'MIN' },
    { value: secs, label: lang === 'ko' ? '초' : lang === 'ja' ? '秒' : 'SEC' },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#1A0A35] via-[#4A0080] to-[#6A0DAD] text-white">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      {/* Language switch */}
      <div className="absolute top-4 right-4 z-10 flex gap-1">
        {LANGS.map((l) => (
          <button
            key={l.code}
            onClick={() => onLangChange(l.code)}
            className={`text-xs px-2 py-1 rounded transition-colors ${
              lang === l.code
                ? 'bg-white/20 text-white font-bold'
                : 'text-white/50 hover:text-white hover:bg-white/10'
            }`}
          >
            {l.label}
          </button>
        ))}
      </div>

      <div className="relative z-[1] max-w-3xl mx-auto px-6 py-16 md:py-24 text-center">
        <p className="text-xs text-white/50 font-mono tracking-widest uppercase mb-4">
          Survival Guide
        </p>
        <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-2">
          {t('hero.title')}
        </h1>
        <p className="text-sm md:text-base font-mono tracking-[0.3em] text-[#F5C842] mb-4 uppercase">
          {t('hero.album')}
        </p>
        <p className="text-lg md:text-xl text-white/70 mb-8">
          {t('hero.subtitle')}
        </p>

        {/* Badges */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {['hero.badge.date', 'hero.badge.venue', 'hero.badge.price', 'hero.badge.time'].map((k) => (
            <span
              key={k}
              className="text-sm bg-white/10 backdrop-blur px-4 py-2 rounded-full"
            >
              {t(k)}
            </span>
          ))}
        </div>

        {/* Countdown */}
        {isEnded ? (
          <p className="text-xl md:text-2xl font-semibold mb-8">
            {t('hero.dday.ended')}
          </p>
        ) : isToday ? (
          <p className="text-xl md:text-2xl font-semibold animate-pulse mb-8">
            {t('hero.dday.today')}
          </p>
        ) : (
          <div className="flex justify-center gap-3 mb-8">
            {countdownBlocks.map(({ value, label }) => (
              <div
                key={label}
                className="flex flex-col items-center justify-center
                           w-16 h-16 md:w-24 md:h-24
                           bg-white/10 backdrop-blur-sm
                           border border-white/20 rounded-2xl"
              >
                <span className="text-2xl md:text-4xl font-bold font-mono leading-none">
                  {String(value).padStart(2, '0')}
                </span>
                <span className="text-[10px] md:text-xs text-white/50 mt-1 tracking-widest uppercase">
                  {label}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="#newsletter-hero"
            className="inline-flex items-center justify-center gap-2 bg-white text-[#4A0080] font-bold text-sm px-6 py-3 rounded-full hover:bg-white/90 transition-colors"
          >
            {t('hero.newsletter')}
          </a>
          <button
            onClick={() => {
              const url = 'https://yoongjae.com/bts' + (lang !== 'en' ? `?lang=${lang}` : '');
              if (navigator.share) {
                navigator.share({ title: t('hero.title'), url });
              } else {
                navigator.clipboard.writeText(url);
              }
            }}
            className="inline-flex items-center justify-center gap-2 border border-white/30 text-white font-bold text-sm px-6 py-3 rounded-full hover:bg-white/10 transition-colors"
          >
            {t('hero.share')}
          </button>
        </div>
      </div>
    </section>
  );
}
