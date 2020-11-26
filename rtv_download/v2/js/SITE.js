/* -------- Variable declarations -------- */

const form = document.getElementById('search');
const inputField = document.getElementById('inputField');
const dlButton = document.getElementById('dlButton');
const link = document.getElementById('link');
const tip = document.getElementById('tip');
const background = document.getElementById('bgnd');
const backgroundImage = document.getElementById('bgndImg');

/* ----- Event listeners ----- */

document.addEventListener('DOMContentLoaded', function () {
  document.querySelector('body').classList.remove('preload');
});

search.addEventListener('keydown', () => {
  tip.classList.add('show');
});

form.addEventListener('submit', (e) => {
  e.preventDefault();

  let inputUrl = form.inputUrl.value;

  findUrl(inputUrl);
});

/* ----- Function declarations ----- */

(function randomBackgroundImage() {
  let imageUrl = `../img/bg/bgnd_${getRand()}.jpg`;

  // -- background image preload

  backgroundImage.setAttribute('src', imageUrl);

  backgroundImage.onload = function () {
    background.style['background-image'] = `url(${imageUrl})`;
    background.classList.remove('hidden');
  };
})();

(function runServer() {
  let startTime = new Date();
  console.log('server waking up ..');

  fetch('https://rtv-api.herokuapp.com/').then(() => {
    let endTime = new Date();
    console.log(`server started in ${(endTime - startTime) / 1000} seconds.`);
  });
})();

function randomBackgroundColor() {
  flatColors = ['#fad390', '#2ecc71'];

  let randInt = getRand() % flatColors.length;

  background.style.background = flatColors[randInt];
  background.classList.remove('hidden');
}

inputField.select();
