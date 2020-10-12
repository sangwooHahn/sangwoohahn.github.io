/*
2020 Oct 02 – 04

Wacky Photoshop 2.0.0
This sketch is little drawing tool.
Create unique image with a variety of wacky brushes!
It's a simple and user-friendly tool, but you can make something weird.

Designed by Sangwoo Hahn

[Key]:
B : brushes list
[, - : decrease the brush size
], + : increase the brush size
O, P : Change Opacity value
`, 1 – 0 : colors
Q,W,E,R,T,Y : brushs
C : clear canvas
S : save drawing (Download)
TAB : open-closed UI


[Changes from last version]:
- twice faster to change the brush size.
- alert before clear
- noise brush changes to outline brush
- notice the shorcut of color on UI
- change brush short-cut to QWERTYUI to find easier (And change order to TextBrush fit on T)
- auto changed color option added to the color (`) short-cut is next of num 1 button
- O, P for changes opacity
- able to close the User Interface
- TAB for open-closed User Interface
- new brush : rotate (y)
- new brush : connect (u)
- new brush : emoji (i)

[Bug Fixed]:
- disable change color and opacity when save, clear button overlaped.(smaller window)
- able to change the value even mouse is out of the opacity box.
- brush list closed after selected.
- brush delay after closed window
- increase type-brush as other brush size
- line brush length also effected by the brush size


##Caution!! Resizing the window will make all the drawings disappear!
*/

let dCanvas;
let interfaceH = 75;
let cbs = 21; //current Brush size;
let ccl = 'yellow'; // current clicked color
let cb = 'ellipse'; //current brush
let bbc = false; // brush button clicked
let cbc = false; // clear button clicked
let obc = false; // opacity button clicked
let uo = true; // UI opend
let countOldPoint = 0;//for connect brush
let oldPointX = [];
let oldPointY = [];
let cd = 0; // zero meas you can draw - there will be value when widow just closed (0.5 sec)
let ca = 255; // current alpha
let forRandomText = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
let cc = { //current color;
  r: 250,
  g: 200,
  b: 40,
  a: 255
}
const button0 = { // brush button
  x: 50,
  y: 0,
  xs: 120,
  ys: 75,
  c: 255
}
const button01 = { // brush button
  name: 'ellipse',
  x: 50,
  y: interfaceH,
  xs: 120,
  ys: 48,
  c: 255
}
const button02 = { // brush button
  name: 'line',
  x: 50,
  y: button01.y + button01.ys,
  xs: 120,
  ys: 48,
  c: 255
}
const button04 = { // brush button
  name: 'outline',
  x: 50,
  y: button02.y + button02.ys,
  xs: 120,
  ys: 48,
  c: 255
}
const button05 = { // brush button
  name: 'cloud',
  x: 50,
  y: button04.y + button04.ys,
  xs: 120,
  ys: 48,
  c: 255
}
const button03 = { // brush button
  name: 'text',
  x: 50,
  y: button05.y + button05.ys,
  xs: 120,
  ys: 48,
  c: 255
}
const button06 = { // brush button
  name: 'rotate',
  x: 50,
  y: button03.y + button03.ys,
  xs: 120,
  ys: 48,
  c: 255
}
const button07 = { // brush button
  name: 'connect',
  x: 50,
  y: button06.y + button06.ys,
  xs: 120,
  ys: 48,
  c: 255
}
const button08 = { // brush button
  name: 'emoji',
  x: 50,
  y: button07.y + button07.ys,
  xs: 120,
  ys: 48,
  c: 255
}
const button1 = { // - button
  x: 180,
  y: 38,
  xs: 40,
  ys: 30,
  c: 255
}
const button2 = { // + button
  x: 260,
  y: 38,
  xs: 40,
  ys: 30,
  c: 255
}
const button3 = { // clear button
  x: 260,
  y: 6,
  xs: 120,
  ys: 30,
  c: 255
}
const button4 = { // save button
  x: 260,
  y: 40,
  xs: 120,
  ys: 30,
  c: 255
}
const button5 = { // clear-clear button
  x: 260,
  y: 6,
  xs: 120,
  ys: 30,
  c: 255
}
const button6 = { // cancel button
  x: 260,
  y: 40,
  xs: 120,
  ys: 30,
  c: 255
}
const button7 = { // UI closed button
  x: 0,
  y: 0,
  xs: 35,
  ys: 75,
  c: 255
}
const colorButton_r = {
  name: 'random',
  x: 360,
  y: interfaceH * 0.5,
  s: 50,
  r: 250,
  g: 200,
  b: 40
}
const colorButton1 = {
  name: 'yellow',
  x: colorButton_r.x + colorButton_r.s + 10,
  y: interfaceH * 0.5,
  s: 50,
  r: 250,
  g: 200,
  b: 40
}
const colorButton2 = {
  name: 'blue',
  x: colorButton1.x + colorButton1.s + 10,
  y: interfaceH * 0.5,
  s: 50,
  r: 40,
  g: 140,
  b: 240
}
const colorButton3 = {
  name: 'pink',
  x: colorButton2.x + colorButton2.s + 10,
  y: interfaceH * 0.5,
  s: 50,
  r: 240,
  g: 40,
  b: 140
}
const colorButton4 = {
  name: 'green',
  x: colorButton3.x + colorButton3.s + 10,
  y: interfaceH * 0.5,
  s: 50,
  r: 80,
  g: 200,
  b: 20
}
const colorButton5 = {
  name: 'cyan',
  x: colorButton4.x + colorButton4.s + 10,
  y: interfaceH * 0.5,
  s: 50,
  r: 40,
  g: 200,
  b: 220
}
const colorButton6 = {
  name: 'orange',
  x: colorButton5.x + colorButton5.s + 10,
  y: interfaceH * 0.5,
  s: 50,
  r: 250,
  g: 120,
  b: 60
}
const colorButton7 = {
  name: 'purple',
  x: colorButton6.x + colorButton6.s + 10,
  y: interfaceH * 0.5,
  s: 50,
  r: 100,
  g: 100,
  b: 240
}
const colorButton8 = {
  name: 'salmon',
  x: colorButton7.x + colorButton7.s + 10,
  y: interfaceH * 0.5,
  s: 50,
  r: 240,
  g: 120,
  b: 120
}
const colorButton9 = {
  name: 'black',
  x: colorButton8.x + colorButton8.s + 10,
  y: interfaceH * 0.5,
  s: 50,
  r: 34,
  g: 34,
  b: 34
}
const colorButton0 = {
  name: 'white',
  x: colorButton9.x + colorButton9.s + 10,
  y: interfaceH * 0.5,
  s: 50,
  r: 255,
  g: 255,
  b: 255
}

