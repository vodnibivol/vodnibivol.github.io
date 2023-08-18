class Row {
  constructor(index) {
    this.active = false;
    this.fixed = false;
    this.letters = new Array(5).fill().map((_, i) => new Letter(this, i));
    this.index = index;
    this.id = randomID();
  }

  get el() {
    return document.querySelector(`[data-id="${this.id}"]`);
  }

  get full() {
    return this.letters.every((l) => l.value);
  }

  get value() {
    return this.letters.map((l) => l.value).join('');
  }

  get isValid() {
    return this.value.length === 5 && WORDLIST_VALID.includes(this.value);
  }

  get isCorrect() {
    return this.letters.every((l) => l.status === 'correct');
  }

  setValue(guessWord, submit = false) {
    this.letters.forEach((l, i) => l.setValue(guessWord[i]));
    if (submit) this.submit();
  }

  submit(targetWord) {
    const TARGET = [...targetWord];
    const GUESS = this.letters.map((l) => l.value);

    // ERROR CKECKING
    if (!this.isValid) return false;

    // first locate (and remove) correct ones
    for (let i = 0; i < 5; ++i) {
      if (GUESS[i] === TARGET[i]) {
        this.letters[i].status = 'correct';
        TARGET[i] = null;
      }
    }

    // loop through GUESS => remove if CORRECT/DISPLACED
    for (let i = 0; i < 5; ++i) {
      if (this.letters[i].status === 'correct') continue;

      if (GUESS[i] === TARGET[i]) {
        this.letters[i].status = 'correct';
        TARGET[i] = null;
      } else if (TARGET.includes(GUESS[i])) {
        TARGET[TARGET.indexOf(GUESS[i])] = null;
        this.letters[i].status = 'displaced';
      } else {
        this.letters[i].status = 'wrong';
      }
    }

    this.fixed = true;
    return true;
  }
}

class Letter {
  constructor(row, index) {
    this.value = '';
    this.row = row;
    this.index = index;
    this.id = randomID();

    this.status = '';
  }

  setValue(value = '') {
    this.value = value.toLowerCase();
  }

  get el() {
    return document.querySelector(`[data-id="${this.id}"]`);
  }

  get active() {
    return this.value;
  }
}

// --- helpers

function randomID() {
  if (crypto.randomUUID !== undefined) return crypto.randomUUID();
  return uuidv4();
}

function uuidv4() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16)
  );
}
