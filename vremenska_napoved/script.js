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
  url = "http://www.vreme.si/api/1.0/nonlocation/?lang=sl";
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
  const p = ".";
  const c = "-";

  morse = {
    a: p + c,
    b: c + p + p + p,
    c: c + p + c + p,
    č: c + p + c + p,
    d: c + p + p,
    e: p,
    f: p + p + c + p,
    g: c + c + p,
    h: p + p + p + p,
    i: p + p,
    j: p + c + c + c,
    k: c + p + c,
    l: p + c + p + p,
    m: c + c,
    n: c + p,
    o: c + c + c,
    p: p + c + c + p,
    r: p + c + p,
    s: p + p + p,
    š: p + p + p,
    t: c,
    u: p + p + c,
    v: p + p + p + c,
    z: c + c + p + p,
    ž: c + c + p + p,
    " ": "/",
    0: c + c + c + c + c,
    1: p + c + c + c + c,
    2: p + p + c + c + c,
    3: p + p + p + c + c,
    4: p + p + p + p + c,
    5: p + p + p + p + p,
    6: c + p + p + p + p,
    7: c + c + p + p + p,
    8: c + c + c + p + p,
    9: c + c + c + c + p,
    ".": p + c + p + c + p + c,
    ",": c + c + p + p + c + c,
    start: c + p + c + p + c,
    end: p + p + p + c + p + c,
    err: p + p + p + p + p + p + p + p,
  };

  list = [];

  for (var i = 0; i < string.length; i++) {
    char = string.charAt(i);
    list.push(morse[char.toLowerCase()]);
  }

  morseString = list.join(" ");
  return morseString;
}

jsonRequest();
