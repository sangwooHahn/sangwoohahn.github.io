var fontSizeSlider = document.getElementById("font-size-range");
var thickSizeSlider = document.getElementById("thickSize-range");
var arcSlider = document.getElementById("arc-range");
var widthSlider = document.getElementById("width-range");
var mhSlider = document.getElementById("mh-range");
var ltSlider = document.getElementById("lt-range");
var serifSlider = document.getElementById("serif-range");
var shSlider = document.getElementById("sh-range");

var fontSize = 150;
var textToRender = "ABC!";
var font = null;
var font2 = null;

var t=100; //thickSize
let w=300;//600; // width
var h=700; // height
var arc = 320; //arc
var lt = 0.3;//0.3;//light-thickSize 왼쪽이 아니라 얇아야 할 부분에 다 부여.
var mh = 400;//300;//middle-height
var s = 40;//70; // serif
var sh = 0;//tlt; //serif-height
var os = 0;//overshoot (동그라미는 네모보다 크게 그려야 하는 부분)
var d = 300;//descender (y나 Q처럼 꼬랑지가 아래로 내려가는 부분)
var g = 50;//gap between letter
//var mh = h/2-t/2;//middle-height
var srf = false;
var lh = h*0.8 ; //lowercase-height; 아래쪽에서 제어
var lw = w*0.8; //lowercase-width; 아래쪽에서 제어
var lmh = mh*0.8;
var lhh = h+70; //lowercase-height-overheight; 아래쪽에서 제어 //h같은게 대문자보다 커서 그거 제어
var tlt = t*lt; //t*lt의 소수점을 없애려고 한번에 제어 // 아래쪽에서 제어

var styleWeight = 'Medium'; // 아래에서 제어


window.onload = function(){ // start 같은 함수
  createGlyphFont(true);
  renderTextPreview();//켜자마자 바로 텍스트필드에 나오게 하기
  enableHighDPICanvas('preview');//화질 좋게하는 부분
  for (var i = 0; i < font2.glyphs.length; i++) {
    enableHighDPICanvas('c'+i);//화질 좋게하는 부분
  }
}

// setInterval(function() {
//    alert('stop');
// }, 10000);


function createGlyphCanvas(glyph, sizeX, sizeY) { // 글자 글리프가 들어가는 HTML 칸을 만들어 주는 부분
  var canvasId, html, glyphsDiv, wrap, canvas, ctx;
  // var sizeh = size+15;
  canvasId = 'c' + glyph.index;
  html = '<div class="wrapper" style="width:' + sizeX + 'px; height:' + sizeY + 'px;"><canvas id="' + canvasId + '" width="' + sizeX + '" height="' + sizeY + '"></canvas></div>';
  glyphsDiv = document.getElementById('glyphs');
  wrap = document.createElement('div');
  wrap.innerHTML = html;
  glyphsDiv.appendChild(wrap);
  canvas = document.getElementById(canvasId);
  ctx = canvas.getContext('2d');
  return ctx;
}

setInterval(function() {
  if(lmt) {
    t = Math.round(map(mx,width/5,width/2,200,20)/10)*10;
    if(t<10) t=10;

  }
  if(!lmt) {
    //lt = map(mx,400,2200,1,0);
    arc = Math.round(map(mx,width/2,width,0,200)/10)*10;
    if(arc<0) arc=0;
  }
  mh = Math.round(map(my,0,width/5,height/6*5,0)/10)*10;
  if(mh<0) mh=0;

  lt = 1;
  s = 20;

  fontChanged();
  renderTextPreview();
  createGlyphFont(false);


}, 20);


