/**
 * Founder Hard Route (Series B / Global) — 창업자 루트 HARD
 * "이제 글로벌이다" — 해외 VC, 크로스보더 딜, 영어 IR
 * 모든 대사와 나레이터는 한국어. 영어 비즈니스 용어는 자연스럽게 혼용.
 * 연쇄 손실 구조: 나쁜 선택 2-3개 누적 시 후반 선택지 제한.
 * NORMAL 클리어 후 오픈.
 *
 * 핵심 분기: inflated_arr → CH3 추궁 이벤트 트리거
 *           english_coaching_done → CH2 미팅 보너스 (condition_bonus, 엔진 미지원이므로 narration으로 표현)
 *           statCheck → passed_ic_hard / failed_ic_hard
 */
const FounderHardScenarios = [
  // ===== CHAPTER 1: "ARR과 진실" — Series B IR 준비 =====
  {
    chapter: 1,
    title: '"ARR과 진실" — Series B IR 준비',
    events: [
      {
        id: 'fh_ch1_intro',
        chapter: 1,
        speaker: null,
        narration: 'Series A를 마쳤다. 이제 VC들이 말한다. \'글로벌 확장 계획은요?\'\n\n그 말이 이렇게 무거울 줄은 몰랐다.\n\n해외 VC 미팅이 잡혔다. 싱가포르. Sequoia 계열 펀드.\n\n그런데 영어 피칭 준비가 됐나?',
        text: null,
        choices: null,
        condition: null,
      },
      {
        id: 'h_ch0_ev1',
        chapter: 1,
        speaker: { name: '나레이터', emoji: '🎙️' },
        narration: '영어 피칭. 한국에서 창업하면 언젠가 마주치는 벽이다.',
        text: '해외 VC 미팅까지 3주 남았다. 영어 IR 피칭을 어떻게 준비할 것인가?',
        choices: [
          {
            text: '전문 영어 IR 코칭 받기 (런웨이 -0.5개월, 2주 투자)',
            effects: { persuasion: 20, runway: -0.5, mental: -10 },
            result: '강사가 말했다. \'좋아요. 원어민 같진 않지만, 논리는 통해요.\'\n\n이게 목표였다. 비용과 시간을 썼다. 하지만 덱과 피칭이 달라졌다.',
            flags: ['english_coaching_done'],
          },
          {
            text: '유튜브 + Y Combinator Demo Day 영상 독학 (1주일)',
            effects: { persuasion: 8, mental: -5 },
            result: 'YC Demo Day 영상을 17개 봤다. 그들과 나의 차이가 영어만은 아닌 것 같다는 느낌이 들었다.\n\n그래도 몇 가지 표현은 건졌다.',
            flags: ['youtube_prep'],
          },
          {
            text: '영어 덱은 구글 번역 + 손보기로 빠르게',
            effects: { persuasion: -10, mental: 5 },
            result: '효율적이다. 해외 파트너가 슬라이드 4번에서 눈썹을 올렸다.\n\n그냥 넘어갔다. 넘어간 것이 더 무서웠다.',
            flags: ['bad_english_deck'],
          },
          {
            text: '한국어 덱 그대로 + 통역 대동',
            effects: { persuasion: -5, mental: 10 },
            result: '자신감인지 준비 부족인지. 해외 VC는 후자라고 생각한다.\n\n통역이 끝나고 1초의 침묵이 있었다. 그 1초가 길었다.',
            flags: ['interpreter_only'],
          },
        ],
        condition: null,
      },
      {
        id: 'h_ch1_ev1',
        chapter: 1,
        speaker: { name: 'CFO', emoji: '📊' },
        narration: '해외 VC들은 ARR 기준이 다르다. \'연간 반복 매출\'의 정의가 나라마다 미묘하게 다르다.',
        text: 'ARR 계산에 One-time 매출 포함시키면 숫자가 20% 더 커 보이는데- 관행적으로 많이 하거든요. Series B면 ARR이 좀 더 크게 보여야 VC들이 관심을 갖지 않을까요?',
        choices: [
          {
            text: '"안 됩니다. 순수 Recurring만 잡겠습니다"',
            effects: { persuasion: 10, mental: 5 },
            result: '해외 VC는 이것을 안다. 그리고 이것을 아는 창업자를 더 신뢰한다.\n\nDD에서 들킬 리스크도 없다.',
            flags: ['clean_arr'],
          },
          {
            text: 'One-time 포함해서 계산',
            effects: { persuasion: 10, mental: -5 },
            result: '숫자가 커졌다. DD에서 발각되면 신뢰가 0이 된다.\n\n20% 업사이드 vs 100% 리스크.',
            flags: ['inflated_arr'],
          },
          {
            text: '"두 가지 버전 모두 준비하겠습니다 - Recurring ARR과 Total ARR"',
            effects: { persuasion: 15, runway: -0.5 },
            result: '투명성의 미덕. 선택지를 주는 것이 신뢰를 줄 때가 있다.',
            flags: ['dual_arr'],
          },
        ],
        condition: null,
      },
      {
        id: 'h_ch1_ev2',
        chapter: 1,
        speaker: { name: '어드바이저 (전 VC 파트너)', emoji: '🧑‍💼' },
        narration: '해외 VC들은 국내 TAM에는 관심이 없다. 그들의 기준은 Global TAM이다.',
        text: '글로벌 TAM을 어떻게 정의할 건가요? 한국 시장만 보면 Series B 스케일이 안 나옵니다. 동남아, 일본, 미국까지 넣어야 해요.',
        choices: [
          {
            text: '"동남아 + 일본 시장 분석 추가 (2주 작업)"',
            effects: { persuasion: 18, runway: -0.5, mental: -10 },
            result: '2주를 썼다. 동남아 시장 리포트가 붙었다. 숫자가 훨씬 커 보인다.\n\nVC들은 이 숫자를 원했다.',
            flags: ['global_tam_researched'],
          },
          {
            text: '"한국 TAM을 글로벌 시장의 1%로 가정해서 역산"',
            effects: { persuasion: -10, mental: 5 },
            result: '역산. 편리하다. 하지만 해외 VC는 이 방법을 안다.\n\n\'그래서 글로벌 진출 계획이 구체적으로 어떻게 되시죠?\'라고 물어볼 것이다.',
            flags: ['lazy_tam'],
          },
          {
            text: '"우선 한국에서 압도적 1위 후 글로벌 확장" 논리 강화',
            effects: { persuasion: 5 },
            result: '나쁘지 않다. 하지만 Series B 규모의 해외 VC가 \'한국 우선\'을 납득하려면 한국 시장 지배력의 증거가 필요하다.',
            flags: ['korea_first_strategy'],
          },
        ],
        condition: null,
      },
    ],
  },

  // ===== CHAPTER 2: "Hello, 해외 VC" — 크로스보더 미팅 =====
  {
    chapter: 2,
    title: '"Hello, 해외 VC" — 크로스보더 미팅',
    events: [
      {
        id: 'fh_ch2_intro',
        chapter: 2,
        speaker: null,
        narration: '싱가포르에서 줌 미팅 요청이 왔다. 한국 시간 오전 9시 = 싱가포르 오전 8시.\n\n시차는 별거 아닌데, 영어가 문제다.',
        text: null,
        choices: null,
        condition: null,
      },
      {
        id: 'h_ch2_ev1',
        chapter: 2,
        speaker: { name: 'Sequoia SEA - Mark Chen 파트너', emoji: '🌏' },
        narration: '화면에 외국인 파트너가 앉아있다. 90분 미팅이다.',
        text: '왜 한국이 시작 시장으로 맞는지, 그리고 왜 이 팀이 글로벌 컴퍼니를 만들 수 있는지 말씀해주세요.',
        choices: [
          {
            text: '영어로 준비된 스크립트 + 데이터 중심 답변',
            effects: { persuasion: 20, mental: 5 },
            result: '유창하진 않았다. 하지만 논리는 있었다. 파트너가 고개를 끄덕였다.\n\n외국인의 고개 끄덕임은 보통 의례적이다. 하지만 이번엔 달랐다.',
            flags: ['confident_english_pitch'],
          },
          {
            text: '한국어로 답변 + 통역 활용',
            effects: { persuasion: -5, mental: 5 },
            result: '파트너가 미소를 유지했다. 통역이 끝나고 1초의 침묵이 있었다.\n\n그 1초가 길었다.',
            flags: ['korean_with_interpreter'],
          },
          {
            text: '"한국은 시작점일 뿐입니다. 동남아와 일본이 다음입니다" (과감하게)',
            effects: { persuasion: 15, mental: -10 },
            result: '맞는 말이었다. 증거는 없었다.\n\n하지만 VC는 때로 이런 과감함에 돈을 건다.',
            flags: ['bold_global_claim'],
          },
        ],
        condition: null,
      },
      {
        id: 'h_ch2_ev2',
        chapter: 2,
        speaker: { name: 'Sequoia SEA - Mark Chen 파트너', emoji: '🌏' },
        narration: '파트너가 용어를 쏟아내기 시작했다.',
        text: 'GTM 모션이 Product-led인지 Sales-led인지 궁금하고요, ICP 정의가 어떻게 되시는지 알고 싶습니다.',
        choices: [
          {
            text: 'GTM, PLG, ICP 모두 정확하게 답변',
            effects: { persuasion: 20 },
            result: 'GTM, PLG, ICP. 이 알파벳 조합에 익숙하다는 것 자체가 신호다.\n\n글로벌 언어를 구사하는 창업자.',
            flags: ['speaks_vc_language'],
          },
          {
            text: '"ICP 맥락을 좀 더 설명해주시겠어요?" (모르면 확인)',
            effects: { persuasion: 5, mental: 5 },
            result: '용기 있는 질문이었다. 파트너가 오히려 미소를 지었다.\n\n\'아는 척\'보다 낫다.',
            flags: ['asked_clarification'],
          },
          {
            text: '대충 아는 척하며 넘어감',
            effects: { persuasion: -18, mental: -10 },
            result: '파트너가 알아챘다.\n\n알아채고도 모른 척하는 것이 더 무서운 이유다.',
            flags: ['faked_knowledge'],
          },
        ],
        condition: null,
      },
    ],
  },

  // ===== CHAPTER 3: "DD는 국경이 없다" — 크로스보더 실사 =====
  {
    chapter: 3,
    title: '"DD는 국경이 없다" — 크로스보더 실사',
    events: [
      {
        id: 'fh_ch3_intro',
        chapter: 3,
        speaker: null,
        narration: '해외 VC의 DD가 시작됐다. 법인 구조 얘기가 나왔다.\n\n들어본 적 없는 얘기가 나왔다.',
        text: null,
        choices: null,
        condition: null,
      },
      {
        id: 'h_ch3_ev1',
        chapter: 3,
        speaker: { name: 'Sequoia SEA 법무팀 담당자', emoji: '⚖️' },
        narration: '해외 VC는 대부분 싱가포르 또는 델라웨어 HoldCo 구조를 원한다.',
        text: '싱가포르 HoldCo + 한국 OpCo 구조를 선호합니다. Flip 진행해보신 적 있으세요?',
        choices: [
          {
            text: '"이미 준비 중입니다" (변호사 통해 Flip 진행 중)',
            effects: { persuasion: 20, runway: -1 },
            result: '준비되어 있다. 변호사 비용이 또 나간다.\n\n하지만 이것이 해외 투자의 입장료다.',
            flags: ['flip_in_progress'],
          },
          {
            text: '"국내 구조로도 투자 가능한 방법을 함께 찾겠습니다"',
            effects: { persuasion: 5, mental: -5 },
            result: '해외 VC의 80%는 이 답변에서 흥미를 잃는다.\n\n나머지 20%가 진짜 전략적 투자자다.',
            flags: ['structure_negotiation'],
          },
          {
            text: '"변호사와 먼저 상의해봐야 할 것 같아요"',
            effects: { persuasion: -20, mental: -10 },
            result: '솔직하다. 하지만 Series B 창업자라면 Flip이 뭔지는 알고 있어야 했다.',
            flags: ['unprepared_structure'],
          },
        ],
        condition: null,
      },
      {
        id: 'h_ch3_ev2',
        chapter: 3,
        speaker: { name: '기존 Series A 투자사 파트너', emoji: '🧑‍💼' },
        narration: '해외 VC가 들어오면 기존 투자자들의 지분이 희석된다. 기존 투자자가 카톡을 보내왔다.',
        text: '대표님, 이번 딜 조건이 저희 입장에서 불리한 부분이 있어서요. Anti-dilution 조항이 발동될 수 있는데, 해외 VC 조건 중 일부를 조정해주셔야 할 것 같습니다.',
        choices: [
          {
            text: '기존 투자자 요구 수용 - 해외 VC와 재협상',
            effects: { persuasion: -10, mental: -10, runway: -0.5 },
            result: '이제 두 VC를 동시에 달래야 한다.\n\n이것이 Series B의 진짜 난이도다.',
            flags: ['existing_vc_conflict'],
          },
          {
            text: '"양쪽 모두 보호되는 구조를 찾겠습니다" - 변호사 통해 중재',
            effects: { persuasion: 10, runway: -1 },
            result: '외교관이 됐다. 변호사 비용이 또 나간다.\n\n하지만 이것이 CEO의 일이다.',
            flags: ['mediated_investors'],
          },
          {
            text: '"투자 조건은 VC분들끼리 협의해주세요" - 선 긋기',
            effects: { mental: 5, persuasion: -8 },
            result: '용기 있는 선 긋기. 하지만 투자자 관계는 나빠졌다.\n\n나쁜 투자자 관계는 다음 라운드에서 복수한다.',
            flags: ['vc_conflict_ignored'],
          },
        ],
        condition: null,
      },
      {
        id: 'h_ch3_ev3',
        chapter: 3,
        speaker: { name: 'Sequoia SEA DD 담당자', emoji: '🔍' },
        narration: 'DD 팀이 ARR 숫자를 들여다보기 시작했다.',
        text: 'ARR에 One-time 프로젝트 매출이 포함된 것 같은데, Recurring과 Non-recurring을 분리해서 다시 보내주실 수 있을까요?',
        choices: [
          {
            text: '깔끔하게 Recurring만 분리해서 제출',
            effects: { persuasion: -15, mental: -10 },
            result: 'ARR이 20% 줄었다. 파트너의 표정이 바뀌었다.\n\n투명하게 처리했지만 신뢰에 금이 갔다.',
            flags: ['arr_corrected'],
          },
          {
            text: '"저희 업종 관행상 포함하는 게 일반적입니다" 설명',
            effects: { persuasion: -25, mental: -15 },
            result: '이유를 댔다. DD팀이 메모를 했다. 그 메모가 파트너에게 전달됐다.\n\n미팅이 갑자기 짧아졌다.',
            flags: ['arr_defended_badly'],
          },
        ],
        condition: { flag: 'inflated_arr' },
      },
    ],
  },

  // ===== CHAPTER 4: "Sign or No Sign" — 크로스보더 텀시트 =====
  {
    chapter: 4,
    title: '"Sign or No Sign" — 크로스보더 텀시트',
    events: [
      {
        id: 'fh_ch4_intro',
        chapter: 4,
        speaker: null,
        narration: null,
        text: null,
        dynamicNarration: (stats) => {
          const runway = stats.runway.value;
          const mental = stats.mental.value;
          let extra = '';
          if (runway <= 1) extra = '\n\n⚠️ 위험 수준: 런웨이가 거의 없다. 이번이 마지막이다.';
          else if (mental <= 20) extra = '\n\n⚠️ 멘탈 붕괴 직전: 언제 쓰러져도 이상하지 않다.';
          return `텀시트가 왔다. 영어 17페이지. 변호사도 처음 보는 조항이 3개 있다고 한다.\n\n런웨이 ${runway}개월. 모든 것이 이번 주에 결정된다.${extra}`;
        },
        choices: null,
        condition: null,
      },
      {
        id: 'h_ch4_ev1',
        chapter: 4,
        speaker: { name: '시스템', emoji: '📋' },
        narration: '투자금 100억 (해외 VC 70억 + 국내 팔로온 30억) / Pre 400억 / Full Ratchet 희석방지 / Drag-Along 50% 이상 / 분기별 영어 투자자 보고 의무.',
        text: 'Full Ratchet 조항이 있습니다. 다음 라운드가 Down-round면 창업자 지분이 크게 희석됩니다. 어떻게 할까요?',
        choices: [
          {
            text: '국내 + 해외 변호사 각 1명씩 고용해서 완전 검토',
            effects: { persuasion: 15, runway: -1, mental: -5 },
            result: null,
            flags: ['thorough_legal_review'],
            statCheck: { stat: 'persuasion', threshold: 55, successFlag: 'passed_ic_hard', failFlag: 'failed_ic_hard' },
          },
          {
            text: '국내 변호사 1명으로 빠르게 검토',
            effects: { persuasion: 5, runway: -0.5 },
            result: null,
            flags: ['partial_legal_review'],
            statCheck: { type: 'combined', stats: ['persuasion', 'mental'], threshold: 90, successFlag: 'passed_ic_hard', failFlag: 'failed_ic_hard' },
          },
          {
            text: '직접 읽고 판단 - 빠른 클로징 우선',
            effects: { persuasion: -10, mental: 5 },
            result: null,
            flags: ['no_legal_review'],
            statCheck: { stat: 'persuasion', threshold: 65, successFlag: 'passed_ic_hard', failFlag: 'failed_ic_hard' },
          },
        ],
        condition: null,
      },
      {
        id: 'h_ch4_ev2_pass',
        chapter: 4,
        speaker: { name: 'Sequoia SEA - Mark Chen 파트너', emoji: '🌏' },
        narration: '계약서에 분기별 영어 투자자 보고 의무가 포함되어 있다.',
        text: '분기별로 재무 지표, 운영 KPI, 전략 업데이트를 영어로 보내주셔야 합니다. 팀에서 이게 가능한 구조인가요?',
        choices: [
          {
            text: '"CFO가 영어 가능하고, 보고 프로세스 세팅하겠습니다"',
            effects: { persuasion: 15, runway: -0.5 },
            result: '현실이 됐다. 분기 보고서 작성에 매번 3일씩 걸린다는 걸 아직 모를 뿐이다.',
            flags: ['committed_english_reporting', 'global_closed'],
          },
          {
            text: '"한국어 상세본 + 영어 요약본 구조는 어떨까요?"',
            effects: { persuasion: 10 },
            result: '합리적인 제안이다. 파트너가 \'그것도 괜찮다\'고 했다.\n\n이 네 글자가 이렇게 반가울 줄 몰랐다.',
            flags: ['bilingual_reporting', 'global_closed'],
          },
          {
            text: 'Side Letter에서 별도 협의 제안',
            effects: { persuasion: 5, mental: -5 },
            result: '협상을 시도했다. 해외 VC는 이런 창업자를 경험이 있다고 본다. 아니면 까다롭다고 본다.',
            flags: ['side_letter_negotiation', 'global_closed'],
          },
        ],
        condition: { flag: 'passed_ic_hard' },
      },
      {
        id: 'h_ch4_ev2_fail',
        chapter: 4,
        speaker: { name: 'Sequoia SEA - Mark Chen 파트너', emoji: '🌏' },
        narration: '파트너에게서 이메일이 왔다.',
        text: '"솔직히 말씀드리면, 이번 라운드에서 저희가 참여하기 어려울 것 같습니다. 다음에 한국 시장이 더 성장하면 다시 뵙고 싶습니다."\n\n다음. 다음은 없을 수도 있다.',
        choices: [
          {
            text: '국내 VC에 즉시 연락해서 브릿지 라운드 추진',
            effects: { runway: -0.5, mental: -15 },
            result: '2주가 남았다. 런웨이도 2주가 남았다.',
            flags: ['bridge_attempt'],
            probabilityCheck: { successRate: 0.4, successFlag: 'global_closed', failFlag: 'deal_collapsed' },
          },
          {
            text: '전략적 파트너(대기업 CVC)를 통한 대안 투자를 추진한다',
            effects: { mental: -10 },
            result: '"저희가 전략적으로 투자 검토해보겠습니다."\n\nVC가 아닌 대기업 CVC. 조건이 다르지만, 문이 열렸다.',
            flags: ['strategic_deal'],
          },
          {
            text: '국내 시장에 집중하고 다음 시도를 준비한다',
            effects: { mental: 10 },
            result: '글로벌 Series B를 포기했다.\n\n현실적인 선택. 국내에서 더 성장한 후 다시 시도한다.\n\n패배가 아니라, 전략적 후퇴다.',
            flags: ['pivot_domestic'],
          },
        ],
        condition: { flag: 'failed_ic_hard' },
      },
    ],
  },
];
