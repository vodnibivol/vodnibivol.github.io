let SCREEN_SIZE; // { width: 0, height: 0 }

const IS_DEV = new URLSearchParams(location.search).has('dev');

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
