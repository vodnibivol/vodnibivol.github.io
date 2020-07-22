"use strict";

/* ----- Variable declarations ----- */

const dlAnchor = document.getElementById("anchor");
const clientID = "82013fb3a531d5414f478747c1aca622";
const proxy = "https://cors-anywhere.herokuapp.com/";

const meta = "https://api.rtvslo.si/ava/getRecordingDrm/";
const api = "https://api.rtvslo.si/ava/getMedia/";

let mediaID;
let dlFilename;
let ext;
let geoblocked;

/* ----- Function declarations ----- */

function findUrl(inputUrl) {
  console.log("input URL : " + inputUrl);

  getID(inputUrl);
}

function getID(inputUrl) {
  mediaID = inputUrl.split("/").pop();

  function validID() {
    if (isNaN(mediaID) || mediaID == 0) return;
    if (inputUrl.substring(0, 21) != "https://4d.rtvslo.si/") return;
    return true;
  }

  validID() ? getMeta() : error();

  function error() {
    tip.innerHTML = "wrong url";
    tip.classList.add("show");
    headShake();
  }
}

function getMeta() {
  startAnim();

  let metaUrl = meta + `${mediaID}?client_id=${clientID}`;

  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open("GET", proxy + metaUrl);
  xmlhttp.send();

  xmlhttp.onreadystatechange = function () {
    if (this.readyState == 4) {
      if (this.status == 429) catchError("Too many requests. Try again later"); // proxy error
      if (this.status == 200) parseMeta(this);
    }
  };
}

function parseMeta(response) {
  var metaJSON = JSON.parse(response.responseText);

  console.log("metadata JSON:");
  console.log(metaJSON);

  try {
    if (Object.keys(metaJSON).includes("error")) throw "Error 404: File not found.";

    /* --- Find metadata --- */

    let response = metaJSON.response;

    let source = response.source;
    let title = response.title;
    let jwt = response.jwt;

    response.mediaType == "video" ? (ext = "mp4") : (ext = "mp3");
    response.geoblocked == 1 ? (geoblocked = true) : (geoblocked = false);

    dlFilename = `${source}_${safeName(title.toLowerCase())}.${ext}`;
    console.log("filename : " + dlFilename);

    let apiUrl = api + `${mediaID}?client_id=${clientID}&jwt=${jwt}`;

    getMedia(apiUrl);
  } catch (err) {
    catchError(err);
  }
}

function getMedia(url) {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open("GET", proxy + url);
  xmlhttp.send();

  xmlhttp.onreadystatechange = function () {
    if (this.readyState == 4) {
      if (this.status == 429) catchError("Too many requests. Try again later"); // proxy error
      if (this.status == 200) parseMedia(this);
    }
  };
}

function parseMedia(response) {
  let mediaJSON = JSON.parse(response.responseText);

  console.log("media JSON :");
  console.log(mediaJSON);

  let mediaFiles = mediaJSON.response.mediaFiles;

  /* ---- Find largest file ---- */

  let bitrates = mediaFiles.map((item) => item.bitrate);
  let largest = bitrates.indexOf(Math.max(...bitrates));

  /* ---- Find media URL ---- */

  let streams = mediaFiles[largest].streams;
  let mediaUrl = streams.https || streams.http.replace("http", "https");

  console.log("url found : " + mediaUrl);

  geoblocked ? openUrl(mediaUrl) : downloadOnSite(mediaUrl);
}

function openUrl(mediaUrl) {
  window.open(mediaUrl, "_blank");

  inputField.value = "";
  inputField.focus();
  tip.innerHTML = "Press enter to download";

  endAnim();
  setProgress(0);
}

function downloadOnSite(mediaUrl) {
  var mediaRequest = new XMLHttpRequest();

  mediaRequest.open("GET", proxy + mediaUrl);
  mediaRequest.responseType = "blob";
  mediaRequest.send();

  mediaRequest.onreadystatechange = function () {
    if (this.readyState == 4) {
      if (this.status == 429) catchError("Too many requests. Try again later"); // proxy error
      if (this.status == 200) {
        var obj = window.URL.createObjectURL(this.response);

        dlAnchor.setAttribute("href", obj);
        dlAnchor.setAttribute("download", dlFilename);
        dlAnchor.click();

        setTimeout(function () {
          endAnim();
          setProgress(0);
        }, 500);

        inputField.value = "";
        inputField.focus();
        tip.innerHTML = "Press enter to download";
      }
    }
    mediaRequest.onprogress = function (e) {
      setProgress((e.loaded / e.total) * 100);
    };
  };
}

function safeName(string) {
  return string
    .replace("č", "c")
    .replace("š", "s")
    .replace("ž", "z")
    .replace(/[^a-z0-9]/gi, "_");
}

function catchError(message) {
  tip.innerHTML = message;
  console.error(message);

  endAnim();
  inputField.focus();
  tip.classList.add("show");
}
