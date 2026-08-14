// NutriLive 식품별 상세 페이지 생성기 (프로그래매틱 SEO)
// 실행: node scripts/build-food-pages.mjs
// 입력: data/foods.js (큐레이션) + data/foods-ext.js (식약처 DB)
// 출력: food/<식품명>.html (전 식품) · food/c-<분류>.html (분류 허브) · food/index.html · sitemap-foods.xml
// 배포 워크플로에서 업로드 직전에 실행되므로 생성물은 저장소에 커밋하지 않는다 (.gitignore 참조).

import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync } from 'fs';

const SITE = 'https://nutrilive.kr';
const CSS_V = readFileSync('tools.html', 'utf8').match(/style\.css\?v=(\d+)/)?.[1] || '14';
const DATA_DATE = '2026-08';

/* ── 데이터 로드 ── */
const curated = new Function(readFileSync('data/foods.js', 'utf8') + '; return NUTRI_FOODS;')();
const ext = new Function('window', readFileSync('data/foods-ext.js', 'utf8') + '; return window.NUTRI_FOODS_EXT;')({});
const seen = new Set(curated.map(f => f.name));
const FOODS = curated.concat(ext.filter(f => !seen.has(f.name)));

/* ── 유틸 ── */
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const fmt = n => Math.round(n).toLocaleString('ko-KR');
const disp = name => name.replace(/_/g, ' ');
function slugify(s) {
  return s.replace(/[()\[\]「」%↓]/g, '').trim()
    .replace(/[\s_/·,+&~※]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
}
const usedSlugs = new Map();
function slug(name) {
  let base = slugify(name) || 'food';
  const n = usedSlugs.get(base) || 0;
  usedSlugs.set(base, n + 1);
  return n === 0 ? base : base + '-' + (n + 1);
}
// 판별기와 동일한 수준 구간
function level(v, kind) {
  if (v == null) return null;
  const t = kind === 'na' ? [120, 500] : kind === 'k' ? [200, 500] : [100, 300];
  return v <= t[0] ? ['낮음', 'lv-low'] : v <= t[1] ? ['중간', 'lv-mid'] : ['높음', 'lv-high'];
}

/* ── 분류별 색인 (나트륨 오름차순 순위·이웃) ── */
const byCat = new Map();
FOODS.forEach(f => {
  if (!byCat.has(f.cat)) byCat.set(f.cat, []);
  byCat.get(f.cat).push(f);
});
byCat.forEach(list => list.sort((a, b) => (a.na ?? 1e9) - (b.na ?? 1e9)));

FOODS.forEach(f => { f.slug = slug(f.name); });
const catSlugs = new Map();
[...byCat.keys()].forEach(c => catSlugs.set(c, 'c-' + slugify(c)));

/* ── 공통 셸 ── */
const nav = `
<nav class="mast" id="nav">
  <a class="mast__logo" href="/">Nutri<em>Live</em></a>
  <p class="mast__issue">VOL.01 — 2026.08</p>
  <button class="mast__toggle" id="navToggle" aria-label="메뉴 열기">☰</button>
  <div class="mast__links" id="navLinks">
    <a href="/tools.html">성분 판별기</a>
    <a href="/recipes.html">레시피북</a>
    <a href="/index.html#global">해외 큐레이션</a>
    <a href="/market.html">마켓</a>
    <a href="/index.html#news">구독</a>
  </div>
</nav>`;
const subcta = `
<aside class="subcta">
  <p class="subcta__label">WEEKLY LETTER</p>
  <p class="subcta__line">매주 화요일, 저염 레시피 한 편과 해외 자료 요약·장보기 팁을 메일로 보내드립니다.</p>
  <a class="btn btn--main arrow" href="/index.html#news" data-track="cta-subscribe">주간 레터 무료 구독</a>
</aside>`;
const footer = `
<footer class="colophon">
  <div class="colophon__grid">
    <div class="colophon__id">
      <a class="mast__logo" href="/">Nutri<em>Live</em></a>
      <p>VOL.01 — 2026.08</p>
      <img class="colophon__seal" src="/assets/seal.png" alt="NL 인장">
    </div>
    <div class="colophon__links">
      <a href="/">홈</a>
      <a href="/tools.html">성분 판별기</a>
      <a href="/food/">식품 성분 카드</a>
      <a href="/privacy.html">개인정보처리방침</a>
    </div>
  </div>
  <p class="colophon__disclaim">
    NutriLive는 일반적인 식생활 정보를 제공하는 매체이며, 의학적 진단·조언·치료를 제공하지 않습니다.
    건강 상태에 따른 식단 조정은 반드시 의사 또는 임상영양사와 상담하세요.
    © 2026 NutriLive.
  </p>
</footer>
<script src="/js/config.js?v=7"></script>
<script src="/js/main.js?v=8"></script>`;

function shell({ title, desc, path, body, ld }) {
  return `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:image" content="${SITE}/assets/og/tools.jpg">
<meta property="og:url" content="${SITE}${path}">
<link rel="canonical" href="${SITE}${path}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Gowun+Batang:wght@400;700&family=IBM+Plex+Mono:wght@400;500&family=Noto+Sans+KR:wght@300;400;500;700&display=swap" rel="stylesheet">
<link rel="icon" type="image/png" href="/assets/favicon-64.png">
<link rel="stylesheet" href="/css/style.css?v=${CSS_V}">
${ld ? `<script type="application/ld+json">${JSON.stringify(ld)}</script>` : ''}
</head>
<body>
${nav}
${body}
${subcta}
${footer}
</body>
</html>`;
}

/* ── 식품 페이지 ── */
rmSync('food', { recursive: true, force: true });
mkdirSync('food', { recursive: true });

const rowsOf = (kind, f) => {
  const v = f[kind];
  const lv = level(v, kind);
  const label = kind === 'na' ? '나트륨 Na' : kind === 'k' ? '칼륨 K' : '인 P';
  if (v == null) return `<tr><td class="ftable__food">${label}</td><td class="ftable__miss">정보 없음</td><td class="ftable__miss">—</td></tr>`;
  return `<tr><td class="ftable__food">${label}</td><td class="${lv[1]}">${fmt(v)} mg</td><td>${lv[0]}</td></tr>`;
};

for (const f of FOODS) {
  const name = disp(f.name);
  const list = byCat.get(f.cat);
  const rank = list.indexOf(f) + 1;
  const naLv = level(f.na, 'na');
  const whoPct = f.na != null ? Math.round(f.na / 2000 * 100) : null;
  const i = list.indexOf(f);
  const neighbors = list.slice(Math.max(0, i - 3), i).concat(list.slice(i + 1, i + 4));

  const desc = `${name} 100g당 나트륨 ${f.na != null ? fmt(f.na) + 'mg' : '정보 없음'}` +
    (f.k != null ? `·칼륨 ${fmt(f.k)}mg` : '') + (f.p != null ? `·인 ${fmt(f.p)}mg` : '') +
    `. ${f.cat} ${list.length}개 중 나트륨이 낮은 순으로 ${rank}번째` +
    (whoPct != null ? `, WHO 하루 상한(2,000mg) 대비 ${whoPct}%` : '') + ' — 참고치.';

  const ld = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: '식품 성분 카드', item: SITE + '/food/' },
      { '@type': 'ListItem', position: 2, name: f.cat, item: SITE + '/food/' + catSlugs.get(f.cat) + '.html' },
      { '@type': 'ListItem', position: 3, name: name }
    ]
  };

  const body = `
<header class="cover cover--tool">
  <p class="label label--accent">FOOD DATA — <a href="/food/${catSlugs.get(f.cat)}.html" style="color:inherit;border-bottom:1px solid currentColor;">${esc(f.cat)}</a></p>
  <h1>${esc(name)}</h1>
  <p class="cover__lede">100g당 ${f.na != null ? `나트륨 <strong>${fmt(f.na)}mg</strong>` : '나트륨 정보 없음'}${f.k != null ? ` · 칼륨 ${fmt(f.k)}mg` : ''}${f.p != null ? ` · 인 ${fmt(f.p)}mg` : ''}
  ${whoPct != null ? `— WHO 하루 나트륨 상한(2,000mg)의 <strong>${whoPct}%</strong>입니다.` : ''}</p>
</header>
<section class="scanner">
  <div class="ftable__wrap">
    <table class="ftable" aria-label="${esc(name)} 성분표">
      <thead><tr><th class="ftable__name">성분 <i>100g당</i></th><th>함량</th><th>수준*</th></tr></thead>
      <tbody>${rowsOf('na', f)}${rowsOf('k', f)}${rowsOf('p', f)}</tbody>
    </table>
    ${f.phosAdd ? '<p class="ftable__hint"><span class="ftable__warn">⚠ 인 첨가물</span> — 이 카테고리 가공식품에는 인산염 계열 첨가물이 흔히 쓰입니다. 제품 원재료명을 확인하세요.</p>' : ''}
  </div>

  <h2 style="font-family:var(--serif);font-size:1.15rem;margin:2.4rem 0 .8rem;">같은 분류(${esc(f.cat)}) 안에서</h2>
  <p style="font-size:.92rem;color:var(--ink-70);">${esc(f.cat)} ${list.length}개 중 나트륨이 낮은 순으로 <strong>${rank}번째</strong>${naLv ? ` — 100g당 기준 「${naLv[0]}」 구간` : ''}입니다.</p>
  ${neighbors.length ? `<ul style="list-style:none;margin:.8rem 0 0;display:flex;flex-wrap:wrap;gap:.4rem 1.4rem;">
    ${neighbors.map(n => `<li><a href="/food/${n.slug}.html" style="color:var(--spruce);border-bottom:1px solid var(--spruce);font-size:.92rem;">${esc(disp(n.name))}</a> <span style="font-family:var(--mono);font-size:.8rem;color:var(--ink-35);">Na ${n.na != null ? fmt(n.na) : '—'}</span></li>`).join('')}
  </ul>` : ''}

  ${f.na != null ? `<h2 style="font-family:var(--serif);font-size:1.15rem;margin:2.4rem 0 .8rem;">먹는 양으로 환산하면</h2>
  <ul style="list-style:none;font-family:var(--mono);font-size:.92rem;display:flex;gap:1.8rem;flex-wrap:wrap;">
    <li>50g → <strong>${fmt(f.na / 2)}mg</strong></li>
    <li>100g → <strong>${fmt(f.na)}mg</strong></li>
    <li>200g → <strong>${fmt(f.na * 2)}mg</strong></li>
  </ul>` : ''}

  <p style="margin-top:2.2rem;"><a class="btn arrow" href="/tools.html?q=${encodeURIComponent(name)}" data-track="food-to-tools">판별기에서 「오늘의 식탁」에 담아 계산</a></p>

  <p class="sec__note">
    * 수준 구간은 100g당 함량의 상대적 높낮이(일반적 라벨 읽기 관행 기준)입니다.
    수치는 ${DATA_DATE} 기준 식약처 식품영양성분DB·자체 큐레이션 <strong>참고치</strong>이며 실제 제품·조리 상태에 따라 다릅니다.
    본 정보는 일반적인 정보 제공 목적이며, 질환의 진단·관리 수단이 아닙니다. 개인별 식단은 의사·임상영양사와 상담하세요.
  </p>
</section>`;

  writeFileSync(`food/${f.slug}.html`, shell({
    title: `${name} 나트륨·칼륨·인 함량 — NutriLive`,
    desc, path: `/food/${f.slug}.html`, body, ld
  }));
}

