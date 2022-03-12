/*jshint esversion: 6 */
const canvas = document.getElementById("underworld-bg");
let ctx = canvas.getContext("2d");
let tileNumber = 20;
let tileSize = canvas.width / tileNumber;
let gameSpeed; // this is the speed the game goes.
let snakeTailLength = 2; // initial length of the snake
let snakeTail; // snake positions
let snakeDirection;
let snakeFoodPosition;
let removeTail = true;
let gameStart;
let gameIsLost;
let score; // score counter
let highScore = 0; // highscore record
let isMobile = false;
let joy;
let r = 0;
let g = 0;
let b = 0;
let isFirstMove = true;
let directions = {
  3: { x: -1, y: 0 },
  0: { x: 0, y: -1 },
  1: { x: 1, y: 0 },
  2: { x: 0, y: 1 },
  "-1": { x: 0, y: 0 },
};

const upAudio = document.getElementById("upAudio");
const downAudio = document.getElementById("downAudio");
const leftAudio = document.getElementById("leftAudio");
const rightAudio = document.getElementById("rightAudio");
const eatFoodAudio = document.getElementById("eatFoodAudio");
const dieAudio = document.getElementById("dieAudio");

if (
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  ) ||
  window.innerWidth < 768
) {
  isMobile = true;
}

if (isMobile) {
  document.getElementById("joyDiv").style.display = "block";
  // this was copied from https://www.cssscript.com/onscreen-joystick/#:~:text=Description%3A-,JoyStick.,for%20your%20game%20web%20app with Author bobbotech
  // loads the joystick
  joy = new JoyStick("joyDiv", {
    // The ID of canvas element
    title: "joystick",
    // width/height
    width: undefined,
    height: undefined,
    // Internal color of Stick
    internalFillColor: "rgba(255,255,255,1 )",
    // Border width of Stick
    internalLineWidth: 2,
    // Border color of Stick
    internalStrokeColor: "rgba(255,255,255,1 )",
    // External reference circonference width
    externalLineWidth: 2,
    //External reference circonference color
    externalStrokeColor: "rgba(255,255,255,1 )",
    // Sets the behavior of the stick
    autoReturnToCenter: true,
  });
}

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
  if (window.innerHeight < 725) {
    canvas.width = window.innerHeight - 225;
    canvas.height = window.innerHeight - 225;
  }
  if (window.innerWidth < 565) {
    canvas.width = window.innerWidth - 65;
    canvas.height = window.innerWidth - 65;
  }

  if (window.innerWidth >= 550 && window.innerHeight >= 725) {
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

function randomFoodRGB() {
  let baseColors = ["r", "g", "b"];
  let baseColor = baseColors[Math.floor(Math.random() * 3)];
  if (baseColor == "r") {
    r = 255;
    g = Math.floor(Math.random() * 250); // fruid red value
    b = Math.floor(Math.random() * 80); // fruit green value
  } else if (baseColor == "g") {
    r = Math.floor(Math.random() * 80); // fruid red value
    g = 255;
    b = Math.floor(Math.random() * 80); // fruit green value
  } else if (baseColor == "b") {
    r = Math.floor(Math.random() * 80); // fruid red value
    g = Math.floor(Math.random() * 80); // fruit green value
    b = 255;
  }
}

// this function draws the food
function drawFood() {
  ctx.fillStyle = `rgb(${r}, ${g},${b})`;
  ctx.shadowBlur = 30;
  ctx.shadowColor = `rgba(${r},${g},${b},1 )`; // I got the design idea from https://codepen.io/fariati
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
    x: snakeTail[snakeTail.length - 1].x + directions[snakeDirection].x,
    y: snakeTail[snakeTail.length - 1].y + directions[snakeDirection].y,
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

// Directions
//     0
//   3   1
//     2
// This function controls the movement of the snake
function keyEventPress(e) {
  isFirstMove = false;

  switch (e.keyCode) {
    case 37:
      if (snakeDirection != 1) {
        snakeDirection = 3;
        leftAudio.play();
      }
      break;
    case 38:
      if (snakeDirection != 2) {
        snakeDirection = 0;
        upAudio.play();
      }
      break;
    case 39:
      if (snakeDirection != 3) {
        snakeDirection = 1;
        rightAudio.play();
      }
      break;
    case 40:
      if (snakeDirection != 0) {
        snakeDirection = 2;
        downAudio.play();
      }
      break;
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

function joystickPlay() {
  if (isMobile) {
    var x = joy.GetX();
    var y = joy.GetY();
    let sensitivity = 95;

    switch (true) {
      case x <= -sensitivity && x >= -100:
        if (snakeDirection != 1) {
          snakeDirection = 3;
          leftAudio.play();
        }
        break;
      case y >= sensitivity && y <= 100:
        if (snakeDirection != 2) {
          snakeDirection = 0;
          upAudio.play();
        }
        break;
      case x >= sensitivity && x <= 100:
        if (snakeDirection != 3) {
          snakeDirection = 1;
          rightAudio.play();
        }
        break;
      case y <= -sensitivity && y >= -100:
        if (snakeDirection != 0) {
          snakeDirection = 2;
          downAudio.play();
        }
        break;
    }

    if (
      (x <= -sensitivity && x >= -100) ||
      (y >= sensitivity && y <= 100) ||
      (x >= sensitivity && x <= 100) ||
      (y <= -sensitivity && y >= -100)
    ) {
      gameStart = true;
    }
  }
}

// This function will make the snake eat the food and also check if GAME OVER due to collision with tail
function checkCollision() {
  let newHeadSnake = {
    x: snakeTail[snakeTail.length - 1].x + directions[snakeDirection].x,
    y: snakeTail[snakeTail.length - 1].y + directions[snakeDirection].y,
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

    eatFoodAudio.play();
    navigator.vibrate(200); // vibrate for 200ms

    removeTail = false; // don't remove tail to increase the snake by one block
  }
  // if snake hit itself, GAME OVER
  else if (snakeTail.length >= snakeTailLength && gameStart) {
    for (let t = 0; t < snakeTail.length; t++) {
      let tail = snakeTail[t];
      if (tail.x == newHeadSnake.x && tail.y == newHeadSnake.y) {
        gameIsLost = true;
        dieAudio.play();
        navigator.vibrate(300);
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
  snakeDirection = -1; // initialize snake speed
  prevSnakeDirection = -1;
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

    randomFoodRGB();

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
    ctx.shadowColor = "rgba(0,0,0,1)";
    ctx.font = `${
      (48 / 500) * canvas.width
    }px 'Amatic SC', cursive, sans-serif`;
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText(
      `GAME OVER ${userName.toUpperCase()}`,
      canvas.width / 2,
      canvas.height / 4
    );

    ctx.font = `${
      (36 / 500) * canvas.width
    }px 'Amatic SC', cursive, sans-serif`;
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText(
      `Your Score: ${parseInt(score)}`,
      canvas.width / 2,
      canvas.height / 2.4
    );

    ctx.font = `${
      (36 / 500) * canvas.width
    }px 'Amatic SC', cursive, sans-serif`;
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText(
      `Your Highest Score was: ${parseInt(highScore)}`,
      canvas.width / 2,
      canvas.height / 2
    );
  }
}

document.getElementById("restart").onclick = function () {
  resetGame();
};

function underworldSnakeGame() {
  if (!gameIsLost) {
    removeTail = true;
    isFirstMove = true;
    joystickPlay();
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
