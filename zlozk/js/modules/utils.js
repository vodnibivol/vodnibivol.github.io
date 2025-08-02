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
  let start = Random.range(360, Random.PRNG_COLOR);

  for (let i = 0; i < n; ++i) {
    const rand = Random.range(remainder, Random.PRNG_COLOR);
    const hue = start + (dist + rand);
    spectreValues.push(floor(hue % 360));

    remainder -= rand;
    start = hue;
  }

  return spectreValues;
}

// RANDOM

const Random = {
  PRNG_COLOR: null,
  PRNG_SHAPES: null,

  choose(arr, prng = Math.random) {
    return arr[floor(prng() * arr.length)];
  },

  range(n, prng = Math.random) {
    return prng() * n; // floor?
  }
};
