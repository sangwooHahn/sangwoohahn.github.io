
const alphabetList = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const dictionaryList = ["Accessibility", "Alphabet", "Arc", "Baseline", "Body tracking", "Bold", "Camera",
"Communication", "Control", "Counter", "CSS", "Descender", "Digital", "Download", "Easy to make",
"Elements", "English", "Experimental", "Font", "Gap", "Geometry", "Glyph", "Height", "HTML", "Interactive", "javascript", "Kerning",
"lowercase", "Microphone", "MIT License", "Movement", "Numbers", "Overshoot", "OTF", "Open source", "Opentype.js", "Particioation", "Personal",
"P5.js", "Question mark", "Readability", "Response", "Sangwoo Hahn", "Sans serif", "Serif", "Sound", "Special character", "Specimen",
"Transform", "TTF", "Typeface", "Unredable", "UPPERCASE", "Usable", "Variables", "Voice", "Volume", "Web camera",
"Web page", "Weight", "Width", "WOFF", "x-height", "You can make it!", "Z"];

const clickedColor = '#9eb3ff';

let currentAlphabet ='a';

function createDictionaryList (listName) {
  let container_ID, listUl, ul_ID, lists, listText;
  container_ID = document.getElementById('list_container'); //컨테이너 찾기
  lists = document.createElement('li'); //리스트 만들고
  lists.id = listName.toLowerCase()+'_ID';//아이디주고
  listText = document.createTextNode(listName);//텍스트를 텍스트 노드형식으로 변경해주고
  lists.appendChild(listText);//새로 만든 list에 텍스트를 넣어라.
  ul_ID = document.getElementById('word_'+listName[0].toLowerCase()); //ul 찾기
  if(ul_ID == null) { //콘테이너 안에 알파벳 리스트 이름이 없다면
    listUl = document.createElement('ul'); //만들고
    listUl.id = 'word_'+listName[0].toLowerCase();//아이디주고
    listUl.appendChild(lists);//새로 만든 ul에 리스트를 넣어라.
    container_ID.appendChild(listUl);//그리고 새로 만든 ul을 다시 콘테이너에 넣어라.
  }
  else {
    ul_ID.appendChild(lists);//기존에 찾았던 ul에 넣기
    container_ID.appendChild(ul_ID);//그리고 기존에 찾았던 ul을 다시 콘테이너에 넣어라.
  }
}

function createAlphabetList (alphabetName) {
  var container_ID, alphabetDiv, alphabetText;
  container_ID = document.getElementById('alphabet_container'); //컨테이너 찾기
  alphabetDiv = document.createElement('div'); //div 만들고
  alphabetDiv.id = alphabetName.toLowerCase()+'_alphabet_ID';//아이디주고
  alphabetText = document.createTextNode(alphabetName);//텍스트를 텍스트노드형식으로 변경해주고
  alphabetDiv.appendChild(alphabetText);//새로 만든 div에 텍스트를 넣어라.
  container_ID.appendChild(alphabetDiv);//그리고 기존에 찾았던 새로 만든 div를 다시 콘테이너에 넣어라.
}

for (let i = 0; i < dictionaryList.length; i++) {
  createDictionaryList (dictionaryList[i]);//.toLowerCase());
  var text = dictionaryList[i].toLowerCase();
  if(document.getElementById(dictionaryList[i].toLowerCase()+'_ID')!=null) {
    document.getElementById(dictionaryList[i].toLowerCase()+'_ID').onmouseover = function() {
      wordButtons(this.innerHTML);
      discriptionChange(this.innerHTML);
    }; //그걸 마우스 호버식 버튼으로 전환, 마우스 올리면 이름 바꾸기.
  }
}
for(let i = 0; i < alphabetList.length; i++) {
  createAlphabetList (alphabetList[i]); // 알파벳 갯수만큼 맨 위에 버튼형식의 알파벳 리스트 생성.
  if(document.getElementById("word_" + alphabetList[i].toLowerCase())!=null) {
    document.getElementById("word_" + alphabetList[i].toLowerCase()).style.display = "none";//단어들 다 끄고 시작 // 밑에서 A만 켤 예정
    document.getElementById("word_" + alphabetList[i].toLowerCase()).style.cursor = "pointer";//마우스 포인터 세팅
    document.getElementById(alphabetList[i].toLowerCase()+"_alphabet_ID").style.cursor = "pointer";//마우스 포인터 세팅
  }
  document.getElementById(alphabetList[i].toLowerCase()+"_alphabet_ID").onclick = function() {
    alphabetButtons(this.id);
  }; //그걸 버튼으로 전환, 누르면 일단 목록 다 끄게 하기.
}



