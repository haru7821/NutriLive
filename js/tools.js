// NutriLive 성분 판별기 (베타) — 검색 → 비교표 → 하단 계산대
(function () {
  if (typeof NUTRI_FOODS === 'undefined') return;
  // 큐레이션 44종 + 식약처 DB 확장분 병합 (중복 이름은 큐레이션 우선)
  var seen = {};
  NUTRI_FOODS.forEach(function (f) { seen[f.name] = true; });
  var FOODS = NUTRI_FOODS.concat((window.NUTRI_FOODS_EXT || []).filter(function (f) {
    return !seen[f.name];
  }));

  var MAX_ROWS = 200; // DB 확장 대비 — 넘치면 검색어를 좁히도록 안내

  var searchEl = document.getElementById('foodSearch');
  var chipsEl = document.getElementById('catChips');
  var rowsEl = document.getElementById('foodRows');
  var moreEl = document.getElementById('ftableMore');
  var trayEl = document.getElementById('tray');
  var trayEmpty = document.getElementById('trayEmpty');
  var sumsEl = document.getElementById('sums');
  var clearBtn = document.getElementById('trayClear');
  var tgNa = document.getElementById('tgNa');
  var tgK = document.getElementById('tgK');
  var tgP = document.getElementById('tgP');
  var deck = document.getElementById('deck');
  var deckPanel = document.getElementById('deckPanel');
  var deckToggle = document.getElementById('deckToggle');
  var deckCount = document.getElementById('deckCount');
  var deckSums = document.getElementById('deckSums');
  var deckGear = document.getElementById('deckGear');

  var state = { cat: '전체', noPhos: false, sortKey: null, sortDir: null };
  var tray = []; // {food, grams}

  /* ---------- 저장 (이 브라우저에만 보관) ---------- */
  function save(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {}
  }
  function load(key) {
    try { return JSON.parse(localStorage.getItem(key)); } catch (e) { return null; }
  }
  function today() {
    var d = new Date();
    return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
  }
  function saveTargets() {
    save('nl.targets.v1', { na: tgNa.value, k: tgK.value, p: tgP.value });
  }
  function saveTray() {
    save('nl.tray.v1', {
      date: today(),
      items: tray.map(function (t) { return { name: t.food.name, grams: t.grams }; })
    });
  }
  function restore() {
    var tg = load('nl.targets.v1');
    if (tg) {
      if (tg.na !== undefined && tg.na !== '') tgNa.value = tg.na;
      if (tg.k) tgK.value = tg.k;
      if (tg.p) tgP.value = tg.p;
    }
    var tr = load('nl.tray.v1');
    if (tr && tr.date === today() && tr.items) { // 「오늘의」 식탁 — 날짜 지나면 새로
      tr.items.forEach(function (it) {
        for (var i = 0; i < FOODS.length; i++) {
          if (FOODS[i].name === it.name) {
            tray.push({ food: FOODS[i], grams: it.grams || 100 });
            break;
          }
        }
      });
    }
  }

  /* ---------- 필터 칩 ---------- */
  var cats = ['전체'];
  FOODS.forEach(function (f) {
    if (cats.indexOf(f.cat) === -1) cats.push(f.cat);
  });
  cats.forEach(function (c) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'chip' + (c === state.cat ? ' on' : '');
    b.textContent = c;
    b.addEventListener('click', function () {
      state.cat = c;
      chipsEl.querySelectorAll('.chip').forEach(function (x) { x.classList.remove('on'); });
      b.classList.add('on');
      if (state.noPhos) phosChip.classList.add('on'); // 별도 토글은 유지
      renderRows();
    });
    chipsEl.appendChild(b);
  });
  var phosChip = document.createElement('button');
  phosChip.type = 'button';
  phosChip.className = 'chip';
  phosChip.textContent = '인 첨가물 제외';
  phosChip.addEventListener('click', function () {
    state.noPhos = !state.noPhos;
    phosChip.classList.toggle('on', state.noPhos);
    renderRows();
  });
  chipsEl.appendChild(phosChip);

  /* ---------- 비교 테이블 ---------- */
  function levelClass(v, kind) {
    // 100g당 함량의 상대적 높낮이 표시 (일반적 라벨 읽기 관행 기준의 단순 구간)
    var t = kind === 'na' ? [120, 500] : kind === 'k' ? [200, 500] : [100, 300];
    return v <= t[0] ? 'lv-low' : v <= t[1] ? 'lv-mid' : 'lv-high';
  }
  function fmt(n) { return Math.round(n).toLocaleString('ko-KR'); }
  function inTray(name) {
    return tray.some(function (t) { return t.food.name === name; });
  }

  document.querySelectorAll('.ftable__sort').forEach(function (th) {
    function cycle() {
      var key = th.dataset.key;
      // 같은 열 반복 클릭: 낮은 순 → 높은 순 → 정렬 해제
      if (state.sortKey !== key) { state.sortKey = key; state.sortDir = 'asc'; }
      else if (state.sortDir === 'asc') state.sortDir = 'desc';
      else { state.sortKey = null; state.sortDir = null; }
      document.querySelectorAll('.ftable__sort').forEach(function (x) { x.classList.remove('asc', 'desc'); });
      if (state.sortKey) th.classList.add(state.sortDir);
      renderRows();
    }
    th.addEventListener('click', cycle);
    th.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); cycle(); }
    });
  });

  function renderRows() {
    var q = (searchEl.value || '').trim();
    var list = FOODS.filter(function (f) {
      return (state.cat === '전체' || f.cat === state.cat) &&
             (!state.noPhos || !f.phosAdd) &&
             (!q || f.name.indexOf(q) !== -1);
    });
    if (state.sortKey) {
      var k = state.sortKey, dir = state.sortDir === 'asc' ? 1 : -1;
      list = list.slice().sort(function (a, b) { return (a[k] - b[k]) * dir; });
    }
    var total = list.length;
    if (total > MAX_ROWS) list = list.slice(0, MAX_ROWS);

    var html = list.map(function (f, i) {
      var added = inTray(f.name);
      return '<tr>' +
        '<td class="ftable__food">' + f.name +
          '<span class="ftable__cat">' + f.cat + '</span>' +
          (f.phosAdd ? ' <span class="ftable__warn" title="인산염 계열 첨가물이 흔히 쓰이는 카테고리 — 원재료명 확인">⚠ 인 첨가물</span>' : '') +
        '</td>' +
        '<td class="' + levelClass(f.na, 'na') + '">' + fmt(f.na) + '</td>' +
        '<td class="' + levelClass(f.k, 'k') + '">' + fmt(f.k) + '</td>' +
        '<td class="' + levelClass(f.p, 'p') + '">' + fmt(f.p) + '</td>' +
        '<td><button type="button" class="ftable__add' + (added ? ' added' : '') + '" data-i="' + i + '">' +
          (added ? '담음 ✓' : '+ 담기') + '</button></td>' +
      '</tr>';
    }).join('');
    rowsEl.innerHTML = html ||
      '<tr class="ftable__none"><td colspan="5">검색 결과가 없습니다.</td></tr>';
    rowsEl._list = list; // 담기 버튼 위임용 현재 목록

    moreEl.hidden = total <= MAX_ROWS;
    if (total > MAX_ROWS) {
      moreEl.textContent = '전체 ' + fmt(total) + '개 중 ' + MAX_ROWS + '개 표시 — 검색어나 필터로 좁혀보세요.';
    }
  }

  rowsEl.addEventListener('click', function (e) {
    var btn = e.target.closest('.ftable__add');
    if (!btn) return;
    var f = rowsEl._list[parseInt(btn.dataset.i, 10)];
    if (!f) return;
    var existing = null;
    tray.forEach(function (t) { if (t.food.name === f.name) existing = t; });
    if (existing) existing.grams += 100; // 이미 담긴 식품은 100g 추가
    else tray.push({ food: f, grams: 100 });
    btn.classList.add('added');
    btn.textContent = '담음 ✓';
    renderTray();
  });

  /* ---------- 계산대 (하단 바 + 영수증 패널) ---------- */
  function togglePanel(open, focusTargets) {
    var willOpen = open !== undefined ? open : deckPanel.hidden;
    deckPanel.hidden = !willOpen;
    deck.classList.toggle('open', willOpen);
    deckToggle.setAttribute('aria-expanded', String(willOpen));
    if (willOpen && focusTargets) tgNa.focus();
  }
  deckToggle.addEventListener('click', function () { togglePanel(); });
  deckGear.addEventListener('click', function () { togglePanel(true, true); });

  function sumTray() {
    var sum = { na: 0, k: 0, p: 0 };
    tray.forEach(function (item) {
      var r = item.grams / 100;
      sum.na += item.food.na * r;
      sum.k += item.food.k * r;
      sum.p += item.food.p * r;
    });
    return sum;
  }
  var ROWS = [
    { key: 'na', label: '나트륨', el: tgNa },
    { key: 'k', label: '칼륨', el: tgK },
    { key: 'p', label: '인', el: tgP }
  ];

  function renderTray() {
    trayEl.innerHTML = '';
    trayEmpty.style.display = tray.length ? 'none' : 'block';
    clearBtn.style.display = tray.length ? '' : 'none';

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
        renderRows(); // 「담음 ✓」 상태 되돌리기
      });
      trayEl.appendChild(li);
    });

    var sum = sumTray();
    deckCount.textContent = tray.length + '품';

    // 하단 바 — 항상 보이는 실시간 게이지
    deckSums.innerHTML = ROWS.map(function (r) {
      var v = sum[r.key];
      var tg = parseFloat(r.el.value);
      var hasTg = tg && !isNaN(tg);
      var pct = hasTg ? Math.min(100, v / tg * 100) : 0;
      var over = hasTg && v > tg;
      return '<div class="dsum dsum--' + r.key + '">' +
        '<small>' + r.label + '</small>' +
        '<b class="' + (over ? 'over' : '') + '">' + fmt(v) +
          (hasTg ? ' <i>/ ' + fmt(tg) + '</i>' : ' <i>mg</i>') + '</b>' +
        '<span class="dsum__bar' + (hasTg ? '' : ' mute') + '">' +
          '<i style="width:' + (hasTg ? pct : (v > 0 ? 100 : 0)) + '%" class="' +
          (over ? 'over' : pct > 80 ? 'near' : '') + '"></i></span>' +
      '</div>';
    }).join('');

    // 영수증 패널 — 상세 합계 (모바일에서 K·P는 여기서 확인)
    sumsEl.innerHTML = ROWS.map(function (r) {
      var v = sum[r.key];
      var tg = parseFloat(r.el.value);
      if (!tg || isNaN(tg)) {
        return '<div class="sum"><span>' + r.label + '</span><b>' + fmt(v) + ' mg</b><small>목표 미설정</small></div>';
      }
      var pct = Math.min(100, v / tg * 100);
      var over = v > tg;
      return '<div class="sum"><span>' + r.label + '</span><b>' + fmt(v) + ' / ' + fmt(tg) + ' mg</b>' +
        '<div class="sum__bar"><i style="width:' + pct + '%" class="' + (over ? 'over' : pct > 80 ? 'near' : '') + '"></i></div>' +
        (over ? '<small class="overtxt">내 목표를 넘었어요</small>' : '') + '</div>';
    }).join('');

    saveTray();
  }

  /* ---------- 이벤트 ---------- */
  searchEl.addEventListener('input', renderRows);
  ROWS.forEach(function (r) {
    r.el.addEventListener('input', function () { renderTray(); saveTargets(); });
  });
  clearBtn.addEventListener('click', function () {
    tray = [];
    renderTray();
    renderRows();
  });

  restore();
  renderRows();
  renderTray();
  // PC에서는 바로 검색 시작 (모바일은 키보드가 화면을 가려 제외)
  if (window.innerWidth > 860) searchEl.focus();
})();
