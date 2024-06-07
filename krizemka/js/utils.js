// --- UTILITY FUNCTIONS

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

// prettier-ignore
const randomId = (len = 8) => new Array(len).fill().map(() => Math.floor(Math.random() * 16).toString(16)).join('');
const cellId = (x, y) => x + '-' + y;
const arrayCount = (arr, el) => arr.filter((e) => e === el).length;
const elementIndex = (el) => [...el.parentElement.children].indexOf(el);
const randomChoose = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randomRange = (min, max) => min + Math.random() * (max - min);

// -- FETCH POST
async function postData(url = '', data = {}) {
  return await fetch(url, { method: 'POST', body: JSON.stringify(data) });
}

// -- HEART SHOWER ANIMATION
function heartShower() {
  const shapes = [
    confetti.shapeFromText({ text: '🩷' }),
    confetti.shapeFromText({ text: '❤️' }),
    confetti.shapeFromText({ text: '💜' }),
  ];

  const duration = 10 * 1000;
  const animationEnd = Date.now() + duration;
  let skew = 1;
  let int = 0;

  function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  (function frame() {
    const timeLeft = animationEnd - Date.now();
    const ticks = Math.max(200, 500 * (timeLeft / duration));
    skew = Math.max(0.8, skew - 0.001);

    if (++int % 6 === 0)
      confetti({
        particleCount: 1,
        startVelocity: 0,
        ticks: 500,
        origin: {
          x: randomInRange(0.4, 0.6),
          // since particles fall down, skew start toward the top
          y: 0,
          // y: skew-0.2,
        },
        // colors: ['#ffffff'],
        shapes,
        gravity: randomInRange(0.6, 0.8),
        scalar: randomInRange(0.5, 1.2),
        drift: randomInRange(-0.4, 0.4), // 0.4
        // flat: true,
      });

    if (timeLeft > 0) {
      requestAnimationFrame(frame);
    }
  })();
}
