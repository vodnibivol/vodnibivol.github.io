/* -------- VARIABLES -------- */

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

  var inputUrl = form.inputUrl.value;

  findUrl(inputUrl);
});

/* ----- FUNCTIONS ----- */

function randomBackgroundImage() {
  var randInt = getRand() % 23;

  // -- background image preload

  backgroundImage.setAttribute("src", `img/bg/bgnd_${randInt}.jpg`);

  backgroundImage.onload = function () {
    background.style["background-image"] = `url(img/bg/bgnd_${randInt}.jpg)`;
    background.classList.remove("hidden");
  };
}

function randomBackgroundColor() {
  flatColors = ["#fad390", "#2ecc71"];

  var randInt = getRand() % flatColors.length;

  background.style.background = flatColors[randInt];
  background.classList.remove("hidden");
}

randomBackgroundImage();

inputField.select();
