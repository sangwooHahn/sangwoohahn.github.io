function setup() {
  var sketchCanvas = createCanvas(windowWidth, windowHeight);
  sketchCanvas.parent("myCanvas");
  // background(30);

  height_s = height*0.95;
  box_on = false;
  kr = true;
  auto_lang = true;

  sw = 1; //screenwidth;

  t = 30; //thickness
  arc = 50; // arc size

  w = 100; //width;
  h = 130; //height;
  gw = 10; //gap width;
  gh = 10; //gap height;

  sx = width/2-w-w/3; // start x;
  sy = height_s/2-h-h/2; // start y;

  colorMode(HSB, 360, 100, 100);
  c = color(random(0,360),90,100);
  stw = 10;
  stwb = true;
  r=0;
}

function draw() {
  background(0);

  noStroke();
  r++;
  if(r>361)
  r=0;
  // names(sx+mouseY/10,sy+mouseX/10,r,70,7);
  names(sx-mouseY/10,sy-mouseX/10,r,0,3);
  names(sx-mouseX/10,sy-mouseY/10,r,70,3);
  names(sx+mouseX/10,sy+mouseY/10,r,70,3);
  // names(sx+t/3,sy,r,70,70);
  // names(sx+t/4,sy,r,70,70);

  ml ();

  noStroke();
  names(sx,sy,r,70,100);

  c = color(r,70,70);
  fill(c);
  textSize(16);
  textAlign(CENTER, CENTER);
  text('Graphic Designer',width/2,height_s-150);

  controls();
}

function mouseClicked() {
  auto_lang=!auto_lang;
}

function names(_x,_y,_r,_g,_b) {
  push();
  translate(_x,_y);

  c = color(_r,_g,_b);
  fill(c);

  aa(0,0);
  oo((w+gw)/2,h+gh);
  oo((w+gw)/2+w+gw,h+gh);

  c = color(_r,_g,_b*0.6);
  fill(c);

  if(!kr) {
    ss(-w-gw,0,arc);
    nn(w+gw,0);
    ww((w+gw)/2-gw-w*1.5,h+gh);
    gg(w+gw+w+gw,0);
  }
  if(kr) {
    ah(w+gw,0);
    uu((w+gw)/2+w+gw,h+gh+h+gh);
  }
  pop();
}

function controls() {

  if(frameCount%20==0 && auto_lang)
    kr = !kr;

  if(h/2 < w/2)
    arc = h/2;
  if(h/2 > w/2)
    arc = w/2;

  if(!mouseIsPressed) {
    t = mouseY/20;
    if(t<1)
      t=1;
    w = mouseX/8;
    // arc = mouseX/35+20;
  }

  if(w<t+t/4)
    w=t+t/4;
  if(h<t+t/4)
    h=t+t/4;


  sx = width/2-w-w/6; // start x;
  sy = height_s/2-h-h/4; // start y;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function ml () {
  c = color(r,70,30);
  stroke(c);
  if(stwb)
    stw ++;
  if(!stwb)
    stw --;
  if(stw>60 && stwb)
    stwb = false;
  if(stw<10 && !stwb)
    stwb = true;

  strokeWeight(stw);
  line(mouseX,mouseY,pmouseX,pmouseY);
}

function bg () {
  noStroke();
  // fill(map(mouseX,0,width,0,360),50,100);
  // beginShape();
  // vertex(width/3,0);
  // vertex(0,0);
  // vertex(width/3*2,height_s);
  // vertex(width/3,height_s);
  // endShape(CLOSE);
  // noStroke();
  fill(map(mouseX,0,width,60,300),0,100);
  beginShape();
  vertex(width/5*4,0);
  vertex(width/6*2,0);
  vertex(0,height_s);
  vertex(width/6*5,height_s);
  endShape(CLOSE);
}

