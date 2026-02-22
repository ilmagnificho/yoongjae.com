import { useState, useEffect } from 'react';
import type { BtsLang } from './translations';
import { LANGS, getT } from './translations';

const TARGET = new Date('2026-03-21T00:00:00+09:00').getTime();
const END = new Date('2026-03-22T00:00:00+09:00').getTime();

interface Props {
  lang: BtsLang;
  onLangChange: (l: BtsLang) => void;
}

export default function HeroCountdown({ lang, onLangChange }: Props) {
  const t = getT(lang);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const diff = TARGET - now;
  const isToday = diff <= 0 && now < END;
  const isEnded = now >= END;

  const days = Math.max(0, Math.floor(diff / 86400000));
  const hrs = Math.max(0, Math.floor((diff % 86400000) / 3600000));
  const mins = Math.max(0, Math.floor((diff % 3600000) / 60000));
  const secs = Math.max(0, Math.floor((diff % 60000) / 1000));

  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#4A0080] to-[#6A0DAD] text-white">
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

      <div className="max-w-3xl mx-auto px-6 py-16 md:py-24 text-center">
        <p className="text-xs text-white/50 font-mono tracking-widest uppercase mb-4">
          Survival Guide
        </p>
        <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-3">
          {t('hero.title')}
        </h1>
        <p className="text-lg md:text-xl text-white/70 mb-8">
          {t('hero.subtitle')}
        </p>

        {/* Badges */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {['hero.badge.date', 'hero.badge.venue', 'hero.badge.price'].map((k) => (
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
          <div className="mb-8">
            <p className="text-5xl md:text-7xl font-bold font-mono tracking-tight mb-2">
              D-{days}
            </p>
            <p className="text-2xl md:text-3xl font-mono text-white/70">
              {pad(hrs)}:{pad(mins)}:{pad(secs)}
            </p>
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
