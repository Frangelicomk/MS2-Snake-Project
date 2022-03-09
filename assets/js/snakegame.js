const canvas = document.getElementById('underworld-bg');
let ctx = canvas.getContext('2d');
const tileNumber = 20;
const tileSize = canvas.width/tileNumber;
let gameSpeed; // this is the speed the game goes.
let snakeTailLength = 1; // initial length of the snake
let snakeTail; // snake positions
let snakeSpeed;
let snakeFoodPosition;
let removeTail = true;
let gameStart;
let gameIsLost = false;
let score; // score counter
let highScore = 0; // highscore record

/**
 * Setting up the canvas
 */
function clearScreen(){ //clears the screen
    ctx.fillStyle = '#181825'
    ctx.fillRect(0,0,canvas.width,canvas.height);

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
function drawFood(){
    ctx.fillStyle = 'blue';
    ctx.shadowBlur = 20;
    ctx.shadowColor = "rgba(0,0,255,1 )"; // I got the design idea from https://codepen.io/fariati
    ctx.fillRect(snakeFoodPosition.x*tileSize, snakeFoodPosition.y*tileSize, tileSize, tileSize)
}

// this function draws the snake
function drawSnake(){

    // update position of the snake head
    let newHeadSnake = {x: snakeTail[snakeTail.length-1].x + snakeSpeed.x, y: snakeTail[snakeTail.length-1].y + snakeSpeed.y};

    snakeTail.push(newHeadSnake);
    if(removeTail){  //checks if the tail should be removed
        snakeTail.shift(); // remove last tail block
    }

    if(newHeadSnake.x === tileNumber){
        newHeadSnake.x = 0;
    } else if (newHeadSnake.x === -1){
        newHeadSnake.x = tileNumber;
    }

    if(newHeadSnake.y === tileNumber){
        newHeadSnake.y = 0;
    } else if (newHeadSnake.y === -1){
        newHeadSnake.y = tileNumber;
    }
    
    ctx.fillStyle = "rgba(255,255,255,1 )";
    
    ctx.shadowBlur = 20;
    ctx.shadowColor = "rgba(255,255,255,.3 )";
    ctx.fillRect(snakeTail[(snakeTail.length)-1].x*tileSize, snakeTail[(snakeTail.length)-1].y*tileSize, tileSize, tileSize);
    ctx.shadowBlur = 0;

    for(let i = 0; i < snakeTail.length; i++){
        ctx.lineWidth = 2; // I got the design idea from https://codepen.io/fariati
        ctx.fillStyle = "rgba(255,255,255,.85 )";
        ctx.fillRect(snakeTail[(snakeTail.length-i)-1].x*tileSize, snakeTail[(snakeTail.length-i)-1].y*tileSize, tileSize, tileSize);
    }
}

document.addEventListener('keydown', keyEventPress);

// This function controls the movement of the snake
function keyEventPress(e){
    if(e.keyCode === 37 ){
        if(snakeSpeed.x !== 1){
        snakeSpeed = {x:-1, y:0}
        } else console.log("Error, you can not go  left while going right")
        
    } else if(e.keyCode === 38){
        if(snakeSpeed.y !== 1){
            snakeSpeed = {x:0, y:-1}
        } else console.log("Error, you can not go up while going down")
        
    } else if(e.keyCode === 39){
        
        if(snakeSpeed.x !== -1){
            snakeSpeed = {x:1, y:0}
        } else console.log("Error, you can not go right while going left")
    } else if(e.keyCode === 40){
        if(snakeSpeed.y !== -1){
            snakeSpeed = {x:0, y:1}
        } else console.log("Error, you can not go down while going up")
    }

    if(e.keyCode === 37 || e.keyCode === 38 || e.keyCode === 39 || e.keyCode === 40){
        gameStart = true;
    }

    if(e.keyCode === 32){
        if(!gameIsLost){
            gameStart = true;
        }
        else{
            gameIsLost = false;
            resetGame();
        }
    }

}


// This function will make the snake eat the food and also check if GAME OVER due to collision with tail
function checkCollision(){
    let newHeadSnake = {x: snakeTail[snakeTail.length-1].x + snakeSpeed.x, y: snakeTail[snakeTail.length-1].y + snakeSpeed.y};
    
    // if snake ate the food, create a new position for the food
    if(snakeFoodPosition.x === newHeadSnake.x && snakeFoodPosition.y === newHeadSnake.y){
        
        spawnFood(newHeadSnake);
        
        scoreCounter();

        removeTail = false; // don't remove tail to increase the snake by one block
    }
    // if snake hit itself, GAME OVER
    else if(snakeTail.length >= snakeTailLength && gameStart){
        for(let t = 0; t < snakeTail.length; t++){
            let tail = snakeTail[t];
            if(tail.x == newHeadSnake.x && tail.y == newHeadSnake.y){
                gameIsLost = true;
                break;
            }
        }
    }
    
}

function resetGame(){
    clearScreen();
    gameStart = false ; // game is paused
    snakeTail = []; // reset snake
    gameSpeed = 7;
    snakeSpeed = {x:0,y:0}; // initialize snake speed
    score = 0;
    
    for(let i = 0; i < snakeTailLength; i++){
        let position = {x:Math.floor(tileNumber/2), y:Math.floor(tileNumber/2)};
        snakeTail.unshift(position);
    }
    spawnFood(snakeTail[snakeTail.length - 1]);

    document.getElementById("game-status").innerHTML = "";
    document.getElementsByClassName('current-score')[0].innerHTML = '00';
}

// creates the food position
function spawnFood(newHeadSnake){

    let foodIsInSnake = true;
    while(foodIsInSnake)
    {
        foodIsInSnake = false;
        snakeFoodPosition = {x:Math.floor(Math.random()*tileNumber), y:Math.floor(Math.random()*tileNumber)};

        for(let t = 0; t < snakeTail.length; t++){
            let tile = snakeTail[t];
            // if food is in a tile which the snake occupies
            if(tile.x == snakeFoodPosition.x && tile.y == snakeFoodPosition.y){
                foodIsInSnake = true;
                break;
            }
        }
    }
}

function scoreCounter(){
    score = parseInt(document.getElementsByClassName('current-score')[0].innerHTML);
    score = score + 5;

    if(score < 10){
        score = '0' + score;
    }

    if(score % 30 == 0){
        if(score < 150){
            gameSpeed++;
        }
        else{
            gameSpeed = gameSpeed + 2;
        }
    }

    console.log(gameSpeed)

    document.getElementsByClassName('current-score')[0].innerHTML = score;
}

function highScoreCounter(){
    if(gameIsLost && highScore < score){
        highScore = score;
    }
    document.getElementsByClassName('highest-score')[0].innerHTML = highScore;
}

function underworldSnakeGame(){
    if(!gameIsLost){
        removeTail = true;
        clearScreen();
        checkCollision();
        drawSnake();
        drawFood();
    }
    else {
        highScoreCounter();
        document.getElementById("game-status").innerHTML = "Game Over: Press SPACE to re-start!"
    }
        
    
    setTimeout(underworldSnakeGame, 1000/gameSpeed)
}

resetGame();
underworldSnakeGame();

