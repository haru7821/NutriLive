// NutriLive 차림표 — 코스식 메뉴 렌더링
(function () {
  if (typeof NUTRI_RECIPES === 'undefined') return;

  var naChips = document.getElementById('naChips');
  var grid = document.getElementById('recipeGrid');

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
    var any = false;
    COURSES.forEach(function (course) {
      var items = NUTRI_RECIPES.filter(function (r) {
        return r.cat === course.cat && r.na <= activeNa.max;
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
        d.innerHTML =
          '<h3>' + r.name + '</h3>' +
          '<p class="dish__na">Na ' + r.na + ' mg — ' + r.time + ' min</p>' +
          '<p class="dish__desc">' + r.desc + '</p>' +
          '<p class="dish__tip">셰프의 메모 — ' + r.tip + '</p>';
        sec.appendChild(d);
      });
      grid.appendChild(sec);
    });
    if (!any) {
      grid.innerHTML = '<p class="rbook__none">조건에 맞는 요리가 없어요. 기준을 넓혀보세요.</p>';
    }
  }

  render();
})();
