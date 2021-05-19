export default class PRNG {
  constructor(entries_no) {
    this.MOD = entries_no;

    this.A = 1664525;
    this.C = 1013904223;
    this.M = Math.pow(2, 32);
    this.SEED = 11;
  }

  get randEntry() {
    return this.get_rand();
    // let now = new Date();

    // if (now.getMonth() === 4 && now.getDate() === 26) {
    //   return this.get_rand();
    // } else if (now > new Date(2020, 4, 26)) {
    //   return this.get_rand();
    // } else {
    //   return this.get_rand();
    // }
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

  get_rand() {
    for (let i = 0; i < this.today(); i++) {
      this.SEED = (this.A * this.SEED + this.C) % this.M;
    }

    return this.SEED % this.MOD;
  }
}
