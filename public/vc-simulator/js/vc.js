/**
 * VC Route Scenarios - 4 Chapters
 */
const VCScenarios = [
  // ===== CHAPTER 1: 딜 소싱 — "IR덱의 바다" =====
  {
    chapter: 1,
    title: '딜 소싱 — "IR덱의 바다"',
    events: [
      {
        id: 'v_ch1_intro',
        chapter: 1,
        speaker: null,
        narration: '월요일 아침. 메일함에 IR덱 47개가 쌓여 있다. 그중 45개의 첫 슬라이드에 \'AI 기반\'이라고 적혀 있다.',
        text: null,
        choices: null,
        condition: null,
      },
      {
        id: 'v_ch1_ev1',
        chapter: 1,
        speaker: { name: 'GP 이대표', emoji: '👔' },
        narration: '눈빛: 없으면 넌 왜 있는 거지?',
        text: '이번 주 뭐 괜찮은 거 있어?',
        choices: [
          {
            text: '"3건 추려봤습니다. 하나 흥미롭습니다."',
            effects: { bossGaze: 10 },
            result: '정답. 많아도 안 되고 적어도 안 된다. GP의 표정이 살짝 누그러졌다.',
            flags: ['report_balanced'],
          },
          {
            text: '"아직 더 봐야 합니다."',
            effects: { bossGaze: -5, eye: 5 },
            result: 'GP: "음-"\n\n그 \'음-\'이 신경 쓰이지만, 신중함은 나중에 빛을 발할 수 있다.',
            resultSpeaker: { name: 'GP 이대표', emoji: '👔' },
            flags: ['report_slow'],
          },
          {
            text: '"하나 진짜 좋은 게 있는데, 경쟁이 심합니다."',
            effects: { bossGaze: 15, eye: 5 },
            result: '"빨리 잡아. 미팅 세팅해."\n\nGP의 눈에 불이 들어왔다. FOMO는 VC에게도 통한다.',
            resultSpeaker: { name: 'GP 이대표', emoji: '👔' },
            flags: ['report_urgent'],
          },
        ],
        condition: null,
      },
      {
        id: 'v_ch1_ev2',
        chapter: 1,
        speaker: { name: '시스템', emoji: '📋' },
        narration: '수신: "세계 최초 AI 기반 OO 플랫폼"',
        infoBox: '📋 IR 검토:\n• TAM: 100조 (어디서 많이 본 숫자)\n• MoM: 300% (베타 1개월 기준, N=12)\n• 팀: 2명 (대표 + "AI 엔지니어")\n• 수익: 0원 ("파이프라인이 탄탄합니다")',
        text: null,
        choices: [
          {
            text: '만나본다 (열린 마음)',
            effects: { eye: 5 },
            result: '미팅을 잡았다. 의외의 인사이트를 얻을 수도 있고, 순수하게 시간 낭비일 수도 있다. 이것이 심사역의 일상이다.',
            flags: ['met_ai_startup'],
          },
          {
            text: '정중히 거절',
            effects: {},
            result: '거절 메일 템플릿 #37을 꺼냈다. 올해만 200번째 사용이다.\n\n"현 시점에서 저희 투자 기준과 다소 차이가 있어..."',
            flags: ['rejected_ai_startup'],
          },
          {
            text: '읽씹',
            effects: { eye: -3 },
            result: '효율적이다. 하지만 3년 후 이 회사가 유니콘이 되면 이 순간을 떠올리게 될 것이다.\n\n...아닐 수도 있다. 아마 아닐 거다.',
            flags: ['ignored_ai_startup'],
          },
        ],
        condition: null,
      },
    ],
  },

  // ===== CHAPTER 2: 미팅 — "진짜를 찾아라" =====
  {
    chapter: 2,
    title: '미팅 — "진짜를 찾아라"',
    events: [
      {
        id: 'v_ch2_intro',
        chapter: 2,
        speaker: null,
        narration: '이번 주 미팅 5건. 5건 중 진짜 좋은 딜은 통계적으로 0.3건이다.',
        text: null,
        choices: null,
        condition: null,
      },
      {
        id: 'v_ch2_ev1',
        chapter: 2,
        speaker: { name: '카리스마 대표', emoji: '😎' },
        narration: '미팅 #1. 대표가 자신감 넘치게 피칭한다. 스토리텔링이 완벽하고, 비전이 거대하다. 근데 숫자를 물어보면 살짝 말을 돌린다.',
        text: '저희 서비스는 시장을 완전히 재정의할 겁니다. 지금 성장률이 300%인데요-',
        choices: [
          {
            text: '숫자를 끝까지 판다',
            effects: { eye: 10 },
            result: '진실 발견: MoM 300%는 MAU 3명에서 12명이었다.\n\n300% 성장. 수학적으로는 맞다. 3명에서 12명이니까.',
            flags: ['dug_numbers', 'found_truth'],
          },
          {
            text: '일단 넘기고 DD에서 확인',
            effects: { bossGaze: 5 },
            result: '메모: "DD에서 숫자 검증 필요"\n\n나중에 발견하면 늦을 수 있다. 하지만 일단 프로세스를 따른다.',
            flags: ['deferred_dd'],
          },
          {
            text: '직감을 믿고 패스',
            effects: { eye: 8, bossGaze: -3 },
            result: 'GP: "왜 안 만나? 다른 VC도 본다던데"\n\n직감이 맞을 확률은 경험치에 비례한다. 눈이 좋아졌다.',
            resultSpeaker: { name: 'GP 이대표', emoji: '👔' },
            flags: ['passed_charisma'],
          },
        ],
        condition: null,
      },
      {
        id: 'v_ch2_ev2',
        chapter: 2,
        speaker: { name: '조용한 대표', emoji: '🤓' },
        narration: '미팅 #3. 대표가 피칭을 못한다. 슬라이드도 별로다. 근데 프로덕트가 진짜 좋고, paying user가 500명이며, 입소문만으로 MoM 20% 성장 중.',
        text: '저... 그러니까... 저희 프로덕트를 직접 보시면... Pre 80억에...',
        choices: [
          {
            text: '밸류 깎자고 협상',
            effects: { eye: 5 },
            result: '대표: "다른 곳에서는-"\n\n블러핑일 수도, 진짜일 수도 있다. 포커와 투자의 공통점이다.',
            resultSpeaker: { name: '조용한 대표', emoji: '🤓' },
            flags: ['negotiate_quiet'],
          },
          {
            text: '그냥 80억에 투자',
            effects: { powder: -10, bossGaze: -5 },
            result: 'GP: "Pre 80억? 좀 높긴 한데..."\n\n좋은 프로덕트에 투자했다. 결과는 시간이 말해줄 것이다.',
            resultSpeaker: { name: 'GP 이대표', emoji: '👔' },
            flags: ['invested_80'],
          },
          {
            text: '좋은 딜이지만 패스',
            effects: { bossGaze: 5, eye: -3 },
            result: '합리적 판단이었다. 하지만 이 회사가 6개월 후 시리즈A를 300억 밸류에 클로즈한다면-\n\n...생각하지 말자.',
            flags: ['passed_quiet_genius'],
          },
        ],
        condition: null,
      },
      {
        id: 'v_ch2_ev3',
        chapter: 2,
        speaker: { name: '전 직장 동기 한모씨', emoji: '🤝' },
        narration: null,
        text: '야, 나 창업했어. 한번만 봐줘. 옛날 정 생각해서-',
        choices: [
          {
            text: '의리로 만남',
            effects: { eye: -3 },
            result: '딜이 별로인데 거절하기 곤란한 상황이 발생했다. 우정과 전문성 사이에서 갈등한다.',
            flags: ['met_friend'],
          },
          {
            text: '"자료 먼저 보내줘"',
            effects: { bossGaze: 5 },
            result: '친구: "야 너 변했다-"\n\nVC가 되면 친구가 줄어든다. 하지만 포트폴리오는 는다. (아마도)',
            resultSpeaker: { name: '한모씨', emoji: '🤝' },
            flags: ['friend_formal'],
          },
          {
            text: '다른 VC 소개시켜주기',
            effects: { eye: 5 },
            result: '우아한 회피. VC의 핵심 스킬 중 하나다.\n\n친구에게도 도움이 되고, 내 판단에도 영향이 없다. 윈윈.',
            flags: ['friend_redirect'],
          },
        ],
        condition: null,
      },
    ],
  },

  // ===== CHAPTER 3: 투자 결정 — "베팅의 순간" =====
  {
    chapter: 3,
    title: '투자 결정 — "베팅의 순간"',
    events: [
      {
        id: 'v_ch3_intro',
        chapter: 3,
        speaker: null,
        narration: '모든 검토가 끝났다. 이제 결정할 시간이다. 옳은 선택은 3년 후에나 알 수 있다.',
        text: null,
        choices: null,
        condition: null,
      },
      {
        id: 'v_ch3_ev1',
        chapter: 3,
        speaker: { name: '투심위', emoji: '🏛️' },
        narration: '파트너 5명 앞에서 발표. 당신의 추천 딜을 설명해야 한다.',
        infoBox: '파트너1: "밸류가 좀 높지 않아?"\n파트너2: "경쟁사는?"\n파트너3: (폰 보는 중)\n파트너4: "LP한테 뭐라고 설명할 거야?"',
        text: null,
        choices: [
          {
            text: '데이터로 방어',
            effects: {},
            result: null,
            flags: ['ic_data'],
            statCheck: { stat: 'eye', threshold: 50, successFlag: 'vc_passed_ic', failFlag: 'vc_failed_ic' },
          },
          {
            text: '"이 딜 놓치면 경쟁사 VC가 가져갑니다" (FOMO)',
            effects: {},
            result: null,
            flags: ['ic_fomo'],
            statCheck: { stat: 'bossGaze', threshold: 45, successFlag: 'vc_passed_ic', failFlag: 'vc_failed_ic' },
          },
          {
            text: '"제가 확신합니다" (소신)',
            effects: {},
            result: null,
            flags: ['ic_conviction'],
            statCheck: { type: 'combined', stats: ['eye', 'bossGaze'], threshold: 85, successFlag: 'vc_passed_ic', failFlag: 'vc_failed_ic' },
          },
        ],
        condition: null,
      },
      // 투심위 통과 시
      {
        id: 'v_ch3_ev2_pass',
        chapter: 3,
        speaker: { name: 'GP 이대표', emoji: '👔' },
        narration: '투심위를 통과했다! 텀시트를 발행할 차례다.',
        text: '좋아, 텀시트 보내. 조건은 어떻게 할 거야?',
        choices: [
          {
            text: '표준 조건 (무난)',
            effects: { bossGaze: 5 },
            result: '대표가 텀시트를 수용했다. 무난한 조건, 무난한 진행. 가끔은 무난함이 최선이다.',
            flags: ['termsheet_standard'],
          },
          {
            text: 'VC 유리하게 (강한 보호조항)',
            effects: { bossGaze: 10 },
            result: 'GP: "좋아, 이래야지"\n\n하지만 대표의 표정이 좋지 않다. 딜이 깨질 수도 있다.',
            resultSpeaker: { name: 'GP 이대표', emoji: '👔' },
            flags: ['termsheet_aggressive'],
            probabilityCheck: { successRate: 0.6, successFlag: 'deal_closed', failFlag: 'deal_rejected' },
          },
          {
            text: '창업자 친화적 (느슨한 조건)',
            effects: { bossGaze: -5 },
            result: 'GP: "좀 풀어준 감이 있지만..."\n\n대표가 감동했다. 장기적으로 좋은 관계가 될 것이다.',
            resultSpeaker: { name: 'GP 이대표', emoji: '👔' },
            flags: ['termsheet_friendly', 'deal_closed'],
          },
        ],
        condition: { flag: 'vc_passed_ic' },
      },
      // 투심위 보류/탈락 시
      {
        id: 'v_ch3_ev2_fail',
        chapter: 3,
        speaker: { name: 'GP 이대표', emoji: '👔' },
        narration: null,
        text: '이번 건은 좀 더 보자.',
        choices: [
          {
            text: '다음 딜로 넘어간다',
            effects: { eye: 5 },
            result: '회의실을 나오는 발걸음이 무겁다. 하지만 경험치는 쌓였다. 다음엔 더 잘할 수 있다.',
            flags: ['move_on'],
          },
          {
            text: '재추천을 위한 추가 데이터 수집',
            effects: { bossGaze: -3, eye: 5 },
            result: '집요하다. 이게 미덕인지 고집인지는 결과가 말해줄 것이다. 하지만 심미안은 성장했다.',
            flags: ['retry_ic'],
          },
        ],
        condition: { flag: 'vc_failed_ic' },
      },
    ],
  },

  // ===== CHAPTER 4: 투자 직후 — "진짜 게임 시작" =====
  {
    chapter: 4,
    title: '투자 직후 — "진짜 게임 시작"',
    events: [
      {
        id: 'v_ch4_intro',
        chapter: 4,
        speaker: null,
        narration: '투자금이 집행됐다. 이제부터가 진짜다. 당신의 선택이 옳았는지, 3개월이면 알 수 있다.',
        text: null,
        choices: null,
        condition: { or: [{ flag: 'deal_closed' }, { flag: 'termsheet_standard' }] },
      },
      // 투자 성사된 경우 - 좋은 시나리오 (디테일을 따져서 좋은 딜을 골랐을 때)
      {
        id: 'v_ch4_ev1_good',
        chapter: 4,
        speaker: { name: '포트폴리오 보고서', emoji: '📊' },
        narration: 'D+30일. 포트폴리오 보고서가 도착했다.',
        infoBox: '📈 월간 리포트:\n• MoM 25% 성장\n• 신규 고객 3건 계약\n• 채용 순조\n• 런웨이: 14개월',
        text: '좋은 징조다. 아직 안심하기엔 이르지만.',
        choices: null,
        condition: { and: [
          { or: [{ flag: 'deal_closed' }, { flag: 'termsheet_standard' }, { flag: 'termsheet_friendly' }] },
          { or: [{ flag: 'found_truth' }, { flag: 'negotiate_quiet' }, { flag: 'termsheet_friendly' }] },
        ]},
      },
      {
        id: 'v_ch4_ev2_good',
        chapter: 4,
        speaker: { name: '해외 VC', emoji: '🌏' },
        narration: 'D+90일. 해외 VC에서 연락이 왔다.',
        text: '이 회사 시리즈A 리드 관심 있습니다.',
        choices: [
          {
            text: '팔로온 주선 (적극 서포트)',
            effects: { bossGaze: 20, eye: 10 },
            result: 'GP: "잘 골랐네. 다음 펀드에서 파트너 이야기 해보자."\n\n심사역에서 파트너로. 당신의 선택이 옳았다.',
            flags: ['star_ending'],
          },
          {
            text: '지분 추가 매입 요청',
            effects: { powder: -5, eye: 15 },
            result: '공격적이지만 확신이 있다면 합리적인 선택이다. 이 회사의 성장을 가장 먼저 알아본 건 당신이니까.',
            flags: ['aggressive_ending'],
          },
        ],
        condition: { and: [
          { or: [{ flag: 'deal_closed' }, { flag: 'termsheet_standard' }, { flag: 'termsheet_friendly' }] },
          { or: [{ flag: 'found_truth' }, { flag: 'negotiate_quiet' }, { flag: 'termsheet_friendly' }] },
        ]},
      },
      // 투자 성사되었지만 나쁜 시나리오 (검증 없이 투자했을 때)
      {
        id: 'v_ch4_ev1_bad',
        chapter: 4,
        speaker: { name: '포트폴리오 보고서', emoji: '📉' },
        narration: 'D+30일. 포트폴리오 보고서가 도착했다.',
        infoBox: '📉 월간 리포트:\n• MoM -5%\n• 핵심 인력 1명 퇴사\n• 대표가 "피봇을 고려 중"\n• 런웨이: 4개월',
        text: '피봇. 스타트업 세계에서 가장 우아하게 포장된 "처음부터 다시".',
        choices: null,
        condition: { and: [
          { or: [{ flag: 'deal_closed' }, { flag: 'termsheet_standard' }, { flag: 'termsheet_aggressive' }] },
          { notFlag: 'found_truth' },
          { notFlag: 'negotiate_quiet' },
          { notFlag: 'termsheet_friendly' },
        ]},
      },
      {
        id: 'v_ch4_ev2_bad',
        chapter: 4,
        speaker: { name: '포트폴리오 대표', emoji: '😰' },
        narration: 'D+90일. 대표에게서 카톡이 왔다.',
        text: '심사역님, 좀 드릴 말씀이...\n\n런웨이 소진. 회사 청산 절차 시작.',
        choices: [
          {
            text: '솔직하게 보고 + 교훈 정리',
            effects: { bossGaze: -5, eye: 10 },
            result: 'GP에게 보고했다. "실패에서 배웠습니다."\n\nGP: "...그래, 다음엔 더 잘하자."\n\n신뢰는 지켰다. 그게 이 업계에서 가장 중요한 자산이다.',
            flags: ['honest_report'],
          },
          {
            text: '조용히 넘기려 함',
            effects: { bossGaze: -20 },
            result: 'GP가 LP 미팅에서 이 사실을 알게 됐다. 당신에게서가 아니라.\n\n"왜 보고 안 했어?"\n\n신뢰를 잃었다. 투자금보다 비싼 대가다.',
            flags: ['hide_failure'],
          },
        ],
        condition: { and: [
          { or: [{ flag: 'deal_closed' }, { flag: 'termsheet_standard' }] },
          { notFlag: 'found_truth' },
          { notFlag: 'negotiate_quiet' },
          { notFlag: 'termsheet_friendly' },
        ]},
      },
      // 투심위 탈락 + 딜 안 된 경우 (놓친 유니콘 or 동료의 VC)
      {
        id: 'v_ch4_no_deal_intro',
        chapter: 4,
        speaker: null,
        narration: '투심위에서 탈락한 후 3개월이 지났다. 당신이 보던 딜들의 근황이 하나둘 들려온다.',
        text: null,
        choices: null,
        condition: { flag: 'vc_failed_ic' },
      },
      {
        id: 'v_ch4_no_deal',
        chapter: 4,
        speaker: { name: '업계 소식', emoji: '📱' },
        narration: null,
        text: '당신이 검토했던 그 조용한 대표의 회사가 시리즈A를 300억 밸류에 클로즈했다는 소식이 들려온다.',
        choices: [
          {
            text: '교훈으로 삼고 다음 딜에 집중',
            effects: { eye: 10 },
            result: '아프지만 배움이 있다. 좋은 프로덕트를 알아보는 눈은 길러졌다. 다음 유니콘은 놓치지 않겠다.',
            flags: ['learned_lesson'],
          },
          {
            text: '당시 판단을 되돌아본다',
            effects: { eye: 5, bossGaze: 5 },
            result: '"왜 놓쳤을까?" 자문한다.\n\n밸류가 높아서? 확신이 부족해서? 아니면 투심위를 설득하지 못해서?\n\n답은 아마 셋 다일 것이다.',
            flags: ['reflected'],
          },
        ],
        condition: { flag: 'vc_failed_ic' },
      },
    ],
  },
];
