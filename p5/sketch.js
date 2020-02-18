var yspeed = 5;
var xspeed = 10;
var ballY = 0;
var ballX = 30;
var g = 0.98;
var ballSize = 40;

function setup() {
  createCanvas(windowWidth, windowHeight);
  ballY = random(height);
  ballX = random(width);
  xspeed = random(-10,10);
}

function draw() {
  background(220);
  noStroke();
  ellipseMode(CENTER);
  
  
  
  if (mouseIsPressed) {
    ellipse(mouseX,mouseY,ballSize,ballSize);
    ballY = mouseY;
    ballX = mouseX;
    if(yspeed<0) {
      yspeed *= -1;
    }
    xspeed = (mouseX - pmouseX)/3;
    yspeed = (mouseY - pmouseY)/3;
  }
  
  else {
    
  yspeed += g;
  ballY += yspeed;
  ballX += xspeed;
  xspeed *= 0.995;
  print(xspeed);
  
  if(ballY+ballSize/2+yspeed >= height || ballY-ballSize/2+yspeed <= 0) {
    yspeed *= -1;
  }
  if(ballX+ballSize/2+xspeed >= width || ballX-ballSize/2+xspeed <= 0) {
    xspeed *= -1;
  }
  if(ballY+ballSize/2 > height) {
    ballY = height-ballSize/2;
  }
  if(ballX+ballSize/2 > width) {
    ballX = width-ballSize/2;
  }
    ellipse(ballX,ballY,ballSize,ballSize);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}