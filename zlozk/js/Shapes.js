// SHAPES

const Shapes = {
  arr: [],

  create() {
    const HOW_MANY = 8;
    const colors = generateSpectreSet(HOW_MANY, 30);

    // TODO: preveri ta del kode ...
    for (let i = 0; i < HOW_MANY; ++i) {
      const position = {
        x: Math.random() * (width * 0.8), // ne random, ker je seeded
        y: Math.random() * (height * 0.8), // ne random, ker je seeded
      };

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

  draw() {
    this.arr.forEach((s) => s.draw());
  },
};

class Shape {
  constructor(col, row, position, clr) {
    this.color = color(clr || floor(random(360)), 100, 70, 0.8);

    // get origin square
    this.origin = Grid.get(col, row);
    this.origin.shape = this;
    this.gridSquares = [this.origin];

    // shape squares added later
    this.shapeSquares = [];

    this.position = position;
    this.isDragging = false;

    this.width = 0; // in px; set in createSquares
    this.height = 0; // in px; set in createSquares
  }

  get isHovering() {
    return this.shapeSquares.some((s) => s.isHovering);
  }

  get bbox() {
    return {
      x: this.position.x,
      y: this.position.y,

      top: this.position.y,
      right: this.position.x + this.width,
      bottom: this.position.y + this.height,
      left: this.position.x,
    };
  }

  fallIntoPlace(outsideGrid = false) {
    const HS = SQUARE_SIZE / 2;

    const isInsideGrid =
      this.bbox.left < Grid.bbox.right - HS &&
      this.bbox.right > Grid.bbox.left + HS &&
      this.bbox.top < Grid.bbox.bottom - HS &&
      this.bbox.bottom > Grid.bbox.top + HS;

    if (!outsideGrid && !isInsideGrid) return;

    const xError = (100 * SQUARE_SIZE + this.position.x - Grid.position.x) % SQUARE_SIZE;
    const yError = (100 * SQUARE_SIZE + this.position.y - Grid.position.y) % SQUARE_SIZE;

    this.position.x -= xError;
    this.position.y -= yError;

    if (yError > SQUARE_SIZE / 2) this.position.y += SQUARE_SIZE;
    if (xError > SQUARE_SIZE / 2) this.position.x += SQUARE_SIZE;
  }

  moveIntoFrame() {
    this.position.x += (width - SCREEN_SIZE.width) / 2;
    this.position.y += (height - SCREEN_SIZE.height) / 2;

    // correct if off screen
    this.position.x = min(width - this.width, max(0, this.position.x));
    this.position.y = min(height - this.height, max(0, this.position.y));
  }

  createSquares() {
    const top = min(this.gridSquares.map((s) => s.row)); // row/col
    const right = max(this.gridSquares.map((s) => s.col)); // row/col
    const bottom = max(this.gridSquares.map((s) => s.row)); // row/col
    const left = min(this.gridSquares.map((s) => s.col)); // row/col

    const width = 1 + right - left; // in squares (row/col)
    const height = 1 + bottom - top; // in squares (row/col)

    this.width = width * SQUARE_SIZE; // in px
    this.height = height * SQUARE_SIZE; // in px

    this.shapeSquares = this.gridSquares.map((square) => {
      return new ShapeSquare(square.col - left, square.row - top, this, this.color);
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
