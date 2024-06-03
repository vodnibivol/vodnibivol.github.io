const Direction = {
  directions: [
    { x: 1, y: 0 },
    { x: 1, y: 1 },
    { x: 0, y: 1 },
    // { x: -1, y: 1 },
    // { x: -1, y: 0 },
    // { x: -1, y: -1 },
    // { x: 0, y: -1 },
    { x: 1, y: -1 },
  ],

  history: [], // indexes of "directions" above

  frequenceUsed(dir) {
    return arrayCount(this.history, this.getIndex(dir));
  },

  getIndex(dir) {
    return this.directions.findIndex(({ x, y }) => x === dir.x && y === dir.y);
  },

  saveDir(dir) {
    this.history.push(this.getIndex(dir));
  },
};
