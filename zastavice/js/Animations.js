const Animations = {
  showError() {
    const widthA = $('.target').getBoundingClientRect().width;
    const widthB = $('.guess').getBoundingClientRect().width;
    const gap = 30; // px

    const a = anime({
      targets: '.target',
      translateX: -(widthB + gap) / 2,
      easing: 'easeInOutElastic(1, 1)',
      duration: 800,
    });

    const b = anime({
      targets: '.guess',
      translateX: [0, (widthA + gap) / 2],
      translateY: [0, 0],
      opacity: [0, 1],
      easing: 'easeInOutElastic(1, 1)',
      duration: 800,
    });

    return Promise.all([a, b]);
  },

  hideError() {
    const a = anime({
      targets: '.target',
      translateY: -100,
      opacity: 0,
      easing: 'easeInCubic',
      duration: 400,
    }).finished;

    const b = anime({
      targets: '.guess',
      translateY: 100,
      opacity: 0,
      easing: 'easeInCubic',
      duration: 400,
    }).finished;

    return Promise.all([a, b]);
  },

  toHeaven() {
    return anime({
      targets: '.target',
      translateY: [0, -100],
      opacity: [1, 0],
      easing: 'easeInQuad',
      duration: 300,
    }).finished;
  },

  toHell() {
    return anime({
      targets: '.target',
      translateY: 100,
      opacity: 0,
      easing: 'easeInQuart', // Quart/Quint
      duration: 500,
    }).finished;
  },

  fromHell() {
    return anime({
      targets: '.target',
      translateY: [100, 0],
      translateX: [0, 0],
      opacity: [0, 1],
      easing: 'easeOutElastic(1, 2)',
    }).finished;
  },

  shake(targets) {
    return anime({
      targets,
      translateX: [10, -7, 5, 0],
      easing: 'easeInOutQuad',
      duration: 500,
    }).finished;
  },
};
