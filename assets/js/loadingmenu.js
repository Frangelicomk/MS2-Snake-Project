let i = 0;
let userName = "";
let txt;
let rulesText = `Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi
perspiciatis eius debitis eos impedit harum repellendus
reprehenderit aperiam dolore pariatur necessitatibus quia odio
voluptatem rem magni aliquam fugit quaerat, optio cupiditate quis
commodi dolor consequatur maxime. Vitae itaque iste ducimus?`;
/* The text */
let speed = 50; /* The speed/duration of the effect in milliseconds */

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

function typeRulesWriter() {
  if (i < rulesText.length) {
    document.getElementById("rules-text").innerHTML += rulesText.charAt(i);
    i++;
    setTimeout(typeRulesWriter, speed/5);
  }
  else{
    document.getElementById('understand-start-game').style.visibility = 'visible';
  }
  
}


function showMenuButtons(){
  menuButtons = document.getElementById('hades-menu');
  menuButtons.style.visibility = 'visible';
}

function getUserNameFromInput(){
  userName = document.getElementById("username").value;

  if(userName.match(/^[A-Za-z]+$/) ){ // only let you submit a username that includes ONLY letters. found this on ww3resource.com
    document.getElementsByClassName("error")[0].style.display = "none";
    document.getElementById("submitName").style.display = "none";
    document.getElementById("username").style.display = "none";
    txt = `Welcome to the Underworld ${userName}, please get familiar with the rules down here!`;
    typeWriter();
  }
  else{
    document.getElementsByClassName("error")[0].style.display = "block";
    document.getElementsByClassName("error")[0].innerHTML = "Declare your Name Human!";
  }

}

function startGame(){
  loadingMenu = document.getElementsByClassName('main-menu')[0];
  loadingMenu.style.display = 'none';
  gameArea = document.getElementsByClassName('bg')[0];
  gameArea.style.display = 'block';
}

function openRules(){
  rulesArea = document.getElementById('rules-screen');
  rulesArea.style.display = 'flex';
  loadingMenu = document.getElementsByClassName('dialogue')[0];
  loadingMenu.style.display = 'none';
}

function backToRules() {
  gameArea = document.getElementsByClassName('bg')[0];
  gameArea.style.display = 'none';
  rulesArea = document.getElementById('rules-screen');
  rulesArea.style.display = 'flex';
  loadingMenu = document.getElementsByClassName('main-menu')[0];
  loadingMenu.style.display = 'block';

}

function submitName(event) {

  if (event.keyCode == 13) {
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
  startGame();
};


document.getElementById('read-rules').onclick = function () {
  openRules();
  setTimeout(typeRulesWriter, 1000);
};

document.getElementById('back-to-rules').onclick = function() {
  backToRules();
};

