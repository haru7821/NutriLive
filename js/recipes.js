// NutriLive 차림표 — 코스식 메뉴 렌더링
(function () {
  if (typeof NUTRI_RECIPES === 'undefined') return;

  var naChips = document.getElementById('naChips');
  var grid = document.getElementById('recipeGrid');

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
          '<span class="course__orn">◆</span>' +
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
