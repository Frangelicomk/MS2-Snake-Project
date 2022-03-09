let canvas = document.getElementById('underworld-bg');
let ctx = canvas.getContext('2d');
const tileNumber = 24;
const tileSize = canvas.width/tileNumber;
let gameSpeed = 10; // this is the speed the game goes.
let snakeTailLength = 1; // initial length of the snake
let snakeTail; // snake positions
let snakeSpeed;
let snakeFoodPosition;
let removeTail = true;
let gameStart;
let gameIsLost = false;

/**
 * Setting up the canvas
 */
function clearScreen(){ //clears the screen
    ctx.fillStyle = '#09243a'
    ctx.fillRect(0,0,canvas.width,canvas.height)
}

// this function draws the food
function drawFood(){
    ctx.fillStyle = '#ca786f';
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
    
    ctx.fillStyle = '#fbfaf1';
    
    for(let i = 0; i < snakeTail.length; i++){
        ctx.fillRect(snakeTail[(snakeTail.length-i)-1].x*tileSize, snakeTail[(snakeTail.length-i)-1].y*tileSize, tileSize, tileSize);
    }
}

document.addEventListener('keydown', keyEventPress);

// This function controls the movement of the snake
function keyEventPress(e){
    if(e.keyCode === 37){
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
    gameStart = true; // game is paused
    snakeTail = []; // reset snake
    snakeSpeed = {x:-1,y:0}; // initialize snake speed
    // snakeFoodPosition = {x:Math.floor(Math.random()*tileNumber), y:Math.floor(Math.random()*tileNumber)};
    
    for(let i = 0; i < snakeTailLength; i++){
        let position = {x:Math.floor(tileNumber/2), y:Math.floor(tileNumber/2)};
        snakeTail.unshift(position);
    }



    spawnFood(snakeTail[snakeTail.length - 1]);

    document.getElementById("game-status").innerHTML = "";
}

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

function underworldSnakeGame(){
    if(!gameIsLost){
        removeTail = true;
        clearScreen();
        checkCollision();
        drawSnake();
        drawFood();
    }
    else {
        document.getElementById("game-status").innerHTML = "Game Over: Press any key to start!"
    }
        
    
    setTimeout(underworldSnakeGame, 1000/gameSpeed)
}

resetGame();
underworldSnakeGame();

