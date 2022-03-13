/*jshint esversion: 6 */
const socialLinks = document.getElementById('social-links').getElementsByTagName("a");
let red = 0;
let green = 0;
let blue = 0;

randomRGBColors();

for(let a = 0; a < socialLinks.length; a++){
    socialLinks[a].addEventListener("mouseover", function(e){
      e.target.style.color = `rgb(${red}, ${green}, ${blue})`;
      e.target.style.textShadow = `8px 0px 20px rgb(${red}, ${green}, ${blue})`;
      randomRGBColors()
    }, false);
    socialLinks[a].addEventListener("mouseout", function(e){
        e.target.style.color = "";
        e.target.style.textShadow = "";
    }, false);
}

function randomRGBColors() {
    let baseColors = ['r', 'g', 'b'];
    let baseColor = baseColors[Math.floor(Math.random()*3)];
    if(baseColor == 'r'){
        red = 255;
        green = Math.floor(Math.random()*250); // green value
        blue = Math.floor(Math.random()*80); // blue value
    }
    else if(baseColor == 'g'){
        red = Math.floor(Math.random()*80); // red value
        green = 255; // green value
        blue = Math.floor(Math.random()*80); // blue value
    }
    else if(baseColor == 'b'){
        red = Math.floor(Math.random()*80); // red value
        green = Math.floor(Math.random()*80); // green value
        blue = 255; // blue value
    }
}