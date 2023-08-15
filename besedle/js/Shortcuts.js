// modified: 15. aug 2023

class Shortcuts {
  constructor({ el = window, preventDefault = false, log = false } = {}) {
    this.el = el;
    this.prevent = preventDefault;
    this.log = log;

    this.active = [];
    this.listeners = {};
  }

  listen() {
    this.el.addEventListener('keydown', this._onKeyDown.bind(this));
    this.el.addEventListener('keyup', this._onKeyUp.bind(this));
  }

  on(keyString, foo) {
    let keys = keyString.toLowerCase().split('+').map((k) => k.trim());
    let keyStr = this._keyString(keys);

    this.listeners[keyStr] = this.listeners[keyStr] || [];
    this.listeners[keyStr].push(foo);

    return this;
  }

  _keyString(arr) {
    let sortedKeys = arr.sort((a, b) => a.localeCompare(b));

    bringToFront(sortedKeys, 'shift');
    bringToFront(sortedKeys, 'alt');
    bringToFront(sortedKeys, 'control');
    bringToFront(sortedKeys, 'meta');

    let sortedString = sortedKeys.join('+').toLowerCase();
    return sortedString;
  }

  _fireEvents() {
    let keyStr = this._keyString(this.active);
    let activeListener = this.listeners[keyStr];

    if (activeListener) {
      activeListener.forEach((foo) => foo());
      this.active = [];
      if (this.log) this._logKeys();
    }
  }

  _logKeys() {
    console.log(this.active);
  }

  _onKeyDown(e) {
    if (this.prevent) e.preventDefault();

    let KEY = e.key.toLowerCase();
    if (!this.active.includes(KEY)) this.active.push(KEY);

    if (this.log) this._logKeys();
    this._fireEvents();

    return false;
  }

  _onKeyUp(e) {
    if (this.prevent) e.preventDefault();

    let KEY = e.key.toLowerCase();
    this.active = /meta|control|shift/.test(KEY) ? [] : this.active.filter((k) => k !== KEY);
    if (this.log) this._logKeys();

    return false;
  }

  _removeDuplicates(arr) {
    return arr.reduce((acc, cur) => (acc.includes(cur) ? acc : [...acc, cur]), []);
  }
}

// --- UTILS

function bringToFront(arr, el) {
  let index = arr.indexOf(el);
  if (index !== -1) {
    // exist; move to front
    arr.unshift(...arr.splice(index, 1));
  } else {
    // console.warn("cannot bring to front: element doesn't exist");
  }
}
