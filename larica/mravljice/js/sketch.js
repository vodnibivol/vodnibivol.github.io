import Ants from './classes/Ant.js';
import Cursor from './classes/Cursor.js';
import Food from './classes/Food.js';

const sketch = (p) => {
  const cursor = new Cursor(p);
  const food = new Food(p);
  const ants = new Ants(p, food);

  const isMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  p.setup = () => {
    setCanvasSize();
    // p.angleMode(p.DEGREES);

    ants.createNew();
    // p.frameRate(30);
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
    if (isMobile) return;
    if (cursorIsOffCanvas()) return;

    for (let i = 0; i < p.random(1, 5); i++) {
      const offsetPos = p5.Vector.add(cursor.pos, p5.Vector.random2D().mult(p.random(30)));
      food.placeNew(offsetPos);
    }
  };

  p.touchStarted = (e) => {
    if (!isMobile) return;
    if (cursorIsOffCanvas()) return;

    for (let i = 0; i < p.random(1, 5); i++) {
      const cursorPos = p.createVector(p.mouseX, p.mouseY);
      const offsetPos = p5.Vector.add(cursorPos, p5.Vector.random2D().mult(p.random(30)));
      food.placeNew(offsetPos);
    }
  };

  p.windowResized = () => setCanvasSize();

  const setCanvasSize = () => {
    if (p.windowWidth < 400) {
      p.createCanvas(300, 300);
      // p.createCanvas(p.windowWidth, p.windowHeight);
    } else {
      p.createCanvas(400, 400);
    }
  };

  const cursorIsOffCanvas = () => {
    const cursorPos = p.createVector(p.mouseX, p.mouseY);
    const canvasCenter = p.createVector(p.width / 2, p.height / 2);
    return p5.Vector.dist(cursorPos, canvasCenter) > p.width / 2;
  };
};

new p5(sketch);
