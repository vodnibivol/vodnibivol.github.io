import Random from './PRNG.js';

const Site = (function () {
  // cache DOM
  const mainDiv = document.querySelector('.main');
  const loader = mainDiv.querySelector('.loader');

  // init
  _run();

  function _render(entry) {
    loader.classList.add('hidden');

    let entryDiv = document.createElement('div');
    entryDiv.className = 'entry hidden';
    entryDiv.innerHTML = entry;
    mainDiv.appendChild(entryDiv);

    setTimeout(function () {
      entryDiv.classList.remove('hidden');
    }, 400);
  }

  async function _run() {
    let index_req = await fetch('./WORDS/index.json');
    let INDEX = await index_req.json();

    console.log('no. of entries : ' + INDEX.entries);

    let randNum = new Random(INDEX.entries).randEntry; // 0-entries
    console.log('random entry : ' + randNum);

    let file_no = Math.floor(randNum / INDEX.filesize);
    let entry_no = randNum % INDEX.filesize;

    let filename = INDEX.files[file_no];
    console.log('filename : ' + filename);

    let file_req = await fetch(`./WORDS/${filename}`);
    let FILE = await file_req.json();

    let ids = Object.keys(FILE).sort();
    let rand_id = ids[entry_no];
    console.log('random id : ' + rand_id);

    let entry = FILE[rand_id];

    _render(entry);
  }
})();

const Info = (function () {
  // cache DOM
  const infoBubble = document.querySelector('.info-bubble');
  const infoIcon = document.querySelector('.info-icon');

  let bubbleCountdown;

  // bind events
  infoIcon.addEventListener('click', _bubbleClick);

  function _bubbleClick() {
    let isOpen = infoBubble.classList.contains('open');

    if (isOpen) _closeBubble();
    else _openBubble();
  }

  function _openBubble() {
    infoBubble.classList.add('open');
    bubbleCountdown = setTimeout(_closeBubble, 5000);
  }

  function _closeBubble() {
    infoBubble.classList.remove('open');
    clearTimeout(bubbleCountdown);
  }
})();
