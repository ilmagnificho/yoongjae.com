import type { BtsLang } from './translations';
import { getT } from './translations';

interface Props {
  lang: BtsLang;
}

const PHRASES = ['restroom', 'store', 'taxi', 'howmuch', 'thanks'] as const;

export default function ForInternational({ lang }: Props) {
  const t = getT(lang);

  return (
    <section id="international" className="max-w-3xl mx-auto px-6 py-12">
      <h2 className="text-2xl md:text-3xl font-bold mb-8">{t('intl.title')}</h2>

      {/* Useful Korean Phrases — card layout for mobile */}
      <h3 className="text-lg font-bold mb-4">{t('intl.phrases.title')}</h3>
      <div className="space-y-3 mb-8">
        {PHRASES.map((key) => (
          <div key={key} className="border border-gray-200 rounded-xl p-4 bg-white">
            <p className="text-xs text-gray-500 mb-1">{t(`intl.phrases.${key}`)}</p>
            <p className="text-base font-bold text-gray-900 mb-1">{t(`intl.phrases.${key}.ko`)}</p>
            <p className="text-sm text-[#6A0DAD] font-mono">{t(`intl.phrases.${key}.pron`)}</p>
          </div>
        ))}
      </div>

      {/* Emergency numbers */}
      <h3 className="text-lg font-bold mb-4">{t('intl.emergency.title')}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {(['police', 'fire', 'tourist'] as const).map((key) => (
          <div
            key={key}
            className="border border-gray-200 rounded-xl p-4 text-center"
          >
            <p className="text-sm font-bold">{t(`intl.emergency.${key}`)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
