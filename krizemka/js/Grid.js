// -- GRID

class Grid {
  constructor() {
    this.el = null;
    this.size = null; // will be computed in init()
    this.matrix = []; // filled with rows of Cells
    this.arr = [];

    // -- events

    this.selectionStart = null;
    this.hoveredSquares = [];
  }

  // -- functions

  init() {
    // create new grid element
    $('#grid') && $('#grid').remove();
    this.el = document.createElement('div');
    this.el.setAttribute('id', 'grid');
    $('#grid-wrapper').insertAdjacentElement('afterbegin', this.el);

    this.size = (function () {
      const PERCENTAGE_FULL = 0.5; // 0.4 => 0.8
      const longestWord = Main.Words.strings.reduce((acc, cur) => (cur.length > acc.length ? cur : acc));
      const percentageSize = Math.round(Math.sqrt((Main.Words.strings.join('').length * 1) / PERCENTAGE_FULL));
      return Math.max(longestWord.length, percentageSize);
    })();

    this.setSizeCSS();
    this.createMatrix();
    this.initEvents();

    return this;
  }

  findCell(id) {
    return this.matrix.flat().find((c) => c.id === id);
  }

  clickCell(id) {
    const cell = this.findCell(id);

    if (this.selectionStart) {
      // SELECT END
      const startId = this.selectionStart.id;
      const endId = id;

      const match = Main.Words.testSelection(startId, endId);
      if (match) match.reveal();

      delete this.selectionStart.el.dataset.start;
      this.selectionStart = null;

      // update count
      Main.Count.setValue(Main.Words.revealedNo);
      if (Main.Count.isFinished) Main.win();
    } else {
      // SELECT START
      this.selectionStart = cell;
      this.selectionStart.el.dataset.start = true;
    }
  }

  initEvents() {
    // HOVER OVER A CELL => draw a hover line
    this.el.addEventListener('mouseover', (e) => {
      if (!this.selectionStart || !e.target.matches('.cell')) return;

      // clear selection
      this.clearHover();

      const hoveringCell = this.findCell(e.target.dataset.id);
      const distX = hoveringCell.x - this.selectionStart.x;
      const distY = hoveringCell.y - this.selectionStart.y;

      // ce je ena 0 ali druga 0 ali imata enaki absolutni vrednosti.
      if (!distX || !distY || Math.abs(distX) === Math.abs(distY)) {
        // ena od osmih
        const length = Math.max(Math.abs(distX), Math.abs(distY));
        const dir = { x: distX / length, y: distY / length };

        this.hoveredSquares = new Array(length).fill().map((_, i) => {
          const currX = this.selectionStart.x + (i + 1) * dir.x;
          const currY = this.selectionStart.y + (i + 1) * dir.y;
          return this.matrix[currY][currX];
        });

        this.hoveredSquares.forEach((s) => s.el.classList.add('hover'));
      }
    });

    // CLICK CELL
    this.el.addEventListener('mousedown', (e) => {
      this.clearHover();
      e.target.matches('.cell') && this.clickCell(e.target.dataset.id);
    });

    // HOVER OUTSIDE THE BOX
    this.el.addEventListener('mouseleave', this.clearHover);
  }

  clearHover() {
    [...$$('.cell.hover')].forEach((div) => div.classList.remove('hover'));
  }

  createMatrix() {
    // matrix: y rows of x Cells
    const matrix = [];

    for (let y = 0; y < this.size; y++) {
      const row = [];

      for (let x = 0; x < this.size; x++) {
        const cell = new Cell(x, y);
        row.push(cell);
      }

      matrix.push(row);
    }

    this.matrix = matrix;
  }

  render() {
    this.el.innerHTML = '';

    for (let row = 0; row < this.matrix.length; row++) {
      for (let col = 0; col < this.matrix[row].length; col++) {
        const cell = this.matrix[row][col];

        const el = document.createElement('div');
        el.className = 'cell flex-center';
        el.innerText = cell.content || cell.defaultContent;
        if (IS_DEV) el.innerText = cell.content; // TESTING
        if (IS_DEV) el.style.setProperty('background', cell.color); // TESTING
        el.dataset.id = cell.id;

        this.el.appendChild(el);
      }
    }
  }

  setSizeCSS() {
    $(':root').style.setProperty('--grid-size', this.size); // row & col
  }
}