function createGlyphFont (firstDraw) {//글리프 좌표를 써둔 부분

  lh = h*0.8; //lowercase-height;
  lw = w*0.8; //lowercase-width;
  lhh = h+70;
  lmh = mh*0.8;

  if(t > h/2)
  t = Math.round((h/2)/10)*10;
  if(t > w/2)
  t = Math.round((w/2)/10)*10;
  if(lw <= t*2)
  lw = t*2;

  if(tlt*2 < h) {
    if(mh < tlt)
    mh = tlt;
  }
  if(mh > h-tlt*2)
  mh = h-tlt*2;

  if(lmh > lh-tlt*2)
  lmh = lh-tlt*2;
  if(tlt*2 < lh) {
    if(lmh < tlt)
    lmh = tlt;
  }
  else if(lmh < tlt)
  lmh = tlt;
  if(t*2 >= lh)
  lmh = lh-tlt;

  tlt = Math.round((t*lt)/10)*10; //이상하게도 먼저하면 에러남



  if(10 <= t < 20)
  styleWeight = 'Thin';
  if(20 <= t < 30)
  styleWeight = 'Extra Light';
  if(30 <= t < 40)
  styleWeight = 'Light';
  if(40 <= t < 60)
  styleWeight = 'Normal';
  if(60 <= t < 80)
  styleWeight = 'Medium';
  if(80 <= t < 100)
  styleWeight = 'Semi Bold';
  if(100 <= t < 130)
  styleWeight = 'Bold';
  if(130 <= t < 150)
  styleWeight = 'Extra Bold';
  if(150 <= t < 170)
  styleWeight = 'Black';
  if(170 <= t < 200)
  styleWeight = 'Heavy';
  if(200 <= t)
  styleWeight = 'Strong';


  var notdefPath = new opentype.Path();
  notdefPath.moveTo(0, 0);
  notdefPath.lineTo(0, h);
  notdefPath.lineTo(w, h);
  notdefPath.lineTo(w, 0);
  notdefPath.moveTo(t, t);
  notdefPath.lineTo(w-t, t);
  notdefPath.lineTo(w-t, h-t);
  notdefPath.lineTo(t, h-t);
  notdefPath.moveTo(t/2, 0);
  notdefPath.lineTo(0, t/2);
  notdefPath.lineTo(w-t/2, h);
  notdefPath.lineTo(w, h-t/2);
  notdefPath.moveTo(t/2, h);
  notdefPath.lineTo(w, t/2);
  notdefPath.lineTo(w-t/2, 0);
  notdefPath.lineTo(0, h-t/2);
  var notdefGlyph = new opentype.Glyph({
    name: '.notdef',
    unicode: 0,
    advanceWidth: w+s*2+g,
    path: notdefPath
  });


  var tPath = new opentype.Path();
  tPath.moveTo(0, h);//top
  tPath.lineTo(w, h);
  tPath.lineTo(w, h-tlt);
  tPath.lineTo(0, h-tlt);
  tPath.moveTo(w/2-t/2, h);//middle
  tPath.lineTo(w/2+t/2, h);
  tPath.lineTo(w/2+t/2, 0);
  tPath.lineTo(w/2-t/2, 0);
  if(srf) {
    tPath.moveTo(w, h-tlt);//top-right-serif
    tPath.lineTo(w, h-tlt-s);
    tPath.lineTo(w-tlt, h-tlt-s);
    tPath.curveTo(w-tlt, h-tlt-s/2, w-tlt-sh/2, h-tlt, w-tlt-sh, h-tlt);
    tPath.moveTo(tlt+sh, h-tlt);//top-left-serif
    tPath.curveTo(tlt+sh/2, h-tlt, tlt, h-tlt-s/2, tlt, h-tlt-s);
    tPath.lineTo(0, h-tlt-s);
    tPath.lineTo(0, h-tlt);
    tPath.moveTo(w/2+t/2+s, 0);//middle-serif
    tPath.lineTo(w/2-t/2-s, 0);
    tPath.lineTo(w/2-t/2-s, tlt);
    tPath.curveTo(w/2-t/2-s/2, tlt, w/2-t/2, tlt+sh/2, w/2-t/2, tlt+sh);
    tPath.lineTo(w/2-t/2+t, tlt+sh);
    tPath.curveTo(w/2-t/2+t, tlt+sh/2, w/2+t/2+s/2, tlt, w/2+t/2+s, tlt);
  }
  var tGlyph = new opentype.Glyph({
    name: 'T',
    unicode: 84,
    advanceWidth: w+s+g,
    path: tPath
  });

  var aPaths = new opentype.Path();
  var atarcs = arc;
  var abarcs = arc;
  if(abarcs >= (lmh+tlt)/2)
  abarcs = Math.round(((lmh+tlt)/2)/10)*10;
  if(atarcs > lh-lmh-tlt-t/2)
  atarcs = Math.round((lh-lmh-tlt-tlt/2)/10)*10;
  if(atarcs > lw/2)
  atarcs = Math.round((lw/2)/10)*10;
  if(abarcs > lw/2)
  abarcs = Math.round((lw/2)/10)*10;
  // else atarcs = arc;
  if(atarcs<=0)
  atarcs =0;
  if(abarcs<=0)
  abarcs =0;
  if(abarcs*2>=lw*0.8)
  os= lh*0.03*(100-(lw-abarcs*2))/100;
  // if(atarcs*2>=lw*0.8)
  //   os= lh*0.03*(100-(lw-atarcs*2))/100;
  else os=0;

  aPaths.moveTo(0, lh-atarcs+os/2);//left-top-arc
  aPaths.curveTo(0, lh-atarcs+atarcs/2+os/2, atarcs/2, lh+os/2, atarcs, lh+os/2);
  aPaths.lineTo(atarcs, lh-tlt+os/2);
  aPaths.curveTo(atarcs-(atarcs-t)/2, lh-tlt+os/2, t, lh-atarcs+(atarcs-tlt)/2+os/2, t, lh-atarcs+os/2);
  aPaths.moveTo(lw-atarcs, lh+os/2);//right-top-arc
  aPaths.curveTo(lw-atarcs/2, lh+os/2, lw, lh-atarcs/2+os/2, lw, lh-atarcs+os/2);
  aPaths.lineTo(lw-t, lh-atarcs+os/2);
  aPaths.curveTo(lw-t, lh-atarcs+(atarcs-tlt)/2+os/2, lw-atarcs+(atarcs-t)/2, lh-tlt+os/2, lw-atarcs, lh-tlt+os/2);
  aPaths.moveTo(t, abarcs-os/2);//left-bottom-arc
  aPaths.curveTo(t, abarcs-(abarcs-tlt)/2-os/2, abarcs-(abarcs-t)/2, tlt-os/2, abarcs, tlt-os/2);
  aPaths.lineTo(abarcs, 0-os/2);
  aPaths.curveTo(abarcs/2, 0-os/2, 0, abarcs/2-os/2, 0, abarcs-os/2);
  aPaths.moveTo(lw, abarcs-os/2);//right-bottom-arc
  aPaths.curveTo(lw, abarcs/2-os/2, lw-abarcs/2, 0-os/2, lw-abarcs, 0-os/2);
  aPaths.lineTo(lw-abarcs, tlt-os/2);
  aPaths.curveTo(lw-abarcs+(abarcs-t)/2, tlt-os/2, lw-t, abarcs-(abarcs-tlt)/2-os/2, lw-t, abarcs-os/2);
  aPaths.moveTo(0, lmh+tlt-abarcs);//left-middle-arc
  aPaths.curveTo(0, lmh+tlt-abarcs/2, abarcs/2, lmh+tlt, abarcs, lmh+tlt);
  aPaths.lineTo(lw, lmh+tlt);
  aPaths.lineTo(lw, lmh);
  aPaths.lineTo(abarcs, lmh);
  aPaths.curveTo(abarcs-(abarcs-t)/2, lmh, t, lmh+t-abarcs+(abarcs-t)/2, t, lmh+tlt-abarcs);
  aPaths.moveTo(0, lmh+tlt-abarcs);//left
  aPaths.lineTo(t, lmh+tlt-abarcs);
  aPaths.lineTo(t, abarcs-os/2);
  aPaths.lineTo(0, abarcs-os/2);
  aPaths.moveTo(lw-t, lh-atarcs+os/2);//right
  aPaths.lineTo(lw, lh-atarcs+os/2);
  aPaths.lineTo(lw, 0);
  aPaths.lineTo(lw-t, 0);
  aPaths.moveTo(atarcs, lh+os/2);//top
  aPaths.lineTo(lw-atarcs, lh+os/2);
  aPaths.lineTo(lw-atarcs, lh-tlt+os/2);
  aPaths.lineTo(atarcs, lh-tlt+os/2);
  aPaths.moveTo(abarcs, 0-os/2);//bottom
  aPaths.lineTo(abarcs, tlt-os/2);
  aPaths.lineTo(lw-abarcs, tlt-os/2);
  aPaths.lineTo(lw-abarcs, 0-os/2);
  if(atarcs<t) {
    aPaths.moveTo(0, lh-t);//left-top
    aPaths.lineTo(0, lh-atarcs+os/2);
    aPaths.lineTo(t, lh-atarcs+os/2);
    aPaths.lineTo(t, lh-t);
  }
  if(srf) {
    aPaths.moveTo(lw+s, 0);//bottom-left-serif
    aPaths.lineTo(lw, 0);
    aPaths.lineTo(lw, tlt+sh);
    aPaths.curveTo(lw, tlt+sh/2, lw+s/2, tlt, lw+s, tlt);
  }

  var aGlyphs = new opentype.Glyph({
    name: 'a',
    unicode: 97,
    advanceWidth: lw+s*2+g,
    path: aPaths
  });


  var fPaths = new opentype.Path();
  var fws = lw/4*3;
  var farcs = Math.round((arc/3*2)/10)*10;
  if(fws < t*2)
  fws = t*2;
  if(farcs-t/2 > fws/2)
  farcs = Math.round((fws/2+t/2)/10)*10;

  fPaths.moveTo(fws/2-t/2, lhh-farcs);//top-farcs
  fPaths.curveTo(fws/2-t/2, lhh-farcs+farcs/2, fws/2-t/2+farcs/2, lhh, fws/2-t/2+farcs, lhh);
  fPaths.lineTo(fws/2-t/2+farcs, lhh-tlt);
  fPaths.curveTo(fws/2-t/2+farcs-(farcs-t)/2, lhh-tlt, fws/2-t/2+t, lhh-farcs+(farcs-tlt)/2, fws/2-t/2+t, lhh-farcs);
  fPaths.moveTo(fws/2-t/2, lhh-farcs);//center
  fPaths.lineTo(fws/2+t/2, lhh-farcs);
  fPaths.lineTo(fws/2+t/2, 0);
  fPaths.lineTo(fws/2-t/2, 0);
  // fPaths.moveTo(0, lmh+t*2);//horizontal
  // fPaths.lineTo(fws, lmh+t*2);
  // fPaths.lineTo(fws, lmh+t);
  // fPaths.lineTo(0, lmh+t);
  fPaths.moveTo(0, lh);//horizontal
  fPaths.lineTo(fws, lh);
  fPaths.lineTo(fws, lh-tlt);
  fPaths.lineTo(0, lh-tlt);
  if(farcs-t/2 < fws/2) {
    fPaths.moveTo(fws/2-t/2+farcs, lhh-tlt);//top
    fPaths.lineTo(fws/2-t/2+farcs, lhh);
    fPaths.lineTo(fws, lhh);
    fPaths.lineTo(fws, lhh-tlt);
  }
  if(srf) {
    fPaths.moveTo(fws/2-t/2+t+s, 0);//bottom-left-serif
    fPaths.lineTo(fws/2-t/2-s, 0);
    fPaths.lineTo(fws/2-t/2-s, tlt);
    fPaths.curveTo(fws/2-t/2-s/2, tlt, fws/2-t/2, tlt+sh/2, fws/2-t/2, tlt+sh);
    fPaths.lineTo(fws/2-t/2+t, tlt+sh);
    fPaths.curveTo(fws/2-t/2+t, tlt+sh/2, fws/2-t/2+t+s/2, tlt, fws/2-t/2+t+s, tlt);
  }
  var fGlyphs = new opentype.Glyph({
    name: 'f',
    unicode: 102,
    advanceWidth: lw+s*2+g,
    path: fPaths
  });



  var nPaths = new opentype.Path();
  var narcs = arc;
  var nws = lw;
  if(narcs > nws/2)
  narcs = Math.round((nws/2)/10)*10;
  else narcs = arc;
  if(narcs*2>=nws*0.8)
  os= lh*0.03*(100-(nws-narcs*2))/100;
  else os=0;

  nPaths.moveTo(t-tlt, lh+os-narcs-os/2);//left-top-arc
  nPaths.curveTo(t-tlt, lh+os-narcs+narcs/2-os/2, narcs-(narcs-(t-tlt))/2, lh+os-os/2, narcs, lh+os-os/2);
  nPaths.lineTo(narcs, lh+os-tlt-os/2);
  nPaths.curveTo(narcs-(narcs-t)/2, lh+os-tlt-os/2, t, lh+os-narcs+(narcs-tlt)/2-os/2, t, lh+os-narcs-os/2);
  nPaths.moveTo(nws-narcs, lh+os-os/2);//right-top-arc
  nPaths.curveTo(nws-narcs/2, lh+os-os/2, nws, lh+os-narcs/2-os/2, nws, lh+os-narcs-os/2);
  nPaths.lineTo(nws-t, lh+os-narcs-os/2);
  nPaths.curveTo(nws-t, lh+os-narcs+(narcs-tlt)/2-os/2, nws-narcs+(narcs-t)/2, lh+os-tlt-os/2, nws-narcs, lh+os-tlt-os/2);
  nPaths.moveTo(0, lh);//left
  nPaths.lineTo(t, lh);
  nPaths.lineTo(t, 0);
  nPaths.lineTo(0, 0);
  nPaths.moveTo(nws-t, lh+os-narcs-os/2);//right
  nPaths.lineTo(nws, lh+os-narcs-os/2);
  nPaths.lineTo(nws, 0);
  nPaths.lineTo(nws-t, 0);
  nPaths.moveTo(narcs, lh+os-os/2);//top
  nPaths.lineTo(nws-narcs, lh+os-os/2);
  nPaths.lineTo(nws-narcs, lh+os-tlt-os/2);
  nPaths.lineTo(narcs, lh+os-tlt-os/2);
  if(srf) {
    nPaths.moveTo(-s, lh);//top-left-serif
    nPaths.lineTo(0, lh);
    nPaths.lineTo(0, lh-tlt-sh);
    nPaths.curveTo(0, lh-tlt-sh/2, -s/2, lh-tlt, -s, lh-tlt);

    nPaths.moveTo(t+s, 0);//bottom-left-serif
    nPaths.lineTo(-s, 0);
    nPaths.lineTo(-s, tlt);
    nPaths.curveTo(-s/2, tlt, 0, tlt+sh/2, 0, tlt+sh);
    nPaths.lineTo(t, tlt+sh);
    nPaths.curveTo(t, tlt+sh/2, t+s/2, tlt, t+s, tlt);

    nPaths.moveTo(nws+s, 0);//bottom-right-serif
    nPaths.lineTo(nws, 0);
    nPaths.lineTo(nws, tlt+sh);
    nPaths.curveTo(nws, tlt+sh/2, nws+s/2, tlt, nws+s, tlt);
  }
  var nGlyphs = new opentype.Glyph({
    name: 'n',
    unicode: 110,
    advanceWidth: lw+s*2+g,
    path: nPaths
  });


  var oPaths = new opentype.Path();
  var oarcs = arc;
  var ows = lw;
  if(oarcs > ows/2)
  oarcs = Math.round((ows/2)/10)*10;
  if(oarcs > lh/2)
  oarcs = Math.round((lh/2)/10)*10;
  if(oarcs*2>=ows*0.8)
  os= lh*0.03*(100-(ows-oarcs*2))/100;
  else os=0;

  oPaths.moveTo(0, lh+os-oarcs-os/2);//left-top-arc
  oPaths.curveTo(0, lh+os-oarcs+oarcs/2-os/2, oarcs/2, lh+os-os/2, oarcs, lh+os-os/2);
  oPaths.lineTo(oarcs, lh+os-tlt-os/2);
  oPaths.curveTo(oarcs-(oarcs-t)/2, lh+os-tlt-os/2, t, lh+os-oarcs+(oarcs-tlt)/2-os/2, t, lh+os-oarcs-os/2);
  oPaths.moveTo(ows-oarcs, lh+os-os/2);//riglht-top-arc
  oPaths.curveTo(ows-oarcs/2, lh+os-os/2, ows, lh+os-oarcs/2-os/2, ows, lh+os-oarcs-os/2);
  oPaths.lineTo(ows-t, lh+os-oarcs-os/2);
  oPaths.curveTo(ows-t, lh+os-oarcs+(oarcs-tlt)/2-os/2, ows-oarcs+(oarcs-t)/2, lh+os-tlt-os/2, ows-oarcs, lh+os-tlt-os/2);
  oPaths.moveTo(t, oarcs-os/2);//left-bottom-arc
  oPaths.curveTo(t, oarcs-(oarcs-tlt)/2-os/2, oarcs-(oarcs-t)/2, tlt-os/2, oarcs, tlt-os/2);
  oPaths.lineTo(oarcs, 0-os/2);
  oPaths.curveTo(oarcs/2, 0-os/2, 0, oarcs/2-os/2, 0, oarcs-os/2);
  oPaths.moveTo(ows, oarcs-os/2);//riglht-oottom-arc
  oPaths.curveTo(ows, oarcs/2-os/2, ows-oarcs/2, 0-os/2, ows-oarcs, 0-os/2);
  oPaths.lineTo(ows-oarcs, tlt-os/2);
  oPaths.curveTo(ows-oarcs+(oarcs-t)/2, tlt-os/2, ows-t, oarcs-(oarcs-tlt)/2-os/2, ows-t, oarcs-os/2);
  oPaths.moveTo(0, lh-oarcs+os/2);//left
  oPaths.lineTo(t, lh-oarcs+os/2);
  oPaths.lineTo(t, oarcs-os/2);
  oPaths.lineTo(0, oarcs-os/2);
  oPaths.moveTo(ows-t, lh+os-oarcs-os/2);//riglht
  oPaths.lineTo(ows, lh+os-oarcs-os/2);
  oPaths.lineTo(ows, oarcs-os/2);
  oPaths.lineTo(ows-t, oarcs-os/2);
  oPaths.moveTo(oarcs, lh+os-os/2);//top
  oPaths.lineTo(ows-oarcs, lh+os-os/2);
  oPaths.lineTo(ows-oarcs, lh+os-tlt-os/2);
  oPaths.lineTo(oarcs, lh+os-tlt-os/2);
  oPaths.moveTo(oarcs, 0-os/2);//oottom
  oPaths.lineTo(oarcs, tlt-os/2);
  oPaths.lineTo(ows-oarcs, tlt-os/2);
  oPaths.lineTo(ows-oarcs, 0-os/2);
  var oGlyphs = new opentype.Glyph({
    name: 'o',
    unicode: 111,
    advanceWidth: lw+s*2+g,
    path: oPaths
  });



  var rPaths = new opentype.Path();
  var rarcs = arc;
  var rws = lw/2+30;
  if(rws <= rarcs)
  rarcs = Math.round((rws)/10)*10;
  else rarcs = arc;
  if(rarcs>=rws*0.8)
  os= lh*0.03*(100-(rws-rarcs))/100;
  else os=0;

  rPaths.moveTo(0, lh+os-rarcs-os/2);//left-top-arc
  rPaths.curveTo(0, lh+os-rarcs+rarcs/2-os/2, rarcs/2, lh+os-os/2, rarcs, lh+os-os/2);
  rPaths.lineTo(rarcs, lh+os-tlt-os/2);
  rPaths.curveTo(rarcs-(rarcs-t)/2, lh+os-tlt-os/2, t, lh+os-rarcs+(rarcs-tlt)/2-os/2, t, lh+os-rarcs-os/2);
  rPaths.moveTo(0, lh);//left
  rPaths.lineTo(t, lh);
  rPaths.lineTo(t, 0);
  rPaths.lineTo(0, 0);
  rPaths.moveTo(rarcs, lh+os/2);//top
  rPaths.lineTo(rws, lh+os/2);
  rPaths.lineTo(rws, lh-tlt+os/2);
  rPaths.lineTo(rarcs, lh-tlt+os/2);
  if(srf) {
    rPaths.moveTo(-s, lh);//top-left-serif
    rPaths.lineTo(0, lh);
    rPaths.lineTo(0, lh-tlt-sh);
    rPaths.curveTo(0, lh-tlt-sh/2, -s/2, lh-tlt, -s, lh-tlt);

    rPaths.moveTo(t+s, 0);//bottom-left-serif
    rPaths.lineTo(-s, 0);
    rPaths.lineTo(-s, tlt);
    rPaths.curveTo(-s/2, tlt, 0, tlt+sh/2, 0, tlt+sh);
    rPaths.lineTo(t, tlt+sh);
    rPaths.curveTo(t, tlt+sh/2, t+s/2, tlt, t+s, tlt);
  }
  var rGlyphs = new opentype.Glyph({
    name: 'r',
    unicode: 114,
    advanceWidth: rws+s+g,
    path: rPaths
  });



  var sPaths = new opentype.Path();
  var starcs = arc;
  var sbarcs = arc;
  if(starcs > (lh-lmh)/2)
  starcs = Math.round(((lh-lmh)/2)/10)*10;
  if(sbarcs >= (lmh+t)/2)
  sbarcs = Math.round(((lmh+t)/2)/10)*10;
  if(starcs > lw/2)
  starcs = Math.round((lw/2)/10)*10;
  if(sbarcs > lw/2)
  sbarcs = Math.round((lw/2)/10)*10;
  // if(starcs<=0)
  //   starcs =0;
  // if(sbarcs<=0)
  //   sbarcs =0;
  // else starcs = arc;

  sPaths.moveTo(0, lh-starcs);//left-top-arc
  sPaths.curveTo(0, lh-starcs+starcs/2, starcs/2, lh, starcs, lh);
  sPaths.lineTo(starcs, lh-tlt);
  sPaths.curveTo(starcs-(starcs-t)/2, lh-tlt, t, lh-starcs+(starcs-tlt)/2, t, lh-starcs);
  sPaths.moveTo(lw-starcs, lh);//right-top-arc
  sPaths.curveTo(lw-starcs/2, lh, lw, lh-starcs/2, lw, lh-starcs);
  sPaths.lineTo(lw-t, lh-starcs);
  sPaths.curveTo(lw-t, lh-starcs+(starcs-tlt)/2, lw-starcs+(starcs-t)/2, lh-tlt, lw-starcs, lh-tlt);
  sPaths.moveTo(t, sbarcs);//left-bottom-arc
  sPaths.curveTo(t, sbarcs-(sbarcs-tlt)/2, sbarcs-(sbarcs-t)/2, tlt, sbarcs, tlt);
  sPaths.lineTo(sbarcs, 0);
  sPaths.curveTo(sbarcs/2, 0, 0, sbarcs/2, 0, sbarcs);
  sPaths.moveTo(lw, sbarcs);//right-bottom-arc
  sPaths.curveTo(lw, sbarcs/2, lw-sbarcs/2, 0, lw-sbarcs, 0);
  sPaths.lineTo(lw-sbarcs, tlt);
  sPaths.curveTo(lw-sbarcs+(sbarcs-t)/2, tlt, lw-t, sbarcs-(sbarcs-tlt)/2, lw-t, sbarcs);
  sPaths.moveTo(t, lmh+starcs);//left-middle-arc
  sPaths.curveTo(t, lmh+starcs-(starcs-t)/2, starcs-(starcs-t)/2, lmh+t, starcs, lmh+t);
  sPaths.lineTo(starcs, lmh);
  sPaths.curveTo(starcs/2, lmh, 0, lmh+starcs/2, 0, lmh+starcs);
  sPaths.moveTo(lw-sbarcs, lmh+t);//right-middle-arc
  sPaths.curveTo(lw-sbarcs/2, lmh+t, lw, lmh+t-sbarcs/2, lw, lmh+t-sbarcs);
  sPaths.lineTo(lw-t, lmh+t-sbarcs);
  sPaths.curveTo(lw-t, lmh+t-sbarcs+(sbarcs-t)/2, lw-sbarcs+(sbarcs-t)/2, lmh+t-t, lw-sbarcs, lmh+t-t);
  sPaths.moveTo(starcs, lmh+t);//middle
  sPaths.lineTo(lw-sbarcs, lmh+t);
  sPaths.lineTo(lw-sbarcs, lmh);
  sPaths.lineTo(starcs, lmh);
  sPaths.moveTo(0, lh-starcs);//left
  sPaths.lineTo(t, lh-starcs);
  sPaths.lineTo(t, lmh+starcs);
  sPaths.lineTo(0, lmh+starcs);
  sPaths.moveTo(lw-t, lmh+t-sbarcs);//right
  sPaths.lineTo(lw, lmh+t-sbarcs);
  sPaths.lineTo(lw, sbarcs);
  sPaths.lineTo(lw-t, sbarcs);
  sPaths.moveTo(starcs, lh);//top
  sPaths.lineTo(lw-starcs, lh);
  sPaths.lineTo(lw-starcs, lh-tlt);
  sPaths.lineTo(starcs, lh-tlt);
  sPaths.moveTo(sbarcs, 0);//bottom
  sPaths.lineTo(sbarcs, tlt);
  sPaths.lineTo(lw-sbarcs, tlt);
  sPaths.lineTo(lw-sbarcs, 0);
  if(starcs<t) {
    sPaths.moveTo(lw-t, lh-starcs);//left-bottom
    sPaths.lineTo(lw, lh-starcs);
    sPaths.lineTo(lw, lh-t);
    sPaths.lineTo(lw-t, lh-t);
  }
  if(sbarcs<t) {
    sPaths.moveTo(0, t);//left-bottom
    sPaths.lineTo(t, t);
    sPaths.lineTo(t, sbarcs);
    sPaths.lineTo(0, sbarcs);
  }
  if(srf) {
    sPaths.moveTo(lw, lh-starcs);//right-top-serif
    sPaths.lineTo(lw-tlt, lh-starcs);
    sPaths.lineTo(lw-tlt-tlt*0.1, lh-starcs+starcs/2);
    sPaths.lineTo(lw-tlt, lh-starcs+s*starcs*0.01);
    sPaths.lineTo(lw, lh-starcs+s*starcs*0.01);

    sPaths.moveTo(0, sbarcs);//left-bottom-serif
    sPaths.lineTo(tlt, sbarcs);
    sPaths.lineTo(tlt+tlt*0.1, sbarcs/2);
    sPaths.lineTo(tlt, sbarcs-s*starcs*0.01);
    sPaths.lineTo(0, sbarcs-s*starcs*0.01);
  }
  var sGlyphs = new opentype.Glyph({
    name: 's',
    unicode: 115,
    advanceWidth: lw+s*2+g,
    path: sPaths
  });


  var tPaths = new opentype.Path();
  var tws = lw/4*3;
  var tarcs = Math.round((arc/3*2)/10)*10;
  if(tws < t*2)
  tws = t*2;
  if(tarcs-t/2 > tws/2)
  tarcs = Math.round((tws/2+t/2)/10)*10;

  tPaths.moveTo(tws/2-t/2+t, tarcs);//left-bottom-arc
  tPaths.curveTo(tws/2-t/2+t, tarcs-(tarcs-tlt)/2, tws/2-t/2+tarcs-(tarcs-t)/2, tlt, tws/2-t/2+tarcs, tlt);
  tPaths.lineTo(tws/2-t/2+tarcs, 0);
  tPaths.curveTo(tws/2-t/2+tarcs/2, 0, tws/2-t/2, tarcs/2, tws/2-t/2, tarcs);
  tPaths.moveTo(tws/2-t/2, (lhh-lh)/2+lh);//center
  tPaths.lineTo(tws/2+t/2, (lhh-lh)/2+lh);
  tPaths.lineTo(tws/2+t/2, tarcs);
  tPaths.lineTo(tws/2-t/2, tarcs);
  tPaths.moveTo(0, lh);//horizontal
  tPaths.lineTo(tws, lh);
  tPaths.lineTo(tws, lh-t);
  tPaths.lineTo(0, lh-t);
  if(tarcs-t/2 < tws/2) {
    tPaths.moveTo(tws/2-t/2+tarcs, 0);//bottom
    tPaths.lineTo(tws/2-t/2+tarcs, tlt);
    tPaths.lineTo(tws, tlt);
    tPaths.lineTo(tws, 0);
  }
  var tGlyphs = new opentype.Glyph({
    name: 't',
    unicode: 116,
    advanceWidth: lw+s*2+g,
    path: tPaths
  });




  var glyphs = [notdefGlyph, tGlyph,aGlyphs, fGlyphs, nGlyphs, oGlyphs, rGlyphs, sGlyphs, tGlyphs];
    font = new opentype.Font({
      familyName: 'TransFont',
      styleName: styleWeight,
      unitsPerEm: 1000,
      ascender: 800,
      descender: -200,
      glyphs: glyphs
    });
    var buffer = font.toArrayBuffer();
    font2 = opentype.parse(buffer);

    // document.getElementById('fontFamilyName').innerHTML = font2.names.fontFamily.en;

    for (var i = 0; i < font2.glyphs.length; i++) {
      var ctx;
      var glyph = font2.glyphs.get(i);
      var canvasSizeX = 70;
      var canvasSizeY = 65;
      var x = 10;
      var y = 45;
      var fontSize_g = 50;
      if(!firstDraw) {//만약 이게 처음 그리는게 아니라면 칸의 이름만 받아와서
        ctx = document.getElementById('c' + glyph.index).getContext('2d');
        ctx.clearRect(0, 0, canvasSizeX, canvasSizeY+20); // 흰색 네모를 그려서 덮어버리는거임
      }
      else
      ctx = createGlyphCanvas(glyph, canvasSizeX, canvasSizeY);
      glyph.draw(ctx, x, y, fontSize_g);
      // glyph.drawPoints(ctx, x, y, fontSize_g);
      // glyph.drawMetrics(ctx, x, y, fontSize_g);
    }
  }

