let video;
let poseNet;
var pose;
let skeleton;
let cameraActive = false;
let stopTimer = false;
let stopTimeCount;
let timerColor = 'white';
let clickedFrame;

let stopAll = false;

function setup() {
  cameraStart();
  angleMode(DEGREES);
}

function cameraStart () {
  var sketchCanvas = createCanvas(400, 480);//(640, 480);
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
  translate(video.width, 0);
  scale(-1, 1);
  translate(120, 0);
  if(!stopAll) {
      image(video, 0, 0);


    if (pose) {
      let d = dist(pose.rightEye.x, pose.rightEye.y, pose.leftEye.x, pose.leftEye.y);

      // drawMask();
      // drawNose();
      // drawSkeleton();
      drawJoint();

      }
    }
  pop();

  drawTimer();
  clickTimer();
  timerWork();
}

  function drawTimer () {
    if(!stopTimer) {
      translate(20, 40);
      noFill();
      stroke(timerColor);
      strokeWeight(2.5);
      ellipse (10, -10, 20);
      strokeWeight(2);
      ellipse (10, -10, 1);
      line(10,-10,10,-10-5);
      noStroke();
      fill(timerColor);
      rect(10-2.5, -10-10-4,5,3);
      rect(10-3.5, -10-10-4-1,7,2);
      push();
      translate(10-2.5+10,-10-10-4+4);
      rotate(40);
      rect(0, 0,4,2);
      rect(-1, 0-1,6,1);
      pop();
      if(stopAll) {
        textSize(15);
        textAlign(LEFT,BOTTOM);
        textStyle(NORMAL);
        text('Active', 30, -3);
      }
    }
  }

function clickTimer () {
  if(mouseX > 20 && mouseX < 40 && mouseY > 20 && mouseY < 40) {
    timerColor = '#1840CF';
    if(!stopTimer) {
      cursor(HAND);
    }
  } else {
    timerColor = 'white';
    cursor(ARROW);
  }
}

function mouseClicked () {
  if(mouseX > 20 && mouseX < 40 && mouseY > 20 && mouseY < 40) {
    if(stopAll) {
      stopAll = false;
    }
    else if(!stopAll) {
      stopTimer = true;
      stopTimeCount = 9;
      clickedFrame = frameCount;
      cursor(ARROW);
    }
  }
}

function timerWork () {
  if(stopTimer && !stopAll) {
    if(ceil(stopTimeCount) == 0) {
      stopTimer = false;
      stopAll = true;
    }
    fill(255,255,255,80);
    textSize(400);
    textStyle(BOLD);
    textAlign(CENTER, CENTER);
    if(stopTimeCount != 0)
    text(ceil(stopTimeCount), width/2, height/2);
    if((frameCount-clickedFrame) % getFrameRate() == 0) {
      stopTimeCount--;
    }
  }
  if(stopAll) {
    stopTimeCount = 0;
    stopTimer = false;
  }
}

  function drawMask() {
      noStroke();
      fill('#9fe2fc');
      push();
      translate(pose.nose.x, pose.nose.y);
      beginShape();
      vertex(-d,d/4);
      vertex(d,d/4);
      vertex(d-d/3,d);
      vertex(-d+d/3,d);
      endShape(CLOSE);
      pop();
  }

  function drawNose() {
      fill(255, 0, 0);
      ellipse(pose.nose.x, pose.nose.y, pose.leftEye.x- pose.rightEye.x);
  }

  function drawSkeleton() {
      for (let i = 0; i < skeleton.length; i++) {
        let a = skeleton[i][0];
        let b = skeleton[i][1];
        stroke('#1840CF');
        line(a.position.x, a.position.y, b.position.x, b.position.y);
    }
  }

  function drawJoint() {
    for (let i = 5; i < pose.keypoints.length; i++) {
      let x = pose.keypoints[i].position.x;
      let y = pose.keypoints[i].position.y;
      noStroke();
      fill('#1840CF');
      ellipse(x, y, (pose.leftEye.x- pose.rightEye.x)*0.8);
    }
  }
