# Fund Me If You Can - Claude Code 실행 지시서

## 프로젝트 개요
- **게임명**: Fund Me If You Can (실패하면 사기, 성공하면 비전)
- **타입**: 실화 기반 실리콘밸리 풍자 텍스트 RPG + 90년대 픽셀아트 스타일
- **Repo**: https://github.com/ilmagnificho/yoongjae.com.git
- **작업 경로**: `public/tools/fund-me/`
- **배포 URL**: https://yoongjae.com/tools/fund-me/
- **상세 PRD**: 이 지시서와 함께 제공되는 `fund-me-if-you-can-prd.md` 참조

---

## 핵심 원칙 (모든 단계에서 준수)

1. **순수 HTML/CSS/JavaScript**. 프레임워크 없음. 외부 CDN 최소화 (Google Fonts 픽셀 폰트 정도만 허용)
2. **상대 경로만 사용**. yoongjae.com은 Astro 기반 사이트이고, 이 게임은 `public/tools/fund-me/` 에 standalone으로 들어감. 절대 경로 금지
3. **모바일 퍼스트**. 세로 모드 최적화. 터치 영역 44px 이상. 한 화면에 하나의 이벤트
4. **한국어 먼저**. 모든 텍스트는 한국어로 먼저 구현. 영어는 나중에 추가 (i18n 구조는 미리 준비)
5. **기존 vc-simulator 참고**. 같은 repo의 `public/tools/vc-simulator/`에 기존 게임이 있음. 엔진 구조, UI 패턴 참고 가능하나, 코드를 직접 import하지는 말 것. 별도 독립 프로젝트로 만들 것

---

## 파일 구조

```
public/tools/fund-me/
├── index.html              # 엔트리포인트 (단일 HTML)
├── css/
│   └── style.css           # 전체 스타일 + 픽셀아트 렌더링
├── js/
│   ├── engine.js           # 게임 엔진 (상태 관리, 턴 진행, 조건 분기, flags)
│   ├── founder.js          # Founder 루트 시나리오 데이터 (Roi Kim)
│   ├── vc.js               # VC 루트 시나리오 데이터 (Byron Park)
│   ├── endings.js          # 엔딩 판정 로직 + 풍자 명언
│   ├── ui.js               # UI 렌더링 + 대화 시스템 + 타이핑 효과 + 애니메이션
│   ├── sprites.js          # 캐릭터 픽셀 스프라이트 데이터 (JS 배열로 정의)
│   ├── backgrounds.js      # 배경 픽셀아트 데이터
│   ├── audio.js            # 8bit 효과음 (Web Audio API로 코드 생성)
│   └── share.js            # 결과 카드 Canvas 생성 + SNS 공유
└── og-image.png            # OG 메타 이미지 (나중에 추가)
```

---

## 개발 순서 (5단계)

### 1단계: 게임 엔진 + 기본 구조 (먼저 이것부터)

**목표**: 텍스트 기반으로 게임이 처음부터 끝까지 플레이 가능한 상태

**작업 내용**:
- `index.html` 생성: 기본 HTML 구조, meta 태그 (og:title, og:description, og:image, og:url), viewport 설정
- `engine.js` 생성:
  - 게임 상태 객체 관리 (현재 챕터, 이벤트, 스탯, flags, 선택 히스토리)
  - 역할 선택 (Founder / VC)
  - 턴 진행 로직 (이벤트 → 선택지 표시 → 선택 → 효과 적용 → 다음 이벤트)
  - 조건부 이벤트 분기 (flags 시스템: 이전 선택이 이후 이벤트에 영향)
  - 스탯 0 도달 시 게임오버 체크
  - 엔딩 판정 트리거
- `ui.js` 생성 (1단계에서는 기본만):
  - 타이틀 화면 렌더링
  - 역할 선택 화면
  - 이벤트 텍스트 + 선택지 버튼 표시
  - 스탯 바 표시 (상단 고정)
  - 타이핑 효과 (나레이터/대사 텍스트)
  - 스탯 변화 시 숫자 팝업 (+10 / -15)
- `style.css` 생성 (1단계에서는 기본만):
  - 다크 모드 베이스
  - 모바일 퍼스트 레이아웃
  - 선택지 버튼 스타일 (터치 영역 44px+)

