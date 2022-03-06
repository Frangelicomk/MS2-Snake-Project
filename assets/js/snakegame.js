let canvas = document.getElementById('underworld-bg');
let ctx = canvas.getContext('2d');
const tileNumber = 20;
const tileSize = canvas.width/tileNumber;
let gameSpeed = 10; // this is the speed the game goes.
let snakePosition = {x:tileNumber/2, y:tileNumber/2};
let snakeSpeed = {x:0,y:0};

/**
 * Setting up the canvas
 */
function gameSetUp(){
    ctx.fillStyle = '#09243a'
    ctx.fillRect(0,0,canvas.width,canvas.height)

}
gameSetUp();

function drawSnake(){
    ctx.fillStyle = '#fbfaf1'
    ctx.fillRect(snakePosition.x*tileSize, snakePosition.y*tileSize, tileSize, tileSize)
    
}

drawSnake();





function underworldSnakeGame(){
    setTimeout(underworldSnakeGame, 1000/gameSpeed)

}