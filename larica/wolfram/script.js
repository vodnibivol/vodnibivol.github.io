const grid_size = 42;
const cell_size = 4;

// TWEAKPANE
const PARAMS = {
  ruleNumber: 73, // 73, 81
  frameRate: 16,
  cellColor: '#0000ff', // blue
  bgColor: '#ffc0cb', // pink
  randomize: function () {
    row = generateRandomRow();
  },
};

let row = [];
let rowNumber = 0;
let pane;

function setup() {
  createCanvas(grid_size * cell_size, grid_size * cell_size);
  frameRate(PARAMS.frameRate);
  noSmooth();

  row = generateRandomRow();

  background(PARAMS.bgColor);

  setupPane();
}

function setupPane() {
  pane = new Tweakpane.Pane({ title: 'Controls' });

  pane.addInput(PARAMS, 'ruleNumber', { step: 1 }).on('change', (ev) => {
    PARAMS.ruleNumber = constrain(Math.round(ev.value), 0, 255);
    row = generateRandomRow();
  });

  pane.addButton({ title: 'Previous Rule' }).on('click', () => {
    prevRule();
  });
  pane.addButton({ title: 'Next Rule' }).on('click', () => {
    nextRule();
  });

  pane.addInput(PARAMS, 'frameRate', { min: 1, max: 60, step: 1 }).on('change', (ev) => {
    frameRate(ev.value);
  });

  pane.addInput(PARAMS, 'cellColor');
  pane.addInput(PARAMS, 'bgColor').on('change', () => {
    background(PARAMS.bgColor);
  });

  pane.addButton({ title: 'Randomize row' }).on('click', () => {
    PARAMS.randomize();
  });
}

function draw() {
  drawRow();
  computeNextRow();
  rowNumber = ++rowNumber % grid_size;
}

function computeNextRow() {
  let new_row = new Array(grid_size);

  for (let i = 0; i < new_row.length; ++i) {
    const new_state = computeNewState(row.at(i - 1), row.at(i), row.at((i + 1) % grid_size));
    new_row[i] = new_state;
  }

  row = new_row;
}

function computeNewState(a, b, c) {
  const rule = PARAMS.ruleNumber.toString(2).padStart(8, '0').split('').map(Number);
  return rule[7 - parseInt([a, b, c].join(''), 2)];
}

function drawRow() {
  for (let i = 0; i < grid_size; i++) {
    const c = row[i] ? PARAMS.cellColor : PARAMS.bgColor;
    fill(c);
    noStroke();
    square(i * cell_size, rowNumber * cell_size, cell_size);
  }
}

function generateRandomRow() {
  const arr = [];
  for (let i = 0; i < grid_size; i++) {
    arr.push(getRandomState());
  }
  return arr;
}

function getRandomState() {
  return Math.random() < 0.5 ? 1 : 0;
}

function keyPressed() {
  if (keyCode === RIGHT_ARROW) {
    nextRule();
  } else if (keyCode === LEFT_ARROW) {
    prevRule();
  }
}

function nextRule() {
  PARAMS.ruleNumber++;
  row = generateRandomRow();
  pane.refresh();
}

function prevRule() {
  PARAMS.ruleNumber--;
  row = generateRandomRow();
  pane.refresh();
}
