const circles = new Array(10);

function setup() {
  createCanvas(333, 333);
  pixelDensity(2);
  frameRate(30);

  for (let i = 0; i < circles.length; ++i) {
    circles[i] = new Circle(i);
  }
}

function draw() {
  blendMode(BLEND);
  background(19, 20, 40);
  noStroke();

  blendMode(SCREEN);
  for (let i = circles.length; i; --i) {
    circles[i - 1].draw();
  }
}

class Circle {
  constructor(i) {
    this.initSize = lerp(0, width, i / circles.length);
  }

  draw() {
    const size = (this.initSize + frameCount) % width;
    fill(205, 250, 255, lerp(180, 0, size / width));
    circle(width / 2, height / 2, size);
  }
}
