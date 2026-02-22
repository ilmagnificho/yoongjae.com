import { useState, useEffect } from 'react';
import type { BtsLang } from './translations';
import { getT } from './translations';
import HeroCountdown from './HeroCountdown';
import SubwayGuide from './SubwayGuide';
import ZoneMap from './ZoneMap';
import Checklist from './Checklist';
import Timeline from './Timeline';
import ForInternational from './ForInternational';
import ShareFloat from './ShareFloat';

export default function BtsGuide() {
  const [lang, setLang] = useState<BtsLang>('en');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlLang = params.get('lang');
    if (urlLang && ['en', 'ko', 'ja'].includes(urlLang)) {
      setLang(urlLang as BtsLang);
    }
  }, []);

  const switchLang = (newLang: BtsLang) => {
    setLang(newLang);
    const url = new URL(window.location.href);
    if (newLang === 'en') {
      url.searchParams.delete('lang');
    } else {
      url.searchParams.set('lang', newLang);
    }
    window.history.replaceState({}, '', url.toString());
  };

  const t = getT(lang);

  return (
    <div className="min-h-screen bg-white">
      <HeroCountdown lang={lang} onLangChange={switchLang} />

      {/* Coupang Partners disclosure — KFTC required, top-of-page, clearly visible */}
      <div className="max-w-3xl mx-auto px-6 pt-4">
        <p className="text-xs text-gray-600 border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 text-center">
          {t('ad.coupang.notice')}
        </p>
      </div>

      {/* Newsletter CTA #1 */}
      <div id="newsletter-hero" className="max-w-3xl mx-auto px-6 py-8">
        <div className="bg-[#E8D5FF]/40 border border-[#C39BD3] rounded-xl p-5 text-center">
          <p className="text-sm font-bold text-[#4A0080] mb-3">{t('ad.newsletter.cta')}</p>
          <form
            action="https://stibee.com/api/v1.0/lists/b-u-zuAfT1K6CYLofSqcWz4JC2OSSg==/public/subscribers"
            method="POST"
            target="_blank"
            className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto"
          >
            <input
              type="email"
              name="email"
              required
              placeholder="Email"
              className="flex-1 border border-[#C39BD3] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#6A0DAD]"
            />
            <button
              type="submit"
              className="bg-[#6A0DAD] text-white text-sm font-bold px-5 py-2 rounded-lg hover:bg-[#4A0080] transition-colors"
            >
              {lang === 'ko' ? '구독하기' : lang === 'ja' ? '購読する' : 'Subscribe'}
            </button>
          </form>
        </div>
      </div>

      <SubwayGuide lang={lang} />
      <ZoneMap lang={lang} />
      <Checklist lang={lang} />

      {/* Merch — Coupang Partners */}
      <section className="max-w-3xl mx-auto px-6 py-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-1">{t('merch.title')}</h2>
        <p className="text-sm text-gray-500 mb-4">{t('merch.subtitle')}</p>
        <p className="text-xs text-gray-600 border border-gray-200 rounded-lg px-3 py-2 mb-4 bg-gray-50">
          {t('ad.coupang.notice')}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { name: t('merch.lightstick'), href: 'https://link.coupang.com/a/dQ26ay' },
            { name: t('merch.album'), href: 'https://link.coupang.com/a/dQ27vL' },
          ].map((product) => (
            <a
              key={product.href}
              href={product.href}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="block border border-gray-200 rounded-xl p-4 hover:border-[#C39BD3] hover:shadow-md transition-all group"
            >
              <p className="text-sm font-semibold text-gray-800 group-hover:text-[#6A0DAD] transition-colors mb-4">
                {product.name}
              </p>
              <span className="block w-full text-center text-sm font-bold text-white bg-[#6A0DAD] rounded-full py-2.5 group-hover:bg-[#4A0080] transition-colors">
                {t('merch.cta')}
              </span>
            </a>
          ))}
        </div>
      </section>

      <Timeline lang={lang} />
      <ForInternational lang={lang} />

      {/* Newsletter CTA #2 + Monetization footer */}
      <section className="max-w-3xl mx-auto px-6 py-8 space-y-6">
        {/* Newsletter */}
        <div className="bg-gradient-to-br from-[#4A0080] to-[#6A0DAD] rounded-xl p-6 text-center text-white">
          <p className="text-lg font-bold mb-3">{t('ad.newsletter.cta')}</p>
          <form
            action="https://stibee.com/api/v1.0/lists/b-u-zuAfT1K6CYLofSqcWz4JC2OSSg==/public/subscribers"
            method="POST"
            target="_blank"
            className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto"
          >
            <input
              type="email"
              name="email"
              required
              placeholder="Email"
              className="flex-1 bg-white/10 border border-white/30 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-white/60"
            />
            <button
              type="submit"
              className="bg-white text-[#4A0080] text-sm font-bold px-5 py-2 rounded-lg hover:bg-white/90 transition-colors"
            >
              {lang === 'ko' ? '구독하기' : lang === 'ja' ? '購読する' : 'Subscribe'}
            </button>
          </form>
        </div>

        {/* Disclaimers */}
        <div className="text-center space-y-2 pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-500">{t('ad.coupang.notice')}</p>
          <p className="text-xs text-gray-400">{t('footer.disclaimer')}</p>
          <p className="text-xs text-gray-300">
            {t('footer.updated')}: 2026-02-22
          </p>
        </div>
      </section>

      <ShareFloat lang={lang} />
    </div>
  );
}
