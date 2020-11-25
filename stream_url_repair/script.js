'use strict';

/* -------- variable declarations -------- */

const inputForm = document.getElementById('inputForm');
const submitBtn = document.getElementById('submitBtn');
const inputField = document.getElementById('inputField');
const copyBtn = document.getElementById('copyBtn');

const clientID = '82013fb3a531d5414f478747c1aca622';
const sessionID = '5f8b37d5132e81.86424273.3356888652';
const proxy = 'https://corsaire.herokuapp.com/';

const meta = 'https://api.rtvslo.si/ava/getRecordingDrm/';
const api = 'https://api.rtvslo.si/ava/getMedia/';

let kHash;

/* -------- event listeners -------- */

window.addEventListener('load', () => {
  console.log('document loaded.');

  let metaUrl = meta + `174717021?client_id=${clientID}&session_id=${sessionID}`;

  fetch(proxy + metaUrl)
    .then((response) => response.json())
    .then((json) => parseMeta(json))
    .catch((err) => {
      console.log(err);
    });
});

inputForm.addEventListener('submit', (e) => {
  e.preventDefault();

  let inputUrl = inputField.value;

  let urlRegEx = /https?:\/\/vodstr\.rtvslo\.si\/.+\/playlist\.m3u8\?keylockhash=.+/;
  if (!urlRegEx.test(inputUrl)) return;

  let regEx = /(?<=keylockhash=).+$/;

  let outputUrl = inputUrl.replace(regEx, kHash);

  console.log(inputUrl);
  console.log(outputUrl);

  animate(outputUrl);
});

copyBtn.addEventListener('click', () => {
  inputField.select();
  document.execCommand('copy');
  copyBtn.value = 'copied!';
});

/* -------- function declarations -------- */

function animate(url) {
  inputForm.classList.add('animated');

  setTimeout(function () {
    inputField.value = url;
    submitBtn.hidden = true;
    copyBtn.hidden = false;
  }, 600);

  inputForm.addEventListener('animationend', function () {
    inputForm.classList.remove('animated');
  });
}

function parseMeta(json) {
  console.log('connecting to server 1 ..');

  let jwt = json.response.jwt;

  getData(jwt);
}

function getData(jwt) {
  console.log('connecting to server 2 ..');

  let dataUrl = api + `174717021?client_id=${clientID}&jwt=${jwt}`;

  fetch(proxy + dataUrl)
    .then((response) => response.json())
    .then((json) => findKHash(json))
    .catch((err) => {
      console.log(err);
    });
}

function findKHash(json) {
  let https = json.response.mediaFiles[0].streams.https;
  let regEx = /(?<=keylockhash=).+$/;
  kHash = https.match(regEx)[0];

  console.log(kHash);

  submitBtn.disabled = false;
  submitBtn.style.cursor = 'pointer';
}
