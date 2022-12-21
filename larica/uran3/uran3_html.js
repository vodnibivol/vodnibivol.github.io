let c;

function setup() {
  createCanvas(500, 500);
  pixelDensity(2);
  
  c = new Circles()
  for (let i = 0; i < c.circles.length; i++) {
    let size = map(i, 0, c.circles.length-1, 0, width);
    c.circles[i] = new Circle(size);
  }
  
}

function draw() {
  blendMode(BLEND);
  background(19, 20, 40);
  
  c.update();
  
  blendMode(SCREEN);
  c.draw();
}

class Circles {
  constructor() {
    this.circles = new Array(18);
  }
  
  update() {
    for (let i = 0; i < this.circles.length; i++) {
      this.circles[i].update();
    }
  }
  
  draw() {
    for (let i = this.circles.length -1; i > 0; i--) {
      this.circles[i].draw();
    }
  }
}

class Circle {
  constructor(initialSize) {
    this.maxSize = 0.6;
    this.iter = initialSize;
  }
  
  update() {
    const factor = 60 / (frameRate() || 60);
    this.iter += 0.5 * factor;
    this.size = this.iter % width;
  }
  
  draw() {
    noStroke();
    const alpha = lerp(180, 0, (this.size) / (width * this.maxSize));
    fill(205, 250, 255, alpha);
    circle(width/2, height/2, this.size);
  }
}
