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

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function mouseDragged(e) {
  /** 
  TODO: to ne deluje, ker vleče več oblik in ker gre ven, če se prehitro premakneš.
  mora bit tak, da ko klikneš, če klikneš v obliko začne vlečt in spusti, ko spustiš ...
 */
  Shapes.arr.forEach((s) => {
    s.isHovering && s.move(e.movementX, e.movementY);
  });
}
