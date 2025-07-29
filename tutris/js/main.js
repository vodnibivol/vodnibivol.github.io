// grid size
const GRID_SIZE = {
  x: 8,
  y: 5,
};

const SQUARE_SIZE = 35; // px

function setup() {
  // createCanvas(GRID_SIZE.x * SQUARE_SIZE, GRID_SIZE.y * SQUARE_SIZE);
  colorMode(HSL);
  createCanvas(windowWidth, windowHeight);

  Grid.create();
  Shapes.create();

  // noLoop();
}

function draw() {
  background(50);

  Grid.draw();

  Shapes.arr[0].draw();
  // circle(mouseX, mouseY, 30)
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// function mouseMoved()