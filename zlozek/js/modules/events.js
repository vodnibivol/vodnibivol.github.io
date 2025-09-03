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

function mouseReleased() {
  if (Game.levelWon) {
    // init next level
    const mouseIsOnArrow = dist(mouseX, mouseY, width / 2, lerp(Grid.bbox.bottom, height, 0.49)) < 50;
    if (mouseIsOnArrow) Game.init();
    return;
  }

  // rotate shape on click
  if (IS_DEV) {
    const hoveringShape = Shapes.arr.find((s) => s.isHovering);
    if (hoveringShape && !Drag.movementExists) {
      hoveringShape.rotateRight();
    }
  }

  Drag.onEnd();
  return false;
}

function mouseDragged() {
  if (Game.levelWon) return;
  Drag.onMove();
  return false;
}

// touch versions
function touchStarted() {
  mousePressed();
}

function touchEnded() {
  mouseReleased();
}

function touchMoved() {
  mouseDragged();
}
