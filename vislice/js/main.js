"use strict";

const body = document.querySelector("body");
const writtenWordEl = document.getElementById("writtenWord");
const infoButton = document.getElementById("info");
const loadingBar = document.getElementById("loadingBar");

/* --------- load words.json --------- */

let WORDS;

(function loadWords() {
  fetch("WORDS.json")
    .then((response) => response.json())
    .then((file) => (WORDS = file))
    .then(initialize);
})();

/* -------- load prefrences -------- */

let settings;

(function loadSettings() {
  if (localStorage.settings) {
    settings = JSON.parse(localStorage.settings);
  } else {
    settings = { difficulty: "medium", length: 8 };
  }
})();

/* -------- word preparation -------- */

let selectedWord;

function chooseWord() {
  let randIndex, randEntry, randId, randWord, frequency;
  let minFreq, maxFreq, minLength;

  switch (settings.difficulty) {
    case "easy":
      minFreq = 100000;
      maxFreq = Infinity;
      minLength = 5;
      break;
    case "medium":
      minFreq = 10000;
      maxFreq = 100000;
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
    randWord = randEntry.word;
    frequency = randEntry.freq;

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
  let leftDiv = document.querySelector(".container-left");
  let fontSize = 31 - word.length;

  writtenWordEl.style["font-size"] = fontSize + "px";

  // if word is too long:

  let divWidth = leftDiv.offsetWidth;
  let wordWidth = writtenWordEl.offsetWidth;

  while (wordWidth > divWidth) {
    fontSize--;
    writtenWordEl.style["font-size"] = fontSize + "px";

    wordWidth = writtenWordEl.offsetWidth;
  }
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

function initialize() {
  chooseWord();
  updateCheckedLetters();

  trials = 8;
  trialLetters = [];
  loadingBar.style.width = "100%";
  countdownImg.src = "img/trans.png";

  infoButton.classList.add("hidden");
  body.classList.remove("lost");
  body.classList.remove("won");
  settingsDiv.classList.add("hidden");

  letterInput.disabled = false;
  letterInput.select();
}

function updateWord(letter, indexes) {
  writtenWord = writtenWordEl.innerHTML.split(" ");

  for (let l = 0; l < indexes.length; l++) {
    let index = indexes[l];
    writtenWord[index] = letter;
  }

  writtenWordEl.innerHTML = writtenWord.join(" ");
}

function updateCheckedLetters(letter) {
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

function updateImage() {
  countdownImg.src = "img/" + trials + ".png";
}

function updateLoadingBar() {
  let percent = (trials / 8) * 100;
  loadingBar.style.width = percent + "%";
}

function checkLetter(inputLetter) {
  /* ----- get indexes ----- */

  let indexes = [];

  for (let l = 0; l < selectedWord.length; l++) {
    let wordLetter = selectedWord[l];

    if (wordLetter == inputLetter) {
      indexes.push(l);
    }
  }

  /* ----------------------- */

  if (indexes.length == 0) {
    // letter IS NOT in word
    if (!trialLetters.includes(inputLetter)) {
      trials--;

      updateImage();
      updateCheckedLetters(inputLetter);
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
  infoButton.classList.remove("hidden");
  body.classList.add("won");
  letterInput.disabled = true;

  if (trials == 8) {
    let randWin = Math.floor(Math.random() * 4);
    countdownImg.src = `img/win${randWin}.png`;

    let message;
    switch (randWin) {
      case 0:
        message = "hov hov, vse si imel prov!";
        break;
      case 1:
        message = "tra ra ra!";
        break;
      case 2:
        message = "tutu tutuuu!";
        break;
      case 3:
        message = "tik tik tik. jejžek ti čestita.";
        break;
    }
    checkedLetters.innerHTML = message;
  } else {
    countdownImg.src = `img/dove${trials}.png`;
    checkedLetters.innerHTML = "rešil te je ptič golobič.";
  }
}

function gameOver() {
  writtenWordEl.innerHTML = [...selectedWord].join(" ");

  body.classList.add("lost");
  infoButton.classList.remove("hidden");
  letterInput.disabled = true;
}

/* -------- event listeners -------- */

/* -------- form -------- */

const inputForm = document.getElementById("inputForm");
const settingsForm = document.getElementById("settingsForm");

inputForm.addEventListener("submit", (e) => {
  e.preventDefault();

  let char = letterInput.value.toLowerCase();
  letterInput.value = "";

  if (char.toLowerCase() == char.toUpperCase()) return;
  else checkLetter(char); // character is a symbol
});

/* -------- settings -------- */

settingsForm.addEventListener("click", (e) => {
  if (e.target.tagName == "INPUT") {
    settings.difficulty = e.target.value;
    // settings.length ...;

    localStorage.settings = JSON.stringify(settings);

    setTimeout(initialize, 100);

    // initialize();
  }
});

/* -------- buttons -------- */

const resetButton = document.getElementById("reset-btn");
const settingsButton = document.getElementById("settings-btn");
const settingsDiv = document.getElementById("settingsDiv");

resetButton.addEventListener("click", initialize);
settingsButton.addEventListener("click", function () {
  settingsDiv.classList.toggle("hidden");
});
