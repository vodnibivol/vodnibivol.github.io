let T; // will be set in mounted();
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

      allRegions: ['europe', 'asia', 'africa', 'americas', 'oceania', 'antarctic'],
      selectedRegions: null, // in mounted

      allImgs: 0, // for preload
      loadedImgs: 0,
      imgSource: 'https://flagcdn.com/w1280/', // 'img/flags/webp/', 'https://flagcdn.com/w1280/'
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
      this.selectedRegions = cachedRegions.split('+');
    } else {
      this.selectedRegions = this.allRegions;
      this.menuOpen = true;
    }

    $('.main').classList.remove('hidden');
    this.init();
  },

  methods: {
    inputFocus() {
      if (['GUESSING', 'INCORRECT', 'HELP'].includes(this.state)) {
        setTimeout(() => {
          $('#textInput').focus();
          // console.log('focus');
        }, 5);
      }
    },

    init() {
      // called on reset (menu change ..)
      T = new Training({
        qa: QA, // all questions and answers
        values: this.selectedRegions.map((r) => COUNTRIES[r]).flat(), // selected qa
      });

      this.preloadImages(this.nextGuess);
    },

    preloadImages(callback) {
      // called only on beginning (size of all not too large < 3mb)
      const prevState = this.state; // save state
      this.state = 'LOADING';

      const urls = T.QA.map(([q, a]) => this.imgSource + q + this.imgExtension);
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
      const prev = localStorage.getItem(this.STORAGE_KEY);
      if (prev !== this.selectedRegions.join('+')) {
        $('.target').style.opacity = 0;
        localStorage.setItem(this.STORAGE_KEY, this.selectedRegions.join('+'));
        this.init();
      }
      this.menuOpen = false;
    },

    onEnter() {
      if (anime.running.length) return;

      switch (this.state) {
        case 'GUESSING':
          this.checkAnswer();
          break;
        case 'INCORRECT':
          Animations.hideError().then(this.nextGuess);
          break;
        case 'HELP':
          Animations.toHell().then(this.nextGuess);
          break;
        default:
          this.nextGuess();
      }
    },

    checkAnswer() {
      if (this.inputValue === '') return;

      if (this.inputValue === '?') {
        // EMPTY
        T.onEmpty();
        this.state = 'HELP';
        this.inputValue = 'ODG: ' + T.TARGET.answer;
        return;
      }

      const question = T.getQuestion(this.inputValue); // question to your answer (image)

      if (question === undefined) {
        // INVALID
        T.onInvalid();
        Animations.shake('.target');
      } else if (T.isCorrect(this.inputValue)) {
        // CORRECT
        T.onCorrect();
        this.inputValue = '';
        Animations.toHeaven().then(this.nextGuess);
      } else {
        // INCORRECT
        T.onIncorrect(this.inputValue);
        this.state = 'INCORRECT';
        this.inputValue = 'narobe ..';
        $('.guess img').src = this.imgSource + question + this.imgExtension;
        $('.guess img').onload = Animations.showError;
      }

      this.setProgress();
    },

    setProgress() {
      this.score = this.state === 'FINISHED' ? 100 : T.score;
    },

    nextGuess() {
      this.inputValue = '';
      T.next();

      if (T.TARGET) {
        this.state = 'GUESSING';
        $('.target img').src = this.imgSource + T.TARGET.question + this.imgExtension;
        $('.target img').onload = Animations.fromHell;
      } else {
        this.state = 'FINISHED';
        this.inputValue = 'KONEC:)';
        this.targetImg = 'img/ww3.jpg';
      }

      this.inputFocus();
    },
  },
});

// --- HELPER FUNCTIONS

Main.mount('.main');
