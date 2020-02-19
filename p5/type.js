var canvas;
var dropzone;
var back_img;
var typeX = 0;
var typeY = 0;
var canvasSize = 400;

function setup() {
  canvas = createCanvas(canvasSize, canvasSize);
  colorMode(HSB,100);
  backColor_hue = 0;

  control_bar();

  typeX = width/2;
  typeY = height/2;

  DropZone();
}

function draw() {
  backColor = color(backColor_hue, 30, 95);
  background(backColor);

  if(back_img != null) {
    image(back_img, 0, 0, canvasSize, canvasSize);
  }

  noFill();
  push();
  translate(typeX,typeY);
  shearX(tilt);
  translate(-(title_input.value().length*fat+(title_input.value().length-1)*space)/2, -tall/2);
  for(var i = 0; i < title_input.value().length; i++) {
    typing(title_input.value()[i],(nextLetter*i*fat)+space*i,0);
  }
  pop();

  control_value ();

  if(mouseIsPressed &&
    0 < mouseX && mouseX < width && 0 < mouseY && mouseY < height) {
    typeX = typeX+mouseX-pmouseX;
    typeY = typeY+mouseY-pmouseY;
  }
}

function DropZone () {
  dropzone = select('#dropzone');
  dropzone.position(0,0);
  dropzone.dragOver(highlight);
  dropzone.dragLeave(unhighlight);
  dropzone.drop(gotFile, unhighlight);
}

function highlight() {
  dropzone.style('border', '3px dashed #666');
}

function unhighlight() {
  dropzone.style('border', '0px dashed');
}
function gotFile (file) {
  back_img = createImg(file.data);
  back_img.hide();
}

function windowResized() {
    if(canvasSize > windowWidth) {
      resizeCanvas(windowWidth, windowWidth);
    }
    else {
      resizeCanvas(canvasSize, canvasSize);
    }
}
// function windowResized() {
//   if(windowWidth < 599) {
//     resizeCanvas(windowWidth, windowHeight);
//   }
//   else if(windowWidth > 600 && windowWidth < 999) {
//     resizeCanvas(windowWidth-280, windowHeight-280);
//   }
//   else {
//     resizeCanvas(windowWidth-280, windowHeight)-280;
//   }
// }
