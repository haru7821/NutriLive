# 한국 미존재(Whitespace) 비즈니스 모델 발굴 리포트 — 신장 건강/저나트륨·저칼륨·저인 식생활

- 작성: CFO
- 작성일: 2026-08-05
- 수신: General Manager
- 상태: 내부 검토용 초안 (v1.0)
- 선행 문서: `docs/BUSINESS_MODEL.md`, `docs/KR_MEAL_DELIVERY_FEASIBILITY.md`, `docs/COMPLIANCE.md`
- GM 지시: "한국에 이미 있는 모델(저염 택배 도시락 등)은 중단. 한국에 아직 존재하지 않는 모델을 찾아라."

> ⚠️ 본 문서는 내부 시장 분석 전용이다. 문서 내 질환 관련 언급(CKD·투석·환자 등)은 해외 사례·규제 분석을 위한 것으로, NutriLive의 대외 커뮤니케이션·상품·광고·SEO 메타태그·해시태그에는 일절 사용하지 않는다 (`COMPLIANCE.md` 금칙어 체계 적용).
> ⚠️ 별도 출처 표기가 없는 재무·전환율 수치는 전부 **내부 추정치**다.

---

## 0. 요약 (Executive Summary)

- 7개 후보군을 웹 검색으로 실존·사업 구조·한국 부재 여부까지 검증한 결과, **진짜 화이트스페이스는 "식품·외식 데이터를 신장 건강 관점(나트륨·칼륨·인·인산염 첨가물)으로 재가공한 소프트웨어/정보 레이어"**다. 하드웨어(염도계)·정부 인증(실천음식점)·저단백밥(햇반)·저염 전문몰(맛있저염)은 이미 한국에 존재하거나 부분 존재하여 탈락 또는 축소 채택했다.
- **Top 1: "성분 스캐너 + 3축(나트륨·칼륨·인) 식품 판별 웹앱"** — 미국에 KidneyPal·KidneyDiet·DecideDiet 등 검증된 카테고리가 존재하나, 한국에는 상업 서비스가 없다(대한신장학회 무료 앱 '하이디'가 유일 유사 사례이며 기록 계산기 성격). 식약처 공공 DB로 원가가 거의 0이고, 기존 로드맵 §2.6(계산 도구)의 확장판이라 1인 실행성이 가장 높다.
- **Top 2: "질환 대응 레시피·식단 DB 구독 플랫폼(일본 おいしい健康 모델의 저나트륨 특화 축소판)"** — 일본에서 월 780엔 구독으로 성립이 검증된 모델이며 한국에 상업 서비스 부재. 기존 §2.1 콘텐츠 구독의 가격·구조 가설을 해외 실증 사례로 뒷받침한다.
- 두 모델은 별개 사업이 아니라 **하나의 구독 상품(도구+콘텐츠)으로 번들**하는 것이 정답이며, 기존 BUSINESS_MODEL.md의 Phase 1 유료 구독 설계를 대체하는 것이 아니라 **그 구독의 "무엇을 파는가"를 화이트스페이스 검증 결과로 확정**하는 의미다. 90일 실행 계획을 §4에 제시한다.
- 탈락 처리: 외식 민간 인증(정부 인증 존재), 가정용 염도계(제품 존재), 소변 자가측정 키트+앱(체외진단의료기기·SaMD 인허가 — 1인 기업 불가), 원격 코칭(한국 부재는 맞으나 규제·운영 부담으로 보류 유지), 저단백 주식(부분 부재이나 시장 협소·특수식품 분류 리스크로 관찰 대상).

---

## 1. 모델별 상세 분석

### 모델 1. 신장 배려 성분 스캐너 앱 — 바코드/검색으로 나트륨·칼륨·인·인산염 첨가물 판별

**해외 실존 사례 (검증됨)**

