const Main = (function () {
  const $ = (sel) => document.querySelector(sel);

  // events
  window.addEventListener('scroll', toggleNavColor);
  $('header').addEventListener('click', navigate);

  // init
  renderProjects();

  function navigate(e) {
    // events
    e.preventDefault();

    let scrollOffset;

    if (e.target.matches('.logo')) {
      scrollOffset = 50;
    } else if (e.target.matches('#aboutLink')) {
      scrollOffset = Math.floor($('#about-me').offsetTop);
    } else if (e.target.matches('#projectsLink')) {
      scrollOffset = Math.floor($('#projects').offsetTop + 1);
    } else if (e.target.matches('#contactLink')) {
      scrollOffset = Math.floor($('footer').offsetTop);
    }

    scroll2(scrollOffset - 50, 1000);
  }

  function toggleNavColor() {
    if (window.scrollY > $('#projects').offsetTop - 50) {
      $('header').classList.add('white');
    } else {
      $('header').classList.remove('white');
    }
  }

  function renderProjects() {
    const projects = [
      {
        title: 'Tilings',
        description:
          'Designed and developed with p5.js, Tilings is a browser game where players drag Tetris-like shapes to fill a grid. Built using only p5.js library, it works on PC and mobile.',
        img_src: 'img/thumbs/zlozek.png',
        link: '/zlozek',
      },
      {
        title: 'Jumping Dwarf',
        description:
          'A stylish browser game with sleek minimalist aesthetics, where players guide a dwarf upward by leaping across diverse platforms. Built using p5.js graphics library.',
        img_src: 'img/thumbs/skratek.png',
        link: '/skratek',
      },
      {
        title: 'Sine Line',
        description:
          'Another minimalist web game where players navigate in smooth motion, dodging obstacles and collecting points.',
        img_src: 'img/thumbs/skratek.png',
        link: '/skratek',
      },
      {
        title: 'Space Shooter',
        description: '',
        img_src: 'img/thumbs/vesoljcki.png',
        link: '/vesoljcki',
      },
      {
        title: 'Snake',
        description: 'A classic Snake game recreated for the web using JavaScript and p5.js.',
        img_src: 'img/thumbs/kacica.png',
        link: '/kacica',
      },
      {
        title: 'MS Paint Clone',
        description: 'A minimalist web-based recreation of old Microsoft Paint, created entirely from scratch as a study in math and low-level JS graphics.',
        img_src: 'img/thumbs/slikar.png',
        link: '/slikar',
      },
      {
        title: 'Learn World Flags',
        description: 'A PC-based educational game i built for myself that teaches you world flags, organized by continent.',
        img_src: 'img/thumbs/zastavice.png',
        link: '/zastavice',
      },
      {
        title: 'Wordle Clone',
        description: 'A Slovenian-language translation of a famous game, Wordle, using self-made word dictionaries.',
        img_src: 'img/thumbs/besedle.png',
        link: '/besedle',
      },
      {
        title: 'Word Picnic Clone',
        description: 'Another Slovenian-language Word Picnic inspired web game, combining JavaScript game mechanics with a Python-based data analysis of valid words.',
        img_src: 'img/thumbs/piknik.png',
        link: '/piknik',
      },
      {
        title: 'Morse Weather Report',
        description:
        'Minimalist joke app reporting real-time Slovenian weather, translated into Morse code text and sound.',
        img_src: 'img/thumbs/vreme.png',
        link: '/vremenska_napoved',
      },
      {
        title: 'Morse Translator',
        description: 'A simple web tool that translates text to Morse code (and vice versa) in real-time, built for quick and interactive usage.',
        img_src: 'img/thumbs/morse.png',
        link: '/morse',
      },
      {
        title: 'Space Shooter',
        description: 'A minimalist browser-based space shooter for PC, featuring adorable hand-drawn sprites and sleek aesthetics.',
        img_src: 'img/thumbs/vesoljcki.png',
        link: '/vesoljcki',
      },
    ];

    const html_template = $('template#grid-item-template').innerHTML;
    const rendered_html = render(html_template, projects);
    $('template#grid-item-template').remove();
    $('.project-grid').insertAdjacentHTML('beforeend', rendered_html);
  }

  function render(template, data /** Array */) {
    return data
      .map((project_item) => {
        let html = template;
        Object.entries(project_item).forEach(([key, value]) => {
          html = html.replaceAll('{{ ' + key + ' }}', value);
        });
        return html;
      })
      .join('');
  }
})();
