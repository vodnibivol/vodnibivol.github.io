"use strict";

/* -------- variable declarations -------- */

const infoButton = document.getElementById("infoButton");
const infoBubble = document.getElementById("infoBubble");
const settingsButton = document.getElementById("settingsButton");
const settingsBubble = document.getElementById("settingsBubble");
const sizeToggle = document.getElementById("sizeToggle");
const chartDiv1 = document.getElementById("chartDiv1");
const chartDiv2 = document.getElementById("chartDiv2");
const card = document.getElementById("card");
const spinner = document.getElementById("spinner");

const url = "https://www.gov.si/assets/vlada/Koronavirus-podatki/COVID-19-vsi-podatki.xlsx";
const proxy = "https://cors-anywhere.herokuapp.com/";

const filename = "COVID-19-vsi-podatki.xlsx";

/* ---------- load preferences ---------- */

let settings;

// first time visit: set default
if (chartDiv1.offsetWidth < 600) {
  settings = { data: "small" };
} else {
  settings = { data: "large" };
}

if (localStorage.covidSettings) {
  settings = JSON.parse(localStorage.covidSettings);
}

if (settings.data == "small") {
  sizeToggle.checked = true;
}

/* ----------- event listeners ----------- */

infoButton.addEventListener("click", () => {
  infoBubble.classList.toggle("open");

  if (infoBubble.classList.contains("open")) {
    countdown = setTimeout(() => {
      infoBubble.classList.remove("open");
    }, 5000);
  } else {
    clearTimeout(countdown);
  }
});

settingsButton.addEventListener("click", () => {
  settingsBubble.classList.toggle("open");
  settingsButton.classList.toggle("reverse");
});

sizeToggle.addEventListener("change", () => {
  if (sizeToggle.checked) {
    settings.data = "small";
  } else {
    settings.data = "large";
  }

  localStorage.covidSettings = JSON.stringify(settings);

  config1.options.animation.duration = 0;
  config2.options.animation.duration = 0;

  config();

  chart1.update();
  chart2.update();
});

/* -------- function declarations -------- */

function getFile() {
  /* set up async GET request */
  var req = new XMLHttpRequest();
  req.open("GET", proxy + url, true); // proxy + url
  req.responseType = "arraybuffer";

  req.onload = function (e) {
    var data = new Uint8Array(req.response);
    var workbook = XLSX.read(data, { type: "array" });

    /* DO SOMETHING WITH workbook HERE */
    let worksheet = workbook.Sheets[workbook.SheetNames[0]];

    parseData(worksheet);
    spinner.classList.add("hidden");
    chartDiv1.classList.remove("hidden");
    chartDiv2.classList.remove("hidden");
    card.classList.remove("hidden");
  };

  req.send();
}

let dates, dates_s, daily_tested, daily_positive, daily_positive_s, daily_percent, daily_percent_s;

function parseData(worksheet) {
  let getColumn = function (sheet, col_num) {
    let range = XLSX.utils.decode_range(sheet["!ref"]);

    let last_row = range.e.r;
    let last_column = range.e.c;

    let column = [];

    for (var rowNum = 1; rowNum <= last_row; rowNum++) {
      let nextCell = sheet[XLSX.utils.encode_cell({ r: rowNum, c: col_num })];
      if (typeof nextCell === "undefined") {
        // column.push(void 0);
        return column;
      } else if (nextCell.w.toLowerCase().includes("opombe")) {
        return column;
      } else column.push(nextCell.w);
    }
    return column;
  };

  dates = getColumn(worksheet, 0);
  daily_tested = getColumn(worksheet, 2);
  daily_positive = getColumn(worksheet, 4);

  dates = dates.map((date) => {
    // wrong date correction
    if (date.split(" ").length != 3) {
      console.log("wrong syntax : " + date);

      date = date.split(".").join(". ");
    }

    date = date.replaceAll("/", ".");
    date = date.replace(" 2020", "");

    return date;
  });

  daily_percent = (function () {
    let arr = [];

    for (var i = 0; i < daily_tested.length; i++) {
      let percent = (daily_positive[i] / daily_tested[i]) * 100;
      percent = percent.toFixed(2);

      arr.push(percent);
    }

    return arr;
  })();

  dates_s = dates.slice(-50);
  daily_percent_s = daily_percent.slice(-50);
  daily_positive_s = daily_positive.slice(-50);

  // console.log(dates)
  // console.log(daily_tested)
  // console.log(daily_positive)

  config(dates, daily_positive, daily_tested);
  draw();
  setCard(dates, daily_positive);
}

function setCard(dates, daily_positive) {
  const arrow = document.querySelector(".arrow");
  const cardLower = document.querySelector(".card-lower");
  const lastDate = document.querySelector(".last-date");
  const lastPositive = document.querySelector(".last-positive");

  function writeDate() {
    let date = dates[dates.length - 1].replace(".", "").split(" ");

    let lastDay = date[0];

    let months = [
      "januar",
      "februar",
      "marec",
      "april",
      "maj",
      "junij",
      "julij",
      "avgust",
      "september",
      "oktober",
      "november",
      "december",
    ];

    let lastMonth = months[date[1] - 1];

    let lastDateText = `${lastDay}. ${lastMonth}`;

    lastDate.innerHTML = lastDateText;
  }

  function writeNumber() {
    lastPositive.innerHTML = daily_positive[daily_positive.length - 1];
  }

  function chooseArrow() {
    let today = parseInt(daily_positive[daily_positive.length - 1]);
    let yesterday = parseInt(daily_positive[daily_positive.length - 2]);

    if (today < yesterday) {
      arrow.src = "img/arrow_down.svg";
      cardLower.style.backgroundColor = "#adf1ad";
    } else {
      arrow.src = "img/arrow_up.svg";
      cardLower.style.backgroundColor = "#f1adad";
    }
  }

  writeNumber();
  chooseArrow();
  writeDate();
}

getFile();