| 서비스 | 국가 | 구조 | 가격 | 출처 |
|---|---|---|---|---|
| **KidneyPal** | 미국 | 바코드·사진·음성 입력 → AI가 사용자 한도 대비 "kidney safety score" 산출. **라벨에 없는 인산염 첨가물까지 판별** 소구. CKD 단계별 개인화 | 구독형(정확 가격 미공개 — 추정) | [kidneypal.app](https://kidneypal.app/) |
| **KidneyDiet** | 미국 | 바코드 스캐너 + 인·수분·GI까지 포함한 식품 DB, 3P(인·칼륨·단백질) 한도 설정·추적 | 2주 무료 후 구독 (가격 비공개) | [kidneydiet.com](https://www.kidneydiet.com/), [App Store](https://apps.apple.com/us/app/kidneydiet/id373471282) |
| **DecideDiet** | 미국 | UConn 의대 신장내과 교수 개발. 바코드 스캔 → 나트륨·칼륨 기준 **신호등(녹/황/적) 등급** | 무료 (연구 기반) | [UConn Today](https://today.uconn.edu/2020/10/uconn-health-researcher-designs-app-help-heart-kidney-disease-patients-manage-diet/), [App Store](https://apps.apple.com/us/app/decidediet/id1407454779) |
| (참고) Yuka | 프랑스/미국 | 일반 식품 스캐너의 원형. renal 특화 버전은 아님 — 특화 버전은 위 3개가 담당 | 프리미엄 연 £10 수준 | — |

- 배경 근거: 인산염 첨가물은 초가공식품에 광범위하게 쓰이지만 **함량이 라벨에 표기되지 않는 경우가 많아** 스캐너+첨가물 사전 방식의 판별 가치가 크다는 것이 학계에서도 지적됨 ([PMC 논문](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12783045/)).

**한국 부재 검증: 부재 (유사물 있음, 대체재 아님)**
- **하이디(Hi·D)** — 대한신장학회가 만든 무료 앱. 칼로리·단백질·나트륨·칼륨·인 계산 + 교육자료 130건. **학회 공익 앱으로 바코드 스캔·첨가물 판별·시판 가공식품 DB 큐레이션 기능이 아니라 수기 기록 계산기 성격이며, 상업 서비스가 아님** ([메디포뉴스](https://www.medifonews.com/news/article.html?no=157345), [k-health](https://www.k-health.com/news/articleView.html?idxno=51475)).
- **엄선·안심** — 첨가물 스캐너는 존재하나 육아·케미포비아 방향의 **일반 첨가물 등급 서비스**로, 나트륨·칼륨·인 3축 판별·한도 추적 기능 없음 ([서울경제](https://m.sedaily.com/amparticle/11956045)).
- **내손안·푸드QR(식약처)** — 유통기한·회수 정보 중심 공공 서비스 ([YTN](https://www.ytn.co.kr/_ln/0103_202111081030203879), [푸드QR](https://portal.foodqr.kr/)).
- 결론: "신장 관점 3축 + 인산염 첨가물"으로 시판 식품을 판별해주는 상업 서비스는 **한국에 없음. 부재 확실성 높음.**

**1인 실행 가능성: 높음**
- 데이터: 식약처 식품영양성분 DB·식품안전나라 제품 DB(공공, 무료) + 원재료명 텍스트에서 인산염류 첨가물(제이인산나트륨, 폴리인산나트륨, 메타인산나트륨 등) 사전 매칭 — 크롤링·정제 작업이 본체. 웹앱(PWA)으로 앱스토어 수수료 30% 회피(기존 §2.6 방침 유지).
- 초기 투자: 개발 외주 없이 자체 개발 시 현금 지출 월 10만 원 내외(서버·DB) — 추정. 바코드 스캔은 웹 기반 라이브러리로 구현 가능.
- 한계: 칼륨·인은 표시 의무 영양성분이 아니라 **DB 공백이 큼** → 공백은 "미표기(제조사 미공개)"로 정직하게 노출하고, 인산염 "첨가물 포함 여부"(원재료명 기반 사실)로 보완. 이 정직한 공백 표시 자체가 신뢰 자산이 된다.

**규제 적합성: 설계로 대응 가능 (COMPLIANCE.md 원칙 정합)**
- 판별 기준을 "질환자 권장량"이 아닌 **① 공인 일반 기준(WHO 나트륨 2,000mg/일 등) ② 사용자 직접 입력 목표치**의 2원 체계로만 제공 — 기존 §2.6의 책임 이전 설계 그대로.
- 신호등 등급은 "나트륨 함량이 사용자 설정 목표의 ○%" 같은 **산술 표시**로 하고, "신장에 안전" 류 표현 금지. KidneyPal의 "kidney safety score" 명칭은 **한국에서 그대로 쓰면 안 되는 사례**로 기록해둔다.
- 질병 단계별 프리셋(CKD 3기용 등) 제공 금지 — 이것이 해외 앱과의 의도적 차별점이자 안전선.

**수익 모델·시너지**
- 단독 판매가 아니라 기존 §2.1 콘텐츠 구독(월 7,900원)의 **리텐션 엔진 + 유료 전환 트리거**로 통합. 스캔 결과 화면 → 대체 상품 추천(어필리에이트) → 커머스 퍼널로 자연 연결.
- 뉴스레터·마켓 사전등록 자산과의 시너지: "이번 주 스캔 최다 식품 TOP 10 성분 분석" 같은 콘텐츠 자동 생성 소재.

---

### 모델 2. 검사수치·목표치 기반 식품 필터링 도구 (모델 1의 개인화 확장)

**해외 실존 사례**: KidneyPal(단계별 한도 개인화), RenalTracker(수치 추적 + 행동 변화), KidneyDiet(3P 한도 설정) — 모두 모델 1 표와 동일 출처. 해외에서는 "검사수치 입력 → 권장 한도 자동 산출"까지 나아간다.

**한국 부재 검증**: 부재 (하이디가 검사결과 기록 기능을 갖고 있으나 무료 학회 앱 — 위와 동일).

**규제 경계선 분석 (핵심)**
- "eGFR·혈중 칼륨 수치를 입력하면 앱이 권장 섭취량을 산출"하는 순간, 개인별 진단·처방으로 해석될 여지(의료법)와 의료기기 소프트웨어(SaMD) 해당성 시비가 생긴다. **이 선을 넘지 않는다.**
- 허용 형태: 사용자가 **전문가와 상담해 정한 목표치를 직접 입력**하면, 그 목표치 대비 식품을 필터링·정렬만 해주는 "필터 도구". 수치 해석·산출 로직을 우리가 제공하지 않는 것이 안전선 (기존 §2.6 설계와 동일).
- 결론: **모델 1에 흡수 통합**하고 별도 사업으로 취급하지 않는다. "검사수치 해석"은 영구 금지 기능 목록에 등재.

---

### 모델 3. 질환 대응 레시피·식단 DB 구독 플랫폼 (일본 おいしい健康 모델)

**해외 실존 사례**

| 서비스 | 국가 | 구조 | 가격 | 출처 |
|---|---|---|---|---|
| **おいしい健康 (Oishi Kenko)** | 일본 | 관리영양사 감수 레시피 약 1만 품, 80+ 건강 고민(CKD 포함) 대응 식단·헌립 제안. 보험사(三井住友海上あいおい生命)·제약 유통(스즈켄)과 B2B 제휴 | **월 780엔** 멤버십, 30일 무료 | [서비스 소개](https://oishi-kenko.com/service_description), [MSA생명 제휴](https://www.msa-life.co.jp/lineup/oishii/), [스즈켄](https://www.suzuken.co.jp/product/digitalservice/dg-service07/) |
| **Renal Diet HQ** | 미국 | 임상영양사 1인이 운영하는 renal 식단표 구독 (장보기 리스트 포함) | **월 $19.99** | [renaldiethq.com](https://www.renaldiethq.com/order-a-renal-diet-meal-plan/pre-dialysis-diet-meal-plan/) |
| **Plant-Powered Kidneys** | 미국 | 영양사 팀의 CKD 식단 멤버십 + 아마존 큐레이션(어필리에이트) 병행 | **월 $29** | [멤버십](https://www.plantpoweredkidneys.com/ckd-meal-planning-membership/), [Amazon 큐레이션](https://www.amazon.com/shop/plant.powered.kidneys/list/25GSY9Z4TBI7Q) |

- 주목점: Renal Diet HQ·Plant-Powered Kidneys는 **영양 전문가 1~2인이 콘텐츠 구독 + 어필리에이트로 운영하는 초소형 사업**이다. NutriLive가 설계한 구조(§2.1+§2.2)가 미국에서 이미 소규모로 성립하고 있다는 실증.

**한국 부재 검증: 부재**
- 한국의 신장 식생활 정보는 병원(서울아산·삼성서울)·학회(대한신장학회 e-book)·질병관리청의 **무료 공공 자료**뿐, 유료 구독형 상업 플랫폼은 검색상 확인되지 않음 (2026-08 검색 기준). 그리팅·디자인밀은 식품 판매이지 정보 구독이 아니다.
- 단, 무료 공공 자료의 품질이 높으므로 **"정보 그 자체"가 아니라 "매주 실행 가능한 형태(식단표+장보기 리스트+시판품 대입)"로 가공하는 것**이 지불 이유가 되어야 한다 — 일본·미국 사례 공통 교훈.

**1인 실행 가능성: 높음** — 기존 §2.1 그대로. 도구(모델 1)와 번들 시 이탈률 방어.

**규제 적합성**: 식단표 명칭·소구는 "저나트륨 식단표(나트륨 ○mg/일 설계)" 수치 소구만. おいしい健康처럼 질환명 카테고리를 전면에 거는 것은 **일본에서는 가능하지만 한국 포지셔닝에선 금지** — 우리는 "영양소 조절" 명명법(KR_MEAL_DELIVERY_FEASIBILITY §3.4)을 유지한다.

**수익 모델·시너지**: 월 7,900원 구독의 본체. おいしい健康의 B2B 제휴(보험사 부가서비스)는 장기적으로 한국 보험사 헬스케어 부가서비스 제휴라는 **추가 수익 경로 힌트** (기존 리포트에 없던 신규 발견).

---

### 모델 4. 저단백 주식(主食) 특수식품 — 일본 低たんぱく米/저단백 면 시장

**해외 실존 사례**
- **일본**: 亀田製菓 「ゆめごはん」 — 유산균 발효로 단백질을 일반 밥의 1/40로 조정한 즉석밥. 180g×30개 7,452엔(약 248엔/개), 인·칼륨도 저감 ([亀田製菓](https://www.kamedaseika.co.jp/research/yumegohan/), [라쿠텐 시세](https://item.rakuten.co.jp/b-style-msc/c/0000000109/)). 저단백 쌀·면·빵을 모아 파는 **전문몰(ビースタイル 등)이 별도 유통업태로 성립** ([b-style](https://www.b-style-msc.com/SHOP/197957/197970/list.html)).
- **유럽/미국**: Dr. Schär **FLAVIS** — 저단백 파스타·빵·스낵 라인(단백질·인·나트륨·칼륨 동시 저감 설계), 미국 신장재단(NKF)과 공식 제휴 ([FLAVIS](https://www.flavis.com/en), [NKF 제휴](https://www.kidney.org/press-room/flavis-and-nkf-team-to-promote-kidney-health-through-diet)).

**한국 부재 검증: 부분 존재 — 시장으로는 부재**
- **햇반 저단백밥이 존재한다** (CJ제일제당, 개당 2,000원 이하). 단, 16년째 원가가 일반 햇반의 2배 이상인 **적자 사회공헌 사업**으로 유지되며, 주 타깃은 선천성대사이상(PKU) 희귀질환자(질병관리청 구매지원체계 존재) ([국민일보](https://www.kmib.co.kr/article/view.asp?arcid=0029186641), [메디팜헬스](https://www.medipharmhealth.co.kr/news/article.html?no=116932)).
- 저단백 면·빵·전문몰 등 **"시장"과 "유통 레이어"는 부재**. 일본은 시장이 성립했지만 한국은 대기업이 적자로 1개 SKU를 유지하는 수준 — 이것은 "화이트스페이스"라기보다 **"수요 밀도가 시장을 못 만든 공백"일 가능성**을 시사한다.

**1인 실행 가능성: 낮음~중**
- 제조는 불가(발효·효소 처리 특수 공정). 남는 경로는 ① FLAVIS 등 수입 유통(수입식품등 수입판매업 신고), ② 정보·큐레이션.
- 수입 유통의 문제: FLAVIS는 자국에서 "medical food"로 포지셔닝된 제품 — 한국에서 일반식품으로 수입해 팔더라도 우리가 쓰는 광고 문구에서 저단백의 "용도"를 설명하는 순간 특수의료용도식품 표방·질환 소구 리스크에 정면으로 부딪힌다. "단백질 ○g(일반 제품 대비 1/○)" 수치 소구만으로 판매가 성립할지는 미검증.

**판정: 보류(관찰 대상).** 지금은 "저단백 주식 제품 국내외 비교" **콘텐츠 소재**로만 활용하고, 수입 유통은 모델 1·3으로 확보한 오디언스에서 수요 신호(검색·문의)가 확인될 때 재검토.

---

### 모델 5. 외식 저나트륨 가이드/인증 — 미국 AHA Heart-Check·Healthy Dining 모델

**해외 실존 사례**
- **AHA Heart-Check Meal Certification**: 식당 메뉴 단위 인증(한 끼 나트륨 960mg 이하 등 기준), 인증 마크 라이선스 수수료 모델 ([AHA 기준](https://www.heart.org/en/healthy-living/company-collaboration/heart-check-certification/heart-check-in-the-grocery-store/heart-check-food-certification-program-nutrition-requirements)).
- **HealthyDiningFinder**: 영양사가 검증한 체인 메뉴 DB + "Sodium Savvy"(메인 750mg 이하) 필터. 식당이 등재 비용을 내는 B2B 모델 ([healthydiningfinder.com](https://www.healthydiningfinder.com/this-site-2/)).

**한국 부재 검증: 있음 — 인증 모델 탈락**
- 식약처·지자체의 **"나트륨 줄이기 실천음식점"이 2015년부터 운영 중, 1,084개소+** (1인분 나트륨 1,300mg 미만 메뉴 등 기준) ([정책브리핑](https://www.korea.kr/briefing/policyBriefingView.do?newsId=148895149), [식품음료신문](https://www.thinkfood.co.kr/news/articleView.html?idxno=91941)). 정부가 무료로 하는 인증을 민간 유료 인증으로 이길 수 없다. **솔직 판정: 있음 — 탈락.**
- 남는 공백: 실천음식점 정보가 식약처 포털 깊숙이 묻혀 있어 **소비자용 발견 레이어(지도·검색·리뷰)가 사실상 없다**. 또한 프랜차이즈 메뉴별 나트륨·칼륨 수치를 신장 관점으로 정리한 DB도 없다.

**판정: 인증 사업은 탈락, "외식 메뉴 나트륨 DB + 실천음식점 지도"는 모델 1·3 구독의 부가 기능으로 축소 채택.** (기존 §2.1의 "외식 체인별 저나트륨 주문 가이드"와 동일 — 화이트스페이스 검증으로 그 가치가 재확인된 셈.)
- 규제 유의: 영양성분 수치는 프랜차이즈 공식 공개 자료만 인용·출처 표기(자체 실측 주장 금지 — 기존 §5.2 원칙).

---

### 모델 6. 가정용 자가측정 — ① 소변 검사 키트+앱, ② 염도계

**① 소변 검사 키트 + 앱 (Healthy.io 모델)**
- 해외 실존: **Healthy.io "Minuteful Kidney"** — 스마트폰 카메라로 소변 ACR을 판독하는 **FDA 510(k) 클리어 의료기기**. 소비자 직판이 아니라 보험사·의료기관에 파는 B2B2C 모델(검사 미이행자 관리로 보험사 ROI 창출), NKF와 무료 배포 제휴 ([FDA 클리어런스](https://www.prnewswire.com/news-releases/healthyio-receives-landmark-fda-clearance-for-first-and-only-smartphone-powered-home-kidney-test-301584531.html), [NKF 제휴](https://www.prnewswire.com/news-releases/the-national-kidney-foundation-and-healthyio-partner-to-increase-access-to-testing-for-detection-of-kidney-disease-301765343.html)).
- 한국 부재 검증: 앱 연동 소비자 서비스는 부재. 단순 딥스틱 소변검사 키트는 4,000원대부터 시판 중 ([쿠차 검색](http://www.coocha.co.kr/search/searchDealList?keyword=%EC%86%8C%EB%B3%80%EA%B2%80%EC%82%AC%ED%82%A4%ED%8A%B8)).
- **판정: 탈락.** 이유: (a) 검사 결과를 앱이 해석하는 순간 체외진단의료기기/의료기기 소프트웨어(SaMD) 인허가 영역 — Healthy.io도 FDA 클리어에 수년·수천만 달러를 썼다($50M+ 조달, [MobiHealthNews](https://www.mobihealthnews.com/news/healthyio-raises-50m-expand-smartphone-kidney-test-us)). (b) 키트 유통만 해도 의료기기판매업 신고 + 광고 사전심의 영역으로, "일반식품/정보 제공" 포지셔닝(COMPLIANCE.md)과 정면 충돌. (c) 1인 기업 자본으로 불가.

**② 가정용 염도계 (일본 타니타 塩分計 모델)**
- 해외 실존: 타니타 「しおみくん SO-303」 — 국물 염분 농도를 6단계 LED로 표시하는 가정용 염분계, 3,000엔 전후 ([타니타](https://www.tanita.co.jp/product/saltchecker/3856/)). 일본 저염 전문몰의 스테디셀러.
- 한국 부재 검증: **있음 — 탈락.** 웰센스·카스 등 가정용 염도계가 다나와·이마트몰 등에서 다수 판매 중 ([다나와](https://search.danawa.com/dsearch.php?query=%EC%97%BC%EB%8F%84+%EC%B8%A1%EC%A0%95%EA%B8%B0)). 다만 대부분 김치 담그기 용도로 소비되고 "국물 저염 관리" 맥락의 마케팅은 없다.
- 축소 채택: 염도계는 **어필리에이트 콘텐츠 소재**("집 국물 염도 측정 4주 챌린지" 등)로 활용 — 재고 없이 기존 Phase 1 수익 라인에 얹는다.

**③ (파생 아이디어) 나트륨 섭취 추적 하드웨어 구독** — 검색 결과 소비자용으로 성립한 해외 사례를 확인하지 못함. 실존 검증 실패로 후보 제외.

---

### 모델 7. 원격 영양 코칭 구독 (RenalTracker 모델)

**해외 실존 사례**
- **RenalTracker** (미국): 12주 행동 변화 프로그램 **$37~47** + 1:1 헬스코치, KidneyX(미 보건부·신장학회) 수상으로 신뢰 확보 ([KidneyX](https://www.kidneyx.org/prize-winners/renal-tracker/), [코스 페이지](https://blog.renaltracker.com/prco37/)).
- **일본**: CHONPS(관리영양사 온라인 식사지도: 기록 피드백+면담+채팅, [chonps.jp](https://chonps.jp/)), リカバル(의료기관용 온라인 영양지도 종량제, [m3 제휴](https://m3comlp.m3.com/lp/sapplym/recoval)) 등 원격 영양지도 서비스군 실존.

**한국 부재 검증: 부재 (질환·저염 특화 기준)**
- 한국의 코칭류는 눔·필라이즈 등 다이어트/혈당 방향과 맞춤 영양제 상담(메디코치 등)이 주류. 저나트륨·신장 식생활 특화 유료 코칭 상업 서비스는 검색상 확인되지 않음 (2026-08 기준).

**판정: 부재는 맞으나 순위 하위 — 기존 §2.5 "신중 접근·조건부 보류" 유지.**
- 규제: 질환 전제 1:1 식이 지도는 의료법·영양사 업무범위 경계 문제(기존 분석 그대로). "저나트륨 식생활 코칭" 명명 + 비질환 포지셔닝으로 설계해도, 실제 유입자의 질문이 질환 맥락일 확률이 높아 **운영 중 이탈 통제가 어렵다.**
- 1인 운영: 코치 매칭·CS·품질 관리 부담이 커 콘텐츠·도구 대비 한계효용 낮음.
- RenalTracker에서 가져올 것은 코칭이 아니라 **"12주 프로그램형 상품 구성"** — 사람 없이 이메일 시퀀스로 제공하는 "저나트륨 4주 습관 프로그램"(자동화 코스, 인건비 0)은 모델 3 구독의 온보딩 장치로 채택 가능.

---

### 모델 8. (추가 발굴) 저염·무염 종합 전문몰 + PB (일본 無塩ドットコム 모델)

**해외 실존 사례**
- **無塩ドットコム(무염닷컴)** (일본, 효고현): 일본 최초 감염·무염 **전문 온라인몰**. 타사 제품 400종+ 큐레이션 + 자체 PB "塩ぬき屋"(무염 카레·드레싱 등) + 저염 칼럼·레시피 콘텐츠 결합. 고혈압·신장 관련 정보는 칼럼 영역에 분리 배치 ([회사개요](https://www.muen-genen.com/html/page129.html), [케어뉴스](https://www.care-news.jp/news/mNt0k), [라쿠텐점](https://www.rakuten.co.jp/muen-genen/)).
- 구조적 의미: **"정보 미디어 → 큐레이션 몰 → PB"라는 NutriLive 로드맵과 동일한 경로를 이미 완주한 실존 기업.** 우리 전략의 최종형 레퍼런스.

**한국 부재 검증: 부분 부재**
- **맛있저염 몰(잇마플)**이 저염 전문몰을 표방하나 **자사 제조 식단 중심 D2C** ([shop.microsalts.com](https://shop.microsalts.com/)). 무염닷컴처럼 시판 저염 조미료·가공품을 폭넓게 모은 **중립 큐레이션 종합몰 + 콘텐츠 결합형은 부재** (쿠팡·마켓컬리의 "저염" 검색 결과는 큐레이션이 아니라 검색 필터일 뿐).

**판정: 채택 — 단, 신규 사업이 아니라 기존 Phase 2 큐레이션 커머스·구독 박스의 "완성형 청사진"으로 편입.** 무염닷컴의 시사점 3가지를 기존 계획에 반영: ① 조미료가 앵커 카테고리(재구매 주기 짧고 상온·경량 — 택배비 부담 낮음), ② 재해식·보존식 같은 의외의 인접 카테고리 확장, ③ PB 1호는 조미료(기존 계획의 간식과 함께 검토).

---

## 2. 종합 랭킹

평가: ★=낮음 ~ ★★★★★=높음. "부재 확실성"은 한국에 유사 상업 서비스가 없다는 확신도.

| 순위 | 모델 | 한국 부재 확실성 | 1인 실행성 | 규제 안전성 | 수익성 | 종합 판정 |
|---|---|---|---|---|---|---|
| **1** | 성분 스캐너 + 3축 판별 웹앱 (모델 1+2 통합) | ★★★★☆ (하이디는 무료 학회 계산기) | ★★★★★ (공공 DB, 자체 개발) | ★★★★☆ (사용자 목표 입력 설계 전제) | ★★★★☆ (구독 본체+커머스 퍼널) | **즉시 착수 (90일 계획)** |
| **2** | 레시피·식단 DB 구독 (모델 3) | ★★★★☆ (상업 서비스 미확인) | ★★★★★ | ★★★★☆ (수치 소구·명명법 준수 전제) | ★★★★☆ (월 780엔~$29 해외 실증) | **즉시 착수 — 1과 번들** |
| 3 | 저염 종합 큐레이션 몰 + PB (모델 8) | ★★★☆☆ (맛있저염 몰 부분 중복) | ★★★★☆ (사입 소액) | ★★★☆☆ (상세페이지 문구 책임) | ★★★☆☆ | Phase 2 청사진으로 편입 (G4 게이트 유지) |
| 4 | 외식 메뉴 나트륨 DB·지도 (모델 5 축소판) | ★★★★☆ (발견 레이어 부재) | ★★★★☆ (공개 자료 정리) | ★★★★☆ | ★★☆☆☆ (단독 수익 약함) | 구독 부가 기능으로 채택 |
| 5 | 원격 코칭 구독 (모델 7) | ★★★★☆ | ★★☆☆☆ | ★★☆☆☆ | ★★★☆☆ | 보류 (기존 §2.5 유지) — 자동화 코스만 차용 |
| 6 | 저단백 주식 수입·유통 (모델 4) | ★★★☆☆ (햇반 저단백밥 존재) | ★★☆☆☆ | ★★☆☆☆ (특수식품 표방 리스크) | ★★☆☆☆ (시장 협소 추정) | 관찰 대상 — 콘텐츠 소재로만 |
| 탈락 | 외식 민간 인증 (모델 5 원형) | ☆ (정부 인증 1,084개소 존재) | — | — | — | **있음 — 탈락** |
| 탈락 | 가정용 염도계 (모델 6-②) | ☆ (다수 시판) | — | — | — | **있음 — 탈락** (어필리에이트 소재로만) |
| 탈락 | 소변 키트+앱 (모델 6-①) | ★★★★☆ | ★☆☆☆☆ | ★☆☆☆☆ (의료기기 인허가) | — | **규제 불가 — 탈락** |

**핵심 결론**: Top 1·2는 별개 사업이 아니다. **"스캐너·판별 도구(리텐션) + 주간 식단표·레시피 DB(지불 이유) + 외식 DB(부가)"를 하나의 구독(월 7,900원, 기존 §2.1 가격 유지)으로 묶는 것**이 화이트스페이스 검증의 최종 답이며, 이는 기존 BUSINESS_MODEL.md의 Phase 1 상품 구성을 확정·강화한다. 저염 도시락 등 "이미 있는 모델"은 GM 지시대로 중단하되, 커머스 계열(모델 8)은 구독으로 검증된 오디언스 위에 Phase 2에서 얹는 기존 게이트(G4~G6)를 유지한다.

---

## 3. 규제 공통 원칙 재확인 (COMPLIANCE.md 정합성)

1. **일반 기준 + 사용자 입력의 2원 체계**: 모든 도구의 기준치는 공인 일반 기준(WHO 등) 또는 사용자 직접 입력만. 질환 단계별 프리셋·검사수치 해석 기능은 영구 금지 목록.
2. **명명법**: "신장 안전 점수", "renal 모드" 류 금지. "나트륨·칼륨·인 성분 보기", "목표 대비 ○%"등 산술적 명명만.
3. **금칙어**: 투석·환자·치료·개선·예방·처방 및 질병명 — 앱 UI 문구·스토어 설명·SEO 메타·해시태그 전 구간 적용. 앱스토어 카테고리도 "의료"가 아닌 "음식/라이프스타일"로 등록.
4. **데이터 출처 표기**: 식약처 DB·제조사 공식 표시 기준, 조회일 병기. 칼륨·인 미표기 제품은 "미공개"로 정직 표기(추정치 제공 금지 — 오히려 차별화 요소).
5. **disclaimer**: 전 화면 하단 고정(기존 §5.2 문안). 스캔 결과 화면에는 "개인별 목표는 전문가와 상담해 설정하세요" 추가 병기.

---

## 4. Top 1~2 90일 실행 계획

전제: 기존 Phase 0(뉴스레터·사이트) 병행. 추가 현금 지출 월 15만 원 이내(서버·도구) — 추정.

### D1~D30: 데이터 파운데이션 + 규제 설계 확정
- 식약처 식품영양성분 DB·가공식품 DB 수집·정제 파이프라인 구축 (나트륨·칼륨·인 3축 + 원재료명 텍스트).
- 인산염류 첨가물 사전(제이인산나트륨·폴리인산나트륨·메타인산나트륨 등) 작성 → 원재료명 매칭 룰 검증 (상위 판매 가공식품 500개 수기 검수).
- 금지 기능 목록·UI 문구 가이드 확정 (§3 원칙의 화면 단위 체크리스트화). 외부 표시광고 전문가 1회 사전 감수 (예산 50만 원 내 — 기존 법무 예산에서 충당).
- 뉴스레터에 "가공식품 인산염 첨가물 읽는 법" 시리즈 개시 — 스캐너 수요의 사전 검증 겸 SEO 자산.

### D31~D60: MVP 출시 (무료) + 수요 신호 측정
- 웹앱 MVP: 제품명 검색 + 바코드 스캔 → 3축 성분 + 인산염 첨가물 유무 + 사용자 목표 대비 % 표시. 회원가입 없이 무료 (질환 정보 미수집 원칙 유지).
- 측정 지표: 주간 검색/스캔 수, 재방문율, 뉴스레터 전환율. **Go 기준(제안): 4주차 주간 이용자 500명 또는 뉴스레터 전환 10%+** — 미달 시 도구 단독 소구를 접고 콘텐츠 번들 부속으로 격하.
- 병행: 주간 식단표 포맷 3종 프로토타입(무료 공개 1종 + 유료 예고 2종)으로 사전등록 페이지 개설 — 기존 마켓 사전등록 리스트에 교차 제안.

### D61~D90: 유료 번들 사전판매 (기존 G2 게이트 접속)
- 구독 상품 확정: "도구 무제한 + 주간 식단표·장보기 리스트 + 외식 가이드" 월 7,900원 / 창립 연 59,000원 (기존 가격 정책 유지).
- 사전판매(가격 명시 웨이팅리스트) 전환율 3% 또는 150명 — **기존 G2 게이트 수치를 그대로 이 번들에 적용**해 판정. 미달 시 기존 G2 No-Go 액션(가격 인하 테스트 등) 준용.
- 어필리에이트 연결: 스캔 결과 → 저나트륨 대체 상품 링크(쿠팡파트너스) 소프트 론칭 — "추천"이 아닌 "스펙 비교" 톤, 「광고 포함」 표기.
- 90일 종료 시 GM 보고: MVP 지표 + 사전판매 결과 + Phase 1 본격 유료화 Go/No-Go 판정 자료.

---

## 5. GM 승인 요청 사항

1. Top 1·2 번들 전략(§2 결론) 및 90일 계획(§4) 착수 승인 — 저염 도시락 등 기존 모델 관련 작업(KR_MEAL_DELIVERY_FEASIBILITY의 시나리오 A~B)은 지시대로 중단하되, 문서·게이트 체계는 Phase 2 재검토용으로 보존.
2. 금지 기능 목록(질환 프리셋·검사수치 해석·소변 키트류)의 사규화 — COMPLIANCE.md에 §3 원칙 추가 반영.
3. 모델 4(저단백 주식)·모델 7(코칭)의 "관찰 대상" 분류 승인 — 분기 리뷰 안건에 수요 신호 점검 항목 추가.

---

## 부록: 참고 자료 (Sources)

**스캐너·추적 앱 (미국)**
- [KidneyPal](https://kidneypal.app/), [KidneyDiet 공식](https://www.kidneydiet.com/), [KidneyDiet App Store](https://apps.apple.com/us/app/kidneydiet/id373471282), [DecideDiet — UConn Today](https://today.uconn.edu/2020/10/uconn-health-researcher-designs-app-help-heart-kidney-disease-patients-manage-diet/), [DecideDiet App Store](https://apps.apple.com/us/app/decidediet/id1407454779), [인산염 첨가물과 초가공식품 논문 (PMC)](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12783045/), [DaVita — KidneyDiet 앱 소개](https://davita.com/diet-nutrition/kidney-diet-tips/kidneydiet-app-a-new-tool-to-help-kidney-patients-decide-what-to-eat/)

**코칭·플랫폼**
- [RenalTracker — KidneyX 수상](https://www.kidneyx.org/prize-winners/renal-tracker/), [RenalTracker 12주 코스](https://blog.renaltracker.com/prco37/), [おいしい健康 서비스 소개](https://oishi-kenko.com/service_description), [おいしい健康 × 三井住友海上あいおい生命](https://www.msa-life.co.jp/lineup/oishii/), [스즈켄 제휴](https://www.suzuken.co.jp/product/digitalservice/dg-service07/), [CHONPS](https://chonps.jp/), [リカバル](https://m3comlp.m3.com/lp/sapplym/recoval), [Renal Diet HQ 요금](https://www.renaldiethq.com/order-a-renal-diet-meal-plan/pre-dialysis-diet-meal-plan/), [Plant-Powered Kidneys 멤버십](https://www.plantpoweredkidneys.com/ckd-meal-planning-membership/)

**저단백 특수식품**
- [亀田製菓 ゆめごはん](https://www.kamedaseika.co.jp/research/yumegohan/), [ビースタイル 저단백 주식](https://www.b-style-msc.com/SHOP/197957/197970/list.html), [FLAVIS (Dr. Schär)](https://www.flavis.com/en), [FLAVIS × NKF](https://www.kidney.org/press-room/flavis-and-nkf-team-to-promote-kidney-health-through-diet), [햇반 저단백밥 (국민일보)](https://www.kmib.co.kr/article/view.asp?arcid=0029186641), [저단백밥 구매지원체계 (메디팜헬스)](https://www.medipharmhealth.co.kr/news/article.html?no=116932)

**외식 인증·가이드**
- [AHA Heart-Check 기준](https://www.heart.org/en/healthy-living/company-collaboration/heart-check-certification/heart-check-in-the-grocery-store/heart-check-food-certification-program-nutrition-requirements), [HealthyDiningFinder](https://www.healthydiningfinder.com/this-site-2/), [나트륨 줄이기 실천음식점 (정책브리핑)](https://www.korea.kr/briefing/policyBriefingView.do?newsId=148895149), [실천음식점 577개 추가 (식품음료신문)](https://www.thinkfood.co.kr/news/articleView.html?idxno=91941)

**자가측정**
- [Healthy.io FDA 클리어런스](https://www.prnewswire.com/news-releases/healthyio-receives-landmark-fda-clearance-for-first-and-only-smartphone-powered-home-kidney-test-301584531.html), [Healthy.io × NKF](https://www.prnewswire.com/news-releases/the-national-kidney-foundation-and-healthyio-partner-to-increase-access-to-testing-for-detection-of-kidney-disease-301765343.html), [Healthy.io $50M 조달 (MobiHealthNews)](https://www.mobihealthnews.com/news/healthyio-raises-50m-expand-smartphone-kidney-test-us), [타니타 塩分計 しおみくん](https://www.tanita.co.jp/product/saltchecker/3856/), [한국 염도계 시판 현황 (다나와)](https://search.danawa.com/dsearch.php?query=%EC%97%BC%EB%8F%84+%EC%B8%A1%EC%A0%95%EA%B8%B0), [소변검사키트 시판 (쿠차)](http://www.coocha.co.kr/search/searchDealList?keyword=%EC%86%8C%EB%B3%80%EA%B2%80%EC%82%AC%ED%82%A4%ED%8A%B8)

**저염 전문몰**
- [無塩ドットコム 회사개요](https://www.muen-genen.com/html/page129.html), [무염닷컴 소개 (케어뉴스)](https://www.care-news.jp/news/mNt0k), [무염닷컴 라쿠텐점](https://www.rakuten.co.jp/muen-genen/), [맛있저염 몰](https://shop.microsalts.com/)

**한국 부재 검증**
- [하이디 앱 (메디포뉴스)](https://www.medifonews.com/news/article.html?no=157345), [하이디 앱 (헬스경향)](https://www.k-health.com/news/articleView.html?idxno=51475), [대한신장학회 영양관리 e-book](https://ksn.or.kr/upload/general/ebook/1%EA%B6%8C%20%ED%88%AC%EC%84%9D%20%EC%A0%84%20%EB%8B%A8%EA%B3%84%EC%9D%98%20%EB%A7%8C%EC%84%B1%EC%BD%A9%ED%8C%A5%EB%B3%91%20%ED%99%98%EC%9E%90%EB%A5%BC%20%EC%9C%84%ED%95%9C%20%EC%98%81%EC%96%91-%EC%8B%9D%EC%83%9D%ED%99%9C%20%EA%B4%80%EB%A6%AC.pdf), [엄선 앱 (서울경제)](https://m.sedaily.com/amparticle/11956045), [내손안 바코드 서비스 (YTN)](https://www.ytn.co.kr/_ln/0103_202111081030203879), [푸드QR](https://portal.foodqr.kr/)

> ⚠️ 재차 명기: 본 문서의 질환·검사 관련 서술은 내부 분석 전용이며, 대외 산출물에는 `COMPLIANCE.md`의 금칙어·대체 표현 체계를 적용한다. 해외 서비스 가격은 조사 시점(2026-08-05) 웹 공개 정보 기준이며, 비공개 가격은 "미공개"로 표기했다.
