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
}

function cameraStart () {
  // var sketchCanvas = createCanvas(520, 480);//(520, 480);
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

  depthOfBox = 300;//displayHeight * 2;
  document.getElementById("wallBack").style.transform = "translateZ(" + (-depthOfBox) + "px)";
  document.getElementById("wallLeft").style.width = depthOfBox+"px";
  document.getElementById("wallRight").style.width = depthOfBox+"px";
  document.getElementById("wallTop").style.height = depthOfBox+"px";
  document.getElementById("wallBottom").style.height = depthOfBox+"px";
  document.getElementById("wallBottom").style.top = "calc("+ (displayHeight - depthOfBox) + ")";
}

function draw() {
  push();
  // background(204);
  translate(video.width*0.85, 0);
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
    middleEyeX = map(middleEyeX, 520, 0, 0, displayWidth);
    let middleEyeY = (pose.leftEye.y+ pose.rightEye.y)/2;
    middleEyeY = map(middleEyeY, 480, 0, displayHeight,0);
    let dist = map(pose.leftEye.x- pose.rightEye.x, 300, -50, 0, 90); // distance between user and the screen.

    document.getElementById("container_").style.perspective = dist*30+"px";
    document.getElementById("container_").style.perspectiveOrigin = middleEyeX + "px " + middleEyeY + "px";
  }
}, 100);
