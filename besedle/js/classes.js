class Row {
  constructor(index) {
    this.active = false;
    this.fixed = false;
    this.letters = new Array(5).fill().map((_, i) => new Letter(this, i));
    this.index = index;
  }

  get full() {
    return this.letters.every((l) => l.value);
  }

  get value() {
    return this.letters.map((l) => l.value).join('');
  }

  setValue(word, submit = false) {
    this.letters.forEach((l, i) => l.setValue(word.at(i).toLowerCase()));
    if (submit) this.submit();
  }


  checkValid() {
    const word = this.letters.map((l) => l.value).join('');

    if (word.length < 5) {
      shake('#guess-grid .row:nth-of-type(' + (this.index + 1) + ')');
    } else if (!WORDLIST_VALID.includes(word)) {
      shake('#guess-grid .row:nth-of-type(' + (this.index + 1) + ')');
    } else {
      return true;
    }
  }

  submit(targetWord) {
    const TARGET = [...targetWord];
    const GUESS = this.letters.map((l) => l.value);

    // ERROR CKECKING
    if (!this.checkValid()) return;

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
        // CORRECT
        this.letters[i].status = 'correct';
        TARGET[i] = null;
      } else if (TARGET.includes(GUESS[i])) {
        // DISPLACED
        TARGET[TARGET.indexOf(GUESS[i])] = null;
        this.letters[i].status = 'displaced';
      } else {
        // WRONG
        this.letters[i].status = 'wrong';
      }
    }

    this.fixed = true;
  }
}

class Letter {
  constructor(row, index) {
    this.value = '';
    this.row = row;
    this.index = index;

    this.status = '';
  }

  setValue(value) {
    this.value = value;
  }

  get active() {
    return this.value;
  }
}