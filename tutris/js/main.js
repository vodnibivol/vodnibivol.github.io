// grid size
const GRID_SIZE = {
  x: 8,
  y: 5,
};

const SQUARE_SIZE = 35; // px

function setup() {
  // createCanvas(GRID_SIZE.x * SQUARE_SIZE, GRID_SIZE.y * SQUARE_SIZE);
  createCanvas(windowWidth - 50, windowHeight - 50);

  Squares.create();
  Shapes.create();
}

function draw() {
  // background(200);

  Squares.draw();

  // circle(mouseX, mouseY, 50); // TESTING
}

function windowResized() {
  resizeCanvas(windowWidth - 50, windowHeight - 50);
}
