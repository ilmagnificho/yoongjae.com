import { useState } from 'react';
import type { BtsLang } from './translations';
import { getT } from './translations';

interface Props {
  lang: BtsLang;
}

export default function ShareFloat({ lang }: Props) {
  const t = getT(lang);
  const [copied, setCopied] = useState(false);

  const pageUrl = 'https://yoongjae.com/bts' + (lang !== 'en' ? `?lang=${lang}` : '');

  const shareX = () => {
    const text = t('share.x') + ' ' + pageUrl + '\n#BTS #방탄소년단 #BTSGwanghwamun';
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
      '_blank'
    );
  };

  const copyLink = () => {
    navigator.clipboard.writeText(pageUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
      {/* X / Twitter */}
      <button
        onClick={shareX}
        className="w-12 h-12 bg-gray-900 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-700 transition-colors"
        title="Share on X"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      </button>

      {/* Copy link */}
      <button
        onClick={copyLink}
        className="w-12 h-12 bg-[#6A0DAD] text-white rounded-full flex items-center justify-center shadow-lg hover:bg-[#4A0080] transition-colors"
        title={t('share.copy')}
      >
        {copied ? (
          <span className="text-xs font-bold">💜</span>
        ) : (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
          </svg>
        )}
      </button>
    </div>
  );
}
