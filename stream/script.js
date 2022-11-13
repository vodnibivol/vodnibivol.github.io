const Main = (function () {
  // vars
  const $ = (sel) => document.querySelector(sel);
  const IS_DEV = /localhost|127\.0\.0\.1|dev/.test(location.href);

  const urlParams = new URLSearchParams(location.search);
  let state = 'INIT'; // INIT, LOADING, LOADED, ERROR
  let error = '';

  // init
  init();

  // f(x)
  function init() {
    const IS_FULLSCREEN = urlParams.has('fs');
    if (IS_FULLSCREEN) $('.main').classList.add('fullscreen');

    const src = urlParams.get('src');
    if (!src) return updateMsg((state = 'ERROR'));

    if (IS_DEV) console.log(src);

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
          $('video').setAttribute('controls', true);
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
      console.warn('hls not available .. playing in apple native player');

      $('video').src = src;
      $('video').setAttribute('controls', true);
      $('video').classList.remove('invisible');
    } else {
      alert('error. see logs ..');
      console.error('Hls not supported and cannot play ..');
    }
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
