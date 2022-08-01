let Q; // will be set in mounted();
document.addEventListener('click', () => document.querySelector('#textInput').focus());

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
    let cachedRegions = localStorage.getItem(this.STORAGE_KEY);
    this.selectedRegions = cachedRegions ? JSON.parse(cachedRegions) : {};
    this.init();
  },

  methods: {
    init() {
      let vals = this.selectedRegions.map((r) => FLAGS[r]).flat();

      Q = new Questions({
        qa: QA,
        values: vals,
      });

      if (!Q) throw new Error('Q object must be provided');
      this.nextGuess();
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
