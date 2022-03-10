const canvas = document.getElementById("underworld-bg");
let ctx = canvas.getContext("2d");
let tileNumber = 20;
let tileSize = canvas.width / tileNumber;
let gameSpeed; // this is the speed the game goes.
let snakeTailLength = 2; // initial length of the snake
let snakeTail; // snake positions
let snakeSpeed;
let snakeFoodPosition;
let removeTail = true;
let gameStart;
let gameIsLost;
let score; // score counter
let highScore = 0; // highscore record
let prevDirection = { x: 0, y: 0 };

/**
 * Setting up the canvas
 */

resizeCanvasResponsive();

// resize canvas on screen resize
window.addEventListener(
  "resize",
  function () {
    resizeCanvasResponsive();
  },
  false
);

// resize canvas on phone rotation
window.addEventListener(
  "orientationchange",
  function () {
    resizeCanvasResponsive();
  },
  false
);

function resizeCanvasResponsive() {
  if (window.innerWidth < 565) {
    canvas.width = window.innerWidth - 65;
    canvas.height = window.innerWidth - 65;
  }
  if (window.innerHeight < 650) {
    canvas.width = window.innerHeight - 150;
    canvas.height = window.innerHeight - 150;
  }
  if (window.innerWidth >= 550 && window.innerHeight >= 650) {
    canvas.width = 500;
    canvas.height = 500;
    
  }

  

  tileSize = canvas.width / tileNumber;
}

function clearScreen() {
  //clears the screen
  ctx.fillStyle = "#181825";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // I got the design idea from https://codepen.io/fariati
  ctx.lineWidth = 1.1;
  ctx.strokeStyle = "#232332";
  ctx.shadowBlur = 0;
  for (let i = 1; i < tileNumber; i++) {
    let f = (canvas.width / tileNumber) * i;
    ctx.beginPath();
    ctx.moveTo(f, 0);
    ctx.lineTo(f, canvas.height);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, f);
    ctx.lineTo(canvas.width, f);
    ctx.stroke();
    ctx.closePath();
  }
}

// this function draws the food
function drawFood() {
  ctx.fillStyle = "blue";
  ctx.shadowBlur = 20;
  ctx.shadowColor = "rgba(0,0,255,1 )"; // I got the design idea from https://codepen.io/fariati
  ctx.fillRect(
    snakeFoodPosition.x * tileSize,
    snakeFoodPosition.y * tileSize,
    tileSize,
    tileSize
  );
}

function snakePosition(newHeadSnake) {
  if (newHeadSnake.x === tileNumber) {
    newHeadSnake.x = 0;
  } else if (newHeadSnake.x === -1) {
    newHeadSnake.x = tileNumber - 1;
  }

  if (newHeadSnake.y === tileNumber) {
    newHeadSnake.y = 0;
  } else if (newHeadSnake.y === -1) {
    newHeadSnake.y = tileNumber - 1;
  }
}
// this function draws the snake
function drawSnake() {
  // update position of the snake head
  let newHeadSnake = {
    x: snakeTail[snakeTail.length - 1].x + snakeSpeed.x,
    y: snakeTail[snakeTail.length - 1].y + snakeSpeed.y,
  };

  snakePosition(newHeadSnake);

  snakeTail.push(newHeadSnake);
  if (removeTail) {
    //checks if the tail should be removed
    snakeTail.shift(); // remove last tail block
  }

  ctx.fillStyle = "rgba(255,255,255,1 )";

  ctx.shadowBlur = 20;
  ctx.shadowColor = "rgba(255,255,255,.3 )";
  ctx.fillRect(
    snakeTail[snakeTail.length - 1].x * tileSize,
    snakeTail[snakeTail.length - 1].y * tileSize,
    tileSize,
    tileSize
  );
  ctx.shadowBlur = 0;

  for (let i = 0; i < snakeTail.length; i++) {
    ctx.lineWidth = 2; // I got the design idea from https://codepen.io/fariati
    ctx.fillStyle = "rgba(255,255,255,.85 )";
    ctx.fillRect(
      snakeTail[snakeTail.length - i - 1].x * tileSize,
      snakeTail[snakeTail.length - i - 1].y * tileSize,
      tileSize,
      tileSize
    );
  }
}

document.addEventListener("keydown", keyEventPress);

