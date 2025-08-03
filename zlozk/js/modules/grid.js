// --- GRID

const Grid = {
  arr: [], // array of squares
  width: 0, // in px; set in create()
  hegiht: 0, // in px; set in create()

  get position() {
    return {
      x: width / 2 - this.width / 2,
      y: height / 2 - this.height / 2,
    };
  },

  get bbox() {
    return {
      top: this.position.y,
      right: this.position.x + this.width,
      bottom: this.position.y + this.height,
      left: this.position.x,
    };
  },

  create() {
    // init
    this.arr = [];

    for (let i = 0; i < GRID_SIZE.y; ++i) {
      for (let j = 0; j < GRID_SIZE.x; ++j) {
        const c = new GridSquare(j, i, this);
        this.arr.push(c);
      }
    }

    this.width = GRID_SIZE.x * SQUARE_SIZE;
    this.height = GRID_SIZE.y * SQUARE_SIZE;
  },

  get isFull() {
    return this.arr.every((sq) => {
      // there is one square on top of it
      return Shapes.arr.some((sh) => {
        return sh.shapeSquares.some((s) => {
          return dist(sq.bbox.x, sq.bbox.y, s.bbox.x, s.bbox.y) < 1;
        });
      });
    });
  },

  get(col, row) {
    return this.arr.find((s) => s.col === col && s.row === row) || null;
  },

  randomFreeSquare() {
    const freeSquares = this.arr.filter((s) => !s.shape);
    return Random.choose(freeSquares, Random.PRNG_SHAPES);
  },

  draw() {
    this.arr.forEach((s) => s.draw());
  },
};

// --- SQUARE

class Square {
  constructor(col, row, parent) {
    this.col = col;
    this.row = row;
    this.parent = parent;

    this.shape = null; // used when creating blocks // TODO: delete?
  }

  get bbox() {
    const x = this.col * SQUARE_SIZE; // relative to grid origin
    const y = this.row * SQUARE_SIZE; // relative to grid origin

    return {
      x: this.parent.position.x + x,
      y: this.parent.position.y + y,

      top: this.parent.position.y + y,
      right: this.parent.position.x + x + SQUARE_SIZE,
      bottom: this.parent.position.y + y + SQUARE_SIZE,
      left: this.parent.position.x + x,
    };
  }

  get isHovering() {
    return mouseX > this.bbox.left && mouseX < this.bbox.right && mouseY > this.bbox.top && mouseY < this.bbox.bottom;
  }
}

// --- GRID SQUARE

class GridSquare extends Square {
  constructor(col, row, parent) {
    super(col, row, parent);
  }

  get neighbours() {
    return [
      Grid.get(this.col + 1, this.row),
      Grid.get(this.col, this.row + 1),
      Grid.get(this.col - 1, this.row),
      Grid.get(this.col, this.row - 1),
    ];
  }

  draw() {
    fill(100);
    stroke(0);
    strokeWeight(3);
    square(this.bbox.x, this.bbox.y, SQUARE_SIZE);
  }
}

// --- SHAPE SQUARE

class ShapeSquare extends Square {
  constructor(col, row, parent, color) {
    super(col, row, parent);

    this.color = color;
  }

  draw() {
    let c = this.color || color(100);
    // if (this.parent.isDragging) c = color('#ffffffbb');

    blendMode(DARKEST);
    fill(c);
    strokeWeight(3);
    square(this.bbox.x, this.bbox.y, SQUARE_SIZE);
  }
}
