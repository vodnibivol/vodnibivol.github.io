function draw(dates, daily_tested, daily_positive) {
  daily_percent = [];

  for (var i = 0; i < daily_tested.length; i++) {
    percent = (daily_positive[i] / daily_tested[i]) * 100;
    percent = percent.toFixed(2);

    daily_percent.push(percent);
  }

  if (chartDiv1.offsetWidth < 550) {
    dates = dates.slice(-50);
    daily_percent = daily_percent.slice(-50);
    daily_positive = daily_positive.slice(-50);
  }

  var ctx1 = document.getElementById("chart1").getContext("2d");
  var myChart1 = new Chart(ctx1, {
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

  /* ---- chart no.2 ---- */

  var ctx2 = document.getElementById("chart2").getContext("2d");
  var myChart2 = new Chart(ctx2, {
    type: "line",
    data: {
      labels: dates,
      datasets: [
        {
          label: "Število pozitivnih oseb",
          data: daily_positive,
          backgroundColor: "#efac9b44",
          borderColor: "#efac9b",
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
    },
  });
}

(function chartSize() {
  if (chartDiv1.offsetWidth < 550) {
    Chart.defaults.global.elements.point.radius = 0;
  } else {
    Chart.defaults.global.elements.point.radius = 2;
  }
})();
