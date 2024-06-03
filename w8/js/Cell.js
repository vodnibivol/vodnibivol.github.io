// -- CELL

class Cell {
  constructor(x, y) {
    this.defaultContent = randomChoose(ALPHABET);
    this.content = '';

    this.x = x;
    this.y = y;

    this.hex = cellHex(x, y);
  }

  get el() {
    return $(`[data-hex="${this.hex}"]`);
  }

  setContent(letter, testColor) {
    this.content = letter;
    this.testColor = testColor; // NOTE: TESTING
  }
}
