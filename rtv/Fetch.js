const Fetch = (function () {
  // vars
  const CLIENT_ID = '82013fb3a531d5414f478747c1aca622';
  const META_TEMPLATE = 'https://api.rtvslo.si/ava/getRecordingDrm/{rec_id}?client_id={client_id}';
  const MEDIA_TEMPLATE = 'https://api.rtvslo.si/ava/getMedia/{rec_id}?client_id={client_id}&jwt={jwt}';

  const REGEX_IDEC = /P-\d{7}-\d{3}-\d{4}-\d{3}/; // P-1033308-000-2021-096
  const REGEX_ID = /\d{7,11}/; // 174689123

  let rec_id;

  // f(x)
  function getUrl(url) {
    let match = url.match(REGEX_IDEC) || url.match(REGEX_ID);

    if (!match) {
      alert('napačni url/id');
      return;
    }

    $('#submitBtn').classList.add('correct');

    rec_id = match[0];
    _getMeta();
  }

  function _getMeta() {
    let metaUrl = META_TEMPLATE.format({ rec_id: rec_id, client_id: CLIENT_ID });
    _getScript(metaUrl, 'Fetch.parseMeta');
  }

  function _getMedia(jwt) {
    let mediaUrl = MEDIA_TEMPLATE.format({ rec_id: rec_id, client_id: CLIENT_ID, jwt: jwt });
    _getScript(mediaUrl, 'Fetch.parseMedia');
  }

  function parseMeta(data) {
    let { jwt } = data.response;
    _getMedia(jwt);
  }

  function parseMedia(data) {
    console.log(data);
    let { response } = data;

    let stream = response.addaptiveMedia?.hls || response.addaptiveMedia?.hls_sec;

    console.log('URL found:');
    console.log(stream);

    window.location.href = stream;
  }

  function _getScript(url, functionName /* string */) {
    let script = document.createElement('script');

    try {
      script.id = 'ava';
      script.type = 'text/javascript';
      script.src = url + '&callback=' + functionName;

      script.onerror = function () {
        console.log('Error getting JSONP');
        alert('Error getting JSONP');
      };

      document.body.appendChild(script);
    } catch (e) {
      console.error(e);
      alert('Error getting JSONP');
    } finally {
      script.remove();
    }
  }

  return { getUrl, parseMeta, parseMedia };
})();

// --- UTILS

String.prototype.format = function () {
  'use strict';
  var str = this.toString();
  if (arguments.length) {
    var t = typeof arguments[0];
    var key;
    var args = 'string' === t || 'number' === t ? Array.prototype.slice.call(arguments) : arguments[0];

    for (key in args) {
      str = str.replace(new RegExp('\\{' + key + '\\}', 'gi'), args[key]);
    }
  }

  return str;
};
