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
      return this.query.replace(/-\w/g, '').trim(); // clean query
    },

    get flags() {
      return {
        movies: this.query.includes('-f'),
        all: this.query.includes('-a'),
        documentaries: this.query.includes('-d'),
        matching: this.query.includes('-m'),
      };
    },

    async onSubmit() {
      this.loading = true;
      this.results = [];

      if (this.ID_REGEX.test(this.query)) {
        // search by id
        const id = this.query.match(this.ID_REGEX)[0];
        const meta = await Fetch.getMeta(id);
        if (/error/i.test(meta.response.title)) return this.getStreams([]);
        return this.getStreams([meta.response]);
      }

      let urlComponent = new URL('https://api.rtvslo.si/ava/getSearch2');

      urlComponent.searchParams.set('q', this.queryC);
      urlComponent.searchParams.set('client_id', '8c5205a95060a482f0fc96b9162d9e3f'); // 82013fb3a531d5414f478747c1aca622
      urlComponent.searchParams.set('unpublished', 1);
      urlComponent.searchParams.set('pageSize', 12); // default: 12

      this.searchUrl = urlComponent.toString();

      this.getJSON();
    },

    async getJSON() {
      const regex = new RegExp(this.queryC, 'i');
      const data = await ffetch(this.searchUrl);

      const recs = data.response?.recordings || [];

      const movies = recs.filter((rec) => rec.showTypeId === '15890843' && !rec.promo); // ali rec.duration > npr. 300
      const documentaries = recs.filter((rec) => rec.showTypeId === '15890840');

      // NOTE:  -m > -a > -f/-d

      let selection = [];

      if (this.flags.movies) selection.push(...movies);
      if (this.flags.documentaries) selection.push(...documentaries);
      if (!this.flags.movies && !this.flags.documentaries) selection = movies; // default selection: movies
      if (this.flags.all) selection = recs;
      if (this.flags.matching) selection = selection.filter((rec) => regex.test(rec.title));

      console.log(selection);

      this.getStreams(selection);
    },

    async getStreams(recs) {
      // ids and data found => getting stream urls
      if (!recs.length) this.loading = false;

      recs.forEach(async (rec, index) => {
        const id = rec.parent_id || rec.id;
        const { title } = rec;

        try {
          let url = await Fetch.getStream(id);
          const streamUrl = 'https://www.hlsplayer.net/#type=m3u8&src=' + encodeURIComponent(url);
          this.results.push({ id, title, streamUrl });
        } catch (error) {
          console.warn('ERR:', id);
        } finally {
          if (index === recs.length - 1) this.loading = false;
        }
      });
    },
  };
}

// --- JSONP Fetch function

async function ffetch(url) {
  const REMOVE = true;

  // prettier-ignore
  const HASH = new Array(16).fill().map((_) => Math.floor(Math.random() * 16).toString(16)).join('');
  const fooN = 'foo_' + HASH;
  const dataN = 'data_' + HASH;

  return new Promise(function (resolve, reject) {
    window[fooN] = function (data) {
      window[dataN] = data;
      resolve(window[dataN]);
    };

    const el = document.createElement('script');
    el.setAttribute('id', 'script_' + HASH);

    if (REMOVE)
      el.onload = function () {
        window[dataN] = window[fooN] = null;
        el.remove();
      };

    el.src = url + '&callback=' + fooN; // newUrl.toString();
    document.body.appendChild(el);
  });
}