document.getElementById("title_ID").onclick = function() {
  wordButtons('⠀');
  document.getElementById("discription").innerHTML = 'Welcome to Transfont Dictionary! Transfont is a project for creating custom fonts. Users can change behavior in real-time to influencing the appearance of fonts. These fonts are more personalized than other fonts. If you want more information, please choose an alphabet on the right, and move the mouse over the words to see the meaning!';
  document.getElementById("preview").style.display = "block";//타이틀 보이게.
  document.getElementById("window").style.display = "block";//춤추는 인간 보이게.
};

let allList = '<i class="fas fa-list" id="allListID"></i>';//'<i class="fas fa-sort-alpha-down" id="allListID"></i>';
document.getElementById("alphabet_container").insertAdjacentHTML('beforeend',allList); // 전체 리스트 내리기 버튼
document.getElementById("allListID").onclick = function() {
  allListDownButtons();
};

document.getElementById("left_arrow").onclick = function() {
  arrowButton('left');
};
document.getElementById("right_arrow").onclick = function() {
  arrowButton('right');
};


document.getElementById("word_a").style.display = "block";//A만 켜기
document.getElementById("a_alphabet_ID").style.textDecoration= "underline";
document.getElementById("a_alphabet_ID").style.color= clickedColor;


function alphabetButtons (alphabetName) {
  for (let i = 0; i < alphabetList.length; i++) {//전부다 끄기
    if(document.getElementById("word_" + alphabetList[i].toLowerCase())!=null) {
      document.getElementById("word_" + alphabetList[i].toLowerCase()).style.display = "none";
      document.getElementById(alphabetList[i].toLowerCase()+"_alphabet_ID").style.textDecoration= "none";
      document.getElementById(alphabetList[i].toLowerCase()+"_alphabet_ID").style.color= "white";
    }
  }
  document.getElementById("allListID").style.textDecoration= "none";//전체 리스트 내리기 버튼도 밑줄끄기
  document.getElementById("allListID").style.color= "white";//전체 리스트 내리기 버튼도 밑줄끄기
  if(document.getElementById("word_" + alphabetName[0])!=null) {//이제 위에서 받아온 아이디에서 첫글자(알파벳)에 맞는 부분만 켜기
    document.getElementById("word_" + alphabetName[0]).style.display = "block";//아이디의 첫글자는 알파벳이니깐 그것을 이용한 것. 알파벳 리스트의 아이디에서 첫글자인 알파벳을 가져와서 그걸 다시 알파벳 ul 아이디에 대조.
    document.getElementById(alphabetName[0]+"_alphabet_ID").style.textDecoration= "underline";
    document.getElementById(alphabetName[0]+"_alphabet_ID").style.color= clickedColor;
    currentAlphabet = alphabetName[0];//현재 알파벳 저장 (소문자)
  }
}

function allListDownButtons () {//전체 리스트 보기 버튼
  document.getElementById("allListID").style.textDecoration= "underline";
  document.getElementById("allListID").style.color= clickedColor;
  for (let i = 0; i < alphabetList.length; i++) {
    //if(document.getElementById("word_" + alphabetList[i].toLowerCase())!=null)
    document.getElementById(alphabetList[i].toLowerCase()+"_alphabet_ID").style.textDecoration= "none";//다른거 밑줄끄기
    document.getElementById(alphabetList[i].toLowerCase()+"_alphabet_ID").style.color= "white";//다른거 밑줄끄기
  }
  for (let i = 0; i < alphabetList.length; i++) {
    if(document.getElementById("word_" + alphabetList[i].toLowerCase())!=null)
      document.getElementById("word_" + alphabetList[i].toLowerCase()).style.display = "block";
  }
}

