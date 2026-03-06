import { useState, useEffect } from 'react';
import type { BtsLang } from './translations';
import { getT } from './translations';

declare global { interface Window { __ga4?: { trackEvent: (event: string, params?: Record<string, unknown>) => void } } }
import HeroCountdown from './HeroCountdown';
import TicketCTA from './TicketCTA';
import SubwayGuide from './SubwayGuide';
import ZoneMap from './ZoneMap';
import Checklist from './Checklist';
import Timeline from './Timeline';
import BTSTheCity from './BTSTheCity';
import FoodStrategy from './FoodStrategy';
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
    window.__ga4?.trackEvent('bts_lang_switch', { language: newLang });
  };

  // Scroll fade-in animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100', 'translate-y-0');
            entry.target.classList.remove('opacity-0', 'translate-y-6');
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('[data-animate]').forEach((el) => {
      el.classList.add('opacity-0', 'translate-y-6', 'transition-all', 'duration-500');
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const t = getT(lang);

  return (
    <div className="min-h-screen bg-[#0D0520] text-white">
      <HeroCountdown lang={lang} onLangChange={switchLang} />

      {/* Ticket CTA — most urgent, right below hero */}
      <TicketCTA lang={lang} />

      {/* Coupang Partners disclosure — KFTC required, top-of-page, clearly visible */}
      <div className="max-w-3xl mx-auto px-6 pt-4">
        <p className="text-xs text-white/60 border border-white/10 rounded-lg px-3 py-2 bg-[#1A0A35] text-center">
          {t('ad.coupang.notice')}
        </p>
      </div>

      <div data-animate><SubwayGuide lang={lang} /></div>
      <div data-animate><ZoneMap lang={lang} /></div>
      <div data-animate><Checklist lang={lang} /></div>

      {/* Merch — Coupang Partners */}
      <section data-animate className="max-w-3xl mx-auto px-6 py-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-1">{t('merch.title')}</h2>
        <p className="text-sm text-white/50 mb-4">{t('merch.subtitle')}</p>
        <p className="text-xs text-white/60 border border-white/10 rounded-lg px-3 py-2 mb-4 bg-[#1A0A35]">
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
              className="block border border-white/10 rounded-xl p-4 hover:border-[#A855F7]/50 hover:shadow-lg hover:shadow-[#A855F7]/10 transition-all group bg-[#1A0A35]"
            >
              <p className="text-sm font-semibold text-white/90 group-hover:text-[#A855F7] transition-colors mb-4">
                {product.name}
              </p>
              <span className="block w-full text-center text-sm font-bold text-white bg-[#6A0DAD] rounded-full py-2.5 group-hover:bg-[#4A0080] transition-colors">
                {t('merch.cta')}
              </span>
            </a>
          ))}
        </div>
      </section>

      <div data-animate><Timeline lang={lang} /></div>
      <div data-animate><BTSTheCity lang={lang} /></div>
      <div data-animate><FoodStrategy lang={lang} /></div>
      <div data-animate><ForInternational lang={lang} /></div>

      {/* Disclaimers footer */}
      <section data-animate className="max-w-3xl mx-auto px-6 py-8 space-y-6">
        <div className="text-center space-y-2 pt-4 border-t border-white/10">
          <p className="text-xs text-white/40">{t('ad.coupang.notice')}</p>
          <p className="text-xs text-white/30">{t('footer.disclaimer')}</p>
          <p className="text-xs text-white/20">
            {t('footer.updated')}: 2026-02-23
          </p>
        </div>
      </section>

      <ShareFloat lang={lang} />
    </div>
  );
}
