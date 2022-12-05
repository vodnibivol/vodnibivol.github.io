function Reflex() {
  return {
    state: 'INIT', // INIT, COUNTDOWN, TIMER, RESULT

    startTime: 0,
    endTime: 10 ** 9, // must be high, because of best

    best: Alpine.$persist(500),
    isNewBest: false,

    get elapsed() {
      return this.endTime - this.startTime;
    },

    get msg() {
      switch (this.state) {
        case 'INIT':
          return 'pritisni space';
        case 'COUNTDOWN':
          return 'počakaj ..';
        case 'TIMER':
          return `${String(this.elapsed).padStart(3, 0)} ms`;
        case 'RESULT':
          return `${String(this.elapsed).padStart(3, 0)} ms`;
      }
    },

    get msg2() {
      if (this.state === 'RESULT') {
        if (this.isNewBest) return 'rekord!';

        if (this.elapsed === 314) return 'π';
        else if (this.elapsed <= 250) return random(['zelo dobro!', 'čestitam!', 'odlično!']);
        else if (this.elapsed >= 250 && this.elapsed < 300) return '&nbsp;';
        else return random(['velik luzer', 'odidi', 'dovolj bo', 'pankrt']);
      }

      return '&nbsp;';
    },

    get bgcolor() {
      const IKB = '#1F18C0';
      const GOLD = 'rgb(250, 210, 0)';

      switch (this.state) {
        case 'INIT':
          return 'black';
        case 'COUNTDOWN':
          return 'black';
        case 'TIMER':
          return IKB; // 'red';
        case 'RESULT':
          if (this.isNewBest) return GOLD; // gold
          return IKB;
      }
    },

    // methods

    init() {
      document.addEventListener('keydown', this.onKeyDown.bind(this));
    },

    refresh() {
      if (this.state === 'TIMER') {
        this.endTime = new Date();
        requestAnimationFrame(this.refresh.bind(this));
      }
    },

    onKeyDown(e) {
      if (e.key !== ' ') return;
      if (this.state === 'COUNTDOWN') return alert('poraz');

      if (this.state === 'INIT' || this.state === 'RESULT') this.startCountdown();
      if (this.state === 'TIMER') this.endTimer();
    },

    startCountdown() {
      setTimeout(this.startTimer.bind(this), 2000 + Math.random() * 5000);
      this.state = 'COUNTDOWN';
    },

    startTimer() {
      this.startTime = new Date();
      this.state = 'TIMER';

      this.refresh();
    },

    endTimer() {
      this.isNewBest = this.elapsed < this.best;
      this.best = Math.min(this.elapsed, this.best);
      this.state = 'RESULT';
    },
  };
}

// utils

function random(arr) {
  // arr can be empty, integer or array
  const randFloat = Math.random();
  if (arr === undefined) return randFloat;
  else if (Number.isInteger(arr)) return Math.floor(randFloat * arr);
  else if (Array.isArray(arr)) {
    const randInt = Math.floor(randFloat * arr.length);
    return arr[randInt];
  }
}
