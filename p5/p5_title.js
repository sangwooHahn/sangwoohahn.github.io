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
  text('Interaction Designer',width/2,height_s-100);

  controls();
}

function mouseClicked() {
  auto_lang=!auto_lang;
}


function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