function setup() {
  let newCanvas = createCanvas(windowWidth, windowHeight-105);
  dCanvas = createGraphics(windowWidth, windowHeight-105);
  newCanvas.parent("photoshop");
  dCanvas.parent("photoshop");
  dCanvas.clear();

  cursor('none');
}

function draw() {
  background(255); //canvas color
  drawingCanvas();
  // uo = false;
  if (uo) {
    userInterface();
  } else {
    noStroke();
    drawButtons(button7, '›', 0, 30, 0, 220, 230);
  }
  smallText("(TAB)", 17, 64);

  if (cbc)
    alertPopup("Are you sure?");
  if (cd > 0)
    cd--;

  randomColorBrush();
  mouseCursor();
}

function userInterface() {
  //interface frame
  noStroke();
  fill(240);
  rect(0, 0, windowWidth, interfaceH);

  //other buttons
  drawButtons(button0, '', 0, 30, 0, 220, 230);
  drawButtons(button1, '–', 0, 30, 5, 220, 230);
  drawButtons(button2, '+', 0, 30, 5, 220, 230);
  drawButtons(button7, '‹', 0, 30, 0, 220, 230);
  //drawColorButtons(colorButton_r);//it was so annoying with blink color
  drawRandomColorButtons(colorButton_r);
  drawColorButtons(colorButton1);
  drawColorButtons(colorButton2);
  drawColorButtons(colorButton3);
  drawColorButtons(colorButton4)
  drawColorButtons(colorButton5);
  drawColorButtons(colorButton6);
  drawColorButtons(colorButton7);
  drawColorButtons(colorButton8);
  drawColorButtons(colorButton9);
  drawColorButtons(colorButton0);

  // when brush button is clicked show brush option buttons
  if (bbc) {
    noStroke();
    drawButtons(button01, '', 0, 30, 0, 220, 235);
    drawButtons(button02, '', 0, 30, 0, 220, 232);
    drawButtons(button03, '', 0, 30, 0, 220, 235);
    drawButtons(button04, '', 0, 30, 0, 220, 232);
    drawButtons(button05, '', 0, 30, 0, 220, 235);
    drawButtons(button06, '', 0, 30, 0, 220, 232);
    drawButtons(button07, '', 0, 30, 0, 220, 235);
    drawButtons(button08, '', 0, 30, 0, 220, 232);
  }

  //text for buttons info
  bigText("Brush Size", 241, 20);
  bigText("Brush", 110, 20);
  bigText("Opacity", colorButton0.x + colorButton0.s + 47, 20);
  midiumText("(b)", 152, 20);
  midiumText("(o, p)", colorButton0.x + colorButton0.s + 105, 20);
  bigText(Math.ceil(cbs * 0.5), 241, 55);
  smallText("(`)", colorButton_r.x + 23, 64);
  for (let i = 1; i < 10; i++) {
    smallText("(" + i + ")", colorButton1.x + 23 + (i - 1) * 60, 64);
  }
  smallText("(0)", colorButton0.x + 23, 64);

  tinyArrow();

  //gradent box
  gradient(colorButton0.x + colorButton0.s - 5, 38, 30);

  //rect box between save clear button and color button when window small
  noStroke();
  fill(240);
  rect(windowWidth - button3.xs - 20, 0, button3.xs + 20, interfaceH);

  //save and clear buttons
  button3.x = windowWidth - button3.xs - 10;
  button4.x = windowWidth - button4.xs - 10;
  drawButtons(button3, 'Clear (c)', 'red', 15, 5, 220, 230);
  drawButtons(button4, 'Save (s)', 0, 15, 5, 220, 230);

  //randomColor for brush
  brushWhenSelected();
  brushImagesOnList();
}