/* ── 분류 허브 ── */
for (const [cat, list] of byCat) {
  const cs = catSlugs.get(cat);
  const body = `
<header class="cover cover--tool">
  <p class="label label--accent"><a href="/food/" style="color:inherit;border-bottom:1px solid currentColor;">FOOD DATA</a> — 분류</p>
  <h1>${esc(cat)}</h1>
  <p class="cover__lede">${esc(cat)} ${list.length}개 식품의 100g당 나트륨 함량 — 낮은 순서대로 정리했습니다.</p>
</header>
<section class="scanner">
  <div class="ftable__wrap">
    <table class="ftable" aria-label="${esc(cat)} 나트륨 목록">
      <thead><tr><th class="ftable__name">식품 <i>100g당</i></th><th>나트륨 mg</th></tr></thead>
      <tbody>
        ${list.map(f => {
          const lv = level(f.na, 'na');
          return `<tr><td class="ftable__food"><a href="/food/${f.slug}.html">${esc(disp(f.name))}</a></td><td class="${lv ? lv[1] : 'ftable__miss'}">${f.na != null ? fmt(f.na) : '—'}</td></tr>`;
        }).join('\n        ')}
      </tbody>
    </table>
  </div>
  <p class="sec__note">수치는 ${DATA_DATE} 기준 참고치입니다. 식품명을 누르면 칼륨·인 포함 상세 카드를 볼 수 있어요.</p>
</section>`;
  writeFileSync(`food/${cs}.html`, shell({
    title: `${cat} 나트륨 낮은 순 목록 (${list.length}종) — NutriLive`,
    desc: `${cat} ${list.length}개 식품의 100g당 나트륨 함량을 낮은 순으로 정리한 목록. 각 식품의 칼륨·인 상세 카드로 연결됩니다.`,
    path: `/food/${cs}.html`, body
  }));
}

