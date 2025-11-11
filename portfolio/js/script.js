const Main = (function () {
  const $ = (sel) => document.querySelector(sel);

  // events
  window.addEventListener('scroll', toggleNavColor);
  $('header').addEventListener('click', navigate);

  // init
  renderProjects();

  // functions
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
        title: 'Windex Study',
        description:
          'A responsive (fictional) company website built in React, modeled after a UI concept as a hands-on way to learn React development',
        img_src: 'img/thumbs/windex.png',
        link: '/windex-study-react',
        github_link: 'https://github.com/vodnibivol/windex-study-react',
      },
      {
        title: 'To-Do List',
        description:
          'Another small React learning project — a responsive Todo list app for exploring the basics of reactivity.',
        img_src: 'img/thumbs/todo.png',
        link: '/react-todo',
        github_link: 'https://github.com/vodnibivol/react-todo',
      },
      {
        title: 'Tilings',
        description:
          'Designed and developed with p5.js, Tilings is a browser game where players drag Tetris-like shapes to fill a grid. Built using only p5.js graphics library, it works on PC and mobile.',
        img_src: 'img/thumbs/zlozek.png',
        link: '/zlozek',
        github_link: 'https://github.com/vodnibivol/vodnibivol.github.io/tree/master/zlozek',
      },
      {
        title: 'Jumping Dwarf',
        description:
          'A stylish browser game with minimalist aesthetics, where players guide a dwarf upward by jumping across diverse platforms. Built using p5.js.',
        img_src: 'img/thumbs/skratek.png',
        link: 'https://lulekfun.github.io/skratek',
        github_link: 'https://github.com/lulekfun/lulekfun.github.io/tree/master/skratek',
      },
      {
        title: 'Sine Line',
        description:
          'Another minimalist p5.js web game where players navigate in sine-like motion, dodging obstacles and collecting points.',
        img_src: 'img/thumbs/crtica.png',
        link: 'https://lulekfun.github.io/crtica',
        github_link: 'https://github.com/lulekfun/lulekfun.github.io/tree/master/crtica',
      },
      {
        title: 'Snake',
        description: 'My first p5.js web game: classic Snake, recreated for the web using JavaScript and p5.js.',
        img_src: 'img/thumbs/kacica.png',
        link: 'https://lulekfun.github.io/kacica',
        github_link: 'https://github.com/lulekfun/lulekfun.github.io/tree/master/kacica',
      },
      {
        title: 'Busbus — bus tracker',
        description:
          "Ljubljana's bus timetable app with a live tracker map and an option to rate drivers — because sometimes public transport deserves feedback too!",
        img_src: 'img/thumbs/busbus.png',
        link: 'https://strojcek.ftp.sh/busbus',
        github_link: 'https://github.com/vodnibivol/busbus',
      },
      {
        title: 'Knjižarna (Book-store)',
        description:
          'A shared lesson material library I made for me and my classmates, featuring file uploads and search to make school resources less chaotic:)',
        img_src: 'img/thumbs/knjizarna.png',
        link: 'https://strojcek.ftp.sh/knjizarna',
        github_link: 'https://github.com/vodnibivol/knjizarna',
      },
      {
        title: 'Learn World Flags',
        description:
          'This is a PC-based educational game I built for myself that teaches you world flags, organized by continent.',
        img_src: 'img/thumbs/zastavice.png',
        link: '/zastavice',
        github_link: 'https://github.com/vodnibivol/vodnibivol.github.io/tree/master/zastavice',
      },
      {
        title: 'Flashcards',
        description:
          'When studying Latin, I built myself a flashcard-like app for learning pairs of words. Built around the same core as World Flags, it has helped me pass the Latin exam in college.',
        img_src: 'img/thumbs/ucenje.png',
        link: '/ucenje',
        github_link: 'https://github.com/vodnibivol/vodnibivol.github.io/tree/master/ucenje',
      },
      {
        title: 'Wordle Clone',
        description:
          'A Slovenian-language translation of a famous game, Wordle, using self-compiled word dictionaries. My first PWA that works offline.',
        img_src: 'img/thumbs/besedle.png',
        link: '/besedle',
        github_link: 'https://github.com/vodnibivol/vodnibivol.github.io/tree/master/besedle',
      },
      {
        title: 'Word Picnic Clone',
        description:
          'Another Slovenian-language Word Picnic inspired web game, combining JavaScript game mechanics with a Python-based data analysis of valid words.',
        img_src: 'img/thumbs/piknik.png',
        link: '/piknik',
        github_link: 'https://github.com/vodnibivol/vodnibivol.github.io/tree/master/piknik',
      },
      {
        title: 'MS Paint Clone',
        description:
          'A minimalist web-based recreation of old Microsoft Paint, created entirely from scratch as a study in math and low-level JS graphics.',
        img_src: 'img/thumbs/slikar.png',
        link: '/slikar',
        github_link: 'https://github.com/vodnibivol/vodnibivol.github.io/tree/master/slikar',
      },
      {
        title: 'Morse Weather Report',
        description:
          'Minimalist joke app reporting real-time Slovenian weather, translated into Morse code text and sound. Not very useful, I know ..',
        img_src: 'img/thumbs/vreme.png',
        link: '/vremenska_napoved',
        github_link: 'https://github.com/vodnibivol/vodnibivol.github.io/tree/master/vremenska_napoved',
      },
      {
        title: 'Morse Translator',
        description:
          'A simple web tool that translates text to Morse code (and vice versa) in real-time, built for quick and interactive usage. Now you can translate Slovenian weather, haha.',
        img_src: 'img/thumbs/morse.png',
        link: '/morse',
        github_link: 'https://github.com/vodnibivol/vodnibivol.github.io/tree/master/morse',
      },
      {
        title: 'Space Shooter',
        description:
          'A minimalist browser-based space shooter for PC, featuring adorable hand-drawn sprites and sleek aesthetics.',
        img_src: 'img/thumbs/vesoljcki.png',
        link: 'https://lulekfun.github.io/vesoljcki',
        github_link: 'https://github.com/lulekfun/lulekfun.github.io/tree/master/vesoljcki',
      },
    ];

    const html_template = $('template#grid-item-template').innerHTML;
    const rendered_html = render(html_template, projects);
    // $('template#grid-item-template').remove();
    $('.project-grid').insertAdjacentHTML('beforeend', rendered_html);
  }

  function render(template, data /** Array/String */) {
    // core function for string replacing/rendering
    function r(template, data) {
      Object.entries(data).forEach(([key, value]) => {
        const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
        template = template.replace(regex, value);
      });
      return template;
    }

    if (typeof data === 'string') {
      data = [data];
    }

    return data.map((data_item) => r(template, data_item)).join('');
  }
})();
