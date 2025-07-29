// SQUARES

const Grid = {
  arr: [],

  get origin() {
    return {
      x: width / 2 - (GRID_SIZE.x * SQUARE_SIZE) / 2,
      y: height / 2 - (GRID_SIZE.y * SQUARE_SIZE) / 2,
    };
  },

  create() {
    for (let i = 0; i < GRID_SIZE.y; ++i) {
      for (let j = 0; j < GRID_SIZE.x; ++j) {
        // create a square
        const c = new GridSquare(j, i, this.origin);
        this.arr.push(c);
      }
    }
  },

  get(col, row) {
    return this.arr.find((s) => s.col === col && s.row === row) || null;
  },

  randomFreeSquare() {
    // get all free squares
    const freeSquares = this.arr.filter((s) => !s.shape);

    // return one of them
    return random(freeSquares);
  },

  draw() {
    this.arr.forEach((s) => s.draw());
  },
};

class Square {
  constructor(col, row, anchor = { x: 0, y: 0 }) {
    this.col = col;
    this.row = row;
    this.anchor = anchor;
    this.size = 35;

    this.shape = null;
  }

  get bbox() {
    const x = this.col * this.size;
    const y = this.row * this.size;

    return {
      x: this.anchor.x + x,
      y: this.anchor.y + y,

      top: this.anchor.y + y,
      right: this.anchor.x + x + this.size,
      bottom: this.anchor.y + y + this.size,
      left: this.anchor.x + x,
    };
  }
}

class GridSquare extends Square {
  get neighbours() {
    return [
      Grid.get(this.col + 1, this.row),
      Grid.get(this.col, this.row + 1),
      Grid.get(this.col - 1, this.row),
      Grid.get(this.col, this.row - 1),
    ];
  }

  draw() {
    const c = this.shape?.color || color(255);
    fill(c);
    strokeWeight(3);
    square(this.bbox.x, this.bbox.y, this.size);
  }
}

class ShapeSquare extends Square {
  constructor(col, row, anchor, color) {
    super(col, row, anchor);

    this.color = color;
  }

  get bbox() {
    const x = this.col * this.size;
    const y = this.row * this.size;

    return {
      x: this.anchor.x + x,
      y: this.anchor.y + y,

      top: this.anchor.y + y,
      right: this.anchor.x + x + this.size,
      bottom: this.anchor.y + y + this.size,
      left: this.anchor.x + x,
    };
  }

  draw() {
    const c = this.color || color(255);
    fill(c);
    strokeWeight(3);
    square(this.bbox.x, this.bbox.y, this.size);
  }
}