function aa(_x, _y) {
  push();
  translate(_x,_y);
  beginShape();
  vertex(w/2-t/2-t/16,0);
  vertex(w/2+t/2+t/16,0);
  vertex(t+t/8,h);
  vertex(0,h);
  endShape(CLOSE);
  beginShape();
  vertex(w/2-t/2-t/16,0);
  vertex(w/2+t/2+t/16,0);
  vertex(w,h);
  vertex(w-t-t/8,h);
  endShape(CLOSE);
  stroke(0,200,0);
  noFill();
  if(box_on)
    rect(0,0,w,h);
  pop();
}
function ah(_x, _y) {
  push();
  translate(_x,_y);
  beginShape();
  vertex(0,0);
  vertex(t,0);
  vertex(t,h);
  vertex(0,h);
  endShape(CLOSE);
  beginShape();
  vertex(0,h/2-t/2);
  vertex(w/2,h/2-t/2);
  vertex(w/2,h/2+t/2);
  vertex(0,h/2+t/2);
  endShape(CLOSE);
  stroke(200,0,0);
  noFill();
  if(box_on)
    rect(0,0,w,h);
  pop();
}
function nn (_x, _y) {
  push();
  translate(_x,_y);
  beginShape();
  vertex(0,0);
  vertex(t,0);
  vertex(t,h);
  vertex(0,h);
  endShape(CLOSE);
  beginShape();
  vertex(w-t,0);
  vertex(w,0);
  vertex(w,h);
  vertex(w-t,h);
  endShape(CLOSE);
  beginShape();
  vertex(0,0);
  vertex(t,0);
  vertex(w,h-t/3);
  vertex(w,h);
  vertex(w-t,h);
  vertex(0,t/3);
  endShape(CLOSE);
  stroke(200,0,0);
  noFill();
  if(box_on)
    rect(0,0,w,h);
  pop();
}
function oo(_x, _y) {
  push();
  translate(_x,_y);

  beginShape();
  vertex(0, arc);
  bezierVertex(0, arc/2, arc/2, 0, arc, 0);
  vertex(arc, t);
  bezierVertex(t+(arc-t)/2, t, t, t+(arc-t)/2, t, arc);
  endShape(CLOSE);

  beginShape();
  vertex(w-arc, 0);
  bezierVertex(w-(arc/2), 0, w, arc/2, w, arc);
  vertex(w-t, arc);
  bezierVertex(w-t, t+(arc-t)/2, w-t-(arc-t)/2, t, w-arc, t);
  endShape(CLOSE);

  beginShape();
  vertex(w, h-arc);
  bezierVertex(w, h-arc/2, w-arc/2, h, w-arc, h);
  vertex(w-arc, h-t);
  bezierVertex(w-t-(arc-t)/2, h-t, w-t, h-arc+(arc-t)/2, w-t, h-arc);
  endShape(CLOSE);

  beginShape();
  vertex(arc, h);
  bezierVertex(arc/2, h, 0, h-arc/2, 0, h-arc);
  vertex(t, h-arc);
  bezierVertex(t, h-t-(arc-t)/2, t+(arc-t)/2, h-t, arc, h-t);
  endShape(CLOSE);

  rect(arc,0,w-arc-arc,t);
  rect(arc,h-t,w-arc-arc,t);
  rect(0,arc,t,h-arc-arc);
  rect(w-t,arc,t,h-arc-arc);

  stroke(0,200,0);
  noFill();
  if(box_on)
    rect(0,0,w,h);
  pop();
}

function uu(_x, _y) {
  push();
  translate(_x,_y);
  beginShape();
  vertex(0,0);
  vertex(w,0);
  vertex(w,t);
  vertex(0,t);
  endShape(CLOSE);
  beginShape();
  vertex(w/2-t/2,0);
  vertex(w/2+t/2,0);
  vertex(w/2+t/2,h/2);
  vertex(w/2-t/2,h/2);
  endShape(CLOSE);
  stroke(0,100,200);
  noFill();
  if(box_on)
    rect(0,0,w,h);
  pop();
}

function ww(_x, _y) {
  push();
  translate(_x,_y);
  beginShape();
  vertex(0,0);
  vertex(t+t/8+t/8,0);
  vertex((w*1.5+t)/4+t/2+t/16,h);
  vertex((w*1.5+t)/4-t/2-t/16,h);
  endShape(CLOSE);
  beginShape();
  vertex((w*1.5+t)/2-t-t/16,0);
  vertex((w*1.5+t)/2+t/16,0);
  vertex((w*1.5+t)/4+t/2+t/16,h);
  vertex((w*1.5+t)/4-t/2-t/16,h);
  endShape(CLOSE);
  beginShape();
  vertex((w*1.5+t)/2-t-t/16,0);
  vertex((w*1.5+t)/2+t/16,0);
  vertex((w*1.5+t)/4+t/2+(w*1.5+t)/2-t+t/16,h);
  vertex((w*1.5+t)/4-t/2+(w*1.5+t)/2-t-t/16,h);
  endShape(CLOSE);
  beginShape();
  vertex(w*1.5-t-t/8,0);
  vertex(w*1.5,0);
  vertex((w*1.5+t)/4+t/2+(w*1.5+t)/2-t+t/16,h);
  vertex((w*1.5+t)/4-t/2+(w*1.5+t)/2-t-t/16,h);
  endShape(CLOSE);
  stroke(200,0,0);
  noFill();
  if(box_on)
    rect(0,0,w*1.5,h);
  pop();
}

