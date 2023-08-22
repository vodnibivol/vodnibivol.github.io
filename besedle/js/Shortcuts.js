// modified: 22. aug 2023

class Shortcuts {
  constructor({ el = window, preventDefault = false, log = false } = {}) {
    this.el = typeof el === 'string' ? document.querySelector(el) : el;
    this.prevent = preventDefault;
    this.log = log;

    this.active = new Set();
    this.listeners = {};
  }

  listen() {
    this.el.addEventListener('keydown', this._onKeyDown.bind(this));
    this.el.addEventListener('keyup', this._onKeyUp.bind(this));
    window.addEventListener('focus', this._clearActive.bind(this));
    window.addEventListener('blur', this._clearActive.bind(this));
  }

  on(keyString, foo) {
    const keys = keyString.split('+').map((k) => k.toUpperCase().trim());
    const keyStr = this._keyString(keys);

    this.listeners[keyStr] = this.listeners[keyStr] || [];
    this.listeners[keyStr].push(foo);

    return this;
  }

  _keyString(arr) {
    const sortedKeys = [...arr].sort((a, b) => a.localeCompare(b));
    return sortedKeys.join('+');
  }

  _fireEvents() {
    const keyStr = this._keyString(this.active);
    const activeListener = this.listeners[keyStr];

    if (activeListener) {
      if (this.log) this._logKeys();
      activeListener.forEach((foo) => foo());
      this.active = new Set();
    }
  }

  _logKeys() {
    console.info(this.active);
  }

  _clearActive() {
    this.active = new Set();
  }

  _onKeyDown(e) {
    if (this.prevent) e.preventDefault();

    const KEY = e.key.toUpperCase();
    this.active.add(KEY);

    if (e.metaKey) this.active.add('META');
    if (e.ctrlKey) this.active.add('CONTROL');
    if (e.altKey) this.active.add('ALT');
    if (e.shiftKey) this.active.add('SHIFT');

    if (this.log) this._logKeys();
    this._fireEvents();

    return false;
  }

  _onKeyUp(e) {
    if (this.prevent) e.preventDefault();

    const KEY = e.key.toUpperCase();

    if (KEY === 'META') this._clearActive();
    else this.active.delete(KEY);

    if (this.log) this._logKeys();

    return false;
  }
}
