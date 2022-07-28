const $ = (s) => document.querySelector(s);

const Guess = (function () {
  // events
  document.addEventListener('click', () => $('#textInput').focus());
  document.addEventListener('keydown', _handleKeyDown);

  function init() {
    if (!Q) throw new Error('Q object must be provided');

    _onEnter = _checkAnswer;
    _nextGuess();
  }

  // --- event functions

  function _handleKeyDown(e) {
    if (e.key === 'Enter') {
      _onEnter();
    }
  }

  function _onEnter() {
    // is rewritten to point to different functions
    return null;
  }

  // --- functions

  function _nextGuess() {
    Storage.set(Q);

    Input.clear();
    _hideElement('.guess');

    Q.next();

    if (!Q.TARGET) {
      // _hideElement('.target');
      alert('NO MORE QUESTIONS.');
      return;
    }

    _renderQuestion();
    _onEnter = _checkAnswer;
  }

  function _renderQuestion() {
    $('.target img').src = Q.TARGET.question;
  }

  function _renderGuess(question) {
    // render wrong guess
    $('.guess img').src = question;
    _showElement('.guess');
  }

  function _checkAnswer() {
    let input = Input.get();

    if (input === '?') {
      Q.TARGET.score = -2;
      Input.set('ANSWER: ' + Q.TARGET.answer.toUpperCase());
      _onEnter = _nextGuess;
      return;
    }

    if (input === 'clear') {
      Storage.clear();
      return;
    }

    if (Q.isCorrect(input)) {
      _onCorrect();
    } else {
      _onIncorrect();
    }
  }

  function _onCorrect() {
    Q.TARGET.score++;
    _nextGuess();
  }

  function _onIncorrect() {
    let question = Q.getQuestion(Input.get()); // what you wrote

    if (question === undefined) {
      // invalid
      alert('INVALID ANSWER');
    } else {
      // wrong
      Q.TARGET.score = -1;
      _renderGuess(question);
      Input.set('FALSE. PRESS ENTER TO CONTINUE');

      _onEnter = _nextGuess;
    }
  }

  return { init, next: _nextGuess };
})();

// ---

function _isEqual(a, b) {
  return a.toLowerCase() === b.toLowerCase();
}

const Input = (function () {
  // vars
  const el = $('#textInput');

  // methods
  function get() {
    return el.value;
  }

  function set(string) {
    el.value = string;
  }

  function clear() {
    el.value = '';
  }

  function select() {
    el.focus();
  }

  return { get, set, clear, select };
})();

// --- UTILITY FUNCTIONS

function _hideElement(selector) {
  $(selector).classList.add('hidden');
}

function _showElement(selector) {
  $(selector).classList.remove('hidden');
}
