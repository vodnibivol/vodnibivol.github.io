/* ----------- Variable declarations ----------- */

const cards = document.querySelectorAll('.memory-card');
const frontFaces = document.querySelectorAll('.front-face');

const winningMessageElement = document.getElementById('winningMessage');
const replayButton = document.getElementById('replayButton');

const restartIcon = document.querySelector('.restart-button');
const timerIcon = document.querySelector('.timer-icon');

const timer = document.getElementById('timer');  // the visible timer
const timerMinutes = document.querySelector('.minutes');
const timerSeconds = document.querySelector('.seconds');
let timerClock;  // the time ticking itself (function)
let elapsedSeconds;

let gamePlay;
let lockBoard;
let hasFlipped;
let firstCard, secondCard;
let wins;

/* ----------- Event listeners ----------- */

replayButton.addEventListener('click', initialize);
restartIcon.addEventListener('click', initialize);

timerIcon.addEventListener('click', () => {
    console.log('clicked on timer icon');
    
    timerIcon.classList.toggle('checked');
    timer.classList.toggle('show');
})

/* ----------- Main game logic ----------- */

initialize();

function initialize() {
    
    /* --- Set variables --- */
    
    wins = 0;
    gamePlay = false;
    lockBoard = false;
    hasFlipped = false;
    
    elapsedSeconds = 0;
    timerMinutes.textContent = '00';
    timerSeconds.textContent = '00';
    
    cards.forEach(card => card.addEventListener('click', flipCard));
    cards.forEach(card => card.classList.remove('flipped', 'found'));
    frontFaces.forEach(face => face.style.filter = 'grayscale(0)');
    winningMessageElement.classList.remove('show');

    /* --- Functions --- */

    resetBoard();
    stopTimer();
    
    setTimeout(() => {shuffle()}, 500);

    console.log('initialized');
}

function startTimer() {
    timerClock = setInterval(setTime, 1000);
}

function stopTimer() {
    clearInterval(timerClock);
}

function setTime() {  // advances seconds and writes values to HTML
    elapsedSeconds++;

    min = parseInt(elapsedSeconds / 60);
    sec = elapsedSeconds % 60;
    
    timerMinutes.textContent = stringifyTime(min);
    timerSeconds.textContent = stringifyTime(sec);
}

/*
async function cardFlipReset() {
    for (var i = 0, len = cards.length; i < len; i++) {
        
        cards[i].classList.remove('flipped', 'found');
        console.log(cards[i].dataset, 'flipped');
        await new Promise(r => setTimeout(r, 50));
    }
}
*/

function shuffle() {
    cards.forEach(card => {
        card.style.order = Math.floor(Math.random() * cards.length + 1);
    });
}

function flipCard() {
    
    if (!gamePlay) {
        gamePlay = true;
        startTimer();
    }

    // hide counter during the game
    // setTimeout(() => {timer.classList.remove('ended');}, 2500);
        
    if (lockBoard) return;
    if (this === firstCard) return;
    
    this.classList.toggle('flipped');

    if (!hasFlipped) {
        // first click
        hasFlipped = true;
        firstCard = this;
    } else {
        // second click
        hasFlipped = false;
        secondCard = this;
    }

    checkMatch();
    // endGame();
}

function checkMatch() {
    let isMatch = firstCard.dataset.name === secondCard.dataset.name;

    isMatch ? disableCards() : unflipCards();
}

function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);

    firstCard.classList.toggle('found');
    secondCard.classList.toggle('found');

    wins ++;
    console.log(wins);

    if (wins == (cards.length) / 2) {endGame()};

    resetBoard();

    console.log('it\'s a match!');
}

function unflipCards() {
    lockBoard = true;
    
    setTimeout(() => {
        firstCard.classList.toggle('flipped');
        secondCard.classList.toggle('flipped');
        
        resetBoard();
    }, 1500);

    console.log('not a match');
}

function resetBoard() {
    [hasFlipped, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

function endGame() {
    stopTimer();
    
    winningMessageElement.classList.add('show');
    
    frontFaces.forEach(face => face.style.filter = 'grayscale(.2)');

    console.log('won the game!');
}

function stringifyTime(val) {
    var valString = val + '';
    return valString.length >= 2 ? `${val}` : `0${val}`;
}
