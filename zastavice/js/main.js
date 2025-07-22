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
      selectedRegions: [], // in mounted

      allImgs: 0, // for preload
      loadedImgs: 0,
      imgSource: 'https://flagcdn.com/w1280/', // 'img/flags/webp/', 'https://flagcdn.com/w1280/'
      imgExtension: '.webp', // .png / .webp
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
    window.addEventListener('focus', this.inputFocus);

    // local storage
    if (localStorage.ZASTAVICE_LIGHT_THEME) {
      this.lightTheme = localStorage.ZASTAVICE_LIGHT_THEME === 'true';
    }

    if (localStorage.FLAG_REGIONS) {
      try {
        this.selectedRegions = JSON.parse(localStorage.FLAG_REGIONS);
      } catch (error) {
        this.selectedRegions = [];
      }
    }

    if (this.selectedRegions.length === 0 || this.selectedRegions.some((r) => !this.allRegions.includes(r))) {
      this.selectedRegions = this.allRegions;
      this.menuOpen = true;
    }

    $('.main').classList.remove('hidden');
    this.init();
  },

  methods: {
    inputFocus() {
      requestAnimationFrame(function () {
        const inputEl = $('#textInput');
        if (inputEl) inputEl.focus();
      });
    },

    init() {
      // called on reset (menu change ..)
      T = new Training({
        qa: QA, // all questions and answers
        values: this.selectedRegions.map((r) => COUNTRIES[r]).flat(), // selected qa
      });

      this.nextGuess();
      // this.preloadImages().then(this.nextGuess);
    },

    preloadImages() {
      // called only on beginning (size of all not too large < 3mb)
      const prevState = this.state; // save state
      this.state = 'LOADING';

      return new Promise((resolve, reject) => {
        const urls = T.QA.map(([q, a]) => this.imgSource + q + this.imgExtension);
        let loaded = 0;
        $('#preloadProgress').max = urls.length;

        for (let url of urls) {
          const img = new Image();
          img.onload = () => {
            $('#preloadProgress').value = ++loaded;
            if (loaded === urls.length) {
              this.state = prevState;
              resolve();
            }
          };
          img.onerror = reject;
          img.src = url;
        }

        // preload mr. worldwide
        const img = new Image();
        img.src = 'img/ww3.jpg';
      });
    },

    openMenu() {
      this.menuOpen = true;
    },

    closeMenu() {
      const prev = localStorage.getItem(this.STORAGE_KEY);
      if (prev !== JSON.stringify(this.selectedRegions)) {
        $('.target').style.opacity = 0;
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.selectedRegions));
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
        case 'FINISHED':
          this.init();
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
        Animations.zoomTarget();
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
        $('.guess img').onload = Animations.showError;
        $('.guess img').src = this.imgSource + question + this.imgExtension;
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
        $('.target img').onload = Animations.fromHell;
        $('.target img').src = this.imgSource + T.TARGET.question + this.imgExtension;
      } else {
        this.state = 'FINISHED';
        this.inputValue = 'KONEC:)';
        $('.target img').onload = Animations.fromHell;
        $('.target img').src = 'img/ww3.jpg';
      }

      this.inputFocus();
    },
  },
});

// --- HELPER FUNCTIONS

const wait = (duration) => new Promise((resolve, _) => setTimeout(resolve, duration));

Main.mount('.main');
