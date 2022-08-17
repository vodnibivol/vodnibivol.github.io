let T; // will be set in mounted();

const Main = Vue.createApp({
  data() {
    return {
      STORAGE_KEY: 'TEXT_TRAIN_QUESTIONS',
      HELP_TEXT: HELP,

      inputValue: '',
      targetKey: '[target]',
      Qstring: '',

      menuOpen: false, // NOTE: mora biti ločeno, da se vrne na prejšnje stanje
      helpOpen: false,
      valuesSwitched: false,
      edited: false,

      score: 0,

      state: '', // LOADING, GUESSING, INCORRECT, HELP, FINISHED
    };
  },

  mounted() {
    // events
    document.addEventListener('click', this.inputFocus);

    // init
    let cachedQuestions = localStorage.getItem(this.STORAGE_KEY);

    if (cachedQuestions) {
      this.Qstring = cachedQuestions;
    } else {
      console.log('NO CACHE');
      this.Qstring = '';
      this.menuOpen = true;
      this.helpOpen = true;
    }

    this.init();
    document.querySelector('.main').classList.remove('hidden');
  },

  computed: {
    menuBtnString() {
      if (this.menuOpen) {
        return this.edited ? 'shrani' : 'zapri';
      }

      return 'vprašanja';
    },
  },

  methods: {
    inputFocus() {
      try {
        document.querySelector('.guess input').focus();
      } catch (e) {
        console.log('not focusing on input');
      }

      // if (['GUESSING', 'INCORRECT', 'HELP'].includes(this.state)) document.querySelector('.guess input').focus();
    },

    init() {
      let QA = toObj(this.Qstring);

      if (this.valuesSwitched) QA = reverseObject(QA);

      T = new Training({
        qa: QA,
      });

      this.nextGuess();
      this.inputFocus();
      this.setProgress();
    },

    openMenu() {
      this.menuOpen = true;
    },

    closeMenu() {
      if (!this.Qstring) return;

      if (this.edited) {
        localStorage.setItem(this.STORAGE_KEY, this.Qstring);
        this.init();
      }

      this.menuOpen = false;
      this.helpOpen = false;
      this.edited = false;
    },

    onEnter() {
      if (this.state === 'GUESSING') this.checkAnswer();
      else if (this.state === 'FINISHED') {
        if (/^ponovi\??$/.test(this.inputValue)) this.init();
      } else this.nextGuess();
    },

    checkAnswer() {
      if (this.inputValue === '') return;

      if (this.inputValue === '?') {
        // NOTE: EMPTY
        T.onEmpty();
        this.state = 'HELP';
        this.inputValue = 'ODG: ' + T.TARGET.answer;
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
        }
      }

      this.setProgress();
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
      if (this.state === 'FINISHED') {
        this.score = 100;
      } else {
        let all = T.GUESSES.length * T.MAX_SCORE;
        let remaining = T.GUESSES.reduce((acc, cur) => acc + (T.MAX_SCORE - cur.score), 0); // progress max
        this.score = Math.max(0, ((all - remaining) / all) * 100);
      }

      console.log('set progress : ' + this.score); // TODO: delete
    },

    onFinished() {
      this.state = 'FINISHED';
      this.targetKey = 'konecツ';
      this.inputValue = 'ponovi?';
      this.setProgress();

      let stats = T.GUESSES.sort((a, b) => {
        // empty worst 2, other 1
        // points: incorrect + empty + mistakes
        // the worst: incorrect + empty
        let Aworst = 2 * a.guesses.empty + a.guesses.incorrect + a.guesses.mistakes;
        let Bworst = 2 * b.guesses.empty + b.guesses.incorrect + b.guesses.mistakes;
        return Bworst - Aworst; // return lower
      });

      // FIRST print the worst (> 2 bad points)

      let theWorst = stats.filter((s) => 2 * s.guesses.empty + s.guesses.incorrect + s.guesses.mistakes > 3);
      let remains = stats.filter(
        (s) => !theWorst.includes(s) && 2 * s.guesses.empty + s.guesses.incorrect + s.guesses.mistakes > 1
      );

      // THEN print remains

      if (theWorst.length) console.log('NAJSLABŠE (VELIKO VADI):');
      for (let i = 0; i < theWorst.length; i++) {
        let stat = theWorst[i];
        console.log(`[${i}] ${stat.question} - ${stat.answer} : ${JSON.stringify(stat.guesses)}`);
      }

      if (remains.length) console.log('OSTALO SLABO (VADI):');
      for (let i = 0; i < remains.length; i++) {
        let stat = remains[i];
        console.log(`[${i}] ${stat.question} - ${stat.answer} : ${JSON.stringify(stat.guesses)}`);
      }
    },
  },
});

function shake(selector) {
  // shakes element (like shaking head)
  let el = document.querySelector(selector);
  el.addEventListener('animationend', () => (el.style.animation = ''), { once: true });
  el.style.animation = 'shake 0.4s';
}

let HELP = `\
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


### TOČKOVANJE

# vsak par besed je točkovan na po-
# dlagi odgovarjanja:

# v začetku ima 0 točk, vsak pravilni
# odgovor prinese 1 točko. 3 zapore-
# dni pravilni odgovori se smatrajo
# za znanje in so izključeni iz
# nabora vprašanj.

# vsaka zmota (dan odgovor je odgo-
# vor na drugo vprašanje) se točkuje
# z -1 točkami.

# vsak napačen odgovor, ki ga ni med
# odgovori, se ne točkuje: ostane,
# dokler se ne odgovori nanj ali
# uporabi pomoč:

# POMOČ dobiš z odgovorom '?'. tak
# odgovor se točkuje z -2 točkami.`;

Main.mount('.main');
