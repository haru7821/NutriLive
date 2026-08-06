# NutriLive — 싱겁게, 그러나 맛있게

신장 건강을 생각하는 사람들을 위한 **저나트륨·저칼륨·저인 식생활 정보 매거진** + 큐레이션 마켓(준비 중).

- **포지셔닝**: 일반 소비자 대상 "저나트륨 라이프스타일" 매체 — 의료·환자용 표현 전면 배제 ([표현 가이드](docs/COMPLIANCE.md) 필수 준수)
- **전략**: Free-first — 전 콘텐츠 무료 + 마켓 "사전 등록"(결제 없음)으로 유료화 수요 검증

## 브랜드 체계 (GM 확정)

| 브랜드 | 적용 범위 | 근거 |
|---|---|---|
| **NutriLive** | 회사·매거진·웹앱 (09/41류) | NUTRILITE 충돌 위험은 식품류에 국한 — 정보 서비스는 경계선 판정. N모노그램 도형상표 우선 출원 |
| **Slowspoon (슬로스푼)** | 식품·마켓 PB (29/30/35류) | 후보 검증 1위(15.5/20) — 맛·염도 기술어 없는 완전 조어라 등록 적격 구조 최상 ([검증 리포트](docs/NAMING_CHECK_EN.md)) |

> 출원 전 수동 확인 필요: KIPRIS "슬로스푼/SLOWSPOON" 검색, slowspoon.kr/.com 도메인, SNS 핸들. 최종 판단은 변리사 자문.

```
├── index.html        # 메인 — 영양소 가이드 / 오늘의 식탁 / 해외 큐레이션 / 마켓 프리뷰
├── tools.html        # [Top 1] 성분 판별기 — Na·K·P 검색 + 내 목표 대비 식탁 계산 (베타)
├── recipes.html      # [Top 2] 레시피북 — 나트륨 수치 표시·필터링
├── market.html       # 저나트륨 마켓 사전 등록 (웨이팅 리스트)
├── data/
│   ├── foods.js      # 식품 성분 참고치 데이터셋 (→ 식약처 공공 DB API 연동 예정)
│   └── recipes.js    # 레시피 데이터
├── css/style.css     # 따뜻한 식탁 에디토리얼 디자인 시스템
├── js/               # main.js(공통) tools.js(판별기) recipes.js(레시피 필터)
└── docs/
    ├── COMPLIANCE.md                    # 표현·규제 준수 가이드라인 (게시 전 검수 기준)
    ├── BUSINESS_MODEL.md                # CFO 유료화 가능성 조사 리포트
    ├── KR_MEAL_DELIVERY_FEASIBILITY.md  # 일본 저염 도시락 모델 한국 적용성 (Stop 판정)
    ├── KIOSK_LEGAL_REVIEW.md            # 병원 키오스크 모델 법률 검토 (No-Go 판정)
    └── WHITESPACE_MODELS.md             # 한국 부재 모델 발굴 → Top 1·2 동시 진행 확정
```

## 핵심 제품 (GM 승인: Top 1·2 동시 진행)

- **성분 판별기** (`tools.html`): 식품 검색 → Na·K·P 100g당 수치 표시 → 「오늘의 식탁」에 담아 **사용자가 직접 설정한 목표** 대비 합산. 칼륨·인은 기본값을 제공하지 않음(개인차·전문가 상담 안내) — 의료행위 비해당 설계
- **레시피북** (`recipes.html`): 전 레시피에 1인분 나트륨 추정치 표기, 종류·나트륨 기준 필터
- 수익화 계획: 두 도구를 월 7,900원 구독 번들로 묶는 것이 Phase 1 상품 (상세: WHITESPACE_MODELS.md)

## 기술 로드맵

| 단계 | 스택 | 목적 |
|------|------|------|
| **Phase 0 (현재)** | 정적 HTML/CSS/JS + GitHub Pages | 비용 ¥0. 무료 콘텐츠 + 사전 등록으로 수요 검증 |
| **Phase 1** | + 뉴스레터 연동(스티비 등) + 영양 계산 도구(JS) | 리드 수집, 재방문 락인 |
| **Phase 2** | Next.js + Supabase + 결제(Stripe/토스페이먼츠) | 검증 통과 시 마켓·프리미엄 콘텐츠 오픈 |

## 콘텐츠 축

1. **영양소 가이드** — 나트륨·칼륨·인·단백질 라벨 읽기와 조리법 (에버그린 SEO)
2. **오늘의 식탁** — 한식 기반 저나트륨 레시피 (주간)
3. **해외 큐레이션** — 미국 NKF, 일본 저염 도시락 시장, 지중해식 등 요약+출처 링크
4. **마켓(준비 중)** — 수치 기준 통과 제품만 큐레이션: 밀키트 / 무첨가 간식 / 대체 양념

## 운영 셋업 (GM 5분 체크리스트)

`js/config.js` 값만 바꾸면 즉시 적용됩니다 (재배포 자동):

1. **리드 수집** — [Formspree](https://formspree.io) 무료 가입 → New Form → 엔드포인트를 `FORM_ENDPOINT`에 입력. *(미설정 시: 방문자 메일 앱이 열려 `FALLBACK_MAILTO`로 신청 메일 발송 — 계정 없이도 수집됨)*
2. **방문 분석** — [GoatCounter](https://www.goatcounter.com) 무료 가입(쿠키 없음, 동의 배너 불필요) → 사이트 코드를 `ANALYTICS_CODE`에 입력
3. **SEO** — 배포 후 [Google Search Console](https://search.google.com/search-console)에 사이트 등록 → `sitemap.xml` 제출

## 운영 원칙

- 모든 문장은 `docs/COMPLIANCE.md` 체크리스트 통과 후 게시
- 모든 페이지에 disclaimer 고정 노출 (정보 제공 목적, 전문가 상담 권고, 일반식품 고지)
