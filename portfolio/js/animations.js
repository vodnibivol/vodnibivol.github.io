// --- ANIMATION function

function animate(foo, duration = 1000, easingFunction = 'linear') {
  let start;

  function run(timestamp) {
    start = timestamp;

    // if easing functino not provided / invalid, easing is linear
    if (typeof (easingFunction === 'string')) easingFunction = EF[easingFunction] || EF.linear;

    requestAnimationFrame(step);
  }

  function step(timestamp) {
    let elapsed = timestamp - start; // razlika od start do now OK

    let percentage = Math.min(1, elapsed / duration); // relativna razlika je pomembna
    let percentage_eased = easingFunction(percentage);

    foo(percentage_eased);

    elapsed < duration && requestAnimationFrame(step);
  }

  requestAnimationFrame(run);

  // - Easing Functions - inspired from http://gizma.com/easing/

  const EF = {
    linear: (t) => t,
    easeInQuad: (t) => t * t,
    easeOutQuad: (t) => t * (2 - t),
    easeInOutQuad: (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
    easeInCubic: (t) => t * t * t,
    easeOutCubic: (t) => --t * t * t + 1,
    easeInOutCubic: (t) => (t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1),
    easeInQuart: (t) => t * t * t * t,
    easeOutQuart: (t) => 1 - --t * t * t * t,
    easeInOutQuart: (t) => (t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t),
    easeInQuint: (t) => t * t * t * t * t,
    easeOutQuint: (t) => 1 + --t * t * t * t * t,
    easeInOutQuint: (t) => (t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t),
  };
}

// --- SCROLL TO function

// NOTE: za lep scrolling transition je najbolje vec casa (recimo 1500ms) in easeInOutCubic

function scroll2(position, duration = 1500, easingFunction = 'easeInOutCubic') {
  let page_bottom = document.body.offsetHeight;
  let last_scroll_pos = page_bottom - window.innerHeight;

  let start_pos = window.scrollY;
  let end_pos = Math.min(position, last_scroll_pos);
  let difference = end_pos - start_pos;

  animate(
    function (perc) {
      let current_pos = start_pos + difference * perc;
      window.scrollTo(0, Math.floor(current_pos));
    },
    duration,
    easingFunction
  );
}
