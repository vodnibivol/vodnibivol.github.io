"use strict";

const body = document.querySelector("body");
const writtenWordEl = document.getElementById("writtenWord");
const infoButton = document.getElementById("info");

let WORDS;
let selectedWord;

(function loadWords() {
  fetch("SSKJ_frequencies.json")
    .then((response) => response.json())
    .then((file) => (WORDS = file))
    .then(initialize);
})();

/* -------- word preparation -------- */

function chooseWord() {
  let randIndex, randId, randEntry, randWord, frequency;

  while (true) {
    const length = WORDS.length;

    randIndex = Math.floor(Math.random() * length);
    randEntry = WORDS[randIndex];

    randId = randEntry.id;
    randWord = randEntry.headwords.headword_clean;
    frequency = randEntry.frequency;

    if (randWord.includes(" ")) continue;
    if (randWord.length > 8 && frequency > 1000) break;
  }

  selectedWord = randWord;

  setMainWord(selectedWord);
  setFontSize(selectedWord);
  setInfo(randId, selectedWord);
}

function setMainWord(word) {
  let secretWord = word[0] + " _".repeat(word.length - 2) + " " + word[word.length - 1];

  writtenWordEl.innerHTML = secretWord;
}

function setFontSize(word) {
  body.style["font-size"] = 31 - word.length + "px";
}

function setInfo(id, word) {
  infoButton.href = `//fran.si/133/sskj2-slovar-slovenskega-knjiznega-jezika-2/${id}/${word}?Query=${word}`;
}

/* -------- main game logic -------- */

const form = document.getElementById("form");
const input = document.getElementById("input");
const checkedLetters = document.getElementById("checkedLetters");
const countdownImg = document.getElementById("countdownImg");
const resetButton = document.getElementById("reset");

let trials; // number of trials left
let trialLetters = []; // letters already tried
let writtenWord;

// console.log(writtenWord)

function initialize() {
  chooseWord();
  updateChecked();

  trials = 8;
  trialLetters = [];
  countdownImg.src = "img/trans.png";

  infoButton.classList.add("hidden");
  body.classList.remove("lost");
  body.classList.remove("won");

  input.select();
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
}

function gameOver() {
  console.log("game over!");
  writtenWordEl.innerHTML = [...selectedWord].join(" ");

  body.classList.add("lost");
  infoButton.classList.remove("hidden");
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  let letter = input.value.toLowerCase();
  input.value = "";

  if (!letter) return;
  checkLetter(letter);
});

resetButton.addEventListener("click", initialize);
