const Besedle = {
  data() {
    return {
      guesses: [],
      finished: false,
      target: '',
    };
  },

  mounted() {
    // prepare target
    const random = alea(new Date().toDateString());
    this.target = WORDLIST_TARGETS[Math.floor(random() * WORDLIST_TARGETS.length)];

    // prepare guesses
    this.guesses = new Array(6).fill().map((_, i) => new Row(i));

    // events
    document.addEventListener('keydown', this.onKeyDown);
    document.addEventListener('click', this.onClick);

    [...document.querySelectorAll('[hidden]')].forEach((el) => el.removeAttribute('hidden'));
  },

  methods: {
    onKeyDown(evt) {
      if (this.finished) return;

      const { key } = evt;
      const activeRow = this.guesses.find((g) => !g.fixed);
      if (!activeRow) return;

      if (evt.ctrlKey || evt.metaKey || evt.shiftKey || evt.altKey) return;

      if (key === 'Enter') {
        // mora bit cela vrsta polna, a NE fixed
        activeRow.submit(this.target);
      } else if (key === 'Backspace') {
        // del prev
        const lastLetter = activeRow.letters.findLast((l) => l.value !== '');
        lastLetter.value = '';
        return;
      } else if (/^[a-zčšž]$/iu.test(key)) {
        // letter typed
        const emptySpot = activeRow.letters.find((l) => l.value === '');
        if (!emptySpot) return;
        emptySpot.value = key.toLowerCase();
      }

      this.checkWin();
    },

    checkWin() {
      const lastRow = this.guesses.findLast((g) => g.fixed);
      if (!lastRow) return;
      const win = lastRow.letters.every((l) => l.status === 'correct');
      if (win) {
        this.finished = true;
        // alert('KONEC!');
      }
    },

    openDefinition(row) {
      window.open('https://fran.si/iskanje?query=' + row.value, '_blank');
    },
  },
};

Vue.createApp(Besedle).mount('#main');

// --- HELPERS

function shake(selector) {
  const el = document.querySelector(selector);
  el.addEventListener('animationend', () => (el.style.animation = ''), { once: true });
  el.style.animation = 'shake 0.5s';
}
