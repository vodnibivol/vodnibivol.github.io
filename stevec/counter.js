class Counter {
  constructor(options = {}) {
    this.width = options.width;
    this.counterEl = document.querySelector(options.el);

    if (!this.width) throw new Error('counter width must be provided');
    if (!this.counterEl) throw new Error('counter element must be provided');

    this.init();
  }

  setValue(num) {
    this.num = num;
    this.render();
  }

  setWidth(num) {
    this.width = num;
    this.init();
    this.render();
  }

  render() {
    const cells = [...this.counterEl.querySelectorAll('.num')];
    const numString = '' + this.num;

    const cellHeight = cells[0].offsetHeight / 10;

    for (let i = 0; i < cells.length; ++i) {
      const offset = numString.at(-i - 1) * cellHeight;
      cells.at(-i - 1).style.transform = `translate3d(0, -${offset}px, 0)`;
    }
  }

  init() {
    const html = `
    <div class="num-cell flex-center">
      <span class="num">0123456789</span>
    </div>`;
    this.counterEl.innerHTML = new Array(this.width).fill(html).join('');
  }
}
