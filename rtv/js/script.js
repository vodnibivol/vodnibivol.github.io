function search() {
  return {
    results: [],
    query: 'dogman -f',
    searchUrl: '',
    loading: false,
    dstore: new DStore('RTV_CACHE'),
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
        // matching: this.query.includes('-m'),
        none: !/-\w/.test(this.query),
      };
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

      const urlComponent = new URL('https://api.rtvslo.si/ava/getSearch2');

      urlComponent.searchParams.set('q', this.queryC);
      urlComponent.searchParams.set('client_id', '8c5205a95060a482f0fc96b9162d9e3f'); // 82013fb3a531d5414f478747c1aca622
      urlComponent.searchParams.set('unpublished', 1);

      // TODO: set size

      const types = [];
      if (this.flags.movies) types.push(15890843);
      if (this.flags.documentaries) types.push(15890840);
      urlComponent.searchParams.set('showTypeId', types.join());

      this.searchUrl = urlComponent.toString();
      this.getJSON();
    },

    async getJSON() {
      const regex = new RegExp(this.queryC, 'i');

      let data;
      const cached = this.dstore.get(this.searchUrl);
      if (!!cached) {
        data = cached.data;
      } else {
        data = await ffetch(this.searchUrl);
        this.dstore.set(this.searchUrl, data, this.dstore.MINUTE * 15);
      }

      let recs = data.response?.recordings || [];

      if (!this.flags.all) recs = recs.filter((rec) => regex.test(rec.title) && !rec.promo);
      if (this.flags.movies) recs = recs.filter((rec) => !rec.promo);

      this.getStreams(recs);
    },

    async getStreams(recs) {
      // ids and data found => getting stream urls
      if (!recs.length) this.loading = false;

      recs.forEach(async (rec, index) => {
        const id = rec.parent_id || rec.id;

        // TODO: preglej dstore in naredi dostopno (poglej, kako Alpine dobi data)
        // TODO: popravi spodaj in naredi za mp3

        try {
          let url;
          if (rec.mediaType === 'audio') {
            console.info('audio');
            console.log(rec);
            this.results.push({ id: rec.id, title: rec.title, streamUrl: rec.link, length: rec.length });
          } else {
            console.info('video');
            url = await Rtv.getStream(id);

            const streamUrl = '/stream/?src=' + encodeURIComponent(url);
            this.results.push({ id: rec.id, title: rec.title, streamUrl, length: rec.length });
          }
        } catch (error) {
          console.warn('ERR:', id);
          console.info(error);
        } finally {
          if (index === recs.length - 1) this.loading = false;
        }
      });
    },
  };
}

// --- JSONP Fetch function

async function ffetch(url) {
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
    el.src = url + '&callback=' + fooN;
    el.onload = function () {
      window[dataN] = window[fooN] = null;
      el.remove();
    };

    document.body.appendChild(el);
  });
}
