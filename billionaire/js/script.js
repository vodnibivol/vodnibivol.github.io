/* -------- variables -------- */

const submit = document.getElementById("submit");
const form = document.getElementById("form");
const para = document.getElementById("para");
const back = document.getElementById("back");

/* ----- event listeners ----- */

back.addEventListener("click", function () {
  localStorage.removeItem("db");
  location.href = "/billionaire/";
});

form.addEventListener("submit", function (e) {
  e.preventDefault();

  var inputDate = document.getElementById("date").value;
  var inputTime = document.getElementById("time").value;

  var birthDay = new Date(inputDate + "," + inputTime);
  var minutes = birthDay.getTime() / (60 * 1000);

  localStorage.setItem("db", minutes);
  location.href = `?db=${minutes}`;
});

/* -------- functions -------- */

(function initialize() {
  var minutes = getParameterByName("db") || localStorage.getItem("db");

  minutes ? calculate(parseInt(minutes)) : (form.style.display = "block");
})();

function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return "";
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function calculate(m) {
  var d = moment((m * 60 + 10 ** 9) * 1000);

  if (d.isBefore(moment())) {
    para.innerHTML = `You were already 1.000.000.000 seconds old on
    <b>${d.format("MMMM Do YYYY, h:mm:ss A")}</b>.`;
  } else {
    para.innerHTML = `On
    <b>${d.format("dddd, MMMM Do YYYY, h:mm:ss A")}</b>
    you will be exactly 1.000.000.000 seconds old.`;
  }

  para.style.display = "block";
  back.style.display = "block";
}
