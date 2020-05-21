// values from Numerical recipes
var a = 1664525,
  c = 1013904233,
  m = Math.pow(2, 32),
  seed = 12234;

// date algorythm found on: https://stackoverflow.com/a/8619946
function getDay() {
  var now = new Date();
  var start = new Date(2020, 0, 0);
  var diff = now - start;
  var oneDay = 1000 * 60 * 60 * 24;
  var day_no = Math.floor(diff / oneDay) + 32727;

  return day_no;
}

function nextRand() {
  seed = (a * seed + c) % m;
  return seed;
}

function getRand() {
  for (i = 0; i <= getDay(); i++) {
    nextRand();
  }
  randEntry = seed % (entries_no + 1);

  console.log("random entry : " + randEntry);
  return randEntry;
}

// function nextRandEntry() {
//   return nextRand() % (entries_no + 1);
// }

// const button = document.getElementById("start");
// button.addEventListener("click", draw);

// setTimeout(draw, 500);

// var canvas = document.getElementById("canvas"),
//   context = canvas.getContext("2d");

// var y = 0;
// function draw() {
//   for (var x = 0; x < 600; x += 3) {
//     value = nextRandEntry();
//     var hue = (nextRandEntry() / entries_no) * 360; // where in range are we
//     var lum = (nextRandEntry() / entries_no) * 100;
//     var sat = (nextRandEntry() / entries_no) * 30 + 35; // * 100
//     context.fillStyle = `hsl(${hue}, ${sat}%, 50%)`; // ${lum}
//     context.fillRect(x, y, 2, 2);
//   }
//   y += 3;
//   if (y < 600) {
//     requestAnimationFrame(draw);
//   }
//   button.innerHTML = seed % entries_no;
// }
