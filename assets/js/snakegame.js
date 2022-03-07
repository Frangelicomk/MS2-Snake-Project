let canvas = document.getElementById('underworld-bg');
let ctx = canvas.getContext('2d');
const tileNumber = 34;
const tileSize = canvas.width/tileNumber;
let gameSpeed = 10; // this is the speed the game goes.
let snakePosition = {x:Math.floor(tileNumber/2), y:Math.floor(tileNumber/2)};
let snakeSpeed = {x:0,y:0};
let snakeFoodPosition = {x:3, y:5};


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
    snakePosition = {x:snakePosition.x + snakeSpeed.x, y:snakePosition.y + snakeSpeed.y}
    if(snakePosition.x === tileNumber){
        snakePosition.x = 0;
    } else if (snakePosition.x === -1){
        snakePosition.x = tileNumber;
    }

    if(snakePosition.y === tileNumber){
        snakePosition.y = 0;
    } else if (snakePosition.y === -1){
        snakePosition.y = tileNumber;
    }
    ctx.fillStyle = '#fbfaf1'
    ctx.fillRect(snakePosition.x*tileSize, snakePosition.y*tileSize, tileSize, tileSize)
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

}

// This function will make the snake eat the food
function checkCollision(){
    if(snakeFoodPosition.x === snakePosition.x && snakeFoodPosition.y === snakePosition.y){
        snakeFoodPosition = {x:Math.floor(Math.random()*tileNumber), y:Math.floor(Math.random()*tileNumber)}
    }
}

function underworldSnakeGame(){
    clearScreen();
    checkCollision();
    drawSnake();
    drawFood();
    setTimeout(underworldSnakeGame, 1000/gameSpeed)

}

underworldSnakeGame();
