/**
 * Founder Normal Route (Series A) — 창업자 루트 NORMAL
 * "이제 숫자로 말해야 한다" — PMF를 증명하고 스케일업을 논해야 하는 단계
 * 초반 선택이 후반에 돌아온다. EASY 클리어 후 오픈.
 *
 * 핵심 분기: weak_retention → CH3 추궁 이벤트 트리거
 *           statCheck → passed_ic_normal / failed_ic_normal
 */
const FounderNormalScenarios = [
  // ===== CHAPTER 1: "숫자를 보여줘" — Series A IR 준비 =====
  {
    chapter: 1,
    title: '"숫자를 보여줘" — Series A IR 준비',
    events: [
      {
        id: 'fn_ch1_intro',
        chapter: 1,
        speaker: null,
        narration: 'Seed를 받았다. 18개월이 지났다.\n\n이제 VC들은 당신에게 \'감동\'이 아닌 \'증거\'를 원한다.',
        text: null,
        choices: null,
        condition: null,
      },
      {
        id: 'n_ch1_ev1',
        chapter: 1,
        speaker: { name: 'CFO 출신 어드바이저', emoji: '📊' },
        narration: '투자자들이 이제 팀 얘기에는 눈 하나 깜짝 안 한다.',
        text: 'PMF 달성했다고 주장하려면 숫자가 필요합니다. Retention 60%? NPS 40 이상? 뭐가 있어요?',
        choices: [
          {
            text: '"Retention 58%입니다. 반올림하면-"',
            effects: { persuasion: -7, mental: -5 },
            result: '반올림. 스타트업의 영원한 친구. VC는 친구가 아니다.',
            flags: ['weak_retention'],
          },
          {
            text: '"MoM 15% + Cohort 차트 준비했습니다"',
            effects: { persuasion: 20, runway: -0.5 },
            result: '코호트 차트를 꺼냈다. 심사역의 눈이 0.3초 커졌다. 이 0.3초가 중요하다.',
            flags: ['strong_data'],
          },
          {
            text: '"저희는 B2B라 Retention보다 NRR이 중요합니다"',
            effects: { persuasion: 10, mental: 5 },
            result: '지표를 재정의했다. 자신감인지 회피인지는 VC가 판단할 것이다.',
            flags: ['reframe_metric'],
          },
        ],
        condition: null,
      },
      {
        id: 'n_ch1_ev2',
        chapter: 1,
        speaker: { name: '공동창업자', emoji: '🤝' },
        narration: 'Series A 밸류에이션. 너무 높으면 아무도 안 들어온다. 너무 낮으면 나중에 후회한다.',
        text: '대표, 우리 Pre 얼마로 부를까요? ARR이 아직 3억이라 조심스럽긴 한데-',
        choices: [
          {
            text: 'Pre 60억 (ARR 20x)',
            effects: { persuasion: -5, mental: 10 },
            result: 'ARR 20배수. SaaS라면 설명 가능. 아니라면 긴 하루가 될 것이다.',
            flags: ['aggressive_valuation'],
          },
          {
            text: 'Pre 40억 (ARR 13x)',
            effects: { persuasion: 10 },
            result: '보수적이지만 협상 여지가 있다. VC들은 이것을 \'합리적\'이라고 부른다.',
            flags: ['conservative_valuation'],
          },
          {
            text: '"비교군 분석해서 정하자" (리서치 1주일)',
            effects: { persuasion: 15, runway: -0.5, mental: -5 },
            result: '1주일을 썼다. 결론: 비교군마다 다 달랐다. 그래도 논리는 생겼다.',
            flags: ['research_valuation'],
          },
        ],
        condition: null,
      },
    ],
  },

  // ===== CHAPTER 2: "왜 지금이냐" — 경쟁사와 타이밍 압박 =====
  {
    chapter: 2,
    title: '"왜 지금이냐" — 경쟁사와 타이밍 압박',
    events: [
      {
        id: 'fn_ch2_intro',
        chapter: 2,
        speaker: null,
        narration: 'Series A 미팅을 잡았다. VC 3곳. 모두 \'시장이 좋다\'고 한다.\n\n이 말이 얼마나 위험한지는 아직 모른다.',
        text: null,
        choices: null,
        condition: null,
      },
      {
        id: 'n_ch2_ev1',
        chapter: 2,
        speaker: { name: '시스템', emoji: '📢' },
        narration: '미팅 전날, 경쟁사가 100억 Series A 클로즈 뉴스를 냈다.',
        text: '경쟁사 OO이 A캐피탈로부터 100억 Series A를 유치했습니다.',
        choices: [
          {
            text: '"오히려 시장 검증입니다" - IR덱에 추가',
            effects: { persuasion: 10 },
            result: '경쟁사의 성공을 내 근거로 전환했다. 낯 두꺼운 자가 살아남는다.',
            flags: ['use_competitor_news'],
          },
          {
            text: '"저희 차별점을 더 강화하자" - 새벽에 덱 수정',
            effects: { persuasion: 15, mental: -15 },
            result: '새벽 3시. 슬라이드 37번. 이 열정이 언젠가 인정받을 것이다. 아마도.',
            flags: ['deck_revision_night'],
          },
          {
            text: '그냥 예정대로 진행',
            effects: { mental: 5 },
            result: '평정심. 혹은 둔감함. 구분하기 어렵다.',
            flags: [],
          },
        ],
        condition: null,
      },
      {
        id: 'n_ch2_ev2',
        chapter: 2,
        speaker: { name: 'A캐피탈 파트너', emoji: '💼' },
        narration: '유리벽 회의실. 파트너 맞은편에 앉았다. 이제 20분이 주어진다.',
        text: 'Seed 때 목표가 \'PMF 검증\'이었는데, 지금 보여주실 수 있는 게 구체적으로 뭐가 있죠?',
        choices: [
          {
            text: '코호트 차트 + MoM 데이터 실시간 시연',
            effects: { persuasion: 20 },
            result: '숫자가 말을 했다. 파트너가 처음으로 노트를 펼쳤다.',
            flags: ['impressed_partner'],
          },
          {
            text: '고객 인터뷰 녹취 3개 재생',
            effects: { persuasion: 10, mental: 5 },
            result: '고객의 목소리. 숫자보다 설득력 있을 때도 있다. 오늘이 그런 날이길.',
            flags: ['customer_evidence'],
          },
          {
            text: '"아직 완벽하진 않지만, 방향은 잡혔습니다"',
            effects: { persuasion: -10, mental: -10 },
            result: '\'방향을 잡았다\'는 Seed에서 하는 말이다. 지금은 Series A다.',
            flags: ['weak_answer'],
          },
        ],
        condition: null,
      },
    ],
  },

  // ===== CHAPTER 3: "유닛이코노믹스" — 숫자의 지뢰밭 =====
  {
    chapter: 3,
    title: '"유닛이코노믹스" — 숫자의 지뢰밭',
    events: [
      {
        id: 'fn_ch3_intro',
        chapter: 3,
        speaker: null,
        narration: '2차 미팅. 이제 그들은 당신의 비전에 관심이 없다.\n\nCAC, LTV, Payback Period. 이것이 그들의 언어다.',
        text: null,
        choices: null,
        condition: null,
      },
      {
        id: 'n_ch3_ev1',
        chapter: 3,
        speaker: { name: 'B벤처스 심사역', emoji: '🔍' },
        narration: '심사역이 노트북에서 눈을 들었다. 나쁜 징조다.',
        text: 'CAC가 30만원이고 LTV가 60만원이면 2배인데, SaaS 기준으로는 좀 낮지 않나요? 보통 3배 이상을 보거든요.',
        choices: [
          {
            text: '"저희 Payback Period가 6개월이라 효율적입니다"',
            effects: { persuasion: 15 },
            result: '지표를 전환했다. 2배보다 6개월이 더 좋게 들린다. 같은 데이터, 다른 프레임.',
            flags: ['smart_reframe'],
          },
          {
            text: '"맞습니다, 개선 중입니다. 6개월 내 3배 목표-"',
            effects: { persuasion: 5, mental: -5 },
            result: '솔직함 + 계획. 나쁘지 않다. \'목표\'와 \'달성\'은 다르지만.',
            flags: ['honest_weakness'],
          },
          {
            text: '"저희는 NRR이 핵심입니다" (화제 전환)',
            effects: { persuasion: -15 },
            result: '심사역이 적었다: \'질문 회피\'. 나레이터도 같은 생각이다.',
            flags: ['avoided_question'],
          },
        ],
        condition: null,
      },
      {
        id: 'n_ch3_ev2',
        chapter: 3,
        speaker: { name: 'B벤처스 심사역', emoji: '🔍' },
        narration: '심사역이 슬라이드 8번에서 멈췄다.',
        text: 'Retention 60%라고 하셨는데, 이게 D30 기준인가요 M3 기준인가요? 분모가 전체 가입자인지 활성 유저인지-',
        choices: [
          {
            text: '정확한 기준 설명 + 보완 데이터 공유',
            effects: { persuasion: 10 },
            result: '준비가 되어 있었다. 기적이다.',
            flags: [],
          },
          {
            text: '"자료 정리해서 오늘 오후에 보내드리겠습니다"',
            effects: { persuasion: -20, mental: -10 },
            result: '미팅이 20분 만에 사실상 끝났다. 엘리베이터가 느리게 느껴졌다.',
            flags: ['data_unprepared'],
          },
        ],
        condition: { flag: 'weak_retention' },
      },
    ],
  },

  // ===== CHAPTER 4: "투심위 or 파토" — 최종 결전 =====
  {
    chapter: 4,
    title: '"투심위 or 파토" — 최종 결전',
    events: [
      {
        id: 'fn_ch4_intro',
        chapter: 4,
        speaker: null,
        narration: null,
        text: null,
        dynamicNarration: (stats) => {
          const runway = stats.runway.value;
          const mental = stats.mental.value;
          let extra = '';
          if (runway <= 1) extra = '\n\n⚠️ 위험: 런웨이가 거의 끝났다. 이번이 진짜 마지막이다.';
          else if (mental <= 30) extra = '\n\n경고: 멘탈이 한계에 가까워졌다. 조금만 더.';
          return `B벤처스에서 투심위에 올리겠다는 연락이 왔다. 런웨이 ${runway}개월.\n\n이번이 진짜다.${extra}`;
        },
        choices: null,
        condition: null,
      },
      {
        id: 'n_ch4_ev1',
        chapter: 4,
        speaker: { name: 'B벤처스 파트너 일동', emoji: '🏛️' },
        narration: '파트너 4명. 그 중 1명은 아이패드를 보고 있다.',
        text: '마지막 질문입니다. 이 라운드로 18개월을 버텨서 Series B 준비가 가능하다고 보세요?',
        choices: [
          {
            text: '"18개월 내 ARR 2배 + Series B 준비 로드맵 공유"',
            effects: { persuasion: 20 },
            result: null,
            flags: ['strong_close'],
            statCheck: { stat: 'persuasion', threshold: 55, successFlag: 'passed_ic_normal', failFlag: 'failed_ic_normal' },
          },
          {
            text: '"팀이 있으면 가능합니다. 저희 팀을 믿어주세요"',
            effects: { persuasion: -15, mental: 5 },
            result: null,
            flags: ['emotional_close'],
            statCheck: { stat: 'mental', threshold: 50, successFlag: 'passed_ic_normal', failFlag: 'failed_ic_normal' },
          },
          {
            text: '"솔직히 18개월로 타이트합니다. 하지만 이 팀이라면-"',
            effects: { persuasion: 5, mental: 10 },
            result: null,
            flags: ['honest_close'],
            statCheck: { type: 'combined', stats: ['persuasion', 'mental'], threshold: 100, successFlag: 'passed_ic_normal', failFlag: 'failed_ic_normal' },
          },
        ],
        condition: null,
      },
      {
        id: 'n_ch4_ev2',
        chapter: 4,
        speaker: { name: '시스템', emoji: '📋' },
        narration: '텀시트가 도착했다. 투자금 30억 / Pre 120억 / 우선주 / 이사회 의석 2석 요구.',
        text: '이사회 의석 2석. 파트너 2명이 들어온다는 뜻이다.',
        choices: [
          {
            text: '그대로 수락 (빠른 클로징 우선)',
            effects: { runway: 3, persuasion: -5 },
            result: '빠르다. 하지만 이사회가 당신보다 많아지는 날이 올 수 있다.',
            flags: ['board_heavy', 'series_a_closed'],
          },
          {
            text: '"이사회 1석으로 줄여달라" 협상',
            effects: { runway: -0.5 },
            result: '50% 확률로 수용된다. 나머지 50%는 \'우리 투자 철학이라서요\'다.\n\n결국 절충안이 나왔다. 완벽하지 않지만 더 나은 구조다.',
            flags: ['board_negotiated', 'series_a_closed'],
          },
          {
            text: '변호사 검토 후 전체 조건 재협상',
            effects: { runway: -1, persuasion: 10 },
            result: '2주가 걸렸다. 조건은 나아졌다. 런웨이는 줄었다. 트레이드오프다.',
            flags: ['lawyer_reviewed', 'series_a_closed'],
          },
        ],
        condition: { flag: 'passed_ic_normal' },
      },
      {
        id: 'n_ch4_ev2_fail',
        chapter: 4,
        speaker: { name: 'B벤처스 파트너', emoji: '🧑‍💼' },
        narration: '투심위 결과. 오후 3시, 전화가 왔다.',
        text: '"대표님... 저희가 내부적으로 많이 논의했는데요. 지금 시점에서는 투자 결정을 내리기가 어렵다는 결론을 내렸어요. 시장이 좀 더 성숙되면 그때 다시 보고 싶어요."\n\n"시장이 성숙되면"의 번역: 다른 VC가 먼저 투자하면.',
        choices: [
          {
            text: '이유를 물어보고 다음을 준비한다',
            effects: { mental: -8, persuasion: 8 },
            result: '"구체적으로 어떤 부분이 부족했나요?" "솔직히 말씀드리면..."\n\n30분 동안 피드백을 들었다. 아팠지만 유용했다.',
            flags: ['collected_feedback'],
          },
          {
            text: '다른 VC에 즉시 접근한다',
            effects: { runway: -0.5, mental: -10 },
            result: '다음 주부터 C캐피탈, D캐피탈에 연락을 돌렸다.\n\n이 과정이 다시 시작된다. 하지만 이번엔 더 준비됐다.',
            flags: ['series_a_retry'],
          },
          {
            text: '부트스트랩으로 전환한다',
            effects: { mental: 8 },
            result: '"외부 자금 없이도 할 수 있을지 모른다."\n\n손익분기점을 당기는 데 집중했다. 더디지만 주도권을 지키는 선택.',
            flags: ['bootstrap_decision'],
          },
        ],
        condition: { flag: 'failed_ic_normal' },
      },
    ],
  },
];
