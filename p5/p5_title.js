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

  // rsm = random(1000);
  // rom = random(6, 12);
}

function draw() {
  background(0);
  noStroke();

  for (let i = 5; i > 0; i--) {
  if(i==2) {
    drawingContext.shadowBlur = 0;
    drawName();
  }
    noStroke();
    drawBackground(height - (i * 250));
}
  // ml ();
  drawTitle();
  controls();
}

function drawBackground(sh) {
  noiseSeed(sh);
  fill(0,0,0,110);
  drawingContext.shadowColor = color(10);//almost same as fill
  drawingContext.shadowBlur = 500;
  beginShape();
  vertex(0, height);
  for (let i = -width; i <= width * 3; i += (sin(frameCount / 200) + 2) * 30)
    vertex(i, sh + noise(i / 200) * noise(frameCount / 100) * 400); // multiple vertexes
  vertex(width, height);
  endShape();
}

function drawName() {
  r++;
  if(r>361) r=0;
  // names(sx-mouseY/10,sy-mouseX/10,r,0,3);
  // names(sx-mouseX/10,sy-mouseY/10,r,70,3);
  // names(sx+mouseX/10,sy+mouseY/10,r,70,3);
  names(sx,sy,r,70,100);
}

function drawTitle () {
  c = color(r,70,70);
  fill(c);
  textSize(16);
  textAlign(CENTER, CENTER);
  text('Interaction Designer',width/2,height_s-100);
}

function mouseClicked() {
  auto_lang=!auto_lang;
}


function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
