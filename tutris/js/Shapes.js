// SHAPES

const Shapes = {
  arr: [],

  create() {
    const HOW_MANY = 6;
    const colors = generateSpectreSet(HOW_MANY, 40);

    for (let i = 0; i < HOW_MANY; ++i) {
      const position = { x: random(width * 0.8), y: random(height * 0.8) };
      const randomSquare = Grid.randomFreeSquare();
      const s = new Shape(randomSquare.col, randomSquare.row, position, colors[i]);
      this.arr.push(s);
    }

    this.grow();
  },

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
      delete shape.gridSquares;
    });
  },
};

class Shape {
  constructor(col, row, position, clr) {
    this.color = color(`hsl(${floor(clr) || floor(random(360))}, 100%, 70%)`);

    // get origin square
    this.origin = Grid.get(col, row);
    this.origin.shape = this;
    this.gridSquares = [this.origin];

    // shape squares added later
    this.shapeSquares = [];

    this.position = position; // NOTE: hardcoded for now
  }

  get isHovering() {
    return this.shapeSquares.some((s) => s.isHovering);
  }

  move(x, y) {
    this.position.x += x;
    this.position.y += y;
  }

  createSquares() {
    this.top = Math.min(...this.gridSquares.map((s) => s.row));
    this.right = Math.max(...this.gridSquares.map((s) => s.col));
    this.bottom = Math.max(...this.gridSquares.map((s) => s.row));
    this.left = Math.min(...this.gridSquares.map((s) => s.col));

    this.width = 1 + this.right - this.left;
    this.height = 1 + this.bottom - this.top;

    this.shapeSquares = this.gridSquares.map((square) => {
      return new ShapeSquare(square.col - this.left, square.row - this.top, this, this.color);
    });
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
