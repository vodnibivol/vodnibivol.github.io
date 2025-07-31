// UTILS

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
  let start = random(360);

  for (let i = 0; i < n; ++i) {
    const rand = random(remainder);
    const hue = start + (dist + rand);
    spectreValues.push(floor(hue % 360));

    remainder -= rand;
    start = hue;
  }

  return spectreValues;
}
