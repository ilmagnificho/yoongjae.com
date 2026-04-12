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

// --- AI Card Generation ---

const TONES: Record<string, string> = {
  professional: '전문적/분석적 톤으로 작성. 데이터와 수치를 강조하고, 객관적이고 신뢰감 있는 문체를 사용하세요.',
  casual: '캐주얼/친근한 톤으로 작성. 대화하듯 편안한 문체, 공감 표현, 쉬운 비유를 사용하세요.',
  storytelling: '스토리텔링/내러티브 톤으로 작성. 도입→전개→결론 흐름, 감성적 표현, 인용문 활용.',
  minimal: '미니멀/간결한 톤으로 작성. 핵심만 짧게, 불필요한 수식어 제거.',
};

export const TONE_OPTIONS = [
  { value: 'professional', label: '전문적' },
  { value: 'casual', label: '캐주얼' },
  { value: 'storytelling', label: '스토리텔링' },
  { value: 'minimal', label: '미니멀' },
];

const SYSTEM_PROMPT = `당신은 한국 SNS 카드뉴스 전문 에디터입니다. 입력된 텍스트를 분석하여 카드뉴스용 구조화 데이터를 생성합니다.

## 출력 규칙
1. 총 카드 수는 사용자가 지정
2. 모든 텍스트는 한국어, 간결체
3. 반드시 JSON 형식으로만 출력 (다른 텍스트 없이 JSON만)
4. 각 카드는 title과 body를 가짐
5. 첫 카드는 커버 (큰 제목 + 부제목)
6. 마지막 카드는 요약/CTA

## 출력 형식
{
  "series_title": "시리즈 제목",
  "cards": [
    { "title": "카드 제목 (줄바꿈은 \\n 사용)", "body": "본문 내용 (줄바꿈은 \\n 사용)", "is_cover": true/false }
  ]
}

중요: title에서 핵심 키워드는 줄바꿈으로 시각적 임팩트를 주세요. 예: "레이달리오\\n3차 세계대전\\n이미 시작"`;

function cleanJsonResponse(text: string): string {
  let cleaned = text.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*\n?/, '').replace(/\n?```\s*$/, '');
  }
  return cleaned;
}

export async function generateCardsFromText(
  text: string,
  apiKey: string,
  cardCount: number,
  tone: string,
): Promise<{ seriesTitle: string; cards: Array<{ title: string; body: string; isCover: boolean }> }> {
  const toneDesc = TONES[tone] || TONES.professional;
  const userPrompt = `다음 텍스트를 카드뉴스로 변환해주세요. JSON 형식으로만 응답해주세요.

## 추가 지시사항
- 총 ${cardCount}장으로 구성
- 톤: ${toneDesc}

---

${text}`;

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: Math.min(8000, 2000 + cardCount * 500),
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userPrompt }],
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`API Error (${res.status}): ${errText.slice(0, 200)}`);
  }

  const responseText = (await res.json()).content?.[0]?.text;
  if (!responseText) throw new Error('Empty response from API');

  const parsed = JSON.parse(cleanJsonResponse(responseText));
  return {
    seriesTitle: parsed.series_title || '카드뉴스',
    cards: (parsed.cards || []).map((c: any) => ({
      title: c.title || '',
      body: c.body || '',
      isCover: !!c.is_cover,
    })),
  };
}

export function aiResultToCardData(
  aiCards: Array<{ title: string; body: string; isCover: boolean }>,
): CardData[] {
  return aiCards.map((ac, i) => ({
    id: genId(),
    bgImage: '',
    bgScale: 130,
    bgPositionX: 50,
    bgPositionY: 40,
    bgBrightness: 45,
    bgContrast: 120,
    overlayOpacity: 75,
    verticalAlign: 'bottom' as const,
    textBlocks: [
      createDefaultTextBlock({
        content: ac.title,
        fontSize: ac.isCover ? 64 : 56,
        fontWeight: 800,
      }),
      ...(ac.body
        ? [createDefaultTextBlock({
            content: ac.body,
            fontSize: 28,
            fontWeight: 400,
            color: '#cccccc',
            lineHeight: 1.7,
          })]
        : []),
    ],
  }));
}
