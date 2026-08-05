// NutriLive — 인터랙션
(function () {
  // 모바일 내비게이션
  var toggle = document.getElementById('navToggle');
  var links = document.getElementById('navLinks');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      links.classList.toggle('open');
    });
    links.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') links.classList.remove('open');
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

  // 뉴스레터/사전 등록 폼 (데모 — 추후 이메일 서비스 연동)
  var form = document.getElementById('newsForm');
  var done = document.getElementById('newsDone');
  if (form && done) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      form.style.display = 'none';
      done.classList.add('show');
    });
  }
})();