function ss (_x, _y, _arc) {
  if(_arc>(h/2+t/2)/2)
    _arc=(h/2+t/2)/2;
  push();
  translate(_x,_y);

  beginShape();
  vertex(0, _arc);
  bezierVertex(0, _arc/2, _arc/2, 0, _arc, 0);
  vertex(_arc, t);
  bezierVertex(t+(_arc-t)/2, t, t, t+(_arc-t)/2, t, _arc);
  endShape(CLOSE);

  beginShape();
  vertex(w-_arc, 0);
  bezierVertex(w-(_arc/2), 0, w, _arc/2, w, _arc);
  vertex(w-t, _arc);
  bezierVertex(w-t, t+(_arc-t)/2, w-t-(_arc-t)/2, t, w-_arc, t);
  endShape(CLOSE);

  beginShape();
  vertex(w, h-_arc);
  bezierVertex(w, h-_arc/2, w-_arc/2, h, w-_arc, h);
  vertex(w-_arc, h-t);
  bezierVertex(w-t-(_arc-t)/2, h-t, w-t, h-_arc+(_arc-t)/2, w-t, h-_arc);
  endShape(CLOSE);

  beginShape();
  vertex(_arc, h);
  bezierVertex(_arc/2, h, 0, h-_arc/2, 0, h-_arc);
  vertex(t, h-_arc);
  bezierVertex(t, h-t-(_arc-t)/2, t+(_arc-t)/2, h-t, _arc, h-t);
  endShape(CLOSE);

  beginShape();
  vertex(0, h/2+t/2-_arc);
  bezierVertex(0, h/2+t/2-_arc+_arc/2, _arc/2, h/2+t/2, _arc, h/2+t/2);
  vertex(_arc, h/2+t/2-t);
  bezierVertex(t+(_arc-t)/2, h/2-t/2, t, h/2-t/2-(_arc-t)/2, t, h/2+t/2-_arc);
  endShape(CLOSE);

  beginShape();
  vertex(w-_arc, h/2-t/2);
  bezierVertex(w-_arc/2, h/2-t/2, w, h/2-t/2+(_arc)/2, w, h/2-t/2+_arc);
  vertex(w-t, h/2-t/2+_arc);
  bezierVertex(w-t, h/2+t/2+(_arc-t)/2, w-_arc+(_arc-t)/2, h/2+t/2, w-_arc, h/2+t/2);
  endShape(CLOSE);

  rect(_arc,0,w-_arc-_arc,t);
  rect(_arc,h/2-t/2,w-_arc-_arc,t);
  rect(_arc,h-t,w-_arc-_arc,t);
  if(_arc < t) {
    rect(w-_arc,_arc,_arc,t-_arc);
    rect(0,h-t,_arc,t-_arc);
  }
  rect(0, _arc, t, h/2+t/2-_arc-_arc);
  rect(w-t, h/2-t/2+_arc, t, h/2+t/2-_arc-_arc);

  stroke(200,0,0);
  noFill();
  if(box_on)
    rect(0,0,w,h);
  pop();
}

function gg(_x, _y) {
  push();
  translate(_x,_y);

  beginShape();
  vertex(0, arc);
  bezierVertex(0, arc/2, arc/2, 0, arc, 0);
  vertex(arc, t);
  bezierVertex(t+(arc-t)/2, t, t, t+(arc-t)/2, t, arc);
  endShape(CLOSE);

  beginShape();
  vertex(w-arc, 0);
  bezierVertex(w-(arc/2), 0, w, arc/2, w, arc);
  vertex(w-t, arc);
  bezierVertex(w-t, t+(arc-t)/2, w-t-(arc-t)/2, t, w-arc, t);
  endShape(CLOSE);

  beginShape();
  vertex(w, h-arc);
  bezierVertex(w, h-arc/2, w-arc/2, h, w-arc, h);
  vertex(w-arc, h-t);
  bezierVertex(w-t-(arc-t)/2, h-t, w-t, h-arc+(arc-t)/2, w-t, h-arc);
  endShape(CLOSE);

  beginShape();
  vertex(arc, h);
  bezierVertex(arc/2, h, 0, h-arc/2, 0, h-arc);
  vertex(t, h-arc);
  bezierVertex(t, h-t-(arc-t)/2, t+(arc-t)/2, h-t, arc, h-t);
  endShape(CLOSE);

  rect(arc,0,w-arc-arc,t);
  rect(arc,h-t,w-arc-arc,t);
  rect(0,arc,t,h-arc-arc);
  // rect(w-arc,h-arc-t,arc,t); // tail
  if(arc < t)
    rect(w-arc,arc,arc,t-arc); // extra stright right top
  if(t<arc)
    rect(w-arc,h-arc,arc-t,t); //tail

  stroke(0,100,200);
  noFill();
  if(box_on)
    rect(0,0,w,h);
  pop();
}
