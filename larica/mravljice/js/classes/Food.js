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
      // TODO: check if other ant has this grain => skip
      if (grain.ant && grain.ant !== ant && !grain.ant.retired) continue;

      const distToGrain = ant.pos.dist(grain.pos);
      if (distToGrain < closestDist) {
        closestGrain = grain;
        closestDist = distToGrain;
      }
    }

    return closestGrain;
  }

  update() {
    // delete eaten food
    this.arr = this.arr.filter((grain) => !grain.isEaten);
    this.arr.forEach((grain) => grain.update());
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
    this.ant = null;

    this.content = this.p5.random(3, 40);
    this.shownSize = 0;
  }

  get isEaten() {
    return this.content <= 0;
  }

  reduceContent() {
    this.content--;
  }

  update() {
    this.shownSize = this.p5.lerp(this.shownSize, this.content, 0.1);
  }

  draw() {
    this.p5.fill(240, 100, 100, 50);
    this.p5.stroke(240, 100, 100);
    this.p5.strokeWeight(1);
    const maxSize = 10;
    const size = this.p5.map(this.shownSize, 1, 30, 1, maxSize);
    this.p5.circle(this.pos.x, this.pos.y, size);
  }
}
