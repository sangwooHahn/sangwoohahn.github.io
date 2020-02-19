function empty (x, y) {

  push();
  translate(x, y);
  noStroke();
  fill(backColor);
  rect (-2*fontSize, -2*fontSize, fat*3, tall*3);
  stroke(0);
  pop();
}


function drawPoint (ePosX, ePosY) {
  var mouseNum = mouseY % 4;
  var lineSize = eSize/2+3 * fontSize;
  fill(backColor);
  if (eVersion == 0) {
    ellipse (ePosX, ePosY, eSize, eSize);
  }
  else if (eVersion == 1) {
    beginShape ();
    vertex(ePosX,ePosY-eSize/2);
    vertex(ePosX+eSize/2,ePosY);
    vertex(ePosX,ePosY+eSize/2);
    vertex(ePosX-eSize/2,ePosY);
    endShape (CLOSE);
  }
  else if (eVersion == 2) {
    beginShape ();
    vertex(ePosX-eSize/2,ePosY-eSize/2);
    vertex(ePosX+eSize/2,ePosY-eSize/2);
    vertex(ePosX+eSize/2,ePosY+eSize/2);
    vertex(ePosX-eSize/2,ePosY+eSize/2);
    endShape (CLOSE);
  }
  else if (eVersion == 3) {
    beginShape ();
    line (ePosX-eSize/2,ePosY-eSize/2,ePosX+eSize/2,ePosY+eSize/2);
    line (ePosX-eSize/2,ePosY+eSize/2,ePosX+eSize/2,ePosY-eSize/2);
    endShape (CLOSE);
  }
  else if (eVersion == 4) {
    if (mouseNum == 0) {
      line(ePosX+lineSize*0.7, ePosY+lineSize*0.7, ePosX-lineSize*0.7, ePosY-lineSize*0.7);
      line(ePosX+lineSize*0.7, ePosY-lineSize*0.7, ePosX-lineSize*0.7, ePosY+lineSize*0.7);
    }
    if (mouseNum == 1) {
      line(ePosX+lineSize*0.85, ePosY+lineSize*0.4, ePosX-lineSize*0.85, ePosY-lineSize*0.4);
      line(ePosX+lineSize*0.4, ePosY-lineSize*0.85, ePosX-lineSize*0.4, ePosY+lineSize*0.85);
    }
    if (mouseNum == 2) {
      line(ePosX+lineSize, ePosY, ePosX-lineSize, ePosY);
      line(ePosX, ePosY+lineSize, ePosX, ePosY-lineSize);
    }
    if (mouseNum == 3) {
      line(ePosX+lineSize*0.4, ePosY+lineSize*0.85, ePosX-lineSize*0.4, ePosY-lineSize*0.85);
      line(ePosX+lineSize*0.85, ePosY-lineSize*0.4, ePosX-lineSize*0.85, ePosY+lineSize*0.4);
    }
    ellipse (ePosX, ePosY, eSize, eSize);
  }
  noFill();
}

function drawA (x, y) {
  push();
  translate(x, y);
  strokeWeight(strokeW);
  arc(arcSize/2, arcSize/2, arcSize, arcSize, PI, PI+HALF_PI);
  line(arcSize/2, 0, fat-arcSize/2, 0);
  arc(fat-arcSize/2, arcSize/2, arcSize, arcSize, PI+HALF_PI, TWO_PI);

  line(fat, arcSize/2, fat, tall);
  //arc(fat-arcSize/2, tall/2-arcSize/2, arcSize, arcSize, 0, HALF_PI);
  line(0, tall/2, fat, tall/2);

  line(0, arcSize/2, 0, tall);

  drawPoint (0, tall/2);
  drawPoint (fat, tall/2);
  pop();
}

