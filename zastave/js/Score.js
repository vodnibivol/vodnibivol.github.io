class Score {
  constructor(el, size = 10) {
    this.count = 0;
    this.size = size;

    this.arr = new Array(size).fill(0);
    this.el = document.querySelector(el);

    this.render();
  }

  add(score) {
    if (score === undefined) throw new Error('score must be provided');

    this.arr[count % this.size] = score;

    this.render();
    return this.get();
  }

  get() {
    return this.arr.reduce((acc, cur) => acc + cur);
  }

  render() {
    this.el.innerText = this.get();
  }
}
