// grid size
const GRID_SIZE = {
  x: 4,
  y: 4,
};

const SQUARE_SIZE = 35; // px

function setup() {
  randomSeed(45);

  colorMode(HSL);
  createCanvas(windowWidth, windowHeight);

  Grid.create();
  Shapes.create();

  // noLoop();
  // frameRate(5);
}

function draw() {
  background(100);

  Grid.draw();
  Shapes.draw();
}

// --- EVENTS

function windowResized(e) {
  resizeCanvas(windowWidth, windowHeight);
}

function mouseDragged() {
  Drag.onMove();
}

function mousePressed() {
  Drag.onStart();
}

function mouseReleased() {
  Drag.onEnd();
}

// --- DRAG

const Drag = {
  mouseStart: { x: 0, y: 0 },
  shapeStart: { x: 0, y: 0 },
  shape: null,

  get mouseMovement() {
    return {
      x: mouseX - this.mouseStart.x,
      y: mouseY - this.mouseStart.y,
    };
  },

  get shapePosition() {
    return {
      x: this.shapeStart.x + this.mouseMovement.x,
      y: this.shapeStart.y + this.mouseMovement.y,
    };
  },

  onStart() {
    this.shape = Shapes.arr.findLast((s) => s.isHovering);
    if (!this.shape) return;

    // start drag
    this.shape.isDragging = true;
    // move to back
    Shapes.arr = [...Shapes.arr.filter((s) => !s.isDragging), this.shape];

    this.mouseStart = { x: mouseX, y: mouseY };
    this.shapeStart = { x: this.shape.position.x, y: this.shape.position.y };
  },

  onEnd() {
    // if dragging
    if (!this.shape) return;

    this.shape.fallIntoPlace();
    this.shape.isDragging = false;
  },

  onMove() {
    if (!this.shape) return;
    this.shape.position.x = this.shapePosition.x;
    this.shape.position.y = this.shapePosition.y;

    Grid.arr.forEach((s) => s.onShapeHover());
  },
};
