let video;
let poseNet;
var pose;
let skeleton;
let cameraActive = false;

let depthOfBox;

function setup() {
  cameraStart();
  angleMode(DEGREES);
  frameRate(30);

  depthOfBox = 8000;//displayHeight * 2;
  document.getElementById("container_").style.height = windowHeight+"px";
  document.getElementById("wallBack").style.transform = "translateZ(" + (-depthOfBox) + "px)";
  document.getElementById("wallLeft").style.width = depthOfBox+"px";
  document.getElementById("wallRight").style.width = depthOfBox+"px";
  document.getElementById("wallTop").style.height = depthOfBox+"px";
  document.getElementById("wallBottom").style.height = depthOfBox+"px";
  document.getElementById("wallBottom").style.top = "calc("+ (windowHeight - depthOfBox) + "px)";
}

function cameraStart () {
  var sketchCanvas = createCanvas(640, 480);//(520, 480);
  sketchCanvas = createCanvas(0, 0);
  sketchCanvas.parent("bodyCanvas");
  video = createCapture(VIDEO);
  video.hide();
  poseNet = ml5.poseNet(video, modelLoaded);
  poseNet.on('pose', gotPoses);
}

function gotPoses(poses) {
  // console.log(poses);
  if (poses.length > 0) {
    pose = poses[0].pose;
    skeleton = poses[0].skeleton;
  }
}

function modelLoaded() {
  console.log('poseNet ready');
  cameraActive = true;
}

function draw() {
  push();
  // background(204);
  translate(video.width*0.7, 0);
  scale(-0.3, 0.3);
  image(video, 0, 0);

  if (pose) {
    let d = dist(pose.rightEye.x, pose.rightEye.y, pose.leftEye.x, pose.leftEye.y);

  drawNose();
  drawEye();

  }
  pop();
}

function drawNose() {
  fill("#8888ff");
  // ellipse(pose.nose.x, pose.nose.y, pose.leftEye.x- pose.rightEye.x);
  ellipse(pose.nose.x, pose.nose.y*0.8, (pose.leftEye.x- pose.rightEye.x)*3, (pose.leftEye.x- pose.rightEye.x)*4);
}

function drawEye() {
  noStroke();
  fill("#000000");
  ellipse(pose.leftEye.x, pose.leftEye.y, (pose.leftEye.x- pose.rightEye.x) * 0.2, (pose.leftEye.x- pose.rightEye.x) * 0.8);
  ellipse(pose.rightEye.x, pose.rightEye.y, (pose.leftEye.x- pose.rightEye.x) * 0.2, (pose.leftEye.x- pose.rightEye.x) * 0.8);
}

setInterval(function() {
  if(pose !=undefined) {
    let middleEyeX = (pose.leftEye.x+ pose.rightEye.x)/2;
    print("eyeXpos:  "+ middleEyeX);
    let middleEyeY = (pose.leftEye.y+ pose.rightEye.y)/2;
    print("eyeYpos:  "+ middleEyeY);
    let dist = Math.hypot(pose.leftEye.x-pose.rightEye.x,pose.leftEye.y-pose.rightEye.y);
    dist = map(dist, 300, 0, 1, 100); // distance between user and the screen.
    dist = Math.round(dist*10)/10;
    print("dist: "+dist);

    middleEyeX = map(middleEyeX, ((dist * -9.5) + 1250), ((dist * 6.6) - 345), 0, windowWidth);
    middleEyeY = map(middleEyeY, ((dist * -12) + 1380), 150, windowHeight,-windowHeight*0.4);
    print("pers: "+Math.round((14000*(1.12**(dist-86)+0.4))/100)*100);

    document.getElementById("container_").style.perspective = Math.round((14000*(1.12**(dist-86)+0.4))/100)*100+"px";//14000+"px";
    document.getElementById("container_").style.perspectiveOrigin = middleEyeX + "px " + middleEyeY + "px";
  }
}, 100);


// function draw() {
//   document.getElementById("container_").style.perspectiveOrigin = map(mouseX,0, displayWidth,0,displayWidth*2) + "px " + map(mouseY,0, displayHeight,displayHeight/2,displayHeight*2) + "px";
// }
