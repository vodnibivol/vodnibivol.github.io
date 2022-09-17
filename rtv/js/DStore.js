class DStore {
  constructor(namespace) {
    if (!namespace) throw new Error('namespace must be provided.');
    this.namespace = namespace; // localStorage key

    this.SECOND = 1000; // 1 second in mx // TODO: _SECOND? ali da je readonly
    this.MINUTE = this.SECOND * 60;
    this.HOUR = this.MINUTE * 60;
    this.DAY = this.HOUR * 24;
    this.WEEK = this.DAY * 7;
    this.MONTH = this.DAY * 30;

    this._syncUp();
  }

  set(key, data, expires) {
    // expires: time in ms
    const element = { key, data, expires: new Date().valueOf() + expires };

    // if key exists, set as index, else push
    let index = this.storageData.findIndex((el) => el.key === key);
    if (index === -1) index = this.storageData.length; // apend to back
    this.storageData[index] = element;

    this._syncDown();
  }

  get(foo) {
    // foo: function (default) or string
    this._syncUp();

    if (typeof foo === 'string') {
      const key = foo;
      foo = (el) => el.key === key;
    }

    return this.storageData.find(foo);
  }

  getAll(foo) {
    this._syncUp();

    if (!foo) {
      foo = () => true;
    }

    return this.storageData.filter(foo);
  }

  clear() {
    localStorage.removeItem(this.namespace);
  }

  // --- utils

  _syncDown() {
    localStorage.setItem(this.namespace, JSON.stringify(this.storageData));
  }

  _syncUp() {
    this.storageData = JSON.parse(localStorage.getItem(this.namespace) || '[]');
  }
}
