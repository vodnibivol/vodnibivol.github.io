export default class Food {
  constructor(p5) {
    this.p5 = p5;
    this.arr = [];
  }

  update() {
    // delete eaten food
    this.arr = this.arr.filter((grain) => !grain.isEaten);
  }

  placeNew(pos) {
    this.arr.push(new Grain(this.p5, pos));
  }

  draw() {
    this.arr.forEach((grain) => grain.draw());
  }
}

class Grain {
  constructor(p5, pos) {
    this.p5 = p5;

    this.pos = pos;
    this.isFree = true;

    this.content = this.p5.random(3, 40);
  }

  reduceContent() {
    this.content--;
  }

  get isEaten() {
    return this.content <= 0;
  }

  draw() {
    this.p5.fill(240, 100, 100, 50);
    this.p5.stroke(240, 100, 100);
    this.p5.strokeWeight(1);
    const maxSize = 10;
    const size = this.p5.map(this.content, 1, 30, 1, maxSize);
    this.p5.circle(this.pos.x, this.pos.y, size);
  }
}
