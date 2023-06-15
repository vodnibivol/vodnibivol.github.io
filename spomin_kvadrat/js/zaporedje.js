const Grid = {
  size: 3,
  arr: [],
  guessIndex: Infinity,
  down: null,
  animating: false,

  init() {
    Modal.alt({
      msg: 'pritisni OK za začetek!',
      onConfirm: this.reset.bind(this),
    });

    window.addEventListener('keydown', (e) => {
      console.log(this, this.size);
      if (e.key === '+') {
        ++this.size;
        this.reset(true);
      } else if (e.key === '-') {
        --this.size;
        this.reset(true);
      }
    });
  },

  get isFinished() {
    return this.guessIndex >= this.arr.length;
  },

  async onClick(i) {
    if (this.animating) return;

    if (this.arr[this.guessIndex] === i) {
      this.guessIndex++;

      if (this.guessIndex === this.arr.length) {
        await delay(100);
        Modal.alt({
          msg: 'bravo dober zapomnjevač si',
          onConfirm: () => {
            this.reset(true);
          },
        });
      }
    } else {
      Modal.alt('narobe');
      await delay(500);
      this.reset();
    }
  },

  reset(shuffle = false) {
    if (shuffle || this.isFinished) {
      this.arr = new Array(this.size ** 2).fill().map((_, i) => i);
      this.setSize();

      this.shuffle();
      this.animate();
    }

    console.log('shuffle');
    console.log(this.size);

    this.guessIndex = 0;
  },

  shuffle() {
    shuffle(this.arr);
  },

  setSize() {
    const r = document.querySelector(':root');
    r.style.setProperty('--grid-size', this.size);
  },

  async animate() {
    if (this.animating) return;
    this.animating = true;

    let i = 0;
    let index = this.arr[i];

    while (index !== undefined) {
      index = this.arr[i];
      this.down = index;
      await delay(500);
      i++;
    }

    this.down = null;
    this.animating = false;
  },
};

// ---

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const random = alea();

function shuffle(array) {
  let currentIndex = array.length;
  let randomIndex;

  while (currentIndex != 0) {
    randomIndex = Math.floor(random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }

  return array;
}
