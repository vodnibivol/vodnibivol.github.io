const Fetch = (function () {
  // vars
  const CLIENT_ID = '82013fb3a531d5414f478747c1aca622';
  const AUX_ID = 174821160;

  let KHASH;

  // f(x)
  async function getStream(mediaId) {
    let metadata = await getMeta(mediaId);
    let { response } = metadata;

    let khash = KHASH || (await _getKhash());

    let recDateDash = response.recordingDate.match(/^[\d-]+/)[0];
    let recDateSlash = recDateDash.replace(/-/g, '/');

    let streamUrl = `https://vodstr.rtvslo.si/{archive}/_definst_/${recDateSlash}/${mediaId}.smil/playlist.m3u8?keylockhash=${khash}`;
    let correctUrl = await _getArchive(streamUrl, recDateDash);

    return correctUrl;
  }

  async function getMeta(mediaId) {
    const META_URL = `https://api.rtvslo.si/ava/getRecordingDrm/${mediaId}?client_id=${CLIENT_ID}`;

    const r = await ffetch(META_URL);
    return r;
  }

  async function _getMedia(mediaId, jwt) {
    const MEDIA_URL = `https://api.rtvslo.si/ava/getMedia/${mediaId}?client_id=${CLIENT_ID}&jwt=${jwt}`;

    const r = await ffetch(MEDIA_URL);
    return r;
  }

  async function _getJwt(mediaId = AUX_ID) {
    const AUX_URL = `https://api.rtvslo.si/ava/getRecordingDrm/${mediaId}?client_id=${CLIENT_ID}`;

    const r = await ffetch(AUX_URL);
    const jwt = r.response.jwt;

    return jwt;
  }

  async function _getKhash() {
    const jwt = await _getJwt(AUX_ID);
    const r = await _getMedia(AUX_ID, jwt);

    const streams = r.response.mediaFiles[0].streams;
    const khash = JSON.stringify(streams).match(/(?<=keylockhash=)[\w-]+/)[0]; // TODO: preveri, ali ni vec razlicnih keylockhashev

    KHASH = khash;
    setTimeout(() => (KHASH = null), 5 * 60 * 1000); // reset after 5 minutes

    return khash;
  }

  async function _getArchive(templateUrl, recDate) {
    for (let i = 0; i <= 5; i++) {
      const startDay = _dayDelta(recDate, i);
      const endDay = _dayDelta(recDate, i);

      // prettier-ignore
      const searchUrl = `https://api.rtvslo.si/ava/getSearch2?client_id=${CLIENT_ID}&from=${startDay}&to=${endDay}&pageSize=${i*12}`;
      const search = await ffetch(searchUrl);

      const archives = JSON.stringify(search).match(/archive(\d)+/g);
      if (archives === null) continue;
      const correctArchive = _mostFreq(archives).replace('archive', 'encrypted');

      return templateUrl.replace('{archive}', correctArchive);
    }
  }

  // --- utils

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

  return { getMeta, getStream };
})();
