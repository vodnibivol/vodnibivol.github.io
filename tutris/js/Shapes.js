// SHAPES

const Shapes = {
  arr: [],

  create() {
    const HOW_MANY = 6;
    const colors = generateSpectreSet(HOW_MANY, 40);

    for (let i = 0; i < HOW_MANY; ++i) {
      const randomSquare = Grid.randomFreeSquare();
      const s = new Shape(randomSquare.col, randomSquare.row, colors[i]);
      this.arr.push(s);
    }

    this.grow();
  },

  // new(c) {
  //   const randomSquare = Grid.randomFreeSquare();
  //   const s = new Shape(randomSquare.x, randomSquare.y, c);
  //   return s;
  // },

  grow() {
    // grow the shapes
    let i = 0;
    while (Grid.randomFreeSquare() && i < 10 ** 6) {
      this.arr[i++ % this.arr.length].grow();
    }

    // clean the grow
    Grid.arr.forEach((square) => {
      delete square.shape;
    });

    this.arr.forEach((shape) => {
      shape.createSquares();
      // console.log(shape);
      delete shape.gridSquares;
    });
  },
};

class Shape {
  constructor(col, row, clr) {
    // this.origin = { x, y };

    this.color = color(`hsl(${floor(clr) || floor(random(360))}, 100%, 70%)`);

    // get origin square
    this.origin = Grid.get(col, row);
    this.origin.shape = this;
    this.gridSquares = [this.origin];
  }

  get position() {
    // BUG: ne deluje dinamično, moraš passat objekt Shape in vedno znova klicat Shape.position ...
    return {
      x: mouseX,
      y: mouseY,
    };
  }

  createSquares() {
    this.top = Math.min(...this.gridSquares.map((s) => s.row));
    this.right = Math.max(...this.gridSquares.map((s) => s.col));
    this.bottom = Math.max(...this.gridSquares.map((s) => s.row));
    this.left = Math.min(...this.gridSquares.map((s) => s.col));

    this.width = 1 + this.right - this.left;
    this.height = 1 + this.bottom - this.top;

    this.shapeSquares = this.gridSquares.map((square) => {
      return new ShapeSquare(square.col - this.left, square.row - this.top, this.position, this.color);
    });

    // console.log(this.top, this.right, this.bottom);
  }

  draw() {
    this.shapeSquares.forEach((s) => s.draw());
  }

  grow() {
    // find all neighbours
    const neighbours = this.gridSquares.map((s) => s.neighbours)?.flat();
    const freeNeighbours = neighbours.filter((n) => n && !n.shape);

    if (!freeNeighbours.length) return;

    // grow in the way of random free neighbour
    const randomFreeNeighbour = random(freeNeighbours);
    this.gridSquares.push(randomFreeNeighbour);
    randomFreeNeighbour.shape = this;
  }
}
