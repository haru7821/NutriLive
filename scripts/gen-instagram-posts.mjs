// NutriLive 인스타그램 캡션 자동 생성기
// 대표이미지는 assets/cards/<슬러그>.png(조리 단계 전문 포함)를 그대로 업로드 — 캡션은 훅+저장 유도+해시태그만 담당.
// 자동 업로드는 미구현(Meta 계정 연동 필요, docs/CONTENT_ROUTINE.md 참고) — GM이 이미지+캡션을 수동으로 복사·게시.
//
// 실행: node scripts/gen-instagram-posts.mjs            (이번 달 공개분 전체)
//       node scripts/gen-instagram-posts.mjs --only="들깨 미역국"
// 출력: instagram/drafts/<슬러그>.txt

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

// 코스별 보조 해시태그 — 카테고리 특성에 맞춰 검색 유입 폭을 넓힌다.
const CAT_TAGS = {
  '밥·면': ['#집밥스타그램', '#원팟요리', '#자취요리'],
  '국물':  ['#국물요리', '#홈메이드국', '#해장국'],
  '반찬':  ['#밑반찬', '#집밥반찬', '#반찬추천'],
  '간식':  ['#건강간식', '#다이어트간식', '#홈메이드간식'],
};
const COMMON_TAGS = ['#저염식', '#저나트륨', '#저염레시피', '#건강식단', '#집밥레시피', '#나트륨관리', '#NutriLive'];

function hashtags(r) {
  const nameTag = '#' + r.name.replace(/\s+/g, '');
  const catTags = CAT_TAGS[r.cat] || [];
  const set = [...new Set([nameTag, ...COMMON_TAGS, ...catTags, `#나트륨${r.na}mg`])];
  return set.slice(0, 15).join(' ');
}

function caption(r) {
  const shop = linksFor(r);
  const pct = whoPct(r.na);
  const lines = [];

  // 훅 — 인스타 캡션은 첫 125자 전후에서 "더 보기"로 잘리므로 수치를 맨 앞에 배치
  lines.push(`${r.name} 🧂 1인분 나트륨 ${r.na}mg — WHO 하루 상한의 ${pct}%예요.`);
  lines.push('');
  lines.push(r.desc);
  lines.push('');
  lines.push(`셰프의 메모 — ${r.tip}`);
  lines.push('');
  lines.push('📌 조리법 전체는 이미지 안에 담았어요. 저장해두고 이번 주에 만들어보세요.');
  lines.push('더 많은 저염 레시피는 프로필 링크(nutrilive.kr)에서 무료로 볼 수 있어요.');

  if (shop.length) {
    lines.push('');
    lines.push('🛒 이 레시피에 쓰인 재료는 사이트 레시피북 「장보기 메모」에서 확인하세요.');
    lines.push('(광고) 이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.');
  }

  lines.push('');
  lines.push('※ 수치는 추정 참고치이며, 개인별 식단 조정은 의사·임상영양사와 상담하세요.');
  lines.push('');
  lines.push('.');
  lines.push('.');
  lines.push('.');
  lines.push(hashtags(r));

  return lines.join('\n');
}

const only = process.argv.find(a => a.startsWith('--only='))?.slice(7);
const CUR = nowMon();
const list = (only ? NUTRI_RECIPES.filter(r => r.name === only) : NUTRI_RECIPES)
  .filter(r => only || (r.mon || FIRST_MON) <= CUR); // --only는 예약 발행분도 미리 뽑을 수 있게 예외

mkdirSync(new URL('../instagram/drafts/', import.meta.url), { recursive: true });
list.forEach(r => {
  const out = new URL(`../instagram/drafts/${slugify(r.name)}.txt`, import.meta.url);
  writeFileSync(out, caption(r), 'utf8');
  console.log('caption:', r.name);
});
console.log(`총 ${list.length}편 — instagram/drafts/`);
