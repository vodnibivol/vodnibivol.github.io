/* ----- Variables ----- */

const loader = document.getElementById("loader");
const contentDiv = document.getElementById("contents");
const footer = document.querySelector("footer");
const bubble = document.getElementById("bubble");
const infoButton = document.getElementById("info");

let ENTRY;
let INDEX;
let entries_no;

/* ----- Event listeners ----- */

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
  loader.classList.add("hidden");

  contentDiv.innerHTML = entry;

  setTimeout(function () {
    contentDiv.classList.remove("hidden");
  }, 400);
}

function indexRequest() {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open("GET", "./WORDS/index.json", true);
  xmlhttp.send();

  xmlhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      INDEX = JSON.parse(this.responseText);

      entries_no = INDEX.entries;
      console.log("no. of entries : " + entries_no);

      rand = getRand();

      var quotient = Math.floor(rand / INDEX.filesize);
      var remainder = rand % INDEX.filesize;

      entryRequest(quotient, remainder);
    }
  };
}

function entryRequest(q, r) {
  r_filename = INDEX.files[q];
  console.log("filename : " + r_filename);

  var url = `./WORDS/${r_filename}`;

  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open("GET", url, true);
  xmlhttp.send();

  xmlhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      file = JSON.parse(this.responseText);

      ids = Object.keys(file);
      r_id = ids[r];

      console.log("random id : " + r_id);

      ENTRY = file[r_id];

      displayText(ENTRY);
    }
  };
}

indexRequest();

loader.classList.remove("hidden");
