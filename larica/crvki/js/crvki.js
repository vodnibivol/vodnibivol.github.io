const crvki = {
  arr: [],
  maxNumber: 15,
  update() {
    this.arr.forEach((crvek) => crvek.update());

    // check for "dead" ones
    this.arr = this.arr.filter((crvek) => !crvek.isFinished);

    // if there are none, make a new one
    while (this.arr.length < this.maxNumber) {
      this.newInstance();
    }
  },
  draw() {
    this.arr.forEach((crvek) => crvek.draw());
  },
  newInstance() {
    this.arr.push(new Crvek());
  },
};

class Crvek {
  constructor() {
    this.crvLength = random(10, 40);
    this.pathLength = this.crvLength + random(10, 50); // px

    this.startPos = { x: random(width), y: random(height) };
    this.endPos = { x: this.pathLength, y: 0 };
    this.direction = this.getDirection();

    // timing
    this.startFrame = frameCount;
    this.endFrame = this.startFrame + this.pathLength;
    this.relTiming = 0;

    this.segments = [];
    this.createSegments();
  }

  getDirection() {
    // from the start position to the mouse position
    return radians(random(360));
    return angleBetweenPoints(this.startPos.x, this.startPos.y, mouseX, mouseY);
  }

  createSegments() {
    const segments = [];

    const waveScale = 1.3;
    const crvSpeed = 2;

    this.relTiming = ceil((frameCount - this.startFrame) * crvSpeed);

    for (let i = 0; i < this.crvLength; i++) {
      const segmentX = -waveScale * this.crvLength + waveScale * (this.relTiming + i);
      const segmentY = waveScale * sin((i + this.relTiming) / waveScale);
      segments.push({
        x: segmentX,
        y: segmentY,
      });
    }

    this.segments = segments;
  }

  get isFinished() {
    return this.segments.every((seg) => seg.x > this.pathLength);
  }

  update() {
    this.createSegments();
    if (this.isFinished) {
      console.log('finished');
    }
  }

  draw() {
    push();

    {
      translate(this.startPos.x, this.startPos.y);
      rotate(this.direction);

      // --- BODY
      noFill();
      stroke(255, 0, 0, 100);
      strokeWeight(3);
      const visibleSegments = this.segments.filter((segment) => segment.x > 0 && segment.x < this.pathLength);

      beginShape();
      for (let segment of visibleSegments) {
        vertex(segment.x, segment.y);
      }
      endShape();

      // --- HOLES
      if (false) {
        noStroke();
        fill(200, 0, 0, 80);

        const firstSegment = visibleSegments.at(0);
        const lastSegment = visibleSegments.at(-1);

        if (firstSegment.x < 2) {
          ellipse(0, firstSegment.y, 3, 3);
        }

        if (this.pathLength - lastSegment.x < 2) {
          ellipse(this.pathLength, lastSegment.y, 3, 3);
        }
      }
    }

    pop();
  }
}
