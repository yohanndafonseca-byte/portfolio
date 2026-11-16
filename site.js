(function () {
  var root = document.documentElement;

  /* Thème clair / sombre */
  var btn = document.querySelector('.theme');
  function label() {
    if (btn) btn.textContent = root.dataset.theme === 'dark' ? 'Clair' : 'Sombre';
  }
  label();
  if (btn) btn.addEventListener('click', function () {
    root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem('yd-theme', root.dataset.theme); } catch (e) {}
    label();
  });

  /* Filet sous la barre au défilement */
  var top = document.querySelector('.top');
  function onScroll() { if (top) top.classList.toggle('is-scrolled', window.scrollY > 8); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Visionneuse d'images */
  var viewer = document.querySelector('.viewer');
  if (!viewer || typeof viewer.showModal !== 'function') return;
  var vImg = viewer.querySelector('img');
  var vCap = viewer.querySelector('.viewer-bar p');
  var set = [], idx = 0;

  function show(i) {
    idx = (i + set.length) % set.length;
    var b = set[idx], im = b.querySelector('img');
    vImg.src = im.src; vImg.alt = im.alt;
    var cap = b.parentElement.querySelector('figcaption');
    vCap.textContent = (cap ? cap.textContent : im.alt) + (set.length > 1 ? '  (' + (idx + 1) + ' sur ' + set.length + ')' : '');
    viewer.querySelector('.viewer-nav').style.visibility = set.length > 1 ? 'visible' : 'hidden';
  }
  document.querySelectorAll('[data-zoom]').forEach(function (b) {
    b.addEventListener('click', function () {
      var group = b.closest('.gallery, .solo');
      set = Array.prototype.slice.call(group.querySelectorAll('[data-zoom]'));
      show(set.indexOf(b));
      viewer.showModal();
    });
  });
  viewer.querySelector('[data-close]').addEventListener('click', function () { viewer.close(); });
  viewer.querySelector('[data-prev]').addEventListener('click', function () { show(idx - 1); });
  viewer.querySelector('[data-next]').addEventListener('click', function () { show(idx + 1); });
  viewer.querySelector('.viewer-stage').addEventListener('click', function (e) { if (e.target === this) viewer.close(); });
  viewer.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') show(idx + 1);
    if (e.key === 'ArrowLeft') show(idx - 1);
  });
})();
