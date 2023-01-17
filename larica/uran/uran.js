function setup() {
  createCanvas(333, 333);
  pixelDensity(2);
  frameRate(30);
  noStroke();
}

function draw() {
  blendMode(BLEND);
  background(19, 20, 40);

  blendMode(SCREEN);
  for (let i = 10; i; --i) {
    const size = (lerp(0, width, i / 10) + frameCount) % width;
    fill(205, 250, 255, lerp(180, 0, size / width));
    circle(width / 2, height / 2, size);
  }
}
