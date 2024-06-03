class Count {
  constructor() {
    this.max = 0;
    this.current = 0;
    this.el = null;
  }

  get isFinished() {
    return this.current === this.max;
  }

  init(maxVal = 0) {
    this.max = maxVal;
    this.el = $('#count');
    this.render();

    return this;
  }

  increase() {
    this.current++;
    this.render();
  }

  render() {
    this.el.innerHTML = this.current + '/' + this.max;
  }
}
