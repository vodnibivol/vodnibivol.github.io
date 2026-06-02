export default class Ants {
  constructor(p5, food) {
    this.p5 = p5;
    this.food = food;

    this.arr = [];
  }

  createNew() {
    this.arr.push(new Ant(this.p5, this.food));
  }

  update() {
    this.arr.forEach((ant) => ant.update());
  }

  draw() {
    this.arr.forEach((ant) => ant.draw());
  }
}

class Ant {
  constructor(p5, food) {
    this.p5 = p5;

    this.food = food;

    this.pos = this.randomEdgePos();
    this.vel = this.p5.createVector(0, 0);
    this.acc = this.p5.createVector(0, 0);

    this.maxSpeed = 6; // 5
    this.maxForce = 0.5; // 0.4
    this.radius = 3; // size

    this.exitPoint = this.pos.copy();
  }

  randomEdgePos() {
    const margin = 20;

    return this.p5.random([
      this.p5.createVector(this.p5.random(this.p5.width + margin), -margin), // top border
      this.p5.createVector(this.p5.random(this.p5.width + margin), this.p5.height + margin), // bottom border
      this.p5.createVector(-margin, this.p5.random(this.p5.height + margin)), // left border
      this.p5.createVector(this.p5.width + margin, this.p5.random(this.p5.height + margin)), // right border
    ]);
  }

  getFreeGrain() {
    let closestGrain = null;
    let closestDist = Infinity;

    for (let grain of this.food.arr) {
      const distToGrain = this.pos.dist(grain.pos);
      if (distToGrain < closestDist) {
        closestGrain = grain;
        closestDist = distToGrain;
      }
    }

    return closestGrain;
  }

  update() {
    // look for grain
    this.grain = this.getFreeGrain();

    if (this.grain) {
      this.seek(this.grain.pos);

      // eat when very close
      const distToGrain = p5.Vector.dist(this.pos, this.grain.pos);
      if (distToGrain < 3) {
        this.eat();
      }

      // proceed to leave when food eaten
      if (this.grain.isEaten) {
        this.grain = null;
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

  // wander() {
  //   const futurePos = this.vel.copy().setMag(100);
  //   futurePos.add(this.pos);
  //   this.p5.circle(futurePos.x, futurePos.y, 30);
  // }

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
