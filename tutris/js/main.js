// grid size
const GRID_SIZE = {
  x: 12,
  y: 7,
};

const SQUARE_SIZE = 35; // px

function setup() {
  // randomSeed(3);

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
    // ne le this.shapeStart + this.mouseMovement !!
    // => obenem tudi grid snapping (?)
    // ...
    const x = this.shapeStart.x + this.mouseMovement.x;
    const y = this.shapeStart.y + this.mouseMovement.y;

    const xAdoptionToGrid = Grid.position.x % SQUARE_SIZE; // grid position x error
    const yAdoptionToGrid = Grid.position.y % SQUARE_SIZE; // grid position y error

    return {
      x: x - (x % SQUARE_SIZE) + xAdoptionToGrid,
      y: y - (y % SQUARE_SIZE) + yAdoptionToGrid,
    };
  },

  onStart() {
    this.shape = Shapes.arr.findLast((s) => s.isHovering);
    if (this.shape) {
      // start drag
      this.shape.isDragging = true;
      // move to back
      Shapes.arr = [...Shapes.arr.filter((s) => !s.isDragging), this.shape];
    }

    this.mouseStart = { x: mouseX, y: mouseY };
    this.shapeStart = { x: this.shape.position.x, y: this.shape.position.y };
  },

  onEnd() {
    // if dragging
    if (this.shape) {
      this.shape.isDragging = false;
    }
  },

  onMove() {
    // NEKAJ TAKEGA: Shape.position = this.shapePosition;
    // lahko pa tudi tak, da je position vedno tak kot je, pa se samo ko se spusti, snappne na mrežo. odloči se.
    // v bistvu se mi zdi, da bi lahko opustil mouseMoved(), ker itak loopa in na vsak frame izračuna pozicijo oblik itd ... probaj torej brez.
    this.shape.position.x = this.shapePosition.x;
    this.shape.position.y = this.shapePosition.y;
  },
};
