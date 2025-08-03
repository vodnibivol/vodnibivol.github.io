// --- GAME LOGIC

const Game = {
  level: 0,
  levelWon: false,

  init() {
    this.levelWon = false;

    // localStorage
    this.level = localStorage.getItem('zlozk-level-temp') || 1;
    localStorage.setItem('zlozk-level-temp', this.level);

    // init PRNG
    Random.PRNG_COLOR = alea('color' + this.level);
    Random.PRNG_SHAPES = alea('shapes' + this.level);

    Grid.create();
    Shapes.create();
  },

  checkForWin() {
    // check for win sem
    this.levelWon = Grid.isFull;
    if (this.levelWon) {
      this.level++;
      localStorage.setItem('zlozk-level-temp', this.level);
    }
  },
};
