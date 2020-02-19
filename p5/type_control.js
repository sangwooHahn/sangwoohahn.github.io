var point_size = 0;
var fontSize = 1;
var arcSize = 20;
var fat = 22;
var tall = 60;
var strokeW = 1;
var space = 0;
var nextLetter = 1;
var eVersion = 0;
var eSize = 4;
var backColor;
var backColor_hue = 50;
var tilt = 0;

function control_bar() {
  title_input = createInput('Text');
  randomButton = createButton('Random');
  randomButton.mousePressed(randomValue);
  randomButton = createButton('Save');
  randomButton.mousePressed(SaveImage);
  createElement('div', 'Font scale');
  fontSize_slider = createSlider(1, 50, 10);
  createElement('div', 'Width');
  fat_slider = createSlider(2, 70, 30);
  createElement('div', 'Height');
  tall_slider = createSlider(2, 200, 60);
  createElement('div', 'Weight');
  strokeW_slider = createSlider(1, 100, 3);
  createElement('div', 'Space');
  space_slider = createSlider(0, 50, 10);
  createElement('div', 'Arc scale');
  arcSize_slider = createSlider(0, 80, 20);
  createElement('div', 'Point scale');
  eSize_slider = createSlider(0, 20, 8);
  createElement('div', 'Point type');
  eVersion_slider = createSlider(0, 4, 1);
  createElement('div', 'Tilt');
  tilt_slider = createSlider(-2*PI, 2*PI, 0);
  createElement('div', 'Color');
  backColor_hue_slider = createSlider(0, 100, 50);
}

function control_value() {
  fontSize = fontSize_slider.value()*0.1;
  fat = fat_slider.value()*fontSize;
  tall = tall_slider.value()*fontSize;
  arcSize = arcSize_slider.value()*fontSize;
  eSize = eSize_slider.value()*fontSize;
  eVersion = eVersion_slider.value();
  tilt = tilt_slider.value()*0.1;
  strokeW = strokeW_slider.value();
  space = space_slider.value()*fontSize;
  backColor_hue = backColor_hue_slider.value();
}

function randomValue() {
  fontSize_slider.value(random(1,15));
  fat_slider.value(random(2,60));
  tall_slider.value(random(2, 200));
  strokeW_slider.value(random(1, 10));
  space_slider.value(random(0, 50));
  arcSize_slider.value(random(0, 80));
  eSize_slider.value(random(0, 20));
  eVersion_slider.value(random(0, 4));
  tilt_slider.value(random(-PI, PI));
  backColor_hue_slider.value(random(0, 100));
}

function SaveImage() {
  saveCanvas(canvas, 'Poster_generator', 'jpg');
}


function typing (key,x,y) {
  if (key == 'a' || key == 'A') {
    drawA (x,y);
    
  }
  if (key == 'b' || key == 'B') {
    drawB (x,y);
    
  }
  if (key == 'c' || key == 'C') {
    drawC (x,y);
    
  }
  if (key == 'd' || key == 'D') {
    drawD (x,y);
    
  }
  if (key == 'e' || key == 'E') {
    drawE (x,y);
    
  }
  if (key == 'f' || key == 'F') {
    drawF (x,y);
    
  }
  if (key == 'g' || key == 'G') {
    drawG (x,y);
    
  }
  if (key == 'h' || key == 'H') {
    drawH (x,y);
    
  }
  if (key == 'i' || key == 'I') {
    drawI (x,y);
    
  }
  if (key == 'j' || key == 'J') {
    drawJ (x,y);
    
  }
  if (key == 'k' || key == 'K') {
    drawK (x,y);
    
  }
  if (key == 'l' || key == 'L') {
    drawL (x,y);
    
  }
  if (key == 'm' || key == 'M') {
    drawM (x,y);
    
  }
  if (key == 'n' || key == 'N') {
    drawN (x,y);
    
  }
  if (key == 'o' || key == 'O') {
    drawO (x,y);
    
  }
  if (key == 'p' || key == 'P') {
    drawP (x,y);
    
  }
  if (key == 'q' || key == 'Q') {
    drawQ (x,y);
    
  }
  if (key == 'r' || key == 'R') {
    drawR (x,y);
    
  }
  if (key == 's' || key == 'S') {
    drawS (x,y);
    
  }
  if (key == 't' || key == 'T') {
    drawT (x,y);
    
  }
  if (key == 'u' || key == 'U') {
    drawU (x,y);
    
  }
  if (key == 'v' || key == 'V') {
    drawV (x,y);
    
  }
  if (key == 'w' || key == 'W') {
    drawW (x,y);
    
  }
  if (key == 'x' || key == 'X') {
    drawX (x,y);
    
  }
  if (key == 'y' || key == 'Y') {
    drawY (x,y);
    
  }
  if (key == 'z' || key == 'Z') {
    drawZ (x,y);
    
  }
  if (key == '.') {
   drawDot (x,y);
   
   }
   if (key == '?') {
   drawQu (x,y);
   
   }
   if (key == '!') {
   drawEx (x,y);
   
   }
   if (key == '"') {
   drawD_Quot (x,y);
   
   }
}
