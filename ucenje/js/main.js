let Q; // will be set in mounted();

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

const Main = Vue.createApp({
  data() {
    return {
      STORAGE_KEY: 'TEXT_TRAIN_QUESTIONS',
      HELP_TEXT: HELP,
      qa: null, // in mounted

      menuOpen: false, // NOTE: mora biti ločeno, da se vrne na prejšnje stanje
      inputValue: '',
      targetKey: '[target]',
      Qstring: '',

      valuesSwitched: false,
      edited: false,
      helpOpen: false,

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

      Q = new Training({
        qa: QA,
      });

      this.nextGuess();
      // this.inputFocus();
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
      else if (this.state === 'FINISHED') return;
      else this.nextGuess();
    },

    checkAnswer() {
      if (this.inputValue === '') return;

      if (this.inputValue === '?') {
        this.state = 'HELP';
        Q.onEmpty();
        this.inputValue = 'ODG: ' + Q.TARGET.answer; // .toUpperCase()
        return;
      }

      if (Q.isCorrect(this.inputValue)) {
        // NOTE: CORRECT
        Q.onCorrect();
        this.nextGuess();
      } else {
        let question = Q.getQuestion(this.inputValue); // question to your answer

        if (question === undefined) {
          // NOTE: INVALID
          // alert('odgovor ne obstaja');
          shake('.box-container');
        } else {
          // NOTE: INCORRECT
          Q.onIncorrect();
          this.state = 'INCORRECT';
          this.inputValue = `narobe .. [${this.inputValue}]`;
        }
      }
    },

    nextGuess() {
      this.inputValue = '';
      Q.next();

      if (!!Q.TARGET) {
        this.state = 'GUESSING';
        this.targetKey = Q.TARGET.question; // render question
      } else {
        this.state = 'FINISHED';
        this.targetKey = '[target]';
        this.inputValue = 'konec:)';
      }
    },
  },
});

function shake(selector) {
  let el = document.querySelector(selector);
  el.addEventListener('animationend', () => (el.style.animation = ''), { once: true });
  el.style.animation = 'shake 0.4s';
}

Main.mount('.main');