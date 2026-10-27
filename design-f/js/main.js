(function () {
  var body = document.body;
  // mobile nav
  document.querySelectorAll('.js-nav-toggle').forEach(function (b) {
    b.addEventListener('click', function () {
      var open = body.classList.toggle('nav-open');
      document.querySelectorAll('.js-nav-toggle').forEach(function (x) { x.setAttribute('aria-expanded', open ? 'true' : 'false'); });
    });
  });
  document.querySelectorAll('.site-nav a').forEach(function (a) {
    a.addEventListener('click', function () { body.classList.remove('nav-open'); });
  });
  // slideshow
  document.querySelectorAll('.js-slides').forEach(function (wrap) {
    var slides = wrap.querySelectorAll('.slide');
    var dots = wrap.querySelectorAll('.slide-dot');
    var counter = wrap.querySelector('.slide-count');
    if (slides.length < 2) return;
    var i = 0, timer;
    function go(n) {
      slides[i].classList.remove('is-active'); if (dots[i]) dots[i].classList.remove('is-active');
      i = (n + slides.length) % slides.length;
      slides[i].classList.add('is-active'); if (dots[i]) dots[i].classList.add('is-active');
      if (counter) counter.textContent = String(i + 1).padStart(2, '0') + ' / ' + String(slides.length).padStart(2, '0');
    }
    function start() { clearInterval(timer); timer = setInterval(function () { go(i + 1); }, 5500); }
    dots.forEach(function (d, n) { d.addEventListener('click', function () { go(n); start(); }); });
    var prev = wrap.querySelector('.slide-prev'), next = wrap.querySelector('.slide-next');
    if (prev) prev.addEventListener('click', function () { go(i - 1); start(); });
    if (next) next.addEventListener('click', function () { go(i + 1); start(); });
    go(0); start();
  });
  // filters (works / news)
  document.querySelectorAll('.js-filter-group').forEach(function (group) {
    var list = document.querySelector(group.getAttribute('data-target'));
    if (!list) return;
    var items = list.querySelectorAll('.js-item');
    var moreBtn = document.querySelector('.js-more');
    var empty = document.querySelector('.js-empty');
    var limit = parseInt(list.getAttribute('data-limit') || '0', 10);
    var expanded = !limit;
    var cur = 'all', q = '';
    var params = new URLSearchParams(location.search);
    if (params.get('cat')) cur = params.get('cat');
    if (params.get('q')) { q = params.get('q').trim(); expanded = true;
      var qs = document.querySelector('.js-query'); if (qs) { qs.hidden = false; qs.querySelector('span').textContent = q; } }
    function apply() {
      var shown = 0, matched = 0;
      items.forEach(function (el) {
        var ok = (cur === 'all' || el.getAttribute('data-cat') === cur) &&
          (!q || el.textContent.toLowerCase().indexOf(q.toLowerCase()) > -1);
        if (ok) matched++;
        var vis = ok && (expanded || matched <= limit);
        el.hidden = !vis; if (vis) shown++;
      });
      if (moreBtn) moreBtn.hidden = expanded || matched <= limit;
      if (empty) empty.hidden = matched > 0;
      group.querySelectorAll('[data-filter]').forEach(function (b) {
        var on = b.getAttribute('data-filter') === cur;
        b.classList.toggle('is-active', on); b.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
    }
    group.querySelectorAll('[data-filter]').forEach(function (b) {
      b.addEventListener('click', function (e) { e.preventDefault(); cur = b.getAttribute('data-filter'); apply(); });
    });
    if (moreBtn) moreBtn.addEventListener('click', function (e) { e.preventDefault(); expanded = true; apply(); });
    apply();
  });
  // header search -> works page with ?q=
  document.querySelectorAll('.js-search').forEach(function (f) {
    var inp = f.querySelector('input');
    var p = new URLSearchParams(location.search).get('q'); if (p && inp) inp.value = p;
  });
  // works detail gallery
  document.querySelectorAll('.js-gallery').forEach(function (g) {
    var main = g.querySelector('.js-gallery-main');
    g.querySelectorAll('.js-thumb').forEach(function (t) {
      t.addEventListener('click', function () {
        main.src = t.getAttribute('data-src');
        g.querySelectorAll('.js-thumb').forEach(function (x) { x.classList.remove('is-active'); });
        t.classList.add('is-active');
      });
    });
  });
  // contact (demo only — never submits)
  var form = document.querySelector('.js-contact-form');
  if (form) {
    form.addEventListener('submit', function (e) { e.preventDefault(); });
    var confirmP = document.querySelector('.js-step-confirm');
    var completeP = document.querySelector('.js-step-complete');
    function scrollToEl(el) { var y = el.getBoundingClientRect().top + window.pageYOffset - 90; window.scrollTo({ top: y, behavior: 'smooth' }); }
    function flash(el) { el.classList.remove('is-focus'); void el.offsetWidth; el.classList.add('is-focus'); }
    form.querySelector('.js-to-confirm').addEventListener('click', function (e) {
      e.preventDefault();
      var ok = true;
      form.querySelectorAll('[required]').forEach(function (f) {
        var bad = !f.value.trim() || (f.type === 'email' && !/^\S+@\S+\.\S+$/.test(f.value));
        f.closest('.field').classList.toggle('is-error', bad); if (bad) ok = false;
      });
      if (!ok) { var first = form.querySelector('.is-error'); scrollToEl(first); return; }
      form.querySelectorAll('[name]').forEach(function (f) {
        var out = confirmP.querySelector('[data-out="' + f.name + '"]');
        if (out) out.textContent = f.value || ({ja:'未入力',en:'Not provided',ko:'미입력'}[document.documentElement.lang] || '-');
      });
      scrollToEl(confirmP); flash(confirmP);
    });
    form.querySelector('.js-clear').addEventListener('click', function (e) {
      e.preventDefault(); form.reset(); form.querySelectorAll('.is-error').forEach(function (x) { x.classList.remove('is-error'); });
    });
    document.querySelectorAll('.js-back-form').forEach(function (b) { b.addEventListener('click', function (e) { e.preventDefault(); scrollToEl(form); }); });
    document.querySelectorAll('.js-send').forEach(function (b) { b.addEventListener('click', function (e) { e.preventDefault(); scrollToEl(completeP); flash(completeP); }); });
  }
  // page top
  document.querySelectorAll('.js-pagetop').forEach(function (a) {
    a.addEventListener('click', function (e) { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); });
  });
})();
