"use strict";

const body = document.querySelector("body");
const writtenWordEl = document.getElementById("writtenWord");
const infoButton = document.getElementById("info");
const progressBar = document.getElementById("progressBar");
const loadingBar = document.getElementById("loadingBar");
const loadingBarContainer = document.getElementById("loadingBarContainer");
const settingsForm = document.getElementById("settingsForm");

/* -------- load prefrences -------- */

let currentVersion = "2.3.2";

if (localStorage.version != currentVersion) {
  localStorage.clear();
  localStorage.version = currentVersion;
  console.log("updated app. cleared local storage.");
}

let settings;

(function loadSettings() {
  if (localStorage.settings) {
    settings = JSON.parse(localStorage.settings);
  } else {
    settings = { frequency: "mid", dictionary: "all", wordLength: 8 };
  }
})();

// console.log(settings);

settingsForm.querySelector(`input[name="frequency"][value="${settings.frequency}"]`).checked = true;
settingsForm.querySelector(`input[name="dictionary"][value="${settings.dictionary}"]`).checked = true;
settingsForm.querySelector('input[type="range"]').value = settings.wordLength;

/* --------- load words.json --------- */

let WORDS;

function loadWords() {
  let path;
  switch (settings.dictionary) {
    case "all":
      path = "WORDS/WORDS_all.json";
      break;
    case "news":
      path = "WORDS/WORDS_newspapers.json";
      break;
    case "int":
      path = "WORDS/WORDS_internet.json";
      break;
    case "lit":
      path = "WORDS/WORDS_literature.json";
      break;
  }

  loadingBarContainer.classList.remove("hidden");

  let req = new XMLHttpRequest();
  req.open("GET", path);
  req.send();

  req.onload = function () {
    WORDS = JSON.parse(this.responseText);
    initialize();
  };

  req.onprogress = function (e) {
    if (e.lengthComputable) {
      let progress = (e.loaded / e.total) * 100;
      loadingBar.style.width = progress + "%";

      loadingBar.style.animation = "none";
    }
  };
}

loadWords();

/* -------- word preparation -------- */

let selectedWord;

function chooseWord() {
  let randIndex, randEntry, randId, randWord, frequency;
  let minFreq, maxFreq, minLength, maxLength;

  minLength = settings.wordLength - 1;
  maxLength = settings.wordLength + 1;

  if (settings.wordLength == 12) {
    maxLength = Infinity;
  }

  switch (settings.frequency) {
    case "high":
      minFreq = 100;
      maxFreq = Infinity;
      break;
    case "mid":
      minFreq = 1;
      maxFreq = 100;
      break;
    case "low":
      minFreq = 0;
      maxFreq = 0.1;
      break;
  }

  let i = 0;

  while (true) {
    i++;
    if (i > 1000000) {
      console.error("Too many iterations. Random word chosen.");
      break;
    }

    const length = WORDS.length;

    randIndex = Math.floor(Math.random() * length);
    randEntry = WORDS[randIndex];

    randId = randEntry.id;
    randWord = randEntry.word;
    frequency = randEntry.freq;

    if (randWord.includes(" ")) continue;
    if (randWord.length >= minLength && randWord.length <= maxLength && frequency >= minFreq && frequency <= maxFreq)
      break;
  }

  selectedWord = randWord;

  // console.log(selectedWord);

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
  infoButton.href = `//fran.si/iskanje?View=1&Query=${word}&FilteredDictionaryIds=133`;
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
  progressBar.style.width = "100%";
  countdownImg.src = "img/trans.png";

  infoButton.classList.remove("show");
  body.classList.remove("lost");
  body.classList.remove("won");
  settingsDiv.classList.add("hidden");
  loadingBarContainer.classList.add("hidden");

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

function updateProgressBar() {
  let percent = (trials / 8) * 100;
  progressBar.style.width = percent + "%";
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
      updateProgressBar();
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
  infoButton.classList.add("show");
  body.classList.add("won");
  letterInput.disabled = true;

  if (trials == 8) {
    let randWin = Math.floor(Math.random() * 7);
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
      case 4:
        message = "hru hru! od veselja zakrulim!";
        break;
      case 5:
        message = "hu hu, pameti ti ne manjka.";
        break;
      case 6:
        message = "tik tik tik. rakec ti čestita.";
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
  infoButton.classList.add("show");
  letterInput.disabled = true;
}

/* -------- event listeners -------- */

/* -------- form -------- */

const inputForm = document.getElementById("inputForm");

inputForm.addEventListener("submit", (e) => {
  e.preventDefault();

  let char = letterInput.value.toLowerCase();
  letterInput.value = "";

  if (char.toLowerCase() == char.toUpperCase()) return;
  else checkLetter(char); // character is a symbol
});

/* -------- settings -------- */

settingsForm.addEventListener("submit", (e) => {
  e.preventDefault();

  let freqValue = document.querySelector('input[name="frequency"]:checked').value;
  let dictValue = document.querySelector('input[name="dictionary"]:checked').value;
  let lengthValue = document.querySelector('input[type="range"]').value;

  let prevSettings = Object.assign({}, settings);

  settings.frequency = freqValue;
  settings.dictionary = dictValue;
  settings.wordLength = parseInt(lengthValue);

  localStorage.settings = JSON.stringify(settings);

  if (prevSettings.dictionary != settings.dictionary) {
    loadWords();
  } else if (JSON.stringify(prevSettings) != JSON.stringify(settings)) {
    initialize();
  } else {
    // settings have not changed
    settingsDiv.classList.add("hidden");
  }
});

const countRange = document.getElementById("countRange");
const rangeOutput = document.getElementById("rangeOutput");

rangeOutput.innerHTML = "(" + countRange.value + ")"; // initial

countRange.addEventListener("input", function () {
  rangeOutput.innerHTML = "(" + countRange.value + ")";
});

/* -------- buttons -------- */

const resetButton = document.getElementById("reset-btn");
const settingsButton = document.getElementById("settings-btn");
const settingsDiv = document.getElementById("settingsDiv");

resetButton.addEventListener("click", initialize);
settingsButton.addEventListener("click", function () {
  settingsDiv.classList.remove("hidden");
});
