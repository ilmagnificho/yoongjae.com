import type { BtsLang } from './translations';

interface Props {
  lang: BtsLang;
}

const TICKET_URL = 'https://tickets.interpark.com/goods/26002204';
const NETFLIX_URL = 'https://www.netflix.com/title/82157128';

export default function TicketCTA({ lang }: Props) {
  return (
    <section className="max-w-3xl mx-auto px-6 py-8">
      <div className="rounded-2xl overflow-hidden border border-white/10 bg-black">
        {/* Poster recreation */}
        <div className="relative px-6 py-10 md:py-14 text-center">
          {/* Gradient overlay for poster feel */}
          <div className="absolute inset-0 bg-gradient-to-b from-black via-black/90 to-black pointer-events-none" />

          <div className="relative z-[1] flex flex-col items-center gap-2">
            <p className="text-[10px] md:text-xs tracking-[0.5em] text-white/40 uppercase font-mono">
              BIGHIT MUSIC &middot; HYBE
            </p>

            <h2 className="text-4xl md:text-6xl font-black tracking-tight text-white mt-4">
              BTS
            </h2>
            <p className="text-xs md:text-sm tracking-[0.4em] text-white/60 uppercase font-mono">
              THE COMEBACK LIVE
            </p>
            <p className="text-3xl md:text-5xl font-bold tracking-wider text-[#F5C842] mt-1 font-serif italic">
              ARIRANG
            </p>

            <div className="flex items-center gap-2 mt-4">
              <span className="h-px w-8 bg-white/20" />
              <p className="text-[10px] md:text-xs tracking-[0.3em] text-white/50 uppercase">
                Live only on Netflix
              </p>
              <span className="h-px w-8 bg-white/20" />
            </div>

            <p className="text-sm md:text-base font-bold text-white/80 mt-3 tracking-wide">
              SATURDAY &middot; MARCH 21 &middot; 8PM KST
            </p>
            <p className="text-xs text-white/40">
              Gwanghwamun Square, Seoul
            </p>
          </div>
        </div>

        {/* Ticket + Netflix CTA */}
        <div className="px-6 pb-6 space-y-3">
          {/* Urgent ticket notice */}
          <div className="bg-red-500/15 border border-red-500/30 rounded-xl p-3 text-center">
            <p className="text-xs font-bold text-red-400 mb-0.5">
              {lang === 'ko'
                ? '🚨 현장 관람 예매 오픈'
                : lang === 'ja'
                ? '🚨 現地観覧チケット予約オープン'
                : '🚨 In-Person Tickets Now Open'}
            </p>
            <p className="text-[11px] text-red-300/70">
              {lang === 'ko'
                ? '2/23 (일) 오후 8시 KST — 인터파크 티켓'
                : lang === 'ja'
                ? '2/23 (日) 午後8時 KST — Interpark Ticket'
                : 'Feb 23 (Sun) 8PM KST — Interpark Ticket'}
            </p>
          </div>

          {/* Interpark button */}
          <a
            href={TICKET_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full text-center bg-[#6A0DAD] hover:bg-[#4A0080] text-white font-bold text-sm py-3.5 rounded-xl transition-colors"
          >
            {lang === 'ko'
              ? '🎟️ 인터파크에서 예매하기 →'
              : lang === 'ja'
              ? '🎟️ Interparkでチケット予約 →'
              : '🎟️ Book Tickets on Interpark →'}
          </a>

          {/* Netflix button */}
          <a
            href={NETFLIX_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full text-center bg-[#E50914] hover:bg-[#B81D24] text-white font-bold text-sm py-3.5 rounded-xl transition-colors"
          >
            {lang === 'ko'
              ? '📺 Netflix 라이브 스트리밍으로 보기 →'
              : lang === 'ja'
              ? '📺 Netflixライブストリーミングで視聴 →'
              : '📺 Watch Live on Netflix →'}
          </a>

          <p className="text-[10px] text-white/30 text-center">
            {lang === 'ko'
              ? '현장 2,000석 추첨제 · 전 세계 Netflix 동시 생중계'
              : lang === 'ja'
              ? '現地2,000席抽選制 · 全世界Netflixで同時生中継'
              : '2,000 on-site spots (lottery) · Streaming worldwide on Netflix'}
          </p>
        </div>
      </div>
    </section>
  );
}
