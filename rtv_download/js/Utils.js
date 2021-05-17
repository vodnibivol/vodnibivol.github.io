String.prototype.format = function () {
  'use strict';
  var str = this.toString();
  if (arguments.length) {
    var t = typeof arguments[0];
    var key;
    var args = 'string' === t || 'number' === t ? Array.prototype.slice.call(arguments) : arguments[0];

    for (key in args) {
      str = str.replace(new RegExp('\\{' + key + '\\}', 'gi'), args[key]);
    }
  }

  return str;
};

class PRNG {
  constructor() {
    this.POPULATION = 23; // no. of images

    this.A = 1664525;
    this.C = 1013904223;
    this.M = Math.pow(2, 32);
    this.SEED = 12;

    this.ARR = [...Array(this.POPULATION).keys()]; // range
    this.QUARANTINE = 11; // repeat interval (min.)
    this.SAMPLE = this.POPULATION - this.QUARANTINE;
  }

  get randomImage() {
    return this.getRand();
  }

  next() {
    return this.SEED = (this.A * this.SEED + this.C) % this.M;
  }

  today() {
    const MS_IN_MINUTE = 60 * 1000;
    const MS_IN_DAY = MS_IN_MINUTE * 60 * 24;

    let now = new Date();
    let start = new Date(2020, 0, 0);
    let offset = start.getTimezoneOffset() - now.getTimezoneOffset(); // in min
    let diff = now - start + offset * MS_IN_MINUTE;
    let day_no = Math.floor(diff / MS_IN_DAY);

    return day_no;
  }

  getRand() {
    let randIndex, randPick;

    for (let i = 0; i < this.today(); i++) { // this.today()
      randIndex = this.next() % this.SAMPLE;
      randPick = this.ARR[randIndex];

      this.ARR.push(...this.ARR.splice(randIndex, 1));
    }

    return randPick;
  }
}
