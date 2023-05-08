const Galerija = {
  loading: false,
  searchString: '', // ali *
  page: 0,

  genre: 15890843,
  // genres: [
  //   { name: 'filmi', id: 00000000000 },
  //   { name: 'dokumentarci', id: 00000000000 },
  // ],

  results: [],
  maxResults: Infinity, // will be added later

  flags: {
    movies: false,
    documentaries: true,
    size: 36, // 12 * n
  },

  get msgText() {
    if (this.results.length === this.maxResults) return 'to je to.';
    if (this.loading) return 'nalaganje ..';
    if (!this.results.length) return 'ni rezultatov.';
  },

  onSubmit() {
    this.results = [];
    this.page = 0;
    this.getSearch();
  },

  async init() {
    this.getSearch();

    window.onscroll = this.infiniteLoad.bind(this);
  },

  async getSearch() {
    const urlComponent = new URL('https://api.rtvslo.si/ava/getSearch2?client_id=8c5205a95060a482f0fc96b9162d9e3f');

    urlComponent.searchParams.set('q', this.searchString);
    urlComponent.searchParams.set('unpublished', 1);
    urlComponent.searchParams.set('pageSize', this.flags.size || 12);

    // urlComponent.searchParams.set('promo', '0');
    urlComponent.searchParams.set('sort', 'date');
    urlComponent.searchParams.set('order', 'desc');
    urlComponent.searchParams.set('pageNumber', this.page);
    // urlComponent.searchParams.set('clip', 'show');
    // urlComponent.searchParams.set('from', '2023-01-01');

    // const types = [];
    // types.push(15890843); // FILMI
    // types.push(15890840); // DOKUMENTARCI
    // urlComponent.searchParams.set('showTypeId', types.join());

    urlComponent.searchParams.set('showTypeId', this.genre);

    const searchUrl = urlComponent.toString();
    this.loading = true;
    this.searchResults = await Rtv.getSearch(searchUrl);

    this.showResults();
    // setTimeout(this.showResults.bind(this), 5000);
  },

  async showResults() {
    const { response } = this.searchResults;
    console.log(this.results.length);

    this.maxResults = response.meta.hits;

    if (response.meta.hits > 0) {
      // ok got some results
      this.results = [...this.results, ...response.recordings];
      console.log({ ...this.results[0] });
    }

    this.loading = false;
  },

  infiniteLoad() {
    if (this.loading) return;
    const offset = 150; // px

    const elm = document.querySelector('#results-container');
    const distToBottom = elm.getBoundingClientRect().top + elm.getBoundingClientRect().height - window.innerHeight;
    if (distToBottom < offset && this.results.length < this.maxResults) {
      console.log('LOAD');
      this.page++;
      this.getSearch();
    }
  },

  selectGenre(genreId) {
    this.genre = genreId;
    this.onSubmit();
  },
};
