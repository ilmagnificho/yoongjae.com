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

      {/* Useful Korean Phrases */}
      <h3 className="text-lg font-bold mb-4">{t('intl.phrases.title')}</h3>
      <div className="overflow-x-auto mb-8">
        <table className="w-full text-sm border border-gray-200 rounded-xl overflow-hidden">
          <thead>
            <tr className="bg-[#E8D5FF]">
              <th className="text-left px-4 py-2 font-bold text-[#4A0080]">Situation</th>
              <th className="text-left px-4 py-2 font-bold text-[#4A0080]">Korean</th>
              <th className="text-left px-4 py-2 font-bold text-[#4A0080]">Pronunciation</th>
            </tr>
          </thead>
          <tbody>
            {PHRASES.map((key) => (
              <tr key={key} className="border-t border-gray-100">
                <td className="px-4 py-3 text-gray-700">{t(`intl.phrases.${key}`)}</td>
                <td className="px-4 py-3 font-semibold">{t(`intl.phrases.${key}.ko`)}</td>
                <td className="px-4 py-3 text-gray-500 font-mono text-xs">{t(`intl.phrases.${key}.pron`)}</td>
              </tr>
            ))}
          </tbody>
        </table>
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
