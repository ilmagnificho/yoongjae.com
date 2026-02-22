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
        <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-[#A855F7]/30" />

        <div className="space-y-6">
          {STEPS.map((step, i) => (
            <div key={i} className="relative flex gap-4 pl-12">
              {/* Dot */}
              <span className="absolute left-2 w-7 h-7 flex items-center justify-center text-base bg-[#1A0A35] border-2 border-[#A855F7]/50 rounded-full">
                {step.dot}
              </span>
              <div className="flex-1 bg-[#1A0A35] border border-white/10 rounded-xl p-4">
                <p className="text-sm font-bold text-[#A855F7] mb-1">{t(step.timeKey)}</p>
                <p className="text-sm text-white/60">{t(step.descKey)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}