function drawB(x, y) {
  push();
  translate(x, y);
  strokeWeight(strokeW);
  arc(arcSize/2, arcSize/2, arcSize, arcSize, PI, PI+HALF_PI);
  line(arcSize/2, 0, fat-arcSize/2, 0);
  arc(fat-arcSize/2, arcSize/2, arcSize, arcSize, PI+HALF_PI, TWO_PI);

  line(fat, arcSize/2, fat, tall/2-arcSize/2);
  arc(fat-arcSize/2, tall/2-arcSize/2, arcSize, arcSize, 0, HALF_PI);
  line(fat-arcSize/2, tall/2, 0, tall/2);
  arc(fat-arcSize/2, tall/2+arcSize/2, arcSize, arcSize, PI + HALF_PI, TWO_PI);
  line(fat, tall/2+arcSize/2, fat, tall-arcSize/2);
  arc(fat-arcSize/2, tall-arcSize/2, arcSize, arcSize, 0, HALF_PI);

  line(arcSize/2, tall, fat-arcSize/2, tall);
  arc(arcSize/2, tall-arcSize/2, arcSize, arcSize, HALF_PI, PI);

  line(0, arcSize/2, 0, tall-arcSize/2);

  drawPoint (0, tall/2);
  pop();
}

function drawC(x, y) {
  push();
  translate(x, y);
  strokeWeight(strokeW);
  arc(arcSize/2, arcSize/2, arcSize, arcSize, PI, PI+HALF_PI);
  line(arcSize/2, 0, fat-arcSize/2, 0);
  arc(fat-arcSize/2, arcSize/2, arcSize, arcSize, PI+HALF_PI, TWO_PI);


  arc(fat-arcSize/2, tall-arcSize/2, arcSize, arcSize, 0, HALF_PI);
  line(arcSize/2, tall, fat-arcSize/2, tall);
  arc(arcSize/2, tall-arcSize/2, arcSize, arcSize, HALF_PI, PI);

  line(0, arcSize/2, 0, tall-arcSize/2);

  line(fat/2, arcSize/2, fat/2, tall-arcSize/2);
  drawPoint (fat/2, tall/2);
  pop();
}

function drawD(x, y) {
  push();
  translate(x, y);
  strokeWeight(strokeW);
  line(0, 0, fat-arcSize/2, 0);
  arc(fat-arcSize/2, arcSize/2, arcSize, arcSize, PI+HALF_PI, TWO_PI);

  line(fat, arcSize/2, fat, tall-arcSize/2);

  arc(fat-arcSize/2, tall-arcSize/2, arcSize, arcSize, 0, HALF_PI);
  line(0, tall, fat-arcSize/2, tall);

  line(0, 0, 0, tall);

  line(fat/2, arcSize/2, fat/2, tall-arcSize/2);
  drawPoint (fat/2, tall/2);
  pop();
}

function drawE(x, y) {
  push();
  translate(x, y);
  strokeWeight(strokeW);
  arc(arcSize/2, arcSize/2, arcSize, arcSize, PI, PI+HALF_PI);
  line(arcSize/2, 0, fat-arcSize/2, 0);
  arc(fat-arcSize/2, arcSize/2, arcSize, arcSize, PI+HALF_PI, TWO_PI);

  line(0, arcSize/2, 0, tall-arcSize/2);

  arc(arcSize/2, tall-arcSize/2, arcSize, arcSize, HALF_PI, PI);
  line(arcSize/2, tall, fat-arcSize/2, tall);
  arc(fat-arcSize/2, tall-arcSize/2, arcSize, arcSize, 0, HALF_PI);

  line(0, tall/2, fat, tall/2);

  drawPoint (0, tall/2);
  pop();
}

function drawF(x, y) {
  push();
  translate(x, y);
  strokeWeight(strokeW);
  arc(arcSize/2, arcSize/2, arcSize, arcSize, PI, PI+HALF_PI);
  line(arcSize/2, 0, fat-arcSize/2, 0);
  arc(fat-arcSize/2, arcSize/2, arcSize, arcSize, PI+HALF_PI, TWO_PI);

  line(0, arcSize/2, 0, tall);

  line(0, tall/2, fat, tall/2);

  drawPoint (0, tall/2);
  pop();
}

