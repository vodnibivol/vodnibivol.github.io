const $ = (sel) => document.querySelector(sel);

class Counter {
  constructor(options = {}) {
    this.width = options.width;
    if (!this.width) throw new Error('width must be provided');
    this.counterEl = document.querySelector(options.el);
    if (!this.counterEl) throw new Error('element must be provided');
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
    const ch = [...this.counterEl.querySelectorAll('.num')];
    const numString = this.num.toString();

    const oneOffset = ch[0].offsetHeight / 10;

    for (let i = 0; i < ch.length; ++i) {
      // from the back to the front!
      const el = ch.at(-1 - i);
      const val = numString.at(-1 - i);

      const endOffset = (parseInt(val) || 0) * oneOffset;
      el.style.transform = `translate3d(0, ${-endOffset}px, 0)`;
    }
  }

  init() {
    const html = `\
    <div class="num-window flex-center">
      <span class="num">0123456789</span>
    </div>`;
    this.counterEl.innerHTML = new Array(this.width).fill(html).join('\n');
  }
}
