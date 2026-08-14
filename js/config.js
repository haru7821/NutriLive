// NutriLive 운영 설정 — GM이 값만 바꾸면 즉시 적용됩니다.
window.NUTRI_CONFIG = {
  // ① 뉴스레터/사전등록 수집 엔드포인트
  //    Formspree(무료) 가입 → 폼 생성 → 아래에 "https://formspree.io/f/폼ID" 입력.
  //    스티비 등 다른 서비스의 POST 엔드포인트도 사용 가능.
  //    비워두면: 방문자의 메일 앱이 열려 아래 주소로 신청 메일을 보내는 방식으로 동작(계정 불필요).
  FORM_ENDPOINT: "https://formspree.io/f/mqpzkgjl",
  FALLBACK_MAILTO: "contact@nutrilive.kr",

  // ①-1 주간 레터 구독 — MailerLite 직결 (계정 번호 + 임베드 폼 코드)
  //     두 값이 모두 있으면 「주간 레터 구독」 신청이 MailerLite 구독자 명단에 바로 등록됩니다.
  //     (마켓 사전 등록은 계속 FORM_ENDPOINT로 수집)
  ML_ACCOUNT: "2560306",
  ML_FORM: "195064584173782170",

  // ② 방문 분석 — GoatCounter(무료, 쿠키 없음) 가입 후 사이트 코드 입력.
  //    예: 코드가 "nutrilive"면 대시보드는 https://nutrilive.goatcounter.com
  ANALYTICS_CODE: "nutrilive",

  // ③ 어필리에이트(쿠팡파트너스) — 파트너스에서 발급한 상품 링크를 아래에 넣으면
  //    레시피북 하단에 「장보기 메모」 박스가 나타납니다. 비워두면 박스 자체가 숨겨집니다.
  //    ⚠️ label/note에는 성분·규격·용도만 — 효능 표현(COMPLIANCE.md) 금지.
  //    예: { label: "들깻가루 300g", note: "무첨가 제품인지 원재료명 확인", url: "https://link.coupang.com/a/XXXX" },
  AFFILIATE_LINKS: [
    { label: "들깻가루", note: "무첨가·국산 여부는 원재료명 확인", url: "https://coupa.ng/coLtxQ" },
    { label: "무염버터", note: "「무염(unsalted)」 표기 확인", url: "https://coupa.ng/coLtKw" },
    { label: "무첨가 땅콩버터", note: "원재료가 땅콩 100%인지 확인", url: "https://coupa.ng/coLtVS" },
    { label: "계량스푼 세트", note: "간장 1작은술(5ml) 계량 — 저염 조리의 기본 도구", url: "https://coupa.ng/coLt25" }
  ]
};