function drawG(x, y) {
  push();
  translate(x, y);
  strokeWeight(strokeW);
  arc(arcSize/2, arcSize/2, arcSize, arcSize, PI, PI+HALF_PI);
  line(arcSize/2, 0, fat-arcSize/2, 0);
  arc(fat-arcSize/2, arcSize/2, arcSize, arcSize, PI+HALF_PI, TWO_PI);

  arc(fat-arcSize/2, tall/2+arcSize/2, arcSize, arcSize, PI + HALF_PI, TWO_PI);
  line(fat, tall/2+arcSize/2, fat, tall-arcSize/2);
  arc(fat-arcSize/2, tall-arcSize/2, arcSize, arcSize, 0, HALF_PI);

  line(arcSize/2, tall, fat-arcSize/2, tall);
  arc(arcSize/2, tall-arcSize/2, arcSize, arcSize, HALF_PI, PI);

  line(0, arcSize/2, 0, tall-arcSize/2);

  drawPoint (0, tall/2);
  pop();
}

function drawH (x, y) {
  push();
  translate(x, y);
  strokeWeight(strokeW);
  line(0, 0, 0, tall);
  line(0, tall/2, fat, tall/2);
  line(fat, 0, fat, tall);

  drawPoint (0, tall/2);
  drawPoint (fat, tall/2);
  pop();
}

function drawI (x, y) {
  push();
  translate(x, y);
  strokeWeight(strokeW);
  line(0, 0, fat/2-arcSize/2, 0);
  line(fat/2+arcSize/2, 0, fat, 0);

  arc(fat/2-arcSize/2, arcSize/2, arcSize, arcSize, PI+HALF_PI, TWO_PI);
  arc(fat/2+arcSize/2, arcSize/2, arcSize, arcSize, PI, PI+HALF_PI);
  arc(fat/2-arcSize/2, tall-arcSize/2, arcSize, arcSize, 0, HALF_PI);
  arc(fat/2+arcSize/2, tall-arcSize/2, arcSize, arcSize, HALF_PI, PI);

  line(0, tall, fat/2-arcSize/2, tall);
  line(fat/2+arcSize/2, tall, fat, tall);

  line(fat/2, arcSize/2, fat/2, tall-arcSize/2);
  drawPoint (fat/2, tall/2);
  pop();
}

function drawJ(x, y) {
  push();
  translate(x, y);
  strokeWeight(strokeW);
  line(0, 0, fat, 0);
  line(fat, 0, fat, tall-arcSize/2);

  arc(fat-arcSize/2, tall-arcSize/2, arcSize, arcSize, 0, HALF_PI);
  line(arcSize/2, tall, fat-arcSize/2, tall);
  arc(arcSize/2, tall-arcSize/2, arcSize, arcSize, HALF_PI, PI);

  drawPoint (fat, tall/2);
  pop();
}

function drawK(x, y) {
  push();
  translate(x, y);
  strokeWeight(strokeW);

  line(fat, 0, fat, tall/2-arcSize/2);
  arc(fat-arcSize/2, tall/2-arcSize/2, arcSize, arcSize, 0, HALF_PI);
  line(fat-arcSize/2, tall/2, 0, tall/2);
  arc(fat-arcSize/2, tall/2+arcSize/2, arcSize, arcSize, PI + HALF_PI, TWO_PI);
  line(fat, tall/2+arcSize/2, fat, tall);

  line(0, 0, 0, tall);

  drawPoint (0, tall/2);
  pop();
}

function drawL(x, y) {
  push();
  translate(x, y);
  strokeWeight(strokeW);

  line(0, 0, 0, tall);

  line(0, tall, fat, tall);

  drawPoint (0, tall/2);
  pop();
}

