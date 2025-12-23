const board = document.querySelector('.board');
const startbtn = document.querySelector('.start-btn');
const modal = document.querySelector('.modal');
const startGameModal = document.querySelector('.start-game');
const gameOverModal = document.querySelector('.game-over');
const restartBtn = document.querySelector('.restart-btn');
const scoreBoard = document.querySelector('#score');
const highscoreBoard = document.querySelector('#high-score');
const timerBoard = document.querySelector('#time');


const blockHeight = 50;
const blockWidth = 50;


const col = Math.floor(board.clientWidth / blockWidth);
const row = Math.floor(board.clientHeight / blockHeight);
let intervalId = null;
let timeIntervalId = null;

let food = {x: Math.floor(Math.random() * row) , y: Math.floor(Math.random() * col)};
let score = 0;
let highscore = localStorage.getItem('highscore') || 0;
let time = `00:00`;
scoreBoard.textContent = `${score}`;
highscoreBoard.textContent = `${highscore}`;
timerBoard.textContent = `${time}`;


const blocks = [];
let snake = [{x:1 , y:7} , {x:1 , y:8} ];
let direction = 'down';

for (let r = 0; r < row; r++) {
    for (let c = 0; c < col; c++) {
      const block = document.createElement('div');
        block.classList.add('block');
        board.appendChild(block);
       
        blocks[`${r}-${c}`] = block;
    }
}

function render() {
    let head = null;

    blocks[`${food.x}-${food.y}`].classList.add('food');

    if (direction === 'left') {
        head = {x: snake[0].x, y: snake[0].y - 1};
    }
    else if (direction === 'right') {
        head = {x: snake[0].x, y: snake[0].y + 1};
    }
    else if (direction === 'up') {
        head = {x: snake[0].x - 1, y: snake[0].y};
    }   
    else if (direction === 'down') {
        head = {x: snake[0].x + 1, y: snake[0].y};
    }

    if (head.x < 0 || head.x >= row || head.y < 0 || head.y >= col) {

        clearInterval(intervalId);  
        clearInterval(timeIntervalId);
        modal.style.display = 'flex';
        startGameModal.style.display = 'none';
        gameOverModal.style.display = 'flex';
        return ; 
    }

    // food consumption logic
    if(head.x === food.x && head.y === food.y) {
        blocks[`${food.x}-${food.y}`].classList.remove('food');
        food = {x: Math.floor(Math.random() * row) , y: Math.floor(Math.random() * col)};
        snake.unshift(head);
        score += 1;
        scoreBoard.textContent = `${score}`;
        if (score > highscore) {
            highscore = score;
            localStorage.setItem('highscore' , highscore);
        }
    }

    snake.forEach((segment) => {
        blocks[`${segment.x}-${segment.y}`].classList.remove('fill');
    });
    snake.unshift(head);
    snake.pop();
    snake.forEach((segment) => {
        blocks[`${segment.x}-${segment.y}`].classList.add('fill');
    })
}

// intervalId = setInterval(() => {
//     render();
// }, 300);

startbtn.addEventListener('click', () => {
    modal.style.display = 'none';
    intervalId = setInterval(() => {
        render();
    }, 300);
    timeIntervalId = setInterval(() => {
        let [mins , secs] = time.split(':').map(Number);
        secs += 1;
        if (secs >= 59) {
            mins += 1;
            secs = 0;
        }
        time = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        timerBoard.textContent = `${time}`;
    }, 1000);   
});


function restartGame() {
  // stop previous loops
  clearInterval(intervalId);
  clearInterval(timeIntervalId);

  // clear old food
  blocks[`${food.x}-${food.y}`]?.classList.remove('food');

  // clear old snake
  snake.forEach(seg => {
    blocks[`${seg.x}-${seg.y}`]?.classList.remove('fill');
  });

  // reset values
  snake = [{ x: 1, y: 7 }, { x: 1, y: 8 }];
  direction = 'down';

  food = { x: Math.floor(Math.random() * row), y: Math.floor(Math.random() * col) };

  score = 0;
  time = "00:00";

  scoreBoard.textContent = `${score}`;
  timerBoard.textContent = `${time}`;
  highscoreBoard.textContent = `${highscore}`;

  modal.style.display = 'none';

  // draw initial snake immediately (so you don't wait for next tick)
  snake.forEach(seg => blocks[`${seg.x}-${seg.y}`].classList.add('fill'));
  blocks[`${food.x}-${food.y}`].classList.add('food');

  // restart loops
  intervalId = setInterval(render, 300);

  timeIntervalId = setInterval(() => {
    let [mins, secs] = time.split(':').map(Number);
    secs += 1;

    if (secs >= 60) {   // ✅ 60, not 59
      mins += 1;
      secs = 0;
    }

    time = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    timerBoard.textContent = time;
  }, 1000);
}


restartBtn.addEventListener('click', () => {
    restartGame();
});


addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        direction = 'left';
    }
    else if (e.key === 'ArrowRight') {
        direction = 'right';
    }
    else if (e.key === 'ArrowUp') {
        direction = 'up';
    }
    else if (e.key === 'ArrowDown') {
        direction = 'down';
    }   
});


