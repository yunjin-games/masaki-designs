// 공통 다듬기: 첫 화면 아래 구역이 스크롤로 들어올 때 서서히 나타나게 한다
(function () {
  if (!('IntersectionObserver' in window)) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var main = document.querySelector('main') || document.body;
  var items = [].slice.call(main.children).filter(function (el, i) {
    if (i === 0) return false; // 첫 화면은 바로 보이게
    if (/^(SCRIPT|STYLE)$/.test(el.tagName)) return false;
    return el.getBoundingClientRect().top > window.innerHeight * 0.9;
  });
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });
  items.forEach(function (el) { el.classList.add('rv'); io.observe(el); });
})();
