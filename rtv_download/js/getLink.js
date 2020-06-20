"use strict";

/* -------- VARIABLES -------- */

const dlAnchor = document.getElementById("anchor");
const clientID = "82013fb3a531d5414f478747c1aca622";
const proxy = "https://cors-anywhere.herokuapp.com/";

let jwt;
let mediaID;
let dlFilename;

let geoblocked = false;

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
    if (isNaN(mediaID)) throw "wrong url";

    startAnim();
    getMeta();
  } catch (err) {
    console.error(err);
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

      var response = metaJSON.response;
      var ext;

      response.mediaType == "video" ? (ext = "mp4") : (ext = "mp3");

      var title = response.title;
      var source = response.source;

      dlFilename = `${source}_${safeName(title.toLowerCase())}.${ext}`;
      console.log(dlFilename);

      jwt = response.jwt;

      Object.keys(response).includes("geoblocked") ? (geoblocked = true) : (geoblocked = false);

      getJSON();
    }
  };
}

function getJSON() {
  var apiUrl = `https://api.rtvslo.si/ava/getMedia/${mediaID}?client_id=${clientID}&jwt=${jwt}`;

  var xmlhttp = new XMLHttpRequest();

  xmlhttp.open("GET", proxy + apiUrl);
  xmlhttp.send();

  xmlhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      var JSONFile = this;

      try {
        parseJSON(JSONFile);
      } catch (err) {
        console.error(err);
        tip.innerHTML = err;
        tip.classList.add("show");
        endAnim();
      }
    }
    if (this.status == 429) {
      console.error("caught error 429 ...");
      tip.innerHTML = "Too many requests. Try again later";
      tip.classList.add("show");
      endAnim();
    }
  };
}

function parseJSON(response) {
  var parsedResponse = JSON.parse(response.responseText);

  console.log("media JSON :");
  console.log(parsedResponse);

  /* ---- FIND LARGEST FILE ---- */

  var bitrates = [];

  for (var i = 0; i < parsedResponse.response.mediaFiles.length; i++) {
    bitrates.push(parsedResponse.response.mediaFiles[i].bitrate);
  }

  var largest = bitrates.indexOf(Math.max(...bitrates));

  /* ---- FIND MEDIA URL ---- */

  var streams = parsedResponse.response.mediaFiles[largest].streams;
  var mediaUrl = streams.https || streams.http;

  // mediaUrl = mediaUrl.replace("http", "https");

  console.log("url found : " + mediaUrl);

  geoblocked ? openUrl(mediaUrl) : downloadOnSite(mediaUrl);
}

function openUrl(mediaUrl) {
  inputField.value = "";
  inputField.select();
  tip.innerHTML = "Press enter to download";

  endAnim();
  setProgress(0);

  setTimeout(function () {
    window.open(mediaUrl, "_blank");
  }, 500);
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
      inputField.select();
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
