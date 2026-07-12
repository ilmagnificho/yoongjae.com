import type { APIRoute, GetStaticPaths } from 'astro';
import { generateOgImage } from '../../lib/og-image';

const pages = [
  {
    page: 'home',
    title: '한국 창업자와 함께 만들고, 투자합니다.',
    description: '테트라 대표 · 조약돌개인투자조합 GP',
  },
  {
    page: 'about',
    title: '소개 About',
    description: 'CEO at 테트라. GP at 조약돌개인투자조합.',
    label: 'About',
  },
  {
    page: 'writing',
    title: '글 Writing',
    description: '한국 생태계에 필요한 실전 관점을 기록합니다.',
    label: 'Blog',
  },
  {
    page: 'companies',
    title: '함께하는 팀 Companies',
    description: '조약돌개인투자조합이 함께하는 팀들입니다.',
    label: 'Companies',
  },
  {
    page: 'tools',
    title: '도구 Tools',
    description: '창업자와 투자자를 위한 실전 계산 도구.',
    label: 'Tools',
  },
  {
    page: 'cap-table',
    title: 'Cap Table 계산기',
    description: '투자 라운드별 지분율을 시뮬레이션하세요.',
    label: '도구 Tools',
  },
  {
    page: 'safe-simulator',
    title: 'SAFE 시뮬레이터',
    description: 'YC Post-Money SAFE 투자 조건을 시뮬레이션하세요.',
    label: '도구 Tools',
  },
  {
    page: 'esop-calculator',
    title: 'ESOP 계산기',
    description: '스톡옵션의 예상 가치를 계산해보세요.',
    label: '도구 Tools',
  },
  {
    page: 'linkedin-analytics',
    title: 'LinkedIn Analytics Dashboard',
    description: '콘텐츠 성과를 분석하고 성장 전략을 수립하세요.',
    label: '도구 Tools',
  },
  {
    page: 'time-mirror',
    title: '추억거울 테스트',
    description: '내 추억, 지금 스무 살에겐 몇 년도 느낌? 판정서로 확인하세요.',
    label: '도구 Tools',
  },
  {
    page: 'lecture',
    title: '투심위의 블랙박스',
    description: 'Sequoia 프레임으로 내 사업 설계하기 · 사전 대기 신청',
    label: 'Lecture',
  },
];

export const getStaticPaths: GetStaticPaths = () => {
  return pages.map(({ page, ...props }) => ({
    params: { page },
    props,
  }));
};

export const GET: APIRoute = async ({ props }) => {
  const png = await generateOgImage({
    title: props.title as string,
    description: props.description as string,
    label: (props.label as string) || undefined,
  });

  return new Response(png, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
