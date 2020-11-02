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
    document.getElementById("camIcon").style.display = "none";
    document.getElementById("slideIcon").style.display = "inline-block";
    document.getElementById("switchButton_text").innerHTML = "Switch to slider";
  } else {
    document.getElementById("labels").style.display = "block";
    document.getElementById("bodyCanvas").style.display = "none";
    document.getElementById("camIcon").style.display = "inline-block";
    document.getElementById("slideIcon").style.display = "none";
    document.getElementById("switchButton_text").innerHTML = "Switch to cam";
  }

  if(voiceActive) {
    document.getElementById("micIcon").style.display = "block";
    document.getElementById("keyIcon").style.display = "none";
  } else {
    document.getElementById("micIcon").style.display = "none";
    document.getElementById("keyIcon").style.display = "block";
  }

  document.getElementById("text_information").innerHTML = "";
  if(!voiceActive && document.getElementById("textField").value == "")
    document.getElementById("text_information").innerHTML = "Please type the text";
  if(stopAll)
    document.getElementById("text_information").innerHTML = 'Say "start" to active';
  else if(voiceActive && document.getElementById("textField").value == "" && interim_transcript!='')
    document.getElementById("text_information").innerHTML = "wait..";
  else if(voiceActive && document.getElementById("textField").value == "" && interim_transcript=='')
    document.getElementById("text_information").innerHTML = "Please say something";
  else if(voiceActive)
    document.getElementById("text_information").innerHTML = 'Say "download" to download the font';

  if(cameraActive && pose.leftEye.x- pose.rightEye.x > 40 && !stopAll)
    document.getElementById("text_information").innerHTML = "It's too close, step back to show whole body";

    // console.log(document.getElementById("textField").style.width);
    document.getElementById("textField").style.width = document.getElementById("textField").value.length*9+90+"px";
}, 100);

document.getElementById("keyIcon").onclick = function() {
  recognition.start();
};
document.getElementById("micIcon").onclick = function() {
  recognition.start();
};
document.getElementById("switchButton").onclick = function() {
  if(!cameraActive)
    cameraStart();
  cameraActive = !cameraActive;
};



//buttons for Nav
document.getElementById("transfont_button").onclick = function() {
  allButtonOff();
  document.getElementById("main_container").style.display= "block";
};
document.getElementById("about_button").onclick = function() {
  allButtonOff();
  buttonOn(this.id);
  document.getElementById("about_container").style.display= "block";
};
document.getElementById("use_button").onclick = function() {
  allButtonOff();
  buttonOn(this.id);
  document.getElementById("use_container").style.display= "block";
};
document.getElementById("update_button").onclick = function() {
  allButtonOff();
  buttonOn(this.id);
  document.getElementById("update_container").style.display= "block";
};

function allButtonOff () {
  document.getElementById("about_button").style.textDecoration= "none";//전체 리스트 내리기 버튼도 밑줄끄기
  document.getElementById("about_button").style.color= "#1840CF";
  document.getElementById("use_button").style.textDecoration= "none";
  document.getElementById("use_button").style.color= "#1840CF";
  document.getElementById("update_button").style.textDecoration= "none";
  document.getElementById("update_button").style.color= "#1840CF";

  document.getElementById("main_container").style.display= "none";
  document.getElementById("about_container").style.display= "none";
  document.getElementById("use_container").style.display= "none";
  document.getElementById("update_container").style.display= "none";
}

function buttonOn (button) {
  document.getElementById(button).style.textDecoration= "underline";//전체 리스트 내리기 버튼도 밑줄끄기
  document.getElementById(button).style.color= "black";//전체 리스트 내리기 버튼도 밑줄끄기
}
