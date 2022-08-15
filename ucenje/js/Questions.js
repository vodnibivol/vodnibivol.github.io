class Training {
  constructor({ qa = null, keys = null, values = null }) {
    if (!qa) throw new Error('QA must be provided.');
    this.QA = Object.entries(qa);
    this.GUESSES = this._createGuesses(keys, values);

    this._shuffle(); // TODO: enable
  }

  next() {
    const WORST_GUESSES = 5;
    const MIN_DISTANCE = 1;

    let guesses = this.GUESSES.filter((t) => t.score < 3 && t.distance > MIN_DISTANCE);

    let _5worstGuesses = guesses.sort((a, b) => a.score - b.score).slice(0, WORST_GUESSES);
    let _2oldestGuesses = guesses.sort((a, b) => b.distance - a.distance).slice(0, 2);

    let pool = [..._5worstGuesses, ..._2oldestGuesses];

    // TODO: delete
    console.log('---');
    console.log(pool);
    console.log(this.GUESSES);

    this.TARGET = randomChoose(pool); // pool[0];

    if (!this.TARGET) return;

    // set distance
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

  exists(answer) {
    return this.getQuestion(answer) !== undefined;
  }

  // --- EVENTS

  onCorrect() {
    this.TARGET.score++;
    this.TARGET.guesses.correct++;
  }

  onIncorrect() {
    this.TARGET.score = -1;
    this.TARGET.guesses.incorrect++;
  }

  onInvalid() {
    // do nothing (i.e. headshake)
    this.TARGET.guesses.mistakes++;
  }

  onEmpty() {
    this.TARGET.score = -2;
    this.TARGET.guesses.empty++;
  }

  // --- utils

  _shuffle() {
    this.GUESSES = shuffleArray(this.GUESSES);
  }

  _equals(a, b) {
    if (typeof a === 'string' && typeof b === 'string') {
      return a.toLowerCase() === b.toLowerCase();
    }
    return a == b;
  }

  _includes(arr, key) {
    return arr.some((e) => this._equals(e, key));
  }

  // --- helper functions

  _createGuesses(keys, values) {
    let QA;

    if (!keys && !values) {
      QA = this.QA;
    } else if (keys) {
      QA = this.QA.filter((e) => this._includes(keys, e[0]));
    } else if (values) {
      QA = this.QA.filter((e) => this._includes(values, e[1]));
    }

    // TODO: check for missing entries
    // TODO: add option for arrays

    return QA.map((e) => {
      return {
        question: e[0],
        answer: e[1],
        score: 0,
        distance: Infinity,
        guesses: {
          incorrect: 0,
          empty: 0,
          correct: 0,
          mistakes: 0, // headshakes
        },
      };
    });
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

function getKeyByValue(object, value) {
  return Object.keys(object).find((key) => object[key] === value);
}

function toObj(str) {
  let lines = str.split('\n');
  let qa = {};

  for (let line of lines) {
    if (!line || line[0] === '#') continue;
    else if (!/:/.test(line)) {
      console.warn('line not printed : ' + line);
      continue;
    }

    let pair = line.split(':');
    let key = pair[0].trim();
    let val = pair[1].trim();
    qa[key] = val;
  }

  return qa;
}

function reverseObject(obj) {
  let arr = Object.entries(obj);
  let reversed = arr.map(([a, b]) => [b, a]);
  return Object.fromEntries(reversed);
}

// TESTING: copy(new Array(10).fill().map((e, i) => i + ": " + i).join("\n"));
