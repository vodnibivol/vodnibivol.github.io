function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  crvki.newInstance();
  frameRate(30);
}

function draw() {
  blendMode(BLEND);
  background('lightpink');

  blendMode(MULTIPLY);
  crvki.update();
  crvki.draw();
}

// --- helpers

const angleBetweenPoints = (x1, y1, x2, y2) => atan2(y2 - y1, x2 - x1);
