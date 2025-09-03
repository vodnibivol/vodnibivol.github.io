// SHAPES

const Shapes = {
  arr: [],

  create() {
    // init
    this.arr = [];

    const HOW_MANY = 8; // 8
    const colors = generateSpectreSet(HOW_MANY, 30);

    // TODO: preveri ta del kode ...
    for (let i = 0; i < HOW_MANY; ++i) {
      const position = {
        x: Random.range(width * 0.8), // ne random, ker je seeded
        y: Random.range(height * 0.8), // ne random, ker je seeded
      };

      const randomSquare = Grid.randomFreeSquare();
      const s = new Shape(randomSquare.col, randomSquare.row, position, colors[i]);
      this.arr.push(s);
    }

    this.grow();
    this.alignToGrid();

    if (IS_DEV) {
      this.randomRotate();
    }
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

  alignToGrid() {
    this.arr.forEach((sh) => sh.fallIntoPlace(true)); // every shape on screen, not just on grid
  },

  randomRotate() {
    if (!IS_DEV) return;

    this.arr.forEach((shape) => {
      // random rotate: not here !!
      for (let i = 0; i < Random.range(4); ++i) {
        shape.rotateRight();
      }
    });
  },

  draw() {
    this.arr.forEach((s) => s.draw());
  },
};

class Shape {
  constructor(col, row, position, clr) {
    this.color = color(clr || floor(Random.range(360)), 100, 70, 0.8);

    // get origin square
    this.origin = Grid.get(col, row);
    this.origin.shape = this;
    this.gridSquares = [this.origin];

    // shape squares added later
    this.shapeSquares = [];

    this.position = position;
    this.isDragging = false;

    this.width = 0; // cols
    this.height = 0; // rows
  }

  get isHovering() {
    return this.shapeSquares.some((s) => s.isHovering);
  }

  get bbox() {
    const widthPx = this.width * SQUARE_SIZE;
    const heightPx = this.height * SQUARE_SIZE;

    return {
      x: this.position.x,
      y: this.position.y,

      top: this.position.y,
      right: this.position.x + widthPx,
      bottom: this.position.y + heightPx,
      left: this.position.x,

      width: widthPx,
      height: heightPx,
    };
  }

  rotateRight() {
    this.shapeSquares.forEach((s) => {
      const temp = s.col;
      s.col = this.height - s.row;
      s.row = temp;
    });
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
    this.position.x = min(width - this.bbox.width, max(0, this.position.x)); // FIXME: ne deluje, bbox.width = 0?
    this.position.y = min(height - this.bbox.height, max(0, this.position.y));
  }

  createSquares() {
    const top = min(this.gridSquares.map((s) => s.row)); // row/col
    const right = max(this.gridSquares.map((s) => s.col)); // row/col
    const bottom = max(this.gridSquares.map((s) => s.row)); // row/col
    const left = min(this.gridSquares.map((s) => s.col)); // row/col

    this.width = 1 + right - left; // in squares (row/col)
    this.height = 1 + bottom - top; // in squares (row/col)

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
    const randomFreeNeighbour = Random.choose(freeNeighbours, Random.PRNG_SHAPES);
    this.gridSquares.push(randomFreeNeighbour);
    randomFreeNeighbour.shape = this;
  }
}
