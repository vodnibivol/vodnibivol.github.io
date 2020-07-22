/* -------- Variable declarations -------- */

const form = document.getElementById("search");
const inputField = document.getElementById("inputField");
const dlButton = document.getElementById("dlButton");
const link = document.getElementById("link");
const tip = document.getElementById("tip");
const background = document.getElementById("bgnd");
const backgroundImage = document.getElementById("bgndImg");

/* ----- Event listeners ----- */

search.addEventListener("keydown", () => {
  tip.classList.add("show");
});

form.addEventListener("submit", (e) => {
  e.preventDefault();

  var inputUrl = form.inputUrl.value;

  findUrl(inputUrl);
});

/* ----- Function declarations ----- */

function randomBackgroundImage() {
  var imageUrl = `img/bg/bgnd_${getRand()}.jpg`;

  // -- background image preload

  backgroundImage.setAttribute("src", imageUrl);

  backgroundImage.onload = function () {
    background.style["background-image"] = `url(${imageUrl})`;
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
