import type { BtsLang } from './translations';
import { getT } from './translations';

interface Props {
  lang: BtsLang;
}

const ZONES = [
  { key: 'core', color: '#4A0080', bg: 'bg-[#4A0080]', height: 'h-28' },
  { key: 'hot', color: '#6A0DAD', bg: 'bg-[#6A0DAD]', height: 'h-24' },
  { key: 'warm', color: '#9B59B6', bg: 'bg-[#9B59B6]', height: 'h-20' },
  { key: 'cold', color: '#C39BD3', bg: 'bg-[#C39BD3]', height: 'h-16' },
] as const;

export default function ZoneMap({ lang }: Props) {
  const t = getT(lang);

  return (
    <section id="zone-map" className="max-w-3xl mx-auto px-6 py-12">
      <h2 className="text-2xl md:text-3xl font-bold mb-2">{t('zone.title')}</h2>
      <p className="text-sm text-gray-500 mb-8">{t('zone.note')}</p>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Visual zone strip */}
        <div className="flex-1 rounded-2xl overflow-hidden border border-gray-200">
          {/* Stage indicator */}
          <div className="bg-gray-900 text-white text-center py-2 text-xs font-bold tracking-wider">
            🎤 STAGE
          </div>
          {ZONES.map((zone) => (
            <div
              key={zone.key}
              className={`${zone.bg} ${zone.height} flex items-center justify-between px-5 text-white border-b border-white/10`}
            >
              <div>
                <p className="text-lg font-bold">{t(`zone.${zone.key}`)}</p>
                <p className="text-xs text-white/70">{t(`zone.${zone.key}.area`)}</p>
              </div>
              <span className="text-xs bg-white/20 px-2 py-1 rounded-full whitespace-nowrap">
                {t(`zone.${zone.key}.time`)}
              </span>
            </div>
          ))}
          {/* City Hall indicator */}
          <div className="bg-gray-100 text-gray-500 text-center py-2 text-xs font-bold tracking-wider">
            🏛️ CITY HALL ↓
          </div>
        </div>

        {/* Legend */}
        <div className="md:w-48 space-y-3">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Zone Legend</p>
          {ZONES.map((zone) => (
            <div key={zone.key} className="flex items-start gap-2">
              <span
                className="w-4 h-4 rounded-sm shrink-0 mt-0.5"
                style={{ backgroundColor: zone.color }}
              />
              <div>
                <p className="text-sm font-bold">{t(`zone.${zone.key}`)}</p>
                <p className="text-xs text-gray-500">{t(`zone.${zone.key}.time`)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Naver Maps placeholder */}
      <div className="mt-6 border border-dashed border-gray-300 rounded-xl p-6 text-center bg-gray-50">
        <p className="text-sm text-gray-400 mb-2">
          🗺️ Interactive Naver Maps coming soon
        </p>
        <p className="text-xs text-gray-300">
          Gwanghwamun Square · 37.5760°N, 126.9769°E
        </p>
      </div>
    </section>
  );
}