**스탯 시스템** (PRD 참조):
- Founder: 하이프(🔥, 초기 30) / 신뢰도(🎯, 초기 70) / 프로덕트(⚙️, 초기 20)
- VC: 확신(💎, 초기 50) / 평판(📊, 초기 70) / 실사력(🔍, 초기 50)
- Founder: 신뢰도 ≤ 0 → 게임오버
- VC: 평판 ≤ 0 → 게임오버

**특수 메커니즘** (중요!):
- Founder: 하이프와 신뢰도는 역상관. 대부분의 바이럴 선택은 하이프↑ + 신뢰도↓
- VC: 확신과 실사력이 긴장 관계. DD 깊이 할수록 확신 흔들림

**이 단계 완료 기준**: 텍스트만으로 Founder/VC 양쪽 루트를 처음부터 엔딩까지 플레이할 수 있음

---

### 2단계: 시나리오 데이터 입력

**목표**: PRD의 전체 시나리오를 데이터로 변환

**작업 내용**:
- `founder.js`: Founder 루트 5챕터 전체 시나리오 데이터
- `vc.js`: VC 루트 5챕터 전체 시나리오 데이터
- `endings.js`: 엔딩 10개 판정 로직 + 풍자 명언 풀

**시나리오 데이터 포맷** (이 포맷을 정확히 따를 것):
```javascript
{
  id: "f_ch2_ev1",              // f = founder, v = vc
  chapter: 2,
  title: "챕터 2: 점화",         // 챕터 제목
  speaker: {
    name: "마케팅팀",
    emoji: "📢",                 // 1단계에서는 이모지, 3단계에서 스프라이트로 교체
    spriteKey: "marketing",      // 3단계 스프라이트 매핑용 (미리 키만 넣어둘 것)
  },
  background: "sf_office",       // 3단계 배경 매핑용 (미리 키만 넣어둘 것)
  narration: "나레이터 코멘트 텍스트",
  text: "이벤트 본문 (대사 또는 상황 설명)",
  choices: [
    {
      text: "선택지 텍스트",
      effects: { hype: 25, credibility: -15, product: -5 },
      result: "선택 결과 텍스트 (나레이터 풍자 포함)",
      resultSpeaker: {            // 결과에서 말하는 캐릭터 (없으면 나레이터)
        name: "나레이터",
        emoji: "🎭",
        spriteKey: "narrator",
      },
      flags: ["rage_bait_launch"],
      nextEvent: null,            // 특정 이벤트로 강제 이동 시 사용. null이면 순차 진행
    },
  ],
  condition: null,                // { flag: "flag_name" } 또는 { flag: "flag_name", negate: true }
  probability: null,              // 확률 기반 분기 시 사용 (예: 0.5 = 50%)
}
```

**중요**: PRD에 있는 시나리오 텍스트를 그대로 사용할 것. 나레이터의 시니컬한 톤, 블랙 유머, 업계 용어 모두 PRD 원문 유지.

**시나리오 전체 목록** (PRD 참조):
- Founder 루트: 챕터 1(2이벤트) + 챕터 2(2이벤트) + 챕터 3(3이벤트) + 챕터 4(3이벤트) + 챕터 5(2이벤트) = 12이벤트
- VC 루트: 챕터 1(2이벤트) + 챕터 2(2이벤트) + 챕터 3(2이벤트) + 챕터 4(2이벤트) + 챕터 5(2이벤트) = 10이벤트
- 총 22이벤트 + 엔딩 10개 + 풍자 명언 12개

**이 단계 완료 기준**: 모든 이벤트, 선택지, flags 분기, 엔딩 판정이 정상 작동. 모든 엔딩에 도달 가능.

---

### 3단계: 픽셀아트 비주얼

**목표**: 90년대 GBA 스타일 픽셀아트 RPG 비주얼로 업그레이드

**중요 원칙**: 
- 모든 픽셀아트는 **외부 이미지 파일 없이 JavaScript 코드로 생성**
- Canvas API로 렌더링
- `image-rendering: pixelated` CSS로 선명한 확대

**작업 내용**:

**A) 캐릭터 스프라이트 (`sprites.js`)**
- 크기: 64x64px 기본 → CSS/Canvas로 스케일업
- JavaScript 2D 배열로 픽셀 색상 데이터 정의
- 필수 캐릭터 (각각 표정 2-4개):

| spriteKey | 캐릭터 | 외형 | 표정 |
|-----------|--------|------|------|
| roi | Roi Kim | 22세, 검은 티셔츠, 금색 팔찌, 짧은 머리, 자신감 포즈 | default, excited, nervous, confession |
| byron | Byron Park | 30대, 깔끔한 셔츠, 안경, 분석적 표정 | default, convinced, doubtful, shocked |
| neil | Neil Sharma (CTO) | 후디, 노트북 | default, worried |
| gp | GP (시니어 파트너) | 정장, 위압감 | default, angry, satisfied |
| reporter | TechBuzz 기자 | 노트패드 | default |
| narrator | 나레이터 | 후드 쓴 미스터리 캐릭터 | default (시니컬 고정) |
| marketing | 마케팅팀 | 캐주얼, 스마트폰 | default |
| colleague | 동료 심사역 | 셔츠, 회의적 표정 | default |
| seedvc | Seed Capital VC | 정장, 미소 | default |

- 대화창에서 초상화로 표시 (왼쪽 64x64 → 128x128 스케일)

**B) 배경 (`backgrounds.js`)**
- 크기: 320x180px 기본 → 풀스크린 스케일업
- 심플한 픽셀 배경 (디테일보다 분위기 중심)
- 필수 배경:

| backgroundKey | 장면 | 핵심 요소 |
|---------------|------|-----------|
| campus | Columbus University | 아이비 건물, 잔디, 벤치 |
| sf_office | SF SoMa 사무실 | 모니터들, 벽에 테이프로 붙인 "CEO" 명패, 네온 "Bluffely" 사인 |
| sf_cafe | SF 카페 미팅 | 커피잔, 노트북, 유리벽, 바깥에 SF 스카이라인 |
| conference | TechBuzz Disrupt | 큰 무대, 스크린, 관객 실루엣 |
| ny_office | 뉴욕 오피스 | 야경, 어두운 톤, 빌딩 실루엣 |
| a2z_office | a2z Capital | 고급 인테리어, 화이트보드에 "Portfolio" 리스트 |
| twitter_feed | X 타임라인 | 스마트폰 화면, 바이럴 포스트, 숫자들 |
| boardroom | 투심위 회의실 | 긴 테이블, 의자 5개, 프로젝터 |
| dashboard | 포트폴리오 대시보드 | 모니터, 그래프 (빨간 하락선), 숫자 |
| gp_room | GP 집무실 | 어두운 조명, 책장, 무거운 분위기 |

**C) 대화 시스템 UI 업그레이드**
- 포켓몬스터 스타일 대화창:
  - 하단 대화 박스 (픽셀 테두리, 반투명 배경)
  - 왼쪽에 캐릭터 초상화 (64→128px 스케일)
  - 오른쪽에 이름 + 대사 텍스트 (타이핑 효과 유지)
- 상단 스탯 바 (픽셀 프로그레스 바 스타일: █░)
- 선택지 버튼: 픽셀 테두리, hover/active 시 색상 변경
- 챕터 전환: 페이드 또는 와이프 트랜지션

**D) 컬러 팔레트** (PRD 참조):
- 공통 배경: #0a0a0f
- Founder 악센트: #FF4444 (레드), #FF8800 (오렌지)
- VC 악센트: #6644FF (퍼플), #4488FF (블루)
- 스탯 바 색상은 PRD의 컬러 팔레트 섹션 참조

