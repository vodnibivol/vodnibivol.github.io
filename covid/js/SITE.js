const chartDiv = document.getElementById("chartDiv");
const spinner = document.getElementById("spinner");

const url = "https://www.gov.si/assets/vlada/Koronavirus-podatki/COVID-19-vsi-podatki.xlsx";
const proxy = "https://cors-anywhere.herokuapp.com/";

const filename = "COVID-19-vsi-podatki.xlsx";

function getFile() {
  /* set up async GET request */
  var req = new XMLHttpRequest();
  req.open("GET", filename, true); // proxy + url
  req.responseType = "arraybuffer";

  req.onload = function (e) {
    var data = new Uint8Array(req.response);
    var workbook = XLSX.read(data, { type: "array" });

    /* DO SOMETHING WITH workbook HERE */
    let worksheet = workbook.Sheets[workbook.SheetNames[0]];

    parseData(worksheet);
    spinner.classList.add("hidden");
    chartDiv.classList.remove("hidden");
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
      } else column.push(nextCell.w);
    }
    return column;
  };

  let dates = getColumn(worksheet, 0);
  let daily_tested = getColumn(worksheet, 2); // column 2
  let daily_positive = getColumn(worksheet, 4); // column 4

  dates = dates.map((date) => date.replaceAll("/", "."));
  dates = dates.map((date) => date.replace(" 2020", ""));

  // console.log(dates)
  // console.log(daily_tested)
  // console.log(daily_positive)

  draw(dates, daily_tested, daily_positive);
}

function draw(dates, daily_tested, daily_positive) {
  daily_percent = [];

  for (var i = 0; i < daily_tested.length; i++) {
    percent = (daily_positive[i] / daily_tested[i]) * 100;
    percent = percent.toFixed(2);

    daily_percent.push(percent);
  }

  var ctx = document.getElementById("chart").getContext("2d");
  var myChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: dates,
      datasets: [
        {
          label: "Pozitivne osebe v sorazmerju s testiranimi",
          data: daily_percent,
          backgroundColor: "#6ccefc44",
          borderColor: "#6ccefc",
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
              callback: function (value) {
                return value + " %";
              },
            },
          },
        ],
        xAxes: [
          {
            ticks: {
              autoSkipPadding: 15,
            },
          },
        ],
      },
      tooltips: {
        callbacks: {
          label: (item) => `${item.yLabel} %`,
        },
      },
    },
  });
}

(function chartSize() {
  if (chartDiv.offsetWidth < 550) {
    Chart.defaults.global.elements.point.radius = 0;
  } else {
    Chart.defaults.global.elements.point.radius = 2;
  }
})();

getFile();
