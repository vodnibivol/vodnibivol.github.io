contentsDiv = document.getElementById("contents");
infoButton = document.getElementById("info");
footer = document.querySelector("footer");
message = document.getElementById("message");

var ENTRY;
var _INDEX;
var entries_no;

infoButton.addEventListener("click", () => {
  message.classList.toggle("show");
});

function displayText(obj) {
  obj = obj.replace(
    'href="/133/',
    'target="_blank" href="https://fran.si/133/'
  );
  contentsDiv.innerHTML = obj;
  contentsDiv.classList.remove("hidden");
}

/* ------ HTTP Request ------- */

indexRequest();

function indexRequest() {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open("GET", "CHUNKS/_indexes.json", true);
  xmlhttp.send();

  xmlhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      _INDEX = JSON.parse(this.responseText);

      entries_no = _INDEX.size;
      console.log("no. of entries : " + entries_no);

      entryRequest();
    }
  };
}

function entryRequest() {
  var randEntry = _INDEX.entries[getRand()];

  console.log("random entry:");
  console.log(randEntry);

  var filename = randEntry.filename;
  var url = `CHUNKS/${filename}`;

  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open("GET", url, true);
  xmlhttp.send();

  xmlhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      filename = JSON.parse(this.responseText);

      ENTRY = filename[randEntry.ID];

      console.log(ENTRY);
      displayText(ENTRY);
    }
  };
}
