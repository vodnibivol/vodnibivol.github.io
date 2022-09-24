const LETTER_HEIGHT = 7; // TODO: lahko definiraš pri Letters.js
const LETTER_WIDTH = 5;

const FR_MIN = 5;
const FR_MAX = 30;
const FR_DEFAULT = 30;

const ROTATE = true;

let FR, CLOCK;
let FIRST = true;

let grid, display;

let i = 0;

function setup() {
  let message = getMsg();

  grid = new Grid(message); // provide here
  display = new Display();

  createCanvas(display.canvasSize.x, display.canvasSize.y);
  frameRate(FR);
}

function draw() {
  background(20);
  display.render();

  let message = getMsg();
  grid = new Grid(message); // provide here

  ROTATE && display.offset++;
  i++;
}

function getMsg() {
  // TODO: naj preusmeri že prej na form, ne tako pozno in da se vse nalaga ..

  let urlParams = new URLSearchParams(location.search);

  if (urlParams.has('urica')) {
    if (FIRST) {
      history.replaceState({}, document.title, './?urica'); // clear params
      FR = 5;
      FIRST = false;
    }

    let d = new Date();
    let hours = d.getHours().toString().padStart(2, '0');
    let minutes = d.getMinutes().toString().padStart(2, '0');

    let emoji = '%'; // ['α', 'β', 'γ', 'δ', 'ε'][(i %= 5)];
    let colon = d.getSeconds() % 2 === 0 ? ':' : ' ';

    return `${hours}${colon}${minutes}   ${emoji}   `;
  }

  let encodedMsg = urlParams.get('msg');
  let msg = decodeURIComponent(atob(encodedMsg));

  if (FIRST) {
    if (!encodedMsg) {
      location.href = './form.html';
      FR = 20;
      return '% '; // ker se ne nalozi dovolj hitro
    }

    let frameRate = urlParams.get('fr'); // string

    frameRate = parseInt(frameRate) || FR_DEFAULT;
    frameRate = Math.min(Math.max(frameRate, FR_MIN), FR_MAX); // bind to 0 => 30
    frameRate = Math.round(frameRate / 5) * 5; // step == 5

    if (frameRate !== FR_DEFAULT) {
      urlParams.set('fr', frameRate);
      history.replaceState({}, document.title, './?' + urlParams.toString());
    } else {
      urlParams.delete('fr');
      history.replaceState({}, document.title, './?' + urlParams.toString());
    }

    FR = frameRate;
  }

  FIRST = false;

  return msg;
}
