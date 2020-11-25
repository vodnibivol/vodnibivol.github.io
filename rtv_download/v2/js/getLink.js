'use strict';

/* ----- Variable declarations ----- */

const dlAnchor = document.getElementById('anchor');

/* ----- Function declarations ----- */

function findUrl(inputUrl) {
  console.log('input URL : ' + inputUrl);

  getID(inputUrl);
}

function getID(inputUrl) {
  let mediaID = inputUrl.split('/').pop();

  let regEx = /^https:\/\/4d\.rtvslo\.si\/arhiv\/[\w-]+\/\d{7,}$/;

  regEx.test(inputUrl) ? main(mediaID) : wrongUrl();

  function wrongUrl() {
    tip.innerHTML = 'wrong url';
    tip.classList.add('show');
    headShake();
  }
}

async function main(mediaID) {
  startAnim();

  try {
    // if (metaJSON.hasOwnProperty('error')) throw 'Error 404: File not found.';

    let r = await fetch(`https://rtv-api.herokuapp.com/api/${mediaID}`);
    let j = await r.json();

    let downloadUrl = j.media.download;

    if (j.title === 'Error') throw 'Error 404: file does not exist.';

    openUrl(downloadUrl);
  } catch (err) {
    tip.innerHTML = err;
    console.error(err);

    endAnim();
    inputField.focus();
    tip.classList.add('show');
  }
}

function openUrl(mediaUrl) {
  window.open(mediaUrl, '_blank');

  inputField.value = '';
  inputField.focus();
  tip.innerHTML = 'Press enter to download';

  endAnim();
}
