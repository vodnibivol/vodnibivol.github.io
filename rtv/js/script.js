function search() {
  return {
    results: [],
    query: '',
    searchUrl: '',
    loading: false,
    ID_REGEX: /\d{7,11}/,

    get msg() {
      return `[ ${this.loading ? 'nalaganje ..' : 'empty'} ]`;
    },

    get queryC() {
      return this.query.replace(/-\w+/g, '').trim(); // clean query
    },

    get flags() {
      return {
        movies: this.query.includes('-f'),
        all: this.query.includes('-a'),
        documentaries: this.query.includes('-d'),
        size: /-\d+/.test(this.query) && this.query.match(/-(\d+)/)[1],
        none: !/-\w/.test(this.query),
      };
    },

    init() {
      document.querySelector('form input[type="text"]').select();
    },

    async onSubmit() {
      this.loading = true;
      this.results = [];

      if (this.ID_REGEX.test(this.query)) {
        // search by id
        const id = this.query.match(this.ID_REGEX)[0];
        const meta = await Rtv.getMeta(id);
        if (/error/i.test(meta.response.title)) return this.getStreams([]);
        return this.getStreams([meta.response]);
      }

      console.log(this.flags.size);

      if (this.query === 'clear') {
        this.loading = false;
        this.query = '';
        return localStorage.removeItem('RTV_CACHE'); // TODO: remove
      }

      const urlComponent = new URL('https://api.rtvslo.si/ava/getSearch2?client_id=8c5205a95060a482f0fc96b9162d9e3f');

      urlComponent.searchParams.set('q', this.queryC);
      urlComponent.searchParams.set('unpublished', 1);
      urlComponent.searchParams.set('pageSize', this.flags.size || 12);

      const types = [];
      if (this.flags.movies) types.push(15890843);
      if (this.flags.documentaries) types.push(15890840);
      urlComponent.searchParams.set('showTypeId', types.join());

      this.searchUrl = urlComponent.toString();
      this.getJSON();
    },

    async getJSON() {
      const regex = new RegExp(this.queryC, 'i');

      const data = await Rtv.getSearch(this.searchUrl); // TODO move everything (above) to Rtv?
      let recs = data.response?.recordings || [];

      if (!this.flags.all) recs = recs.filter((rec) => regex.test(rec.title) && !rec.promo);
      if (this.flags.movies) recs = recs.filter((rec) => !rec.promo);

      this.getStreams(recs);
    },

    async getStreams(recs) {
      // ids and data found => getting stream urls
      if (!recs.length) this.loading = false;

      for (const rec of recs) {
        const id = rec.parent_id || rec.id;

        const streamUrl = './stream?id=' + id;
        this.results.push({ id: rec.id, title: rec.title, streamUrl, length: rec.length });

        await timer(10);
      }
    },
  };
}

const timer = (ms) => new Promise((res) => setTimeout(res, ms));
