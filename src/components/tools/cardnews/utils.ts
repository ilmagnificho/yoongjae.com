import type { CardData, TextBlock, CardSettings } from './types';

let idCounter = 0;
export function genId(): string {
  return `cn_${Date.now()}_${++idCounter}`;
}

export function createDefaultTextBlock(overrides?: Partial<TextBlock>): TextBlock {
  return {
    id: genId(),
    content: '',
    fontSize: 48,
    fontWeight: 700,
    color: '#ffffff',
    isAccent: false,
    lineHeight: 1.3,
    letterSpacing: -0.5,
    textAlign: 'left',
    ...overrides,
  };
}

export function createDefaultCard(index: number): CardData {
  const isFirst = index === 0;
  return {
    id: genId(),
    bgImage: '',
    bgScale: 130,
    bgPositionX: 50,
    bgPositionY: 40,
    bgBrightness: 45,
    bgContrast: 120,
    overlayOpacity: 75,
    verticalAlign: 'bottom',
    textBlocks: isFirst
      ? [
          createDefaultTextBlock({ content: '큰 제목을\n여기에 입력', fontSize: 64, fontWeight: 800 }),
          createDefaultTextBlock({ content: '부제목이나 설명을 입력하세요.', fontSize: 28, fontWeight: 400, color: '#cccccc' }),
        ]
      : [
          createDefaultTextBlock({ content: '제목 입력', fontSize: 56, fontWeight: 800 }),
          createDefaultTextBlock({ content: '본문 내용을 입력하세요.\n줄바꿈도 가능합니다.', fontSize: 28, fontWeight: 400, color: '#cccccc', lineHeight: 1.7 }),
        ],
  };
}

export function createDefaultSettings(): CardSettings {
  return {
    seriesName: '시리즈 제목을\n입력하세요',
    date: new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\./g, '. ').replace(/\s$/, ''),
    brandName: 'brand.name',
    categoryTag: 'TAG',
    accentColor: '#F5C518',
    bgOverlayOpacity: 75,
  };
}

export async function searchImages(query: string): Promise<Array<{ id: string; url: string; thumbUrl: string; alt: string; photographer: string }>> {
  try {
    const res = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=12&orientation=squarish`,
      { headers: { Authorization: 'Client-ID Kv-JuvnDPBBPk2sScijJjqaIX1c4buH6EuBr3MoEXys' } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return (data.results || []).map((img: any) => ({
      id: img.id,
      url: img.urls?.regular || img.urls?.small,
      thumbUrl: img.urls?.thumb || img.urls?.small,
      alt: img.alt_description || query,
      photographer: img.user?.name || 'Unknown',
    }));
  } catch {
    return [];
  }
}

// Google Custom Search fallback (requires API key)
export async function searchGoogleImages(query: string, apiKey: string, cx: string): Promise<Array<{ id: string; url: string; thumbUrl: string; alt: string; photographer: string }>> {
  try {
    const res = await fetch(
      `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${encodeURIComponent(query)}&searchType=image&num=10`
    );
    if (!res.ok) return [];
    const data = await res.json();
    return (data.items || []).map((item: any, i: number) => ({
      id: `g_${i}`,
      url: item.link,
      thumbUrl: item.image?.thumbnailLink || item.link,
      alt: item.title || query,
      photographer: item.displayLink || 'Google',
    }));
  } catch {
    return [];
  }
}

export function downloadCanvas(canvas: HTMLCanvasElement, filename: string) {
  const link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL('image/png');
  link.click();
}
