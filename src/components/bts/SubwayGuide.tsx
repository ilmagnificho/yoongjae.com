import { useState } from 'react';
import type { BtsLang } from './translations';
import { getT } from './translations';

interface Props {
  lang: BtsLang;
}

const ROUTE_KEYS = ['gangnam', 'hongdae', 'airport', 'outside'] as const;

export default function SubwayGuide({ lang }: Props) {
  const t = getT(lang);
  const [activeTab, setActiveTab] = useState<(typeof ROUTE_KEYS)[number]>('airport');

  return (
    <section id="subway" className="max-w-3xl mx-auto px-6 py-12">
      <h2 className="text-2xl md:text-3xl font-bold mb-8">{t('subway.title')}</h2>

      {/* Closed vs Alternative */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {/* Closed stations */}
        <div className="border-2 border-red-500/30 bg-red-500/10 rounded-xl p-5">
          <h3 className="text-sm font-bold text-red-400 mb-3">{t('subway.closed')}</h3>
          <ul className="space-y-2">
            {[1, 2, 3].map((i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-red-300">
                <span className="w-5 h-5 flex items-center justify-center bg-red-500/20 rounded-full text-xs font-bold">✕</span>
                {t(`subway.closed.${i}`)}
              </li>
            ))}
          </ul>
        </div>

        {/* Alternative stations */}
        <div className="border-2 border-green-500/30 bg-green-500/10 rounded-xl p-5">
          <h3 className="text-sm font-bold text-green-400 mb-3">{t('subway.use')}</h3>
          <ul className="space-y-2">
            {[1, 2, 3].map((i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-green-300">
                <span className="w-5 h-5 flex items-center justify-center bg-green-500/20 rounded-full text-xs font-bold">✓</span>
                {t(`subway.alt.${i}`)}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Warning: misleading alternatives */}
      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mb-6">
        <p className="text-sm text-yellow-300 font-bold mb-1">⚠️ {lang === 'ko' ? '주의' : lang === 'ja' ? '注意' : 'Warning'}</p>
        <p className="text-xs text-yellow-200/80">
          {lang === 'ko'
            ? '일부 온라인 가이드에서 시청역·경복궁역을 대안으로 안내하고 있으나, 이 역들도 당일 무정차 예정입니다.'
            : lang === 'ja'
            ? '一部のガイドでは市庁駅・景福宮駅が代替として案内されていますが、これらの駅も当日は無停車の予定です。'
            : 'Some online guides suggest City Hall or Gyeongbokgung stations as alternatives — but these stations are also closed on concert day.'}
        </p>
      </div>

      {/* Road closures */}
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mb-8">
        <h3 className="text-sm font-bold text-amber-400 mb-1">🚧 {t('subway.roads')}</h3>
        <p className="text-sm text-amber-300/80">{t('subway.roads.list')}</p>
      </div>

      {/* Recommended routes */}
      <h2 className="text-2xl md:text-3xl font-bold mb-4">{t('routes.title')}</h2>

      {/* Route tabs */}
      <div className="flex gap-1.5 mb-4 overflow-x-auto pb-2 scrollbar-hide">
        {ROUTE_KEYS.map((key) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`text-xs px-3 py-1.5 rounded-full whitespace-nowrap transition-colors ${
              activeTab === key
                ? 'bg-[#6A0DAD] text-white'
                : 'bg-white/10 text-white/50 hover:bg-white/20'
            }`}
          >
            {t(`routes.tab.${key}`)}
          </button>
        ))}
      </div>

      {/* Route content */}
      <div className="border border-white/10 rounded-xl p-5 bg-[#1A0A35]">
        <p className="text-sm font-bold text-[#A855F7] mb-1">
          {t(`routes.tab.${activeTab}`)}
        </p>
        <p className="text-sm text-white/60">{t(`routes.${activeTab}`)}</p>
      </div>
    </section>
  );
}
