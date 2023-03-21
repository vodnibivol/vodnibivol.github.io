const Piknik = {
  loaded: false, // toggles visibility

  SSKJ: [], // will be LOADED aynchronously
  SSKJ_SET: [],
  TARGETS: [], // subarray of SSKJ: guess targets .. only used when choosing "targetWord"
  BLACKLIST: [], // blacklist of suggestions (this.TARGETS + subwords); guesses still count

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
    const promises = new Array(2);

    promises[0] = (async () => {
      const res = await fetch('./SSKJ_freqs_leposlovje.csv');
      const text = await res.text();
      // prettier-ignore
      const data = text.split('\n').map((e) => e.split(',')).map(([word, freq]) => [word, parseInt(freq)]);
      this.SSKJ = data; // Object.ENTRIES!
      this.SSKJ_SET = new Set(data.map((e) => e[0]));
    })();

    promises[1] = (async () => {
      const res = await fetch('./SSKJ_blacklist.csv');
      const text = await res.text();
      this.BLACKLIST = new Set(text.split('\n'));
      // prettier-ignore
    })();

    Promise.all(promises).then(() => {
      this.TARGETS = this.SSKJ.filter(([word, freq]) => {
        return word.length >= 5 && word.length <= 8 && freq > 1000 && !this.BLACKLIST.has(word);
      }).map((e) => e[0]);

      this.chooseWords();
      this.loaded = true;
    });
  },

  chooseWords() {
    function isSubset(osnova, primerjava) {
      if (primerjava.length > osnova.length) return false;

      const counted1 = utils.charCount(osnova);
      const counted2 = utils.charCount(primerjava);

      for (let letter of primerjava) {
        if (!osnova.includes(letter)) return false;
        if (counted1[letter] < counted2[letter]) return false;
      }

      return true;
    }

    // glavna (najdaljša) beseda, ki jo ugibaš
    const targetWord = utils.randomChoose(this.TARGETS); // array

    const subwords = [];
    for (let [word, freq] of this.SSKJ) {
      if (freq < 1000) break;
      if (word !== targetWord && isSubset(targetWord, word) && !this.BLACKLIST.has(word)) {
        subwords.push(word);
      }
    }

    // additional check: has to have more than 3 subwords
    if (subwords.length < 3) {
      this.TARGETS.splice(this.TARGETS.indexOf(targetWord), 1);
      return this.chooseWords();
    }

    // console.log('MOŽNOSTI: ' + [targetWord, ...subwords.sort((a, b) => b.length - a.length)].join(', '));
    this.words = [targetWord, ...subwords].map((w) => ({ length: w.length, guess: '' })).splice(0, 6);

    this.letters = utils.shuffled([...targetWord]);
  },

  checkWord() {
    const isDictWord = this.SSKJ_SET.has(this.draggedWord);

    if (isDictWord) {
      // 1. že uganil
      if (this.words.some((w) => w.guess === this.draggedWord)) return;

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
