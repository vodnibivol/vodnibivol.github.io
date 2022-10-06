const Morse = (function () {
  // vars
  const inputBox = document.querySelector('#input');
  const outputBox = document.querySelector('#output');

  const SEPARATOR = ' '; // "... " => 3, 2, 1, 4
  const DASH_CHAR = '-';
  const DOT_CHAR = '.';
  const SPACE = '/';

  // const SEPARATOR = '... '; // "... " => 3, 2, 1, 4
  // const DASH_CHAR = '.. ';
  // const DOT_CHAR = '. ';
  // const SPACE = '.... ';

  // event listeners
  document.addEventListener('input', _onInput);

  // functions
  function _onInput(e) {
    if (e.target === inputBox) {
      outputBox.value = morseString(inputBox.value.toLowerCase());
    } else if (e.target === outputBox) {
      inputBox.value = plainString(outputBox.value);
    }
  }

  function morseString(str) {
    return [...str].map((char) => _morseChar(char)).join(SEPARATOR);
  }

  function plainString(str) {
    // prettier-ignore
    return str.split(' ').map((char) => _plainChar(char) || '').join('');
  }

  function _morseChar(char) {
    // for unambiguous translation; REPL string must not include "-" or "."
    const DASH_REPL = '<DASH_CHARACTER>';
    const DOT_REPL = '<DOT_CHARACTER>';

    try {
      let dictChar = MORSE_DICT.find((pair) => pair[0] === char)[1];
      let middleChar = dictChar.replaceAll('.', DOT_REPL).replaceAll('-', DASH_REPL);
      return middleChar.replaceAll(DOT_REPL, DOT_CHAR).replaceAll(DASH_REPL, DASH_CHAR);
    } catch (error) {
      console.error(`character ${char} not defined.`);
    }
  }

  function _plainChar(char) {
    try {
      return MORSE_DICT.find((pair) => pair[1] === char)[0];
    } catch (error) {
      console.error(`character ${char} not defined.`);
    }
  }

  const MORSE_DICT = [
    [' ', SPACE],
    ['a', '.-'],
    ['b', '-...'],
    ['c', '-.-.'],
    ['d', '-..'],
    ['e', '.'],
    ['f', '..-.'],
    ['g', '--.'],
    ['h', '....'],
    ['i', '..'],
    ['j', '.---'],
    ['k', '-.-'],
    ['l', '.-..'],
    ['m', '--'],
    ['n', '-.'],
    ['o', '---'],
    ['p', '.--.'],
    ['q', '--.-'],
    ['r', '.-.'],
    ['s', '...'],
    ['t', '-'],
    ['u', '..-'],
    ['v', '...-'],
    ['w', '.--'],
    ['x', '-..-'],
    ['y', '-.--'],
    ['z', '--..'],
    ['č', '-.-..'],
    ['š', '----'],
    ['ž', '--..-'],
    ['0', '-----'],
    ['1', '.----'],
    ['2', '..---'],
    ['3', '...--'],
    ['4', '....-'],
    ['5', '.....'],
    ['6', '-....'],
    ['7', '--...'],
    ['8', '---..'],
    ['9', '----.'],
    [',', '--..--'],
    ['.', '.-.-.-'],
    ['?', '..--..'],
    ['!', '-.-.--'],
    [':', '---...'],
    ['(', '-.--.'],
    [')', '-.--.-'],
    ['/', '-..-.'],
    [';', '-.-.-.'],
    ['-', '-....-'],
    ["'", '.----.'],
    ['_', '..--.-'],
    ['=', '-...-'],
    ['+', '.-.-.'],
    ['', ''],
  ];

  return { morseString, plainString };
})();
