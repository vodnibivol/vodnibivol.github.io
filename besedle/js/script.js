const Besedle = {
  data() {
    return {
      guesses: [],
      finished: false,
      target: '',
      dailyIndex: null,
      keyboardOpen: window.innerWidth < 700,
    };
  },

  mounted() {
    // prepare target
    this.getQueryParams();

    // prepare guesses
    this.guesses = new Array(6).fill().map((_, i) => new Row(i));
    if (this.dailyIndex) {
      this.getStorage();
      this.checkWin();
      this.setKeyboard();
    }

    // events
    document.addEventListener('keydown', this.onKeyDown);
    // document.addEventListener('click', this.onClick);
    new Shortcuts()
      .on('SHIFT+C', this.clearStorage)
      .on('SHIFT+S', this.setKeyboard)
      .on('SHIFT+R', this.randomWord)
      .on('SHIFT+K', () => (this.keyboardOpen = !this.keyboardOpen))
      .listen();

    [...document.querySelectorAll('[hidden]')].forEach((el) => el.removeAttribute('hidden'));
  },

  methods: {
    randomWord() {
      const params = new URLSearchParams(location.search);
      params.set('m', WORDLIST_TARGETS[Math.floor(alea(new Date())() * WORDLIST_TARGETS.length)]);
      location.search = params.toString();
    },

    getQueryParams() {
      const URI = new URL(location.href);
      const DEV = URI.searchParams.has('dev');

      if (URI.searchParams.has('m')) {
        URI.searchParams.set('w', btoa(encodeURIComponent(URI.searchParams.get('m'))));
        URI.searchParams.delete('m');
        window.history.replaceState({}, null, URI.toString());
        if (DEV) console.log(URI);
      }

      try {
        // custom word
        const target = decodeURIComponent(atob(URI.searchParams.get('w') || false));
        if (target.length !== 5 || !WORDLIST_VALID.includes(target)) throw new Error('invalid word: ' + target);
        this.target = target;
      } catch (err) {
        // daily puzzle
        if (DEV) console.error(err);
        const random = alea(new Date().toDateString());
        this.target = WORDLIST_TARGETS[Math.floor(random() * WORDLIST_TARGETS.length)];
        URI.search = '';
        window.history.replaceState({}, null, URI.toString());

        // set daily index for daily puzzle
        this.dailyIndex = 'BESEDLE_' + new Intl.DateTimeFormat('en-GB').format(new Date());
      }
    },

    onKeyDown(evt) {
      if (this.finished) return;

      const { key } = evt;
      const activeRow = this.guesses.find((g) => !g.fixed);
      if (!activeRow) return;

      if (evt.ctrlKey || evt.metaKey || evt.shiftKey || evt.altKey) return;

      if (key === 'Enter') {
        // mora bit cela vrsta polna, a NE fixed
        const isValid = activeRow.submit(this.target);
        if (isValid) {
          this.setStorage();
          setTimeout(this.setKeyboard, 2500);
          // this.setKeyboard();
        } else {
          shake(activeRow.el);
        }
      } else if (key === 'Backspace') {
        // del prev
        const lastLetter = activeRow.letters.findLast((l) => l.value);
        if (lastLetter) lastLetter.value = '';
        return;
      } else if (/^[a-zčšž]$/iu.test(key)) {
        // letter typed
        const emptySpot = activeRow.letters.find((l) => !l.value);
        if (!emptySpot) return;
        emptySpot.value = key.toLowerCase();
      }

      this.checkWin();
    },

    setKeyboard() {
      const els = document.querySelectorAll('#keyboard .keyboard-row .letter');
      [...els].forEach((el) => {
        const { value } = el.dataset;

        const status = ['correct', 'displaced', 'wrong'].find((status) =>
          this.guesses.some((g) => g.letters.some((l) => l.value === value && l.status === status))
        );

        el.dataset.status = status || '';
      });
    },

    getStorage() {
      const val = localStorage.getItem(this.dailyIndex);
      if (!val) return;

      const words = val.split(',');
      this.guesses.forEach((g, i) => {
        g.setValue(words[i]);
        g.submit(this.target);
      });
    },

    setStorage() {
      localStorage.setItem(this.dailyIndex, this.guesses.map((g) => g.value).join(','));
    },

    clearStorage() {
      localStorage.removeItem(this.dailyIndex);
    },

    checkWin() {
      const lastRow = this.guesses.findLast((g) => g.fixed);
      if (!lastRow) return; // no answers

      this.finished = lastRow.isCorrect || lastRow.index === 5;
    },

    openDefinition(row) {
      window.open('https://fran.si/iskanje?query=' + row.value, '_blank');
    },
  },
};

Vue.createApp(Besedle).mount('#main');

// --- HELPERS

function shake(selector) {
  const el = typeof selector === 'object' ? selector : document.querySelector(selector);
  el.addEventListener('animationend', () => (el.style.animation = ''), { once: true });
  el.style.animation = 'shake 0.5s';
}
