

function names(_x,_y,_r,_g,_b) {
  push();
  translate(_x,_y);
  // scale(map(width,0,1500,0.5,1),map(width,0,1500,0.5,1),1);

  c = color(_r,_g,_b);
  fill(c);
  stroke(c);

  aa(0,0);
  oo((w+gw)/2,h+gh);
  oo((w+gw)/2+w+gw,h+gh);

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

  // if(frameCount%20==0 && auto_lang)
  //   kr = !kr;

  if(h/2 < w/2)
    arc = h/2;
  if(h/2 > w/2)
    arc = w/2;

    t = mouseY/20;
    if(t<1) t=1;
    // w = (width-mouseX)/8;
    t = map(mouseY, 0, height, 10, 37);
    arc = map(mouseX, 0, width, w/2, 0);

  w = map(width, 0, 1500, 10, 90);

  if(w<t+t/4)
    w=t+t/4;
  if(h<t+t/4)
    h=t+t/4;


  // sx = width/2-w-w/6; // start x;
  // sy = height/2-h-h/4; // start y;
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
  vertex(t,h/2-t/2);
  vertex(t+w/2,h/2-t/2);
  vertex(t+w/2,h/2+t/2);
  vertex(t,h/2+t/2);
  endShape(CLOSE);
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

  var ggarc = arc;
  if(ggarc > h/2-t/2-10)
    ggarc = h/2-t/2-10;
  beginShape();
  vertex(w-ggarc, 0);
  bezierVertex(w-(ggarc/2), 0, w, ggarc/2, w, ggarc);
  vertex(w-t, ggarc);
  bezierVertex(w-t, t+(ggarc-t)/2, w-t-(ggarc-t)/2, t, w-ggarc, t);
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

  rect(arc,0,w-arc-ggarc,t);
  rect(arc,h-t,w-arc-arc,t);
  rect(0,arc,t,h-arc-arc);
  if(arc < t)
    rect(w-arc,arc,arc,t-arc); // extra stright right top
  rect(w/2,h/2-t/2,w/2,t); //tail
  rect(w-t,h/2-t/2,t,h/2+t/2-arc);
  pop();
}
