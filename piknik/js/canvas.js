const setup = (p) => {
  const PD = Piknik.$data;

  p.setup = function () {
    const canvas = p.createCanvas(200, 200);
    canvas.parent('canvasContainer');

    p.strokeWeight(3);
    p.strokeCap('round');
    p.strokeJoin('round');
    p.noFill();
  };

  p.draw = function () {
    p.clear();

    if (!p.mouseIsPressed) return;

    const canvasRect = p.canvas.getBoundingClientRect();
    const points = PD.draggedLetters.map((index) => {
      // get coordinates
      const el = $(`.letter[data-index="${index}"]`);
      const rect = el.getBoundingClientRect();

      const x = rect.x - canvasRect.x + rect.width / 2;
      const y = rect.y - canvasRect.y + rect.height / 2;

      return { x: Math.round(x), y: Math.round(y) };
    });

    if (PD.draggedLetters.length < PD.letters.length) {
      points.push({ x: p.mouseX, y: p.mouseY });
    }

    p.beginShape();
    points.forEach((po) => p.vertex(po.x, po.y));
    p.endShape();
  };

  // --- events

  window.onmousemove = (e) => checkLetters(e, e.target);
  window.ontouchmove = (e) => {
    const t = e.touches[0];
    const currentTarget = document.elementFromPoint(t.clientX, t.clientY);
    checkLetters(e, currentTarget);
  };

  p.mousePressed = (e) => checkLetters(e, e.target);
  p.mouseReleased = () => {
    if (PD.draggedLetters.length >= 3) PD.checkWord();
    PD.draggedLetters = [];
  };

  // --- f(x)

  function checkLetters(event, target) {
    event.preventDefault();
    if (p.mouseIsPressed && target.matches('#letters .letter:not(.selected)')) {
      PD.draggedLetters.push(parseInt(target.dataset.index));
    }
  }
};

const myp5 = new p5(setup);
