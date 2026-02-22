import { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import type { BtsLang } from './translations';
import { getT, getList } from './translations';

interface Props {
  lang: BtsLang;
}

const STORAGE_KEY = 'bts-checklist-2026';

const PRODUCTS = [
  { key: 'check.product.charger', href: 'https://link.coupang.com/a/dQ224f' },
  { key: 'check.product.poncho', href: 'https://link.coupang.com/a/dQ24Ll' },
];

export default function Checklist({ lang }: Props) {
  const t = getT(lang);
  const items = getList(lang, 'check.items');
  const [checked, setChecked] = useState<boolean[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setChecked(Array.isArray(parsed) ? parsed : new Array(items.length).fill(false));
      } else {
        setChecked(new Array(items.length).fill(false));
      }
    } catch {
      setChecked(new Array(items.length).fill(false));
    }
  }, [items.length]);

  const toggle = (i: number) => {
    const next = [...checked];
    next[i] = !next[i];
    setChecked(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch { /* noop */ }
  };

  const allDone = checked.length > 0 && checked.every(Boolean);
  const count = checked.filter(Boolean).length;
  const firedConfetti = useRef(false);

  useEffect(() => {
    if (allDone && !firedConfetti.current) {
      firedConfetti.current = true;
      confetti({
        particleCount: 120,
        spread: 80,
        colors: ['#7B2FBE', '#A855F7', '#F5C842', '#FFFFFF'],
        origin: { y: 0.6 },
      });
    }
    if (!allDone) {
      firedConfetti.current = false;
    }
  }, [allDone]);

  return (
    <section id="checklist" className="max-w-3xl mx-auto px-6 py-12">
      <h2 className="text-2xl md:text-3xl font-bold mb-2">{t('check.title')}</h2>
      <p className="text-sm text-white/40 mb-6">
        {count}/{items.length}
      </p>

      {/* Progress bar */}
      <div className="w-full bg-white/10 rounded-full h-2 mb-6">
        <div
          className="h-2 rounded-full bg-[#6A0DAD] transition-all duration-300"
          style={{ width: `${items.length ? (count / items.length) * 100 : 0}%` }}
        />
      </div>

      {allDone ? (
        <div className="bg-gradient-to-br from-[#4A0080] to-[#6A0DAD] text-white rounded-2xl p-8 text-center">
          <p className="text-2xl font-bold mb-4">{t('check.done')}</p>
          <button
            onClick={() => {
              const url = 'https://yoongjae.com/bts' + (lang !== 'en' ? `?lang=${lang}` : '');
              if (navigator.share) {
                navigator.share({ title: 'BTS Checklist Complete! 💜', url });
              } else {
                navigator.clipboard.writeText(url);
              }
            }}
            className="bg-white text-[#4A0080] font-bold text-sm px-6 py-3 rounded-full hover:bg-white/90 transition-colors"
          >
            {t('check.share')}
          </button>
        </div>
      ) : (
        <ul className="space-y-2">
          {items.map((item, i) => (
            <li key={i}>
              <label className="flex items-center gap-3 p-3 rounded-xl border border-white/10 hover:border-[#A855F7]/40 cursor-pointer transition-colors group bg-[#1A0A35]">
                <input
                  type="checkbox"
                  checked={checked[i] || false}
                  onChange={() => toggle(i)}
                  className="w-5 h-5 rounded accent-[#6A0DAD] shrink-0"
                />
                <span
                  className={`text-sm flex-1 transition-colors ${
                    checked[i] ? 'line-through text-white/30' : 'text-white/70'
                  }`}
                >
                  {item}
                </span>
              </label>
            </li>
          ))}
        </ul>
      )}

      {/* Recommended products — separate from checklist */}
      <div className="mt-8">
        <h3 className="text-lg font-bold mb-2">{t('check.products.title')}</h3>
        <p className="text-xs text-white/60 border border-white/10 rounded-lg px-3 py-2 mb-4 bg-[#1A0A35]">
          {t('ad.coupang.notice')}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {PRODUCTS.map((product) => (
            <a
              key={product.href}
              href={product.href}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="block border border-white/10 rounded-xl p-4 hover:border-[#A855F7]/50 hover:shadow-lg hover:shadow-[#A855F7]/10 transition-all group bg-[#1A0A35]"
            >
              <p className="text-sm font-semibold text-white/90 group-hover:text-[#A855F7] transition-colors mb-4">
                {t(product.key)}
              </p>
              <span className="block w-full text-center text-sm font-bold text-white bg-[#6A0DAD] rounded-full py-2.5 group-hover:bg-[#4A0080] transition-colors">
                {t('merch.cta')}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
