let final_transcript = '';
let voiceActive = false;
let recognition = new webkitSpeechRecognition;
if (!('webkitSpeechRecognition' in window)) {
  // upgrade();
} else {
  // start_button.style.display = 'inline-block';
  recognition.continuous = true;
  recognition.interimResults = true;

  recognition.onstart = function() {
    voiceActive = true;
  };

  recognition.onend = function() {
    // recognition.start();
    console.log("end");
  };

  recognition.onresult = function(event) {
    var interim_transcript = '';
    for (var i = event.resultIndex; i < event.results.length; i++) {
      if (event.results[i].isFinal) {
        final_transcript = event.results[i][0].transcript;
      } else {
        interim_transcript = event.results[i][0].transcript;
      }
    }

    if(interim_transcript[0]==' ')
      interim_transcript = interim_transcript.substr(1);
    if(final_transcript[0]==' ')
      final_transcript = final_transcript.substr(1);
    //final_span.innerHTML = final_transcript;//linebreak(final_transcript);
    if(interim_transcript == "save" || interim_transcript == "Save"  || interim_transcript == " save" || interim_transcript == "stop" || interim_transcript == "Stop"  || interim_transcript == " stop")
      stopAll = true;
    else if(interim_transcript == "start" || interim_transcript == "Start"  || interim_transcript == " start" || interim_transcript == "move" || interim_transcript == "Move"  || interim_transcript == " move")
      stopAll = false;
    else if(final_transcript == "save" || final_transcript == "Save"  || final_transcript == " save" || final_transcript == "stop" || final_transcript == "Stop"  || final_transcript == " stop")
      stopAll = true;
    else if(final_transcript == "start" || final_transcript == "Start"  || final_transcript == " start" || final_transcript == "move" || final_transcript == "Move"  || final_transcript == " move")
      stopAll = false;
    else
      document.getElementById('textField').value = final_transcript;

    document.getElementById('textField').innerHTML = final_transcript;
    // document.getElementById('textField').innerHTML = interim_transcript;//linebreak(interim_transcript);
    console.log(interim_transcript);
    renderTextPreview();
  };
}

function startButton(event) {
  if (voiceActive) {
    recognition.stop();
		voiceActive = false;
    return;
  }
  final_transcript = '';
  // recognition.lang = 'ko-KR';
  recognition.start();
  // final_span.innerHTML = '';
  // interim_span.innerHTML = '';
}

recognition.start();
