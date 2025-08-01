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

function mousePressed() {
  Drag.onStart();
  return false;
}

function touchStarted() {
  Drag.onStart();
  return false;
}

function mouseReleased() {
  Drag.onEnd();
  return false;
}

function touchEnded() {
  Drag.onEnd();
  return false;
}

function mouseDragged() {
  Drag.onMove();
  return false;
}

function touchMoved() {
  Drag.onMove();
  return false;
}
