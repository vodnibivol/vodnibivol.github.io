"use strict";

let chart1, chart2;

/* ---- chart no.1 ---- */

let config1 = {
  type: "line",
  data: {
    labels: [],
    datasets: [
      {
        label: "Delež pozitivnih oseb",
        data: [],
        yAxisID: "A",
        backgroundColor: "#6ccefc44",
        borderColor: "#6ccefc",
        borderWidth: 1,
      },
      {
        label: "Število aktivnih oseb",
        data: [],
        yAxisID: "B",
        backgroundColor: "#8deb8144",
        borderColor: "#8deb81",
        borderWidth: 1,
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 1000, // general animation time
    },
    scales: {
      yAxes: [
        {
          id: "A",
          position: "left",
          ticks: {
            beginAtZero: true,
            autoSkipPadding: 10,
            callback: function (value) {
              return value + " %";
            },
          },
        },
        {
          id: "B",
          position: "right",
          ticks: {
            beginAtZero: true,
            autoSkipPadding: 10,
          },
          gridLines: {
            drawOnChartArea: false, // only want the grid lines for one axis to show up
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
        label: (tooltipItem, data) => {
          var label = data.datasets[tooltipItem.datasetIndex].label;
          if (tooltipItem.datasetIndex == 0) {
            return `${label}: ${tooltipItem.yLabel} %`
          }
          else {
            return `${label}: ${tooltipItem.yLabel}`
          }
        },
      },
    },
  },
};

/* ---- chart no.2 ---- */

let config2 = {
  type: "line",
  data: {
    labels: [],
    datasets: [
      {
        label: "Število pozitivnih oseb",
        data: [],
        yAxisID: "A",
        backgroundColor: "#efac9b44",
        borderColor: "#efac9b",
        borderWidth: 1,
      },
      {
        label: "Število hospitaliziranih oseb",
        data: [],
        yAxisID: "B",
        backgroundColor: "#f792a844",
        borderColor: "#f792a8",
        borderWidth: 1,
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 1000, // general animation time
    },
    scales: {
      yAxes: [
        {
          id: "A",
          position: "left",
          ticks: {
            beginAtZero: true,
            autoSkipPadding: 10,
          },
        },
        {
          id: "B",
          position: "right",
          ticks: {
            beginAtZero: true,
            autoSkipPadding: 10,
          },
          gridLines: {
            drawOnChartArea: false, // only want the grid lines for one axis to show up
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
};

function config() {
  switch (settings.data) {
    case "small":
      config1.data.labels = dates_s;
      config1.data.datasets[0].data = daily_percent_s;
      config1.data.datasets[1].data = daily_active_s;

      config2.data.labels = dates_s;
      config2.data.datasets[0].data = daily_positive_s;
      config2.data.datasets[1].data = daily_hospital_s;
      break;
    case "large":
      config1.data.labels = dates;
      config1.data.datasets[0].data = daily_percent;
      config1.data.datasets[1].data = daily_active;

      config2.data.labels = dates;
      config2.data.datasets[0].data = daily_positive;
      config2.data.datasets[1].data = daily_hospital;
      break;
  }
}

function draw() {
  const ctx1 = document.getElementById("chart1").getContext("2d");
  chart1 = new Chart(ctx1, config1);

  const ctx2 = document.getElementById("chart2").getContext("2d");
  chart2 = new Chart(ctx2, config2);
}

(function pointSize() {
  if (chartDiv1.offsetWidth < 450) {
    Chart.defaults.global.elements.point.radius = 0;
  } else {
    Chart.defaults.global.elements.point.radius = 2;
  }
})();
