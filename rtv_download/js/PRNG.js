function getRand() {
  function today() {
    var now = new Date();
    var start = new Date(2020, 0, 0);
    var offset = start.getTimezoneOffset() - now.getTimezoneOffset();
    var diff = now - start + offset * 60 * 1000;
    var oneDay = 1000 * 60 * 60 * 24;
    var day_no = Math.floor(diff / oneDay);

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

  for (var i = 0; i < today(); i++) {
    var randIndex = nextRand() % sample;
    var randPick = arr[randIndex];

    arr.push(...arr.splice(randIndex, 1));
  }
  return randPick;
}
