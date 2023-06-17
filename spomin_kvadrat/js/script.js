window.gridd = function () {
  return {
    size: Alpine.$persist(3), // how many squares to show

    guesses: [],
    targets: [],

    animating: false,
    isGameOver: false,

    animationTimeout: null,

    init() {
      this.reset();
      this.$watch('size', (val) => {
        if (val < 3) this.size = 3;
        else if (val > 20) this.size = 20;
        else this.reset(true);
      });

      window.addEventListener('keydown', this.onKeyDown.bind(this));
    },

    $watch() {
      this.size;
    },

    get squareSize() {
      return Math.ceil(Math.sqrt(this.size * 2)); // rows/cols
    },

    get isFinished() {
      return this.targets.every((i) => this.guesses.includes(i));
    },

    async onClick(i) {
      if (this.animating || this.isFinished || this.isGameOver) return;

      this.guesses.push(i);

      if (!this.targets.includes(i)) {
        this.isGameOver = true;

        await delay(2000);
        this.reset(true);
      }

      if (this.isFinished) {
        await delay(2000);
        this.reset(true);
      }
    },

    reset(init = this.isFinished) {
      // this.size = Math.max(Math.min(this.size, 20), 3); // TODO: če je modal, se kar sproti spreminja
      // TODO: probaj: da je 3x3, pa vpišeš npr 10. vidiš, kaj je problem ..
      // ne sme se takoj spremenit, ampak onchange komaj ...

      if (init) {
        this.guesses = [];
        this.isGameOver = false;

        const indexes = new Array(this.squareSize ** 2).fill().map((_, i) => i);
        this.targets = shuffled(indexes).slice(0, this.size);

        this.setSize(); // css
        this.animate();
      }

      this.guessedArr = [];
    },

    setSize() {
      const r = document.querySelector(':root');
      r.style.setProperty('--grid-size', this.squareSize); // row/col
    },

    async animate() {
      if (this.animationTimeout) clearTimeout(this.animationTimeout);

      this.animating = true;
      this.animationTimeout = setTimeout(() => (this.animating = false), 2000);
    },

    onKeyDown(e) {
      if (e.key === '+') {
        ++this.size;
        this.reset(true);
      }

      if (e.key === '-') {
        --this.size;
        this.reset(true);
      }

      if (e.key === 's') {
        // random = alea(new Date().valueOf());
        clearTimeout(this.animationTimeout);
        this.reset(true);
      }

      if (e.key === 'Enter') {
        Modal.close();
      }
    },
  };
};

// ---

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

// let random = alea();

random = Math.random;

function shuffled(array, inPlace = false) {
  if (!inPlace) array = [...array]; // create a duplicate array

  let currentIndex = array.length;
  let randomIndex;

  while (currentIndex != 0) {
    randomIndex = Math.floor(random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }

  return array;
}

/// Service Worker
// If this browser supports service workers
if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('sw.js', {
      scope: location.pathname || '/',
    })
    .then(function (reg) {
      // Registration worked
      console.log('Registration succeeded. Scope is ', reg.scope);
      // // Attempt to update
      // reg.update();
    })
    .catch(function (error) {
      // Registration failed
      console.log('Registration failed with ' + error);
    });
}
