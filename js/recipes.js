// NutriLive 레시피북 필터
(function () {
  if (typeof NUTRI_RECIPES === 'undefined') return;

  var catChips = document.getElementById('catChips');
  var naChips = document.getElementById('naChips');
  var grid = document.getElementById('recipeGrid');

  var cats = ['전체', '밥·면', '국물', '반찬', '간식'];
  var naFilters = [
    { label: '나트륨 전체', max: Infinity },
    { label: '100mg 이하', max: 100 },
    { label: '300mg 이하', max: 300 }
  ];
  var activeCat = '전체';
  var activeNa = naFilters[0];

  function makeChips(el, items, getLabel, onPick) {
    items.forEach(function (item, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'chip' + (i === 0 ? ' on' : '');
      b.textContent = getLabel(item);
      b.addEventListener('click', function () {
        el.querySelectorAll('.chip').forEach(function (x) { x.classList.remove('on'); });
        b.classList.add('on');
        onPick(item);
        render();
      });
      el.appendChild(b);
    });
  }

  makeChips(catChips, cats, function (c) { return c; }, function (c) { activeCat = c; });
  makeChips(naChips, naFilters, function (f) { return f.label; }, function (f) { activeNa = f; });

  function render() {
    grid.innerHTML = '';
    var shown = NUTRI_RECIPES.filter(function (r) {
      return (activeCat === '전체' || r.cat === activeCat) && r.na <= activeNa.max;
    });
    shown.forEach(function (r) {
      var a = document.createElement('article');
      a.className = 'recipe';
      a.innerHTML =
        '<div class="recipe__badge">나트륨 약 ' + r.na + 'mg</div>' +
        '<h3>' + r.name + '</h3>' +
        '<p>' + r.desc + '</p>' +
        '<p class="recipe__tip">💡 ' + r.tip + '</p>' +
        '<span class="recipe__meta">' + r.cat + ' · 1인분 기준 · 조리 ' + r.time + '분</span>';
      grid.appendChild(a);
    });
    if (!shown.length) {
      grid.innerHTML = '<p class="rbook__none">조건에 맞는 레시피가 없어요. 필터를 넓혀보세요.</p>';
    }
  }

  render();
})();
