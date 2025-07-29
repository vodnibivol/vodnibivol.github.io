// SHAPES

const Shapes = {
  arr: [],

  create() {
    const HOW_MANY = 6;
    const colors = generateSpectreSet(HOW_MANY, 40);

    for (let i = 0; i < HOW_MANY; ++i) {
      const s = this.new(colors[i]);
      this.arr.push(s);
    }

    this.fill();
  },

  new(c) {
    const randomSquare = Squares.randomFreeSquare();
    const s = new Shape(randomSquare.x, randomSquare.y, c);
    return s;
  },

  fill() {
    let i = 0;
    while (Squares.randomFreeSquare()) {
      this.arr[i].grow();
      i++;
      i %= this.arr.length;
    }
  },
};

class Shape {
  constructor(x, y, c) {
    // this.origin = { x, y };

    this.color = color(`hsl(${Math.floor(c) || randomRange(360)}, 100%, 70%)`);

    // get anchor square
    const anchor = Squares.get(x, y);
    anchor.shape = this;
    this.squares = [anchor];
  }

  get parts() {
    const top = Math.min(...this.squares.map((s) => s.y));
    const right = Math.max(...this.squares.map((s) => s.x));
    const bottom = Math.max(...this.squares.map((s) => s.y));
    const left = Math.min(...this.squares.map((s) => s.x));

    const width = 1 + right - left;
    const height = 1 + bottom - top;

    const relativeSquares = this.squares.map(({ x, y }) => ({ x: x - left, y: y - top }));
    return { width, height, top, right, bottom, left, relativeSquares };
  }

  grow() {
    // find all neighbours
    const neighbours = this.squares.map((s) => s.neighbours)?.flat();
    const freeNeighbours = neighbours.filter((n) => n && !n.shape);

    if (!freeNeighbours.length) return;

    // grow in the way of random free neighbour
    const randomFreeNeighbour = randomChoose(freeNeighbours);
    this.squares.push(randomFreeNeighbour);
    randomFreeNeighbour.shape = this;
  }
}