function drawM(x, y) {
  push();
  translate(x, y);
  strokeWeight(strokeW);
  line(0, 0, fat/2-arcSize/2, 0);
  line(fat/2+arcSize/2, 0, fat, 0);

  arc(fat/2-arcSize/2, arcSize/2, arcSize, arcSize, PI+HALF_PI, TWO_PI);
  arc(fat/2+arcSize/2, arcSize/2, arcSize, arcSize, PI, PI+HALF_PI);
  line(fat/2, arcSize/2, fat/2, tall);

  line(0, 0, 0, tall);
  line(fat, 0, fat, tall);

  drawPoint (0, tall/2);
  drawPoint (fat, tall/2);
  pop();
}
/*
function drawM(x, y) {
 push();
 translate(x, y);
 strokeWeight(strokeW);
 arc(arcSize/2, arcSize/2, arcSize, arcSize, PI, PI+HALF_PI);
 line(arcSize/2, 0, fat-arcSize/2, 0);
 arc(fat-arcSize/2, arcSize/2, arcSize, arcSize, PI+HALF_PI, TWO_PI);

 line(0, arcSize/2, 0, tall);
 line(fat, arcSize/2, fat, tall);

 arc(fat+arcSize/2, arcSize/2, arcSize, arcSize, PI, PI+HALF_PI);
 line(fat+arcSize/2, 0, fat+fat-arcSize/2, 0);
 arc(fat+fat-arcSize/2, arcSize/2, arcSize, arcSize, PI+HALF_PI, TWO_PI);

 line(fat+fat, arcSize/2, fat+fat, tall);

 drawPoint (0, tall/2);
 drawPoint (fat, tall/2);
 drawPoint (fat+fat, tall/2);
 pop();
 }
 */
/*
function drawM(x, y) {
 push();
 translate(x, y);
 strokeWeight(strokeW);
 arc(arcSize/2, arcSize/2, arcSize, arcSize, PI, PI+HALF_PI);
 line(arcSize/2, 0, fat-arcSize/2, 0);
 arc(fat-arcSize/2, arcSize/2, arcSize, arcSize, PI+HALF_PI, TWO_PI);

 line(0, arcSize/2, 0, tall);
 line(fat, arcSize/2, fat, tall);

 line(fat/2, 0, fat/2, tall);

 drawPoint (0, tall/2);
 drawPoint (fat/2, tall/2);
 drawPoint (fat, tall/2);
 pop();
 }*/

function drawN (x, y) {
  push();
  translate(x, y);
  strokeWeight(strokeW);
  line(0, 0, 0, tall);

  line(0, 0, fat/2-arcSize/2, 0);

  arc(fat/2-arcSize/2, arcSize/2, arcSize, arcSize, PI+HALF_PI, TWO_PI);
  arc(fat/2+arcSize/2, tall-arcSize/2, arcSize, arcSize, HALF_PI, PI);

  line(fat/2+arcSize/2, tall, fat, tall);

  line(fat/2, arcSize/2, fat/2, tall-arcSize/2);

  line(fat, 0, fat, tall);
  drawPoint (fat/2, tall/2);
  pop();
}

function drawO(x, y) {
  push();
  translate(x, y);
  strokeWeight(strokeW);
  arc(arcSize/2, arcSize/2, arcSize, arcSize, PI, PI+HALF_PI);
  line(arcSize/2, 0, fat-arcSize/2, 0);
  arc(fat-arcSize/2, arcSize/2, arcSize, arcSize, PI+HALF_PI, TWO_PI);

  line(0, arcSize/2, 0, tall-arcSize/2);
  line(fat, arcSize/2, fat, tall-arcSize/2);
  arc(arcSize/2, tall-arcSize/2, arcSize, arcSize, HALF_PI, PI);
  line(arcSize/2, tall, fat-arcSize/2, tall);
  arc(fat-arcSize/2, tall-arcSize/2, arcSize, arcSize, 0, HALF_PI);

  line(fat/2, arcSize/2, fat/2, tall-arcSize/2);

  drawPoint (fat/2, tall/2);
  pop();
}

