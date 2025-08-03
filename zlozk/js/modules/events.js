function windowResized() {
  resizeCanvas(windowWidth, windowHeight);

  // move shapes to new location
  Shapes.arr.forEach((sh) => {
    sh.position.x += (width - SCREEN_SIZE.width) / 2;
    sh.position.y += (height - SCREEN_SIZE.height) / 2;

    // correct if off screen
    sh.position.x = min(width - sh.width, max(0, sh.position.x));
    sh.position.y = min(height - sh.height, max(0, sh.position.y));
  });

  SCREEN_SIZE = { width, height };
}

// --- DRAGGING

function mousePressed() {
  if (Game.levelWon) return;
  Drag.onStart();
  return false;
}

function touchStarted() {
  if (Game.levelWon) return;
  Drag.onStart();
  return false;
}

function mouseReleased() {
  if (Game.levelWon) {
    // INIT NEXT LEVEL
    const mouseIsOnArrow = dist(mouseX, mouseY, width / 2, height * 0.75) < 50;
    if (mouseIsOnArrow) return Game.init(); // true: LEVEL++
  }

  Drag.onEnd();
  return false;
}

function touchEnded() {
  if (Game.levelWon) {
    // INIT NEXT LEVEL
    const mouseIsOnArrow = dist(mouseX, mouseY, width / 2, height * 0.75) < 50;
    if (mouseIsOnArrow) return Game.init();
  }

  Drag.onEnd();
  return false;
}

function mouseDragged() {
  if (Game.levelWon) return;
  Drag.onMove();
  return false;
}

function touchMoved() {
  if (Game.levelWon) return;
  Drag.onMove();
  return false;
}
