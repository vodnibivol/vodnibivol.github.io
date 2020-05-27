/* ----- Declare variables ----- */

const bounceDiv = document.getElementById("bounceDiv");
const circleDiv = document.getElementById("circleDiv");
const inputButton = document.getElementById("dlButton");
const startButton = document.getElementById("startButton");
const stopButton = document.getElementById("stopButton");

var keepMoving = undefined;
var count = 0;

/* ----- Add event listeners ----- */

startButton.addEventListener("click", startAnim);
stopButton.addEventListener("click", endAnim);

/* ----- Functions (animation triggers) ----- */

function headShake() {
  bounceDiv.style.animation = "shake 0.5s";
  bounceDiv.addEventListener("animationend", () => {
    bounceDiv.removeAttribute("style");
  });
}

function startAnim() {
  inputField.classList.add("animated");
  inputButton.classList.add("animated");
  circleDiv.classList.add("animated");
  tip.classList.remove("show");
  // bounceDiv.classList.add("animated");

  bounceDiv.style.animation = "bounce 0.5s alternate infinite";

  // dlButton.disabled = true;
  inputField.blur();

  // bounceDiv.removeAttribute("style");

  count = 0;

  keepMoving = setInterval(() => {
    count += 2;
  }, 1000);
}

function endAnim() {
  bounceDiv.style["animation-iteration-count"] = count + 2;

  clearInterval(keepMoving);
  count = 0;

  circleDiv.classList.remove("animated");

  bounceDiv.addEventListener("animationend", () => {
    inputField.classList.remove("animated");
    inputButton.classList.remove("animated");
    // tip.classList.remove("show");
    bounceDiv.removeAttribute("style");
    // randomBackground();
  });
}

/* ----- Loading circle script ----- */

var circle = document.getElementById("progressCircle");
var radius = circle.r.baseVal.value;
var circumference = radius * 2 * Math.PI;

circle.style.strokeDasharray = `${circumference} ${circumference}`;
circle.style.strokeDashoffset = `${circumference}`;

function setProgress(percent) {
  const offset = circumference - (percent / 100) * circumference;
  circle.style.strokeDashoffset = offset;
}
