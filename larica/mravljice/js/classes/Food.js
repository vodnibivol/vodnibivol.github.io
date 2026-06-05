export default class Food {
  constructor(p5) {
    this.p5 = p5;
    this.arr = [];
  }

  get totalContent() {
    return this.arr.reduce((acc, cur) => acc + cur.content, 0);
  }

  closestFreeGrain(ant) {
    let closestGrain = null;
    let closestDist = Infinity;

    for (let grain of this.arr) {
      // check if other ant has this grain => skip
      if (grain.ant && grain.ant !== ant && !grain.ant.retired) {
        continue;
      }

      const distToGrain = ant.pos.dist(grain.pos);
      if (distToGrain < closestDist) {
        closestGrain = grain;
        closestDist = distToGrain;
      }
    }

    return closestGrain;
  }

  update() {
    this.arr = this.arr.filter((grain) => !grain.isEaten); // delete eaten food
    this.arr.forEach((grain) => grain.update()); // update sizes
  }

  placeNew(cursorPos) {
    for (let i = 0; i < this.p5.random(1, 5); i++) {
      const offsetPos = p5.Vector.add(cursorPos, p5.Vector.random2D().mult(this.p5.random(30)));
      setTimeout(() => this.arr.push(new Grain(this.p5, offsetPos)), i * 100);
    }
  }

  draw() {
    if (window.debug) {
      this.arr.forEach((grain) => grain.drawArrivalRadius());
    }
    this.arr.forEach((grain) => grain.draw());
  }
}

class Grain {
  constructor(p5, pos) {
    this.p5 = p5;
    this.pos = pos;

    this.ant = null;

    this.maxSize = 10;
    this.content = this.p5.random(1, this.maxSize);
    this.originalContent = this.content;
    this.shownSize = 0; // diameter
  }

  get isEaten() {
    return this.content <= 0;
  }

  reduceContent() {
    this.content -= 0.3;
  }

  update() {
    this.shownSize = this.p5.lerp(this.shownSize, this.content, 0.1);
  }

  draw() {
    this.p5.strokeWeight(1);

    this.p5.fill(240, 100, 100, 50);
    this.p5.stroke(240, 100, 100);

    this.p5.circle(this.pos.x, this.pos.y, this.shownSize);
  }

  drawArrivalRadius() {
    this.p5.strokeWeight(1);

    this.p5.noFill();
    const col = this.p5.color('#fedcda');
    col.setAlpha(360 * (this.shownSize / this.maxSize));
    this.p5.stroke(col);
    this.p5.circle(this.pos.x, this.pos.y, 70);
  }
}
