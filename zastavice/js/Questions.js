class Questions {
  constructor({ qa = null, questions = null, answers = null }) {
    if (!qa) throw new Error('QA must be provided.');

    this.QA = qa; // all provided (not filtered)
    this.GUESSES = this._createGuesses(questions, answers);

    this._shuffle();
  }

  next() {
    const POOL_SIZE = 5;
    const MIN_DISTANCE = 3;

    let guesses = this.GUESSES.sort((a, b) => a.score - b.score).filter((t) => t.score < 3);
    if (guesses.length >= 3) {
      guesses = guesses.filter((t) => t.distance >= MIN_DISTANCE);
    }

    let pool = guesses.slice(0, POOL_SIZE);

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

  // events

  onCorrect() {
    this.TARGET.score++;
  }

  onIncorrect(inputValue) {
    this.TARGET.score = -1;
    const q = this.GUESSES.find((g) => this._equals(g.answer, inputValue));
    if (q) q.score = -1;
  }

  onInvalid() {
    alert('invalid');
  }

  onEmpty() {
    this.TARGET.score = -2;
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

  _createGuesses(questions, answers) {
    let QA;

    if (!questions && !answers) {
      QA = this.QA;
    } else if (questions) {
      QA = this.QA.filter((e) => this._includes(questions, e[0]));
    } else if (answers) {
      QA = this.QA.filter((e) => this._includes(answers, e[1]));
    }

    // TODO: check for missing entries
    // TODO: add option for arrays

    return QA.map((e) => {
      return { question: e[0], answer: e[1], score: 0, distance: Infinity };
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
  return str
    .split('\n')
    .filter((a) => !!a)
    .reduce((acc, cur) => {
      let [key, val] = cur.split(': ');
      acc[key] = val;
      return acc;
    }, {});
}

// function reverseObject(obj) {
//   let arr = Object.entries(obj);
//   let reversed = arr.map(([a, b]) => [b, a]);
//   return reversed;
// }
