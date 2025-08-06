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
    textFont('Monaco');
    textAlign(CENTER, CENTER);
    textSize(22);
    textStyle(NORMAL);

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