// This function controls the movement of the snake
function keyEventPress(e) {
  if (e.keyCode === 37) {
    if (snakeSpeed.x !== 1) {
      snakeSpeed = { x: -1, y: 0 };
    } else console.log("Error, you can not go  left while going right");
  } else if (e.keyCode === 38) {
    if (snakeSpeed.y !== 1) {
      snakeSpeed = { x: 0, y: -1 };
    } else console.log("Error, you can not go up while going down");
  } else if (e.keyCode === 39) {
    if (snakeSpeed.x !== -1) {
      snakeSpeed = { x: 1, y: 0 };
    } else console.log("Error, you can not go right while going left");
  } else if (e.keyCode === 40) {
    if (snakeSpeed.y !== -1) {
      snakeSpeed = { x: 0, y: 1 };
    } else console.log("Error, you can not go down while going up");
  }

  if (
    e.keyCode === 37 ||
    e.keyCode === 38 ||
    e.keyCode === 39 ||
    e.keyCode === 40
  ) {
    gameStart = true;
  }


}

// This function will make the snake eat the food and also check if GAME OVER due to collision with tail
function checkCollision() {
  let newHeadSnake = {
    x: snakeTail[snakeTail.length - 1].x + snakeSpeed.x,
    y: snakeTail[snakeTail.length - 1].y + snakeSpeed.y,
  };

  // checks if snake goes outside of the grid
  snakePosition(newHeadSnake);

  // if snake ate the food, create a new position for the food
  if (
    snakeFoodPosition.x === newHeadSnake.x &&
    snakeFoodPosition.y === newHeadSnake.y
  ) {
    spawnFood(newHeadSnake);

    scoreCounter();

    removeTail = false; // don't remove tail to increase the snake by one block
  }
  // if snake hit itself, GAME OVER
  else if (snakeTail.length >= snakeTailLength && gameStart) {
    for (let t = 0; t < snakeTail.length; t++) {
      let tail = snakeTail[t];
      if (tail.x == newHeadSnake.x && tail.y == newHeadSnake.y) {
        gameIsLost = true;
        break;
      }
    }
  }
}

function resetGame() {
  clearScreen();
  gameIsLost = false;
  gameStart = false; // game is paused
  snakeTail = []; // reset snake
  gameSpeed = 7;
  snakeSpeed = { x: 0, y: 0 }; // initialize snake speed
  score = 0;

  for (let i = 0; i < snakeTailLength; i++) {
    let position = {
      x: Math.floor(tileNumber / 2),
      y: Math.floor(tileNumber / 2),
    };
    snakeTail.unshift(position);
  }
  spawnFood(snakeTail[snakeTail.length - 1]);

  document.getElementsByClassName("current-score")[0].innerHTML = "00";
}

// creates the food position
function spawnFood(newHeadSnake) {
  let foodIsInSnake = true;
  while (foodIsInSnake) {
    foodIsInSnake = false;
    snakeFoodPosition = {
      x: Math.floor(Math.random() * tileNumber),
      y: Math.floor(Math.random() * tileNumber),
    };

    for (let t = 0; t < snakeTail.length; t++) {
      let tile = snakeTail[t];
      // if food is in a tile which the snake occupies
      if (tile.x == snakeFoodPosition.x && tile.y == snakeFoodPosition.y) {
        foodIsInSnake = true;
        break;
      }
    }
  }
}

function scoreCounter() {
  score = parseInt(
    document.getElementsByClassName("current-score")[0].innerHTML
  );
  score = score + 5;

  if (score < 10) {
    score = "0" + score;
  }

  if (score % 30 == 0) {
    if (score < 150) {
      gameSpeed++;
    } else {
      gameSpeed = gameSpeed + 2;
    }
  }
  document.getElementsByClassName("current-score")[0].innerHTML = score;
}

function highScoreCounter() {
  if (gameIsLost && highScore < score) {
    highScore = score;
  }
  document.getElementsByClassName("highest-score")[0].innerHTML = highScore;
}

function gameOver() {
  if (gameIsLost) {
    ctx.fillStyle = "#181825";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = `${(48/500)*canvas.width}px 'Amatic SC', cursive, sans-serif`;
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText(`GAME OVER`, canvas.width/2, canvas.height/4);

    ctx.font = `${(30/500)*canvas.width}px 'Amatic SC', cursive, sans-serif`;
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText(`Your Score: ${parseInt(score)}`, canvas.width/2, canvas.height/2.4);

    ctx.font = `${(30/500)*canvas.width}px 'Amatic SC', cursive, sans-serif`;
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText(`Your Highest Score was: ${parseInt(highScore)}`, canvas.width/2, canvas.height/2);
  }
}

document.getElementById("restart").onclick = function(){
    resetGame();
}

function underworldSnakeGame() {
  if (!gameIsLost) {
    removeTail = true;
    clearScreen();
    checkCollision();
    drawSnake();
    drawFood();
  } else {
    gameOver();
    highScoreCounter();
  }

  setTimeout(underworldSnakeGame, 1000 / gameSpeed);
}

resetGame();
underworldSnakeGame();
