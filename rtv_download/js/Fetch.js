const Fetch = (function () {
  // vars
  const CLIENT_ID = '82013fb3a531d5414f478747c1aca622'; // +SESSION_ID?
  const META_TEMPLATE = 'https://api.rtvslo.si/ava/getRecordingDrm/{rec_id}?client_id={client_id}';
  const MEDIA_TEMPLATE = 'https://api.rtvslo.si/ava/getMedia/{rec_id}?client_id={client_id}&jwt={jwt}';
  const DOWNLOAD_TEMPLATE = 'https://progressive.rtvslo.si/encrypted{archive_no}/{date}/{filename}?keylockhash={hash}';

  let rec_id;
  // let stream_url;
  let download_url;

  // f(x)
  async function getLink(url) {
    let match = url.match(/\d{7,11}/);

    if (!match) {
      Visual.errMsg('Wrong url');
      return;
    }

    Visual.checkmark(true);

    rec_id = match[0];
    console.log(rec_id);
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
    console.log(data);
    try {
      let jwt = data.response.jwt;
      _getMedia(jwt);
    } catch (e) {
      Visual.errMsg('Error parsing metadata.');
    }
  }

  async function parseMedia(data) {
    console.log(data);
    let r = data.response;

    try {
      let largestFile = r.mediaFiles.reduce((acc, cur) => (acc.bitrate > cur.bitrate ? acc : cur));

      let s = largestFile.streams;
      let stream = s.http || s.https || s.hls;

      if (!stream) {
        throw new Error('No url found.');
      }

      if (/(preroll|expired)/.test(stream)) {
        // video expired
        throw new Error('Media expired.');
      }

      if (/progressive.+mp[34]/.test(stream)) {
        // found direct download link
        download_url = stream;
      } else if (/vodstr.*m3u8/.test(stream)) {
        // found hls stream url
        let hls = largestFile.streams.hls;
        let groups = hls.match(/encrypted(\d+)\/_definst_\/([\d\/]+)\/([\w\-]+\.mp4).+hash=(.*)$/);

        let fmt = {
          archive_no: groups[1],
          date: groups[2],
          filename: groups[3],
          hash: groups[4],
        };

        download_url = DOWNLOAD_TEMPLATE.format(fmt);
      }

      console.log('URL found:');
      console.log(download_url);

      Site.openUrl(download_url);
    } catch (e) {
      Visual.errMsg(e);
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
      Visual.errMsg('Error getting JSONP.');
    } finally {
      script.remove();
    }
  }

  return { getLink, parseMeta, parseMedia };
})();
