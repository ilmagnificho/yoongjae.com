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
        <div className="border-2 border-red-300 bg-red-50 rounded-xl p-5">
          <h3 className="text-sm font-bold text-red-600 mb-3">{t('subway.closed')}</h3>
          <ul className="space-y-2">
            {[1, 2, 3].map((i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-red-700">
                <span className="w-5 h-5 flex items-center justify-center bg-red-200 rounded-full text-xs font-bold">✕</span>
                {t(`subway.closed.${i}`)}
              </li>
            ))}
          </ul>
        </div>

        {/* Alternative stations */}
        <div className="border-2 border-green-300 bg-green-50 rounded-xl p-5">
          <h3 className="text-sm font-bold text-green-600 mb-3">{t('subway.use')}</h3>
          <ul className="space-y-2">
            {[1, 2, 3].map((i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-green-700">
                <span className="w-5 h-5 flex items-center justify-center bg-green-200 rounded-full text-xs font-bold">✓</span>
                {t(`subway.alt.${i}`)}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Road closures */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8">
        <h3 className="text-sm font-bold text-amber-700 mb-1">🚧 {t('subway.roads')}</h3>
        <p className="text-sm text-amber-600">{t('subway.roads.list')}</p>
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
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            {t(`routes.tab.${key}`)}
          </button>
        ))}
      </div>

      {/* Route content */}
      <div className="border border-gray-200 rounded-xl p-5 bg-white">
        <p className="text-sm font-bold text-[#6A0DAD] mb-1">
          {t(`routes.tab.${activeTab}`)}
        </p>
        <p className="text-sm text-gray-600">{t(`routes.${activeTab}`)}</p>
        {activeTab === 'airport' && (
          <a
            href="MYREALTRIP_AIRPORT_PICKUP_LINK"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-3 text-xs bg-[#E8D5FF] text-[#4A0080] font-semibold px-3 py-1.5 rounded-full hover:bg-[#d4bfef] transition-colors"
          >
            {t('ad.mrt.airport')}
          </a>
        )}
      </div>
    </section>
  );
}
