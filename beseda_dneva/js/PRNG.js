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

  // values from Numerical recipes
  var a = 1664525,
    c = 1013904223,
    m = Math.pow(2, 32),
    seed = 11;

  for (i = 0; i <= today(); i++) {
    seed = (a * seed + c) % m;
  }

  randEntry = seed % entries_no;

  console.log("random entry : " + randEntry);
  return randEntry;
}
