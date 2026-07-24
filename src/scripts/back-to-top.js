// back-to-top.js — floating button that appears after scrolling down.
(function () {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  let ticking = false;

  function toggle() {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      requestAnimationFrame(toggle);
      ticking = true;
    }
  }, { passive: true });

  btn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  toggle();
})();
