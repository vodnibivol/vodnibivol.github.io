function animate(n, t = 1e3, i) {
  let o;
  function e(l) {
    let c = l - o;
    n(i(Math.min(1, c / t))), c < t && requestAnimationFrame(e);
  }
  requestAnimationFrame(function n(t) {
    (o = t), (i = (n) => (n < 0.5 ? 4 * n * n * n : (n - 1) * (2 * n - 2) * (2 * n - 2) + 1)), requestAnimationFrame(e);
  });
}
function scroll2(n, t = 1500) {
  let i = document.body.offsetHeight - window.innerHeight,
    o = window.scrollY,
    e = Math.min(n, i) - o;
  animate(
    function (n) {
      window.scrollTo(0, Math.floor(o + e * n));
    },
    t,
    'easeInOutCubic'
  );
}
