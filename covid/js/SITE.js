const chartDiv1 = document.getElementById("chartDiv1");
const chartDiv2 = document.getElementById("chartDiv2");
const spinner = document.getElementById("spinner");

const url = "https://www.gov.si/assets/vlada/Koronavirus-podatki/COVID-19-vsi-podatki.xlsx";
const proxy = "https://cors-anywhere.herokuapp.com/";

const filename = "COVID-19-vsi-podatki.xlsx";

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
  };

  req.send();
}

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
        return column
      } else column.push(nextCell.w);
    }
    return column;
  };

  let dates = getColumn(worksheet, 0);
  let daily_tested = getColumn(worksheet, 2); // column 2
  let daily_positive = getColumn(worksheet, 4); // column 4

  dates = dates.map((date) => date.replaceAll("/", "."));
  dates = dates.map((date) => date.replace(" 2020", ""));

  console.log(dates)
  console.log(daily_tested)
  console.log(daily_positive)

  draw(dates, daily_tested, daily_positive);
  setCard(dates, daily_positive);
}

function setCard(dates, daily_positive) {
  const arrow = document.querySelector(".arrow");
  const cardLower = document.querySelector(".card-lower");
  const lastDate = document.querySelector(".last-date");
  const lastPositive = document.querySelector(".last-positive");

  function writeDate() {
    date = dates[dates.length - 1].replace(".", "").split(" ");

    lastDay = date[0];

    months = [
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

    lastMonth = months[date[1] - 1];

    lastDateText = `${lastDay}. ${lastMonth}`;

    lastDate.innerHTML = lastDateText;
  }

  function writeNumber() {
    lastPositive.innerHTML = daily_positive[daily_positive.length - 1];
  }

  function chooseArrow() {
    if (daily_positive[daily_positive.length - 1] < daily_positive[daily_positive.length - 2]) {
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
