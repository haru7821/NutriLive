// NutriLive 차림표 — 코스식 메뉴 렌더링
(function () {
  if (typeof NUTRI_RECIPES === 'undefined') return;

  var naChips = document.getElementById('naChips');
  var volChips = document.getElementById('volChips');
  var carteDate = document.getElementById('carteDate');
  var grid = document.getElementById('recipeGrid');

  /* ── 월간 호(號) — 발행월 기준 아카이브 ──
     mon(YYYY-MM)이 이번 달보다 미래인 레시피는 숨김(예약 발행).
     지난 달들은 「지난 호」로 언제든 꺼내 볼 수 있다. */
  var FIRST_MON = '2026-08'; // 창간호
  function nowMon() {
    var d = new Date();
    return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2);
  }
  // 미리보기: recipes.html?mon=2026-10 처럼 열면 그 시점 화면을 확인할 수 있다 (운영 점검용)
  var previewMon = new URLSearchParams(location.search).get('mon');
  var CUR = previewMon || nowMon();
  function volNo(mon) { // 창간호부터의 월 차이로 호수 계산
    var a = mon.split('-'), b = FIRST_MON.split('-');
    return (a[0] - b[0]) * 12 + (a[1] - b[1]) + 1;
  }
  function volLabel(mon) {
    return 'VOL.' + ('0' + volNo(mon)).slice(-2) + ' · ' + mon.replace('-', '.');
  }
  var mons = [];
  NUTRI_RECIPES.forEach(function (r) {
    var m = r.mon || FIRST_MON;
    if (m <= CUR && mons.indexOf(m) === -1) mons.push(m);
  });
  mons.sort();
  var activeMon = mons[mons.length - 1]; // 최신 호가 기본

  if (mons.length > 1) { // 지난 호가 있을 때만 호 선택 칩 노출
    mons.slice().reverse().forEach(function (m, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'chip' + (m === activeMon ? ' on' : '');
      b.textContent = (i === 0 ? '이번 호 — ' : '지난 호 — ') + volLabel(m);
      b.addEventListener('click', function () {
        volChips.querySelectorAll('.chip').forEach(function (x) { x.classList.remove('on'); });
        b.classList.add('on');
        activeMon = m;
        render();
      });
      volChips.appendChild(b);
    });
  }

  // 코스머리 먹선 일러스트 (장식용 — aria-hidden)
  var SVG_OPEN = '<svg viewBox="0 0 48 40" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">';
  var ORN = {
    '밥·면': SVG_OPEN +
      '<path d="M10 22 h28 a14 9 0 0 1 -28 0 z"/>' +          // 밥공기
      '<path d="M14 22 a10 6 0 0 1 20 0" stroke-width="1.4"/>' + // 소복한 밥
      '<path d="M20 34 h8" stroke-width="1.4"/>' +               // 굽
      '<path d="M20 12 q2 -3 0 -6 M28 12 q2 -3 0 -6" opacity=".55"/>' + // 김
      '</svg>',
    '국물': SVG_OPEN +
      '<path d="M8 18 h32 a16 11 0 0 1 -32 0 z"/>' +            // 국그릇
      '<path d="M18 32 h12" stroke-width="1.4"/>' +
      '<path d="M40 14 l6 -8" stroke-width="1.9"/>' +           // 숟가락
      '<ellipse cx="39" cy="15.5" rx="3.4" ry="2.4"/>' +
      '<path d="M18 10 q2 -3 0 -6 M25 10 q2 -3 0 -6" opacity=".55"/>' +
      '</svg>',
    '반찬': SVG_OPEN +
      '<path d="M4 24 a7 4.5 0 0 0 14 0 z"/>' +                 // 종지 셋
      '<path d="M17 24 a7 4.5 0 0 0 14 0 z"/>' +
      '<path d="M30 24 a7 4.5 0 0 0 14 0 z"/>' +
      '<path d="M8 19 q3 -3 6 0 M22 18 v-3 m2 3 v-4 m2 4 v-3 M34 19 q3 3 6 0" stroke-width="1.4" opacity=".7"/>' +
      '</svg>',
    '간식': SVG_OPEN +
      '<path d="M14 16 h18 v8 a9 9 0 0 1 -18 0 z"/>' +          // 찻잔
      '<path d="M32 17 a5 4 0 0 1 0 8" stroke-width="1.4"/>' +
      '<path d="M12 36 h22" stroke-width="1.4"/>' +              // 받침
      '<path d="M20 10 q2 -3 0 -6 M26 10 q2 -3 0 -6" opacity=".55"/>' +
      '</svg>'
  };

  // 코스 순서: 파인다이닝 흐름을 따른다
  var COURSES = [
    { cat: '밥·면', title: '첫 술', sub: 'GRAINS & NOODLES' },
    { cat: '국물', title: '따뜻한 국물', sub: 'SOUP' },
    { cat: '반찬', title: '곁들임', sub: 'BANCHAN' },
    { cat: '간식', title: '마무리', sub: 'PETIT PLAISIR' }
  ];
  var naFilters = [
    { label: '전체', max: Infinity },
    { label: 'Na 100mg 이하', max: 100 },
    { label: 'Na 300mg 이하', max: 300 }
  ];
  var activeNa = naFilters[0];

  naFilters.forEach(function (f, i) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'chip' + (i === 0 ? ' on' : '');
    b.textContent = f.label;
    b.addEventListener('click', function () {
      naChips.querySelectorAll('.chip').forEach(function (x) { x.classList.remove('on'); });
      b.classList.add('on');
      activeNa = f;
      render();
    });
    naChips.appendChild(b);
  });

  function render() {
    grid.innerHTML = '';
    if (carteDate) carteDate.textContent = volLabel(activeMon);
    var any = false;
    COURSES.forEach(function (course) {
      var items = NUTRI_RECIPES.filter(function (r) {
        return (r.mon || FIRST_MON) === activeMon &&
               r.cat === course.cat && r.na <= activeNa.max;
      });
      if (!items.length) return;
      any = true;

      var sec = document.createElement('section');
      sec.className = 'course';
      sec.innerHTML =
        '<header class="course__head">' +
          '<span class="course__orn course__orn--illust">' + (ORN[course.cat] || '◆') + '</span>' +
          '<h2>' + course.title + '</h2>' +
          '<p>' + course.sub + '</p>' +
        '</header>';
      items.forEach(function (r) {
        var d = document.createElement('article');
        d.className = 'dish';
        var detail = '';
        if (r.steps && r.ingredients) {
          detail =
            '<button type="button" class="dish__open">레시피 펼치기 ▾</button>' +
            '<div class="dish__detail" hidden>' +
              '<h4>재료 — ' + (r.serves || '2인분') + '</h4>' +
              '<div class="dish__ing">' + r.ingredients.map(function (i) {
                return '<span>' + i[0] + '<b>' + i[1] + '</b></span>';
              }).join('') + '</div>' +
              '<h4>만드는 법</h4>' +
              '<ol>' + r.steps.map(function (s) { return '<li>' + s + '</li>'; }).join('') + '</ol>' +
              (r.naNote ? '<div class="dish__point"><b>나트륨 계산 — </b>' + r.naNote + '</div>' : '') +
            '</div>';
        }
        d.innerHTML =
          '<h3>' + r.name + '</h3>' +
          '<p class="dish__na">Na ' + r.na + ' mg — ' + r.time + ' min' + (r.serves ? ' · ' + r.serves : '') + '</p>' +
          '<p class="dish__desc">' + r.desc + '</p>' +
          '<p class="dish__tip">셰프의 메모 — ' + r.tip + '</p>' +
          detail;
        var btn = d.querySelector('.dish__open');
        if (btn) {
          btn.addEventListener('click', function () {
            var dt = d.querySelector('.dish__detail');
            dt.hidden = !dt.hidden;
            btn.textContent = dt.hidden ? '레시피 펼치기 ▾' : '레시피 접기 ▴';
          });
        }
        sec.appendChild(d);
      });
      grid.appendChild(sec);
    });
    if (!any) {
      grid.innerHTML = '<p class="rbook__none">조건에 맞는 요리가 없어요. 기준을 넓혀보세요.</p>';
    }
  }

  /* ── 장보기 메모 (어필리에이트) — config.js의 AFFILIATE_LINKS가 비어 있으면 숨김 ── */
  (function () {
    var CFG = window.NUTRI_CONFIG || {};
    var box = document.getElementById('shopBox');
    var links = CFG.AFFILIATE_LINKS || [];
    if (!box || !links.length) return;
    box.hidden = false;
    box.className = 'shopbox';
    box.innerHTML =
      '<h3>장보기 메모 <em>광고 포함</em></h3>' +
      '<ul>' + links.map(function (l) {
        return '<li><a href="' + l.url + '" target="_blank" rel="noopener sponsored" data-track="affiliate-click">' +
          l.label + ' ↗</a>' + (l.note ? '<span>' + l.note + '</span>' : '') + '</li>';
      }).join('') + '</ul>' +
      '<p class="shopbox__disclose">이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다. 제품 선정 기준은 영양성분 표기이며, 실제 성분은 구매 페이지의 원재료명·영양정보를 확인하세요.</p>';
  })();

  /* ── 검색엔진용 구조화 데이터(JSON-LD) — 공개된 레시피 전체, 데이터와 자동 동기화 ── */
  (function () {
    var pub = NUTRI_RECIPES.filter(function (r) { return (r.mon || FIRST_MON) <= CUR; });
    var ld = {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'NutriLive 레시피북',
      itemListElement: pub.map(function (r, i) {
        return {
          '@type': 'ListItem',
          position: i + 1,
          item: {
            '@type': 'Recipe',
            name: r.name,
            description: r.desc,
            recipeCategory: r.cat,
            totalTime: 'PT' + r.time + 'M',
            recipeYield: r.serves || '2인분',
            recipeIngredient: (r.ingredients || []).map(function (p) { return p[0] + ' ' + p[1]; }),
            recipeInstructions: (r.steps || []).map(function (s) { return { '@type': 'HowToStep', text: s }; }),
            nutrition: { '@type': 'NutritionInformation', sodiumContent: r.na + ' mg' },
            author: { '@type': 'Organization', name: 'NutriLive', url: 'https://nutrilive.kr' },
            inLanguage: 'ko'
          }
        };
      })
    };
    var s = document.createElement('script');
    s.type = 'application/ld+json';
    s.textContent = JSON.stringify(ld);
    document.head.appendChild(s);
  })();

  render();
})();
