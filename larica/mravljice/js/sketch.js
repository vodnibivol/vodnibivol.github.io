import Ants from './classes/Ant.js';
import Cursor from './classes/Cursor.js';
import Food from './classes/Food.js';

const sketch = (p) => {
  const cursor = new Cursor(p);
  const food = new Food(p);
  const ants = new Ants(p, food);

  p.setup = () => {
    setCanvasSize();
    p.angleMode(p.DEGREES);

    ants.createNew();
    ants.createNew();
  };

  p.draw = () => {
    p.background('ivory');

    cursor.update();
    cursor.draw();

    food.update();
    food.draw();

    ants.update();
    ants.draw();
  };

  p.mousePressed = () => {
    for (let i = 0; i < p.random(1, 5); i++) {
      const offsetPos = p5.Vector.add(cursor.pos, p5.Vector.random2D().mult(p.random(30)));
      food.placeNew(offsetPos);
    }
  };

  p.windowResized = () => setCanvasSize();

  function setCanvasSize() {
    if (p.windowWidth < 700) {
      p.createCanvas(p.windowWidth, p.windowHeight);
    } else {
      p.createCanvas(400, 400);
    }
  }
};

new p5(sketch);
