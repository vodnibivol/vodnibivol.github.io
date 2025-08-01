// grid size
const GRID_SIZE = {
  x: 8, // 8
  y: 5, // 5
};

let SCREEN_SIZE; // { width: 0, height: 0 }

const SQUARE_SIZE = 33; // px

let LEVEL;

function setup() {
  // localStorage
  LEVEL = localStorage.getItem('zlozk-level-temp');
  if (!LEVEL) {
    LEVEL = 1;
    localStorage.setItem('zlozk-level-temp', 1);
  }

  randomSeed(LEVEL); // TODO: naredi da piše level

  colorMode(HSL);
  createCanvas(windowWidth, windowHeight);
  SCREEN_SIZE = { width, height };

  Grid.create();
  Shapes.create();

  Shapes.arr.forEach((sh) => sh.fallIntoPlace(true)); // every shape on screen, not just on grid
}

function draw() {
  background(100);

  Grid.draw();
  Shapes.draw();
}
