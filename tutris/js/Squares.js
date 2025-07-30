// SQUARES

const Grid = {
  arr: [],

  get position() {
    return {
      x: width / 2 - (GRID_SIZE.x * SQUARE_SIZE) / 2,
      y: height / 2 - (GRID_SIZE.y * SQUARE_SIZE) / 2,
    };
  },

  create() {
    for (let i = 0; i < GRID_SIZE.y; ++i) {
      for (let j = 0; j < GRID_SIZE.x; ++j) {
        // create a square
        const c = new GridSquare(j, i, this);
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
  constructor(col, row, parent) {
    this.col = col;
    this.row = row;
    this.parent = parent;
    this.size = 35;

    this.shape = null;
  }

  get bbox() {
    const x = this.col * this.size;
    const y = this.row * this.size;

    return {
      x: this.parent.position.x + x,
      y: this.parent.position.y + y,

      top: this.parent.position.y + y,
      right: this.parent.position.x + x + this.size,
      bottom: this.parent.position.y + y + this.size,
      left: this.parent.position.x + x,
    };
  }

  get isHovering() {
    return mouseX > this.bbox.left && mouseX < this.bbox.right && mouseY > this.bbox.top && mouseY < this.bbox.bottom;
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
  constructor(col, row, parent, color) {
    super(col, row, parent);

    this.color = color;
  }

  draw() {
    const c = this.parent.isHovering ? color('pink') : this.color || color(255);
    fill(c);
    strokeWeight(3);
    square(this.bbox.x, this.bbox.y, this.size);
  }
}
