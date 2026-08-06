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
  var deckOpen = document.getElementById('deckOpen');

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
  // 칩은 큐레이션 목록의 카테고리만 — DB 확장분(수천 건)의 대분류가 칩을 폭증시키지 않도록.
  // 확장분 항목은 「전체」와 검색으로 노출됩니다.
  var cats = ['전체'];
  NUTRI_FOODS.forEach(function (f) {
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
  function cell(v, kind) {
    // 식약처 DB 가공식품 등은 칼륨·인 정보가 없는 경우가 많다 — 빈 값은 — 표시
    if (v == null) return '<td class="ftable__miss" title="식약처 DB에 정보가 없는 항목">—</td>';
    return '<td class="' + levelClass(v, kind) + '">' + fmt(v) + '</td>';
  }
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
      list = list.slice().sort(function (a, b) {
        var av = a[k], bv = b[k];
        if (av == null && bv == null) return 0;
        if (av == null) return 1;  // 값 미상은 항상 뒤로
        if (bv == null) return -1;
        return (av - bv) * dir;
      });
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
        cell(f.na, 'na') + cell(f.k, 'k') + cell(f.p, 'p') +
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
    deckOpen.setAttribute('aria-expanded', String(willOpen));
    deckOpen.textContent = willOpen ? '내리기 ▼' : '올리기 ▲';
    deckOpen.title = willOpen ? '식탁 상세를 접습니다' : '담은 식품과 상세 합계를 펼쳐 봅니다';
    if (willOpen && focusTargets) tgNa.focus();
  }
  deckToggle.addEventListener('click', function () { togglePanel(); });
  deckOpen.addEventListener('click', function () { togglePanel(); });
  deckGear.addEventListener('click', function () { togglePanel(true, true); });

  function sumTray() {
    var sum = { na: 0, k: 0, p: 0 };
    var miss = { na: false, k: false, p: false }; // 값 미상 식품이 섞이면 합계가 과소평가됨을 표시
    tray.forEach(function (item) {
      var r = item.grams / 100;
      ['na', 'k', 'p'].forEach(function (key) {
        var v = item.food[key];
        if (v == null) miss[key] = true;
        else sum[key] += v * r;
      });
    });
    return { sum: sum, miss: miss };
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

    var st = sumTray();
    var sum = st.sum, miss = st.miss;
    var anyMiss = miss.na || miss.k || miss.p;
    deckCount.textContent = tray.length + '품';

    // 하단 바 — 항상 보이는 실시간 게이지 (*: 값 미상 식품 제외된 합계)
    deckSums.innerHTML = ROWS.map(function (r) {
      var v = sum[r.key];
      var star = miss[r.key] ? '<i>*</i>' : '';
      var tg = parseFloat(r.el.value);
      var hasTg = tg && !isNaN(tg);
      var pct = hasTg ? Math.min(100, v / tg * 100) : 0;
      var over = hasTg && v > tg;
      return '<div class="dsum dsum--' + r.key + '">' +
        '<small>' + r.label + '</small>' +
        '<b class="' + (over ? 'over' : '') + '">' + fmt(v) + star +
          (hasTg ? ' <i>/ ' + fmt(tg) + '</i>' : ' <i>mg</i>') + '</b>' +
        '<span class="dsum__bar' + (hasTg ? '' : ' mute') + '">' +
          '<i style="width:' + (hasTg ? pct : (v > 0 ? 100 : 0)) + '%" class="' +
          (over ? 'over' : pct > 80 ? 'near' : '') + '"></i></span>' +
      '</div>';
    }).join('');

    // 영수증 패널 — 상세 합계 (모바일에서 K·P는 여기서 확인)
    sumsEl.innerHTML = ROWS.map(function (r) {
      var v = sum[r.key];
      var star = miss[r.key] ? '*' : '';
      var tg = parseFloat(r.el.value);
      if (!tg || isNaN(tg)) {
        return '<div class="sum"><span>' + r.label + '</span><b>' + fmt(v) + star + ' mg</b><small>목표 미설정</small></div>';
      }
      var pct = Math.min(100, v / tg * 100);
      var over = v > tg;
      return '<div class="sum"><span>' + r.label + '</span><b>' + fmt(v) + star + ' / ' + fmt(tg) + ' mg</b>' +
        '<div class="sum__bar"><i style="width:' + pct + '%" class="' + (over ? 'over' : pct > 80 ? 'near' : '') + '"></i></div>' +
        (over ? '<small class="overtxt">내 목표를 넘었어요</small>' : '') + '</div>';
    }).join('') +
    (anyMiss ? '<p class="sums__note">* 정보가 없는(—) 식품은 해당 영양소 합계에서 빠져 있어요 — 실제 섭취량은 표시보다 많을 수 있습니다.</p>' : '');

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
