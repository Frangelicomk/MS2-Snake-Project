/*jshint esversion: 6 */
const canvas = document.getElementById("underworld-bg"); //targeting the canvas area
let ctx = canvas.getContext("2d"); //draw the canvas in 2D
let tileNumber = 20; // tiles drawn in height and width
let tileSize = canvas.width / tileNumber; // the tile size in pixels
let gameSpeed; // this is the speed the game goes.
let snakeTailLength = 2; // initial length of the snake
let snakeTail; // all the tiles the snake occupies at all times
let snakeDirection; // the direction the snake moves
let snakeFoodPosition; // the tile the food spawns
let removeTail = true; // True when you eat the food and false when you move. Only applies when shifting the snakeTail array.
let gameStart; //game Start
let gameIsLost; //GAME OVER
let score; // score counter
let highScore = 0; // highscore record
let isMobile = false; //validates whether the user opens the app in a mobile device.
let joy; // Joystick used only when the user is on a mobile device
let r = 0; // red color from RGB wheel
let g = 0; // green color from RGB wheel
let b = 0; // blue color from RGB wheel

let directions = {
  3: { x: -1, y: 0 }, // left
  0: { x: 0, y: -1 }, // up
  1: { x: 1, y: 0 }, // right
  2: { x: 0, y: 1 }, // down
  "-1": { x: 0, y: 0 }, // starting point
};

/**
 * These are all the sound variables used for the game
 */
const upAudio = document.getElementById("upAudio");
const downAudio = document.getElementById("downAudio");
const leftAudio = document.getElementById("leftAudio");
const rightAudio = document.getElementById("rightAudio");
const eatFoodAudio = document.getElementById("eatFoodAudio");
const dieAudio = document.getElementById("dieAudio");

/**The following 2 if statements are checking if the user opens the game in a mobile device and if so a joystick appears */
if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 76) {
  isMobile = true;
}

