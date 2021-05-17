const Fetch = (function () {
  // vars
  const tip = document.querySelector('.tip');

  const inputRegEx = /^https?:\/\/4d\.rtvslo\.si\/arhiv\/[\w-]+\/(\d{7,})$/;

  const CLIENT_ID = '82013fb3a531d5414f478747c1aca622'; // +SESSION_ID?
  const META_TEMPLATE = 'https://api.rtvslo.si/ava/getRecordingDrm/{rec_id}?client_id={client_id}';
  const MEDIA_TEMPLATE = 'https://api.rtvslo.si/ava/getMedia/{rec_id}?client_id={client_id}&jwt={jwt}';
  const DOWNLOAD_TEMPLATE = 'https://progressive.rtvslo.si/encrypted{archive_no}/{date}/{filename}?keylockhash={hash}';

  let rec_id;
  // let stream_url;
  let download_url;

  // f(x)
  async function getLink(url) {
    let match = url.match(inputRegEx);

    if (!match) {
      tip.innerHTML = 'Wrong url';
      tip.classList.add('show');
      Anim.headShake();
      return;
    }

    Anim.check();

    rec_id = match[1];
    _getMeta();
  }

  function _getMeta() {
    let metaUrl = META_TEMPLATE.format({ rec_id: rec_id, client_id: CLIENT_ID });
    // console.log(metaUrl);
    _getScript(metaUrl, 'Fetch.parseMeta');
  }

  function _getMedia(jwt) {
    let mediaUrl = MEDIA_TEMPLATE.format({ rec_id: rec_id, client_id: CLIENT_ID, jwt: jwt });
    // console.log(mediaUrl);
    _getScript(mediaUrl, 'Fetch.parseMedia');
  }

  function parseMeta(data) {
    // console.log(data);
    let jwt = data.response.jwt;
    _getMedia(jwt);
  }

  async function parseMedia(data) {
    console.log(data);
    let r = data.response;

    try {
      let target = r.addaptiveMedia.hls;

      let groups = target.match(/encrypted(\d+)\/_definst_\/([\d\/]+)\/\d{7,}.smil\/.+hash=(.*)$/);

      let largestFile = r.mediaFiles.reduce((acc, cur) => (acc.bitrate > cur.bitrate ? acc : cur));
      let hls = largestFile.streams.hls;

      let filename = hls.match(/\/([\w\d\-]+.mp4)\//)[1];

      let fmt = {
        archive_no: groups[1],
        date: groups[2],
        filename: filename,
        hash: groups[3],
      };

      download_url = DOWNLOAD_TEMPLATE.format(fmt);

      console.log('URL found:');
      console.log(download_url);

      Site.openUrl(download_url);
    } catch (e) {
      console.error(e);
    }
  }

  async function _getScript(url, functionName /* string */) {
    let script = document.createElement('script');

    try {
      script.id = 'ava';
      script.type = 'text/javascript';
      script.src = url + '&callback=' + functionName;

      document.body.appendChild(script);
    } catch (e) {
      console.error(e);
      // fancy animation
    } finally {
      script.remove();
    }
  }

  return { getLink, parseMeta, parseMedia };
})();
