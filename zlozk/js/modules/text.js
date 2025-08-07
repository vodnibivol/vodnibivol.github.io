const Text = {
  // draw game state
  draw() {
    // -- CURSOR
    const mouseIsOnArrow = dist(mouseX, mouseY, width / 2, lerp(Grid.bbox.bottom, height, 0.49)) < 50;
    cursor(Game.levelWon && mouseIsOnArrow ? HAND : ARROW);

    // -- TEXT
    noStroke();
    fill(0);

    blendMode(DARKEST);
    if (Game.levelWon) this.drawArrow();
    else this.drawLevel();
  },

  drawArrow() {
    textFont('system-ui'); // = 'SF Pro'; Monaco ima dobro puscico
    textAlign(CENTER, CENTER);
    textSize(18);
    textStyle(BOLD);

    text('→', width / 2, lerp(Grid.bbox.bottom, height, 0.49));
  },

  drawLevel() {
    textFont('Menlo');
    textAlign(RIGHT, BOTTOM);
    textSize(12);
    textStyle(BOLD);
    fill(80);

    text('L' + Game.level, width - 22, height - 22);
  },
};