//random color set
function randomColorBrush() {
  let randomNum = int(random(10));
  // let randombuttonNum = 'colorButton'+str(randomNum);
  switch (randomNum) {
    case 0:
      randomColorChange(colorButton0);
      break;
    case 1:
      randomColorChange(colorButton1);
      break;
    case 2:
      randomColorChange(colorButton2);
      break;
    case 3:
      randomColorChange(colorButton3);
      break;
    case 4:
      randomColorChange(colorButton4);
      break;
    case 5:
      randomColorChange(colorButton5);
      break;
    case 6:
      randomColorChange(colorButton6);
      break;
    case 7:
      randomColorChange(colorButton7);
      break;
    case 8:
      randomColorChange(colorButton8);
      break;
    case 9:
      randomColorChange(colorButton9);
      break;
    default:
      console.log("---");
  }

}

function randomColorChange(object) {
  if (frameCount % 5 == 0) {
    colorButton_r.r = object.r;
    colorButton_r.g = object.g;
    colorButton_r.b = object.b;
  }
  if (ccl == 'random') {
    colorChange(colorButton_r);
  }
}

function drawRandomColorButtons(buttonNum) {
  fill(0);
  ellipse(buttonNum.x, buttonNum.y, buttonNum.s); //background color button

  // fill(255);
  // ellipse(buttonNum.x, buttonNum.y, buttonNum.s*0.4); //background color button

  noStroke();
  // insideRandomButton(colorButton0,1);
  // insideRandomButton(colorButton9,2);
  insideRandomButton(colorButton1, 3);
  insideRandomButton(colorButton2, 4);
  insideRandomButton(colorButton3, 5);
  insideRandomButton(colorButton4, 6);
  insideRandomButton(colorButton5, 7);
  insideRandomButton(colorButton6, 8);
  insideRandomButton(colorButton7, 9);
  insideRandomButton(colorButton8, 10);


  if (mouseOnColorButton(buttonNum)) { // when mouse over, make outline
    stroke(0);
    strokeWeight(1);
  } else noStroke();
  if (ccl == buttonNum.name) {
    stroke(0);
    strokeWeight(1.8);
  }
  noFill();
  ellipse(buttonNum.x, buttonNum.y, buttonNum.s, buttonNum.s); //for draw line over the colors
}

function insideRandomButton(buttonNum, num) {
  push();
  translate(colorButton_r.x, colorButton_r.y);
  rotate(frameCount / 200 * num);
  fill(buttonNum.r, buttonNum.g, buttonNum.b, 220);
  ellipse(colorButton_r.s * 0.25, 0, colorButton_r.s * 0.45, colorButton_r.s * 0.4);
  pop();
}

//cancel alert
function alertPopup(text) {
  noStroke();
  fill(0, 80);
  rect(0, 0, windowWidth, windowHeight-105);
  fill(240);
  button5.x = windowWidth / 2 - button5.xs / 2 - 70;
  button6.x = windowWidth / 2 - button6.xs / 2 + 70;
  button5.y = (windowHeight-105) / 2 + 30;
  button6.y = (windowHeight-105) / 2 + 30;
  rect(windowWidth / 2 - 150, (windowHeight-105) / 2 - 75, 300, 150, 5);
  drawButtons(button5, 'Clear (y)', 'red', 15, 5, 220, 230);
  drawButtons(button6, 'Cancel (n)', 0, 15, 5, 220, 230);
  bigText(text, windowWidth / 2, (windowHeight-105) / 2 - 20);
}

