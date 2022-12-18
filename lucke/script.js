const DOTS_NO = 12; // px
const MARGIN = 40; // px

let d;

function setup() {
  createCanvas(300, 300);
  d = (width - 2*MARGIN) / (DOTS_NO-1);
  
  frameRate(60);
}

let ITER = Math.pow(10, 10);


function draw() {
  blendMode(BLEND); // "NORMAL"
  background(19, 20, 41);
  
  for (let j = 0; j < DOTS_NO; j++) {
    for (let i = 0; i < DOTS_NO; i++) {
      let x = MARGIN + i * d;
      let y = MARGIN + j * d;
      
      let relD = dist(x, y, width/2, height/2);
      //relD = dist(x, y, 0, 0); // mouseX, mouseY
      
      if ((relD + ITER) % 100 < 30) {
        drawPoint(x,y)
      }
    }
  }
  
  ITER--;
}

function drawPoint(x, y) {
    fill("rgba(180, 250, 255, 0.3)"); // 0.14
    noStroke();
    strokeWeight(3);
    
    blendMode(SCREEN); // ADD
    
    for (let rad = d-1; rad > 0; rad -= 2) {
      circle(x, y, rad);
    }
}