function drawP(x, y) {
  push();
  translate(x, y);
  strokeWeight(strokeW);
  arc(arcSize/2, arcSize/2, arcSize, arcSize, PI, PI+HALF_PI);
  line(arcSize/2, 0, fat-arcSize/2, 0);
  arc(fat-arcSize/2, arcSize/2, arcSize, arcSize, PI+HALF_PI, TWO_PI);

  line(fat, arcSize/2, fat, tall/2-arcSize/2);
  arc(fat-arcSize/2, tall/2-arcSize/2, arcSize, arcSize, 0, HALF_PI);
  line(fat-arcSize/2, tall/2, 0, tall/2);

  line(0, arcSize/2, 0, tall);
  drawPoint (0, tall/2);
  pop();
}

function drawQ (x, y) {
  push();
  translate(x, y);
  strokeWeight(strokeW);
  arc(arcSize/2, arcSize/2, arcSize, arcSize, PI, PI+HALF_PI);
  line(arcSize/2, 0, fat-arcSize/2, 0);
  arc(fat-arcSize/2, arcSize/2, arcSize, arcSize, PI+HALF_PI, TWO_PI);

  line(0, arcSize/2, 0, tall-arcSize/2);
  line(fat, arcSize/2, fat, tall-arcSize/2);
  arc(arcSize/2, tall-arcSize/2, arcSize, arcSize, HALF_PI, PI);
  line(arcSize/2, tall, fat-arcSize/2, tall);
  arc(fat-arcSize/2, tall-arcSize/2, arcSize, arcSize, 0, HALF_PI);

  arc(fat/2+arcSize/2, tall-arcSize/2, arcSize, arcSize, HALF_PI, PI);

  line(fat/2+arcSize/2, tall, fat, tall);

  drawPoint (0, tall/2);
  drawPoint (fat, tall/2);
  pop();
}

function drawR(x, y) {
  push();
  translate(x, y);
  strokeWeight(strokeW);
  arc(arcSize/2, arcSize/2, arcSize, arcSize, PI, PI+HALF_PI);
  line(arcSize/2, 0, fat-arcSize/2, 0);
  arc(fat-arcSize/2, arcSize/2, arcSize, arcSize, PI+HALF_PI, TWO_PI);

  line(fat, arcSize/2, fat, tall/2-arcSize/2);
  arc(fat-arcSize/2, tall/2-arcSize/2, arcSize, arcSize, 0, HALF_PI);
  line(fat-arcSize/2, tall/2, 0, tall/2);

  line(0, arcSize/2, 0, tall);

  arc(fat-arcSize/2, tall/2+arcSize/2, arcSize, arcSize, PI+HALF_PI, TWO_PI);
  line(fat, tall/2+arcSize/2, fat, tall);

  drawPoint (0, tall/2);
  pop();
}

function drawS(x, y) {
  push();
  translate(x, y);
  strokeWeight(strokeW);
  arc(arcSize/2, arcSize/2, arcSize, arcSize, PI, PI+HALF_PI);
  line(arcSize/2, 0, fat-arcSize/2, 0);
  arc(fat-arcSize/2, arcSize/2, arcSize, arcSize, PI+HALF_PI, TWO_PI);

  line(0, arcSize/2, 0, tall/2-arcSize/2);
  arc(arcSize/2, tall/2-arcSize/2, arcSize, arcSize, HALF_PI, PI);
  line(arcSize/2, tall/2, fat-arcSize/2, tall/2);
  arc(fat-arcSize/2, tall/2+arcSize/2, arcSize, arcSize, PI+HALF_PI, TWO_PI);
  line(fat, tall/2+arcSize/2, fat, tall-arcSize/2);

  arc(arcSize/2, tall-arcSize/2, arcSize, arcSize, HALF_PI, PI);
  line(arcSize/2, tall, fat-arcSize/2, tall);
  arc(fat-arcSize/2, tall-arcSize/2, arcSize, arcSize, 0, HALF_PI);

  //line(fat/2, arcSize/2, fat/2, tall-arcSize/2);

  drawPoint (fat/2, tall/2);
  pop();
}