//big h1 text
function bigText(t, x, y) {
  noStroke();
  fill(0);
  textSize(20);
  textStyle(NORMAL);
  textAlign(CENTER);
  textStyle(BOLD);
  text(t, x, y);
}

//midium h2 text
function midiumText(t, x, y) {
  noStroke();
  fill(200);
  textSize(15);
  textStyle(NORMAL);
  text(t, x, y);
}

//small text (for color shor-cut)
function smallText(t, x, y) {
  noStroke();
  fill(200);
  textSize(12);
  textStyle(NORMAL);
  text(t, x, y);
}

//tiny arrow on buttons
function tinyArrow() {
  stroke(0);
  strokeWeight(2);
  if (!bbc) { //when brush button clicked
    if (mouseOnButton(button0)) { // tiny arrow in brush button
      line(140, 52, 145, 55);
      line(145, 55, 150, 52);
    } else {
      line(140, 50, 145, 54);
      line(145, 54, 150, 50);
    }
  } else { //not clicked
    if (mouseOnButton(button0)) { // tiny arrow in brush button
      line(140, 53, 145, 50);
      line(145, 50, 150, 53);
    } else {
      line(140, 54, 145, 52);
      line(145, 52, 150, 54);
    }
  }
}

//brush image on top when selected
function brushWhenSelected() {
  stroke(0);
  strokeWeight(1);
  noFill();
  switch (cb) {
    case 'ellipse':
      ellipse(95, 52, 30, 30);
      break;
    case 'line':
      line(110, 60, 85, 45);
      break;
    case 'text':
      textStyle(NORMAL);
      textAlign(CENTER);
      textSize(30);
      text('T', 95, 52);
      break;
    case 'outline':
      ellipse(95, 52, 30, 30);
      ellipse(95, 52, 15, 15);
      break;
    case 'cloud':
      ellipse(95, 52, 30, 30);
      ellipse(85, 46, 20, 20);
      ellipse(110, 50, 10, 10);
      break;
    case 'rotate':
      line(95, 45, 83, 64);
      line(95, 45, 113, 42);
      break;
    case 'connect':
      line(90, 40, 85, 66);
      line(90, 40, 102, 62);
      line(90, 40, 115, 53);
      break;
    case 'emoji':
      ellipse(88, 51, 6);
      ellipse(102, 51, 6);
      ellipse(95, 52, 30, 30);
      break;
  }
}

//brush image listed down + short-cut text
function brushImagesOnList() {
  if (bbc) {
    ellipse(95, 98, 30, 30);
    line(110, 152, 85, 137);
    ellipse(95, 195, 30, 30);
    ellipse(95, 195, 15, 15);
    ellipse(95, 244, 30, 30);
    ellipse(85, 238, 20, 20);
    ellipse(110, 242, 10, 10);
    textStyle(NORMAL);
    textAlign(CENTER);
    textSize(30);
    text('T', 95, 292);
    line(95, 334, 83, 352);
    line(95, 334, 113, 331);
    line(90, 376, 85, 402);
    line(90, 376, 102, 398);
    line(90, 376, 115, 389);
    ellipse(88, 434, 6);
    ellipse(102, 434, 6);
    ellipse(95, 435, 30, 30);



    //shortcut text for brush list
    noStroke();
    textSize(15);
    fill(0);
    text("(q)", 144, 95);
    text("(w)", 144, 144);
    text("(e)", 144, 193);
    text("(r)", 144, 242);
    text("(t)", 144, 291);
    text("(y)", 144, 339);
    text("(u)", 144, 386);
    text("(i)", 144, 436);
  }
}

//draw grident box
function gradient(x, y, ys) {
  noStroke();
  for (let i = 0; i < 127; i++) {
    fill(0, 0, 0, i * 2);
    rect(x + i, y, 2, ys);
  }

  //gradient outline
  noFill();
  stroke(0);
  strokeWeight(0.2);
  rect(x, y, 127, ys);
  if (mouseX < windowWidth - button3.xs - 20) { //not over the clear button
    if (mouseX >= x && mouseX <= x + 127 && mouseY >= y && mouseY <= y + ys)
      obc = true;
  }

  (mouseIsPressed && obc) ? ca = map(mouseX, x, x + 127, 0, 127) * 2: obc = false;

  if (ca <= 0)
    ca = 0
  if (ca >= 255)
    ca = 255

  //draw line for gradient!!
  stroke(cc.r, cc.g, cc.b, cc.a);
  strokeWeight(2);
  line(x + ca * 0.5, y, x + ca * 0.5, y + ys);
}