**E) 픽셀 폰트**
- Google Fonts에서 `DungGeunMo` 또는 `Press Start 2P` (영문) 사용
- 한글 픽셀 폰트가 CDN에 없으면, `Noto Sans KR` 같은 깔끔한 폰트 + CSS pixel rendering으로 대체 가능
- 나레이터 텍스트: 약간 작은 크기 + 회색(#888888)

**이 단계 완료 기준**: 모든 화면에 픽셀아트 캐릭터, 배경, 대화창이 적용됨. 포켓몬스터 같은 레트로 RPG 느낌이 남.

---

### 4단계: 효과음 + 애니메이션

**목표**: 게임 몰입감 완성

**작업 내용**:

**A) 8bit 효과음 (`audio.js`)**
- Web Audio API의 OscillatorNode로 합성 (외부 파일 없음)
- 필수 효과음:
  - `click`: 선택지 클릭 시 짧은 "삐빅" (100ms)
  - `stat_up`: 스탯 상승 시 상승 아르페지오 (300ms)
  - `stat_down`: 스탯 하락 시 하강 톤 (300ms)
  - `chapter`: 챕터 시작 시 짧은 팡파레 (500ms)
  - `gameover`: 게임오버 시 낮은 톤 (500ms)
  - `ending_good`: 좋은 엔딩 시 밝은 멜로디 (1s)
  - `ending_bad`: 나쁜 엔딩 시 어두운 멜로디 (1s)
- 음소거 토글 버튼 (화면 우측 상단)
- 기본값: 음소거 (사용자가 직접 켜게)

**B) 애니메이션**
- 타이핑 효과: 한 글자씩 나타남 (30-50ms 간격). 클릭하면 즉시 전체 표시
- 스탯 변화 팝업: "+15 🔥" 또는 "-10 🎯" → 위로 떠오르며 페이드 아웃 (CSS animation)
- 캐릭터 등장: 슬라이드 인 또는 페이드 인
- 선택 후 결과: 약간의 딜레이 후 나레이터 코멘트 표시
- 챕터 전환: 화면 전체 페이드 → 챕터 타이틀 → 페이드 인

**이 단계 완료 기준**: 효과음과 애니메이션이 자연스럽게 작동. 음소거 토글 정상 작동.

---

### 5단계: 결과 카드 + SNS 공유 + 마무리

**목표**: 바이럴 필수 요소 완성

**작업 내용**:

**A) 결과 카드 (`share.js`)**
- Canvas API로 결과 카드 이미지 생성 (픽셀아트 스타일)
- 카드 포함 내용:
  - 게임 타이틀: "Fund Me If You Can"
  - 서브타이틀: "실패하면 사기, 성공하면 비전"
  - 캐릭터 스프라이트 (플레이한 루트)
  - 엔딩명 + 결과 문구
  - 스탯 바 (픽셀 프로그레스 바 스타일)
  - 풍자 명언 (랜덤)
  - "나도 도전하기" URL
  - "이 게임은 픽션입니다" 디스클레이머
- 카드 크기: 1080x1920 (인스타 스토리) 또는 1200x630 (링크드인/X)

**B) SNS 공유 버튼**
- 카카오톡 공유 (Kakao JS SDK)
- 링크드인 공유 (URL share)
- X(트위터) 공유 (intent URL + 텍스트)
- 이미지 다운로드 버튼
- 링크 복사 버튼

**C) 크로스 프로모션**
- Founder 엔딩 후: "투자자는 당신을 어떻게 봤을까? → VC 루트 도전하기" 버튼
- VC 엔딩 후: "창업자에게도 사정이 있었다면? → Founder 루트 도전하기" 버튼
- 엔딩 카드 하단: "한국 스타트업 버전도 있습니다 → VC Simulator" 링크 (URL: /tools/vc-simulator/)

**D) OG 메타태그**
- og:title: "Fund Me If You Can - 실패하면 사기, 성공하면 비전"
- og:description: "실리콘밸리 최대 논란 AI 스타트업의 실화 기반 RPG. 창업자 또는 VC 시점을 선택해 플레이하세요."
- og:image: og-image.png (결과 카드 디자인 기반으로 정적 이미지)
- og:url: https://yoongjae.com/tools/fund-me/

**E) 디스클레이머**
- 타이틀 화면 하단에 항상 표시: "이 게임은 픽션이며, 실제 인물/기업/사건과 무관합니다"
- 결과 카드에도 작은 글씨로 포함
- 폰트 크기 작게, 회색 텍스트

**F) 다국어 준비 (구조만)**
- 모든 UI 텍스트를 별도 객체로 분리 (예: `const UI_TEXT = { ko: {...}, en: {...} }`)
- 시나리오 데이터는 현재 한국어만. 영어 키는 빈 상태로 준비
- 타이틀 화면에 언어 선택 버튼 자리 마련 (현재는 한국어 고정)

