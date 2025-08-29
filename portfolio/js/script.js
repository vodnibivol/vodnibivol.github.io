const Main = (function () {
  const $ = (sel) => document.querySelector(sel);
  window.addEventListener('scroll', toggleArrow);

  function init() {
    // events
    $('header').addEventListener('click', (e) => {
      e.preventDefault();

      let scrollOffset;

      if (e.target.matches('.logo')) {
        scrollOffset = 50;
      }

      if (e.target.matches('#aboutLink')) {
        scrollOffset = Math.floor($('#about-me').offsetTop);
      }

      if (e.target.matches('#projectsLink')) {
        scrollOffset = Math.floor($('#projects').offsetTop + 1);
      }
      if (e.target.matches('#contactLink')) {
        scrollOffset = Math.floor($('footer').offsetTop);
      }

      scroll2(scrollOffset - 50, 1000);
    });
  }

  function toggleArrow() {
    if (window.scrollY > $('#projects').offsetTop - 50) {
      $('header').classList.add('white');
    } else {
      $('header').classList.remove('white');
    }
  }

  init();
})();