//draw buttons
function drawButtons(buttonNum, textName, textColor, textS, roundness, on, off) {
  fill(buttonNum.c);
  rect(buttonNum.x, buttonNum.y, buttonNum.xs, buttonNum.ys, roundness); //make rect button
  (mouseOnButton(buttonNum)) ? buttonNum.c = on: buttonNum.c = off; // button color when mouse over

  //text for buttons
  fill(textColor);
  textStyle(NORMAL);
  textAlign(CENTER, CENTER);
  textSize(textS);
  text(textName, buttonNum.x + buttonNum.xs * 0.5, buttonNum.y + buttonNum.ys * 0.47);
}

//color buttons
function drawColorButtons(buttonNum) {
  fill(buttonNum.r, buttonNum.g, buttonNum.b);
  if (mouseOnColorButton(buttonNum)) { // when mouse over, make outline
    stroke(0);
    strokeWeight(1);
  } else
    noStroke();

  if (ccl == buttonNum.name) {
    stroke(0);
    strokeWeight(1.8);
  }
  ellipse(buttonNum.x, buttonNum.y, buttonNum.s, buttonNum.s); //draw ellipse color button
}

//calcurate for mouse on button or not
function mouseOnButton(buttonNum) {
  return mouseX >= buttonNum.x && mouseX <= buttonNum.x + buttonNum.xs &&
    mouseY >= buttonNum.y && mouseY <= buttonNum.y + buttonNum.ys ? true : false;
}

//calcurate for mouse on button or not
function mouseOnColorButton(buttonNum) {
  if (mouseX < windowWidth - button3.xs - 20)
    return dist(buttonNum.x, buttonNum.y, mouseX, mouseY) <= buttonNum.s * 0.5 ? true : false;
}

//check mouse is clicked
function mousePressed() {
  if (uo) {
    if (mouseOnButton(button0))
      bbc = !bbc;
    if (mouseOnButton(button1)) // increase by 2
      cbs -= 2;
    if (mouseOnButton(button2))
      cbs += 2;
    if (cbs <= 1) // minimum brush size
      cbs = 1;
    if (cbs >= 999) // maximum brush size
      cbs = 999;
    if (mouseOnColorButton(colorButton_r))
      colorChange(colorButton_r);
    if (mouseOnColorButton(colorButton1))
      colorChange(colorButton1);
    if (mouseOnColorButton(colorButton2))
      colorChange(colorButton2);
    if (mouseOnColorButton(colorButton3))
      colorChange(colorButton3);
    if (mouseOnColorButton(colorButton4))
      colorChange(colorButton4);
    if (mouseOnColorButton(colorButton5))
      colorChange(colorButton5);
    if (mouseOnColorButton(colorButton6))
      colorChange(colorButton6);
    if (mouseOnColorButton(colorButton7))
      colorChange(colorButton7);
    if (mouseOnColorButton(colorButton8))
      colorChange(colorButton8);
    if (mouseOnColorButton(colorButton9))
      colorChange(colorButton9);
    if (mouseOnColorButton(colorButton0))
      colorChange(colorButton0);
    if (mouseOnButton(button3))
      cbc = true;
    if (mouseOnButton(button4))
      dCanvas.save("saved" + "_" + day() + "_" + hour() + "_" + minute() + "_" + second() + ".png");

    if (bbc && mouseOnButton(button01)) {
      cb = 'ellipse';
      cd = 0.5 * 60;
      bbc = false;
    }
    if (bbc && mouseOnButton(button02)) {
      cb = 'line';
      cd = 0.5 * 60;
      bbc = false;
    }
    if (bbc && mouseOnButton(button03)) {
      cb = 'text';
      cd = 0.5 * 60;
      bbc = false;
    }
    if (bbc && mouseOnButton(button04)) {
      cb = 'outline';
      cd = 0.5 * 60;
      bbc = false;
    }
    if (bbc && mouseOnButton(button05)) {
      cb = 'cloud';
      cd = 0.5 * 60;
      bbc = false;
    }
    if (bbc && mouseOnButton(button06)) {
      cb = 'rotate';
      cd = 0.5 * 60;
      bbc = false;
    }
    if (bbc && mouseOnButton(button07)) {
      cb = 'connect';
      cd = 0.5 * 60;
      bbc = false;
    }
    if (bbc && mouseOnButton(button08)) {
      cb = 'emoji';
      cd = 0.5 * 60;
      bbc = false;
    }
  }
  if (cbc) {
    if (mouseOnButton(button5)) {
      dCanvas.clear();
      cd = 0.5 * 60;
      countOldPoint = 0;//for spdir_web brush
      oldPointX = [];
      oldPointY = [];
      cbc = false;
    }
    if (mouseOnButton(button6)) {
      cd = 0.5 * 60;
      cbc = false;
    }
  }
  if (mouseOnButton(button7)) {
    uo = !uo;
    cd = 0.5 * 60;
  }
}

