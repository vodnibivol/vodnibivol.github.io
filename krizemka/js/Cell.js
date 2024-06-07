// -- CELL

class Cell {
  constructor(x, y) {
    this.defaultContent = randomChoose(ALPHABET);
    this.content = '';

    this.x = x;
    this.y = y;

    this.id = cellId(x, y);
  }

  get el() {
    return $(`[data-id="${this.id}"]`);
  }

  setContent(letter, color) {
    this.content = letter;
    this.color = color;
  }
}
