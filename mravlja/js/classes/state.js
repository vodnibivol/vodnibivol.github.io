export const state = {
  text: null,
  dt: 0,
  colors: [
    // sampled from cover art of https://www.gorillasun.de/blog/gorilla-newsletter-76/
    '#f87186',
    '#f7d53c',
    '#5fbaac',
    '#a74771',
    '#f6ad2e',
    '#afb443',
    '#64afc1',
    '#f76a46',
    '#717858',
    '#773323',
    '#fedcda',
  ],
  isMobile: 'ontouchstart' in window || navigator.maxTouchPoints > 0,

  // --- "game" states
  mouseHasBeenClicked: false,
  tempText: '',

  // --- debug mode
  debugCircle: document.querySelector('.circle'),
  isDebug: false,

  toggleDebug() {
    this.isDebug = !this.isDebug;

    const onOffString = this.isDebug ? 'znanstveni način' : 'neznanstveni način';
    this.text.showTempText(onOffString, 3000);

    if (this.isDebug) {
      this.debugCircle.classList.add('active');
    } else {
      this.debugCircle.classList.remove('active');
    }
  },

  initEvents() {
    // document.addEventListener('touchstart', (e) => e.preventDefault(), { passive: false });
    this.debugCircle.onmousedown = () => this.toggleDebug();
  },
};