function drawT(x, y) {
  push();
  translate(x, y);
  strokeWeight(strokeW);
  line(0, 0, fat, 0);
  line(fat/2, 0, fat/2, tall);

  drawPoint (fat/2, tall/2);
  pop();
}

/*
function drawT(x, y) {
 push();
 translate(x, y);
 strokeWeight(strokeW);
 line(0, 0, fat/2-arcSize/2, 0);
 line(fat/2+arcSize/2, 0, fat, 0);

 arc(fat/2-arcSize/2, arcSize/2, arcSize, arcSize, PI+HALF_PI, TWO_PI);
 arc(fat/2+arcSize/2, arcSize/2, arcSize, arcSize, PI, PI+HALF_PI);

 //line(0, 0, fat, 0);
 line(fat/2, arcSize/2, fat/2, tall);

 drawPoint (fat/2, tall/2);
 pop();
 }*/

function drawU(x, y) {
  push();
  translate(x, y);
  strokeWeight(strokeW);

  line(0, 0, 0, tall-arcSize/2);
  line(fat, 0, fat, tall-arcSize/2);
  arc(arcSize/2, tall-arcSize/2, arcSize, arcSize, HALF_PI, PI);
  line(arcSize/2, tall, fat-arcSize/2, tall);
  arc(fat-arcSize/2, tall-arcSize/2, arcSize, arcSize, 0, HALF_PI);

  line(fat/2, arcSize/2, fat/2, tall-arcSize/2);

  drawPoint (fat/2, tall/2);
  pop();
}

function drawV(x, y) {
  push();
  translate(x, y);
  strokeWeight(strokeW);

  line(0, 0, 0, tall-arcSize/2);
  line(fat, 0, fat, tall);
  arc(arcSize/2, tall-arcSize/2, arcSize, arcSize, HALF_PI, PI);
  line(arcSize/2, tall, fat, tall);

  drawPoint (0, tall/2);
  drawPoint (fat, tall/2);
  pop();
}

function drawW(x, y) {
  push();
  translate(x, y);
  strokeWeight(strokeW);
  line(0, tall, fat/2-arcSize/2, tall);
  line(fat/2+arcSize/2, tall, fat, tall);


  line(fat/2, 0, fat/2, tall-arcSize/2);
  arc(fat/2-arcSize/2, tall-arcSize/2, arcSize, arcSize, 0, HALF_PI);
  arc(fat/2+arcSize/2, tall-arcSize/2, arcSize, arcSize, HALF_PI, PI);

  line(0, 0, 0, tall);
  line(fat, 0, fat, tall);

  drawPoint (0, tall/2);
  drawPoint (fat, tall/2);
  pop();
}

/*
function drawW(x, y) {
 push();
 translate(x, y);
 strokeWeight(strokeW);

 line(0, 0, 0, tall-arcSize/2);
 line(fat, 0, fat, tall-arcSize/2);
 arc(arcSize/2, tall-arcSize/2, arcSize, arcSize, HALF_PI, PI);
 line(arcSize/2, tall, fat-arcSize/2, tall);
 arc(fat-arcSize/2, tall-arcSize/2, arcSize, arcSize, 0, HALF_PI);

 line(fat+fat, 0, fat+fat, tall-arcSize/2);
 arc(fat+arcSize/2, tall-arcSize/2, arcSize, arcSize, HALF_PI, PI);
 line(fat+arcSize/2, tall, fat+fat-arcSize/2, tall);
 arc(fat+fat-arcSize/2, tall-arcSize/2, arcSize, arcSize, 0, HALF_PI);

 drawPoint (0, tall/2);
 drawPoint (fat, tall/2);
 drawPoint (fat+fat, tall/2);
 pop();
 }*/

