'use strict';

const IS_DEV = false;

// -- GENERAL

const ALPHABET = 'ABCČDEFGHIJKLMNOPRSŠTUVZŽ'.split('');

// -- MAIN

const Main = {
  Words: null,
  Grid: null,
  Count: null,

  maxEntries: parseInt(new URLSearchParams(location.search).get('maxEntries')) || 15,

  easterEgg: false,

  get input() {
    return $('#input').value.toLowerCase().trim();
  },

  init() {
    // events
    $('#inputForm').onsubmit = (e) => this.submitForm(e);
    $('body').onclick = (e) => document.body.dataset.view === 'input' && $('#input').focus();
    $('#navLeft').onclick = () => (document.body.dataset.view = 'input');

    const ARROW_HTML = `<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24"><path d="M13.025 1l-2.847 2.828 6.176 6.176h-16.354v3.992h16.354l-6.176 6.176 2.847 2.828 10.975-11z" /></svg>`;
    [...$$('[data-arrow]')].forEach((el) => el.insertAdjacentHTML('beforeend', ARROW_HTML));

    $('#input').focus();
    Direction.init();
  },

  async submitForm(e) {
    e.preventDefault();
    if (!this.input) return;

    // FORM SUBMITTED
    document.body.dataset.view = 'loading';
    $('#input').blur();

    // --- EASTER EGG

    // prettier-ignore
    if (/^(lar(a|i[ck]a|kon?|č)?|fi?li?p.*|miš(k[oa])?|škron(k(o|ar|ec))?|čm?[ou]n?k(o|ar|ec)?|(šmur|črv|storž|škrat|polž|makaronč)(ek|ko|kar|on)?)$/.test(this.input)) {
      setTimeout(() => $('#input').value = '', 2000); // clean input when returned
      this.create('miško rad imam'.split(' '));
      this.easterEgg = true;
      return;
    }
    this.easterEgg = false;

    // get Kontekst words
    const res = await postData('https://www.kontekst.io/api', { q: this.input, lang: 'sl' });
    const responseText = await res.clone().text();

    try {
      // try fetching kontekst words
      const data = await res.json();

      if (data.status === 200) {
        // request SUCCESS
        const entries = data.result.sims;
        console.table(entries);

        const filteredEntries = entries.filter(({ term }, index) => {
          if (index > this.maxEntries) return false;
          if (term.length > 12) return false;
          return WIKIPEDIA_TITLES.includes(term) || FRAN_ENTRIES.includes(term);
        });

        const filteredWords = filteredEntries.map((e) => e.term);
        console.log(filteredWords);

        // SUCCESS: create grid
        this.create(filteredWords);
      }
    } catch (err) {
      // error: show error warning
      console.warn(responseText);
      console.error(err);
      $('#input').value = 'Ni rezultatov.';
      document.body.dataset.view = 'input';
    }
  },

  create(entries) {
    this.Words = new Words(entries);
    this.Grid = new Grid().init();
    this.Words.init();
    this.Count = new Count(this.Words.objects.length).init();
    Direction.reset();

    document.body.dataset.view = 'grid';
  },

  win() {
    $('#grid').style.setProperty('pointer-events', 'none');

    if (this.easterEgg) heartShower();
    else if (this.Grid.size < 7) confetti();
    else confetti({ particleCount: 100, spread: 70 }); // , origin: { y: 0.6 }
  },
};

Main.init();
