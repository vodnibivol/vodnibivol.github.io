function Reflex() {
  return {
    state: 'INIT', // INIT, COUNTDOWN, TIMER, RESULT

    startTime: 0,
    endTime: 10 ** 9,

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
          return `${this.elapsed} ms`;
        case 'RESULT':
          return `${this.elapsed} ms`;
      }
    },

    get msg2() {
      if (this.state === 'RESULT') {
        if (this.isNewBest) return 'rekord!';
        else if (this.elapsed <= 250) return random(['zelo dobro!', 'čestitam!', 'odlično!']);
        else if (this.elapsed >= 250 && this.elapsed < 300) return '&nbsp;';
        else return random(['velik luzer', 'odidi', 'dovolj bo', 'pankrt']);
      }

      return '&nbsp;';
    },

    get bgcolor() {
      switch (this.state) {
        case 'INIT':
          return 'black';
        case 'COUNTDOWN':
          return 'black';
        case 'TIMER':
          return 'red';
        case 'RESULT':
          if (this.isNewBest) return 'rgb(250, 210, 0)'; // gold
          return '#1F18C0';
      }
    },

    // methods

    init() {
      document.addEventListener('keydown', this.onKeyDown.bind(this));
    },

    refresh() {
      this.endTime = new Date();
      if (this.state === 'TIMER') requestAnimationFrame(this.refresh.bind(this));
    },

    onKeyDown(e) {
      console.log('key down');
      if (e.key !== ' ') return;
      if (this.state === 'COUNTDOWN') return alert('poraz');

      if (this.state === 'INIT' || this.state === 'RESULT') this.startCountdown();
      if (this.state === 'TIMER') this.endTimer();
    },

    startCountdown() {
      this.state = 'COUNTDOWN';
      setTimeout(this.startTimer.bind(this), 2000 + Math.random() * 5000);
    },

    startTimer() {
      this.state = 'TIMER';
      this.startTime = new Date();
      this.refresh();
    },

    endTimer() {
      this.isNewBest = this.elapsed < this.best;
      console.log(this.isNewBest);
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
