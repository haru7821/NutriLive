// NutriLive 네이버 블로그 발행용 초안 생성기
// 레시피 카드 이미지(assets/cards/)는 「표지」일 뿐 — 조리 단계 전문(全文)은 여기서 텍스트로 채운다.
// 카드 = 대표이미지, 이 스크립트 결과물 = 본문. 네이버 에디터에 그대로 복사·붙여넣기 하면 된다.
//
// 실행: node scripts/gen-naver-posts.mjs            (이번 달 공개분 전체)
//       node scripts/gen-naver-posts.mjs --only="들깨 미역국"
// 출력: naver/drafts/<슬러그>.txt

import { readFileSync, mkdirSync, writeFileSync } from 'fs';
import { slugify } from './gen-recipe-cards.mjs';

const src = readFileSync(new URL('../data/recipes.js', import.meta.url), 'utf8');
const NUTRI_RECIPES = new Function(src + '; return NUTRI_RECIPES;')();

const cfgSrc = readFileSync(new URL('../js/config.js', import.meta.url), 'utf8');
const fakeWindow = {};
new Function('window', cfgSrc)(fakeWindow);
const AFFILIATE_LINKS = fakeWindow.NUTRI_CONFIG?.AFFILIATE_LINKS || [];

const FIRST_MON = '2026-08';
function nowMon() {
  const d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
}
function linksFor(r) {
  if (!r.ingredients) return [];
  return AFFILIATE_LINKS.filter(l =>
    (l.match || []).some(kw => r.ingredients.some(ing => ing[0].includes(kw)))
  );
}
function whoPct(na) { return Math.min(100, Math.round(na / 2000 * 100)); }

function draft(r) {
  const slug = slugify(r.name);
  const shop = linksFor(r);
  const lines = [];

  lines.push(`[제목] ${r.name} — 나트륨 ${r.na}mg 저나트륨 레시피 | NutriLive`);
  lines.push('');
  lines.push(`※ 대표이미지: assets/cards/${slug}.png 를 네이버 에디터에 업로드하세요.`);
  lines.push('─'.repeat(40));
  lines.push('');
  lines.push(r.desc);
  lines.push('');
  lines.push(`나트륨 1인분당 ${r.na}mg — WHO 하루 나트륨 권장 상한(2,000mg)의 ${whoPct(r.na)}%입니다. (추정 참고치)`);
  lines.push('');
  lines.push(`재료 (${r.serves || '2인분'})`);
  r.ingredients.forEach(i => lines.push(`- ${i[0]} ${i[1]}`));
  lines.push('');
  lines.push('만드는 법');
  r.steps.forEach((s, i) => lines.push(`${i + 1}. ${s}`));
  lines.push('');
  lines.push('셰프의 메모');
  lines.push(r.tip);
  if (r.naNote) {
    lines.push('');
    lines.push('나트륨 계산 메모');
    lines.push(r.naNote);
  }
  if (shop.length) {
    lines.push('');
    lines.push('장보기 (광고 포함)');
    lines.push('이 글에는 쿠팡 파트너스 활동으로 일정액의 수수료를 제공받을 수 있는 링크가 포함됩니다.');
    shop.forEach(l => lines.push(`- ${l.label}: ${l.url}`));
  }
  lines.push('');
  lines.push('더 많은 저나트륨 레시피는 nutrilive.kr/recipes.html 에서 확인하세요.');
  lines.push('※ 본 정보는 일반적인 식생활 정보 제공 목적이며, 의학적 진단·조언·치료 수단이 아닙니다.');
  lines.push('개인별 식단은 의사·임상영양사와 상담해 조정하세요.');
  lines.push('');
  lines.push(`추천 태그: #저나트륨 #저염식단 #${r.name.replace(/\s+/g, '')} #나트륨${r.na}mg #NutriLive`);

  return lines.join('\n');
}

const only = process.argv.find(a => a.startsWith('--only='))?.slice(7);
const CUR = nowMon();
const list = (only ? NUTRI_RECIPES.filter(r => r.name === only) : NUTRI_RECIPES)
  .filter(r => only || (r.mon || FIRST_MON) <= CUR); // --only는 예약 발행분도 미리 뽑을 수 있게 예외

mkdirSync(new URL('../naver/drafts/', import.meta.url), { recursive: true });
list.forEach(r => {
  const out = new URL(`../naver/drafts/${slugify(r.name)}.txt`, import.meta.url);
  writeFileSync(out, draft(r), 'utf8');
  console.log('draft:', r.name);
});
console.log(`총 ${list.length}편 — naver/drafts/`);
