// NutriLive 레시피 카드 생성기 — 사진 없이 브랜드 지면 스타일로 요리마다 1080×1080 카드 이미지를 만든다.
// 용도: 네이버 블로그 대표이미지 / SNS(인스타 등) 공유 이미지 / 사이트 og:image 대체 소재
//
// 실행 (Playwright는 이 작업환경에 전역 설치돼 있음 — 새 환경이면 `npm i -D playwright && npx playwright install chromium`):
//   NODE_PATH=/opt/node22/lib/node_modules node scripts/gen-recipe-cards.mjs
//   node scripts/gen-recipe-cards.mjs --only="들깨 미역국"   // 특정 레시피만 재생성
//
// CI 배포 파이프라인에는 포함하지 않는다 (Playwright/브라우저 설치 비용) — 레시피 추가/수정 시
// CTO 세션이 수동으로 실행해 assets/cards/*.png를 갱신·커밋한다 (docs/CONTENT_ROUTINE.md 참고).

import { chromium } from 'playwright';
import { readFileSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';

const ORN_SMALL = {
  '밥·면': `<path d="M10 22 h28 a14 9 0 0 1 -28 0 z"/><path d="M14 22 a10 6 0 0 1 20 0" stroke-width="1.4"/><path d="M20 34 h8" stroke-width="1.4"/><path d="M20 12 q2 -3 0 -6 M28 12 q2 -3 0 -6" opacity=".55"/>`,
  '국물': `<path d="M8 18 h32 a16 11 0 0 1 -32 0 z"/><path d="M18 32 h12" stroke-width="1.4"/><path d="M40 14 l6 -8" stroke-width="1.9"/><ellipse cx="39" cy="15.5" rx="3.4" ry="2.4"/><path d="M18 10 q2 -3 0 -6 M25 10 q2 -3 0 -6" opacity=".55"/>`,
  '반찬': `<path d="M4 24 a7 4.5 0 0 0 14 0 z"/><path d="M17 24 a7 4.5 0 0 0 14 0 z"/><path d="M30 24 a7 4.5 0 0 0 14 0 z"/><path d="M8 19 q3 -3 6 0 M22 18 v-3 m2 3 v-4 m2 4 v-3 M34 19 q3 3 6 0" stroke-width="1.4" opacity=".7"/>`,
  '간식': `<path d="M14 16 h18 v8 a9 9 0 0 1 -18 0 z"/><path d="M32 17 a5 4 0 0 1 0 8" stroke-width="1.4"/><path d="M12 36 h22" stroke-width="1.4"/><path d="M20 10 q2 -3 0 -6 M26 10 q2 -3 0 -6" opacity=".55"/>`
};

// 카드 중앙을 채우는 대형 삽화 — 실사 없이 「일부러 고른 스타일」로 읽히게 하는 핵심 장치.
// 워터마크가 아니라 진짜 콘텐츠 블록으로 배치해 빈 공간을 만들지 않는다.
const ORN_BIG = {
  '밥·면': `<path d="M60 190 h280 a140 90 0 0 1 -280 0 z"/><path d="M90 190 a110 65 0 0 1 220 0" stroke-width="2.6"/><path d="M170 290 h60" stroke-width="2.6"/><path d="M170 110 q16 -24 0 -48 M230 110 q16 -24 0 -48" opacity=".5"/>`,
  '국물': `<path d="M40 160 h320 a160 110 0 0 1 -320 0 z"/><path d="M140 290 h120" stroke-width="2.6"/><path d="M360 120 l55 -70" stroke-width="3.6"/><ellipse cx="353" cy="137" rx="30" ry="21"/><path d="M140 95 q16 -24 0 -48 M210 95 q16 -24 0 -48" opacity=".5"/>`,
  '반찬': `<ellipse cx="100" cy="258" rx="66" ry="21"/><ellipse cx="100" cy="252" rx="44" ry="12" opacity=".5"/><ellipse cx="235" cy="232" rx="82" ry="26"/><ellipse cx="235" cy="225" rx="56" ry="15" opacity=".5"/><ellipse cx="365" cy="258" rx="60" ry="19"/><ellipse cx="365" cy="253" rx="40" ry="11" opacity=".5"/><path d="M320 330 l100 -40 M328 338 l100 -40" stroke-width="2.2"/>`,
  '간식': `<path d="M130 140 h150 v70 a75 68 0 0 1 -150 0 z"/><path d="M280 155 a42 34 0 0 1 0 68" stroke-width="2.6"/><path d="M115 310 h185" stroke-width="2.6"/><path d="M190 108 q16 -24 0 -48 M235 108 q16 -24 0 -48" opacity=".5"/>`
};

const COURSE_SUB = { '밥·면': 'GRAINS & NOODLES', '국물': 'SOUP', '반찬': 'BANCHAN', '간식': 'PETIT PLAISIR' };

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
function naLevel(na) {
  if (na <= 150) return { cls: 'lo', label: '낮음' };
  if (na <= 350) return { cls: 'mid', label: '중간' };
  return { cls: 'hi', label: '높음' };
}
export function slugify(name) {
  return name.replace(/[()[\]「」%↓]/g, '').trim().replace(/[\s_/·,+&~※]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
}

export function cardHTML(r, issue) {
  const lv = naLevel(r.na);
  const whoPct = Math.min(100, Math.round(r.na / 2000 * 100));
  const ingChips = r.ingredients.slice(0, 5).map(i => `<span class="ing">${esc(i[0])}<b>${esc(i[1])}</b></span>`).join('');
  const more = r.ingredients.length > 5 ? `<span class="ing ing--more">외 ${r.ingredients.length - 5}종</span>` : '';

  return `<!DOCTYPE html>
<html lang="ko"><head><meta charset="UTF-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Gowun+Batang:wght@400;700&family=Noto+Sans+KR:wght@400;500;700&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
  :root{
    --paper:#f6f1e7; --ink:#1b201c; --ink-70:rgba(27,32,28,.82); --ink-50:rgba(27,32,28,.72); --ink-35:rgba(27,32,28,.63);
    --rule-mid:rgba(27,32,28,.25); --rule-soft:rgba(27,32,28,.12);
    --accent:#b8441f; --spruce:#31513f; --ok:#55671f; --warn:#8f5e0e;
    --serif:'Gowun Batang',serif; --sans:'Noto Sans KR',sans-serif; --mono:'IBM Plex Mono',monospace;
  }
  *{margin:0;padding:0;box-sizing:border-box;}
  html,body{width:1080px;height:1080px;background:var(--paper);color:var(--ink);font-family:var(--sans);}
  .frame{position:relative;width:1080px;height:1080px;padding:50px 56px 40px;display:flex;flex-direction:column;overflow:hidden;}
  .frame::before{content:'';position:absolute;inset:22px;border:1px solid var(--rule-mid);pointer-events:none;}

  .head{display:flex;justify-content:space-between;align-items:baseline;padding-bottom:18px;border-bottom:1px solid var(--ink);}
  .logo{font-family:var(--serif);font-weight:700;font-size:27px;letter-spacing:.01em;}
  .logo em{font-style:normal;color:var(--accent);}
  .issue{font-family:var(--mono);font-size:14px;color:var(--ink-50);letter-spacing:.08em;}

  .catrow{display:flex;align-items:center;gap:12px;margin-top:26px;}
  .catrow svg{width:38px;height:32px;color:var(--spruce);opacity:.85;flex:none;}
  .catlabel{font-family:var(--mono);font-size:15px;letter-spacing:.2em;color:var(--accent);}
  .catlabel small{display:block;font-size:11px;letter-spacing:.14em;color:var(--ink-35);margin-top:3px;}

  .dish{font-family:var(--serif);font-weight:700;font-size:58px;line-height:1.22;margin-top:16px;word-break:keep-all;max-width:760px;}

  .illust{flex:1;display:flex;align-items:center;justify-content:center;min-height:0;margin-top:20px;}
  .illust svg{width:auto;height:100%;max-height:300px;color:var(--spruce);opacity:.2;}

  .stat{display:flex;align-items:flex-end;gap:30px;margin-top:30px;padding:26px 30px;border:1px solid var(--ink);background:var(--paper);position:relative;}
  .stat__num{font-family:var(--mono);}
  .stat__num small{display:block;font-size:14px;letter-spacing:.16em;color:var(--ink-50);margin-bottom:6px;}
  .stat__num b{font-size:82px;font-weight:500;line-height:1;}
  .stat__num b.lo{color:var(--ok);} .stat__num b.mid{color:var(--warn);} .stat__num b.hi{color:var(--accent);}
  .stat__num i{font-style:normal;font-size:27px;margin-left:5px;color:var(--ink-50);}
  .stat__meta{font-family:var(--mono);font-size:16px;color:var(--ink-70);line-height:1.9;padding-bottom:4px;}
  .stat__bar{position:absolute;left:30px;right:30px;bottom:16px;height:5px;background:var(--rule-soft);}
  .stat__bar i{display:block;height:100%;}
  .stat__bar i.lo{background:var(--ok);} .stat__bar i.mid{background:var(--warn);} .stat__bar i.hi{background:var(--accent);}
  .stat__pct{position:absolute;right:30px;top:26px;font-family:var(--mono);font-size:13px;color:var(--ink-35);}

  .ings{display:flex;flex-wrap:wrap;gap:9px 12px;max-width:760px;}
  .ing{font-family:var(--mono);font-size:15px;color:var(--ink-70);background:rgba(246,241,231,.92);border:1px solid var(--rule-soft);padding:8px 14px;white-space:nowrap;}
  .ing b{font-weight:500;color:var(--spruce);margin-left:7px;}
  .ing--more{color:var(--ink-35);background:none;border-style:dashed;}

  .tip{margin-top:22px;padding-top:22px;border-top:1px dashed var(--rule-mid);}
  .tip__label{font-family:var(--mono);font-size:13px;letter-spacing:.16em;color:var(--accent);margin-bottom:8px;}
  .tip__text{font-family:var(--sans);font-size:20px;line-height:1.6;color:var(--ink-70);max-width:800px;word-break:keep-all;}

  .foot{display:flex;justify-content:space-between;align-items:baseline;margin-top:22px;padding-top:16px;border-top:1px solid var(--ink);}
  .foot__site{font-family:var(--mono);font-size:14px;color:var(--ink-50);}
  .foot__disc{font-family:var(--sans);font-size:12px;color:var(--ink-35);max-width:480px;text-align:right;line-height:1.6;}
</style></head>
<body>
  <div class="frame">
    <div class="head"><div class="logo">Nutri<em>Live</em></div><div class="issue">${esc(issue)}</div></div>
    <div class="catrow">
      <svg viewBox="0 0 48 40" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${ORN_SMALL[r.cat] || ''}</svg>
      <div class="catlabel">${esc(r.cat)}<small>${esc(COURSE_SUB[r.cat] || '')}</small></div>
    </div>
    <h1 class="dish">${esc(r.name)}</h1>
    <div class="stat">
      <div class="stat__num"><small>나트륨 · 1인분당</small><b class="${lv.cls}">${r.na}</b><i>mg</i></div>
      <div class="stat__meta">${r.time}min · ${esc(r.serves || '2인분')}<br>WHO 하루 상한 대비 ${whoPct}%</div>
      <div class="stat__pct">나트륨 ${lv.label}</div>
      <div class="stat__bar"><i class="${lv.cls}" style="width:${whoPct}%"></i></div>
    </div>
    <div class="illust"><svg viewBox="0 0 460 380" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ORN_BIG[r.cat] || ''}</svg></div>
    <div class="ings">${ingChips}${more}</div>
    <div class="tip"><div class="tip__label">셰프의 메모</div><div class="tip__text">${esc(r.tip)}</div></div>
    <div class="foot">
      <div class="foot__site">nutrilive.kr — 싱겁게, 그러나 맛있게</div>
      <div class="foot__disc">수치는 추정 참고치입니다. 개인별 식단은 의사·임상영양사와 상담하세요.</div>
    </div>
  </div>
</body></html>`;
}

// ── 실행부 ──
if (import.meta.url === `file://${process.argv[1]}`) {
  const only = process.argv.find(a => a.startsWith('--only='))?.slice(7);
  const src = readFileSync(new URL('../data/recipes.js', import.meta.url), 'utf8');
  const NUTRI_RECIPES = new Function(src + '; return NUTRI_RECIPES;')();
  const list = only ? NUTRI_RECIPES.filter(r => r.name === only) : NUTRI_RECIPES;

  mkdirSync(new URL('../assets/cards/', import.meta.url), { recursive: true });
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1080, height: 1080 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();

  for (const r of list) {
    const html = cardHTML(r, 'VOL.01 — 2026.08');
    await page.setContent(html, { waitUntil: 'networkidle' });
    await page.waitForTimeout(250);
    const outUrl = new URL(`../assets/cards/${slugify(r.name)}.png`, import.meta.url);
    const outPath = fileURLToPath(outUrl);
    await page.screenshot({ path: outPath });
    console.log('generated:', r.name, '→', outPath.split('/').pop());
  }
  await browser.close();
  console.log(`총 ${list.length}장 생성 완료 — assets/cards/`);
}
