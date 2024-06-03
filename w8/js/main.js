'use strict';

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

const IS_DEV = false;

// -- GENERAL

const ALPHABET = 'ABCČDEFGHIJKLMNOPRSŠTUVZŽ'.split('');

// prettier-ignore
const randomHex = (len = 8) => new Array(len).fill().map(() => Math.floor(Math.random() * 16).toString(16)).join('');

const cellHex = (x, y) => x + '-' + y;

function randomChoose(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomRange(min, max) {
  return min + Math.random() * (max - min);
}

// function expRandomChose(arr) {
//   // TODO: funkcija, ki izbira z veliko večjo verjetnostjo manjše vrednosti
// }

const arrayCount = (arr, el) => arr.filter((e) => e === el).length;

// Example POST method implementation:
async function postData(url = '', data = {}) {
  return await fetch(url, { method: 'POST', body: JSON.stringify(data) });
}

// -- MAIN

const Main = {
  Words: null,
  Grid: null,
  Count: null,

  get input() {
    return $('#input').value.toLowerCase().trim();
  },

  init() {
    // events
    $('#inputForm').onsubmit = (e) => this.submitForm(e);
    document.body.onclick = (e) => {
      if (document.body.dataset.view === 'input') $('#input').focus();
    };

    $('#input').focus();

    $('#navLeft').onclick = () => (document.body.dataset.view = 'input');
  },

  async submitForm(e) {
    // FORM SUBMITTED
    document.body.dataset.view = 'loading';
    e.preventDefault();

    // --- EASTER EGG

    // prettier-ignore
    if (/lar(a|i[ck]a|kon?|č)|fi?li?p.*|miš(k[oa])?|šmurk?|(črv|storž|škrat|polž|makaronč)(ek|ko|kar|on)?/.test(this.input)) {
      setTimeout(() => $('#input').value = '', 2000);
      this.create('miško rad imam'.split(' '));
      return;
    }

    // --- EASTER EGG

    // get Kontekst words
    const res = await postData('https://www.kontekst.io/api', { q: this.input, lang: 'sl' });

    try {
      // try fetching kontekst words
      const data = await res.json();

      if (data.status === 200) {
        // console.info('SUCCESS!!');
        const entries = data.result.sims;
        const filteredEntries = entries
          .filter(({ term }, index) => {
            if (index > 12) return false;
            else if (term.length > 10) return false;
            return WIKIPEDIA_TITLES.includes(term) || FRAN_ENTRIES.includes(term);
          })
          .map((e) => e.term);

        this.create(filteredEntries);
      }
    } catch (err) {
      // error: show error warning
      console.warn(err);
      $('#input').value = 'ERROR';
      document.body.dataset.view = 'input';
    }
  },

  create(entries) {
    this.Words = new Words(entries);
    this.Grid = new Grid().init();
    this.Words.init();
    this.Count = new Count(this.Words.objects.length).init();

    document.body.dataset.view = 'grid';
  },

  win() {
    if (this.Grid.size < 7) confetti();
    else confetti({ particleCount: 100, spread: 70 }); // , origin: { y: 0.6 }
  },
};

Main.init();
