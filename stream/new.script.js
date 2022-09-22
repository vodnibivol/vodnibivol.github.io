const Main = function () {
  // vars
  const $ = (sel) => document.querySelector(sel);

  let state = 'INIT'; // INIT, LOADING, LOADED, ERROR
  let error = '';

  let videoEl = $('#video');

  // init
  init();

  // f(x)
  function init() {
    const src = getSrc();
    const fs = getFullscreen();
    if (fs) $('.main').classList.add('fullscreen');

    if (!src) return (state = 'ERROR');

    if (Hls.isSupported()) {
      // --- setup
      window.hlsComponent = new Hls();
      // bind them together
      window.hlsComponent.attachMedia(videoEl);
      window.hlsComponent.on(Hls.Events.MEDIA_ATTACHED, () => {
        console.log('video and hls.js are now bound together !');
        state = 'LOADING';

        videoEl.onloadeddata = () => {
          state = 'LOADED';
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
          window.hlsComponent.destroy();
          if (data.response.code === 404) {
            error = 404;
          }
          console.log(data);
        }
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      videoEl.src = src;
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
    let msg = '';

    if (state === 'LOADING') msg = 'loading ..';
    if (state === 'ERROR') {
      if (error === 404) msg = '404 - not found';
      msg = 'error';
    }

    $('p.msg').innerText = '[ ' + msg + ' ]';
  }
};
