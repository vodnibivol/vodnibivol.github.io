"use strict";

/* -------- VARIABLES -------- */

const dlAnchor = document.getElementById("anchor");
const clientID = "82013fb3a531d5414f478747c1aca622";
const proxy = "https://cors-anywhere.herokuapp.com/";

let mediaID;
let dlFilename;

let jwt;
let geoblocked;

/* -------- FUNCTIONS -------- */

function findUrl(input) {
  var inputUrl = input;

  console.log("input URL : " + inputUrl);

  getID(inputUrl);
}

function getID(inputUrl) {
  try {
    var arr = inputUrl.split("/");
    mediaID = arr[arr.length - 1];

    if (inputUrl.substring(0, 21) != "https://4d.rtvslo.si/") throw "wrong url";
    if (isNaN(mediaID) || mediaID == 0) throw "wrong url";

    startAnim();
    getMeta();
  } catch (err) {
    tip.innerHTML = err;
    headShake();
  }
}

function getMeta() {
  var metaUrl = `https://api.rtvslo.si/ava/getRecordingDrm/${mediaID}?client_id=${clientID}`;

  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open("GET", proxy + metaUrl);
  xmlhttp.send();

  xmlhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      var metaJSON = JSON.parse(this.responseText);

      console.log("metadata JSON:");
      console.log(metaJSON);

      try {
        if (Object.keys(metaJSON).includes("error")) throw "Error 404: File not found.";

        /* --- FIND METADATA --- */

        var response = metaJSON.response;
        var ext;

        response.mediaType == "video" ? (ext = "mp4") : (ext = "mp3");

        var title = response.title;
        var source = response.source;

        dlFilename = `${source}_${safeName(title.toLowerCase())}.${ext}`;
        console.log("filename : " + dlFilename);

        jwt = response.jwt;

        Object.keys(response).includes("geoblocked") ? (geoblocked = true) : (geoblocked = false);

        getJSON();
      } catch (err) {
        catchError(err);
      }
    }
  };
}

function getJSON() {
  var apiUrl = `https://api.rtvslo.si/ava/getMedia/${mediaID}?client_id=${clientID}&jwt=${jwt}`;

  var xmlhttp = new XMLHttpRequest();

  xmlhttp.open("GET", proxy + apiUrl);
  xmlhttp.send();

  xmlhttp.onreadystatechange = function () {
    if (this.readyState == 4) {
      if (this.status == 200) parseJSON(this);
      if (this.status == 429) catchError("Too many requests. Try again later"); // proxy error
    }
  };
}

function parseJSON(response) {
  var parsedResponse = JSON.parse(response.responseText);

  console.log("media JSON :");
  console.log(parsedResponse);

  try {
    /* ---- FIND LARGEST FILE ---- */

    var bitrates = [];

    for (var i = 0; i < parsedResponse.response.mediaFiles.length; i++) {
      bitrates.push(parsedResponse.response.mediaFiles[i].bitrate);
    }

    var largest = bitrates.indexOf(Math.max(...bitrates));

    /* ---- FIND MEDIA URL ---- */

    var streams = parsedResponse.response.mediaFiles[largest].streams;
    var mediaUrl = streams.https || streams.http;

    console.log("url found : " + mediaUrl);

    geoblocked ? openUrl(mediaUrl) : downloadOnSite(mediaUrl);
  } catch (err) {
    catchError(err);
  }
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
    if (this.readyState == 4 && this.status == 200) {
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
  };
  mediaRequest.onprogress = function (e) {
    setProgress((e.loaded / e.total) * 100);
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
