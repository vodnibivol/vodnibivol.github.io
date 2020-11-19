'use strict';

/* -------- variable declarations -------- */

const infoButton = document.getElementById('infoButton');
const infoBubble = document.getElementById('infoBubble');
const settingsButton = document.getElementById('settingsButton');
const settingsBubble = document.getElementById('settingsBubble');
const sizeToggle = document.getElementById('sizeToggle');
const chartDiv1 = document.getElementById('chartDiv1');
const chartDiv2 = document.getElementById('chartDiv2');
const card = document.getElementById('card');
const spinner = document.getElementById('spinner');

const url = 'https://api.sledilnik.org/api/stats';

const filename = 'stats.json';

/* ---------- load preferences ---------- */

let settings;

// first time visit: set default
if (chartDiv1.offsetWidth < 600) {
  settings = { data: 'small' };
} else {
  settings = { data: 'large' };
}

if (localStorage.covidSettings) {
  settings = JSON.parse(localStorage.covidSettings);
}

if (settings.data == 'small') {
  sizeToggle.checked = true;
}

/* ----------- event listeners ----------- */

document.addEventListener('DOMContentLoaded', function () {
  document.querySelector('body').classList.remove('preload');
});

let countdown;

infoButton.addEventListener('click', () => {
  infoBubble.classList.toggle('open');

  if (infoBubble.classList.contains('open')) {
    countdown = setTimeout(() => {
      infoBubble.classList.remove('open');
    }, 5000);
  } else {
    clearTimeout(countdown);
  }
});

settingsButton.addEventListener('click', () => {
  settingsBubble.classList.toggle('open');
  settingsButton.classList.toggle('reverse');
});

sizeToggle.addEventListener('change', () => {
  if (sizeToggle.checked) {
    settings.data = 'small';
  } else {
    settings.data = 'large';
  }

  localStorage.covidSettings = JSON.stringify(settings);

  config1.options.animation.duration = 0;
  config2.options.animation.duration = 0;

  config();

  chart1.update();
  chart2.update();
});

/* -------- function declarations -------- */

async function getFile() {
  try {
    let response = await fetch(url);
    let parsedJson = await response.json();

    spinner.classList.add('hidden');
    chartDiv1.classList.remove('hidden');
    chartDiv2.classList.remove('hidden');
    card.classList.remove('hidden');

    parseData(parsedJson);
  } catch (error) {
    console.error(error);
  }
}

let dates,
  dates_s,
  daily_tested,
  daily_positive,
  daily_positive_s,
  daily_active,
  daily_active_s,
  daily_hospital,
  daily_hospital_s,
  daily_percent,
  daily_percent_s;

function parseData(obj) {
  // console.log(obj);

  // cut off empty results

  while (!obj[1].cases.confirmedToday) {
    obj.shift();
  }

  while (!obj[obj.length - 1].cases.confirmedToday) {
    obj.pop();
  }

  // ---------------------

  dates = obj.map((item) => `${item.day}. ${item.month}`);
  daily_tested = obj.map((item) => item.tests.performed.today || item.tests.performed.toDate);
  daily_positive = obj.map((item) => item.cases.confirmedToday || 0);
  daily_active = obj.map((item) => item.cases.active || 0);
  daily_hospital = obj.map((item) => item.statePerTreatment.inHospital || 0);

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
  daily_active_s = daily_active.slice(-50);
  daily_hospital_s = daily_hospital.slice(-50);

  // console.log(dates)
  // console.log(daily_tested)
  // console.log(daily_positive)

  config();
  draw();
  setCard();
}

function setCard() {
  const arrow = document.querySelector('.arrow');
  const cardLower = document.querySelector('.card-lower');
  const lastDate = document.querySelector('.last-date');
  const lastPositive = document.querySelector('.last-positive');

  function writeDate() {
    let date = dates[dates.length - 1].replace('.', '').split(' ');

    let lastDay = date[0];

    let months = [
      'januar',
      'februar',
      'marec',
      'april',
      'maj',
      'junij',
      'julij',
      'avgust',
      'september',
      'oktober',
      'november',
      'december',
    ];

    let lastMonth = months[date[1] - 1];

    let lastDateText = `${lastDay}. ${lastMonth}`;

    lastDate.innerHTML = lastDateText;
  }

  function writeNumber() {
    let last_active = daily_active_s.slice(-3);
    let tension = (last_active[2] + last_active[1]) / 2 - (last_active[1] + last_active[0]) / 2;

    tension = tension / 1500;

    let tensionString = tension.toFixed(2);

    if (tension > 0) {
      tensionString = '+' + tensionString;
    }

    lastPositive.innerHTML = tensionString;

    switch (tensionString.length) {
      case 4:
        lastPositive.style['font-size'] = '80px';
        break;
      case 5:
        lastPositive.style['font-size'] = '75px';
        break;
      case 6:
        lastPositive.style['font-size'] = '65px';
        break;
    }
  }

  function chooseArrow() {
    let last_active = daily_active_s.slice(-3);
    let tension = (last_active[2] + last_active[1]) / 2 / ((last_active[1] + last_active[0]) / 2);

    // console.log(tension)

    if (tension < 0) {
      arrow.src = 'img/arrow_down.svg';
      cardLower.style.backgroundColor = '#adf1ad';
    } else {
      arrow.src = 'img/arrow_up.svg';
      cardLower.style.backgroundColor = '#f1adad';
    }
  }

  writeNumber();
  chooseArrow();
  writeDate();
}

getFile();
