// SQUARES

const Grid = {
  arr: [],
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
    for (let i = 0; i < GRID_SIZE.y; ++i) {
      for (let j = 0; j < GRID_SIZE.x; ++j) {
        // create a square
        const c = new GridSquare(j, i, this);
        this.arr.push(c);
      }
    }

    this.width = GRID_SIZE.x * SQUARE_SIZE;
    this.height = GRID_SIZE.y * SQUARE_SIZE;
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
    const x = this.col * this.size; // relative to grid origin
    const y = this.row * this.size; // relative to grid origin

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

  onShapeHover() {
    // const draggingShape = Shapes.arr.find((s) => s.isDragging);
    const isHoveringOver = Shapes.arr.some((shape) => {
      return shape.shapeSquares.some(
        (square) =>
          abs(this.bbox.x - square.bbox.x) <= this.size / 2 && abs(this.bbox.y - square.bbox.y) <= this.size / 2
      );

      // states: EMPTY, EMPTY+OK, FULL+ERR (different shape)
      // NOTE: OK je samo, če so vsi kvadratki pod shape-om prazni. če ni kvadratka ali je poln, ni ok.
    });
    
    if (isHoveringOver) {
      this.hover = this.shape ? 'ERR' : 'OK';
    } else {
      this.hover = null;
    }
  }

  draw() {
    let c;

    if (this.shape) {
      c = this.shape.color;
    } else if (this.hover) {
      c = this.hover === 'OK' ? color('green') : color('red');
    } else {
      c = color(100);
    }

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
    let c;

    // if (this.parent.isDragging) {
    c = color('#ffffffbb');
    // } else {
    //   c = this.color || color(100);
    // }

    // if (this.parent.isHovering) {
    //   c.setAlpha(0.9);
    // } else {
    //   c.setAlpha(1);
    // }

    fill(c);
    strokeWeight(3);
    square(this.bbox.x, this.bbox.y, this.size);
  }
}