/* ── 허브 인덱스 ── */
const cats = [...byCat.entries()].sort((a, b) => b[1].length - a[1].length);
const hubBody = `
<header class="cover cover--tool">
  <p class="label label--accent">FOOD DATA</p>
  <h1>식품 성분 카드</h1>
  <p class="cover__lede">식약처 식품영양성분DB와 자체 큐레이션을 합친 ${fmt(FOODS.length)}개 식품의
  100g당 나트륨·칼륨·인 카드입니다. 분류를 고르거나 <a href="/tools.html" style="color:var(--spruce);border-bottom:1px solid var(--spruce);">판별기</a>에서 검색하세요.</p>
</header>
<section class="scanner">
  <div class="ftable__wrap">
    <table class="ftable" aria-label="분류 목록">
      <thead><tr><th class="ftable__name">분류</th><th>식품 수</th><th>나트륨 최저</th></tr></thead>
      <tbody>
        ${cats.map(([cat, list]) => `<tr><td class="ftable__food"><a href="/food/${catSlugs.get(cat)}.html">${esc(cat)}</a></td><td>${list.length}</td><td class="lv-low">${disp(list[0].name).slice(0, 22)} (${list[0].na != null ? fmt(list[0].na) : '—'})</td></tr>`).join('\n        ')}
      </tbody>
    </table>
  </div>
  <p class="sec__note">수치는 ${DATA_DATE} 기준 참고치이며, 매월 초 식약처 DB 갱신을 반영합니다.</p>
</section>`;
writeFileSync('food/index.html', shell({
  title: `식품 성분 카드 — 나트륨·칼륨·인 ${fmt(FOODS.length)}종 — NutriLive`,
  desc: `식약처 DB 기반 ${fmt(FOODS.length)}개 식품의 100g당 나트륨·칼륨·인 참고치 카드. 분류별 나트륨 낮은 순 목록 제공.`,
  path: '/food/', body: hubBody
}));

/* ── sitemap-foods.xml ── */
const today = new Date().toISOString().slice(0, 10);
const urls = [`${SITE}/food/`]
  .concat([...catSlugs.values()].map(cs => `${SITE}/food/${cs}.html`))
  .concat(FOODS.map(f => `${SITE}/food/${f.slug}.html`));
writeFileSync('sitemap-foods.xml',
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  urls.map(u => `  <url><loc>${u}</loc><lastmod>${today}</lastmod></url>`).join('\n') + '\n</urlset>\n');

console.log(`생성 완료: 식품 ${FOODS.length} + 분류 허브 ${byCat.size} + 인덱스 1 · sitemap ${urls.length} URL`);