function drawX(x, y) {
  push();
  translate(x, y);
  strokeWeight(strokeW);

  line(fat, 0, fat, tall/2-arcSize/2);
  arc(fat-arcSize/2, tall/2-arcSize/2, arcSize, arcSize, 0, HALF_PI);
  line(arcSize/2, tall/2, fat-arcSize/2, tall/2);
  arc(fat-arcSize/2, tall/2+arcSize/2, arcSize, arcSize, PI + HALF_PI, TWO_PI);
  line(fat, tall/2+arcSize/2, fat, tall);

  line(0, 0, 0, tall/2-arcSize/2);
  arc(arcSize/2, tall/2-arcSize/2, arcSize, arcSize, HALF_PI, PI);
  line(arcSize/2, tall/2, fat-arcSize/2, tall/2);
  arc(arcSize/2, tall/2+arcSize/2, arcSize, arcSize, PI, PI + HALF_PI);
  line(0, tall/2+arcSize/2, 0, tall);

  drawPoint (fat/2, tall/2);
  pop();
}

function drawY(x, y) {
  push();
  translate(x, y);
  strokeWeight(strokeW);

  line(fat, 0, fat, tall/2-arcSize/2);
  arc(fat-arcSize/2, tall/2-arcSize/2, arcSize, arcSize, 0, HALF_PI);
  line(arcSize/2, tall/2, fat-arcSize/2, tall/2);

  line(0, 0, 0, tall/2-arcSize/2);
  arc(arcSize/2, tall/2-arcSize/2, arcSize, arcSize, HALF_PI, PI);
  line(arcSize/2, tall/2, fat-arcSize/2, tall/2);

  line(fat/2, tall/2, fat/2, tall);

  drawPoint (fat/2, tall/2);
  pop();
}


function drawZ(x, y) {
  push();
  translate(x, y);
  strokeWeight(strokeW);

  line(0, 0, fat, 0);

  line(fat, 0, fat, tall/2-arcSize/2);
  arc(fat-arcSize/2, tall/2-arcSize/2, arcSize, arcSize, 0, HALF_PI);
  line(arcSize/2, tall/2, fat-arcSize/2, tall/2);

  line(arcSize/2, tall/2, fat-arcSize/2, tall/2);
  arc(arcSize/2, tall/2+arcSize/2, arcSize, arcSize, PI, PI + HALF_PI);
  line(0, tall/2+arcSize/2, 0, tall);

  line(0, tall, fat, tall);

  drawPoint (fat/2, tall/2);
  pop();
}

function drawDot(x, y) {
  push();
  translate(x, y);
  strokeWeight(strokeW);
  drawPoint (0, tall);
  pop();
}

function drawQu(x, y) {
  push();
  translate(x, y);
  strokeWeight(strokeW);
  arc(arcSize/2, arcSize/2, arcSize, arcSize, PI, PI+HALF_PI);
  line(arcSize/2, 0, fat-arcSize/2, 0);
  arc(fat-arcSize/2, arcSize/2, arcSize, arcSize, PI+HALF_PI, TWO_PI);

  line(fat, arcSize/2, fat, tall/2-arcSize/2);
  arc(fat-arcSize/2, tall/2-arcSize/2, arcSize, arcSize, 0, HALF_PI);
  line(fat-arcSize/2, tall/2, fat/2, tall/2);

  line(fat/2, tall/2, fat/2, tall);

  drawPoint (fat/2, tall);
  pop();
}


function drawEx(x, y) {
  push();
  translate(x, y);
  strokeWeight(strokeW);

  line(fat/2, 0, fat/2, tall);

  drawPoint (fat/2, tall);
  pop();
}


function drawQuot(x, y) {
  push();
  translate(x, y);
  strokeWeight(strokeW);

  drawPoint (0, 0);
  pop();
}

function drawD_Quot(x, y) {
  push();
  translate(x, y);
  strokeWeight(strokeW);

  drawPoint (0, 0);
  drawPoint (eSize*1.5, 0);
  pop();
}
