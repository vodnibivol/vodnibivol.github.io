export default class Ants {
  constructor(p5, food) {
    this.p5 = p5;
    this.food = food;

    this.arr = [];
  }

  get recommendedAnts() {
    const foodPerAnt = 90;
    return this.p5.floor(this.food.totalContent / foodPerAnt);
  }

  get activeAnts() {
    return this.arr.filter((ant) => !ant.retired).length;
  }

  get allHidden() {
    return !this.arr.some((ant) => ant.isInFrame);
  }

  createNew() {
    this.arr.push(new Ant(this.p5, this.food, this));
  }

  retireOne() {
    this.arr.at(-1).retire();
  }

  update() {
    if (this.activeAnts < this.recommendedAnts) {
      this.createNew();
    } else if (this.activeAnts > 1 && this.allHidden) {
      this.retireOne();
    }

    this.arr.forEach((ant) => ant.update());
    this.arr = this.arr.filter((ant) => ant.isInFrame || !ant.retired); // remove retired ants when outside canvas
  }

  draw() {
    this.arr.forEach((ant) => ant.draw());
  }
}

class Ant {
  constructor(p5, food, ants) {
    this.p5 = p5;
    this.food = food;
    this.ants = ants;

    this.grain = null; // get chosen every frame

    this.pos = this.randomEdgePos();
    this.vel = this.p5.createVector(0, 0);
    this.acc = this.p5.createVector(0, 0);

    this.maxSpeed = 6; // 6
    this.maxForce = 0.5; // 0.5
    this.radius = 3; // size

    this.exitPoint = this.pos.copy();
    this.retired = false; // goes away and dies
  }

  get index() {
    return this.ants.arr.indexOf(this);
  }

  randomEdgePos() {
    const margin = 20;

    // Option 1: circle
    const circleCentre = this.p5.createVector(this.p5.width / 2, this.p5.height / 2);
    return p5.Vector.add(circleCentre, p5.Vector.random2D().setMag(this.p5.width / 2 + margin));

    // Option 2: edges
    // return this.p5.random([
    //   this.p5.createVector(this.p5.random(this.p5.width + margin), -margin), // top border
    //   this.p5.createVector(this.p5.random(this.p5.width + margin), this.p5.height + margin), // bottom border
    //   this.p5.createVector(-margin, this.p5.random(this.p5.height + margin)), // left border
    //   this.p5.createVector(this.p5.width + margin, this.p5.random(this.p5.height + margin)), // right border
    // ]);
  }

  retire() {
    this.retired = true;
  }

  update() {
    // release previous grain
    if (this.grain) {
      this.grain.ant = null; // TODO: ali je to potrebno?
    }

    // look for grain
    this.grain = this.food.closestFreeGrain(this);

    if (this.grain && !this.retired) {
      this.grain.ant = this;
      this.seek(this.grain.pos);

      // eat when very close
      const distToGrain = p5.Vector.dist(this.pos, this.grain.pos);
      if (distToGrain < 3) {
        this.eat();
      }

      // proceed to leave when food eaten
      if (this.grain.isEaten) {
        this.exitPoint = this.randomEdgePos();
      }
    } else {
      this.seek(this.exitPoint);
    }

    // update location from calculations
    this.vel.add(this.acc);
    this.acc.setMag(0);
    this.pos.add(this.vel);
  }

  get isInFrame() {
    const margin = 10;
    const circleCentre = this.p5.createVector(this.p5.width / 2, this.p5.height / 2);
    return p5.Vector.dist(this.pos, circleCentre) < this.p5.width / 2 + margin;
  }

  seek(target) {
    // calculate new positions
    const desiredVel = p5.Vector.sub(target, this.pos);
    const distance = desiredVel.mag(); // distance to the target

    // arrive => slow down
    {
      const arriveVel = this.p5.map(distance, 70, 0, this.maxSpeed, 0, true); // 50 => arrival RADIUS
      desiredVel.setMag(arriveVel);
    }

    // smooth the angle transition
    {
      const currentAngle = this.vel.heading();
      const desiredAngle = desiredVel.heading();

      // Calculate the shortest angle difference
      let angleDiff = desiredAngle - currentAngle;
      angleDiff = Math.atan2(Math.sin(angleDiff), Math.cos(angleDiff));

      // Limit the max turn angle per frame (in RAD)
      const maxTurnAngle = 0.15;
      const clampedAngleDiff = this.p5.constrain(angleDiff, -maxTurnAngle, maxTurnAngle);

      // Apply the smooth angle to current velocity direction
      desiredVel.setHeading(currentAngle + clampedAngleDiff);
    }

    const correction = p5.Vector.sub(desiredVel, this.vel); // steer === correction
    correction.limit(this.maxForce);
    this.applyForce(correction);
  }

  applyForce(force) {
    this.acc.add(force);
  }

  eat() {
    this.grain.reduceContent();
  }

  edges() {
    if (this.pos.x > this.p5.width) {
      this.pos.x = 0;
    } else if (this.pos.x < 0) {
      this.pos.x = this.p5.width;
    }

    if (this.pos.y > this.p5.height) {
      this.pos.y = 0;
    } else if (this.pos.y < 0) {
      this.pos.y = this.p5.height;
    }
  }

  draw() {
    if (window.debug) {
      const target = this.grain?.pos || this.exitPoint;
      const colors = ['green', 'red', 'blue', 'pink', 'orange', 'violet', 'black'];

      this.p5.strokeWeight(1);
      this.p5.stroke(colors[this.index % colors.length]);
      this.p5.line(this.pos.x, this.pos.y, target.x, target.y);
    }

    this.p5.noFill();
    this.p5.stroke(0);
    this.p5.strokeWeight(3);

    this.p5.push();
    {
      this.p5.translate(this.pos.x, this.pos.y);
      this.p5.rotate(this.vel.heading());
      this.p5.line(-this.radius, 0, 0, 0);
    }
    this.p5.pop();
  }
}
