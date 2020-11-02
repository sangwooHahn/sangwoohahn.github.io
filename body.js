let video;
let poseNet;
var pose;
let skeleton;
let cameraActive = false;

let stopAll = false;

function setup() {
  cameraStart();
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
  translate(video.width, 0);
  scale(-1, 1);
  translate(120, 0);
  if(!stopAll) {
      image(video, 0, 0);


    if (pose) {
      let d = dist(pose.rightEye.x, pose.rightEye.y, pose.leftEye.x, pose.leftEye.y);

      // drawMask();
      drawNose();
      // drawSkeleton();
      drawJoint();

      }
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
