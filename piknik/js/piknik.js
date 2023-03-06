const Piknik = {
  loaded: false, // toggles visibility

  SSKJ: [], // will be LOADED aynchronously
  SSKJ_SET: [],
  TARGETS: [], // subset of WORDS: guess targets ..

  words: [],
  wordLengths: [],

  letters: [],
  draggedLetters: [], // indexes

  get draggedWord() {
    return this.draggedLetters.map((ind) => this.letters[ind]).join('');
  },

  get allGuessed() {
    return this.words.every((w) => !!w.guess);
  },

  init() {
    let count = 0;
    const maxCount = 10;

    fetch('./SSKJ_freqs_leposlovje.json')
      .then((res) => res.json())
      .then((data) => {
        this.SSKJ = data; // Object.ENTRIES!
        this.SSKJ_SET = new Set(data.map((e) => e[0]));
        this.TARGETS = this.SSKJ.filter(([word, freq]) => word.length >= 5 && word.length <= 7 && freq > 1000);

        this.chooseWords();
        if (count === maxCount) this.loaded = true;
      });

    (function load() {
      // fake loading ampak izgleda dobro
      $('#loader').innerText = '[' + 'x'.repeat(count) + '.'.repeat(maxCount - count) + ']';

      if (count++ < maxCount) setTimeout(load, 50 + Math.random() * 50);
      else if (Piknik.$data.SSKJ.length) Piknik.$data.loaded = true;
    })();
  },

  chooseWords() {
    function isSubset(osnova, primerjava) {
      const counted1 = charCount(osnova);
      const counted2 = charCount(primerjava);

      for (let letter of primerjava) {
        if (!osnova.includes(letter)) return false;
        if (counted1[letter] < counted2[letter]) return false;
      }
      return true;
    }

    // glavna (najdaljša) beseda, ki jo ugibaš
    const targetWord = randomChoose(this.TARGETS)[0];

    const subwords = [];
    for (let [word, freq] of this.SSKJ) {
      if (freq < 1000) break;
      if (word !== targetWord && word.length >= 3 && isSubset(targetWord, word)) subwords.push(word);
    }

    this.words = [targetWord, ...subwords].map((w) => ({ length: w.length, guess: '' })).splice(0, 6);
    // .sort((a, b) => b.length - a.length); // in html

    this.letters = shuffled([...targetWord]);
  },

  checkWord() {
    const isDictWord = this.SSKJ_SET.has(this.draggedWord);

    if (isDictWord) {
      // 1. že uganil
      if (this.words.some((w) => w.guess === this.draggedWord)) return console.log('ALREADY GUESSED');

      // 2. prosto
      const match = this.words.find((entry) => !entry.guess && entry.length === this.draggedWord.length);
      if (match) match.guess = this.draggedWord;

      // 3. nova beseda, ampak ni predvidena
      if (!match) this.words.push({ guess: this.draggedWord, length: this.draggedWord.length });
    }
  },

  computeStyle(index) {
    const angle = (360 / this.letters.length) * index;
    return 'transform:' + `rotate(${angle}deg) translateY(-60px) rotate(-${angle}deg);`;
  },

  showDef(word) {
    window.open('https://www.fran.si/iskanje?FilteredDictionaryIds=133&View=1&Query=' + word, '_blank');
  },
};

Canvas.init();
