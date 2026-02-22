import type { BtsLang } from './translations';
import { getT } from './translations';

interface Props {
  lang: BtsLang;
}

const STEPS = [
  { timeKey: 'tl.dminus1', descKey: 'tl.dminus1.desc', dot: '📋' },
  { timeKey: 'tl.early', descKey: 'tl.early.desc', dot: '🌅' },
  { timeKey: 'tl.mid', descKey: 'tl.mid.desc', dot: '☀️' },
  { timeKey: 'tl.late', descKey: 'tl.late.desc', dot: '🕐' },
  { timeKey: 'tl.show', descKey: 'tl.show.desc', dot: '🎤' },
  { timeKey: 'tl.after', descKey: 'tl.after.desc', dot: '🚶' },
];

export default function Timeline({ lang }: Props) {
  const t = getT(lang);

  return (
    <section id="timeline" className="max-w-3xl mx-auto px-6 py-12">
      <h2 className="text-2xl md:text-3xl font-bold mb-8">{t('tl.title')}</h2>

      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-[#E8D5FF]" />

        <div className="space-y-6">
          {STEPS.map((step, i) => (
            <div key={i} className="relative flex gap-4 pl-12">
              {/* Dot */}
              <span className="absolute left-2 w-7 h-7 flex items-center justify-center text-base bg-white border-2 border-[#C39BD3] rounded-full">
                {step.dot}
              </span>
              <div className="flex-1 bg-white border border-gray-200 rounded-xl p-4">
                <p className="text-sm font-bold text-[#6A0DAD] mb-1">{t(step.timeKey)}</p>
                <p className="text-sm text-gray-600">{t(step.descKey)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MyRealTrip banner */}
      <a
        href="MYREALTRIP_KPOP_TOUR_LINK"
        target="_blank"
        rel="noopener noreferrer"
        className="block mt-8 border border-[#E8D5FF] bg-[#E8D5FF]/30 rounded-xl p-4 hover:bg-[#E8D5FF]/50 transition-colors"
      >
        <p className="text-sm font-bold text-[#4A0080]">{t('ad.mrt.tour')}</p>
      </a>
    </section>
  );
}
