// NutriLive — 공통 인터랙션
(function () {
  var CFG = window.NUTRI_CONFIG || {};

  // 이벤트 집계 — GoatCounter 이벤트 (쿠키 없음, 로드 전이면 조용히 무시)
  function track(name) {
    try {
      if (window.goatcounter && window.goatcounter.count) {
        window.goatcounter.count({ path: name, event: true });
      }
    } catch (e) {}
  }
  window.NUTRI_TRACK = track;
  // data-track 속성이 붙은 요소 클릭을 자동 집계
  document.addEventListener('click', function (e) {
    var el = e.target.closest && e.target.closest('[data-track]');
    if (el) track(el.getAttribute('data-track'));
  });

  // 모바일 내비게이션
  var toggle = document.getElementById('navToggle');
  var links = document.getElementById('navLinks');
  if (toggle && links) {
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-controls', 'navLinks');
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    links.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // 스크롤 리빌
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('on');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('on'); });
  }

  // ① 뉴스레터/사전등록 폼 — 엔드포인트 연동 + 메일 폴백
  var form = document.getElementById('newsForm');
  var done = document.getElementById('newsDone');
  if (form && done) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var email = form.querySelector('input[type="email"]').value.trim();
      if (!email) return;
      var isPrereg = /market/.test(location.pathname);
      var kind = isPrereg ? 'Slowspoon 마켓 사전 등록' : '주간 레터 구독';

      // 전송 중 중복 클릭 방지 + 진행 표시
      var btn = form.querySelector('button');
      var btnLabel = btn ? btn.textContent : '';
      if (btn) {
        if (btn.disabled) return;
        btn.disabled = true;
        btn.textContent = '신청 중…';
      }

      function ok() {
        if (btn) { btn.disabled = false; btn.textContent = btnLabel; }
        form.style.display = 'none';
        done.classList.add('show');
        track(isPrereg ? 'market-prereg' : 'newsletter-signup'); // 전환 집계
      }

      // 주간 레터 구독은 MailerLite에 직접 등록 (실패 시 기존 경로로 폴백)
      if (!isPrereg && CFG.ML_ACCOUNT && CFG.ML_FORM) {
        var mfd = new FormData();
        mfd.append('fields[email]', email);
        mfd.append('ml-submit', '1');
        mfd.append('anticsrf', 'true');
        fetch('https://assets.mailerlite.com/jsonp/' + CFG.ML_ACCOUNT + '/forms/' + CFG.ML_FORM + '/subscribe',
          { method: 'POST', body: mfd })
          .then(function (r) { if (!r.ok) throw new Error(r.status); ok(); })
          .catch(function () { legacySubmit(); });
      } else {
        legacySubmit();
      }

      function legacySubmit() {
        if (CFG.FORM_ENDPOINT) {
          var fd = new FormData();
          fd.append('email', email);
          fd.append('type', kind);
          fetch(CFG.FORM_ENDPOINT, { method: 'POST', body: fd, headers: { Accept: 'application/json' } })
            .then(function (r) { if (!r.ok) throw new Error(r.status); ok(); })
            .catch(function () { mailFallback(); });
        } else {
          mailFallback();
        }
      }

      function mailFallback() {
        location.href = 'mailto:' + (CFG.FALLBACK_MAILTO || 'contact@nutrilive.kr') +
          '?subject=' + encodeURIComponent('[' + kind + '] 신청') +
          '&body=' + encodeURIComponent('신청 이메일: ' + email);
        done.textContent = '메일 앱이 열립니다. 전송 버튼만 눌러주시면 신청 완료예요.';
        ok();
      }
    });
  }

  // ② 방문 분석 — GoatCounter (쿠키 없음, 코드 설정 시에만 로드)
  if (CFG.ANALYTICS_CODE) {
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://gc.zgo.at/count.js';
    s.setAttribute('data-goatcounter', 'https://' + CFG.ANALYTICS_CODE + '.goatcounter.com/count');
    document.body.appendChild(s);
  }
})();
