import Ants from './classes/Ant.js';
import Cursor from './classes/Cursor.js';
import Food from './classes/Food.js';

const sketch = (p) => {
  const cursor = new Cursor(p);
  const food = new Food(p);
  const ants = new Ants(p, food);

  window.debug = false;

  const isMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  p.setup = () => {
    setCanvasSize();
  };

  p.draw = () => {
    p.background('ivory');

    if (!isMobile) {
      cursor.update();
      if (!cursorIsOffCanvas()) cursor.draw();
    }

    food.update();
    food.draw();

    ants.update();
    ants.draw();
  };

  p.mousePressed = (e) => {
    if (cursorIsOffCanvas()) return;

    const cursorPos = isMobile ? cursor.mousePos : cursor.pos;
    food.placeNew(cursorPos);
  };

  p.windowResized = () => setCanvasSize();

  const setCanvasSize = () => {
    const canvasSize = p.windowWidth < 400 ? 300 : 400;
    p.createCanvas(canvasSize, canvasSize);
  };

  const cursorIsOffCanvas = () => {
    const canvasCenter = p.createVector(p.width / 2, p.height / 2);
    return cursor.mousePos.dist(canvasCenter) > p.width / 2;
  };
};

new p5(sketch);
