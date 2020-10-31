function getRand() {
  function today() {
    let now = new Date();
    let start = new Date(2020, 0, 0);
    let offset = start.getTimezoneOffset() - now.getTimezoneOffset();
    let diff = now - start + offset * 60 * 1000;
    let oneDay = 1000 * 60 * 60 * 24;
    let day_no = Math.floor(diff / oneDay);

    return day_no;
  }

  let a = 1664525,
    c = 1013904223,
    m = Math.pow(2, 32),
    seed = 11;

  function nextRand() {
    return (seed = (a * seed + c) % m);
  }

  let population = 23; // no. of images

  let arr = [...Array(population).keys()];
  let quarantine = 11; // repeat interval (min.)
  let sample = population - quarantine;

  let randIndex, randPick;

  for (let i = 0; i < today(); i++) {
    randIndex = nextRand() % sample;
    randPick = arr[randIndex];

    arr.push(...arr.splice(randIndex, 1));
  }
  return randPick;
}
