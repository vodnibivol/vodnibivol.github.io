export default class Cursor {
  constructor(p5) {
    this.p5 = p5;
    this.pos = this.p5.createVector(0, 0);
    this.smoothing = 0.5;
  }

  update() {
    this.pos.x = this.p5.lerp(this.pos.x, this.p5.mouseX, this.smoothing);
    this.pos.y = this.p5.lerp(this.pos.y, this.p5.mouseY, this.smoothing);
  }

  draw() {
    this.p5.noCursor();

    this.p5.noFill();
    this.p5.strokeWeight(1);
    this.p5.stroke(0, 0, 0, 30);

    this.p5.line(this.pos.x, 0, this.pos.x, this.p5.height);
    this.p5.line(0, this.pos.y, this.p5.width, this.pos.y);

    this.p5.stroke(0, 0, 0, 150);
    this.p5.rectMode(this.p5.RADIUS);
    this.p5.rect(this.pos.x, this.pos.y, 5, 5);
  }
}
