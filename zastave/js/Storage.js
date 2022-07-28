const Storage = (function () {
  const STORAGE_KEY = 'FLAG_CACHE';

  function get() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY));
    } catch (error) {
      return null;
    }
  }

  function set(data) {
    // data: object
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  function clear() {
    localStorage.removeItem(STORAGE_KEY);
  }

  return { get, set, clear };
})();
