// SQUARES

const Squares = {
  arr: [],

  get gridOrigin() {
    return {
      x: width / 2 - (GRID_SIZE.x * SQUARE_SIZE) / 2,
      y: height / 2 - (GRID_SIZE.y * SQUARE_SIZE) / 2,
    };
  },

  create() {
    for (let i = 0; i < GRID_SIZE.y; ++i) {
      for (let j = 0; j < GRID_SIZE.x; ++j) {
        // create a square
        const c = new Square(j, i);
        this.arr.push(c);
      }
    }
  },

  get(x, y) {
    return this.arr.find((s) => s.x === x && s.y === y) || null;
  },

  randomFreeSquare() {
    // get all free squares
    const freeSquares = this.arr.filter((s) => !s.shape);
    // console.log(this.arr);

    // return one of them
    return randomChoose(freeSquares);
  },

  draw() {
    this.arr.forEach((s) => s.draw());
  },
};

class Square {
  constructor(x, y) {
    this.x = x;
    this.y = y;

    // this.color = color(`hsl(${randomRange(360)}, 100%, 70%)`);
    this.shape = null;
  }

  get neighbours() {
    return [
      Squares.get(this.x + 1, this.y),
      Squares.get(this.x, this.y + 1),
      Squares.get(this.x - 1, this.y),
      Squares.get(this.x, this.y - 1),
    ];
  }

  draw() {
    const c = this.shape?.color || color(255);
    fill(c);
    strokeWeight(3);
    square(Squares.gridOrigin.x + this.x * SQUARE_SIZE, Squares.gridOrigin.y + this.y * SQUARE_SIZE, SQUARE_SIZE);
  }
}