function arrowButton (arrow) {//화살표 좌우 기능
  for(let i = 0; i < alphabetList.length; i++) {
    if(currentAlphabet == alphabetList[i].toLowerCase()) {
      document.getElementById("allListID").style.textDecoration= "none";//전체보기 버튼 밑줄 끄고
      document.getElementById("allListID").style.color= "white";//전체보기 버튼 밑줄 끄고
      document.getElementById(alphabetList[i].toLowerCase()+"_alphabet_ID").style.textDecoration= "none";//지금 알파벳 밑줄 끄고
      document.getElementById(alphabetList[i].toLowerCase()+"_alphabet_ID").style.color= "white";//지금 알파벳 밑줄 끄고
      for (let i = 0; i < alphabetList.length; i++) {
        if(document.getElementById("word_" + alphabetList[i].toLowerCase())!=null)
          document.getElementById("word_" + alphabetList[i].toLowerCase()).style.display = "none";//전부다 단어 안보이게 하고 (리스트 고려)
      }

      if(arrow =='right' && alphabetList[i].toLowerCase() != 'z') {//오른쪽이고 z가 아닌 경우
        document.getElementById(alphabetList[i+1].toLowerCase()+"_alphabet_ID").style.textDecoration= "underline";//다음 알파벳 밑줄 긋고
          document.getElementById(alphabetList[i+1].toLowerCase()+"_alphabet_ID").style.color= clickedColor;//다음 알파벳 밑줄 긋고
        if(document.getElementById("word_" + alphabetList[i+1].toLowerCase())!=null)
          document.getElementById("word_" + alphabetList[i+1].toLowerCase()).style.display = "block";
        currentAlphabet = alphabetList[i+1].toLowerCase();
        break;
      }
      if(arrow =='left' && alphabetList[i].toLowerCase() != 'a') {//오른쪽이고 z가 아닌 경우
        document.getElementById(alphabetList[i-1].toLowerCase()+"_alphabet_ID").style.textDecoration= "underline";//다음 알파벳 밑줄 긋고
          document.getElementById(alphabetList[i-1].toLowerCase()+"_alphabet_ID").style.color= clickedColor;//다음 알파벳 밑줄 긋고
        if(document.getElementById("word_" + alphabetList[i-1].toLowerCase())!=null)
          document.getElementById("word_" + alphabetList[i-1].toLowerCase()).style.display = "block";
        currentAlphabet = alphabetList[i-1].toLowerCase();
        break;
      }
      if(arrow =='right' && alphabetList[i].toLowerCase() == 'z') {//오른쪽이고 z가 아닌 경우
        document.getElementById("a_alphabet_ID").style.textDecoration= "underline";//다음 알파벳 밑줄 긋고
          document.getElementById("a_alphabet_ID").style.color= clickedColor;//다음 알파벳 밑줄 긋고
        if(document.getElementById("word_a")!=null)
          document.getElementById("word_a").style.display = "block";
        currentAlphabet = 'a';
        break;
      }
      if(arrow =='left' && alphabetList[i].toLowerCase() == 'a') {//오른쪽이고 z가 아닌 경우
        document.getElementById("z_alphabet_ID").style.textDecoration= "underline";//다음 알파벳 밑줄 긋고
          document.getElementById("z_alphabet_ID").style.color= clickedColor;//다음 알파벳 밑줄 긋고
        if(document.getElementById("word_z")!=null)
          document.getElementById("word_z").style.display = "block";
        currentAlphabet = 'z';
        break;
      }
    }
  }
}

function wordButtons(text) { //단어에 올리면 큰단어 글씨 바뀌게 하기
  document.getElementById("word").innerHTML = text;
  document.getElementById("preview").style.display = "none";//타이틀 안보이게.
  document.getElementById("window").style.display = "none";//춤추는 인간 안보이게.
}



  // document.getElementById('word_t').style.width = document.getElementById('container_left').offsetWidth + "px";
