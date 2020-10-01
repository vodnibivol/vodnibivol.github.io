const body = document.querySelector("body");
const form = document.getElementById("form");
const input = document.getElementById("inputField");
const button = document.getElementById("button");

let WORDS;

/* -------- function declarations -------- */

(function setBackground() {
  let color = (Math.random() * 100).toPrecision(2);
  body.style.background = `hsl(${color}, 50%, 65%)`;
})();

(function loadWords() {
  fetch("words_and_explanations.json")
    .then((response) => response.json())
    .then((file) => {
      WORDS = file;
      button.disabled = false;
      input.focus()
    });
})();

/* -------- SUBMIT button -------- */

form.addEventListener("submit", function (e) {
  e.preventDefault();

  let letters = input.value.toLowerCase();

  // checkWords(letters);
  printMatches(letters);
});

function checkWords(letters) {
  letters = [...letters];

  // console.log(letters);

  function countLetters(arr) {
    let counted = {};

    for (var letter of arr) {
      if (Object.keys(counted).includes(letter.toLowerCase())) {
        counted[letter.toLowerCase()]++;
      } else {
        counted[letter.toLowerCase()] = 1;
      }
    }
    // console.log(counted)
    return counted;
  }

  function isSubset(bigger, smaller) {
    let counted1 = countLetters(bigger);
    let counted2 = countLetters(smaller);

    for (var letter of Object.keys(counted2)) {
      if (!bigger.includes(letter)) return false;
      if (counted1[letter] < counted2[letter]) return false;
    }
    return true;
  }

  let matches = [];

  for (let word of Object.keys(WORDS)) {
    a = word;
    // console.log(word)
    let entry = {};
    entry[a] = WORDS[word];

    if (word.length < 3 || word.length > letters.length) continue;
    if (isSubset(letters, word)) {
      if (!matches.includes(entry)) {
        matches.push(entry);
      }
    }
  }

  // console.log(matches);
  return matches;
}

function printMatches(letters) {
  let matches = checkWords(letters);

  matches.sort(function (a, b) {
    let word1 = Object.keys(a)[0];
    let word2 = Object.keys(b)[0];
    return word2.length - word1.length;
  });

  let output = "";
  for (let entry of matches) {
    let word = Object.keys(entry)[0];
    let expl = entry[word]["exp"];
    let index = entry[word]["ind"];

    // console.log(word);
    // console.log(expl);

    output += "<hr>";
    output += "<h3>" + word + "</h3>";
    output += "<p>" + expl;
    output += ` - <a target="_blank" href="//fran.si/133/sskj2-slovar-slovenskega-knjiznega-jezika-2/${index}/${word}">fran.si</a>`;
  }

  if (matches == false) {
    console.log("empty");
    output = "<p>Najdena ni bila nobena beseda.</p>";
  }

  output += `<hr><span class="copyright">&copy; 2020 | vodnibivol</span>`;

  const answersDiv = document.getElementById("answers");

  answersDiv.innerHTML = output;
}
