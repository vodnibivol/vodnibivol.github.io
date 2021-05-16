const Site = (function () {
  // cache
  const form = document.querySelector('.search-form');
  const input = form.querySelector('.input-field');
  const downloadBtn = form.querySelector('.btn-download');
  const tip = document.querySelector('.tip');

  const background = document.querySelector('.bg-wrapper');
  // const link = document.getElementById('link');

  // events
  input.addEventListener('keydown', _toggleTip);
  form.addEventListener('submit', _handleSubmit);

  // init
  input.select();
  _dailyBg();

  /** TEMP */
  const URL = 'https://4d.rtvslo.si/arhiv/tinka-in-zverca/174775853';
  Fetch.getLink(URL); // TODO: loose coupling
  /** END-TEMP */

  // f(x)
  function _handleSubmit(e) {
    e.preventDefault();

    Fetch.getLink(input.value);
  }

  function _toggleTip() {
    // TODO: naredi nekaj logike
    tip.classList.add('show');
  }

  function _dailyBg() {
    let randNum = getRand();
    let path = `../img/bg/bgnd_${randNum}.jpg`;

    let backgroundImg = document.createElement('img');
    backgroundImg.src = path;
    backgroundImg.className = 'bg-img hidden';

    backgroundImg.onload = function () {
      background.appendChild(backgroundImg);
      backgroundImg.classList.remove('hidden');
    };
  }
})();
