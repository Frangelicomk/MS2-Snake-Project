let canvas = document.getElementById('underworld-bg');
let ctx = canvas.getContext('2d');
const tileNumber = 34;
const tileSize = canvas.width/tileNumber;
let gameSpeed = 10; // this is the speed the game goes.
let snakePosition = {x:Math.floor(tileNumber/2), y:Math.floor(tileNumber/2)};
let snakeSpeed = {x:0,y:0};

/**
 * Setting up the canvas
 */
function clearScreen(){ //clears the screen
    ctx.fillStyle = '#09243a'
    ctx.fillRect(0,0,canvas.width,canvas.height)

}

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

function keyEventPress(e){
    if(e.keyCode === 37){
        snakeSpeed = {x:-1, y:0}
    } else if(e.keyCode === 38){
        snakeSpeed = {x:0, y:-1}
    } else if(e.keyCode === 39){
        snakeSpeed = {x:1, y:0}
    } else if(e.keyCode === 40){
        snakeSpeed = {x:0, y:1}
    }
    console.log(e.keyCode);
}

function underworldSnakeGame(){
    clearScreen();
    drawSnake();
    setTimeout(underworldSnakeGame, 1000/gameSpeed)

}

underworldSnakeGame();
