"use strict";

const mainWord = document.getElementById("word");

let WORDS;
let selectedWord;

(function loadWords() {
  fetch("SSKJ_frequencies.json")
    .then((response) => response.json())
    .then((file) => (WORDS = file))
    .then(initialize);
})();

function chooseWord() {
  let randIndex, randEntry, randWord, frequency;

  while (true) {
    const length = WORDS.length;
    randIndex = Math.floor(Math.random() * length);

    randEntry = WORDS[randIndex];

    randWord = randEntry.headwords.headword_clean;
    frequency = randEntry.frequency;

    if (randWord.includes(" ")) continue;
    if (randWord.length > 8 && frequency > 1000) break;
  }

  selectedWord = randWord;
  setMainWord(selectedWord);

  // console.log(selectedWord);
}

function setMainWord(word) {
  let secretWord = word[0] + " _".repeat(word.length - 2) + " " + word[word.length - 1];

  // console.log(secretWord);
  mainWord.innerHTML = secretWord;
}

/* -------- main game logic -------- */

const form = document.getElementById("form");
const input = document.getElementById("input");
const checkedLetters = document.getElementById("checkedLetters");
const countdownImg = document.getElementById("countdownImg");
const resetButton = document.getElementById("reset");

let trials;
let trialLetters;

function initialize() {
  chooseWord();
  updateChecked();

  trials = 8;
  trialLetters = [];
  countdownImg.src = "img/trans.png";

  input.select();
}

function updateChecked(letter) {
  if (!letter) {
    checkedLetters.innerHTML = "";
    return;
  }

  if (!trialLetters.includes(letter)) {
    trialLetters.push(letter);
  }

  let content = trialLetters.join(", ");
  checkedLetters.innerHTML = content;
}

function updateImage(trials) {
  countdownImg.src = "img/" + trials + ".png";
}

function updateWord(letter, indexes) {
  let writtenWord = [...word.innerHTML];

  for (let l = 0; l < indexes.length; l++) {
    let index = indexes[l];
    writtenWord[2 * index] = letter;
  }

  word.innerHTML = writtenWord.join("");
}

function checkLetter(inputLetter) {
  let indexes = [];

  for (let l = 0; l < selectedWord.length; l++) {
    let wordLetter = selectedWord[l];

    if (wordLetter == inputLetter) {
      indexes.push(l);
    }
  }

  console.log(indexes);

  if (indexes.length == 0) {
    if (!trialLetters.includes(inputLetter)) {
      trials--;
      console.log(trials);

      updateImage(trials);
      updateChecked(inputLetter);
    }
  } else {
    updateWord(inputLetter, indexes);
  }

  if (!trials) {
    gameOver();
  }
}

function gameOver() {
  console.log("game over!");
  word.innerHTML = [...selectedWord].join(" ");
  resetButton.classList.remove("hidden");
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  let letter = input.value.toLowerCase();
  input.value = "";

  if (!letter) return;
  checkLetter(letter);
});

resetButton.addEventListener("click", initialize);
