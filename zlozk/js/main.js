// grid size
const GRID_SIZE = {
  x: 8, // 8
  y: 5, // 5
};

let SCREEN_SIZE; // { width: 0, height: 0 }

const SQUARE_SIZE = 33; // px

let LEVEL;
let WIN = false;

function setup() {
  colorMode(HSL);
  createCanvas(windowWidth, windowHeight);
  SCREEN_SIZE = { width, height }; // TODO: move to Game Logic

  init();
}

function draw() {
  background(100);

  Grid.draw();
  Shapes.draw();
  Text.draw();
}

function init(levelUp = false) {
  // localStorage
  LEVEL = localStorage.getItem('zlozk-level-temp') || 1; // TODO: move to Game Logic
  localStorage.setItem('zlozk-level-temp', LEVEL); // TODO: move to Game Logic

  WIN = false; // TODO: move to Game Logic

  if (levelUp) {
    LEVEL++;
    localStorage.setItem('zlozk-level-temp', LEVEL);
  }

  Random.PRNG_COLOR = alea('color' + LEVEL);
  Random.PRNG_SHAPES = alea('shapes' + LEVEL);

  Grid.create();
  Shapes.create();
}