//key pressed for shortcut
function keyPressed() {
  if (key == '-' || key == '[') // increase by 4
    cbs -= 4;
  else if (key == '=' || key == ']')
    cbs += 4;
  if (cbs <= 1) // minimum brush size
    cbs = 1;
  if (cbs >= 999) // maximum brush size
    cbs = 999;

  if (keyCode == TAB)
    uo = !uo;

  switch (key) {
    case "`":
      ccl = 'random';
      colorChange(colorButton_r);
      break;
    case '1':
      ccl = 'yellow';
      colorChange(colorButton1);
      break;
    case '2':
      ccl = 'blue';
      colorChange(colorButton2);
      break;
    case '3':
      ccl = 'pink';
      colorChange(colorButton3);
      break;
    case '4':
      ccl = 'green';
      colorChange(colorButton4);
      break;
    case '5':
      ccl = 'cyan';
      colorChange(colorButton5);
      break;
    case '6':
      ccl = 'orange';
      colorChange(colorButton6);
      break;
    case '7':
      ccl = 'purple';
      colorChange(colorButton7);
      break;
    case '8':
      ccl = 'salmon';
      colorChange(colorButton8);
      break;
    case '9':
      ccl = 'black';
      colorChange(colorButton9);
      break;
    case '0':
      ccl = 'white';
      colorChange(colorButton0);
      break;
    case 'c':
      cbc = true;
      break;
    case 'y':
      if (cbc) {
        dCanvas.clear();
        countOldPoint = 0;//for connect_web brush
        oldPointX = [];
        oldPointY = [];
        cbc = false;
      } else {
        cb = 'rotate';
        bbc = false;
      }
      break;
    case 'n':
      if (cbc) cbc = false;
      break;
    case 's':
      dCanvas.save("saved" + "_" + day() + "_" + hour() + "_" + minute() + "_" + second() + ".png");
      break;
    case 'b':
      bbc = !bbc;
      break;
    case 'q':
      cb = 'ellipse';
      bbc = false;
      break;
    case 'w':
      cb = 'line';
      bbc = false;
      break;
    case 'e':
      cb = 'outline';
      bbc = false;
      break;
    case 'r':
      cb = 'cloud';
      bbc = false;
      break;
    case 't':
      cb = 'text';
      bbc = false;
      break;
    case 'u':
      cb = 'connect';
      bbc = false;
      break;
    case 'i':
      cb = 'emoji';
      bbc = false;
      break;
    case 'o':
      ca -= 4;
      break;
    case 'p':
      ca += 4;
      break;
  }
}

//change current color value
function colorChange(buttonNum) {
  cc.r = buttonNum.r;
  cc.g = buttonNum.g;
  cc.b = buttonNum.b;
  ccl = buttonNum.name;
}

