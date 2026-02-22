import { useState, useEffect } from 'react';
import type { BtsLang } from './translations';
import { getT, getList } from './translations';

interface Props {
  lang: BtsLang;
}

const STORAGE_KEY = 'bts-checklist-2026';
const COUPANG_LINKS: Record<number, string> = {
  0: 'https://link.coupang.com/a/dQ224f', // portable charger
  3: 'https://link.coupang.com/a/dQ24Ll', // rain poncho
};

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

  return (
    <section id="checklist" className="max-w-3xl mx-auto px-6 py-12">
      <h2 className="text-2xl md:text-3xl font-bold mb-2">{t('check.title')}</h2>
      <p className="text-sm text-gray-400 mb-6">
        {count}/{items.length}
      </p>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
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
              <label className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:border-[#C39BD3] cursor-pointer transition-colors group">
                <input
                  type="checkbox"
                  checked={checked[i] || false}
                  onChange={() => toggle(i)}
                  className="w-5 h-5 rounded accent-[#6A0DAD] shrink-0"
                />
                <span
                  className={`text-sm flex-1 transition-colors ${
                    checked[i] ? 'line-through text-gray-400' : 'text-gray-700'
                  }`}
                >
                  {item}
                </span>
                {COUPANG_LINKS[i] && (
                  <a
                    href={COUPANG_LINKS[i]}
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    className="text-xs text-[#6A0DAD] font-semibold hover:underline shrink-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {t('check.coupang')}
                  </a>
                )}
              </label>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
