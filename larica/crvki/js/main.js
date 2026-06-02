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
