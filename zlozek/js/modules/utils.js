// --- UTILS

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

// --- RANDOM

const Random = {
  PRNG_COLOR: null,
  PRNG_SHAPES: null,

  choose(arr, prng = Math.random) {
    return arr[floor(prng() * arr.length)];
  },

  range(n, prng = Math.random) {
    return prng() * n; // floor?
  },
};

// --- CHROMATIC ABBERATION

function chromaticAberration() {
  // https://gist.github.com/lqt0223/8a258b68ae1c032fa1fb1e26c4965e8d
  const imageData = drawingContext.getImageData(0, 0, drawingContext.canvas.width, drawingContext.canvas.height);

  const phase = 0;
  const intensity = 4;

  // abberation part
  const data = imageData.data; // RGBA
  for (let i = phase % 4; i < data.length; i += 4) {
    // Setting the start of the loop to a different integer will change the aberration color, but a start integer of 4n-1 will not work
    data[i] = data[i + 4 * intensity];
  }

  // render
  drawingContext.putImageData(imageData, 0, 0);
}
