// --- GAME LOGIC

const Game = {
  levelWon: false,

  get level() {
    return localStorage.getItem('zlozk-level-temp') || 1;
  },

  set level(value) {
    localStorage.setItem('zlozk-level-temp', value);
  },

  init() {
    this.levelWon = false;

    // init PRNG
    Random.PRNG_COLOR = alea('color' + this.level);
    Random.PRNG_SHAPES = alea('shapes' + this.level);

    Grid.create();
    Shapes.create();
  },

  checkForWin() {
    this.levelWon = Grid.isFull;
    if (this.levelWon) {
      this.level++;

      confetti({ particleCount: 50, spread: 70, origin: { x: 0, y: 0.45 }, angle: 60 });
      confetti({ particleCount: 50, spread: 70, origin: { x: 1, y: 0.45 }, angle: 120 });
    }
  },
};
