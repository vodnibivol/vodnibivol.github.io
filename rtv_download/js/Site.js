const Site = (function () {
  // cache
  const form = document.querySelector('.search-form');
  const input = form.querySelector('.input-field');
  const tip = document.querySelector('.tip');

  // events
  input.addEventListener('input', _toggleTip);
  form.addEventListener('submit', _handleSubmit);

  // init
  input.placeholder = 'https://4d.rtvslo.si/arhiv/lahko-noc-otroci/174689123';
  input.select();
  _dailyBg();

  // f(x)
  function _handleSubmit(e) {
    e.preventDefault();

    Fetch.getLink(input.value);
  }

  function _toggleTip() {
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
    tip.classList.remove('show');
  }

  function _dailyBg() {
    const background = document.querySelector('.bg-wrapper');

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

const Visual = (function () {
  // cache
  const form = document.querySelector('form');
  const downloadIcon = form.querySelector('.btn-download i');
  const tip = document.querySelector('.tip');

  // events
  form.addEventListener('animationend', () => form.removeAttribute('style'));

  // f(x)
  function headShake() {
    form.style.animation = 'shake 0.5s';
  }

  function checkmark(isCorrect) {
    if (isCorrect) {
      downloadIcon.classList.remove('fa-arrow-down');
      downloadIcon.classList.add('fa-check');

      setTimeout(() => {
        downloadIcon.classList.remove('fa-check');
        downloadIcon.classList.add('fa-arrow-down');
      }, 2000);
    } else {
      downloadIcon.classList.remove('fa-check');
      downloadIcon.classList.add('fa-arrow-down');
    }
  }

  function errMsg(message) {
    console.error(message);
    headShake();
    checkmark(false);
    tip.innerHTML = message;
    tip.classList.add('show');
  }

  return { headShake, checkmark, errMsg };
})();
