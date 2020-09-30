/*
 * @name Reach 1
 * @frame 710,400
 * @description The arm follows the position of the mouse by calculating the
 * angles with atan2(). Based on code from Keith Peters.
 */
let segLength = 120,
  lhx,
  lhy,
  lhx2,
  lhy2,
  rhx,
  rhy,
  rhx2,
  rhy2,
  lfx,
  lfy,
  lfx2,
  lfy2,
  rfx,
  rfy,
  rfx2,
  rfy2,
  bx = 0,
  by = 0,
  c = 0,
  cc = 1;

var mx;
var my;
var lmt; // left mouse true // 마우스가 캐릭보다 왼쪽

function setup() {
  let screen;
  if(windowWidth > 800)
    screen  = createCanvas(windowWidth-420, windowHeight/2.5);
  else
    screen  = createCanvas(windowWidth, windowHeight/2.5);
  screen.parent("window");
  strokeWeight(25);
  strokeJoin(ROUND);
  noFill();
  stroke(0);//('#1840CF');
  // colorMode(HSB, 100);
  // cursor('none');

  lhx = width / 2 - 75 + bx;
  lhy = height / 2 - 100 + by;
  lhx2 = lhx;
  lhy2 = lhy;
  rhx = width / 2 + 75 + bx;
  rhy = height / 2 - 100 + by;
  rhx2 = rhx;
  rhy2 = rhy;
  lfx = width / 2 - 45 + bx;
  lfy = height / 2 + 100 + by;
  lfx2 = lfx;
  lfy2 = lfy;
  rfx = width / 2 + 45 + bx;
  rfy = height / 2 + 100 + by;
  rfx2 = rfx;
  rfy2 = rfy;
}

function draw() {
  background("#9eb3ff");

  mx = mouseX;
  my = mouseY;
  if(mouseX < width/2)
    lmt = true;
  else
    lmt = false;


  noFill();
  stroke(0);
  // stroke(c, 90, 90, 100);
  // c += cc;
  // if (c >= 100 || c <= 0)
  //   cc *= -1;
  translate(width/3,height/3.2);
  scale(0.3);
  // console.log(c);
  push();
  translate(width / 2 + bx, height / 2 + by);
  beginShape();
  vertex(-75, -100);
  vertex(75, -100);
  vertex(45, 100);
  vertex(-45, 100);
  endShape(CLOSE);
  pop();

  ellipse(width / 2 + bx, height / 2 + by - 180, 90);
  bx = map(mouseX, 0, width, -50, 50);
  by = map(mouseY, 0, height, -50, 50);

  lhx = width / 2 - 75 + bx;
  lhy = height / 2 - 100 + by;
  lhx2 = lhx;
  lhy2 = lhy;
  rhx = width / 2 + 75 + bx;
  rhy = height / 2 - 100 + by;
  rhx2 = rhx;
  rhy2 = rhy;
  lfx = width / 2 - 45 + bx;
  lfy = height / 2 + 100 + by;
  lfx2 = lfx;
  lfy2 = lfy;
  rfx = width / 2 + 45 + bx;
  rfy = height / 2 + 100 + by;
  rfx2 = rfx;
  rfy2 = rfy;


  dragSegmen_lh(0, mouseX + bx, mouseY + by);
  for (let i = 0; i < lhx.length - 1; i++) {
    dragSegmen_lh(i + 1, lhx[i], lhy[i]);
  }
  dragSegmen_rh(0, mouseX + bx, mouseY + by);
  for (let i = 0; i < rhx.length - 1; i++) {
    dragSegmen_rh(i + 1, rhx[i], rhy[i]);
  }
  dragSegmen_lf(0, mouseX + bx, mouseY + by);
  for (let i = 0; i < lfx.length - 1; i++) {
    dragSegmen_lf(i + 1, lfx[i], lfy[i]);
  }
  dragSegmen_rf(0, mouseX + bx, mouseY + by);
  for (let i = 0; i < rfx.length - 1; i++) {
    dragSegmen_rf(i + 1, rfx[i], rfy[i]);
  }

  // speech ();
}

function speech () {
  // noStroke();
  // fill(0);
  rect(width/2+120+bx, -320+by ,500,200,50);
  noStroke();
  fill(0);
  textAlign(CENTER, CENTER);
  textSize(70);
  text('welcome!',width/2+120+250+bx, -320+100+by);
}

function dragSegmen_lh(i, xin, yin) {
  dx = mouseX - lhx;
  dy = mouseY - lhy;
  angle1 = atan2(dy, dx);

  tx = mouseX - 100 - cos(angle1) * segLength;
  ty = mouseY - 10 - sin(angle1) * segLength;
  dx = tx - lhx2;
  dy = ty - lhy2;
  angle2 = atan2(dy, dx);
  lhx = lhx2 + cos(angle2) * segLength;
  lhy = lhy2 + sin(angle2) * segLength;

  segment(lhx, lhy, angle1);
  segment(lhx2, lhy2, angle2);
}

function dragSegmen_rh(i, xin, yin) {
  dx = mouseX - rhx;
  dy = mouseY - rhy;
  angle1 = atan2(dy, dx);

  tx = mouseX + 100 - cos(angle1) * segLength;
  ty = mouseY - 10 - sin(angle1) * segLength;
  dx = tx - rhx2;
  dy = ty - rhy2;
  angle2 = atan2(dy, dx);
  rhx = rhx2 + cos(angle2) * segLength;
  rhy = rhy2 + sin(angle2) * segLength;

  segment(rhx, rhy, angle1);
  segment(rhx2, rhy2, angle2);
}

function dragSegmen_lf(i, xin, yin) {
  dx = mouseX - lfx;
  dy = mouseY + 320 - lfy;
  angle1 = atan2(dy, dx);

  tx = mouseX - 30 - cos(angle1) * segLength;
  ty = mouseY + 520 - sin(angle1) * segLength;
  dx = tx - lfx2;
  dy = ty - lfy2;
  angle2 = atan2(dy, dx);
  lfx = lfx2 + cos(angle2) * segLength;
  lfy = lfy2 + sin(angle2) * segLength;

  segment(lfx, lfy, angle1);
  segment(lfx2, lfy2, angle2);
}

function dragSegmen_rf(i, xin, yin) {
  dx = mouseX - rfx;
  dy = mouseY + 320 - rfy;
  angle1 = atan2(dy, dx);

  tx = mouseX + 30 - cos(angle1) * segLength;
  ty = mouseY + 520 - sin(angle1) * segLength;
  dx = tx - rfx2;
  dy = ty - rfy2;
  angle2 = atan2(dy, dx);
  rfx = rfx2 + cos(angle2) * segLength;
  rfy = rfy2 + sin(angle2) * segLength;

  segment(rfx, rfy, angle1);
  segment(rfx2, rfy2, angle2);
}

function segment(x, y, a) {
  push();
  translate(x, y);
  rotate(a);
  line(0, 0, segLength, 0);
  pop();
}

function windowResized() {
  if(windowWidth > 800)
    resizeCanvas(windowWidth-420, windowHeight/2.5);
  else
    resizeCanvas(windowWidth, windowHeight/2.5);
}
