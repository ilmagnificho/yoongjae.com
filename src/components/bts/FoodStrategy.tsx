import { useState } from 'react';
import type { BtsLang } from './translations';

interface Props {
  lang: BtsLang;
}

type Tab = 'before' | 'during' | 'after';

const TABS: Record<BtsLang, Record<Tab, string>> = {
  en: { before: 'Before Concert', during: 'Concert Day Reality', after: 'After Concert' },
  ko: { before: '공연 전', during: '당일 현실', after: '공연 후' },
  ja: { before: 'コンサート前', during: '当日の現実', after: 'コンサート後' },
};

const CONTENT: Record<BtsLang, Record<Tab, { title?: string; items: string[] }>> = {
  en: {
    before: {
      title: 'Recommended nearby restaurants (visit early!)',
      items: [
        '🍗 Tosokchon Samgyetang — famous ginseng chicken soup near Gyeongbokgung',
        '🍲 Gwanghwamun Gukbap — hearty rice soup, opens early',
        '🥐 Artist Bakery — popular BTS-themed café near Jongno',
        '⚠️ Expect long waits — go before 10 AM',
      ],
    },
    during: {
      title: '⚠️ Everything within 1km will have 2+ hour waits',
      items: [
        '1. Stock up at convenience stores in the morning (triangle kimbap + water sell out by afternoon)',
        '2. D-Tower restaurants (near Gwanghwamun, less crowded)',
        '3. Shinsegae / Lotte Department Store basement food hall',
        '4. Pre-order delivery to your hotel for after the show',
      ],
    },
    after: {
      title: 'Post-concert survival tips',
      items: [
        '🚇 Subway will be extremely crowded — wait 30–60 minutes',
        '🍜 Order jajangmyeon delivery to your hotel',
        '🚕 Pre-book a taxi via Kakao T (surge pricing likely)',
        '☕ Wait at a nearby café — Starbucks Gwanghwamun, Twosome Place, etc.',
      ],
    },
  },
  ko: {
    before: {
      title: '추천 맛집 (일찍 방문 필수!)',
      items: [
        '🍗 토속촌 삼계탕 — 경복궁 근처 유명 삼계탕',
        '🍲 광화문 국밥 — 든든한 국밥, 이른 아침부터 영업',
        '🥐 아티스트 베이커리 — 종로 근처 인기 카페',
        '⚠️ 대기 예상 — 오전 10시 전 방문 권장',
      ],
    },
    during: {
      title: '⚠️ 반경 1km 카페/식당 웨이팅 2시간+ 예상',
      items: [
        '1. 오전에 편의점에서 식량 비축 (오후에 삼각김밥·물 품절)',
        '2. D-타워 내 식당 (광화문 인근, 비교적 여유)',
        '3. 신세계/롯데 백화점 지하 식품관',
        '4. 공연 후 숙소 배달 미리 주문 추천',
      ],
    },
    after: {
      title: '공연 후 생존 팁',
      items: [
        '🚇 지하철 극심 혼잡 → 30~60분 대기 권장',
        '🍜 숙소로 자장면 배달 추천 (배달의민족, 쿠팡이츠)',
        '🚕 카카오T로 택시 미리 예약 (할증 예상)',
        '☕ 근처 카페에서 대기 — 스타벅스 광화문, 투썸플레이스 등',
      ],
    },
  },
  ja: {
    before: {
      title: 'おすすめレストラン（早めの訪問必須！）',
      items: [
        '🍗 トソクチョン参鶏湯 — 景福宮近くの有名参鶏湯店',
        '🍲 光化門クッパ — ボリューム満点のスープご飯',
        '🥐 アーティストベーカリー — 鍾路近くの人気カフェ',
        '⚠️ 長い待ち時間が予想 — 午前10時前の訪問推奨',
      ],
    },
    during: {
      title: '⚠️ 半径1km以内のカフェ/レストランは2時間以上待ち',
      items: [
        '1. 午前中にコンビニで食料を確保（午後はおにぎり・水が売り切れ）',
        '2. Dタワー内レストラン（光化門近く、比較的空いている）',
        '3. 新世界/ロッテ百貨店の地下食品売場',
        '4. 公演後のホテルへのデリバリーを事前注文',
      ],
    },
    after: {
      title: 'コンサート後のサバイバルTips',
      items: [
        '🚇 地下鉄は大混雑 → 30〜60分待機推奨',
        '🍜 ホテルにジャージャー麺のデリバリーを注文',
        '🚕 Kakao Tでタクシーを事前予約（割増料金の可能性あり）',
        '☕ 近くのカフェで待機 — スターバックス光化門、Twosome Placeなど',
      ],
    },
  },
};

export default function FoodStrategy({ lang }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('during');

  const tabKeys: Tab[] = ['before', 'during', 'after'];
  const content = CONTENT[lang][activeTab];

  return (
    <section className="max-w-3xl mx-auto px-6 py-12">
      <h2 className="text-2xl md:text-3xl font-bold mb-6">
        {lang === 'ko' ? '🍽️ 먹거리 & 생존 전략' : lang === 'ja' ? '🍽️ グルメ＆サバイバル戦略' : '🍽️ Food & Survival Strategy'}
      </h2>

      {/* Tabs */}
      <div className="flex gap-1.5 mb-4 overflow-x-auto pb-2 scrollbar-hide">
        {tabKeys.map((key) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`text-xs px-3 py-1.5 rounded-full whitespace-nowrap transition-colors ${
              activeTab === key
                ? 'bg-[#6A0DAD] text-white'
                : 'bg-white/10 text-white/50 hover:bg-white/20'
            }`}
          >
            {TABS[lang][key]}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="border border-white/10 rounded-xl p-5 bg-[#1A0A35]">
        {content.title && (
          <p className="text-sm font-bold text-white/90 mb-3">{content.title}</p>
        )}
        <ul className="space-y-2">
          {content.items.map((item, i) => (
            <li key={i} className="text-sm text-white/70">{item}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
