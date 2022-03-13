/*jshint esversion: 6 */
let i = 0;
let userName = '';
let txt;
let speed = 50; /* The speed/duration of the effect in milliseconds */
let buttonPressed = false;

function typeWriter() {
  if (i < txt.length) {
    document.getElementById("text").innerHTML += txt.charAt(i);
    i++;
    setTimeout(typeWriter, speed);
  }
  else{
    i = 0;
    showMenuButtons();
  }
}
/**
 * This function creates the text for the rules when the user pressed the button READ THE RULES!
 * When the USER reads the rules after a short delay the BUTTON for the GAME to start APPEARS.
 */
function typeRulesWriter() {
  let rulesText = `${userName}, unfortunately you ended up in the Underworld. Where you have taken the form of a soul harvest snake. Consume as many souls as you can
  to avoid me claiming your soul. The rules to survive are quite simple. Use your keyboards arrow keys to control
  the snake. Eat souls that spawn in different positions every time you consume them. Be aware that if you touch any part of
  the snake tail it is GAME OVER for you and I will claim your soul for Eternity. Your score will be based on how many souls you 
  consume. Every time you consume a soul your tail gets bigger. For each 6 souls the snake moves faster, when you reach a score of 150 then the fun will start `;
  if (i < rulesText.length) {
    document.getElementById("rules-text").innerHTML += rulesText.charAt(i);
    i++;
    setTimeout(typeRulesWriter, speed/3);
  }
  else{
    document.getElementById('understand-start-game').style.visibility = 'visible';
  }
  
}

/**
 * The following function makes the menu buttons visible.
 */
function showMenuButtons(){
  menuButtons = document.getElementById('hades-menu');
  menuButtons.style.visibility = 'visible';
}

/**
 * The getUserNameFromInput function simply gets the value of the users input and also validates if the Name has only letters. No spaces allowed either.
 */
function getUserNameFromInput(){
  userName = document.getElementById("username").value;

  if(userName.match(/^[A-Za-z]+$/) ){ // only let you submit a username that includes ONLY letters. found this on ww3resource.com
    document.getElementsByClassName("error")[0].style.display = "none";
    document.getElementById("submitName").style.display = "none";
    document.getElementById("username").style.display = "none";
    txt = `Welcome to the Underworld ${userName}, please get familiar with the rules down here!`;
    typeWriter();
    buttonPressed = true;
  }
  else{
    document.getElementsByClassName("error")[0].style.display = "block";
    document.getElementsByClassName("error")[0].innerHTML = "Declare your Name Human!";
  }

}

// what happens when user presses START GAME
function startGame(){
  loadingMenu = document.getElementsByClassName('main-menu')[0];
  loadingMenu.style.display = 'none';
  rulesArea = document.getElementById('rules-screen');
  rulesArea.style.display = 'none';
  gameArea = document.getElementsByClassName('bg')[0];
  gameArea.style.display = 'block';
}

// what happens when user presses READ THE RULES
function openRules(){
  loadingMenu = document.getElementsByClassName('dialogue')[0];
  loadingMenu.style.display = 'none';
  gameArea = document.getElementsByClassName('bg')[0];
  gameArea.style.display = 'none';
  rulesArea = document.getElementById('rules-screen');
  rulesArea.style.display = 'flex';
}

// what happens wwhen user pressed the button READ THE RULES AGAIN
function backToRules() {
  gameArea = document.getElementsByClassName('bg')[0];
  gameArea.style.display = 'none';
  rulesArea = document.getElementById('rules-screen');
  rulesArea.style.display = 'flex';
  loadingMenu = document.getElementsByClassName('main-menu')[0];
  loadingMenu.style.display = 'block';

}

function submitName(event) {

  if (event.keyCode == 13 && !buttonPressed) {
    getUserNameFromInput();
  }
}

document.addEventListener("keydown", submitName, false);

document.getElementById("submitName").onclick = function () {
  getUserNameFromInput();

};

document.getElementById('understand-start-game').onclick = function () {
  startGame();
};

document.getElementById('start-game').onclick = function () {
  // openRules();
  startGame();
};


document.getElementById('read-rules').onclick = function () {
  openRules();
  setTimeout(typeRulesWriter, 800);
};

document.getElementById('back-to-rules').onclick = function() {
  backToRules();
};