if (isMobile) {
  document.getElementById("joyDiv").style.display = "block";
  // this was copied from https://www.cssscript.com/onscreen-joystick/#:~:text=Description%3A-,JoyStick.,for%20your%20game%20web%20app with Author bobbotech
  // creats the joystick
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

// set canvas size after screen loads
window.addEventListener(
  "load",
  function () {
    setCanvasSize();
  },
  false
);

// set canvas size on screen resize
window.addEventListener(
  "resize",
  function () {
    setCanvasSize();
  },
  false
);

// set canvas size on phone rotation
window.addEventListener(
  "orientationchange",
  function () {
    setCanvasSize();
  },
  false
);

/**
 * Setting up the canvas
 */
function setCanvasSize() {
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
  tileSize = canvas.width / tileNumber; // width & height of each tile in pixels
}

/** This function initializes the grid on the canvas */
function clearScreen() {
  //clears the screen
  ctx.fillStyle = "#181825";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // I got the design idea from https://codepen.io/fariati

  // Draw the grid
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

/**
 * The function will change the color of the food each time the snake eats food or each time we restart the game
 */
function randomFoodRGB() {
  let baseColors = ["r", "g", "b"];
  let baseColor = baseColors[Math.floor(Math.random() * 3)];
  if (baseColor == "r") {
    r = 255;
    g = Math.floor(Math.random() * 250); // fruit random green value
    b = Math.floor(Math.random() * 80); // fruit random blue value
  } else if (baseColor == "g") {
    r = Math.floor(Math.random() * 80); // fruit random red value
    g = 255;
    b = Math.floor(Math.random() * 80); // fruit random blue value
  } else if (baseColor == "b") {
    r = Math.floor(Math.random() * 80); // fruit random red values
    g = Math.floor(Math.random() * 80); // fruit random green value
    b = 255;
  }
}

/**
 * this function draws the food with random colors
 * CTX properties seen from https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API
 */
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

/**
 * This function allows the snake to pass through the walls from one side to an other.
 * @param {object} newHeadSnake A parameter representing the X and Y position of the snake head when the HEAD is drawn
 */
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

  // Draw the head of the snake with glowing effect on the canvas
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

  // draw the tail of the snake (without the head) on the canvas
  for (let i = 0; i < snakeTail.length - 1; i++) {
    // I got the design idea from https://codepen.io/fariati
    ctx.lineWidth = 2; // border
    ctx.fillStyle = "rgba(255,255,255,.85 )";
    ctx.fillRect(
      snakeTail[snakeTail.length - i - 1].x * tileSize,
      snakeTail[snakeTail.length - i - 1].y * tileSize,
      tileSize,
      tileSize
    );
  }
}

// Event listener when the user presses a key.
document.addEventListener("keydown", keyEventPress);

// Directions
//     0
//   3 -1 1
//     2
// This function controls the movement of the snake
function keyEventPress(e) {
  switch (e.keyCode) {
    case 37: // user pressed the left arrow key
      if (snakeDirection != 1) {
        // if previous movement is not right
        snakeDirection = 3;
        leftAudio.play();
      }
      break;
    case 38: // user pressed the up arrow key
      if (snakeDirection != 2) {
        // if previous movement is not down
        snakeDirection = 0;
        upAudio.play();
      }
      break;
    case 39: // user pressed the right arrow key
      if (snakeDirection != 3) {
        // if previous movement is not left
        snakeDirection = 1;
        rightAudio.play();
      }
      break;
    case 40: // user pressed the down arrow key
      if (snakeDirection != 0) {
        // if previous movement is not up
        snakeDirection = 2;
        downAudio.play();
      }
      break;
  }

  // make the snake to start moving at the selected direction by the user
  if (
    e.keyCode === 37 ||
    e.keyCode === 38 ||
    e.keyCode === 39 ||
    e.keyCode === 40
  ) {
    gameStart = true;
  }
}

/**
 * The idea waws implemented from https://www.cssscript.com/onscreen-joystick/#:~:text=Description%3A-,JoyStick.,for%20your%20game%20web%20app with Author bobbotech
 * Creates the joystick and I have altered the properties of this function and created new variables to meet my projects needs.
 * This function will be called up only if the browser detects that the user opened the game in a mobile device. This is checked by user.Agent
 */
function joystickPlay() {
  if (isMobile) {
    let x = joy.GetX(); // x position of the joystick (-100 = left, 100 = right)
    let y = joy.GetY(); // y position of the joystick (100 = up, -100 = down)
    let sensitivity = 95; // how far (upwards, downwards, left or right) to slide the joystick to make the move

    switch (true) {
      case x <= -sensitivity && x >= -100: // user moved the joystick to the left
        if (snakeDirection != 1) {
          // if previous movement is not right
          snakeDirection = 3;
          leftAudio.play();
        }
        break;
      case y >= sensitivity && y <= 100: // user moved the joystick upwards
        if (snakeDirection != 2) {
          // if previous movement is not down
          snakeDirection = 0;
          upAudio.play();
        }
        break;
      case x >= sensitivity && x <= 100: // user moved the joystick to the right
        if (snakeDirection != 3) {
          // if previous movement is not left
          snakeDirection = 1;
          rightAudio.play();
        }
        break;
      case y <= -sensitivity && y >= -100: // user move the joystick downwards
        if (snakeDirection != 0) {
          // if previous movement is not up
          snakeDirection = 2;
          downAudio.play();
        }
        break;
    }

    // make the snake to start moving at the selected direction by the user
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

    updateScore();

    eatFoodAudio.play();

    // navigator.vibrate(200); // vibrate for 200ms

    removeTail = false; // don't remove tail to increase the snake by one block
  }
  // if snake hit itself, GAME OVER
  else if (snakeTail.length >= snakeTailLength && gameStart) {
    for (let t = 0; t < snakeTail.length; t++) {
      let tail = snakeTail[t];
      // if snake head hits the tail
      if (tail.x == newHeadSnake.x && tail.y == newHeadSnake.y) {
        gameIsLost = true;
        dieAudio.play();
        // navigator.vibrate([300, 300]);
        break;
      }
    }
  }
}

/**
 * This function resets the game to its initial state after GAME OVER.
 */
function resetGame() {
  clearScreen();
  gameIsLost = false;
  gameStart = false; // game is paused
  snakeTail = []; // reset snake
  gameSpeed = 8;
  snakeDirection = -1; // initialize snake speed
  score = 0;

  // initialize snake tail
  for (let i = 0; i < snakeTailLength; i++) {
    let position = {
      x: Math.floor(tileNumber / 2),
      y: Math.floor(tileNumber / 2),
    };
    snakeTail.unshift(position);
  }

  // spawn the food
  spawnFood();

  document.getElementsByClassName("current-score")[0].innerHTML = "00";
}

// creates the food position
function spawnFood() {
  let foodIsInSnake = true;
  while (foodIsInSnake) {
    foodIsInSnake = false;

    // randomize food position
    snakeFoodPosition = {
      x: Math.floor(Math.random() * tileNumber),
      y: Math.floor(Math.random() * tileNumber),
    };

    randomFoodRGB(); // randomize food colors

    // check if food has spawed inside the snake tail
    for (let t = 0; t < snakeTail.length; t++) {
      let tile = snakeTail[t];
      // if food is in a tile which the snake occupies
      if (tile.x == snakeFoodPosition.x && tile.y == snakeFoodPosition.y) {
        foodIsInSnake = true; // respawn the food on the next while loop iteration
        break;
      }
    }
  }
}
/**
 * This function increments the score when the snake eats the food
 */
function updateScore() {
  score = parseInt(
    document.getElementsByClassName("current-score")[0].innerHTML
  );
  score = score + 5; // increment score by 10

  // speed up the snake as the score increases
  if (score % 60 == 0) {
    // increment every 6 times the snake eats food
    if (score < 150) {
      // increment the speed by one when score is less than 300
      gameSpeed++;
    } else {
      // increment the speed by 3 when score > 300
      gameSpeed = gameSpeed + 3;
    }
  }
  document.getElementsByClassName("current-score")[0].innerHTML = score;
}

/**
 * This function checks if the highscore is < than the score and updates the highscore as appropriate
 */
function updateHighScore() {
  if (gameIsLost && highScore < score) {
    highScore = score;
  }
  document.getElementsByClassName("highest-score")[0].innerHTML = highScore;
}

/**
 * This Function is called when is GAME OVER and resets the canvas and draws the RESULTS for the USER.
 */
function gameOver() {
  if (gameIsLost) {
    // print in the canvas GAME OVER (user)
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

    // Prints in the canvas the score
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

    // print in the canvas the highest score
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

/**
 * This is the game and the sequence the functions are called each time.
 */
function underworldSnakeGame() {
  if (!gameIsLost) {
    removeTail = true;
    joystickPlay();
    clearScreen();
    checkCollision();
    drawSnake();
    drawFood();
  } else {
    gameOver();
    updateHighScore();
  }

  // run next frame
  setTimeout(underworldSnakeGame, 1000 / gameSpeed);
}


// User presses the restart button
document.getElementById("restart").onclick = function () {
  resetGame();
};

resetGame(); // initialize game
underworldSnakeGame(); // run the game forever
