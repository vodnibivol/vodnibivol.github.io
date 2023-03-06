const Canvas = {
  canvas: $('#canvas'),
  ctx: $('#canvas').getContext('2d'),

  draggedLetters: [],
  dragging: false,

  mouseCoords: {},

  init() {
    this.ctx.lineWidth = 3;
    this.ctx.lineJoin = 'round';
    this.ctx.lineCap = 'round';

    // events
    document.addEventListener('mousedown', this._onmousedown.bind(this));
    document.addEventListener('touchstart', this._onmousedown.bind(this));

    document.addEventListener('mouseup', this._onmouseup.bind(this));
    document.addEventListener('touchend', this._onmouseup.bind(this));
    document.addEventListener('touchcancel', this._onmouseup.bind(this));

    document.addEventListener('mousemove', this._onmousemove.bind(this));
    document.addEventListener('touchmove', this._onmousemove.bind(this));
  },

  _onmousedown(e) {
    this.dragging = true;
    this._onmousemove(e);
  },

  _onmouseup() {
    this.dragging = false;

    if (this.draggedLetters.length >= 3) Piknik.$data.checkWord();

    this.draggedLetters = [];
    Piknik.$data.draggedLetters = [];

    this.draw();
  },

  _onmousemove(e) {
    if (!this.dragging) return;

    if (e.target.matches('#letters .letter:not(.selected)')) {
      // if mouse over letter
      const index = parseInt(e.target.dataset.index);
      this.draggedLetters.push(index);
      Piknik.$data.draggedLetters = [...this.draggedLetters];
    }

    const canvasRect = this.canvas.getBoundingClientRect();
    const [x, y] = [e.clientX - canvasRect.x, e.clientY - canvasRect.y];

    this.mouseCoords = { x, y };

    this.draw();
  },

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    if (!this.draggedLetters.length) return;
    // console.log(this.draggedLetters);

    const points = this.draggedLetters.map((dl) => {
      // get coordinates
      const el = [...$$('#letters .letter')][dl];
      const rect = el.getBoundingClientRect();

      const canvasRect = this.canvas.getBoundingClientRect();

      const x = rect.x - canvasRect.x + rect.width / 2;
      const y = rect.y - canvasRect.y + rect.height / 2;

      return { x: 0.5 + Math.round(x), y: 0.5 + Math.round(y) }; // 0.5 ker je lineWidth = 3
      return { x, y };
    });

    if (this.draggedLetters.length < Piknik.$data.letters.length) {
      points.push({ x: this.mouseCoords.x, y: this.mouseCoords.y });
    }

    this.ctx.beginPath();
    this.ctx.moveTo(points[0].x, points[0].y);
    for (let p of points) {
      this.ctx.lineTo(p.x, p.y);
    }

    this.ctx.stroke();
  },
};
