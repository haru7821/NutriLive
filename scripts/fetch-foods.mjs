// 식약처 식품영양성분 DB → data/foods-ext.js 생성 스크립트
// 실행: MFDS_API_KEY=발급키 node scripts/fetch-foods.mjs
// 키 발급: 공공데이터포털(data.go.kr) → "식품의약품안전처_식품영양성분DB정보" 활용신청
//
// 주의: 포털 API의 응답 필드명은 서비스 버전에 따라 다릅니다.
// 첫 실행 시 아래 로그로 실제 필드명을 확인하고 FIELD_MAP만 조정하면 됩니다.

import { writeFileSync } from 'fs';

const KEY = process.env.MFDS_API_KEY;
if (!KEY) {
  console.error('MFDS_API_KEY 환경변수가 없습니다. 공공데이터포털에서 키 발급 후 설정하세요.');
  process.exit(1);
}

// ── 조정 지점 ────────────────────────────────────────────
const ENDPOINT = 'https://apis.data.go.kr/1471000/FoodNtrCpntDbInfo02/getFoodNtrCpntDbInq02';
const FIELD_MAP = {
  name: 'FOOD_NM_KR',   // 식품명
  na:   'AMT_NUM13',    // 나트륨(mg/100g)
  k:    'AMT_NUM6',     // 칼륨(mg/100g)
  p:    'AMT_NUM5',     // 인(mg/100g)
  cat:  'FOOD_CAT1_NM'  // 대분류
};
const MAX_ITEMS = 3000;   // 사이트 용량 보호 (약 300KB)
const PAGE_SIZE = 100;
// ────────────────────────────────────────────────────────

// 포털이 주는 키는 Encoding/Decoding 두 형태 — 이미 %인코딩된 키는 그대로 쓴다 (이중 인코딩 방지)
const keyParam = /%[0-9A-Fa-f]{2}/.test(KEY) ? KEY : encodeURIComponent(KEY);

const num = v => { const n = parseFloat(v); return isFinite(n) ? Math.round(n * 10) / 10 : null; };
const out = [];
let firstLogged = false;

for (let page = 1; out.length < MAX_ITEMS; page++) {
  const url = `${ENDPOINT}?serviceKey=${keyParam}&pageNo=${page}&numOfRows=${PAGE_SIZE}&type=json`;
  const res = await fetch(url);
  if (!res.ok) { console.error('HTTP', res.status, await res.text().then(t => t.slice(0, 300))); break; }
  const json = await res.json().catch(async e => { console.error('JSON 파싱 실패:', (await res.text()).slice(0, 300)); return null; });
  if (!json) break;
  const items = json?.body?.items ?? json?.response?.body?.items?.item ?? [];
  if (!items.length) break;

  if (!firstLogged) {
    console.log('── 첫 항목 필드 목록 (FIELD_MAP 검증용) ──');
    console.log(Object.keys(items[0]).join(', '));
    firstLogged = true;
  }

  for (const it of items) {
    const na = num(it[FIELD_MAP.na]), k = num(it[FIELD_MAP.k]), p = num(it[FIELD_MAP.p]);
    const name = (it[FIELD_MAP.name] || '').trim();
    if (!name || na === null) continue; // 나트륨은 필수, 칼륨·인은 없으면 생략(사이트에서 — 표시)
    const row = { name, cat: (it[FIELD_MAP.cat] || 'DB').trim(), na };
    if (k !== null) row.k = k;
    if (p !== null) row.p = p;
    out.push(row);
    if (out.length >= MAX_ITEMS) break;
  }
  console.log(`page ${page}: 누적 ${out.length}건`);
}

if (!out.length) { console.error('수집 0건 — FIELD_MAP/ENDPOINT를 점검하세요.'); process.exit(1); }
const full = out.filter(r => r.k !== undefined && r.p !== undefined).length;
console.log(`3축 완전 ${full}건 / 나트륨만 ${out.length - full}건`);

const banner = `// 자동 생성 파일 — scripts/fetch-foods.mjs (${new Date().toISOString().slice(0,10)})\n// 출처: 식약처 식품영양성분DB (공공데이터포털) · 100g당 참고치\n`;
writeFileSync('data/foods-ext.js', banner + 'window.NUTRI_FOODS_EXT = ' + JSON.stringify(out) + ';\n');
console.log(`완료: data/foods-ext.js — ${out.length}건`);
