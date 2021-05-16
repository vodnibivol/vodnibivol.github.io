const Fetch = (function () {
  // cache
  const dlAnchor = document.getElementById('anchor');

  const regEx = /^https?:\/\/4d\.rtvslo\.si\/arhiv\/[\w-]+\/(\d{7,})$/;

  // const PROXY = 'https://corsaire.herokuapp.com/';
  const CLIENT_ID = '82013fb3a531d5414f478747c1aca622'; // +SESSION_ID?
  const META_URL = 'https://api.rtvslo.si/ava/getRecordingDrm/{rec_id}?client_id={client_id}';
  const MEDIA_URL = 'https://api.rtvslo.si/ava/getMedia/{rec_id}?client_id={client_id}&jwt={jwt}';

  let rec_id;

  // f(x)
  async function getLink(url) {
    let match = url.match(regEx);

    if (!match) {
      /**
       * tip.innerHTML = 'wrong url';
       * tip.classList.add('show');
       * headShake();
       */
      return;
    }

    rec_id = match[1];
    console.log(rec_id);

    _getMeta();
  }

  function _getMeta() {
    let metaUrl = META_URL.format({ rec_id: rec_id, client_id: CLIENT_ID });
    console.log(metaUrl)
    _getScript(metaUrl, 'Fetch.parseMeta');
  }

  function _getMedia(jwt) {
    let mediaUrl = MEDIA_URL.format({ rec_id: rec_id, client_id: CLIENT_ID, jwt: jwt });
    console.log(mediaUrl);
    _getScript(mediaUrl, 'Fetch.parseMedia');

    // console.log(r);

    // let target = r.response.addaptiveMedia.hls;
    // console.log(target);

    // _getDownload(target);

    //
  }

  function parseMeta(data) {
    console.log('SUCCESS');
    console.log(data);

    let jwt = data.response.jwt;

    _getMedia(jwt);
  }

  function parseMedia(data) {
    console.log('SUCCESS');
    console.log(data);
    let r = data.response;

    try {
      let target = r.addaptiveMedia.hls;

      console.log(target)

      let groups = target.match(/(encrypted|archive)(\d+)\/_definst_\/([\d\/]+)\/\d{7,}.smil/);

      console.log(groups)

      let archive = groups[0];
      let date = groups[1];
      let hash = groups[2];

      console.log(archive, date, hash);
    } catch (e) {
      console.error(e);
    }
  }

  async function _getDownload(hls) {
    console.log('here');
    let smilUrl = hls.replace('vodstr', 'progressive').replace('_definst_/', '').replace('/playlist.m3u8', '');
    return smil;
  }

  async function _getScript(url, functionName) {
    console.log('running script');

    try {
      script = document.createElement('script');
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
