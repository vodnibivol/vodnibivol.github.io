/* --- variables --- */

let date;
let text;
let playing = false;

let audioSequence = [];

/* --- set cookies --- */

if (document.cookie == "") {
  document.cookie = "visited";
  greeting();
}

/* --- event listeners --- */

document.getElementById("content").addEventListener("click", playSound);

/* --- functions --- */

function greeting() {
  //
}

function parseResponse(data) {
  const dateText = document.getElementById("dateText");
  const paraText = document.getElementById("paraText");

  date = data.fcast_si_text.articleinfo.pubdate;
  text = data.fcast_si_text.section[8].para;

  dateText.innerHTML = toMorse(date);
  paraText.innerHTML = toMorse(text);
}

function jsonRequest() {
  ajax = new XMLHttpRequest();
  url = "//vreme.arso.gov.si/api/1.0/nonlocation/?lang=sl";
  ajax.open("GET", url); // true
  ajax.send();

  ajax.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      response = JSON.parse(this.responseText);
      console.log(response);

      parseResponse(response);
    }
  };
}

function toMorse(string) {
  morse = {
    a: ".-",
    b: "-...",
    c: "-.-.",
    č: "-.-.",
    d: "-..",
    e: ".",
    f: "..-.",
    g: "--.",
    h: "....",
    i: "..",
    j: ".---",
    k: "-.-",
    l: ".-..",
    m: "--",
    n: "-.",
    o: "---",
    p: ".--.",
    r: ".-.",
    s: "...",
    š: "...",
    t: "-",
    u: "..-",
    v: "...-",
    z: "--..",
    ž: "--..",
    0: "-----",
    1: ".----",
    2: "..---",
    3: "...--",
    4: "....-",
    5: ".....",
    6: "-....",
    7: "--...",
    8: "---..",
    9: "----.",
    ".": ".-.-.-",
    ",": "--..--",
    " ": "/",
  };

  morseList = [];

  for (var i = 0; i < string.length; i++) {
    char = string.charAt(i);
    morseList.push(morse[char.toLowerCase()]);
  }

  for (var char = 0; char < morseList.length; char++) {
    for (var sym = 0; sym < morseList[char].length; sym++) {
      audioSequence.push(morseList[char][sym]);
    }
    audioSequence.push(" ");
  }

  morseString = morseList.join(" ");
  return morseString;
}

function toPlain() {
  dateText.innerHTML = date;
  paraText.innerHTML = text;
}

jsonRequest();

/* ---- audio ---- */

function playSound() {
  if (!playing) {
    // initialize
    playing = true;

    var AudioContext = window.AudioContext || window.webkitAudioContext;
    
    var ctx = new AudioContext(),
      i = 0,
      duration;
  } else if (playing) {
    playing = false;
  }

  function beep() {
    function sound(duration) {
      var osc = ctx.createOscillator(),
        g = ctx.createGain();

      osc.connect(g);
      g.connect(ctx.destination);

      osc.frequency.setValueAtTime(600, ctx.currentTime);
      g.gain.setValueAtTime(0, ctx.currentTime);

      osc.start();

      g.gain.setTargetAtTime(0.2, ctx.currentTime, 0.01); // in sec
      setTimeout(function () {
        g.gain.setTargetAtTime(0, ctx.currentTime, 0.01);
        osc.stop(ctx.currentTime + 0.1);
      }, duration * 0.9);
    }
    if (audioSequence[i] == ".") {
      duration = 100; // in ms
      sound(duration);
    } else if (audioSequence[i] == "-") {
      duration = 200; // in ms
      sound(duration);
    } else if (audioSequence[i] == " ") {
      duration = 200;
    } else if (audioSequence[i] == "/") {
      duration = 300;
    } else {
      console.log("ended");
    }

    i++;

    if (playing && i != audioSequence.length) {
      setTimeout(beep, duration + 20);
    }
  }
  setTimeout(beep, 300);
}