function renderTextPreview() { //써둔 글자를 받아서 프리뷰에 써주는 부분
    if (!font2) return;
    textToRender = document.getElementById('textField').value;
    var previewCtx = document.getElementById('preview').getContext('2d');
    var options = {};
    previewCtx.clearRect(0, 0, 940, 300);
    for (var i = 0; i < textToRender.length; i++) {
      if(textToRender[i] != 'r')
        font2.draw(previewCtx, textToRender[i], ((w+s*2)/9+30)*i*fontSize*0.007+10, 200, fontSize, options);
      else
      font2.draw(previewCtx, textToRender[i], ((w+s*2)/9+35)*i*fontSize*0.007+10, 200, fontSize, options);
      // font2.drawPoints(previewCtx, textToRender[i], ((w+s*2)/9+30)*i*fontSize*0.007+10, 200, fontSize, options);
    }
  }

function fontChanged() { //슬라이드를 통해 사이즈가 바뀌면 다시 작동 시켜서 수치를 바꿔주는 부분
    fontSize = parseInt(fontSizeSlider.value, 10);
    document.getElementById('fontSize').innerHTML = '' + fontSize;
    //t = parseInt(thickSizeSlider.value, 10);
    document.getElementById('thickSize').innerHTML = '' + t;
    //arc = parseInt(arcSlider.value, 10);
    document.getElementById('arcSize').innerHTML = '' + arc;
    //w = parseInt(widthSlider.value, 10);
    document.getElementById('widthSize').innerHTML = '' + w;
    //mh = parseInt(mhSlider.value, 10);
    document.getElementById('mhSize').innerHTML = '' + mh;
    //lt = parseInt(ltSlider.value, 10)/10;
    document.getElementById('ltSize').innerHTML = '' + lt;
    //s = parseInt(serifSlider.value, 10);
    document.getElementById('serifSize').innerHTML = '' + s;
    sh = parseInt(shSlider.value, 10);
    document.getElementById('shSize').innerHTML = '' + sh;
    renderTextPreview();
    createGlyphFont(false);
  }

