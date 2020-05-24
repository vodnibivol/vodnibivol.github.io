/* ----- Variables ----- */

contentsDiv = document.getElementById("contents");
footer = document.querySelector("footer");
bubble = document.getElementById("bubble");
infoButton = document.getElementById("info");

let ENTRY;
let INDEX;
let entries_no;

/* ----- Event listeners ----- */

window.addEventListener("DOMContentLoaded", () => {
  console.log("DOM framework loaded");
  document.querySelector("body").classList.remove("preload");
});

infoButton.addEventListener("click", () => {
  bubble.classList.toggle("open");

  if (bubble.classList.contains("open")) {
    countdown = setTimeout(() => {
      bubble.classList.remove("open");
    }, 5000);
  } else {
    clearTimeout(countdown);
  }
});

/* ----- Functions ----- */

function displayText(entry) {
  entry = entry.replace(
    'href="/133/',
    'target="_blank" href="https://fran.si/133/'
  );

  contentsDiv.innerHTML = entry;
  contentsDiv.classList.remove("hidden");
}

function indexRequest() {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open("GET", "./WORDS/index.json", true);
  xmlhttp.send();

  xmlhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      INDEX = JSON.parse(this.responseText);

      entries_no = INDEX.size;
      console.log("no. of entries : " + entries_no);

      entryRequest();
    }
  };
}

function entryRequest() {
  var randEntry = INDEX.indexes[getRand()]; // random object with id & filename

  console.log("random entry:");
  console.log(randEntry);

  var r_filename = randEntry.file; // where to look for the id
  var r_id = randEntry.ID;
  var url = `./WORDS/${r_filename}`;

  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open("GET", url, true);
  xmlhttp.send();

  xmlhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      file = JSON.parse(this.responseText);

      ENTRY = file[r_id];

      displayText(ENTRY);
    }
  };
}

indexRequest();