**이 단계 완료 기준**: 결과 카드 생성/다운로드/공유 정상 작동. OG 메타태그 설정 완료. 디스클레이머 표시.

---

## 최종 체크리스트

### 기능
- [ ] 타이틀 화면 (게임명 + 역할 선택 + 디스클레이머)
- [ ] Founder 루트 5챕터 전체 플레이 가능
- [ ] VC 루트 5챕터 전체 플레이 가능
- [ ] 엔딩 10개 모두 도달 가능
- [ ] 이전 선택 → 이후 이벤트 분기 정상 작동 (flags)
- [ ] 스탯 0 도달 시 게임오버 정상 작동
- [ ] 결과 카드 이미지 생성 작동
- [ ] SNS 공유 버튼 작동
- [ ] 양쪽 루트 교차 유도 ("VC 루트 도전하기" 등)
- [ ] 크로스 프로모션 링크 (기존 VC Simulator)
- [ ] 음소거 토글

### 픽셀아트
- [ ] 캐릭터 스프라이트 9종 + 표정 변화
- [ ] 배경 10종
- [ ] 포켓몬스터 스타일 대화창
- [ ] 픽셀 스탯 바
- [ ] 픽셀 스타일 결과 카드
- [ ] 8bit 효과음 7종

### 품질
- [ ] 모바일 반응형 (iPhone SE ~ iPhone 15 Pro Max)
- [ ] 타이핑 효과 정상 (클릭 시 스킵 가능)
- [ ] 스탯 변화 애니메이션 정상
- [ ] 챕터 전환 트랜지션 정상
- [ ] OG 메타태그 설정
- [ ] 디스클레이머 표시 (타이틀 + 결과 카드)
- [ ] 외부 의존성 최소 (CDN은 Google Fonts 정도만)
- [ ] `public/tools/fund-me/` 경로에서 standalone 작동 확인

---

## 참고 사항

### 기존 VC Simulator 참고
- 경로: 같은 repo의 `public/tools/vc-simulator/`
- 참고할 것: 엔진 구조(상태 관리, flags), UI 패턴(타이핑 효과, 스탯 바), 공유 기능
- 직접 import 하지 말 것. 독립적으로 새로 작성

### PRD 문서
- 이 지시서와 함께 제공되는 `fund-me-if-you-can-prd.md`에 전체 시나리오, 스탯 밸런스, 엔딩 조건, 풍자 명언, 캐릭터 매핑 등 모든 게임 디자인 내용이 있음
- 시나리오 텍스트(나레이터 코멘트, 대사, 선택지)는 PRD 원문을 그대로 사용할 것
- 특히 나레이터의 시니컬한 톤과 블랙 유머를 유지하는 것이 중요

### 스프라이트 생성 팁
- 64x64 캐릭터는 JS 2D 배열로 색상 데이터를 정의하고 Canvas에 그리는 방식 권장
- 예시:
```javascript
const ROI_KIM_DEFAULT = [
  // 64x64 grid, 각 셀은 hex 색상 코드 또는 투명(null)
  [null, null, '#1a1a2e', '#1a1a2e', ...],
  // ...
];

function drawSprite(ctx, spriteData, x, y, scale) {
  const pixelSize = scale;
  spriteData.forEach((row, ry) => {
    row.forEach((color, rx) => {
      if (color) {
        ctx.fillStyle = color;
        ctx.fillRect(x + rx * pixelSize, y + ry * pixelSize, pixelSize, pixelSize);
      }
    });
  });
}
```
- 배경은 더 큰 Canvas(320x180)에 그린 후 CSS로 화면에 맞게 확대
- `image-rendering: pixelated` CSS 필수

### 성능
- 픽셀아트를 매 프레임 다시 그리지 말 것. 한 번 그린 후 캐시
- 배경은 챕터 전환 시에만 다시 그림
- 캐릭터 표정 변화는 미리 렌더링해둔 Canvas를 교체하는 방식
- 전체 JS 파일 크기는 가볍게 유지 (모바일 로딩 속도 중요)
