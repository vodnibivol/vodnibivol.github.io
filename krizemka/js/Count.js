class Count {
  constructor(maxVal = 0) {
    this.max = maxVal;
    this.value = 0;
    this.el = null;
  }

  get isFinished() {
    return this.value === this.max;
  }

  init() {
    this.el = $('#count');
    this.render();

    return this;
  }

  setValue(val) {
    this.value = val;
    this.render();
  }

  increase() {
    this.value++;
    this.render();
  }

  render() {
    this.el.innerHTML = this.value + '/' + this.max;
  }
}
