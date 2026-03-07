import { ui, defaultLang } from './ui';
import type { Lang, UIKey } from './ui';

export type { Lang };

export function getLangFromUrl(url: URL): Lang {
  const [, firstSegment] = url.pathname.split('/');
  if (firstSegment === 'en') return 'en';
  return 'ko';
}

export function useTranslations(lang: Lang) {
  return function t(key: UIKey): string {
    return ((ui[lang] as Record<string, string>)[key] ??
      (ui[defaultLang] as Record<string, string>)[key]) as string;
  };
}

// Pages that have a proper alternate-language equivalent
const KNOWN_PAGES = ['/', '/about', '/writing', '/companies', '/tools'];

export function getAlternateLangUrl(pathname: string, targetLang: Lang): string {
  if (targetLang === 'en') {
    const stripped = pathname.replace(/\/$/, '') || '/';
    if (KNOWN_PAGES.includes(stripped)) {
      return stripped === '/' ? '/en/' : `/en${stripped}/`;
    }
    // Blog/writing sub-pages → English writing list
    if (stripped.startsWith('/blog') || stripped.startsWith('/writing')) return '/en/writing/';
    // Tool sub-pages → English tools list
    if (stripped.startsWith('/tools')) return '/en/tools/';
    return '/en/';
  } else {
    // Korean: strip /en prefix, ensure trailing slash
    const withoutEn = pathname.replace(/^\/en/, '').replace(/\/$/, '') || '/';
    return withoutEn === '/' ? '/' : `${withoutEn}/`;
  }
}

export function getLangAlternates(
  url: URL,
  siteBase: string
): { ko: string; en: string } | null {
  const pathname = url.pathname;
  const stripped = pathname.replace(/^\/en/, '').replace(/\/$/, '') || '/';
  const isKnownPage = KNOWN_PAGES.includes(stripped);
  if (!isKnownPage) return null;

  const koPath = stripped === '/' ? '/' : `${stripped}/`;
  const enPath = stripped === '/' ? '/en/' : `/en${stripped}/`;
  return {
    ko: new URL(koPath, siteBase).toString(),
    en: new URL(enPath, siteBase).toString(),
  };
}
