// -- WORDS

class Words {
  constructor(stringArray) {
    this.objects = [];
    this.strings = stringArray;
  }

  get revealedNo() {
    return this.objects.filter((o) => o.revealed).length;
  }

  init() {
    this.objects = [];

    this.strings
      .sort((a, b) => b.length - a.length)
      .forEach((s) => {
        const w = new Word(s);
        w.place();
        if (!w.error) this.objects.push(w);
      });

    return this;
  }

  testSelection(startId, endId) {
    const result = this.objects.find((w) => w.start.id === startId && w.end.id === endId);
    return result;
  }

  createObjects() {
    // create objects from strings
    this.objects = this.strings.map((s) => new Word(s));
  }
}

// -- WORD

class Word {
  constructor(string) {
    this.string = string;
    this.len = string.length;

    this.dir = null; // { x: 0, y: 0 }
    this.letters = []; // array of objects {}
    this.revealed = false;

    this.color = this.randomColor();
  }

  randomColor() {
    const h = randomRange(0, 360);
    // const s = randomRange(50, 80);
    // const l = randomRange(50, 90);
    const s = 70; // 70
    const l = 85; // 70 => 90 (85)

    return `hsl(${h}deg ${s}% ${l}%)`;
  }

  get start() {
    return this.letters.at(0);
  }

  get end() {
    return this.letters.at(-1);
  }

  reveal() {
    // get id of cell and highlight it
    this.letters.forEach((l) => ($(`[data-id="${l.id}"]`).style.background = this.color));
    this.revealed = true;
  }

  findPosition() {
    const AVAILABLE_PLACEMENTS = [];

    const that = this;

    function Placement(start_pos_x, start_pos_y, dir) {
      return new Array(that.len).fill().map((_, i) => ({
        content: that.string.at(i),
        x: start_pos_x + dir.x * i,
        y: start_pos_y + dir.y * i,
        // index: i,
      }));
    }

    // 1. find all positions;
    for (let dir of Direction.selectedDirs) {
      // FOR EVERY DIRECTION:

      // TRAVERSE AVAILABLE GRID POSITIONS
      for (let grid_y = 0; grid_y < Main.Grid.size; grid_y++) {
        for (let grid_x = 0; grid_x < Main.Grid.size; grid_x++) {
          // FOR EVERY POSSIBLE STARTING POSITION:

          // 1. CREATE A PLACEMENT
          const placement = Placement(grid_x, grid_y, dir);
          // console.log(placement);

          // 2. EVALUATE A PLACEMENT (overlapping, distance ...)
          const is_ok = placement.every((letter_obj) => {
            try {
              const grid_pos_content = Main.Grid.matrix[letter_obj.y][letter_obj.x].content;
              return !grid_pos_content || grid_pos_content === letter_obj.content;
            } catch (error) {
              return false;
            }
          });

          // 3. IF OK ADD TO AVAILABLE_PLACEMENTS
          if (is_ok)
            AVAILABLE_PLACEMENTS.push({
              dir,
              letters: placement,
              score: Direction.frequencyUsed(dir),
            });
        }
      }
    }

    return AVAILABLE_PLACEMENTS;
  }

  place() {
    // 1. find all available placements
    const available_placements = this.findPosition(); // [{dir: {x: 1, y: 0}, [{}, {}, ...]}]
    if (!available_placements.length) {
      this.error = true;
      console.warn('not placed : ' + this.string);
      return;
    }

    // 3. choose best placement
    // const randomPlacement = randomChoose(available_placements);
    const sortedPlacements = available_placements.sort((a, b) => a.score - b.score);
    const filteredPlacements = sortedPlacements.filter(({ score }) => score === sortedPlacements[0].score);
    const randomPlacement = randomChoose(filteredPlacements);

    // console.log(randomPlacement);

    Direction.saveDir(randomPlacement.dir); // mark as used
    this.dir = randomPlacement.dir;
    this.letters = randomPlacement.letters;

    // 4. place onto grid matrix
    this.letters.forEach((l) => Main.Grid.matrix[l.y][l.x].setContent(l.content, this.color));
    this.letters.forEach((l) => {
      const cell = Main.Grid.matrix[l.y][l.x];
      l.id = cell.id;
    });

    // 5. render grid
    Main.Grid.render();
  }
}
