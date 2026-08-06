// NutriLive 운영 설정 — GM이 값만 바꾸면 즉시 적용됩니다.
window.NUTRI_CONFIG = {
  // ① 뉴스레터/사전등록 수집 엔드포인트
  //    Formspree(무료) 가입 → 폼 생성 → 아래에 "https://formspree.io/f/폼ID" 입력.
  //    스티비 등 다른 서비스의 POST 엔드포인트도 사용 가능.
  //    비워두면: 방문자의 메일 앱이 열려 아래 주소로 신청 메일을 보내는 방식으로 동작(계정 불필요).
  FORM_ENDPOINT: "",
  FALLBACK_MAILTO: "haru7821@gmail.com",

  // ② 방문 분석 — GoatCounter(무료, 쿠키 없음) 가입 후 사이트 코드 입력.
  //    예: 코드가 "nutrilive"면 대시보드는 https://nutrilive.goatcounter.com
  ANALYTICS_CODE: ""
};