//drawing on dCanvas
function drawingCanvas() {
  image(dCanvas, 0, 0);

  if (mouseIsPressed) {
    if (((mouseY > interfaceH) && (!bbc || ((mouseX < button01.x || mouseX > button01.x + button01.xs) ||
        mouseY > button05.y + button05.ys)) && (!cbc && cd <= 0 && !obc)) || (!uo && cd <= 0 && !cbc)) {
      switch (cb) {
        case 'ellipse':
          dCanvas.noStroke();
          dCanvas.fill(cc.r, cc.g, cc.b, ca);
          dCanvas.ellipse(mouseX, mouseY, cbs, cbs); //draw ellipse with color

          dCanvas.strokeWeight(cbs);
          dCanvas.stroke(cc.r, cc.g, cc.b, ca);
          if (pmouseX != 0)
            dCanvas.line(pmouseX, pmouseY, mouseX, mouseY); //draw line between mouse and pmouse to cover gap
          break;
        case 'line':
          dCanvas.strokeWeight(cbs * 0.3);
          dCanvas.stroke(cc.r, cc.g, cc.b, ca);
          dCanvas.push();
          dCanvas.translate(mouseX - cbs, mouseY - cbs * 0.5);
          dCanvas.line(0, 0, cbs * 2, cbs);
          dCanvas.pop();
          dCanvas.push();
          dCanvas.translate(pmouseX - cbs, pmouseY - cbs * 0.5);
          dCanvas.line(0, 0, mouseX - pmouseX, mouseY - pmouseY);
          dCanvas.pop();
          dCanvas.push();
          dCanvas.translate(pmouseX - cbs, pmouseY - cbs * 0.5);
          dCanvas.line(cbs * 2, cbs, mouseX - pmouseX + cbs * 2, mouseY - pmouseY + cbs);
          dCanvas.pop();
          break;
        case 'text':
          dCanvas.noStroke();
          dCanvas.textSize(cbs + 6);
          dCanvas.textAlign(CENTER, CENTER);
          dCanvas.fill(cc.r, cc.g, cc.b, ca);
          dCanvas.text(forRandomText[parseInt(random(forRandomText.length))], mouseX, mouseY);
          break;
        case 'outline':
          dCanvas.noStroke();
          if (ccl == "black" || (ccl == "random" && colorButton_r.r == 34))
            dCanvas.fill(colorButton0.r, colorButton0.g, colorButton0.b, ca);
          else if (ccl == "white" || (ccl == "random" && colorButton_r.r == 255))
            dCanvas.fill(colorButton9.r, colorButton9.g, colorButton9.b, ca);
          else
            dCanvas.fill(cc.g, cc.b, cc.r, ca);
          dCanvas.ellipse(mouseX, mouseY, cbs, cbs); //draw ellipse with color
          dCanvas.fill(cc.r, cc.g, cc.b, ca);
          (cbs - 15 > cbs / 2) ? dCanvas.ellipse(mouseX, mouseY, cbs - 15, cbs - 15):
            dCanvas.ellipse(mouseX, mouseY, cbs / 2, cbs / 2); //draw ellipse with color


          dCanvas.strokeWeight(cbs);
          if (ccl == "black" || (ccl == "random" && colorButton_r.r == 34))
            dCanvas.stroke(colorButton0.r, colorButton0.g, colorButton0.b, ca);
          else if (ccl == "white" || (ccl == "random" && colorButton_r.r == 255))
            dCanvas.stroke(colorButton9.r, colorButton9.g, colorButton9.b, ca);
          else
            dCanvas.stroke(cc.g, cc.b, cc.r, ca);
          if (pmouseX != 0)
            dCanvas.line(pmouseX, pmouseY, mouseX, mouseY); //draw line between mouse and pmouse to cover gap

          (cbs - 15 > cbs / 2) ? dCanvas.strokeWeight(cbs - 15): dCanvas.strokeWeight(cbs / 2);
          dCanvas.stroke(cc.r, cc.g, cc.b, ca);
          if (pmouseX != 0)
            dCanvas.line(pmouseX, pmouseY, mouseX, mouseY); //draw line between mouse and pmouse to cover gap
          break;
        case 'cloud':
          let randomCbs = random(cbs * 0.6, cbs);
          dCanvas.noStroke();
          dCanvas.fill(cc.r, cc.g, cc.b, random(ca * 0.2, ca * 0.8));
          dCanvas.ellipse(random(mouseX - cbs, mouseX + cbs), random(mouseY - cbs, mouseY + cbs), randomCbs, randomCbs);
          dCanvas.ellipse(random(mouseX - cbs, mouseX + cbs), random(mouseY - cbs, mouseY + cbs), randomCbs, randomCbs);
          dCanvas.ellipse(random(mouseX - cbs, mouseX + cbs), random(mouseY - cbs, mouseY + cbs), randomCbs, randomCbs);
          //draw ellipse with color
          break;
        case 'rotate':
          dCanvas.strokeWeight(cbs * 0.1);
          dCanvas.stroke(cc.r, cc.g, cc.b, ca);
          dCanvas.push();
          dCanvas.translate(mouseX, mouseY);
          dCanvas.rotate(frameCount / 5);
          dCanvas.line(0, 0, cbs, cbs);
          dCanvas.pop();
          dCanvas.push();
          dCanvas.translate(pmouseX, pmouseY);
          dCanvas.rotate(frameCount / 7);
          dCanvas.line(0, 0, cbs, cbs);
          dCanvas.pop();
          break;
        case 'connect':
          dCanvas.strokeWeight(cbs * 0.1);
          dCanvas.stroke(cc.r, cc.g, cc.b, ca);
          dCanvas.line(mouseX, mouseY, pmouseX, pmouseY);


          for (let j = 0; j < countOldPoint; j++) {
            dCanvas.strokeWeight(cbs * 0.03);
            if (oldPointX[j]!=undefined)
              dCanvas.line(mouseX, mouseY, oldPointX[j], oldPointY[j]);
          }
          oldPointX[countOldPoint] = mouseX;
          oldPointY[countOldPoint] = mouseY;
          countOldPoint++;

          if(countOldPoint > 8)
            countOldPoint = 0;
          break;
        case 'emoji':
          dCanvas.noStroke();
          dCanvas.textSize(cbs + 6);
          dCanvas.textAlign(CENTER, CENTER);
          switch (ccl) {
            case 'random':
              dCanvas.text("💩", mouseX, mouseY);//"💩"
              break;
            case 'yellow':
              dCanvas.text("😆", mouseX, mouseY);
              break;
            case 'blue':
              dCanvas.text("🥶", mouseX, mouseY);
              break;
            case 'pink':
              dCanvas.text("🥰", mouseX, mouseY);
              break;
            case 'green':
              dCanvas.text("🤢", mouseX, mouseY);
              break;
            case 'cyan':
              dCanvas.text("😱", mouseX, mouseY);
              break;
            case 'orange':
              dCanvas.text("🥵", mouseX, mouseY);
              break;
            case 'purple':
              dCanvas.text("😈", mouseX, mouseY);
              break;
            case 'salmon':
              dCanvas.text("🤪", mouseX, mouseY);
              break;
            case 'black':
              dCanvas.text("😎", mouseX, mouseY);
              break;
            case 'white':
              dCanvas.text("💀", mouseX, mouseY);
              break;
          }
      }
    }

  }
}

