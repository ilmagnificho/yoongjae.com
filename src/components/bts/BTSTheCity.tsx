import type { BtsLang } from './translations';

interface Props {
  lang: BtsLang;
}

const ITEMS: Record<BtsLang, string[]> = {
  en: [
    'Gwanghwamun media art installations',
    'Seoul landmarks lit in purple',
    'Pop-up stores & photo zones',
    'Han River ARMY events',
  ],
  ko: [
    '광화문 미디어아트 설치',
    '서울 랜드마크 퍼플 야간 조명',
    '팝업 스토어 & 포토존',
    '한강공원 ARMY 이벤트',
  ],
  ja: [
    '光化門メディアアートインスタレーション',
    'ソウルのランドマークが紫色にライトアップ',
    'ポップアップストア＆フォトゾーン',
    '漢江公園 ARMYイベント',
  ],
};

export default function BTSTheCity({ lang }: Props) {
  return (
    <section className="max-w-3xl mx-auto px-6 py-12">
      <div className="border border-[#A855F7]/30 bg-[#A855F7]/5 rounded-2xl p-6">
        <h2 className="text-xl font-bold text-[#A855F7] mb-1">
          🌆 BTS THE CITY Seoul 2026
        </h2>
        <p className="text-xs text-white/40 mb-4">
          {lang === 'ko'
            ? '2026년 3월 20일 – 4월 12일'
            : lang === 'ja'
            ? '2026年3月20日〜4月12日'
            : 'March 20 – April 12, 2026'}
        </p>
        <ul className="space-y-2 text-sm text-white/70">
          {ITEMS[lang].map((item, i) => (
            <li key={i}>• {item}</li>
          ))}
        </ul>
        <p className="text-xs text-white/30 mt-4">
          {lang === 'ko'
            ? '※ HYBE 공식 발표 업데이트 예정'
            : lang === 'ja'
            ? '※ 詳細は後日発表 — HYBE公式チャンネルをご確認ください'
            : '※ Details TBD — check HYBE official channels'}
        </p>
      </div>
    </section>
  );
}
