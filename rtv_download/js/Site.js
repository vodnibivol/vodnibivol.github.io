const Site = (function () {
  // cache
  const form = document.querySelector('.search-form');
  const input = form.querySelector('.input-field');
  const tip = document.querySelector('.tip');

  const background = document.querySelector('.bg-wrapper');
  // const link = document.getElementById('link');

  // events
  input.addEventListener('input', _toggleTip);
  form.addEventListener('submit', _handleSubmit);

  // init
  input.placeholder = 'https://4d.rtvslo.si/arhiv/lahko-noc-otroci/174689123';
  input.select();
  _dailyBg();

  /** TEMP */
  // const URL = 'https://4d.rtvslo.si/arhiv/tinka-in-zverca/174775853';
  // input.value = URL;
  // Fetch.getLink(URL); // TODO: loose coupling (potrebno?)
  /** END-TEMP */

  // f(x)
  function _handleSubmit(e) {
    e.preventDefault();

    Fetch.getLink(input.value);
  }

  function _toggleTip() {
    tip.innerHTML = 'Press enter to download';
    let isShown = tip.classList.contains('show');

    if (input.value) {
      if (!isShown) setTimeout(() => tip.classList.add('show'), 400);
    } else {
      if (isShown) tip.classList.remove('show');
    }
  }

  function openUrl(url) {
    window.open(url, '_blank');

    // reset form
    input.value = '';
    input.focus();
    tip.innerHTML = 'Press enter to download';

    // endAnim();
  }

  function _dailyBg() {
    let randNum = new PRNG().randomImage;
    let path = `./img/bg/bg_${randNum}.jpg`;

    let backgroundImg = document.createElement('img');
    backgroundImg.src = path;
    backgroundImg.className = 'bg-img hidden';
    background.appendChild(backgroundImg);

    backgroundImg.onload = function () {
      backgroundImg.classList.remove('hidden');
    };
  }

  return { openUrl };
})();

const Anim = (function () {
  // cache
  const form = document.querySelector('form');
  const downloadIcon = form.querySelector('.btn-download i');

  // events
  form.addEventListener('animationend', () => form.removeAttribute('style'));

  return {
    headShake: function () {
      form.style.animation = 'shake 0.5s';
    },

    check: function () {
      downloadIcon.classList.toggle('fa-arrow-down');
      downloadIcon.classList.toggle('fa-check');

      setTimeout(() => {
        downloadIcon.classList.toggle('fa-check');
        downloadIcon.classList.toggle('fa-arrow-down');
      }, 2000);
    },
  };
})();
