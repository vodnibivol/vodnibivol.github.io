const Main = (function () {
  // vars
  const $ = (sel) => document.querySelector(sel);

  let state = 'INIT'; // INIT, LOADING, LOADED, ERROR
  let error = '';

  // init
  init();

  // f(x)
  function init() {
    const fs = getFullscreen();
    if (fs) $('.main').classList.add('fullscreen');

    const src = getSrc();
    if (!src) return updateMsg((state = 'ERROR'));

    if (Hls.isSupported()) {
      // --- setup
      window.hlsComponent = new Hls();
      // bind them together
      window.hlsComponent.attachMedia($('video'));
      window.hlsComponent.on(Hls.Events.MEDIA_ATTACHED, () => {
        console.log('video and hls.js are now bound together !');
        state = 'LOADING';
        updateMsg();

        $('video').onloadeddata = () => {
          state = 'LOADED';
          updateMsg();
          $('video').classList.remove('invisible');
        };

        window.hlsComponent.loadSource(src);
        window.hlsComponent.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
          console.log('manifest loaded, found ' + data.levels.length + ' quality level');
        });
      });

      // --- error handling
      window.hlsComponent.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          state = 'ERROR';
          updateMsg();
          window.hlsComponent.destroy();
          if (data.response.code === 404) {
            error = 404;
          }
          console.log(data);
        }
      });
    } else if ($('video').canPlayType('application/vnd.apple.mpegurl')) {
      $('video').src = src;
    }
  }

  function getSrc() {
    const urlComponent = new URLSearchParams(location.search);
    return urlComponent.get('src');
  }

  function getFullscreen() {
    const urlComponent = new URLSearchParams(location.search);
    return urlComponent.has('fs');
  }

  function updateMsg() {
    let msg;

    if (state === 'LOADING') msg = 'loading ..';
    if (state === 'ERROR') {
      if (error === 404) msg = '404 - not found';
      msg = 'error';
    }

    $('#msg').innerText = '[ ' + msg + ' ]';

    if (!!msg) $('#msg').classList.remove('hidden');
    else $('#msg').classList.add('hidden');
  }
})();
