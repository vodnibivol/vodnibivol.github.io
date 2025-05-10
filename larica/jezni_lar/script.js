const grid_size = 42;
const cell_size = 4;

let ruleNumber = 73; // 73, 81

let row = [];
let rowNumber = 0;

function setup() {
  createCanvas(grid_size * cell_size, grid_size * cell_size);
  frameRate(16);
  noSmooth();

  row = generateRandomRow();

  // srednji kvadratek (mora pa bit lihi grid_size!)
  // row = new Array(grid_size).fill(0);
  // row[Math.floor(row.length/2)] = 1

  background('pink');
}

function draw() {
  // background('pink');

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
  const rule = ruleNumber.toString(2).padStart(8, '0').split('').map(Number);
  return rule[7 - parseInt([a, b, c].join(''), 2)];
}

function drawRow() {
  for (let i = 0; i < grid_size; i++) {
    const c = row[i] ? 'blue' : 'pink';
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
  ruleNumber++;
  row = generateRandomRow();
  showRuleNumber();
}

function prevRule() {
  ruleNumber--;
  row = generateRandomRow();
  showRuleNumber();
}

let tmt;

function showRuleNumber() {
  if (tmt) clearTimeout(tmt);

  const ruleNumberText = document.querySelector('#rule_no');
  ruleNumberText.innerText = ruleNumber;
  ruleNumberText.classList.remove('hidden');

  tmt = setTimeout(() => {
    document.querySelector('#rule_no').classList.add('hidden');
  }, 2000);
}

showRuleNumber();

document.addEventListener('click', (e) => {
  const xRelPos = e.x / document.body.offsetWidth;

  if (xRelPos < 0.5) {
    prevRule();
  } else {
    nextRule();
  }
});
