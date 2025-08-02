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
  if (WIN) return;
  Drag.onStart();
  return false;
}

function touchStarted() {
  if (WIN) return;
  Drag.onStart();
  return false;
}

function mouseReleased() {
  if (WIN) {
    const mouseIsOnArrow = dist(mouseX, mouseY, width / 2, height * 0.75) < 50;
    if (mouseIsOnArrow) return init(true); // true: LEVEL++
  }

  Drag.onEnd();
  return false;
}

function touchEnded() {
  if (WIN) {
    const mouseIsOnArrow = dist(mouseX, mouseY, width / 2, height * 0.75) < 50;
    if (mouseIsOnArrow) return init(true); // true: LEVEL++
  }

  Drag.onEnd();
  return false;
}

function mouseDragged() {
  if (WIN) return;
  Drag.onMove();
  return false;
}

function touchMoved() {
  if (WIN) return;
  Drag.onMove();
  return false;
}
