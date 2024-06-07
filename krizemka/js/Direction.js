const Direction = {
  ALL_DIRS: [
    { x: 1, y: 0 },
    { x: 1, y: 1 },
    { x: 0, y: 1 },
    { x: -1, y: 1 },
    { x: -1, y: 0 },
    { x: -1, y: -1 },
    { x: 0, y: -1 },
    { x: 1, y: -1 },
  ],

  get selectedDirs() {
    return this.selectedDirIndexes.map((i) => this.ALL_DIRS[i]).filter((obj) => !!obj);
  },

  selectedDirIndexes: [], // indexes of "ALL_DIRS"
  history: [], // indexes of "ALL_DIRS"

  init() {
    // 1. attach event listener to toggle
    $('#dir-open-toggle').onclick = (e) => {
      // toggle directions
      $('#dirs-wrapper').toggleAttribute('data-open');
    };

    // 2. attach event listener to elements
    $('#dirs-wrapper').onclick = ({ target: t }) => {
      if (!t.matches('.dir')) return;

      // (1) toggle data-selected => (2) get indexes from $$() => (3) update localStorage => (4) render
      if (this.selectedDirs.length > 1 || !('selected' in t.dataset)) t.toggleAttribute('data-selected');
      this.selectedDirIndexes = [...$$('#dirs-wrapper .dir[data-selected]')].map(elementIndex);
      localStorage.setItem('KRIŽEMKA_DIRS', this.selectedDirIndexes.join(','));
      this.render();
    };

    // get localStorage
    this.selectedDirIndexes = (localStorage.getItem('KRIŽEMKA_DIRS') || '0,1,2').split(',').map((i) => parseInt(i));

    // render
    this.render();
  },

  render() {
    [...$$('#dirs-wrapper .dir')].forEach((d, i) => {
      if (this.selectedDirIndexes.includes(i)) d.dataset.selected = '';
      else delete d.dataset.selected;
    });
  },

  frequenceUsed(dir) {
    return arrayCount(this.history, this.getIndex(dir));
  },

  getIndex(dir) {
    return this.selectedDirIndexes.findIndex(({ x, y }) => x === dir.x && y === dir.y);
  },

  saveDir(dir) {
    this.history.push(this.getIndex(dir));
  },
};
