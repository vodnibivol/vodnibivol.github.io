import { state } from './state.js';

export default class Ants {
  constructor(p5, food) {
    this.p5 = p5;
    this.food = food;

    this.arr = [];
  }

  get recommendedAnts() {
    const foodPerAnt = 40;
    return this.p5.ceil(this.food.totalContent / foodPerAnt);
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
    this.arr.at(-1).retire(); // retire and that is last added
  }

  update() {
    if (this.activeAnts < this.recommendedAnts) {
      this.createNew();
    } else if (this.activeAnts > 1 && this.activeAnts > this.recommendedAnts && this.allHidden) {
      // retire one when they are hidden => they keep eating together until empty
      this.retireOne();
    }

    this.arr = this.arr.filter((ant) => ant.isInFrame || !ant.retired); // remove retired ants when they are outside canvas
    this.arr.forEach((ant) => ant.update());
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

    this.exitPoint = this.pos.copy(); // will get changed
    this.retired = false; // goes away and dies
  }

  get index() {
    return this.ants.arr.indexOf(this);
  }

  randomEdgePos() {
    const margin = 20;

    const canvasCenter = this.p5.createVector(this.p5.width / 2, this.p5.height / 2);
    return p5.Vector.add(canvasCenter, p5.Vector.random2D().setMag(this.p5.width / 2 + margin));
  }

  retire() {
    this.retired = true;
  }

  update() {
    /**
     * RELEASE PREVIOUS GRAIN:
     * ce si vmes premisli, se vedno ostane njen => to ga
     * sprosti za druge (drugace na koncu ostane sama, da
     * poje vse kar si je zadala)
     */
    if (this.grain) {
      this.grain.ant = null;
    }

    // look for new grain
    this.grain = this.food.closestFreeGrain(this);

    if (this.grain && !this.retired) {
      this.grain.ant = this;
      this.seek(this.grain.pos);

      // eat when very close
      if (this.pos.dist(this.grain.pos) < this.grain.shownSize) {
        this.eat();
      }

      // set new exit point when
      if (this.grain.isEaten) {
        this.exitPoint = this.randomEdgePos();
      }
    } else {
      this.seek(this.exitPoint);
    }

    // update location from calculations
    this.vel.add(this.acc);
    this.acc.setMag(0); // reset acceleration
    this.pos.add(p5.Vector.mult(this.vel, state.dt * 66));
  }

  get isInFrame() {
    const margin = 10;
    const canvasCenter = this.p5.createVector(this.p5.width / 2, this.p5.height / 2);
    return p5.Vector.dist(this.pos, canvasCenter) < this.p5.width / 2 + margin;
  }

  seek(target) {
    // calculate new positions
    const desiredVel = p5.Vector.sub(target, this.pos);
    const distance = desiredVel.mag(); // distance to the target

    // arrive => slow down
    {
      const arrivalRadius = 70;
      const arriveVel = this.p5.map(distance, arrivalRadius, 0, this.maxSpeed, 0, true);
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
      const maxTurnAngle = 10 * state.dt;
      const clampedAngleDiff = this.p5.constrain(angleDiff, -maxTurnAngle, maxTurnAngle);

      // Apply the smooth angle to current velocity direction
      desiredVel.setHeading(currentAngle + clampedAngleDiff);
    }

    const correction = p5.Vector.sub(desiredVel, this.vel); // steer === correction
    correction.limit(this.maxForce * state.dt * 66);
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
    if (state.isDebug) {
      const target = this.grain?.pos || this.exitPoint;

      this.p5.strokeWeight(1);

      // line to target
      this.p5.stroke(state.colors[this.index % state.colors.length]);
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
