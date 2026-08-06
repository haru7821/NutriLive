// NutriLive 외식 추정표 — 카테고리 필터 + 나트륨 정렬 + WHO 상한 대비 게이지
(function () {
  if (typeof NUTRI_DINING === 'undefined') return;
  var WHO = 2000; // WHO 일반 권장 하루 상한(mg) — 게이지 기준

  var chipsEl = document.getElementById('dinChips');
  var rowsEl = document.getElementById('dinRows');
  var sortTh = document.querySelector('.ftable__sort[data-key="na"]');

  var activeCat = '전체';
  var sortDir = 'desc'; // 기본: 높은 순 (경각심 우선)

  var cats = ['전체'];
  NUTRI_DINING.forEach(function (d) {
    if (cats.indexOf(d.cat) === -1) cats.push(d.cat);
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
      render();
    });
    chipsEl.appendChild(b);
  });

  sortTh.addEventListener('click', function () {
    sortDir = sortDir === 'desc' ? 'asc' : 'desc';
    sortTh.classList.toggle('desc', sortDir === 'desc');
    sortTh.classList.toggle('asc', sortDir === 'asc');
    render();
  });
  sortTh.classList.add('desc');

  function fmt(n) { return Math.round(n).toLocaleString('ko-KR'); }

  function render() {
    var list = NUTRI_DINING.filter(function (d) {
      return activeCat === '전체' || d.cat === activeCat;
    }).slice().sort(function (a, b) {
      return sortDir === 'desc' ? b.na - a.na : a.na - b.na;
    });

    rowsEl.innerHTML = list.map(function (d) {
      var pct = Math.min(100, d.na / WHO * 100);
      var lv = d.na >= 2000 ? 'hi' : d.na >= 1200 ? 'mid' : 'lo';
      return '<tr>' +
        '<td class="ftable__food">' + d.name +
          '<span class="ftable__cat">' + d.cat + '</span>' +
          '<span class="din__tip">' + d.tip + '</span></td>' +
        '<td class="din__na din__na--' + lv + '">' + fmt(d.na) + '</td>' +
        '<td class="din__gauge"><span class="din__bar"><i class="din__bar--' + lv + '" style="width:' + pct + '%"></i></span>' +
          '<em>' + Math.round(d.na / WHO * 100) + '%</em></td>' +
      '</tr>';
    }).join('');
  }

  render();
})();
