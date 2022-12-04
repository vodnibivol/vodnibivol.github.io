const Rtv = (function () {
  // vars
  const CLIENT_ID = '82013fb3a531d5414f478747c1aca622';
  const AUX_ID = 174773721; // 174821160
  const dstore = new Store('RTV_CACHE');

  // --- higher level functions

  async function getStream(mediaId) {
    const metadata = await getMeta(mediaId);
    const { response } = metadata;

    const khash = await _getKhash();

    const recDateDash = response.recordingDate.match(/^[\d-]+/)[0];
    const recDateSlash = recDateDash.replace(/-/g, '/');

    const archive = await _getArchive(recDateDash);
    const streamUrl = `https://vodstr.rtvslo.si/${archive}/_definst_/${recDateSlash}/${mediaId}.smil/playlist.m3u8?keylockhash=${khash}`;

    return streamUrl;
  }

  async function getAudio(mediaId, jwt) {
    let mediadata = await _getMedia(mediaId, jwt);
    console.log(mediadata);
    const streams = mediadata.response.mediaFiles[0].streams;
    return streams.https || streams.http;
  }

  // --- lower level functions

  async function getSearch(searchUrl) {
    const cached = dstore.get(searchUrl);
    if (!!cached) return cached.data;

    const r = await ffetch(searchUrl);

    dstore.set(searchUrl, r, dstore.MINUTE * 15);
    return r;
  }

  async function getMeta(mediaId) {
    const cached = dstore.get('meta_' + mediaId);
    if (!!cached) return cached.data;

    const META_URL = `https://api.rtvslo.si/ava/getRecordingDrm/${mediaId}?client_id=${CLIENT_ID}`;
    const r = await ffetch(META_URL);

    dstore.set('meta_' + mediaId, r, dstore.DAY);
    return r;
  }

  async function _getMedia(mediaId, jwt) {
    const cached = dstore.get('media_' + mediaId);
    if (!!cached) return cached.data;

    if (!jwt) jwt = await _getJwt(mediaId);

    const MEDIA_URL = `https://api.rtvslo.si/ava/getMedia/${mediaId}?client_id=${CLIENT_ID}&jwt=${jwt}`;
    const r = await ffetch(MEDIA_URL);

    dstore.set('media_' + mediaId, r, dstore.MINUTE * 15);
    return r;
  }

  async function _getJwt(mediaId = AUX_ID) {
    const cached = dstore.get('jwt');
    if (!!cached) return cached.data;

    const AUX_URL = `https://api.rtvslo.si/ava/getRecordingDrm/${mediaId}?client_id=${CLIENT_ID}`;
    const r = await ffetch(AUX_URL);
    const { jwt } = r.response;

    dstore.set('jwt', jwt, dstore.MINUTE * 15);
    return jwt;
  }

  async function _getKhash() {
    const jwt = await _getJwt(AUX_ID);
    const r = await _getMedia(AUX_ID, jwt);

    const streams = r.response.mediaFiles[0].streams;
    const khash = JSON.stringify(streams).match(/keylockhash=([\w-]+)/)[1]; // TODO: preveri, ali ni vec razlicnih keylockhashev
    return khash;
  }

  async function _getArchive(recDate) {
    const cached = dstore.get('archive_' + recDate);
    if (!!cached) return cached.data;

    for (let i = 0; i <= 5; i++) {
      const startDay = _dayDelta(recDate, i);
      const endDay = _dayDelta(recDate, i);

      // prettier-ignore
      const SEARCH_URL = `https://api.rtvslo.si/ava/getSearch2?client_id=${CLIENT_ID}&from=${startDay}&to=${endDay}&pageSize=${i*12}`;
      const search = await ffetch(SEARCH_URL);

      const archives = JSON.stringify(search).match(/archive(\d)+/g);
      if (archives === null) continue;
      const correctArchive = _mostFreq(archives).replace('archive', 'encrypted');

      dstore.set('archive_' + recDate, correctArchive, dstore.YEAR);
      return correctArchive;
    }
  }

  // --- utility functions

  function _mostFreq(arr) {
    const hashmap = arr.reduce((acc, val) => {
      acc[val] = (acc[val] || 0) + 1;
      return acc;
    }, {});
    return Object.keys(hashmap).reduce((a, b) => (hashmap[a] > hashmap[b] ? a : b));
  }

  function _dayDelta(date, days = 0) {
    if (!date) return null;
    const _1DAY = 24 * 60 * 60 * 1000;
    const oldDate = new Date(date);
    const newDate = new Date(oldDate.valueOf() + days * _1DAY);
    const newDateString = newDate.toISOString().match(/\d{4}-\d{2}-\d{2}/)[0];
    return newDateString;
  }

  return { getSearch, getMeta, getStream, getAudio };
})();

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
