let i = 0;
let userName = "";
let txt;
/* The text */
let speed = 50; /* The speed/duration of the effect in milliseconds */

function typeWriter() {
  if (i < txt.length) {
    document.getElementById("text").innerHTML += txt.charAt(i);
    i++;
    setTimeout(typeWriter, speed);
  }
}

function getUserNameFromInput(){
  userName = document.getElementById("username").value;
    document.getElementById("submitName").style.visibility = "hidden";
    document.getElementById("username").style.visibility = "hidden";
    txt = `Welcome to the Underworld ${userName}, please get familiar with the rules down here!`;
    typeWriter();
}

document.addEventListener("keydown", submitName, false);

function submitName(event) {

  if (event.keyCode == 13) {
    getUserNameFromInput();
  }
}

document.getElementById("submitName").onclick = function () {
  getUserNameFromInput();
};


