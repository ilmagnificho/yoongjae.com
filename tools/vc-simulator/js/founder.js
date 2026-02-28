/**
 * Founder Route Scenarios - 4 Chapters (EXTREME DIFFICULTY)
 * 모든 선택지에 함정이 있다. 좋아 보이는 선택도 뒤통수를 친다.
 */
const FounderScenarios = [
  // ===== CHAPTER 1: IR 준비 — "시작부터 난관" =====
  {
    chapter: 1,
    title: 'IR 준비 — "시작부터 난관"',
    events: [
      {
        id: 'f_ch1_intro',
        chapter: 1,
        speaker: null,
        narration: '당신은 퇴사 후 3개월째. 통장 잔고가 당신의 자존심보다 빠르게 줄고 있다.\n\n전 직장 동기들의 인스타: 해외 출장, 승진 축하. 당신의 인스타: 3개월째 업데이트 없음.',
        text: null,
        choices: null,
        condition: null,
      },
      {
        id: 'f_ch1_ev0',
        chapter: 1,
        speaker: { name: '엄마', emoji: '📞' },
        narration: '첫째 날 아침. 엄마에게서 전화가 왔다.',
        text: '아들, 그래서 그 회사는 언제 돈을 벌어? 네 아버지가 걱정을...',
        choices: [
          {
            text: '"곧이요 엄마" (거짓말)',
            effects: { mental: -5 },
            result: '"곧"이라는 단어가 입에서 나온 순간, 스스로도 믿지 못했다.\n\n거짓말의 무게가 멘탈을 깎는다.',
            flags: ['lied_to_mom'],
          },
          {
            text: '"솔직히 아직 모르겠어요"',
            effects: { mental: -5, persuasion: 5 },
            result: '3초간의 침묵. "...그래, 건강은 챙겨라."\n\n그 침묵에 만감이 교차한다. 하지만 솔직함은 설득의 근육을 키운다.',
            flags: ['honest_to_mom'],
          },
          {
            text: '전화를 안 받는다',
            effects: { mental: -3 },
            result: '부재중 전화 7통. 걱정한 엄마가 택배로 반찬을 보냈다. 반찬 덕에 이번 주 식비는 아꼈다.\n\n...참, 이번 달 핸드폰 요금도 밀렸다.',
            flags: [],
          },
        ],
        condition: null,
      },
      {
        id: 'f_ch1_ev1',
        chapter: 1,
        speaker: { name: 'CTO 박모씨', emoji: '👨‍💻' },
        narration: null,
        text: '대표님, TAM을 100조로 쓸까요? 솔직히 뻥인데- 다들 이렇게 쓰더라고요.',
        choices: [
          {
            text: '"10조면 10조라고 써"',
            effects: { persuasion: 5, mental: 3 },
            result: '정직한 선택. VC는 "시장이 작네요"라고 할 수도 있지만, 정직함은 신뢰를 산다.\n\n최소한 뻥치다 걸릴 걱정은 없다.',
            flags: ['tam_honest'],
          },
          {
            text: '"100조. 꿈은 크게."',
            effects: { persuasion: 8, mental: -5 },
            result: 'TAM 100조. 당신의 IR덱은 이제 판타지 소설과 구분이 어렵습니다.\n\n하지만 나중에 이 숫자를 설명해야 할 때가 온다...',
            flags: ['tam_100'],
          },
          {
            text: '"SAM/SOM까지 논리적으로"',
            effects: { mental: -8, runway: -0.5, persuasion: 15 },
            result: '1주를 태워 시장 분석을 했다. 런웨이가 좀 줄었지만, 논리적인 덱은 무기가 된다.',
            flags: ['tam_logical'],
          },
        ],
        condition: null,
      },
      {
        id: 'f_ch1_ev2',
        chapter: 1,
        speaker: { name: '디자이너', emoji: '🎨' },
        narration: null,
        text: 'PPT요? 노션이요? 아니면 요즘은 피그마로- 아, 근데 저 다음 달부터 프리랜서비 올려야 할 것 같아요.',
        choices: [
          {
            text: 'PPT (클래식)',
            effects: { persuasion: 3, mental: 3 },
            result: '무난하지만 빠르게 완성했다. 시간을 아낀 건 런웨이를 아낀 것과 같다.\n\n내용에 집중할 수 있다는 게 PPT의 장점이다.',
            flags: ['deck_ppt'],
          },
          {
            text: '피그마 (예쁘게)',
            effects: { runway: -0.5, mental: -5, persuasion: 10 },
            result: '1주를 태웠다. 디자이너 비용도 좀 들었다.\n\n예쁘긴 하다. 첫인상에서 확실히 유리할 것이다.',
            flags: ['deck_figma'],
          },
          {
            text: '노션 (빠르게)',
            effects: { mental: 5, persuasion: -5 },
            result: '빠르긴 했다. 하루 만에 완성. 멘탈을 아꼈다.\n\n"노션 IR이요? 음-" VC의 그 \'음-\'에 당신의 진지함이 의심받기 시작했다.',
            flags: ['deck_notion'],
          },
        ],
        condition: null,
      },
      // 챕터1 마지막 함정: CTO 동요
      {
        id: 'f_ch1_ev3',
        chapter: 1,
        speaker: { name: 'CTO 박모씨', emoji: '👨‍💻' },
        narration: 'IR 준비 중, CTO에게서 카톡이 왔다.',
        text: '대표님... 저 전 회사에서 연락 왔는데요. 연봉 1.5배에 RSU까지 준다고... 솔직히 고민되네요.',
        choices: [
          {
            text: '"지분 1% 더 줄게. 부탁이야."',
            effects: { mental: -5, persuasion: 5 },
            result: 'CTO는 남았다. 지분이 좀 희석됐지만, 팀이 유지된 건 큰 자산이다.\n\n"캡 테이블이 좀..."이라는 질문은 나중에 대응하면 된다.',
            flags: ['cto_stayed_equity'],
          },
          {
            text: '"가야 할 것 같으면 가. 억지로 못 잡아."',
            effects: { mental: -15, persuasion: -10 },
            result: 'CTO가 떠났다. 2인 팀이 1인 팀이 됐다.\n\nVC: "팀이... 대표님 혼자세요?"\n\n혼자서 개발, 기획, IR을 다 해야 한다. 수면 시간: 4시간.',
            flags: ['cto_left'],
          },
          {
            text: '"우리 비전을 다시 이야기하자" (설득)',
            effects: { mental: -3, persuasion: 5 },
            result: '밤새 카페에서 비전을 나눴다. 밥값은 당신이 냈다.\n\nCTO: "...한 번만 더 믿어볼게요. 근데 3개월 안에 투자 안 되면 저도 생각이 있어요."\n\n설득력이 는다. 설득은 연습이니까.',
            flags: ['cto_3month_ultimatum'],
          },
        ],
        condition: null,
      },
    ],
  },

  // ===== CHAPTER 2: 콜드메일 지옥 — "읽씹의 바다" =====
  {
    chapter: 2,
    title: '콜드메일 지옥 — "읽씹의 바다"',
    events: [
      {
        id: 'f_ch2_intro',
        chapter: 2,
        speaker: null,
        narration: 'VC 50곳에 메일을 보냈다. 5일이 지났다.',
        infoBox: '📊 결과:\n읽씹: 38건\n자동회신 "검토 후 연락드리겠습니다": 8건\n"현재 신규 투자 중단": 2건\n"저희 투자 분야가 아닙니다": 1건\n미팅 수락: 1건 (주니어 심사역)\n\n응답률: 2%',
        text: '1/50. 복권 당첨 확률보다는 높다. 그게 위안이 된다면.',
        choices: null,
        condition: null,
      },
      {
        id: 'f_ch2_ev1',
        chapter: 2,
        speaker: { name: '시스템', emoji: '📬' },
        narration: '어떻게 대응할 것인가?',
        text: null,
        choices: [
          {
            text: '주니어라도 만나자',
            effects: { persuasion: 8, mental: -3 },
            result: '겸손은 미덕이다. 주니어를 통해 파트너에게 닿을 수도 있다.\n\n실제로 주니어가 "이거 한번 보세요"라고 파트너에게 올렸다는 소문이 들렸다. 아마도.',
            flags: ['met_junior'],
          },
          {
            text: '팔로업 메일 3연발',
            effects: { mental: -8, persuasion: 3 },
            result: '3번째 팔로업. "혹시 메일 확인-"\n\n한 VC에게서 답장이 왔다: "네, 확인했습니다. 현재 관심 분야가 아닙니다."\n\n명확한 거절이 읽씹보다 나은 세상. 그리고 끈기는 기록된다.',
            flags: ['followup_3'],
          },
          {
            text: '링크드인 DM 직접 어택',
            effects: { mental: -5, persuasion: 10 },
            result: '파트너 김모씨가 DM을 열었다. 그리고... 차단당했다.\n\n다른 파트너 이모씨: "오, 대담하시네요 ㅋ 커피챗 할까요?"\n\n \'커피챗\'이 위험 신호일 수도 있지만, 일단 미팅은 잡혔다.',
            flags: ['linkedin_dm'],
          },
        ],
        condition: null,
      },
      {
        id: 'f_ch2_ev2',
        chapter: 2,
        speaker: { name: '대학 선배', emoji: '🍺' },
        narration: null,
        text: '야, 내가 XX벤처스 파트너 아는데. 소개시켜줄까? 밥 한번 사라. 아, 와인도.',
        choices: [
          {
            text: '"감사합니다 선배!" (밥값 50만원)',
            effects: { runway: -0.5, persuasion: 10 },
            result: '50만원짜리 오마카세. 선배는 와인을 시켰다.\n\n"아, 근데 그 파트너 지금 안식년이래 ㅋㅋ 대신 다른 파트너 소개해줄게~"\n\n돈은 좀 들었지만, 인맥은 만들어졌다.',
            flags: ['senior_intro'],
          },
          {
            text: '"괜찮아요, 실력으로 할게요"',
            effects: { mental: 5 },
            result: '자존심은 지켰다. 멘탈도 회복됐다.\n\n선배: "에이, 이 바닥이 다 인맥인데... 너 고집은 여전하다."',
            flags: ['no_intro'],
          },
        ],
        condition: null,
      },
      // 추가 함정 이벤트: 투자사 사칭 사기
      {
        id: 'f_ch2_ev3',
        chapter: 2,
        speaker: { name: '??? 투자사', emoji: '📧' },
        narration: '알 수 없는 메일이 왔다.',
        text: '귀사의 서비스에 깊은 관심이 있습니다. 투자 논의를 위해 미팅을 잡고 싶습니다.\n\n- "글로벌 캐피탈 파트너스"',
        choices: [
          {
            text: '즉시 미팅 잡기 (흥분)',
            effects: { mental: -12, runway: -0.5 },
            result: '강남 카페에서 만났다. 상대방이 말한다: "저희가 투자하려면 먼저 사업성 평가 비용 500만원을..."\n\n투자사 사칭 사기였다. 시간과 교통비만 날렸다.',
            flags: ['got_scammed'],
          },
          {
            text: '구글링으로 검증',
            effects: { mental: 3, persuasion: 5 },
            result: '"글로벌 캐피탈 파트너스" — 검색 결과 없음. 주소지: 고시원.\n\n사기였다. 검증하길 잘했다! 이런 경험이 판단력을 키운다.',
            flags: ['avoided_scam'],
          },
        ],
        condition: null,
      },
    ],
  },

  // ===== CHAPTER 3: VC 미팅 — "질문의 바다" =====
  {
    chapter: 3,
    title: 'VC 미팅 — "질문의 바다"',
    events: [
      {
        id: 'f_ch3_intro',
        chapter: 3,
        speaker: null,
        narration: '드디어 VC 미팅. 강남 어딘가의 유리벽 회의실.\n\n맞은편에 앉은 사람이 당신의 운명을 쥐고 있다. 그는 오늘 5번째 미팅이고, 당신에게는 이것이 마지막 기회다.',
        text: null,
        choices: null,
        condition: null,
      },
      // CTO 떠난 경우 추가 이벤트
      {
        id: 'f_ch3_ev0_no_cto',
        chapter: 3,
        speaker: { name: '김파트너', emoji: '🧑‍💼' },
        narration: '미팅 시작 30초 만에 킬러 질문이 날아왔다.',
        text: '팀이... 대표님 혼자세요? CTO는요?',
        choices: [
          {
            text: '"비전 차이로 갈라섰습니다" (포장)',
            effects: { persuasion: -5 },
            result: '"아... 초기에 팀 리스크가 크시네요."\n\n메모에 \'팀 리스크\'라고 적는 소리가 들린다.',
            flags: ['team_risk_noted'],
          },
          {
            text: '"1인 개발로도 여기까지 왔습니다" (자신감)',
            effects: { persuasion: 3, mental: -5 },
            result: '"대단하시네요. 근데 스케일업은 어떻게...?"\n\n질문은 날카롭지만, 실행력을 보여준 건 인정받았다.',
            flags: ['solo_dev'],
          },
        ],
        condition: { flag: 'cto_left' },
      },
      {
        id: 'f_ch3_ev1',
        chapter: 3,
        speaker: { name: 'A캐피탈 김파트너', emoji: '🧑‍💼' },
        narration: '표정: 무',
        text: '잘 들었고요. 근데, 네이버가 이거 만들면 어떻게 하실 건가요?',
        choices: [
          {
            text: '"저희만의 기술적 해자가-"',
            effects: { persuasion: 5 },
            result: '"특허요? 음..." (메모: \'해자 주장, 검증 필요\')\n\n"해자"라는 단어를 많은 창업자가 쓰지만, 그래도 답변은 했다.',
            resultSpeaker: { name: '김파트너', emoji: '🧑‍💼' },
            flags: [],
          },
          {
            text: '"빅테크는 느립니다. 선점이요."',
            effects: { persuasion: 8, mental: -3 },
            result: '"자신감은 좋은데... 근거가?"\n\n추가 질문이 왔지만 자신감 있는 답변은 인상을 남겼다.',
            resultSpeaker: { name: '김파트너', emoji: '🧑‍💼' },
            flags: ['confident_answer'],
          },
          {
            text: '"솔직히 들어오면 힘듭니다. 하지만-"',
            effects: { persuasion: -10, mental: -5 },
            result: '김파트너의 표정이 살짝 굳었다.\n\n"하지만" 뒤의 말을 듣긴 했지만 확신은 못 준 것 같다.',
            resultSpeaker: { name: '김파트너', emoji: '🧑‍💼' },
            flags: ['too_honest'],
          },
        ],
        condition: null,
      },
      // TAM 100조 선택 시 강화 이벤트 (더 가혹)
      {
        id: 'f_ch3_ev2_tam100',
        chapter: 3,
        speaker: { name: '박심사역', emoji: '📊' },
        narration: '심사역이 IR덱을 넘기다 멈췄다.',
        text: '이거 TAM 100조라고 쓰셨는데... 산출 근거 좀 볼 수 있을까요? 그리고 MoM 15%라고 하셨는데 paying user 기준이에요?',
        choices: [
          {
            text: '대시보드 오픈 (준비 완료)',
            effects: { persuasion: 15 },
            result: '데이터를 꺼냈다. 심사역 눈빛이 달라졌다.\n\n"TAM 산출은 좀 공격적이시네요. 하지만 데이터는 좋네요."\n\n준비한 보람이 있다.',
            flags: ['dashboard_ready'],
          },
          {
            text: '"그건 좀- 다음에 보내드릴게요"',
            effects: { persuasion: -15, mental: -8 },
            result: '미팅이 12분 만에 끝났다. 악수도 없이.\n\n엘리베이터에서 눈물이 나왔다.',
            flags: ['no_data'],
          },
          {
            text: '"저희는 PMF 전이라 성장에 집중-"',
            effects: { persuasion: -5, mental: -3 },
            result: '"네- 알겠습니다."\n\n그 \'알겠습니다\'는 \'됐습니다\'였다. 경험치가 쌓이면 이 뉘앙스를 구분할 수 있게 된다.',
            resultSpeaker: { name: '박심사역', emoji: '📊' },
            flags: ['pmf_excuse'],
          },
        ],
        condition: { flag: 'tam_100' },
      },
      // TAM 정직/논리적 선택 시 일반 이벤트
      {
        id: 'f_ch3_ev2_normal',
        chapter: 3,
        speaker: { name: '박심사역', emoji: '📊' },
        narration: null,
        text: 'MoM 15%요? paying user 기준이에요? 좀 더 디테일하게 설명해주시겠어요?',
        choices: [
          {
            text: '대시보드 오픈 (준비 완료)',
            effects: { persuasion: 12 },
            result: '심사역이 고개를 끄덕였다. "경쟁사 대비 차별점이 뭐죠?" 질문이 왔지만 분위기는 좋다.\n\n데이터는 거짓말을 하지 않는다.',
            flags: ['dashboard_ready'],
          },
          {
            text: '"코호트 분석까지 준비했습니다"',
            effects: { persuasion: 10 },
            result: '심사역이 메모를 시작했다. 메모 내용: "코호트 OK, 추가 검토"\n\n준비한 사람은 다르다.',
            flags: ['cohort_ready'],
          },
          {
            text: '"아직 초기라 데이터가 부족하지만-"',
            effects: { persuasion: -8, mental: -5 },
            result: '"네- 좀 더 데이터가 쌓이면 다시 뵈죠."\n\n이 문장을 번역하면: "다시 연락하지 마세요."',
            resultSpeaker: { name: '박심사역', emoji: '📊' },
            flags: ['lack_data'],
          },
        ],
        condition: { notFlag: 'tam_100' },
      },
      {
        id: 'f_ch3_ev3',
        chapter: 3,
        speaker: { name: '김파트너 (카톡)', emoji: '💬' },
        narration: '미팅 종료 후 24시간. VC에게서 카톡이 왔다.',
        text: '오늘 미팅 좋았습니다! 다음에 커피챗 한번 해요 ☺',
        choices: [
          {
            text: '"네! 다음 주 어떠세요?" (적극)',
            effects: { persuasion: 5 },
            result: null,
            flags: ['active_followup'],
            probabilityCheck: { successRate: 0.4, successFlag: 'followup_success', failFlag: 'followup_fail' },
          },
          {
            text: '"구체적인 다음 스텝이 있을까요?" (직구)',
            effects: { persuasion: 5, mental: -5 },
            result: '"아, 내부 검토 후 말씀드릴게요"\n\n번역: 거절일 수도 있지만, 직접 물어본 건 좋은 습관이다.',
            resultSpeaker: { name: '김파트너', emoji: '🧑‍💼' },
            flags: ['direct_ask'],
          },
          {
            text: '커피챗 = 거절로 해석. 다른 VC 집중.',
            effects: { mental: 5, persuasion: 5 },
            result: '"커피챗 = 정중한 거절"을 학습했다. 성장이다.\n\n에너지를 아끼는 것도 전략이다.',
            flags: ['learned_coffeechat'],
          },
        ],
        condition: null,
      },
      // CH3 마지막 함정: 경쟁사 소식
      {
        id: 'f_ch3_ev4',
        chapter: 3,
        speaker: { name: '뉴스 알림', emoji: '📰' },
        narration: '미팅 다음 날, 뉴스 알림이 떴다.',
        text: '"[속보] XX(당신의 경쟁사), 시리즈A 100억 투자 유치"\n\n같은 시장, 같은 고객, 더 큰 팀, 더 많은 돈.',
        choices: [
          {
            text: '"우리가 더 잘해. 포기 안 해."',
            effects: { mental: -5, persuasion: 5 },
            result: '자신감은 좋다. "왜 당신이 이기는가"를 증명해야 하지만, 포기하지 않는 것이 첫걸음이다.',
            flags: ['competitor_funded'],
          },
          {
            text: '"...차별화 전략을 다시 짜자"',
            effects: { mental: -5, persuasion: 8 },
            result: 'IR덱에 경쟁사 분석을 추가했다. 차별화 포인트가 더 명확해졌다.\n\n위기가 기회가 되는 순간.',
            flags: ['competitor_funded', 'redid_deck'],
          },
        ],
        condition: null,
      },
    ],
  },

  // ===== CHAPTER 4: 최종 결전 — "될까 말까" =====
  {
    chapter: 4,
    title: '최종 결전 — "될까 말까"',
    events: [
      {
        id: 'f_ch4_intro',
        chapter: 4,
        speaker: null,
        narration: null,
        text: null,
        dynamicNarration: (stats) => {
          const runway = stats.runway.value;
          const mental = stats.mental.value;
          let extra = '';
          if (runway <= 2) extra = '\n\n경고: 런웨이가 거의 바닥이다. 이번이 진짜 마지막이다.';
          if (mental <= 20) extra = '\n\n경고: 멘탈이 위험 수준이다. 조금만 더 버텨야 한다... 버틸 수 있다면.';
          if (runway <= 2 && mental <= 20) extra = '\n\n⚠️ 런웨이도, 멘탈도 바닥이다. 기적이 필요하다.';
          return `마지막 기회. 남은 런웨이 ${runway}개월. 멘탈 ${mental}%.\n\nA캐피탈이 2차 미팅을 제안했다. 하지만 그전에...${extra}`;
        },
        choices: null,
        condition: null,
      },
      // CTO 최후통첩 이벤트 (3개월 약속한 경우)
      {
        id: 'f_ch4_cto_ultimatum',
        chapter: 4,
        speaker: { name: 'CTO 박모씨', emoji: '👨‍💻' },
        narration: null,
        text: '대표님, 3개월 됐는데요. 솔직히 저도 더 못 버티겠어요. 이번 주까지 투자 소식 없으면... 저 그 오퍼 받으려고요.',
        choices: [
          {
            text: '"이번 주에 결과 나와. 조금만 더." (거짓말일 수도)',
            effects: { mental: -5, persuasion: 5 },
            result: 'CTO의 눈에 의심이 서려있다. 하지만 일단 고개를 끄덕였다.\n\n압박감이 오히려 집중력을 키운다.',
            flags: ['cto_final_chance'],
          },
          {
            text: '"고마웠어. 가도 괜찮아."',
            effects: { mental: -10, persuasion: -5 },
            result: 'CTO가 떠났다. 투심위 직전에.\n\n"팀 변동이 있으시네요?" VC의 질문이 벌써 들린다.',
            flags: ['cto_left_final'],
          },
        ],
        condition: { flag: 'cto_3month_ultimatum' },
      },
      {
        id: 'f_ch4_ev1',
        chapter: 4,
        speaker: { name: '김파트너', emoji: '🧑‍💼' },
        narration: 'A캐피탈 회의실. 파트너 5명이 앉아있다. 한 명은 폰을 보고 있고, 한 명은 하품을 참고 있다.',
        text: '자, 마지막으로 한마디만 해주세요. 왜 저희가 투자해야 하나요?',
        choices: [
          {
            text: '숫자로 승부 (데이터 중심)',
            effects: {},
            result: null,
            flags: ['pitch_data'],
            statCheck: { stat: 'persuasion', threshold: 50, successFlag: 'passed_ic', failFlag: 'failed_ic' },
          },
          {
            text: '비전으로 승부 (열정 중심)',
            effects: {},
            result: null,
            flags: ['pitch_vision'],
            statCheck: { stat: 'mental', threshold: 50, successFlag: 'passed_ic', failFlag: 'failed_ic' },
          },
          {
            text: 'FOMO (다른 VC 언급)',
            effects: {},
            result: null,
            flags: ['pitch_fomo'],
            statCheck: { stat: 'persuasion', threshold: 45, successFlag: 'passed_ic', failFlag: 'failed_ic' },
          },
          {
            text: '솔직하게 (진심)',
            effects: {},
            result: null,
            flags: ['pitch_honest'],
            statCheck: { type: 'combined', stats: ['persuasion', 'mental'], threshold: 90, successFlag: 'passed_ic', failFlag: 'failed_ic' },
          },
        ],
        condition: null,
      },
      // 투심위 통과 시 — 하지만 함정은 계속
      {
        id: 'f_ch4_ev2_pass',
        chapter: 4,
        speaker: { name: '시스템', emoji: '📋' },
        narration: '📋 텀시트 도착! ...하지만 조건을 잘 읽어보자.',
        text: '투자금: 10억 / Pre 30억 (예상보다 낮음) / 우선주 / 희석방지(full ratchet) / 동반매도청구권 / 경영권 관련 특별조항 3개',
        choices: [
          {
            text: '바로 사인 (런웨이가 없으니까)',
            effects: {},
            result: '펜을 들었다. 계약서에 사인했다.\n\n변호사 친구: "야... 이 조건으로 사인했어? full ratchet에 동반매도청구권까지? 다음 라운드에서 네 지분이..."\n\n축하합니다. 투자금은 들어왔지만 당신의 회사가 아니게 될 수도 있습니다.',
            flags: ['signed_immediately'],
          },
          {
            text: '변호사 검토 요청',
            effects: { runway: -0.5 },
            result: '변호사: "full ratchet이요? 이건 좀 수정해야 합니다."\n\n협상 끝에 독소 조항 제거 완료. 시간은 좀 들었지만 제대로 된 계약이다.',
            flags: ['lawyer_review'],
          },
          {
            text: '밸류 올려달라고 협상',
            effects: { mental: -5 },
            result: null,
            flags: ['negotiate_valuation'],
            probabilityCheck: { successRate: 0.4, successFlag: 'valuation_up', failFlag: 'deal_broken' },
          },
        ],
        condition: { flag: 'passed_ic' },
      },
      // 투심위 탈락 시
      {
        id: 'f_ch4_ev2_fail',
        chapter: 4,
        speaker: { name: 'A캐피탈', emoji: '📧' },
        narration: 'A캐피탈로부터 정중한 메일이 왔다.',
        text: '"깊이 검토했으나, 현 시점에서는 저희 투자 기준과 다소 차이가 있어... 향후 좋은 기회가 있기를 바랍니다."\n\n번역: 안 합니다.\n\n이 메일의 폰트는 왜 이렇게 정갈할까. 거절도 예쁘게 하는 세상.',
        choices: [
          {
            text: '다른 VC 찾기 (계속 도전)',
            effects: { runway: -0.5, mental: -10 },
            result: '다시 콜드메일을 쓴다. 51번째 메일.\n\n이쯤 되면 집착인지 열정인지 자신도 모른다. 하지만 멈추지 않는 사람이 이긴다.',
            flags: ['keep_fighting'],
          },
          {
            text: '피봇 (방향 전환)',
            effects: { mental: -8 },
            result: '"처음부터 다시"를 "피봇"이라고 부르는 건 스타트업 세계의 가장 우아한 언어적 발명이다.\n\n새로운 방향에서 가능성이 보인다.',
            flags: ['pivot'],
          },
          {
            text: '포기 (폐업)',
            effects: {},
            result: '사업자 등록 말소. 법인 해산 절차.\n\n카페에 앉아 이력서를 쓴다. "대표이사" 경력을 어떻게 표현할지 30분째 고민 중.',
            flags: ['give_up'],
          },
        ],
        condition: { flag: 'failed_ic' },
      },
    ],
  },
];