function enableHighDPICanvas(canvas) {//화질 좋게하는 부분
    if (typeof canvas === 'string') {
      canvas = document.getElementById(canvas);
    }
    var pixelRatio = window.devicePixelRatio || 1;
    if (pixelRatio === 1) return;
    var oldWidth = canvas.width;
    var oldHeight = canvas.height;
    canvas.width = oldWidth * pixelRatio;
    canvas.height = oldHeight * pixelRatio;
    canvas.style.width = oldWidth + 'px';
    canvas.style.height = oldHeight + 'px';
    canvas.getContext('2d').scale(pixelRatio, pixelRatio);
    fontChanged();
  }

function serifChanged(e) {
    srf = e.checked;
    fontChanged();
    renderTextPreview();
  }

  // fontSizeSlider.addEventListener('input', fontChanged, false); // 슬라이더가 바뀔때마다 인지하게 하는 곳
  // fontSizeSlider.addEventListener('change', fontChanged, false);
  // thickSizeSlider.addEventListener('input', fontChanged, false); // 슬라이더가 바뀔때마다 인지하게 하는 곳
  // thickSizeSlider.addEventListener('change', fontChanged, false);
  // arcSlider.addEventListener('input', fontChanged, false); // 슬라이더가 바뀔때마다 인지하게 하는 곳
  // arcSlider.addEventListener('change', fontChanged, false);
  // widthSlider.addEventListener('input', fontChanged, false); // 슬라이더가 바뀔때마다 인지하게 하는 곳
  // widthSlider.addEventListener('change', fontChanged, false);
  // mhSlider.addEventListener('input', fontChanged, false); // 슬라이더가 바뀔때마다 인지하게 하는 곳
  // mhSlider.addEventListener('change', fontChanged, false);
  // ltSlider.addEventListener('input', fontChanged, false); // 슬라이더가 바뀔때마다 인지하게 하는 곳
  // ltSlider.addEventListener('change', fontChanged, false);
  // serifSlider.addEventListener('input', fontChanged, false); // 슬라이더가 바뀔때마다 인지하게 하는 곳
  // serifSlider.addEventListener('change', fontChanged, false);
  // shSlider.addEventListener('input', fontChanged, false); // 슬라이더가 바뀔때마다 인지하게 하는 곳
  // shSlider.addEventListener('change', fontChanged, false);
