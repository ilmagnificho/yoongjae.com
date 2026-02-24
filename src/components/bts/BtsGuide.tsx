import { useState, useEffect, useCallback } from 'react';
import type { BtsLang } from './translations';
import { getT } from './translations';
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

const STIBEE_URL = 'https://stibee.com/api/v1.0/lists/b-u-zuAfT1K6CYLofSqcWz4JC2OSSg==/public/subscribers';

function useStibeeForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus('loading');
    try {
      await fetch(STIBEE_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: new URLSearchParams(new FormData(form) as any),
      });
      setStatus('success');
      form.reset();
      setTimeout(() => setStatus('idle'), 5000);
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  }, []);
  return { status, handleSubmit };
}

export default function BtsGuide() {
  const [lang, setLang] = useState<BtsLang>('en');
  const form1 = useStibeeForm();
  const form2 = useStibeeForm();

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

      {/* Newsletter CTA #1 */}
      <div data-animate id="newsletter-hero" className="max-w-3xl mx-auto px-6 py-8">
        <div className="bg-[#A855F7]/10 border border-[#A855F7]/30 rounded-xl p-5 text-center">
          <p className="text-sm font-bold text-[#A855F7] mb-3">{t('ad.newsletter.cta')}</p>
          <form
            onSubmit={form1.handleSubmit}
            className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto"
          >
            <input
              type="email"
              name="email"
              required
              placeholder="Email"
              className="flex-1 bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#A855F7]"
            />
            <button
              type="submit"
              disabled={form1.status === 'loading'}
              className="bg-[#6A0DAD] text-white text-sm font-bold px-5 py-2 rounded-lg hover:bg-[#4A0080] transition-colors disabled:opacity-50"
            >
              {form1.status === 'loading' ? '...' : form1.status === 'success' ? '✓' : form1.status === 'error' ? '!' : (lang === 'ko' ? '구독하기' : lang === 'ja' ? '購読する' : 'Subscribe')}
            </button>
          </form>
          {form1.status === 'success' && <p className="text-xs text-green-300 mt-2">{lang === 'ko' ? '구독 확인 이메일을 확인해 주세요.' : lang === 'ja' ? '確認メールをご確認ください。' : 'Check your email for confirmation.'}</p>}
        </div>
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

      {/* Newsletter CTA #2 + Monetization footer */}
      <section data-animate className="max-w-3xl mx-auto px-6 py-8 space-y-6">
        {/* Newsletter */}
        <div className="bg-gradient-to-br from-[#4A0080] to-[#6A0DAD] rounded-xl p-6 text-center text-white">
          <p className="text-lg font-bold mb-3">{t('ad.newsletter.cta')}</p>
          <form
            onSubmit={form2.handleSubmit}
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
              disabled={form2.status === 'loading'}
              className="bg-white text-[#4A0080] text-sm font-bold px-5 py-2 rounded-lg hover:bg-white/90 transition-colors disabled:opacity-50"
            >
              {form2.status === 'loading' ? '...' : form2.status === 'success' ? '✓' : form2.status === 'error' ? '!' : (lang === 'ko' ? '구독하기' : lang === 'ja' ? '購読する' : 'Subscribe')}
            </button>
          </form>
          {form2.status === 'success' && <p className="text-xs text-green-300 mt-2">{lang === 'ko' ? '구독 확인 이메일을 확인해 주세요.' : lang === 'ja' ? '確認メールをご確認ください。' : 'Check your email for confirmation.'}</p>}
        </div>

        {/* Disclaimers */}
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
