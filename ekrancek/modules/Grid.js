class Grid {
  constructor(string = 'undefined') {
    this.content = string;

    this.width = string.length * (LETTER_WIDTH + 1);
    this.height = LETTER_HEIGHT;

    this.create();
  }

  create() {
    this.grid = new Array(this.width * this.height).fill(0);

    // --- FILL GRID (NOT DISPLAY)

    // for every provided letter
    for (let l = 0; l < this.content.length; l++) {
      let letter = this.content[l]; // letter as string
      let xoff = l * (LETTER_WIDTH + 1); // column (x) index

      // for every letter element (write letter)
      for (let j = 0; j < LETTER_HEIGHT; j++) {
        for (let i = 0; i < LETTER_WIDTH; i++) {
          let letterIndex = j * LETTER_WIDTH + i;
          let gridIndex = j * this.width + i + xoff;

          this.grid[gridIndex] = Letters.get(letter)[letterIndex];
        }
      }
    }
  }
}

class Display {
  constructor() {
    this.width = 100;
    this.height = LETTER_HEIGHT;

    this.offset = 0;

    // actual rendered stuff
    this.dist = 3.5; // 3.5 px
    this.margin = this.dist * 3; // px

    this.grid = new Array(this.width * this.height).fill(0);
  }

  get canvasSize() {
    return {
      x: (this.width - 1) * this.dist + this.margin * 2,
      y: (this.height - 1) * this.dist + this.margin * 2,
    };
  }

  render() {
    // render on screen
    for (let j = 0; j < this.height; j++) {
      for (let i = 0; i < this.width; i++) {
        let cellVal = grid.grid[j * grid.width + ((i + this.offset) % grid.width)];

        let posX = i * this.dist + this.margin;
        let posY = j * this.dist + this.margin;

        strokeWeight(2.5); // 2.7 px
        stroke(lerpColor(color(35, 35, 35), color(255, 50, 50), cellVal * 0.9));
        point(posX, posY);
      }
    }
  }
}

// NOTE: larici je vsec: dist-4, weight-2
