const proxy = "https://cors-anywhere.herokuapp.com/";
const dlAnchor = document.getElementById("anchor");

let inputLink;
let apiLink;
let JSONFile;
let urlFound;

var filename = "download";
var extension = ".mp4";

function findUrl(input) {
  inputLink = input;
  console.log(inputLink);

  getApi(inputLink);
}

function getApi(rtvUrl) {
  try {
    arr = rtvUrl.split("/");
    videoId = arr[arr.length - 1];

    if (rtvUrl.substring(0, 21) != "https://4d.rtvslo.si/") throw "Wrong url";
    if (isNaN(videoId)) throw "Wrong url";

    var header = `https://api.rtvslo.si/ava/getMedia/${videoId}?`;
    var c_id = "client_id=82013fb3a531d5414f478747c1aca622";
    var jwt = "&jwt=NnDuw0UUson3dQ3wP0zwqy0P-hjil-8U0opfPNYcYAc";

    var apiLink = header + c_id + jwt;

    getJSON(apiLink);
    getFilename(videoId);
  } catch (err) {
    console.error(err);
    headShake();
    tip.innerHTML = err;
  }
}

function getJSON(url) {
  startAnim();

  var xmlhttp = new XMLHttpRequest();

  xmlhttp.open("GET", proxy + url); // proxy + url
  xmlhttp.send();

  xmlhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      var JSONFile = this;

      try {
        parseJSON(JSONFile);
      } catch (err) {
        console.error(err);
        tip.innerHTML = "Error 404 - file not found";
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

  console.log("response parsed as JSON :");
  console.log(parsedResponse);

  /* ----- FIND LARGEST FILE ----- */

  var bitrates = [];

  for (i = 0; i < parsedResponse.response.mediaFiles.length; i++) {
    bitrates.push(parsedResponse.response.mediaFiles[i].bitrate);
  }

  largest = bitrates.indexOf(Math.max(...bitrates));

  /* ----- FIND URL ----- */

  streams = parsedResponse.response.mediaFiles[largest].streams;
  urlFound = streams.https || streams.http;

  console.log(urlFound);

  downloadOnSite(urlFound);
}

function safeName(string) {
  return string
    .replace("č", "c")
    .replace("š", "s")
    .replace("ž", "z")
    .replace(/[^a-z0-9]/gi, "_");
}

function getFilename(mediaID) {
  var apiUrl = `https://api.rtvslo.si/ava/getRecordingDrm/${mediaID}?client_id=82013fb3a531d5414f478747c1aca622`;

  var metaRequest = new XMLHttpRequest();
  metaRequest.open("GET", proxy + apiUrl);
  metaRequest.send();

  metaRequest.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      var metaJSON = JSON.parse(this.responseText);
      console.log(metaJSON);

      var response = metaJSON.response;

      if (response.mediaType == "video") {
        extension = ".mp4";
      } else {
        extension = ".mp3";
      }

      var title = response.title;
      var source = response.source;

      filename = source + "_" + safeName(title.toLowerCase());
      console.log(filename);
    }
  };
}

function downloadOnSite(urlFound) {
  var mediaRequest = new XMLHttpRequest();
  mediaRequest.open("GET", proxy + urlFound); // proxy + urlFound
  mediaRequest.responseType = "blob";
  // xmlhttp.setRequestHeader("x-requested-with", "XMLHttpRequest");
  mediaRequest.send();

  mediaRequest.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      var obj = window.URL.createObjectURL(this.response);
      dlAnchor.setAttribute("href", obj);
      dlAnchor.setAttribute("download", filename + extension);
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
