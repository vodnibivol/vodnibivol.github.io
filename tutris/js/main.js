// grid size
const GRID_SIZE = {
  x: 8,
  y: 5,
};

const SQUARE_SIZE = 35; // px

function setup() {
  colorMode(HSL);
  createCanvas(windowWidth, windowHeight);

  Grid.create();
  Shapes.create();

  // noLoop();
}

function draw() {
  background(100);

  Grid.draw();

  Shapes.arr.forEach((s) => s.draw());
  // circle(mouseX, mouseY, 30)
}

// --- EVENTS

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function mouseDragged(e) {
  Shapes.arr.forEach((s) => {
    s.isDragging && s.move(e.movementX, e.movementY);
  });
}

function mousePressed() {
  const hoveringShape = Shapes.arr.findLast((s) => s.isHovering);
  if (hoveringShape) {
    // start drag
    hoveringShape.isDragging = true;
    // move to back
    Shapes.arr = [...Shapes.arr.filter((s) => !s.isDragging), hoveringShape];
  }
}

function mouseReleased() {
  const draggingShape = Shapes.arr.find((s) => s.isDragging);
  if (draggingShape) {
    // end drag
    draggingShape.isDragging = false;
  }
}
