// version for ZASTAVICE, adapted from UCENJE_BESED

class Training {
  constructor({ qa = null, keys = null, values = null, reversed = false }) {
    if (!qa) throw new Error('QA must be provided.');

    if (reversed) qa = reverseObj(qa);

    this.QA = Object.entries(qa);
    this.GUESSES = this._createGuesses(keys, values);

    this.MAX_SCORE = 2; // max quesiton score
    this.totalScore = this.MAX_SCORE * this.GUESSES.length; // max training score

    this._shuffle();
  }

  get score() {
    let remaining = this.GUESSES.reduce((acc, cur) => acc + (this.MAX_SCORE - cur.score), 0); // total points to be earned (2 each)
    return Math.max(0, ((this.totalScore - remaining) / this.totalScore) * 100);
  }

  next() {
    const OLDEST_GUESSES = 3;
    const WORST_GUESSES = 3; // 5
    const MIN_DISTANCE = 0; // 1-3

    let guesses = this.GUESSES.filter((t) => t.score < this.MAX_SCORE && t.distance > MIN_DISTANCE);

    let _5worstGuesses = guesses.sort((a, b) => a.score - b.score).slice(0, WORST_GUESSES);
    let _5oldestGuesses = guesses.sort((a, b) => b.distance - a.distance).slice(0, OLDEST_GUESSES);

    let pool = _5oldestGuesses; // POOL = 5 oldest + 5 worst

    for (let guess of _5worstGuesses) {
      let howBad = Math.max(1, -guess.score); // at least 1!
      pool.push(...new Array(howBad).fill(guess)); // '...' flattens the array
    }

    // TODO: delete
    console.log('---');
    console.log(_5worstGuesses);
    console.log(pool);
    // console.log(this.GUESSES);

    this.TARGET = randomChoose(pool);

    if (!this.TARGET) return;

    // set distance for current target
    this.GUESSES.forEach((t) => t.distance++);
    this.TARGET.distance = 0;
  }

  getQuestion(answer) {
    // get question by answer
    let q = this.QA.find((e) => this._equals(e[1], answer));
    if (q) return q[0];
  }

  isCorrect(answer) {
    return this._equals(answer, this.TARGET.answer);
  }

  // --- EVENTS

  onCorrect() {
    this.TARGET.guesses.correct++;
  }

  onIncorrect() {
    this.TARGET.guesses.incorrect++;
  }

  onInvalid() {
    // headshake
    this.TARGET.guesses.mistakes++;
  }

  onEmpty() {
    this.TARGET.guesses.empty++;
    console.log(this.TARGET);
  }

  // --- utils

  _shuffle() {
    this.GUESSES = shuffleArray(this.GUESSES);
  }

  _equals(a, b) {
    if (typeof a === 'string' && typeof b === 'string') {
      return a.toLowerCase() === b.toLowerCase();
    }
    return a == b; // FIXME: ??
  }

  _includes(arr, key) {
    return arr.some((e) => this._equals(e, key));
  }

  // --- helper functions

  _createGuesses(keys, values) {
    let QA;

    if (!keys && !values) QA = this.QA;
    else if (keys) QA = this.QA.filter((e) => this._includes(keys, e[0]));
    else if (values) QA = this.QA.filter((e) => this._includes(values, e[1]));

    // TODO: check for missing entries
    // TODO: add option for arrays

    return QA.map(([q, a]) => new Guess(q, a));
  }
}

class Guess {
  constructor(question, answer) {
    this.question = question;
    this.answer = answer;

    this.distance = Infinity;
    this.guesses = { correct: 0, incorrect: 0, mistakes: 0, empty: 0 };
  }

  get score() {
    let { correct } = this.guesses;
    return correct - this.badScore;
  }

  get badScore() {
    let { empty, incorrect, mistakes } = this.guesses;
    return 2 * empty + incorrect + Math.floor(mistakes / 2);
  }
}

// --- UTILITY FUNCTIONS

function randomChoose(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffleArray(array) {
  let currentIndex = array.length;
  let randomIndex;

  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }

  return array;
}

function toObj(str, log = false) {
  // transforms guesses in text form to object
  let lines = str.split('\n');
  let qa = {};

  for (let line of lines) {
    if (!line || line[0] === '#') continue;
    else if (!/:/.test(line)) {
      if (log) console.warn('line not printed: ' + line);
      continue;
    }

    let pair = line.split(':');
    let key = pair[0].trim();
    let val = pair[1].trim();

    if (!key || !val) {
      if (log) console.warn('line not printed: ' + line);
      continue;
    }

    qa[key] = val;
  }

  return qa;
}

function reverseObj(obj) {
  let arr = Object.entries(obj);
  let reversed = arr.map(([a, b]) => [b, a]);
  return Object.fromEntries(reversed);
}

// TESTING: copy(new Array(10).fill().map((e, i) => i + ": " + i).join("\n"));