//change mouse cursor shape
function mouseCursor() {
  stroke(0);
  strokeWeight(1);
  fill(0);
  if ((mouseY > interfaceH && // interface area
      (!bbc || ((mouseX < button01.x || mouseX > button01.x + button01.xs) || mouseY > button08.y + button08.ys)) && //brush list down
      (!cbc || (mouseX < windowWidth / 2 - 150 || mouseX > windowWidth / 2 + 150) || (mouseY < (windowHeight-105) / 2 - 75 || mouseY > (windowHeight-105) / 2 + 75))) || (!uo && (mouseY < (windowHeight-105) / 2 - 75 || mouseY > (windowHeight-105) / 2 + 75))) { //when inside interface
    noFill();
    switch (cb) {
      case 'ellipse':
        ellipse(mouseX, mouseY, cbs, cbs); //drawing mouse Cursor
        break;
      case 'line':
        strokeWeight(cbs * 0.3);
        stroke(0, 0, 0, 125);
        push();
        translate(mouseX - cbs, mouseY - cbs * 0.5);
        line(0, 0, cbs * 2, cbs);
        pop();
        break;
      case 'text':
        textStyle(NORMAL);
        textAlign(CENTER);
        textSize(cbs + 6);
        text('T', mouseX, mouseY);
        break;
      case 'outline':
        ellipse(mouseX, mouseY, cbs, cbs);
        (cbs - 15 > cbs / 2) ? ellipse(mouseX, mouseY, cbs - 15, cbs - 15): ellipse(mouseX, mouseY, cbs / 2, cbs / 2);
        break;
      case 'cloud':
        ellipse(mouseX, mouseY, cbs, cbs);
        ellipse(mouseX - cbs * 0.4, mouseY - cbs * 0.2, cbs / 3 * 2, cbs / 3 * 2);
        ellipse(mouseX + cbs * 0.5, mouseY - cbs * 0.1, cbs / 3, cbs / 3);
        break;
      case 'rotate':
        strokeWeight(cbs * 0.1);
        stroke(0, 0, 0, 125);
        push();
        translate(mouseX, mouseY);
        rotate(frameCount / 5);
        line(0, 0, cbs, cbs);
        pop();
        push();
        translate(mouseX, mouseY);
        rotate(frameCount / 7);
        line(0, 0, cbs, cbs);
        pop();
        break;
      case 'connect':
        strokeWeight(cbs * 0.1);
        stroke(0, 0, 0, 125);
        line(mouseX + cbs * 0.2, mouseY, mouseX + cbs * 0.5, mouseY);
        line(mouseX - cbs * 0.2, mouseY, mouseX - cbs * 0.5, mouseY);
        line(mouseX, mouseY + cbs * 0.2, mouseX, mouseY + cbs * 0.5);
        line(mouseX, mouseY - cbs * 0.2, mouseX, mouseY - cbs * 0.5);
        ellipse(mouseX , mouseY, cbs * 0.05);
        break;
      case 'emoji':
        textStyle(NORMAL);
        textAlign(CENTER);
        textSize(cbs + 6);
        text("😶", mouseX, mouseY);
        break;
    }
  } else {
    stroke(255);
    (mouseIsPressed) ? strokeWeight(1.5): strokeWeight(1); //when clicked in interface change weight

    // arrow cursor
    push();
    translate(mouseX, mouseY);
    beginShape();
    vertex(0, 0);
    vertex(0, 19);
    vertex(4.5, 17);
    vertex(7.5, 24.2);
    vertex(11, 22.7);
    vertex(8.5, 15.5);
    vertex(13, 13.5);
    endShape(CLOSE);
    pop();
  }
}

//resizing window
function windowResized() {
  resizeCanvas(windowWidth, windowHeight-105);
  dCanvas = createGraphics(windowWidth, windowHeight-105);
}
