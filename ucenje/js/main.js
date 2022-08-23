let T; // will be set in mounted();

const Main = Vue.createApp({
  data() {
    return {
      QSTRING_KEY: 'UCENJE_QSTRING', // localStorage keys
      SWITCH_KEY: 'UCENJE_SWITCHED', // localStorage keys
      HELP_TEXT: HELP,

      inputValue: '',
      targetKey: '[target]',
      Qstring: '',

      menuOpen: false,
      helpOpen: false,
      mistakesOpen: false,
      valuesSwitched: false,

      score: 0,
      state: '', // LOADING, GUESSING, INCORRECT, HELP, FINISHED

      isMobile: false,
    };
  },

  mounted() {
    // check if mobile
    this.isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (this.isMobile) return;

    // events
    document.addEventListener('click', this.inputFocus);

    // init
    let savedQstring = localStorage.getItem(this.QSTRING_KEY);
    this.valuesSwitched = localStorage.getItem(this.SWITCH_KEY) == 1; // must compare

    if (savedQstring) {
      this.Qstring = savedQstring;
    } else {
      // this.Qstring = '';
      this.menuOpen = true;
      this.helpOpen = true;
    }

    this.init();
  },

  computed: {
    menuBtnString() {
      if (this.menuOpen) return this.Qedited ? 'shrani' : 'zapri';
      else return 'vprašanja';
    },

    validGuesses() {
      return !!Object.keys(toObj(this.Qstring)).length;
    },

    Qedited() {
      // NOTE: just a trigger
      this.menuOpen === 'trigger'; // does nothing

      let lastValuesSwitched = localStorage.getItem(this.SWITCH_KEY) == 1; // must compare
      let valuesChanged = lastValuesSwitched !== this.valuesSwitched;

      let savedQstring = localStorage.getItem(this.QSTRING_KEY);
      let Qchanged = savedQstring !== this.Qstring;

      return Qchanged || valuesChanged;
    },

    mistakes() {
      // NOTE: just a trigger
      this.mistakesOpen === 'trigger'; // does nothing

      let str = '### NAPAKE:';

      let stats = T.GUESSES.sort((a, b) => b.badScore - a.badScore);

      let theWorst = stats.filter((g) => g.badScore >= 4);
      let bad = stats.filter((g) => !theWorst.includes(g) && g.badScore >= 1);

      if (theWorst.length) str += '\n\n' + theWorst.map((g) => `[${g.badScore}] ${g.question}: ${g.answer}`).join('\n');
      if (bad.length) str += '\n\n' + bad.map((g) => `[${g.badScore}] ${g.question}: ${g.answer}`).join('\n');
      if (!theWorst.length && !bad.length) str += '\n\nbrez napak :)';

      return str;
    },
  },

  methods: {
    inputFocus() {
      if (!this.menuOpen) document.querySelector('.guess input').focus();
    },

    init() {
      console.log('INIT');
      let QA = toObj(this.Qstring, true); // true for logging

      T = new Training({
        qa: QA,
        reversed: this.valuesSwitched,
      });

      this.nextGuess();
      this.inputFocus();
      this.setProgress(); // reset
    },

    toggleMenu() {
      if (this.menuOpen) {
        // CLOSE menu
        if (!this.Qstring) return;

        if (this.Qedited) {
          localStorage.setItem(this.QSTRING_KEY, this.Qstring);
          localStorage.setItem(this.SWITCH_KEY, this.valuesSwitched ? '1' : '0');
          this.init();
        }

        this.menuOpen = false;
        this.helpOpen = false;
        this.mistakesOpen = false;
      } else {
        // OPEN menu
        this.menuOpen = true;
      }
    },

    switchValues() {
      this.valuesSwitched = !this.valuesSwitched;
      this.helpOpen = false;
      this.mistakesOpen = false;
    },

    openHelp() {
      this.mistakesOpen = false; // close worst
      this.helpOpen = !this.helpOpen;
    },
    openMistakes() {
      this.helpOpen = false; // close help
      this.mistakesOpen = !this.mistakesOpen;
    },

    onEnter() {
      if (this.state === 'GUESSING') this.checkAnswer();
      else if (this.state === 'FINISHED') {
        if (/^(ponovi|\++)$/.test(this.inputValue)) this.init();
      } else this.nextGuess();
    },

    scrollToRight() {
      setTimeout(function () {
        let el = document.querySelector('.guess input');
        el.scrollLeft = el.scrollWidth; // lahko je tudi več, kot je mogoče
      }, 0);
    },

    checkAnswer() {
      if (this.inputValue === '') return;

      if (this.inputValue === '?') {
        // NOTE: EMPTY
        T.onEmpty();
        this.state = 'HELP';
        this.inputValue = 'ODG: ' + T.TARGET.answer;
        this.scrollToRight();
      } else if (T.isCorrect(this.inputValue)) {
        // NOTE: CORRECT
        T.onCorrect();
        this.nextGuess();
      } else {
        let question = T.getQuestion(this.inputValue); // question to your answer

        if (question === undefined) {
          // NOTE: INVALID
          T.onInvalid();
          shake('.box-container');
        } else {
          // NOTE: INCORRECT
          T.onIncorrect();
          this.state = 'INCORRECT';
          this.inputValue = `narobe .. [${this.inputValue}]`;
          this.scrollToRight();
        }
      }

      this.setProgress();
      console.log('slabi odgovori: ' + T.GUESSES.filter((g) => g.badScore > 1).map((g) => g.question));
    },

    nextGuess() {
      this.inputValue = '';
      T.next();

      if (!!T.TARGET) {
        this.state = 'GUESSING';
        this.targetKey = T.TARGET.question; // render question
      } else {
        this.onFinished();
      }
    },

    setProgress() {
      this.score = this.state === 'FINISHED' ? 100 : T.score;
    },

    onFinished() {
      let perfectScore = T.GUESSES.every((guess) => guess.badScore === 0);
      this.state = 'FINISHED';
      this.targetKey = 'konecツ';
      this.inputValue = perfectScore ? 'vse si imel prav!' : "napake: meni > '!'"; // 'ponovi?';
      this.setProgress();
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

const HELP = `\
### NAVODILA:

# vnesi pare v obliki:

rotundus: okrogel
dies: dan
proprium: značilnost

# vse besedilo, ki se začne z '#',
# je komentar in bo ignorirano pri
# učenju.

# z gumbom 'shrani' / 'zapri' lahko
# začneš reševanje.

# z gumbom 'zamenjaj' zamenjaš pare
# vprašanj in odgovorov.

# z gumbom '?' odpreš / zapreš
# navodila.

### REŠEVANJE

# POMOČ dobiš z odgovorom '?'. tak
# odgovor se točkuje z -2 točkami.

# po končanem reševanju lahko vajo
# ponoviš z odgovorom 'ponovi' ali
# zgolj '+'.
`;

Main.mount('.main');
