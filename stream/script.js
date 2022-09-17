const Main = function () {
  return {
    state: 'INIT', // INIT, LOADING, LOADED, ERROR
    error: '',
    video: document.getElementById('video'),
    videoSrc: '',

    get msg() {
      if (this.state === 'LOADING') return '[ loading .. ]';
      if (this.state === 'ERROR') {
        if (this.error === 404) {
          return '[ 404 - not found ]';
        }
        return '[ error ]';
      }
      return '';
    },

    init() {
      this.videoSrc = this.getSrc();

      if (Hls.isSupported()) {
        this.state = 'LOADING';

        // --- setup
        window.hlsComponent = new Hls();
        // bind them together
        window.hlsComponent.attachMedia(video);
        window.hlsComponent.on(Hls.Events.MEDIA_ATTACHED, () => {
          console.log('video and hls.js are now bound together !');
          window.hlsComponent.loadSource(this.videoSrc);
          window.hlsComponent.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
            this.state = 'LOADED';
            console.log('manifest loaded, found ' + data.levels.length + ' quality level');
          });
        });

        // --- error handling
        window.hlsComponent.on(Hls.Events.ERROR, (event, data) => {
          if (data.fatal) {
            this.state = 'ERROR';
            window.hlsComponent.destroy();
            if (data.response.code === 404) {
              this.error = 404;
            }

            console.log(data);
          }
        });
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        this.video.src = videoSrc;
      }
    },

    getSrc() {
      const urlComponent = new URLSearchParams(location.search);
      const src = urlComponent.get('src');
      return src;
    },
  };
};
