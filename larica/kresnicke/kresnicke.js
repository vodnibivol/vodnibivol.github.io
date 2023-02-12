const MOVE_SPEED = 0.001;
const B_SPEED = 0.01; // brightness speed
const MARGIN = -100; // -100 px

function setup() {
  createCanvas(600, 600);

  noStroke();
  noiseDetail(5, 0.5);
  colorMode(HSB, 100);
  frameRate(30);
}

function draw() {
  background(0); // (250, 60, 8)

  for (let i = 0; i < 12; ++i) {
    const off = pow(i * 4.3182937, 2); // random constant
    const x = lerp(MARGIN, width - MARGIN, noise(frameCount * MOVE_SPEED + off));
    const y = lerp(MARGIN, height - MARGIN, noise(frameCount * MOVE_SPEED + off + 100));

    const bNoise = noise(frameCount * B_SPEED + off + 50); // brightness noise
    const size = lerp(3, 9, bNoise); // 3 => 9

    blendMode(SCREEN); // zaradi prekrivanja kresnick

    // sij
    fill(255, 0, lerp(0, 15, bNoise)); // 5 => 15
    circle(x, y, size * 3);

    // kresnicka
    fill(lerp(13, 16, bNoise), 100, lerp(-30, 200, bNoise));
    circle(x, y, size);

    blendMode(BLEND);
  }
}
