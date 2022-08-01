let Q; // will be set in mounted();

const Main = Vue.createApp({
  data() {
    return {
      STORAGE_KEY: 'FLAG_REGIONS',
      qa: null, // in mounted

      menuIsOpen: false,
      guessIsShown: false,
      inputValue: '',
      state: 'GUESSING', // GUESSING, INCORRECT, HELP

      score: 0,

      targetImg: '',
      guessImg: '',

      allRegions: ['europe', 'asia', 'africa', 'americas', 'oceania', 'antarctic'],
      selectedRegions: ['europe', 'asia', 'africa', 'americas', 'oceania', 'antarctic'],
    };
  },

  mounted() {
    // events
    document.addEventListener('click', this.inputFocus);

    // init
    let cachedRegions = localStorage.getItem(this.STORAGE_KEY);

    if (cachedRegions !== null) {
      this.selectedRegions = JSON.parse(cachedRegions);
    } else {
      this.selectedRegions = this.allRegions;
      this.menuIsOpen = true;
    }

    this.init();
    this.inputFocus();
    document.querySelector('.main').classList.remove('hidden');
  },

  methods: {
    inputFocus() {
      document.querySelector('#textInput').focus();
    },

    init() {
      let vals = this.selectedRegions.map((r) => FLAGS[r]).flat();

      Q = new Questions({
        qa: QA,
        values: vals,
      });

      this.nextGuess();
      this.score = 0; // reset score
    },

    openMenu() {
      this.menuIsOpen = true;
    },

    closeMenu() {
      let prev = localStorage.getItem(this.STORAGE_KEY);

      if (prev !== JSON.stringify(this.selectedRegions)) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.selectedRegions));
        this.init();
      }

      this.menuIsOpen = false;
    },

    onEnter() {
      if (this.state === 'GUESSING') this.checkAnswer();
      else this.nextGuess();
    },

    checkAnswer() {
      if (this.inputValue === '?') {
        this.state = 'HELP';
        Q.TARGET.score = -2;
        this.score = 0; // reset score
        this.inputValue = 'ANSWER: ' + Q.TARGET.answer.toUpperCase();
        return;
      }

      if (Q.isCorrect(this.inputValue)) {
        // NOTE: CORRECT
        Q.onCorrect();
        this.score++;
        this.nextGuess();
      } else {
        let question = Q.getQuestion(this.inputValue); // what you wrote

        if (question === undefined) {
          // NOTE: INVALID
          alert('INVALID ANSWER');
        } else {
          // NOTE: INCORRECT
          this.score = 0;
          Q.onIncorrect();
          this.guessImg = question; // render guess

          this.state = 'INCORRECT';
          this.inputValue = 'FALSE. PRESS ENTER TO CONTINUE';
        }
      }
    },

    nextGuess() {
      this.inputValue = '';
      this.state = 'GUESSING';
      Q.next();

      if (!Q.TARGET) alert('NO MORE QUESTIONS.');
      else this.targetImg = Q.TARGET.question; // render question
    },
  },
});

Main.mount('.main');
