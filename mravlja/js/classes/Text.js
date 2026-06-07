import { state } from './state.js';

export default class Text {
  constructor(p5) {
    this.p5 = p5;
    this.defaultDuration = 3000;

    this.font = this.p5.loadFont('tiny5.ttf');
    this.tempText = '';
    this.timeout = null;
  }

  draw() {
    // depending on state => draw text
    if (this.tempText) {
      this.showText(this.tempText);
    } else if (!state.mouseHasBeenClicked) {
      this.showText('nahrani mravljo !\n\nje lačna', 7);
    }
  }

  showText(string, offsetY = 0) {
    const canvasCenter = this.p5.createVector(this.p5.width / 2, this.p5.height / 2 + offsetY);
    const textSize = this.p5.map(this.p5.width, 300, 400, 28, 32, true);

    this.p5.textFont(this.font);
    this.p5.textSize(textSize);
    this.p5.textAlign(this.p5.CENTER, this.p5.CENTER);

    this.p5.noStroke();
    this.p5.noFill();
    this.p5.strokeWeight(1);
    const c = this.p5.color(state.colors[7]); // 7/9
    c.setAlpha(40);
    this.p5.fill(c);
    c.setAlpha(60);
    this.p5.stroke(c);
    this.p5.text(string, canvasCenter.x, canvasCenter.y);
  }

  showTempText(string, ms) {
    this.tempText = string;
    if (this.timeout) clearTimeout(this.timeout);
    this.timeout = setTimeout(() => (this.tempText = ''), ms);
  }
}
