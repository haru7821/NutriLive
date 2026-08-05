// KANPAI LINKS — interactions
(function () {
  // Scroll reveal
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

  // Mobile nav
  const toggle = document.getElementById('navToggle');
  const links = document.querySelector('.nav__links');
  if (toggle && links) {
    toggle.addEventListener('click', () => links.classList.toggle('open'));
    links.querySelectorAll('a').forEach((a) =>
      a.addEventListener('click', () => links.classList.remove('open'))
    );
  }

  // Nav darkens on scroll
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    if (!nav) return;
    nav.style.background =
      window.scrollY > 60
        ? 'rgba(22,17,11,.96)'
        : 'linear-gradient(rgba(22,17,11,.92), rgba(22,17,11,.75) 70%, transparent)';
  });
})();
