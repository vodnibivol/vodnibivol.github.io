const Galerija = {
  loading: false,
  searchString: '',
  page: 0,

  genre: 15890843, // FILMI

  results: [],
  maxResults: Infinity, // will be added later

  flags: {
    movies: false,
    documentaries: true,
    // size: 36, // 12 * n
    size: 12,
  },

  modalIsOpen: false,
  modalRecording: {},

  get msgText() {
    if (this.results.length === this.maxResults) return 'To je to.';
    if (this.loading) return 'Nalaganje ...';
    if (!this.results.length) return 'Ni rezultatov.';
  },

  onSubmit() {
    this.results = [];
    this.page = 0;
    this.getSearch();
  },

  async init() {
    this.searchFromUrl();
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

    const types = [];
    types.push(15890843); // FILMI
    types.push(15890840); // DOKUMENTARCI
    urlComponent.searchParams.set('showTypeId', types.join());

    urlComponent.searchParams.set('showTypeId', this.genre);

    const searchUrl = urlComponent.toString();
    this.loading = true;
    this.searchResults = await Rtv.getSearch(searchUrl);

    this.showResults();
    this.openModalFromSearch();
    this.addSearchToUrl();
  },

  addSearchToUrl() {
    const urlComponent = new URL(location.href);
    console.log(this.searchString);

    if (this.searchString) {
      urlComponent.searchParams.set('search', this.searchString);
    } else {
      urlComponent.searchParams.delete('search');
    }

    const searchUrl = urlComponent.toString();
    history.pushState({}, '', searchUrl);
  },

  searchFromUrl() {
    const urlComponent = new URL(location.href);
    this.searchString = urlComponent.searchParams.get('search') || '';
  },

  showResults() {
    const { response } = this.searchResults;

    this.maxResults = response.meta.hits;

    if (response.meta.hits > 0) {
      // ok got some results
      this.results = [...this.results, ...response.recordings];
    }

    this.loading = false;
  },

  async openModalFromSearch() {
    const mediaIdInSearch = this.results.find((rec) => rec.id === this.searchMediaId);

    if (mediaIdInSearch) {
      // show modal with that media data from local storage / search fetch
      this.openModal(mediaIdInSearch);
    } else {
      // find recording data and make an independent search
      const mediaRecording = await Rtv.getMeta(this.searchMediaId);

      if (mediaRecording.response && mediaRecording.response.title !== 'Error' && mediaRecording.response.description) {
        // if result is ok
        console.log(mediaRecording.response);
        this.openModal(mediaRecording.response);
      } else {
        // if result is not ok => remove from search
        this.addMediaIdToUrl();
      }
    }
  },

  infiniteLoad() {
    if (this.loading) return;
    const offset = 350; // px

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

  openModal(recording) {
    console.log(recording);
    this.modalRecording = recording;
    this.modalIsOpen = true;
    this.addMediaIdToUrl();
    document.body.classList.add('modal-open');
  },

  closeModal() {
    this.modalIsOpen = false;
    this.modalRecording = null;
    this.addMediaIdToUrl();
    document.body.classList.remove('modal-open');
  },

  addMediaIdToUrl() {
    const urlComponent = new URL(location.href);

    if (this.modalRecording?.id) {
      urlComponent.searchParams.set('mediaId', this.modalRecording.id);
      urlComponent.searchParams.delete('search');
    } else {
      urlComponent.searchParams.delete('mediaId');
      if (this.searchString) urlComponent.searchParams.set('search', this.searchString);
    }

    const searchUrl = urlComponent.toString();
    history.pushState({}, '', searchUrl);
  },

  get searchMediaId() {
    const urlComponent = new URL(location.href);
    return urlComponent.searchParams.get('mediaId') || '';
  },
};
