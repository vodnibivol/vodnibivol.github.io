const LETTER_HEIGHT = 7; // TODO: lahko definiraš pri Letters.js
const LETTER_WIDTH = 5;

const ROTATE = true;
const FR = 5;

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
  let urlParams = new URLSearchParams(location.search);
  let msg = atob(urlParams.get('msg'));

  if (msg === 'urica') {
    let d = new Date();

    // let emoji = ['α', 'β', 'γ', 'δ', 'ε'][i % 5];
    let emoji = '%';

    let hours = d.getHours();
    let minutes = d.getMinutes().toString().padStart(2, '0');

    return `${hours}:${minutes}   ${emoji}   `;
  }

  return msg;
}
