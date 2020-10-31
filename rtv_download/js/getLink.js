'use strict';

/* ----- Variable declarations ----- */

const dlAnchor = document.getElementById('anchor');
const clientID = '82013fb3a531d5414f478747c1aca622';
const proxy = 'https://cors-anywhere.herokuapp.com/';

const meta = 'https://api.rtvslo.si/ava/getRecordingDrm/';
const api = 'https://api.rtvslo.si/ava/getMedia/';

let mediaID;

/* ----- Function declarations ----- */

function findUrl(inputUrl) {
  console.log('input URL : ' + inputUrl);

  getID(inputUrl);
}

function getID(inputUrl) {
  mediaID = inputUrl.split('/').pop();

  let regEx = /^https:\/\/4d\.rtvslo\.si\/arhiv\/[\w-]+\/\d{7,}$/;

  regEx.test(inputUrl) ? main() : wrongUrl();

  function wrongUrl() {
    tip.innerHTML = 'wrong url';
    tip.classList.add('show');
    headShake();
  }
}

async function getMeta() {
  let metaUrl = meta + `${mediaID}?client_id=${clientID}`;

  let response = await fetch(proxy + metaUrl);
  let metaJSON = await response.json();

  console.log(metaJSON);
  return metaJSON;
}

async function getMedia(jwt) {
  let apiUrl = api + `${mediaID}?client_id=${clientID}&jwt=${jwt}`;

  let response = await fetch(proxy + apiUrl);
  let parsedJSON = await response.json();

  console.log(parsedJSON);
  return parsedJSON;
}

async function main() {
  startAnim();

  try {
    /* ------ METADATA ------ */

    let metaJSON = await getMeta();

    if (metaJSON.hasOwnProperty('error')) throw 'Error 404: File not found.';

    /* --- Find metadata --- */

    let response = metaJSON.response;

    let { source, title, jwt, geoblocked } = response;

    let ext;
    response.mediaType == 'video' ? (ext = 'mp4') : (ext = 'mp3');

    let filename = `${source}_${safeName(title.toLowerCase())}.${ext}`;
    console.log('filename : ' + filename);

    /* -------- MEDIA -------- */

    let mediaJSON = await getMedia(jwt);

    let mediaFiles = mediaJSON.response.mediaFiles;

    /* ---- Find largest file ---- */

    let bitrates = mediaFiles.map((item) => item.bitrate);
    let largest = bitrates.indexOf(Math.max(...bitrates));

    /* ---- Find media URL ---- */

    let streams = mediaFiles[largest].streams;
    let mediaUrl = streams.https || streams.http.replace('http', 'https');

    console.log('output URL : ' + mediaUrl);

    geoblocked ? openUrl(mediaUrl) : downloadOnSite(mediaUrl, filename);
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
  setProgress(0);
}

function downloadOnSite(mediaUrl, filename) {
  let xhr = new XMLHttpRequest();

  xhr.open('GET', proxy + mediaUrl);
  xhr.responseType = 'blob';
  xhr.send();

  xhr.onload = function () {
    let obj = window.URL.createObjectURL(this.response);

    dlAnchor.setAttribute('href', obj);
    dlAnchor.setAttribute('download', filename);
    dlAnchor.click();

    setTimeout(function () {
      endAnim();
      setProgress(0);
    }, 500);

    inputField.value = '';
    inputField.focus();
    tip.innerHTML = 'Press enter to download';
  };

  xhr.onprogress = function (e) {
    setProgress((e.loaded / e.total) * 100);
  };
}

function safeName(str) {
  return str
    .replace('č', 'c')
    .replace('š', 's')
    .replace('ž', 'z')
    .replace(/[^a-z0-9]/g, '_');
}
