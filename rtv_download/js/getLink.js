const proxy = "https://cors-anywhere.herokuapp.com/";
const keyl = "?keylockhash=null";
const dlAnchor = document.getElementById("anchor");

let inputLink;
let apiLink;
let JSONFile;
let urlFound;

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

    apiLink = `https://api.rtvslo.si/ava/getRecording/${videoId}?client_id=82013fb3a531d5414f478747c1aca622`;

    getJSON(apiLink);
  } catch (err) {
    console.error(err);
    headShake();
    tip.innerHTML = err;
  }
}

function getJSON(url) {
  startAnim();

  var xmlhttp = new XMLHttpRequest();

  xmlhttp.open("GET", proxy + url, true); // proxy + url
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

  bitrates = [];

  for (i = 0; i < parsedResponse.response.mediaFiles.length; i++) {
    bitrates.push(parsedResponse.response.mediaFiles[i].bitrate);
  }

  largest = bitrates.indexOf(Math.max(...bitrates));

  /* ----- FIND OTHER PROPERTIES ----- */

  var http = parsedResponse.response.mediaFiles[0].streamers.http;

  var archive = http.split("/");
  archive = archive[archive.length - 1];

  var filename = parsedResponse.response.mediaFiles[largest].filename;
  if (filename[0] != "/") {
    filename = "/" + filename;
  }

  urlFound = "https://videoweb2.rtvslo.si/" + archive + filename + keyl;
  console.log("url found :");
  console.log(urlFound);

  var extension = filename.slice(filename.lastIndexOf("."));
  var showName = parsedResponse.response.showName;
  var title = parsedResponse.response.title;
  var source = parsedResponse.response.source;

  var dlFilename = source + "_" + safeName(title.toLowerCase()) + extension;

  downloadOnSite(urlFound, dlFilename);
}

function safeName(string) {
  return string
    .replace("č", "c")
    .replace("š", "s")
    .replace("ž", "z")
    .replace(/[^a-z0-9]/gi, "_");
}

/*
function download(urlFound, filename) {
  dlAnchor.setAttribute("href", urlFound); // urlFound
  dlAnchor.setAttribute("download", filename);

  inputField.value = "";
  inputField.select();
  tip.innerHTML = "Press enter to download";

  if (bounceTime >= 2) {
    endAnim();
    console.log(bounceTime);
  } else {
    setTimeout(() => {
      endAnim();
      console.log(bounceTime);
    }, 1000);

    bounceTime = 0;
  }

  bounceDiv.addEventListener("animationend", openUrl);
}

function openUrl() {
  setTimeout(() => {
    dlAnchor.click();
  }, 1000);

  bounceDiv.removeEventListener("animationend", openUrl);
}
*/

function downloadOnSite(urlFound, filename) {
  var ajax = new XMLHttpRequest();
  ajax.responseType = "blob";
  ajax.open("GET", proxy + urlFound, true); // proxy + urlFound
  ajax.setRequestHeader("x-requested-with", "XMLHttpRequest");
  ajax.send();

  ajax.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      var obj = window.URL.createObjectURL(this.response);
      dlAnchor.setAttribute("href", obj);
      dlAnchor.setAttribute("download", filename);
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
  ajax.onprogress = function (e) {
    setProgress((e.loaded / e.total) * 100);
  };
}
