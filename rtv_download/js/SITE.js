/* ----- VARIABLES ----- */

const form = document.getElementById("search");
const inputField = document.getElementById("inputField");
const dlButton = document.getElementById("dlButton");
const link = document.getElementById("link");
const tip = document.getElementById("tip");
const background = document.getElementById("bgnd");
const backgroundImage = document.getElementById("bgndImg");

/* ----- EVENT LISTENERS ----- */

search.addEventListener("keydown", () => {
  tip.classList.add("show");
});

form.addEventListener("submit", (e) => {
  e.preventDefault();

  console.log("submitted");
  var inputUrl = form.inputUrl.value;

  findUrl(inputUrl);
});

/* ----- FUNCTIONS ----- */

(function randomBackground() {
  var randInt = Math.floor(Math.random() * 8);

  // -- background image preload
  backgroundImage.setAttribute("src", `img/bg/bgnd_${randInt}.jpg`);

  backgroundImage.onload = function () {
    background.style["background-image"] = `url(img/bg/bgnd_${randInt}.jpg)`;
    background.classList.remove("hidden");
  };
})();

inputField.select();

function getLink(rtvUrl) {
  arr = rtvUrl.split("/");
  videoId = arr[arr.length - 1];

  return (
    "http://api.rtvslo.si/ava/getRecording/" +
    videoId +
    "?client_id=82013fb3a531d5414f478747c1aca622"
  );
}
