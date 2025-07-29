// UTILS

function randomChoose(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomRange(n) {
  return Math.floor(Math.random() * n);
}

function generateSpectreSet(n, dist) {
  // n: number of colors
  // r: minimal distance between colors

  if (n * dist > 360) {
    return null;
  }

  // loop for reduction of the distance
  const spectreValues = [];
  let remainder = 360 - n * dist;

  // random starting point
  let start = 0; // Math.random() * 360;

  for (let i = 0; i < n; ++i) {
    const rand = Math.random() * remainder;
    const hue = start + (dist + rand);
    // const f = Math.floor;
    // console.log(f(remainder), f(rand), f(hue));
    spectreValues.push(Math.floor(hue));
    remainder -= rand;
    start = hue;
  }

  return spectreValues;
}

