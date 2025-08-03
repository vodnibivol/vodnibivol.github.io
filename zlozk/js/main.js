// grid size
const GRID_SIZE = {
  x: 8, // 8
  y: 5, // 5
};

let SCREEN_SIZE; // { width: 0, height: 0 }

const SQUARE_SIZE = 33; // px

function setup() {
  colorMode(HSL);
  createCanvas(windowWidth, windowHeight);
  SCREEN_SIZE = { width, height };

  Game.init();
}

function draw() {
  blendMode(BLEND);
  background(100);

  Grid.draw();
  Shapes.draw();
  Text.draw();
}
