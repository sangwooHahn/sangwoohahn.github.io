setInterval(function() {
  if(!stopAll) {
    if(pose !=undefined) {
      w = Math.ceil(Math.abs(pose.leftWrist.x-pose.rightWrist.x)*1.5/10)*10;
      if((w/10)%2==1)
         w = w+10;
        if(w>800) w=800; if(w<10) w=10;

      mh = Math.round((Math.abs(pose.leftHip.y-pose.leftKnee.y)*3 + Math.abs(pose.rightHip.y-pose.rightKnee.y)*3)/2/10)*10;
      //mh=100;
      t = Math.round(Math.abs(pose.leftAnkle.x-pose.rightAnkle.x)*1.5/10)*10;
      if(t>300) t=300; if(t<10) t=10;
    }
    fontChanged();
    renderTextPreview();
    createGlyphFont(false);
  }

  if(cameraActive) {
    document.getElementById("labels").style.display = "none";
    document.getElementById("bodyCanvas").style.display = "block";
  } else {
    document.getElementById("labels").style.display = "block";
    document.getElementById("bodyCanvas").style.display = "none";
  }

  if(voiceActive) {
    document.getElementById("micIcon").style.display = "block";
    document.getElementById("keyIcon").style.display = "none";
  } else {
    document.getElementById("micIcon").style.display = "none";
      document.getElementById("keyIcon").style.display = "block";
  }

}, 100);
