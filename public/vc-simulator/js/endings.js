/**
 * Endings System v2 - Difficulty-specific endings
 */
const EndingsSystem = (() => {
  // ===== EASY (Seed Round) endings =====
  const FOUNDER_EASY_ENDINGS = [
    {
      id: 'easy_burnout', emoji: '💀', title: '번아웃',
      subtitle: '정신건강 경고',
      description: '창업자의 72%가 정신건강 문제를 겪습니다. 당신도 그중 하나가 되었습니다.',
      condition: (s) => s.stats.mental.value <= 0,
      priority: 100,
    },
    {
      id: 'easy_runway_end', emoji: '💸', title: '런웨이 종료',
      subtitle: '통장 잔고: 0원',
      description: '"이번 달 월급이-" "..." 대화가 여기서 끊겼습니다.',
      condition: (s) => s.stats.runway.value <= 0,
      priority: 99,
    },
    {
      id: 'easy_scam_victim', emoji: '🎣', title: '사기의 피해자',
      subtitle: '글로벌 캐피탈 파트너스',
      description: '투자사 사칭 사기에 걸렸다. 세상은 배고픈 창업자에게도 자비가 없다.',
      condition: (s) => s.flags.includes('got_scammed') && s.stats.mental.value <= 30,
      priority: 88,
    },
    {
      id: 'easy_disaster_magnet', emoji: '☄️', title: '재난의 중심',
      subtitle: '확률적으로 불가능한 불운',
      description: '서버도 터지고, 세금 폭탄에, 경쟁사까지. 모든 재난이 당신에게 집중됐다.',
      condition: (s) => s.disasterCount >= 3 && s.stats.mental.value <= 30,
      priority: 85,
    },
    {
      id: 'easy_bad_terms', emoji: '🥴', title: '독이 든 성배',
      subtitle: '축하합니다...?',
      description: '투자금은 들어왔다. 독소 조항도 같이 들어왔다. full ratchet에 동반매도청구권까지.',
      condition: (s) => s.flags.includes('signed_immediately'),
      priority: 80,
    },
    {
      id: 'easy_solo_warrior', emoji: '🗡️', title: '외로운 전사',
      subtitle: '1인 팀의 한계',
      description: 'CTO도 떠나고, 혼자 남았다. 개발, 기획, IR, 영업을 혼자 하다 쓰러졌다.',
      condition: (s) => (s.flags.includes('cto_left') || s.flags.includes('cto_left_final')) && s.stats.mental.value <= 25,
      priority: 78,
    },
    {
      id: 'easy_deal_broken', emoji: '😤', title: '욕심이 화를 불렀다',
      subtitle: '딜 파토',
      description: '밸류 협상에서 딜이 깨졌다. "밸류 협상하는 단계가 아니신 것 같은데요."',
      condition: (s) => s.flags.includes('deal_broken'),
      priority: 75,
    },
    {
      id: 'easy_smart_survivor', emoji: '🎉', title: '스마트 서바이버',
      subtitle: '상위 3.4%의 기적',
      description: '재난과 읽씹과 거절의 바다를 뚫고 Seed 투자를 받았습니다. 이제 Series A가 기다린다.',
      condition: (s) => s.flags.includes('lawyer_review') || s.flags.includes('valuation_up'),
      priority: 70,
    },
    {
      id: 'easy_pivot_master', emoji: '🔥', title: '피봇의 달인',
      subtitle: '넘어져도 다시 일어서는',
      description: '한번 쓰러졌지만 다시 일어섰다. "처음부터 다시"를 "피봇"이라고 부르는 건 스타트업의 발명이다.',
      condition: (s) => s.flags.includes('pivot') || s.flags.includes('keep_fighting'),
      priority: 60,
    },
    {
      id: 'easy_next_life', emoji: '🌙', title: '다음 생에서',
      subtitle: '폐업 신고 완료',
      description: '사업자 등록 말소. 법인 해산. 카페에서 이력서를 쓴다. "대표이사" 경력을 어떻게 표현할지 30분째 고민 중.',
      condition: (s) => s.flags.includes('give_up'),
      priority: 50,
    },
    {
      id: 'easy_default', emoji: '🛤️', title: '여정은 계속된다',
      subtitle: '아직 끝나지 않았다',
      description: '스타트업의 여정에 정해진 엔딩은 없다. 당신의 이야기는 아직 진행 중이다.',
      condition: () => true,
      priority: 0,
    },
  ];

  // ===== NORMAL (Series A) endings =====
  const FOUNDER_NORMAL_ENDINGS = [
    {
      id: 'normal_burnout', emoji: '🔥', title: '멘탈 붕괴',
      subtitle: 'Series A는 마라톤이 아니다',
      description: 'Series A는 Seed의 10배가 아니라 100배다. 준비되지 않은 멘탈이 먼저 쓰러졌다.',
      condition: (s) => s.stats.mental.value <= 0,
      priority: 100,
    },
    {
      id: 'normal_runway_end', emoji: '💸', title: '브릿지 실패',
      subtitle: '"다음 KPI 달성하면 브릿지 가능합니다"',
      description: '"다음 KPI 달성하면 브릿지 가능합니다"는 VC의 외교적 거절이었다.',
      condition: (s) => s.stats.runway.value <= 0,
      priority: 99,
    },
    {
      id: 'normal_bad_terms', emoji: '📜', title: '독소 계약의 포로',
      subtitle: '이사회가 당신보다 많아지는 날',
      description: '투자는 받았다. 이사회 2석도 줬다. 6개월 후 경영권 분쟁이 시작됐다.',
      condition: (s) => s.flags.includes('board_heavy') || (s.flags.includes('signed_bad_normal') && !s.flags.includes('lawyer_reviewed')),
      priority: 85,
    },
    {
      id: 'normal_series_a_win', emoji: '📈', title: 'Series A 클로저',
      subtitle: '30억 유치 완료',
      description: '30억 유치 완료. 이제 18개월 안에 Series B를 준비해야 한다. 숫자는 당신 편이었다.',
      condition: (s) => s.flags.includes('series_a_closed') && s.stats.persuasion.value >= 60,
      priority: 80,
    },
    {
      id: 'normal_series_a_close', emoji: '🚀', title: 'Series A 클로징',
      subtitle: '일단 투자는 받았다',
      description: '드디어 Series A 클로징. 이제 진짜 게임이 시작된다. PMF 증명, 팀 빌딩, 스케일업...\n\n"축하해요." 그 한마디 뒤에 할 일이 산더미다.',
      condition: (s) => s.flags.includes('series_a_closed'),
      priority: 75,
    },
    {
      id: 'normal_bootstrap', emoji: '🏋️', title: '부트스트랩의 달인',
      subtitle: '외부 자금 없이도 간다',
      description: '투자 없이도 흑자를 냈다. 이제 VC들이 먼저 연락해온다. 세상 참 아이러니하다.',
      condition: (s) => s.flags.includes('bootstrap_decision'),
      priority: 70,
    },
    {
      id: 'normal_default', emoji: '🛤️', title: '여정은 계속된다',
      subtitle: '다음 라운드를 향해',
      description: 'Series A의 문은 열리지 않았다. 하지만 문을 두드리다 보면 언젠가 열린다.',
      condition: () => true,
      priority: 0,
    },
  ];

  // ===== HARD (Series B / Global) endings =====
  const FOUNDER_HARD_ENDINGS = [
    {
      id: 'hard_burnout_global', emoji: '🌏😵', title: '글로벌 번아웃',
      subtitle: '시차, 영어, 문화 차이, 기존 투자자 관리',
      description: '시차, 영어, 문화 차이, 기존 투자자 관리. 사람이 먼저였어야 했다.',
      condition: (s) => s.stats.mental.value <= 0,
      priority: 100,
    },
    {
      id: 'hard_runway_end', emoji: '💸', title: '런웨이 종료 (Series B)',
      subtitle: '100억 앞에서 무너지다',
      description: '글로벌 DD에 3개월. Flip에 2개월. 그리고... 런웨이가 끝났다.',
      condition: (s) => s.stats.runway.value <= 0,
      priority: 99,
    },
    {
      id: 'hard_global_round', emoji: '🌍', title: '글로벌 라운드 클로징',
      subtitle: '한국을 넘어 세계로',
      description: '100억. 국내+해외 혼합 라운드. 이제 당신의 이름이 테크크런치에 실릴 것이다. 아마도.',
      condition: (s) => s.flags.includes('global_closed') && s.stats.persuasion.value >= 65,
      priority: 92,
    },
    {
      id: 'hard_global_close', emoji: '🌍', title: '글로벌 라운드 클로저',
      subtitle: '크로스보더 딜 완성',
      description: '해외 VC를 설득했다. 크로스보더 딜을 완성했다. 이제 진짜 글로벌 플레이어다.\n\n다음 챕터: Series C, 해외 법인, IPO 준비...',
      condition: (s) => s.flags.includes('global_closed'),
      priority: 90,
    },
    {
      id: 'hard_deal_collapse', emoji: '💥', title: '딜 파토',
      subtitle: '해외 VC가 조용히 연락을 끊었다',
      description: '해외 VC가 조용히 연락을 끊었다. 이메일 답장이 72시간째 없다. 이것이 외국의 거절 방식이다.',
      condition: (s) => s.flags.includes('deal_collapsed') ||
        (s.flags.includes('unprepared_structure') && s.flags.includes('bad_english_deck') && s.stats.persuasion.value <= 40),
      priority: 87,
    },
    {
      id: 'hard_poison_terms', emoji: '📜', title: 'Full Ratchet의 저주',
      subtitle: '영어 계약서는 영어를 아는 변호사가 봐야 한다',
      description: '투자금은 들어왔다. 3년 후 Down-round에서 Full Ratchet의 의미를 알게 됐다.',
      condition: (s) => s.flags.includes('no_legal_review') && s.flags.includes('global_closed'),
      priority: 93,
    },
    {
      id: 'hard_strategic_ally', emoji: '🤝', title: '전략적 파트너십',
      subtitle: 'VC 대신 전략적 투자자',
      description: '국내+해외 투자자를 모두 만족시켰다. 외교관 자격증도 딸 수 있을 것 같다.',
      condition: (s) => s.flags.includes('strategic_deal') ||
        (s.flags.includes('mediated_investors') && s.flags.includes('global_closed')),
      priority: 75,
    },
    {
      id: 'hard_default', emoji: '🛤️', title: '여정은 계속된다',
      subtitle: '글로벌 도전은 끝나지 않았다',
      description: 'Series B 글로벌 라운드는 아직이다. 하지만 싱가포르 미팅을 통해 쌓인 네트워크는 언젠가 빛날 것이다.',
      condition: () => true,
      priority: 0,
    },
  ];

  // ===== VC endings (변경 없음) =====
  const VC_ENDINGS = [
    {
      id: 'fired', emoji: '🪑', title: '해고',
      subtitle: 'LinkedIn: Open to work 🟢',
      description: 'LinkedIn 상태가 바뀌었다. "Open to work" 이직 준비 중입니다.',
      condition: (s) => s.stats.bossGaze.value <= 0,
      priority: 100,
    },
    {
      id: 'portfolio_dead', emoji: '💀', title: '포트폴리오 전사',
      subtitle: '10억 증발',
      description: '10억이 3개월 만에 증발. LP에게 뭐라고 말할지 아직 모르겠다.',
      condition: (s) => s.flags.includes('hide_failure'),
      priority: 90,
    },
    {
      id: 'star_analyst', emoji: '⭐', title: '스타 심사역',
      subtitle: '파트너 승진 제안',
      description: '해외 VC에서 팔로온 러브콜! GP가 파트너 승진을 제안합니다.',
      condition: (s) => s.flags.includes('star_ending'),
      priority: 80,
    },
    {
      id: 'missed_unicorn', emoji: '😭', title: '놓친 유니콘',
      subtitle: '그때 투자했으면...',
      description: '당신이 패스한 회사가 1000억 밸류를 달성했습니다. 오늘도 술이 당긴다.',
      condition: (s) => s.flags.includes('passed_quiet_genius') || (s.flags.includes('vc_failed_ic') && s.flags.includes('learned_lesson')),
      priority: 70,
    },
    {
      id: 'aggressive_investor', emoji: '🦈', title: '공격적 투자자',
      subtitle: '하이리스크 하이리턴',
      description: '대담한 베팅이었다. 그리고 이번엔 맞았다. 다음에도 맞을 수 있을까?',
      condition: (s) => s.flags.includes('aggressive_ending'),
      priority: 75,
    },
    {
      id: 'growing_analyst', emoji: '🌱', title: '성장하는 심사역',
      subtitle: '실패에서 배우는 중',
      description: '실패를 솔직하게 보고한 당신. 신뢰는 유지했다. 이것이 이 업계에서 가장 중요한 자산이다.',
      condition: (s) => s.flags.includes('honest_report'),
      priority: 65,
    },
    {
      id: 'balanced_vc', emoji: '🤝', title: '동료의 VC',
      subtitle: '괜찮은 사람',
      description: '업계에서 "괜찮은 VC"로 통한다. 화려하진 않지만 꾸준하다.',
      condition: (s) => s.flags.includes('reflected') || s.flags.includes('termsheet_friendly'),
      priority: 55,
    },
    {
      id: 'vc_default', emoji: '🛤️', title: '여정은 계속된다',
      subtitle: '다음 딜을 찾아서',
      description: 'VC의 일상은 계속된다. 내일도 IR덱 47개가 기다리고 있다.',
      condition: () => true,
      priority: 0,
    },
  ];

  const QUOTES = [
    'VC가 "좋은 사업이시네요"라고 하면 투자 안 한다는 뜻이다',
    '커피챗 3번이면 거절이다',
    'TAM은 꿈이고, SAM은 희망이고, SOM은 내 통장 잔고다',
    '읽씹은 거절보다 잔인하다',
    '프린세스 메이커는 프린세스를 키우지만, 여기선 번아웃을 키운다',
    'VC의 "내부 검토"는 "이따 점심 뭐 먹지" 다음 우선순위다',
    '300% 성장? 3명에서 12명 되는 것도 300%다',
    '스타트업 대표의 수면 시간은 런웨이에 비례한다',
    'LP에게 "빈티지가 안 좋아서"라고 말하는 건, 학생이 "시험이 어려워서"라고 말하는 것과 같다',
    'Pre-A에서 살아남으면 시리즈A가 기다린다. 축하할 일이 아니다.',
    '스타트업 대표의 "곧"은 VC의 "검토해볼게요"와 같은 시간 단위다',
    '투자 거절 메일에 "향후 좋은 기회"라고 쓰는 건 이별할 때 "좋은 사람 만나"와 같다',
    'Series A DD는 로맨스가 끝나고 현실이 시작되는 구간이다',
    'Unit Economics가 LTV:CAC 3배 미만이면 VC의 관심도 3배 낮아진다',
    '글로벌 VC는 시장 규모가 작으면 미팅도 안 잡는다. 한국 시장은 그들에게 작다.',
  ];

  function evaluate(state) {
    let endings;
    if (state.role === 'vc') {
      endings = VC_ENDINGS;
    } else if (state.difficulty === 'normal') {
      endings = FOUNDER_NORMAL_ENDINGS;
    } else if (state.difficulty === 'hard') {
      endings = FOUNDER_HARD_ENDINGS;
    } else {
      endings = FOUNDER_EASY_ENDINGS;
    }

    const sorted = [...endings].sort((a, b) => b.priority - a.priority);
    for (const ending of sorted) {
      if (ending.condition(state)) {
        return {
          ...ending,
          quote: QUOTES[Math.floor(Math.random() * QUOTES.length)],
          stats: { ...state.stats },
          role: state.role,
          difficulty: state.difficulty,
          flags: [...state.flags],
        };
      }
    }
    return { ...sorted[sorted.length - 1], stats: { ...state.stats }, role: state.role, difficulty: state.difficulty };
  }

  function getStatCheckResult(statCheck, stats) {
    if (statCheck.type === 'combined') {
      const total = statCheck.stats.reduce((sum, s) => sum + (stats[s] ? stats[s].value : 0), 0);
      return total >= statCheck.threshold;
    }
    return stats[statCheck.stat] && stats[statCheck.stat].value >= statCheck.threshold;
  }

  return { evaluate, getStatCheckResult, QUOTES };
})();
