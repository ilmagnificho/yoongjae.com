export const defaultLang = 'ko' as const;
export type Lang = 'ko' | 'en';

export const languages: Record<Lang, string> = {
  ko: '한국어',
  en: 'English',
};

export const ui = {
  ko: {
    // Nav
    'nav.writing': '글 Writing',
    'nav.lecture': '강의 Lecture',
    'nav.tools': '도구 Tools',
    'nav.companies': '함께하는 팀 Companies',
    'nav.about': '소개 About',

    // Home
    'home.tagline': 'Investor & Builder',
    'home.cta.writing': '글 읽기',
    'home.cta.about': '소개 보기',
    'home.recent': '최근 글',
    'home.viewAll': '전체 보기',
    'home.companies': '함께하는 팀',
    'home.tools': '무료 도구',
    'home.tools.promptforge': 'Claude & Gemini 프롬프트 생성기',
    'home.tools.captable': '투자 라운드별 지분 희석 시뮬레이션',
    'home.tools.safe': 'Valuation Cap · Discount 전환가격 비교',
    'home.tools.esop': 'Exit 시나리오별 스톡옵션 수익 계산',

    // Writing
    'writing.title': '글 Writing',
    'writing.description': '한국 창업자·투자자를 위한 에세이, 투자자 레터, 큐레이션 아카이브.',
    'writing.filter.all': '전체 All',
    'writing.filter.essays': '에세이 Essays',
    'writing.filter.yj-letter': 'YJ 레터',
    'writing.filter.curated': '큐레이션 Curated',
    'writing.filter.insights': '인사이트 Insights',

    // About
    'about.title': '소개 About',
    'about.description': '한국 창업자와 투자자를 위한 빌더·투자자 요약.',

    // Companies
    'companies.title': '함께하는 팀 Companies',
    'companies.description': '조약돌개인투자조합이 함께하는 초기 스타트업을 소개합니다.',
    'companies.subtitle': '조약돌개인투자조합이 초기부터 함께 만들어가고 있는 팀들입니다.',
    'companies.empty': '곧 함께하는 팀들을 소개합니다.',

    // Tools
    'tools.title': 'Tools',
    'tools.subtitle': '창업자와 개발자를 위한 무료 도구 모음',
    'tools.use': '사용하기',
    'tools.description.promptforge': 'Claude Projects & Gemini Gems용 시스템 프롬프트 생성기. 13개 전문 템플릿, 완전 무료.',
    'tools.description.captable': '투자 라운드별 지분 희석을 시뮬레이션하세요',
    'tools.description.safe': 'Valuation Cap과 Discount에 따른 전환 주식 수와 지분율 계산',
    'tools.description.esop': 'Exit 시나리오별 스톡옵션의 잠재 수익을 시뮬레이션하세요',

    // Footer
    'footer.newsletter.title': '뉴스레터',
    'footer.newsletter.description': '투자·빌딩 인사이트 — 한국 창업자와 투자자를 위한 실전 메모를 전합니다.',
    'footer.email.placeholder': '이메일 주소',
    'footer.name.placeholder': '이름',
    'footer.phone.placeholder': '연락처 (선택사항)',
    'footer.privacy': '개인정보 수집 및 이용에 동의합니다.',
    'footer.subscribe': '구독하기',
    'footer.bts': 'BTS 광화문 가이드 →',
    'footer.privacyLink': '개인정보 처리방침',

    // PostList
    'postList.empty': '아직 글이 없습니다.',
  },
  en: {
    // Nav
    'nav.writing': 'Writing',
    'nav.lecture': 'Lecture',
    'nav.tools': 'Tools',
    'nav.companies': 'Companies',
    'nav.about': 'About',

    // Home
    'home.tagline': 'Investor & Builder',
    'home.cta.writing': 'Read Writing',
    'home.cta.about': 'About Me',
    'home.recent': 'Recent Writing',
    'home.viewAll': 'View All',
    'home.companies': 'Portfolio Companies',
    'home.tools': 'Free Tools',
    'home.tools.promptforge': 'Claude & Gemini Prompt Generator',
    'home.tools.captable': 'Equity Dilution Simulator',
    'home.tools.safe': 'SAFE / Convertible Note Calculator',
    'home.tools.esop': 'Stock Option Value Calculator',

    // Writing
    'writing.title': 'Writing',
    'writing.description': 'Essays, investor letters, and curated insights for founders and investors.',
    'writing.filter.all': 'All',
    'writing.filter.essays': 'Essays',
    'writing.filter.yj-letter': 'YJ Letter',
    'writing.filter.curated': 'Curated',
    'writing.filter.insights': 'Insights',

    // About
    'about.title': 'About',
    'about.description': 'Builder and investor based in Seoul, Korea.',

    // Companies
    'companies.title': 'Companies',
    'companies.description': 'Early-stage startups backed by 조약돌개인투자조합.',
    'companies.subtitle': "Teams we've partnered with from day one.",
    'companies.empty': 'Portfolio companies coming soon.',

    // Tools
    'tools.title': 'Tools',
    'tools.subtitle': 'Free tools for founders and developers',
    'tools.use': 'Use Tool',
    'tools.description.promptforge': 'System prompt generator for Claude Projects & Gemini Gems. 13 expert templates, completely free.',
    'tools.description.captable': 'Simulate equity dilution across investment rounds',
    'tools.description.safe': 'Calculate conversion shares and ownership based on Valuation Cap and Discount',
    'tools.description.esop': 'Simulate stock option value across exit scenarios',

    // Footer
    'footer.newsletter.title': 'Newsletter',
    'footer.newsletter.description': 'Investment & building insights — practical notes for founders and investors.',
    'footer.email.placeholder': 'Email address',
    'footer.name.placeholder': 'Name',
    'footer.phone.placeholder': 'Phone (optional)',
    'footer.privacy': 'I agree to the collection and use of personal information.',
    'footer.subscribe': 'Subscribe',
    'footer.bts': 'BTS Gwanghwamun Guide →',
    'footer.privacyLink': 'Privacy Policy',

    // PostList
    'postList.empty': 'No posts yet.',
  },
} as const;

export type UIKey = keyof (typeof ui)['ko'];
