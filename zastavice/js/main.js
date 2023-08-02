let Q; // will be set in mounted();
window.$ = window.$ || ((sel) => document.querySelector(sel));

const Main = Vue.createApp({
  data() {
    return {
      lightTheme: false,
      STORAGE_KEY: 'FLAG_REGIONS',
      qa: null, // in mounted

      menuOpen: false, // NOTE: mora biti ločeno, da se vrne na prejšnje stanje
      inputValue: '',
      state: '', // LOADING, GUESSING, INCORRECT, HELP, FINISHED
      score: 0,

      targetImg: '',
      guessImg: '',

      allRegions: ['europe', 'asia', 'africa', 'americas', 'oceania', 'antarctic'],
      selectedRegions: null, // in mounted

      allImgs: 0, // for preload
      loadedImgs: 0,
      imgSource: 'https://flagcdn.com/w1280/', // './img/flags/webp/'
      imgExtension: '.webp', // .png
    };
  },

  watch: {
    lightTheme(isToggled) {
      document.body.className = isToggled ? 'light' : '';
      localStorage.ZASTAVICE_LIGHT_THEME = isToggled;
    },
  },

  mounted() {
    // events
    document.addEventListener('click', this.inputFocus);

    // init
    if (localStorage.ZASTAVICE_LIGHT_THEME) {
      this.lightTheme = localStorage.ZASTAVICE_LIGHT_THEME === 'true';
    }
    const cachedRegions = localStorage.getItem(this.STORAGE_KEY);

    if (cachedRegions) {
      this.selectedRegions = JSON.parse(cachedRegions);
    } else {
      this.selectedRegions = this.allRegions;
      this.menuOpen = true;
    }

    this.init();
    document.querySelector('.main').classList.remove('hidden');
  },

  methods: {
    inputFocus() {
      if (['GUESSING', 'INCORRECT', 'HELP'].includes(this.state)) document.querySelector('#textInput').focus();
    },

    init() {
      // called on reset (menu change ..)
      Q = new Training({
        qa: QA, // all questions and answers
        values: this.selectedRegions.map((r) => COUNTRIES[r]).flat(), // selected qa
      });

      this.preloadImages(() => {
        this.nextGuess();
        this.inputFocus();
      });
    },

    preloadImages(callback) {
      // called only on beginning (size of all not too large < 3mb)
      const prevState = this.state; // save state
      this.state = 'LOADING';

      const urls = Q.QA.map(([q, a]) => this.imgSource + q + this.imgExtension);
      this.allImgs = urls.length;
      this.loadedImgs = 0;

      for (let url of urls) {
        const img = new Image();
        img.onload = () => {
          this.loadedImgs++;
          if (this.loadedImgs === this.allImgs) {
            if (callback) callback();
            else this.state = prevState;
          }
        };
        img.onerror = (e) => {
          console.error(e);
        };
        img.src = url;
      }
    },

    openMenu() {
      this.menuOpen = true;
    },

    closeMenu() {
      let prev = localStorage.getItem(this.STORAGE_KEY);

      if (prev !== JSON.stringify(this.selectedRegions)) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.selectedRegions));
        this.init();
      }

      this.menuOpen = false;
    },

    onEnter() {
      if (this.state === 'GUESSING') this.checkAnswer();
      else this.nextGuess();
    },

    checkAnswer() {
      if (this.inputValue === '') return;

      if (this.inputValue === '?') {
        // EMPTY
        Q.onEmpty();
        this.state = 'HELP';
        this.inputValue = 'ODG: ' + Q.TARGET.answer;
        return;
      } else if (Q.isCorrect(this.inputValue)) {
        // CORRECT
        Q.onCorrect();
        this.score++;
        this.nextGuess();
      } else {
        let question = Q.getQuestion(this.inputValue); // question to your answer (image)

        if (question === undefined) {
          // INVALID
          Q.onInvalid();
          shake('.target');
        } else {
          // INCORRECT
          Q.onIncorrect(this.inputValue);
          this.guessImg = this.imgSource + question + this.imgExtension; // render guess
          this.state = 'INCORRECT';
          this.inputValue = 'narobe ..';
        }
      }

      this.setProgress();
    },

    setProgress() {
      this.score = this.state === 'FINISHED' ? 100 : Q.score;
    },

    nextGuess() {
      this.inputValue = '';
      Q.next();

      if (Q.TARGET) {
        this.state = 'GUESSING';
        this.targetImg = this.imgSource + Q.TARGET.question + this.imgExtension; // render question
      } else {
        this.state = 'FINISHED';
        this.inputValue = 'KONEC:)';
        this.targetImg = "./img/ww3.jpg"
      }
    },
  },
});

// --- HELPER FUNCTIONS

function shake(selector) {
  // shakes element (like shaking head)
  let el = document.querySelector(selector);
  el.addEventListener('animationend', () => (el.style.animation = ''), { once: true });
  el.style.animation = 'shake 0.4s';
}

Main.mount('.main');
