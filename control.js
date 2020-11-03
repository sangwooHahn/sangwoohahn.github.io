function tensNum (num) {
  return Math.round(num/10)*10;
}
function evenNum (num) {
  if((num/10)%2==1)
   return num+10;
  else return num;
}
function forthNum (num) {
  if((num/10)%4==1)
    return num+30;
  else if((num/10)%4==2)
    return num+20;
  else if((num/10)%4==3)
    return num+10;
  else return num;
}

setInterval(function() {
  if(!stopAll) {
    if(pose !=undefined) {
      let noseS = Math.ceil((pose.leftEye.x- pose.rightEye.x)/10)*10;

      w = tensNum( Math.abs(pose.leftElbow.x-pose.leftShoulder.x)/noseS*90 + Math.abs(pose.rightShoulder.x-pose.rightElbow.x)/noseS*90);
      w = forthNum(w);
      if(w<10) w=10; if(w>800) w=800;

      t = tensNum( Math.abs(pose.leftAnkle.x-pose.rightAnkle.x)/noseS/noseS*750 );
      t = forthNum(t);
      if(t<10) t=10; if(t>300) t=300;

      arcs = tensNum( Math.abs(pose.leftWrist.x-pose.leftElbow.x)/noseS*50 + Math.abs(pose.rightWrist.x-pose.rightElbow.x)/noseS*50 );
      arcs = evenNum(arcs);
      if(arcs<10) arcs=10; if(arcs>500) arcs=500;

      mh = tensNum( (Math.abs(pose.leftShoulder.y-pose.leftHip.y)/noseS*80 +  Math.abs(pose.rightShoulder.y-pose.rightHip.y)/noseS*80)/2 );
      mh = evenNum(mh);
      if(mh<10) mh=10; if(mh>700) mh=700;

      lt = Math.round((Math.abs(pose.leftWrist.y-pose.leftHip.y)/noseS*0.1 +  Math.abs(pose.rightWrist.y-pose.rightHip.y)/noseS*0.1)*10)/10;
      lt = map(lt,0,2,1,0);
      if(lt<0) lt=0; if(lt>1) lt=1;

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
  document.getElementById(button).style.color= "#07248c";//전체 리스트 내리기 버튼도 밑줄끄기
}
