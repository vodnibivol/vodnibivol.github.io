"use strict";

const body = document.querySelector("body");
const writtenWordEl = document.getElementById("writtenWord");
const infoButton = document.getElementById("info");
const loadingBar = document.getElementById("loadingBar");

let WORDS;
let selectedWord;

let difficulty = "medium";

(function loadWords() {
  fetch("SSKJ_frequencies.json")
    .then((response) => response.json())
    .then((file) => (WORDS = file))
    .then(initialize);
})();

/* -------- word preparation -------- */

function chooseWord() {
  let randIndex, randId, randEntry, randWord, frequency;

  let minFreq, maxFreq, minLength;

  switch (difficulty) {
    case "easy":
      minFreq = 100000;
      maxFreq = 10000000;
      minLength = 5;
      break;
    case "medium":
      minFreq = 1000;
      maxFreq = 20000;
      minLength = 7;
      break;
    case "hard":
      minFreq = 0;
      maxFreq = 100;
      minLength = 8;
      break;
  }

  while (true) {
    const length = WORDS.length;

    randIndex = Math.floor(Math.random() * length);
    randEntry = WORDS[randIndex];

    randId = randEntry.id;
    randWord = randEntry.headwords.headword_clean;
    frequency = randEntry.frequency;

    if (randWord.includes(" ")) continue;
    if (randWord.length > minLength && frequency > minFreq && frequency < maxFreq) break;
  }

  selectedWord = randWord;

  setMainWord(selectedWord);
  setFontSize(selectedWord);
  setInfo(randId, selectedWord);
}

function setMainWord(word) {
  let secretWord = word[0] + "_".repeat(word.length - 2) + word[word.length - 1];

  secretWord = [...secretWord].join(" ");

  writtenWordEl.innerHTML = secretWord;
}

function setFontSize(word) {
  writtenWordEl.style["font-size"] = 31 - word.length + "px";
}

function setInfo(id, word) {
  infoButton.href = `//fran.si/133/sskj2-slovar-slovenskega-knjiznega-jezika-2/${id}/${word}?Query=${word}`;
}

/* -------- main game logic -------- */

const letterInput = document.getElementById("letterInput");
const checkedLetters = document.getElementById("checkedLetters");
const countdownImg = document.getElementById("countdownImg");

let trials; // number of trials left
let trialLetters = []; // letters already tried
let writtenWord;

// console.log(writtenWord)

function initialize() {
  chooseWord();
  updateChecked();

  trials = 8;
  trialLetters = [];
  loadingBar.style.width = "100%";
  countdownImg.src = "img/trans.png";

  infoButton.classList.add("hidden");
  body.classList.remove("lost");
  body.classList.remove("won");
  settings.classList.add("hidden");

  letterInput.disabled = false;
  letterInput.select();
}

function updateChecked(letter) {
  if (!letter) {
    checkedLetters.innerHTML = "&nbsp;";
    return;
  }

  if (!trialLetters.includes(letter)) {
    trialLetters.push(letter);
  }

  let content = trialLetters.join(", ");
  checkedLetters.innerHTML = content;
}

function updateLoadingBar() {
  let percent = (trials / 8) * 100;
  loadingBar.style.width = percent + "%";
}

function updateImage() {
  countdownImg.src = "img/" + trials + ".png";
}

function updateWord(letter, indexes) {
  writtenWord = writtenWordEl.innerHTML.split(" ");

  for (let l = 0; l < indexes.length; l++) {
    let index = indexes[l];
    writtenWord[index] = letter;
  }

  writtenWordEl.innerHTML = writtenWord.join(" ");
}

function checkLetter(inputLetter) {
  // ----- get indexes -----

  let indexes = [];

  for (let l = 0; l < selectedWord.length; l++) {
    let wordLetter = selectedWord[l];

    if (wordLetter == inputLetter) {
      indexes.push(l);
    }
  }

  // ----- ----- -----

  if (indexes.length == 0) {
    // letter IS NOT in word
    if (!trialLetters.includes(inputLetter)) {
      trials--;
      console.log(trials);

      updateImage();
      updateChecked(inputLetter);
      updateLoadingBar();
    }
  } else {
    // letter IS in word
    updateWord(inputLetter, indexes);
  }

  checkForWin();
}

function checkForWin() {
  writtenWord = writtenWordEl.innerHTML.split(" ");

  if (!writtenWord.includes("_")) {
    gameWon();
  }

  if (!trials) {
    gameOver();
  }
}

function gameWon() {
  console.log("game won!");
  infoButton.classList.remove("hidden");
  body.classList.add("won");
  letterInput.disabled = true;

  switch (trials) {
    case 8:
      let randWin = Math.floor(Math.random() * 2);
      countdownImg.src = `img/win${randWin}.png`;
      checkedLetters.innerHTML = "jes jes jes!";
      break;
    default:
      countdownImg.src = `img/dove${trials}.png`;
      checkedLetters.innerHTML = "rešil te je ptič golobič.";
  }
}

function gameOver() {
  console.log("game over!");
  writtenWordEl.innerHTML = [...selectedWord].join(" ");

  body.classList.add("lost");
  infoButton.classList.remove("hidden");
  letterInput.disabled = true;
}

/* -------- event listeners -------- */

const inputForm = document.getElementById("inputForm");
const settingsForm = document.getElementById("settingsForm");

inputForm.addEventListener("submit", (e) => {
  e.preventDefault();

  let letter = letterInput.value.toLowerCase();
  letterInput.value = "";

  if (!letter) return;
  checkLetter(letter);
});

settingsForm.addEventListener("click", (e) => {
  if (e.target.tagName == "INPUT") {
    difficulty = e.target.value;

    setTimeout(initialize, 100);

    // initialize();
  }
});

/* -------- buttons -------- */

const resetButton = document.getElementById("reset-btn");
const settingsButton = document.getElementById("settings-btn");
const settings = document.getElementById("settings");

resetButton.addEventListener("click", initialize);
settingsButton.addEventListener("click", function () {
  settings.classList.toggle("hidden");
});
