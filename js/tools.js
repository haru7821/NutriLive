// NutriLive 성분 판별기 (베타)
(function () {
  if (typeof NUTRI_FOODS === 'undefined') return;
  // 큐레이션 44종 + 식약처 DB 확장분 병합 (중복 이름은 큐레이션 우선)
  var seen = {};
  NUTRI_FOODS.forEach(function (f) { seen[f.name] = true; });
  var FOODS = NUTRI_FOODS.concat((window.NUTRI_FOODS_EXT || []).filter(function (f) {
    return !seen[f.name];
  }));

  var searchEl = document.getElementById('foodSearch');
  var listEl = document.getElementById('foodList');
  var chipsEl = document.getElementById('catChips');
  var trayEl = document.getElementById('tray');
  var trayEmpty = document.getElementById('trayEmpty');
  var sumsEl = document.getElementById('sums');
  var clearBtn = document.getElementById('trayClear');
  var tgNa = document.getElementById('tgNa');
  var tgK = document.getElementById('tgK');
  var tgP = document.getElementById('tgP');

  var activeCat = '전체';
  var tray = []; // {food, grams}

  // 카테고리 칩
  var cats = ['전체'];
  FOODS.forEach(function (f) {
    if (cats.indexOf(f.cat) === -1) cats.push(f.cat);
  });
  cats.forEach(function (c) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'chip' + (c === activeCat ? ' on' : '');
    b.textContent = c;
    b.addEventListener('click', function () {
      activeCat = c;
      chipsEl.querySelectorAll('.chip').forEach(function (x) { x.classList.remove('on'); });
      b.classList.add('on');
      renderList();
    });
    chipsEl.appendChild(b);
  });

  function levelClass(v, kind) {
    // 100g당 함량의 상대적 높낮이 표시 (일반적 라벨 읽기 관행 기준의 단순 구간)
    var t = kind === 'na' ? [120, 500] : kind === 'k' ? [200, 500] : [100, 300];
    return v <= t[0] ? 'lv-low' : v <= t[1] ? 'lv-mid' : 'lv-high';
  }

  function renderList() {
    var q = (searchEl.value || '').trim();
    listEl.innerHTML = '';
    FOODS.filter(function (f) {
      return (activeCat === '전체' || f.cat === activeCat) &&
             (!q || f.name.indexOf(q) !== -1);
    }).forEach(function (f) {
      var li = document.createElement('li');
      li.className = 'food';
      li.innerHTML =
        '<div class="food__head"><strong>' + f.name + '</strong><span>' + f.cat + '</span></div>' +
        '<div class="food__nums">' +
          '<em class="' + levelClass(f.na, 'na') + '">Na ' + f.na + '</em>' +
          '<em class="' + levelClass(f.k, 'k') + '">K ' + f.k + '</em>' +
          '<em class="' + levelClass(f.p, 'p') + '">P ' + f.p + '</em>' +
          '<i>mg/100g</i>' +
        '</div>' +
        (f.phosAdd ? '<div class="food__warn">⚠ 인 첨가물 주의 — 원재료명 확인</div>' : '') +
        '<button type="button" class="food__add">+ 식탁에 담기</button>';
      li.querySelector('.food__add').addEventListener('click', function () {
        tray.push({ food: f, grams: 100 });
        renderTray();
      });
      listEl.appendChild(li);
    });
    if (!listEl.children.length) {
      listEl.innerHTML = '<li class="food food--none">검색 결과가 없습니다.</li>';
    }
  }

  function fmt(n) { return Math.round(n).toLocaleString('ko-KR'); }

  function renderTray() {
    trayEl.innerHTML = '';
    trayEmpty.style.display = tray.length ? 'none' : 'block';

    tray.forEach(function (item, i) {
      var li = document.createElement('li');
      li.className = 'tray__item';
      li.innerHTML =
        '<strong>' + item.food.name + '</strong>' +
        '<span class="tray__grams"><button type="button" data-d="-25">−</button><b>' + item.grams + 'g</b><button type="button" data-d="25">＋</button></span>' +
        '<button type="button" class="tray__rm" aria-label="빼기">✕</button>';
      li.querySelectorAll('[data-d]').forEach(function (b) {
        b.addEventListener('click', function () {
          item.grams = Math.max(25, item.grams + parseInt(b.dataset.d, 10));
          renderTray();
        });
      });
      li.querySelector('.tray__rm').addEventListener('click', function () {
        tray.splice(i, 1);
        renderTray();
      });
      trayEl.appendChild(li);
    });

    // 합계 vs 목표
    var sum = { na: 0, k: 0, p: 0 };
    tray.forEach(function (item) {
      var r = item.grams / 100;
      sum.na += item.food.na * r;
      sum.k += item.food.k * r;
      sum.p += item.food.p * r;
    });
    var rows = [
      { key: 'na', label: '나트륨', tg: parseFloat(tgNa.value) },
      { key: 'k', label: '칼륨', tg: parseFloat(tgK.value) },
      { key: 'p', label: '인', tg: parseFloat(tgP.value) }
    ];
    sumsEl.innerHTML = rows.map(function (r) {
      var v = sum[r.key];
      if (!r.tg || isNaN(r.tg)) {
        return '<div class="sum"><span>' + r.label + '</span><b>' + fmt(v) + ' mg</b><small>목표 미설정</small></div>';
      }
      var pct = Math.min(100, v / r.tg * 100);
      var over = v > r.tg;
      return '<div class="sum"><span>' + r.label + '</span><b>' + fmt(v) + ' / ' + fmt(r.tg) + ' mg</b>' +
        '<div class="sum__bar"><i style="width:' + pct + '%" class="' + (over ? 'over' : pct > 80 ? 'near' : '') + '"></i></div>' +
        (over ? '<small class="overtxt">내 목표를 넘었어요</small>' : '') + '</div>';
    }).join('');
  }

  searchEl.addEventListener('input', renderList);
  [tgNa, tgK, tgP].forEach(function (el) { el.addEventListener('input', renderTray); });
  clearBtn.addEventListener('click', function () { tray = []; renderTray(); });

  renderList();
  renderTray();
})();
