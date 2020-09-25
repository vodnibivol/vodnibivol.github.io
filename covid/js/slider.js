/* -------- variable declarations -------- */

const slider = document.querySelector(".slider");
const slides = document.querySelectorAll(".slide");
const prevButton = document.querySelector(".nav-arrow-left");
const nextButton = document.querySelector(".nav-arrow-right");
const navDots = document.querySelectorAll(".nav-dot");

let position = 1;

/* ----------- event listeners ----------- */

prevButton.addEventListener("click", moveLeft);
nextButton.addEventListener("click", moveRight);

window.addEventListener("keydown", checkKey);

window.addEventListener("resize", function () {
  setSlidesPosition();
});

navDots.forEach((dot, index) => {
  dot.addEventListener("click", function () {
    position = index;
    setSlidesPosition(true);
  });
});

/* -------- function declarations -------- */

function checkKey(e) {
  var event = window.event ? window.event : e;

  if (event.keyCode == 37) {
    if (position == 0) return;
    moveLeft();
  } else if (event.keyCode == 39) {
    if (position == 2) return;
    moveRight();
  }
}

function setSlidesPosition(transition = false) {
  // set active dot

  navDots.forEach((dot) => dot.classList.remove("active"));
  navDots[position].classList.add("active");

  // remove arrows if last/first slide

  if (position == 0) {
    prevButton.classList.add("hidden");
    nextButton.classList.remove("hidden");
  } else if (position == 2) {
    nextButton.classList.add("hidden");
    prevButton.classList.remove("hidden");
  } else {
    prevButton.classList.remove("hidden");
    nextButton.classList.remove("hidden");
  }

  // set transition on/off

  if (transition) {
    slides.forEach((slide) => (slide.style.transition = ".8s cubic-bezier(0.19, 1, 0.22, 1)"));
  } else {
    slides.forEach((slide) => (slide.style.transition = "none"));
  }

  // move slides

  let slideWidth = slider.getBoundingClientRect().width;
  slides.forEach((slide, index) => (slide.style.transform = `translateX(${(-position + index) * slideWidth}px)`));
}

function moveLeft() {
  position--;
  setSlidesPosition(true);
}

function moveRight() {
  position++;
  setSlidesPosition(true);
}

setSlidesPosition();
