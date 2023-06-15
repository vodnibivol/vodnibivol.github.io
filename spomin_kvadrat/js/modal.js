window.$ = window.$ || ((sel) => document.querySelector(sel));

const Modal = (function () {
  // --- events

  $('#modal').onclick = function ({ target: t }) {
    if (t.matches('button.ok')) {
      if (_lsKey && $('#remember input').checked) localStorage.setItem(_lsKey, 1);
      if (typeof _onConfirm === 'function') _onConfirm();
      _preventClose || _closeModal();
    } else if (t.matches('button.cancel')) {
      if (typeof _onCancel === 'function') _onCancel();
      _preventClose || _closeModal();
    }
  };

  // --- aliases

  function _openModal() {
    $('#modal').style.display = 'flex';
  }

  function _closeModal() {
    $('#modal').style.display = 'none';
  }

  // --- returned functions

  let _onConfirm, _onCancel, _lsKey, _preventClose;

  function alt(options = {}) {
    if (typeof options === 'string') {
      options = { msg: options };
    }

    if (options.html) $('#modal .msg').innerHTML = options.html;
    else $('#modal .msg').innerText = options.msg;

    _onConfirm = options.onConfirm || eval;
    _onCancel = options.onCancel;
    _lsKey = options.remember;
    _preventClose = options.preventClose;

    $('#modal button.cancel').style.display = options.onCancel ? 'inline-block' : 'none';
    $('#modal #remember').style.display = options.remember ? 'inline-block' : 'none';

    if (options.remember && localStorage.getItem(options.remember)) _onConfirm();
    else _openModal();
  }

  return { alt, close: _closeModal };
})();
