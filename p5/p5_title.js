function setup() {
  var sketchCanvas = createCanvas(windowWidth, windowHeight-50);
  sketchCanvas.parent("myCanvas");
  // background(30);
  kr = false;
  auto_lang = true;

  sw = 1; //screenwidth;

  t = 30; //thickness
  arc = 50; // arc size

  w = 100; //width;
  h = 130; //height;
  gw = 10; //gap width;
  gh = 10; //gap height;

  colorMode(HSB, 100, 100, 100,100);
  // c = color(random(0,360),90,100);
  stw = 10;
  stwb = true;
  r=0;

}

function draw() {
  background(0);

  sx = width/2-w; // start x;
  sy = height/2-h; // start y;

  for (let i = int(height/220)+1; i >= 0; i--) {
    if(i==0) {
      drawingContext.shadowBlur = 0;
      names(sx,sy,r,0,100);
    }
    drawBackground(height - (i * 220),i);
  }

  drawingContext.shadowBlur = 0;
  drawTitle();
  controls();
}

function drawBackground(sh,i) {
  noiseSeed(sh);
  noStroke();
  drawingContext.shadowColor = color(0,0,0,30);//almost same as fill
  drawingContext.shadowBlur = 10;
  fill((frameCount/10+(i*200)+45)%101,80,70);
  beginShape();
  vertex(0, height);
  curveVertex(0, height);
  for (let i = -width*1; i <= width*1.2; i += 200)
    curveVertex(i, sh - noise(i / 200) * noise(frameCount / 2000) * 400); // multiple vertexes
  curveVertex(width, height);
  vertex(width, height);
  endShape();
}


function drawTitle () {
  fill('white');
  textSize(16);
  textAlign(CENTER, CENTER);
  text('Interaction · UX Designer',width/2,height-100);
}


function windowResized() {
  resizeCanvas(windowWidth, windowHeight-50);
}
