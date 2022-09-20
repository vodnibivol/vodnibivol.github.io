class DataStore {
  constructor(namespace) {
    if (!namespace) throw new Error('namespace must be provided.');
    this.namespace = namespace; // localStorage key

    this.SECOND = 1000; // 1 second in ms
    this.MINUTE = this.SECOND * 60;
    this.HOUR = this.MINUTE * 60;
    this.DAY = this.HOUR * 24;
    this.YEAR = this.DAY * 356;

    this._load();
  }

  set(key, data, expires) {
    // expires: time in ms
    const element = { key, data, expires: new Date().valueOf() + expires };

    // if key exists, set as index, else push
    let index = this.storageData.findIndex((el) => el.key === key);
    if (index === -1) index = this.storageData.length; // apend to back
    this.storageData[index] = element;

    this._save();
  }

  get(foo) {
    // foo: function (default) or string
    this._load();
    this._cleanup();

    if (typeof foo === 'string') {
      const key = foo;
      foo = (el) => el.key === key;
    }

    return this.storageData.find(foo);
  }

  getAll(foo) {
    this._load();

    if (!foo) {
      foo = () => true;
    }

    return this.storageData.filter(foo);
  }

  clear() {
    localStorage.removeItem(this.namespace);
  }

  _cleanup() {
    const now = new Date().valueOf();
    this.storageData = this.storageData.filter((el) => el.expires > now);
  }

  // --- utils

  _save() {
    localStorage.setItem(this.namespace, JSON.stringify(this.storageData));
  }

  _load() {
    this.storageData = JSON.parse(localStorage.getItem(this.namespace) || '[]');
  }
}
