const $ = (sel) => document.querySelector(sel);

const Slikar = {
  colors: ['black', 'white', 'red', 'green', 'blue', 'yellow'],
  currentColor: 0,
  strokeWidth: 4,

  init() {
    $('input[type="color"]').onchange = ({ target: t }) => (this.colors[this.currentColor] = t.value);
    $('input[type="range"]').onchange = ({ target: t }) => (this.strokeWidth = t.value);
  },

  download() {
    const link = document.createElement('a');
    link.download = 'slikica.png';
    link.href = $('#canvas').toDataURL();
    link.click();
  },

  selectColor(index) {
    this.currentColor = index;
    $('input[type="color"]').value = colorToHex(this.colors[this.currentColor]);
  },

  pickColor() {
    $('input[type="color"]').click();
  },

  addColor() {
    this.colors.push('pink');
    this.currentColor = this.colors.length - 1; // optional
  },

  removeColor() {
    this.colors.splice(this.currentColor, 1);
  },

  download() {
    const link = document.createElement('a');
    link.download = 'slikica.png';
    link.href = $('#canvas').toDataURL();
    link.click();
  },
};

const Canvas = (function () {
  const canvas = document.querySelector('#canvas');
  const ctx = canvas.getContext('2d');
  let rect = canvas.getBoundingClientRect();

  let active = true;
  let prevX, prevY;

  // --- init
  background('white');

  // --- events
  window.onresize = () => (rect = canvas.getBoundingClientRect());
  window.onblur = () => (active = false);
  window.onfocus = () => (active = true);
  document.onmousedown = (e) => {
    ctx.fillStyle = Slikar.colors[Slikar.currentColor];
    rect = canvas.getBoundingClientRect();

    const currX = e.clientX;
    const currY = e.clientY;

    active && point(currX, currY);
  };

  document.onmousemove = (e) => {
    const currX = e.clientX;
    const currY = e.clientY;

    const mouseIsDown = e.button || e.buttons;
    active && mouseIsDown && line(prevX, prevY, currX, currY);

    prevX = currX;
    prevY = currY;
  };

  // --- functions
  function background(color) {
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  function point(x, y) {
    const bw = 4; // canvas border width
    const lw = Slikar.strokeWidth; // line width

    const xPos = x - Math.round(rect.x) - bw;
    const yPos = y - Math.round(rect.y) - bw;

    circle(Math.round(xPos - lw / 2), Math.round(yPos - lw / 2), lw, lw);
    // ctx.fillRect(xPos - Math.round(lw / 2), yPos - Math.round(lw / 2), lw, lw);
  }

  function circle(x0, y0, r) {
    for (let y = 0; y < r; ++y) {
      for (let x = 0; x < r; ++x) {
        if (dist(x, y, (r - 1) / 2, (r - 1) / 2) < (r / 3) * Math.SQRT2) {
          // dont't know why the math is right
          setPixel(x0 + x, y0 + y);
        }
      }
    }
  }

  function setPixel(x, y) {
    ctx.fillRect(x, y, 1, 1);
  }

  function line(x0, y0, x1, y1) {
    var dx = Math.abs(x1 - x0);
    var dy = Math.abs(y1 - y0);
    var sx = x0 < x1 ? 1 : -1;
    var sy = y0 < y1 ? 1 : -1;
    var err = dx - dy;

    let count = 0;
    while (count++ < 10000) {
      point(x0, y0);

      if (x0 === x1 && y0 === y1) break;
      var e2 = 2 * err;
      if (e2 > -dy) {
        err -= dy;
        x0 += sx;
      }
      if (e2 < dx) {
        err += dx;
        y0 += sy;
      }
    }
  }

  // --- helpers

  function dist(x0, y0, x1, y1) {
    return Math.sqrt(Math.pow(x1 - x0, 2) + Math.pow(y1 - y0, 2));
  }

  return { canvas, ctx, circle };
})();

function colorToHex(cssColorName) {
  const toHex = (str) => parseInt(str).toString(16).padStart(2, 0);

  const el = document.createElement('div');
  el.style.color = cssColorName;
  el.style.display = 'none';
  document.body.appendChild(el);

  const style = getComputedStyle(el).color;
  const [_, r, g, b] = style.match(/(\d+), (\d+), (\d+)/);
  const hex = '#' + toHex(r) + toHex(g) + toHex(b);

  el.remove();
  return hex;
}

function colorToRgb(cssColorName) {
  const el = document.createElement('div');
  el.style.color = cssColorName;
  el.style.display = 'none';
  document.body.appendChild(el);

  const style = getComputedStyle(el).color;
  const [_, r, g, b] = style.match(/(\d+), (\d+), (\d+)/);

  el.remove();
  return [r, g, b].map(parseFloat);
}
