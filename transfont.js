// var fontSizeSlider = document.getElementById("font-size-range");
var thickSizeSlider = document.getElementById("thickSize-range");
var arcsSlider = document.getElementById("arc-range");
var widthSlider = document.getElementById("width-range");
var mhSlider = document.getElementById("mh-range");
var ltSlider = document.getElementById("lt-range");
var serifSlider = document.getElementById("serif-range");
var shSlider = document.getElementById("sh-range");

var fontSize = 180;
var textToRender = "ABC!";
var font = null;
var font2 = null;
var fontW = []; //font advencedWidth

var t=100; //thickSize
let w=450;//600; // width
var h=700; // height
var arcs = 320; //arc
var lt = 1;//0.3;//light-thickSize 왼쪽이 아니라 얇아야 할 부분에 다 부여.
var mh = 300;//300;//middle-height
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
  for (var i = 2; i < font2.glyphs.length; i++) {
    enableHighDPICanvas('c'+i);//화질 좋게하는 부분
  }
}

function createGlyphCanvas(glyph, sizeX, sizeY) { // 글자 글리프가 들어가는 HTML 칸을 만들어 주는 부분
  var canvasId, html, glyphsDiv, wrap, canvas, ctx;
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

  if(lmh > lh-t*2)
  lmh = lh-t*2;
  if(tlt*2 < lh) {
    if(lmh < tlt)
    lmh = tlt;
  }
  else if(lmh < tlt)
  lmh = tlt;
  if(t >= lh)
  lmh = lh-t;

  if(!srf)
    s = 0;


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
  notdefPath.moveTo(t, tlt);
  notdefPath.lineTo(w-t, tlt);
  notdefPath.lineTo(w-t, h-tlt);
  notdefPath.lineTo(t, h-tlt);
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

  var spacePath = new opentype.Path();
  var spaceGlyph = new opentype.Glyph({
    name: ' ',
    unicode: 32,
    advanceWidth: w/2+s*2+g,
    path: spacePath
  });

  var aPath = new opentype.Path();
  amh = mh;
  if(amh<t*2) {
    amh=t*2;
  }
  aPath.moveTo(0, 0);//left
  aPath.lineTo(w/2-t*1.1/2, h);
  aPath.lineTo(w/2-t*1.1/2+tlt*1.1, h);
  aPath.lineTo(tlt*1.1, 0);
  aPath.moveTo(w-t*1.1, 0);//right
  aPath.lineTo(w/2-t*1.1/2, h);
  aPath.lineTo(w/2+t*1.1/2, h);
  aPath.lineTo(w, 0);
  aPath.moveTo(tlt/4+((w/2-tlt/2)*0.0097*amh/7), amh-tlt);//middle
  aPath.lineTo(tlt/4+((w/2-tlt/2)*0.0097*amh/7), amh);
  aPath.lineTo(w-t/4-((w/2-t/2)*0.01*amh/7), amh);
  aPath.lineTo(w-t/4-((w/2-t/2)*0.01*amh/7), amh-tlt);
  if(srf) {
    aPath.moveTo(-s*0.6, 0);//left-serif
    aPath.lineTo(-s*0.6, tlt);
    aPath.curveTo(-s*0.6/2, tlt, tlt, tlt+sh/2, tlt+(w/2-tlt/2)*sh*0.0016, tlt+sh);
    aPath.curveTo(tlt, tlt+sh/2, tlt+s*0.6, tlt, tlt+s, tlt);
    aPath.lineTo(tlt+s, 0);
    aPath.moveTo(w-t-s, 0);//right-serif
    aPath.lineTo(w-t-s, tlt);
    aPath.curveTo(w-t-s*0.6, tlt, w-tlt, tlt+sh/2, w-tlt-(w/2-tlt/2)*sh*0.0016, tlt+sh);
    aPath.curveTo(w-tlt, tlt+sh/2, w+s*0.6/2, tlt, w+s*0.6, tlt);
    aPath.lineTo(w+s*0.6, tlt);
    aPath.lineTo(w+s*0.6, 0);
  }
  var aGlyph = new opentype.Glyph({
    name: 'A',
    unicode: 65,
    advanceWidth: w+s*2+g,
    path: aPath
  });

  var bPath = new opentype.Path();
  var btarc = arcs;
  var bbarc = arcs;
  if((h-mh)/2 < btarc)
  btarc = Math.round(((h-mh)/2)/10)*10;
  if((mh+tlt)/2 < bbarc)
  bbarc = Math.round(((mh+tlt)/2)/10)*10;
  if(btarc > w*0.9-t)
  btarc = Math.round((w-t)/10)*10;
  if(bbarc > w-t)
  bbarc = Math.round((w-t)/10)*10;
  bPath.moveTo(0, 0);//left
  bPath.lineTo(0, h);
  bPath.lineTo(t, h);
  bPath.lineTo(t, 0);

  bPath.moveTo(w*0.9-t, h-btarc); //top-arc-connection
  bPath.lineTo(w*0.9, h-btarc);
  bPath.lineTo(w*0.9, mh+btarc);
  bPath.lineTo(w*0.9-t, mh+btarc);
  bPath.moveTo(w-t, mh+tlt-bbarc); //bottom-arc-connection
  bPath.lineTo(w, mh+tlt-bbarc);
  bPath.lineTo(w, bbarc);
  bPath.lineTo(w-t, bbarc);

  bPath.moveTo(0, mh);//middle to bottom-top-arc
  bPath.lineTo(0, mh+tlt);
  bPath.lineTo(w-bbarc, mh+tlt);
  bPath.curveTo(w-bbarc/2, mh+tlt, w, mh+tlt-bbarc/2, w, mh+tlt-bbarc);
  bPath.lineTo(w-t, mh+tlt-bbarc);
  bPath.curveTo(w-t, mh+tlt-bbarc+(bbarc-tlt)/2, w-bbarc+(bbarc-t)/2, mh,  w-bbarc, mh);
  bPath.moveTo(w, bbarc);//bottom-bottom-arc
  bPath.curveTo(w, bbarc/2, w-bbarc/2, 0, w-bbarc, 0);
  bPath.lineTo(0, 0);
  bPath.lineTo(0, tlt);
  bPath.lineTo(w-bbarc, tlt);
  bPath.curveTo(w-bbarc+(bbarc-t)/2, tlt, w-t, tlt+(bbarc-tlt)/2, w-t, bbarc);
  bPath.moveTo(0, h);//top to top-top-arc
  bPath.lineTo(w*0.9-btarc, h);
  bPath.curveTo(w*0.9-btarc/2, h, w*0.9, h-btarc/2, w*0.9, h-btarc);
  bPath.lineTo(w*0.9-t, h-btarc);
  bPath.curveTo(w*0.9-t, h-btarc+(btarc-tlt)/2, w*0.9-btarc+(btarc-t)/2, h-tlt, w*0.9-btarc, h-tlt);
  bPath.lineTo(0, h-tlt);
  bPath.moveTo(w*0.9-t, mh+btarc);//middle to top-bottom-arc
  bPath.lineTo(w*0.9, mh+btarc);
  bPath.curveTo(w*0.9, mh+btarc-btarc/2, w*0.9-btarc/2, mh, w*0.9-btarc, mh);
  bPath.lineTo(0,mh);
  bPath.lineTo(0,mh+tlt);
  bPath.lineTo(w*0.9-btarc, mh+tlt);
  bPath.curveTo(w*0.9-btarc+(btarc-t)/2, mh+tlt, w*0.9-t, mh+tlt+(btarc-tlt)/2, w*0.9-t, mh+btarc);
  if(srf) {
    bPath.moveTo(t+s, 0);//bottom-left-serif
    bPath.lineTo(-s, 0);
    bPath.lineTo(-s, tlt);
    bPath.curveTo(-s/2, tlt, 0, tlt+sh/2, 0, tlt+sh);
    bPath.lineTo(t, tlt+sh);
    bPath.curveTo(t, tlt+sh/2, t+s/2, tlt, t+s, tlt);
    bPath.moveTo(-s, h);//top-left-serif
    bPath.lineTo(t+s, h);
    bPath.lineTo(t+s, h-tlt);
    bPath.curveTo(t+s/2, h-tlt, t, h-tlt-sh/2, t, h-tlt-sh);
    bPath.lineTo(0, h-tlt-sh);
    bPath.curveTo(0, h-tlt-sh/2, -s/2, h-tlt, -s, h-tlt);
  }
  var bGlyph = new opentype.Glyph({
    name: 'B',
    unicode: 66,
    advanceWidth: w+s+g,
    path: bPath
  });

  var cPath = new opentype.Path();
  var carc = arcs;

  if(carc >= w/2)
  carc = Math.round((w/2)/10)*10;
  if(carc >= (h-h/8)/2)
  carc = Math.round(((h-h/8)/2)/10)*10;//h/8은 C 사이의 갭 크기
  if(carc*2>=w*0.8)
  os= h*0.06*(w*0.2-(w-carc*2))/100;
  // else if(carc*2>=h*0.8) {
  //   os= h*0.06*(h*0.2-(h-carc*2))/100;
  // }
  else
  os = 0;

  cPath.moveTo(0, h+os-carc-os/2);//left
  cPath.lineTo(t, h+os-carc-os/2);
  cPath.lineTo(t, carc-os/2);
  cPath.lineTo(0, carc-os/2);
  cPath.moveTo(carc, h+os-os/2);//top
  cPath.lineTo(w-carc, h+os-os/2);
  cPath.lineTo(w-carc, h+os-tlt-os/2);
  cPath.lineTo(carc, h+os-tlt-os/2);
  cPath.moveTo(carc, 0-os/2);//bottom
  cPath.lineTo(carc, tlt-os/2);
  cPath.lineTo(w-carc, tlt-os/2);
  cPath.lineTo(w-carc, 0-os/2);
  cPath.moveTo(0, h+os-carc-os/2);//left-top-arc
  cPath.curveTo(0, h+os-carc+carc/2-os/2, carc/2, h+os-os/2, carc, h+os-os/2);
  cPath.lineTo(carc, h+os-tlt-os/2);
  cPath.curveTo(carc-(carc-t)/2, h+os-tlt-os/2, t, h+os-carc+(carc-tlt)/2-os/2, t, h+os-carc-os/2);
  cPath.moveTo(w-carc, h+os-os/2);//right-top-arc
  cPath.curveTo(w-carc/2, h+os-os/2, w, h+os-carc/2-os/2, w, h+os-carc-os/2);
  cPath.lineTo(w-tlt, h+os-carc-os/2);
  cPath.curveTo(w-tlt, h+os-carc+(carc-tlt)/2-os/2, w-carc+(carc-tlt)/2, h+os-tlt-os/2, w-carc, h+os-tlt-os/2);
  cPath.moveTo(t, carc-os/2);//left-bottom-arc
  cPath.curveTo(t, carc-(carc-tlt)/2-os/2, carc-(carc-t)/2, tlt-os/2, carc, tlt-os/2);
  cPath.lineTo(carc, 0-os/2);
  cPath.curveTo(carc/2, 0-os/2, 0, carc/2-os/2, 0, carc-os/2);
  cPath.moveTo(w, carc-os/2);//right-bottom-arc
  cPath.curveTo(w, carc/2-os/2, w-carc/2, 0-os/2, w-carc, 0-os/2);
  cPath.lineTo(w-carc, tlt-os/2);
  cPath.curveTo(w-carc+(carc-tlt)/2, tlt-os/2, w-tlt, carc-(carc-tlt)/2-os/2, w-tlt, carc-os/2);
  if(srf) {
    cPath.moveTo(w, h-carc);//right-top-serif
    cPath.lineTo(w-tlt, h-carc);
    cPath.lineTo(w-tlt-sh*0.1, h-carc+carc/2);
    cPath.lineTo(w-tlt, h-carc+s*carc*0.01);
    cPath.lineTo(w, h-carc+s*carc*0.01);
    cPath.moveTo(w, carc);//right-bottom-serif
    cPath.lineTo(w, carc-s*carc*0.01);
    cPath.lineTo(w-tlt, carc-s*carc*0.01);
    cPath.lineTo(w-tlt-sh*0.1, carc-carc/2);
    cPath.lineTo(w-tlt, carc);
  }
  if(carc<tlt) {
    cPath.moveTo(w-carc-t, h+os-carc-os/2);//top-right arcs끝부분 두께보다 작아지면서 역으로 말려들어가 구멍낙는거 막기
    cPath.lineTo(w, h+os-carc-os/2);
    cPath.lineTo(w, h+os-tlt-os/2);
    cPath.lineTo(w-carc-t, h+os-tlt-os/2);

    cPath.moveTo(w-carc-t, tlt-os/2);//bottom-right arcs
    cPath.lineTo(w, tlt-os/2);
    cPath.lineTo(w, carc-os/2);
    cPath.lineTo(w-carc-t, carc-os/2);
  }

  var cGlyph = new opentype.Glyph({
    name: 'C',
    unicode: 67,
    advanceWidth: w+s+g,
    path: cPath
  });

  var dPath = new opentype.Path();
  var darc= arcs;
  if(darc > h/2)
  darc = Math.round(h/2);
  if(darc > w-t)
  darc = Math.round(w-t);

  dPath.moveTo(0, h);//right-top-arc
  dPath.lineTo(w-darc, h);
  dPath.curveTo(w-darc/2, h, w, h-darc/2, w, h-darc);
  dPath.lineTo(w-t, h-darc);
  dPath.curveTo(w-t, h-darc+(darc-tlt)/2, w-darc+(darc-t)/2, h-tlt, w-darc, h-tlt);
  dPath.lineTo(0, h-tlt);
  dPath.moveTo(w, darc);//right-bottom-arc
  dPath.curveTo(w, darc/2, w-darc/2, 0, w-darc, 0);
  dPath.lineTo(0, 0);
  dPath.lineTo(0, tlt);
  dPath.lineTo(w-darc, tlt);
  dPath.curveTo(w-darc+(darc-t)/2, tlt, w-t, darc-(darc-tlt)/2, w-t, darc);
  dPath.moveTo(0, h);//left
  dPath.lineTo(t, h);
  dPath.lineTo(t, 0);
  dPath.lineTo(0, 0);
  dPath.moveTo(w-t, h-darc);//right
  dPath.lineTo(w, h-darc);
  dPath.lineTo(w, darc);
  dPath.lineTo(w-t, darc);
  if(srf) {
    dPath.moveTo(t+s, 0);//bottom-left-serif
    dPath.lineTo(-s, 0);
    dPath.lineTo(-s, tlt);
    dPath.curveTo(-s/2, tlt, 0, tlt+sh/2, 0, tlt+sh);
    dPath.lineTo(t, tlt+sh);
    dPath.curveTo(t, tlt+sh/2, t+s/2, tlt, t+s, tlt);
    dPath.moveTo(-s, h);//top-left-serif
    dPath.lineTo(t+s, h);
    dPath.lineTo(t+s, h-tlt);
    dPath.curveTo(t+s/2, h-tlt, t, h-tlt-sh/2, t, h-tlt-sh);
    dPath.lineTo(0, h-tlt-sh);
    dPath.curveTo(0, h-tlt-sh/2, -s/2, h-tlt, -s, h-tlt);
  }
  var dGlyph = new opentype.Glyph({
    name: 'D',
    unicode: 68,
    advanceWidth: w+s+g,
    path: dPath
  });

  var ePath = new opentype.Path();
  ePath.moveTo(0, h);//left
  ePath.lineTo(t, h);
  ePath.lineTo(t, 0);
  ePath.lineTo(0, 0);
  ePath.moveTo(0, h);//top
  ePath.lineTo(w*0.9, h);
  ePath.lineTo(w*0.9, h-tlt);
  ePath.lineTo(0, h-tlt);
  ePath.moveTo(0, mh+tlt);//middle
  ePath.lineTo(w*0.8, mh+tlt);
  ePath.lineTo(w*0.8, mh);
  ePath.lineTo(0, mh);
  ePath.moveTo(0, tlt);//bottom
  ePath.lineTo(w, tlt);
  ePath.lineTo(w, 0);
  ePath.lineTo(0, 0);
  if(srf) {
    ePath.moveTo(w*0.9, h-tlt);//top-right-serif
    ePath.lineTo(w*0.9, h-tlt-s);
    ePath.lineTo(w*0.9-tlt, h-tlt-s);
    ePath.curveTo(w*0.9-tlt, h-tlt-s/2, w*0.9-tlt-sh/2, h-tlt, w*0.9-tlt-sh, h-tlt);
    ePath.moveTo(w-tlt-sh, tlt);//bottom-right-serif
    ePath.curveTo(w-tlt-sh/2, tlt, w-tlt, tlt+s/2, w-tlt, tlt+s);
    ePath.lineTo(w, tlt+s);
    ePath.lineTo(w, tlt);
    ePath.moveTo(w*0.8, mh+tlt+s);//middle-serif
    ePath.lineTo(w*0.8, mh-s);
    ePath.lineTo(w*0.8-tlt, mh-s);
    ePath.curveTo(w*0.8-tlt, mh-s/2, w*0.8-tlt-sh/2, mh, w*0.8-tlt-sh, mh);
    ePath.lineTo(w*0.8-tlt-sh, mh+tlt);
    ePath.curveTo(w*0.8-tlt-sh/2, mh+tlt, w*0.8-tlt, mh+tlt+s/2, w*0.8-tlt, mh+tlt+s);

    ePath.moveTo(t+s, 0);//bottom-left-serif
    ePath.lineTo(-s, 0);
    ePath.lineTo(-s, tlt);
    ePath.curveTo(-s/2, tlt, 0, tlt+sh/2, 0, tlt+sh);
    ePath.lineTo(t, tlt+sh);
    ePath.curveTo(t, tlt+sh/2, t+s/2, tlt, t+s, tlt);
    ePath.moveTo(-s, h);//top-left-serif
    ePath.lineTo(t+s, h);
    ePath.lineTo(t+s, h-tlt);
    ePath.curveTo(t+s/2, h-tlt, t, h-tlt-sh/2, t, h-tlt-sh);
    ePath.lineTo(0, h-tlt-sh);
    ePath.curveTo(0, h-tlt-sh/2, -s/2, h-tlt, -s, h-tlt);
  }
  var eGlyph = new opentype.Glyph({
    name: 'E',
    unicode: 69,
    advanceWidth: w+s+g,
    path: ePath
  });

  var fPath = new opentype.Path();
  fPath.moveTo(0, h);//left
  fPath.lineTo(t, h);
  fPath.lineTo(t, 0);
  fPath.lineTo(0, 0);
  fPath.moveTo(0, h);//top
  fPath.lineTo(w*0.9, h);
  fPath.lineTo(w*0.9, h-tlt);
  fPath.lineTo(0, h-tlt);
  fPath.moveTo(0, mh+tlt);//middle
  fPath.lineTo(w*0.8, mh+tlt);
  fPath.lineTo(w*0.8, mh);
  fPath.lineTo(0, mh);
  if(srf) {
    fPath.moveTo(w*0.9, h-tlt);//top-right-serif
    fPath.lineTo(w*0.9, h-tlt-s);
    fPath.lineTo(w*0.9-tlt, h-tlt-s);
    fPath.curveTo(w*0.9-tlt, h-tlt-s/2, w*0.9-tlt-sh/2, h-tlt, w*0.9-tlt-sh, h-tlt);
    fPath.moveTo(w*0.8, mh+tlt+s);//middle-serif
    fPath.lineTo(w*0.8, mh-s);
    fPath.lineTo(w*0.8-tlt, mh-s);
    fPath.curveTo(w*0.8-tlt, mh-s/2, w*0.8-tlt-sh/2, mh, w*0.8-tlt-sh, mh);
    fPath.lineTo(w*0.8-tlt-sh, mh+tlt);
    fPath.curveTo(w*0.8-tlt-sh/2, mh+tlt, w*0.8-tlt, mh+tlt+s/2, w*0.8-tlt, mh+tlt+s);

    fPath.moveTo(t+s, 0);//bottom-left-serif
    fPath.lineTo(-s, 0);
    fPath.lineTo(-s, tlt);
    fPath.curveTo(-s/2, tlt, 0, tlt+sh/2, 0, tlt+sh);
    fPath.lineTo(t, tlt+sh);
    fPath.curveTo(t, tlt+sh/2, t+s/2, tlt, t+s, tlt);
    fPath.moveTo(-s, h);//top-left-serif
    fPath.lineTo(t+s, h);
    fPath.lineTo(t+s, h-tlt);
    fPath.curveTo(t+s/2, h-tlt, t, h-tlt-sh/2, t, h-tlt-sh);
    fPath.lineTo(0, h-tlt-sh);
    fPath.curveTo(0, h-tlt-sh/2, -s/2, h-tlt, -s, h-tlt);
  }
  var fGlyph = new opentype.Glyph({
    name: 'F',
    unicode: 70,
    advanceWidth: w+g,
    path: fPath
  });

  var gPath = new opentype.Path();
  var garc = arcs;
  if(garc > w/2)
  garc =  Math.round((w/2)/10)*10;
  if(garc > (h-t)/2)
  garc = Math.round(((h-t)/2)/10)*10;
  if(garc*2>=w*0.8)
  os= h*0.06*(w*0.2-(w-garc*2))/100;
  else os=0;

  gPath.moveTo(0, h+os-garc-os/2);//left-top-arc
  gPath.curveTo(0, h+os-garc+garc/2-os/2, garc/2, h+os-os/2, garc, h+os-os/2);
  gPath.lineTo(garc, h+os-tlt-os/2);
  gPath.curveTo(garc-(garc-t)/2, h+os-tlt-os/2, t, h+os-garc+(garc-tlt)/2-os/2, t, h+os-garc-os/2);
  gPath.moveTo(w-garc, h+os-os/2);//right-top-arc
  gPath.curveTo(w-garc/2, h+os-os/2, w, h+os-garc/2-os/2, w, h+os-garc-os/2);
  gPath.lineTo(w-tlt, h+os-garc-os/2);
  gPath.curveTo(w-tlt, h+os-garc+(garc-tlt)/2-os/2, w-garc+(garc-tlt)/2, h+os-tlt-os/2, w-garc, h+os-tlt-os/2);
  gPath.moveTo(0, garc-os/2);//left-bottom-arc
  gPath.lineTo(t, garc-os/2);
  gPath.curveTo(t, garc-(garc-tlt)/2-os/2, garc-(garc-t)/2, tlt-os/2, garc, tlt-os/2);
  gPath.lineTo(garc, 0-os/2);
  gPath.curveTo(garc/2, 0-os/2, 0, garc/2-os/2, 0, garc-os/2);
  gPath.moveTo(w, garc-os/2);//right-bottom-arc
  gPath.curveTo(w, garc/2-os/2, w-garc/2, 0-os/2, w-garc, 0-os/2);
  gPath.lineTo(w-garc, tlt-os/2);
  gPath.curveTo(w-garc+(garc-tlt)/2, tlt-os/2, w-tlt, garc-(garc-tlt)/2-os/2, w-tlt, garc-os/2);
  gPath.moveTo(0, h+os-garc-os/2);//left
  gPath.lineTo(t, h+os-garc-os/2);
  gPath.lineTo(t, garc-os/2);
  gPath.lineTo(0, garc-os/2);
  gPath.moveTo(garc, h+os-os/2);//top
  gPath.lineTo(w-garc, h+os-os/2);
  gPath.lineTo(w-garc, h+os-tlt-os/2);
  gPath.lineTo(garc, h+os-tlt-os/2);
  gPath.moveTo(garc, 0-os/2);//bottom
  gPath.lineTo(garc, tlt-os/2);
  gPath.lineTo(w-garc, tlt-os/2);
  gPath.lineTo(w-garc, 0-os/2);
  if(srf) {
    gPath.moveTo(w, h-garc);//right-top-serif
    gPath.lineTo(w-tlt, h-garc);
    gPath.lineTo(w-tlt-tlt*0.1, h-garc+garc/2);
    gPath.lineTo(w-tlt, h-garc+s*garc*0.01);
    gPath.lineTo(w, h-garc+s*garc*0.01);
    gPath.moveTo(w-t, mh);//right-bottom
    gPath.lineTo(w, mh);
    gPath.lineTo(w, 0);
    gPath.lineTo(w-t, 0);
    gPath.moveTo(w-t-s, mh);//right-bottom-serif
    gPath.lineTo(w+s, mh);
    gPath.lineTo(w+s, mh-tlt);
    gPath.curveTo(w+s/2, mh-tlt, w, mh-tlt-sh/2, w, mh-tlt-sh);
    gPath.lineTo(w-t, mh-tlt-sh);
    gPath.curveTo(w-t, mh-tlt-sh/2, w-t-s/2, mh-tlt, w-t-s, mh-tlt);
  }

  var gmh = mh;
  if(gmh <= garc)
  gmh = garc;
  if(gmh <= t*2)
  gmh = t*2;

  if(!srf) {
    gPath.moveTo(w/2, gmh-tlt);//middle
    gPath.lineTo(w/2, gmh);
    gPath.lineTo(w, gmh);
    gPath.lineTo(w, 0);
    gPath.lineTo(w-t, 0);
    gPath.lineTo(w-t, gmh-tlt);
  }

  if(garc<tlt) {
    gPath.moveTo(w-garc-t, h+os-garc-os/2);//top-right arcs끝부분 두께보다 작아지면서 역으로 말려들어가 구멍낙는거 막기
    gPath.lineTo(w, h+os-garc-os/2);
    gPath.lineTo(w, h+os-tlt-os/2);
    gPath.lineTo(w-garc-t, h+os-tlt-os/2);
  }
  var gGlyph = new opentype.Glyph({
    name: 'G',
    unicode: 71,
    advanceWidth: w+s*2+g,
    path: gPath
  });

  var hPath = new opentype.Path();
  hPath.moveTo(0, h);//left
  hPath.lineTo(t, h);
  hPath.lineTo(t, 0);
  hPath.lineTo(0, 0);
  hPath.moveTo(w-t, h);//right
  hPath.lineTo(w, h);
  hPath.lineTo(w, 0);
  hPath.lineTo(w-t, 0);
  hPath.moveTo(0, mh+tlt);//middle
  hPath.lineTo(w, mh+tlt);
  hPath.lineTo(w, mh);
  hPath.lineTo(0, mh);
  if(srf) {
    hPath.moveTo(t+s, 0);//bottom-left-serif
    hPath.lineTo(-s, 0);
    hPath.lineTo(-s, tlt);
    hPath.curveTo(-s/2, tlt, 0, tlt+sh/2, 0, tlt+sh);
    hPath.lineTo(t, tlt+sh);
    hPath.curveTo(t, tlt+sh/2, t+s/2, tlt, t+s, tlt);
    hPath.moveTo(-s, h);//top-left-serif
    hPath.lineTo(t+s, h);
    hPath.lineTo(t+s, h-tlt);
    hPath.curveTo(t+s/2, h-tlt, t, h-tlt-sh/2, t, h-tlt-sh);
    hPath.lineTo(0, h-tlt-sh);
    hPath.curveTo(0, h-tlt-sh/2, -s/2, h-tlt, -s, h-tlt);

    hPath.moveTo(w+s, 0);//bottom-right-serif
    hPath.lineTo(w-t-s, 0);
    hPath.lineTo(w-t-s, tlt);
    hPath.curveTo(w-t-s/2, tlt, w-t, tlt+sh/2, w-t, tlt+sh);
    hPath.lineTo(w, tlt+sh);
    hPath.curveTo(w, tlt+sh/2, w+s/2, tlt, w+s, tlt);
    hPath.moveTo(w-t-s, h);//top-right-serif
    hPath.lineTo(w+s, h);
    hPath.lineTo(w+s, h-tlt);
    hPath.curveTo(w+s/2, h-tlt, w, h-tlt-sh/2, w, h-tlt-sh);
    hPath.lineTo(w-t, h-tlt-sh);
    hPath.curveTo(w-t, h-tlt-sh/2, w-t-s/2, h-tlt, w-t-s, h-tlt);
  }
  var hGlyph = new opentype.Glyph({
    name: 'H',
    unicode: 72,
    advanceWidth: w+s*2+g,
    path: hPath
  });

  var iPath = new opentype.Path();
  iPath.moveTo(0, h);//left
  iPath.lineTo(t, h);
  iPath.lineTo(t, 0);
  iPath.lineTo(0, 0);
  if(srf) {
    iPath.moveTo(t+s, 0);//bottom-left-serif
    iPath.lineTo(-s, 0);
    iPath.lineTo(-s, tlt);
    iPath.curveTo(-s/2, tlt, 0, tlt+sh/2, 0, tlt+sh);
    iPath.lineTo(t, tlt+sh);
    iPath.curveTo(t, tlt+sh/2, t+s/2, tlt, t+s, tlt);
    iPath.moveTo(-s, h);//top-left-serif
    iPath.lineTo(t+s, h);
    iPath.lineTo(t+s, h-tlt);
    iPath.curveTo(t+s/2, h-tlt, t, h-tlt-sh/2, t, h-tlt-sh);
    iPath.lineTo(0, h-tlt-sh);
    iPath.curveTo(0, h-tlt-sh/2, -s/2, h-tlt, -s, h-tlt);
  }
  var iGlyph = new opentype.Glyph({
    name: 'I',
    unicode: 73,
    advanceWidth: t+s*2+g,
    path: iPath
  });

  var jPath = new opentype.Path();
  var jw = w/2;
  var jarc = arcs;
  if(jw <= t*2)
  jw = t*2;
  if(jarc >= jw/2)
  jarc = Math.round((jw/2)/10)*10;
  // else jarc = arcs;

  if(jarc*2>=jw*0.8)
  os= h*0.06*(w*0.2-(jw-jarc*2))/100;
  else os=0;

  jPath.moveTo(0, jarc-os/2);//left-bottom-arc
  jPath.lineTo(tlt, jarc-os/2);
  jPath.curveTo(tlt, jarc-(jarc-tlt)/2-os/2, jarc-(jarc-tlt)/2, tlt-os/2, jarc, tlt-os/2);
  jPath.lineTo(jarc, 0-os/2);
  jPath.curveTo(jarc/2, 0-os/2, 0, jarc/2-os/2, 0, jarc-os/2);
  jPath.moveTo(jw, jarc-os/2);//right-bottom-arc
  jPath.curveTo(jw, jarc/2-os/2, jw-jarc/2, 0-os/2, jw-jarc, 0-os/2);
  jPath.lineTo(jw-jarc, tlt-os/2);
  jPath.curveTo(jw-jarc+(jarc-t)/2, tlt-os/2, jw-t, jarc-(jarc-tlt)/2-os/2, jw-t, jarc-os/2);
  jPath.moveTo(jw-t, h);//right
  jPath.lineTo(jw, h);
  jPath.lineTo(jw, jarc-os/2);
  jPath.lineTo(jw-t, jarc-os/2);
  jPath.moveTo(jarc, 0-os/2);//bottom
  jPath.lineTo(jarc, tlt-os/2);
  jPath.lineTo(jw-jarc, tlt-os/2);
  jPath.lineTo(jw-jarc, 0-os/2);

  if(srf) {
    jPath.moveTo(jw-t-s, h);//top-right-serif
    jPath.lineTo(jw+s, h);
    jPath.lineTo(jw+s, h-tlt);
    jPath.curveTo(jw+s/2, h-tlt, jw, h-tlt-sh/2, jw, h-tlt-sh);
    jPath.lineTo(jw-t, h-tlt-sh);
    jPath.curveTo(jw-t, h-tlt-sh/2, jw-t-s/2, h-tlt, jw-t-s, h-tlt);
  }
  if(jarc<tlt) {
    jPath.moveTo(0, tlt-os/2);//bottom-left
    jPath.lineTo(t, tlt-os/2);
    jPath.lineTo(t, jarc-os/2);
    jPath.lineTo(0, jarc-os/2);
  }
  var jGlyph = new opentype.Glyph({
    name: 'J',
    unicode: 74,
    advanceWidth: jw+s*2+g,
    path: jPath
  });

  var kPath = new opentype.Path();
  kPath.moveTo(0, h);//left
  kPath.lineTo(t, h);
  kPath.lineTo(t, 0);
  kPath.lineTo(0, 0);
  kPath.moveTo(t, h*0.4);// "/"shape
  kPath.lineTo(t-tlt, h*0.4);
  kPath.lineTo(t-tlt, h*0.4+tlt*w/750*0.3+tlt*0.3);
  kPath.lineTo(w-tlt*w/500, h);
  kPath.lineTo(w, h);
  kPath.moveTo((w-t)*0.3+t, (h-h*0.4)*0.3+h*0.4);// "\"shape
  kPath.lineTo(w, 0);
  kPath.lineTo(w-t-w/35-0.1, 0);
  kPath.lineTo(w*(300-t)/1000+t/2, (h-h*0.4)*(210-t)/700+h*0.4);//(w*(110-t)/700+t/2, (h-mh)*(180-t)/560+mh);
  if(srf) {
    kPath.moveTo(t+s, 0);//bottom-left-serif
    kPath.lineTo(-s, 0);
    kPath.lineTo(-s, tlt);
    kPath.curveTo(-s/2, tlt, 0, tlt+sh/2, 0, tlt+sh);
    kPath.lineTo(t, tlt+sh);
    kPath.curveTo(t, tlt+sh/2, t+s/2, tlt, t+s, tlt);
    kPath.moveTo(-s, h);//top-left-serif
    kPath.lineTo(t+s, h);
    kPath.lineTo(t+s, h-tlt);
    kPath.curveTo(t+s/2, h-tlt, t, h-tlt-sh/2, t, h-tlt-sh);
    kPath.lineTo(0, h-tlt-sh);
    kPath.curveTo(0, h-tlt-sh/2, -s/2, h-tlt, -s, h-tlt);

    kPath.moveTo(w+s*0.6, 0);//bottom-right-serif
    kPath.lineTo(w-t-s, 0);
    kPath.lineTo(w-t-s, tlt);
    kPath.lineTo(w-tlt-s-w*0.002-s*0.2, tlt+sh*0.2);
    kPath.lineTo(w+s*0.6, tlt);
    kPath.moveTo(w-tlt-s, h);//top-right-serif
    kPath.lineTo(w+s*0.6, h);
    kPath.lineTo(w+s*0.6, h-tlt);
    kPath.lineTo(w-tlt-s-w*0.04-s*0.2, h-tlt-sh*0.2);
  }
  var kGlyph = new opentype.Glyph({
    name: 'K',
    unicode: 75,
    advanceWidth: w+s*2+g,
    path: kPath
  });

  var lPath = new opentype.Path();
  lPath.moveTo(0, h);//left
  lPath.lineTo(t, h);
  lPath.lineTo(t, 0);
  lPath.lineTo(0, 0);
  lPath.moveTo(0, tlt);//bottom
  lPath.lineTo(w, tlt);
  lPath.lineTo(w, 0);
  lPath.lineTo(0, 0);
  if(srf) {
    lPath.moveTo(w-tlt-sh, tlt);//bottom-right-serif
    lPath.curveTo(w-tlt-sh/2, tlt, w-tlt, tlt+s/2, w-tlt, tlt+s);
    lPath.lineTo(w, tlt+s);
    lPath.lineTo(w, tlt);

    lPath.moveTo(t+s, 0);//bottom-left-serif
    lPath.lineTo(-s, 0);
    lPath.lineTo(-s, tlt);
    lPath.curveTo(-s/2, tlt, 0, tlt+sh/2, 0, tlt+sh);
    lPath.lineTo(t, tlt+sh);
    lPath.curveTo(t, tlt+sh/2, t+s/2, tlt, t+s, tlt);
    lPath.moveTo(-s, h);//top-left-serif
    lPath.lineTo(t+s, h);
    lPath.lineTo(t+s, h-tlt);
    lPath.curveTo(t+s/2, h-tlt, t, h-tlt-sh/2, t, h-tlt-sh);
    lPath.lineTo(0, h-tlt-sh);
    lPath.curveTo(0, h-tlt-sh/2, -s/2, h-tlt, -s, h-tlt);
  }
  var lGlyph = new opentype.Glyph({
    name: 'L',
    unicode: 76,
    advanceWidth: w+s+g,
    path: lPath
  });

  var mPath = new opentype.Path();
  var mw = w+100;
  mPath.moveTo(0, h);//left
  mPath.lineTo(tlt, h);
  mPath.lineTo(tlt, 0);
  mPath.lineTo(0, 0);
  mPath.moveTo(mw-t, h);//right
  mPath.lineTo(mw, h);
  mPath.lineTo(mw, 0);
  mPath.lineTo(mw-t, 0);
  if(t*(3.5-w/600) < h) {
    mPath.moveTo(tlt, h-t*(3.5-w/600));//"\"shape
    mPath.lineTo(tlt, h);
    mPath.lineTo(mw/2+tlt/2, 0);
    mPath.lineTo(mw/2+tlt/2-t*(1+ w/6000), 0);
    mPath.moveTo(mw-t, h);//"/"shape
    mPath.lineTo(mw-t, h-tlt*(3.5-w/600));
    mPath.lineTo(mw/2+tlt/2, 0);
    mPath.lineTo(mw/2+tlt/2-tlt*1.1, 0);
  }
  else {
    mPath.moveTo(tlt, 0);//"\"shape
    mPath.lineTo(tlt, h);
    mPath.lineTo(mw/2+tlt/2, 0);
    mPath.lineTo(mw/2+tlt/2-t*(1+ w/6000), 0);
    mPath.moveTo(mw-t, h);//"/"shape
    mPath.lineTo(mw-t, 0);
    mPath.lineTo(mw/2+tlt/2, 0);
    mPath.lineTo(mw/2+tlt/2-tlt*1.1, 0);
  }

  if(srf) {
    mPath.moveTo(tlt+s, 0);//bottom-left-serif
    mPath.lineTo(-s, 0);
    mPath.lineTo(-s, tlt);
    mPath.curveTo(-s/2, tlt, 0, tlt+sh/2, 0, tlt+sh);
    mPath.lineTo(tlt, tlt+sh);
    mPath.curveTo(tlt, tlt+sh/2, tlt+s/2, tlt, tlt+s, tlt);
    mPath.moveTo(-s, h);//top-left-serif
    mPath.lineTo(0, h);
    mPath.lineTo(0, h-tlt-sh);
    mPath.curveTo(0, h-tlt-sh/2, -s/2, h-tlt, -s, h-tlt);

    mPath.moveTo(mw+s, 0);//bottom-right-serif
    mPath.lineTo(mw-t-s, 0);
    mPath.lineTo(mw-t-s, tlt);
    mPath.curveTo(mw-t-s/2, tlt, mw-t, tlt+sh/2, mw-t, tlt+sh);
    mPath.lineTo(mw, tlt+sh);
    mPath.curveTo(mw, tlt+sh/2, mw+s/2, tlt, mw+s, tlt);
    mPath.moveTo(mw, h);//top-right-serif
    mPath.lineTo(mw+s, h);
    mPath.lineTo(mw+s, h-tlt);
    mPath.curveTo(mw+s/2, h-tlt, mw, h-tlt-sh/2, mw, h-tlt-sh);
  }
  var mGlyph = new opentype.Glyph({
    name: 'M',
    unicode: 77,
    advanceWidth: mw+s*2+g,
    path: mPath
  });

  var nPath = new opentype.Path();
  nPath.moveTo(0, h);//left
  nPath.lineTo(tlt, h);
  nPath.lineTo(tlt, 0);
  nPath.lineTo(0, 0);
  nPath.moveTo(w-tlt, h);//right
  nPath.lineTo(w, h);
  nPath.lineTo(w, 0);
  nPath.lineTo(w-tlt, 0);
  nPath.moveTo(tlt, h);//middle
  nPath.lineTo(w-tlt, t*(3.5/(w/300)));//*(800-w)*0.01);
  nPath.lineTo(w-tlt, 0);
  nPath.lineTo(tlt, h-t*(3.5/(w/300)));//*(800-w)*0.01);
  // console.log(100/(w*w/1000));
  if(srf) {
    nPath.moveTo(tlt+s, 0);//bottom-left-serif
    nPath.lineTo(-s, 0);
    nPath.lineTo(-s, tlt);
    nPath.curveTo(-s/2, tlt, 0, tlt+sh/2, 0, tlt+sh);
    nPath.lineTo(tlt, tlt+sh);
    nPath.curveTo(tlt, tlt+sh/2, tlt+s/2, tlt, tlt+s, tlt);
    nPath.moveTo(-s, h);//top-left-serif
    nPath.lineTo(0, h);
    nPath.lineTo(0, h-tlt-sh);
    nPath.curveTo(0, h-tlt-sh/2, -s/2, h-tlt, -s, h-tlt);

    // nPath.moveTo(w+s, 0);//bottom-right-serif
    // nPath.lineTo(w, 0);
    // nPath.lineTo(w, tlt+sh);
    // nPath.curveTo(w, tlt+sh/2, w+s/2, tlt, w+s, tlt);
    nPath.moveTo(w-tlt-s, h);//top-right-serif
    nPath.lineTo(w+s, h);
    nPath.lineTo(w+s, h-tlt);
    nPath.curveTo(w+s/2, h-tlt, w, h-tlt-sh/2, w, h-tlt-sh);
    nPath.lineTo(w-tlt, h-tlt-sh);
    nPath.curveTo(w-tlt, h-tlt-sh/2, w-tlt-s/2, h-tlt, w-tlt-s, h-tlt);
  }
  var nGlyph = new opentype.Glyph({
    name: 'N',
    unicode: 78,
    advanceWidth: w+s*2+g,
    path: nPath
  });

  var oPath = new opentype.Path();
  var oarc = arcs;
  var ow = w;
  if(oarc > ow/2)
  oarc = Math.round((ow/2)/10)*10;
  if(oarc > h/2)
  oarc = Math.round((h/2)/10)*10;
  if(oarc*2>=ow*0.8)
  os= h*0.06*(ow*0.2-(ow-oarc*2))/100;
  else os=0;

  oPath.moveTo(0, h+os-oarc-os/2);//left-top-arc
  oPath.curveTo(0, h+os-oarc+oarc/2-os/2, oarc/2, h+os-os/2, oarc, h+os-os/2);
  oPath.lineTo(oarc, h+os-tlt-os/2);
  oPath.curveTo(oarc-(oarc-t)/2, h+os-tlt-os/2, t, h+os-oarc+(oarc-tlt)/2-os/2, t, h+os-oarc-os/2);
  oPath.moveTo(ow-oarc, h+os-os/2);//right-top-arc
  oPath.curveTo(ow-oarc/2, h+os-os/2, ow, h+os-oarc/2-os/2, ow, h+os-oarc-os/2);
  oPath.lineTo(ow-t, h+os-oarc-os/2);
  oPath.curveTo(ow-t, h+os-oarc+(oarc-tlt)/2-os/2, ow-oarc+(oarc-t)/2, h+os-tlt-os/2, ow-oarc, h+os-tlt-os/2);
  oPath.moveTo(0, oarc-os/2);//left-bottom-arc
  oPath.lineTo(t, oarc-os/2);
  oPath.curveTo(t, oarc-(oarc-tlt)/2-os/2, oarc-(oarc-t)/2, tlt-os/2, oarc, tlt-os/2);
  oPath.lineTo(oarc, 0-os/2);
  oPath.curveTo(oarc/2, 0-os/2, 0, oarc/2-os/2, 0, oarc-os/2);
  oPath.moveTo(ow, oarc-os/2);//right-bottom-arc
  oPath.curveTo(ow, oarc/2-os/2, ow-oarc/2, 0-os/2, ow-oarc, 0-os/2);
  oPath.lineTo(ow-oarc, tlt-os/2);
  oPath.curveTo(ow-oarc+(oarc-t)/2, tlt-os/2, ow-t, oarc-(oarc-tlt)/2-os/2, ow-t, oarc-os/2);
  oPath.moveTo(0, h+os-oarc-os/2);//left
  oPath.lineTo(t, h+os-oarc-os/2);
  oPath.lineTo(t, oarc-os/2);
  oPath.lineTo(0, oarc-os/2);
  oPath.moveTo(ow-t, h+os-oarc-os/2);//right
  oPath.lineTo(ow, h+os-oarc-os/2);
  oPath.lineTo(ow, oarc-os/2);
  oPath.lineTo(ow-t, oarc-os/2);
  oPath.moveTo(oarc, h+os-os/2);//top
  oPath.lineTo(ow-oarc, h+os-os/2);
  oPath.lineTo(ow-oarc, h+os-tlt-os/2);
  oPath.lineTo(oarc, h+os-tlt-os/2);
  oPath.moveTo(oarc, 0-os/2);//bottom
  oPath.lineTo(oarc, tlt-os/2);
  oPath.lineTo(ow-oarc, tlt-os/2);
  oPath.lineTo(ow-oarc, 0-os/2);
  var oGlyph = new opentype.Glyph({
    name: 'O',
    unicode: 79,
    advanceWidth: ow+s+g,
    path: oPath
  });

  var pPath = new opentype.Path();
  var parc = arcs;
  if(parc > w-t) {
    parc = Math.round((w-t)/10)*10;
  }
  if(h-mh<= parc*2)
  parc = Math.round(((h-mh)/2)/10)*10;
  // if(t>parc)
  //   parc = t;
  pPath.moveTo(0, 0);//left
  pPath.lineTo(0, h);
  pPath.lineTo(t, h);
  pPath.lineTo(t, 0);
  pPath.moveTo(0, h);//top to top-top-arc
  pPath.lineTo(w-parc, h);
  pPath.curveTo(w-parc/2, h, w, h-parc/2, w, h-parc);
  pPath.lineTo(w-t, h-parc);
  pPath.curveTo(w-t, h-parc+(parc-tlt)/2, w-parc+(parc-t)/2, h-tlt, w-parc, h-tlt);
  pPath.lineTo(0, h-tlt);
  pPath.moveTo(w-t, mh+parc);
  pPath.lineTo(w, mh+parc);
  pPath.curveTo(w, mh+parc-parc/2, w-parc/2, mh, w-parc, mh);
  pPath.lineTo(0,mh);
  pPath.lineTo(0,mh+tlt);
  pPath.lineTo(w-parc, mh+tlt);
  pPath.curveTo(w-parc+(parc-t)/2, mh+tlt, w-t, mh+tlt+(parc-tlt)/2, w-t, mh+parc);
  pPath.moveTo(w-t, h-parc); //top-arc-connection
  pPath.lineTo(w, h-parc);
  pPath.lineTo(w, mh+parc);
  pPath.lineTo(w-t, mh+parc);
  if(srf) {
    pPath.moveTo(t+s, 0);//bottom-left-serif
    pPath.lineTo(-s, 0);
    pPath.lineTo(-s, tlt);
    pPath.curveTo(-s/2, tlt, 0, tlt+sh/2, 0, tlt+sh);
    pPath.lineTo(t, tlt+sh);
    pPath.curveTo(t, tlt+sh/2, t+s/2, tlt, t+s, tlt);
    pPath.moveTo(-s, h);//top-left-serif
    pPath.lineTo(t+s, h);
    pPath.lineTo(t+s, h-tlt);
    pPath.curveTo(t+s/2, h-tlt, t, h-tlt-sh/2, t, h-tlt-sh);
    pPath.lineTo(0, h-tlt-sh);
    pPath.curveTo(0, h-tlt-sh/2, -s/2, h-tlt, -s, h-tlt);
  }
  var pGlyph = new opentype.Glyph({
    name: 'P',
    unicode: 80,
    advanceWidth: w+s+g,
    path: pPath
  });

  var qPath = new opentype.Path();
  var qarc = arcs;
  if(qarc > w/2)
  qarc = Math.round((w/2)/10)*10;
  if(qarc > h/2)
  qarc = Math.round((h/2)/10)*10;
  if(qarc*2>=w*0.8)
  os= h*0.06*(w*0.2-(w-qarc*2))/100;
  else os=0;

  qPath.moveTo(0, h+os-qarc-os/2);//left-top-arc
  qPath.curveTo(0, h+os-qarc+qarc/2-os/2, qarc/2, h+os-os/2, qarc, h+os-os/2);
  qPath.lineTo(qarc, h+os-tlt-os/2);
  qPath.curveTo(qarc-(qarc-t)/2, h+os-tlt-os/2, t, h+os-qarc+(qarc-tlt)/2-os/2, t, h+os-qarc-os/2);
  qPath.moveTo(w-qarc, h+os-os/2);//right-top-arc
  qPath.curveTo(w-qarc/2, h+os-os/2, w, h+os-qarc/2-os/2, w, h+os-qarc-os/2);
  qPath.lineTo(w-t, h+os-qarc-os/2);
  qPath.curveTo(w-t, h+os-qarc+(qarc-tlt)/2-os/2, w-qarc+(qarc-t)/2, h+os-tlt-os/2, w-qarc, h+os-tlt-os/2);
  qPath.moveTo(0, qarc-os/2);//left-bottom-arc
  qPath.lineTo(t, qarc-os/2);
  qPath.curveTo(t, qarc-(qarc-tlt)/2-os/2, qarc-(qarc-t)/2, tlt-os/2, qarc, tlt-os/2);
  qPath.lineTo(qarc, 0-os/2);
  qPath.curveTo(qarc/2, 0-os/2, 0, qarc/2-os/2, 0, qarc-os/2);
  qPath.moveTo(w, qarc-os/2);//right-bottom-arc
  qPath.curveTo(w, qarc/2-os/2, w-qarc/2, 0-os/2, w-qarc, 0-os/2);
  qPath.lineTo(w-qarc, tlt-os/2);
  qPath.curveTo(w-qarc+(qarc-t)/2, tlt-os/2, w-t, qarc-(qarc-tlt)/2-os/2, w-t, qarc-os/2);
  qPath.moveTo(0, h+os-qarc-os/2);//left
  qPath.lineTo(t, h+os-qarc-os/2);
  qPath.lineTo(t, qarc-os/2);
  qPath.lineTo(0, qarc-os/2);
  qPath.moveTo(w-t, h+os-qarc-os/2);//right
  qPath.lineTo(w, h+os-qarc-os/2);
  qPath.lineTo(w, qarc-os/2);
  qPath.lineTo(w-t, qarc-os/2);
  qPath.moveTo(qarc, h+os-os/2);//top
  qPath.lineTo(w-qarc, h+os-os/2);
  qPath.lineTo(w-qarc, h+os-tlt-os/2);
  qPath.lineTo(qarc, h+os-tlt-os/2);
  qPath.moveTo(qarc, 0-os/2);//bottom
  qPath.lineTo(qarc, tlt-os/2);
  qPath.lineTo(w-qarc, tlt-os/2);
  qPath.lineTo(w-qarc, 0-os/2);
  qPath.moveTo(w/2, h*0.4);//middle-tail
  qPath.lineTo(w/2+t, h*0.4);
  qPath.lineTo(w, -d/3);
  qPath.lineTo(w-t, -d/3);

  if(srf) {
    qPath.moveTo(w+s, -d/3);//bottom-right-serif
    qPath.lineTo(w, -d/3);
    qPath.lineTo(w-tlt*w/400, -d/3+tlt+sh);
    qPath.curveTo(w-tlt*w/600, -d/3+tlt+sh/2, w+s/2, -d/3+tlt, w+s, -d/3+tlt);
  }
  var qGlyph = new opentype.Glyph({
    name: 'Q',
    unicode: 81,
    advanceWidth: w+s*2+g,
    path: qPath
  });

  var rPath = new opentype.Path();
  var rtarc = arcs;
  var rbarc = arcs;
  if(w-t <= rbarc) {
    rtarc = Math.round((w-t)/10)*10;
    rbarc = Math.round((w-t)/10)*10;
  }
  if(rtarc > (h-mh)/2)
  rtarc = Math.round(((h-mh)/2)/10)*10;
  if(rbarc > (mh+tlt)/2)
  rbarc = Math.round(((mh+tlt)/2)/10)*10;

  rPath.moveTo(0, 0);//left
  rPath.lineTo(0, h);
  rPath.lineTo(t, h);
  rPath.lineTo(t, 0);
  rPath.moveTo(0, mh);//middle to bottom-top-arc
  rPath.lineTo(0, mh+tlt);
  rPath.lineTo(w*0.95-rbarc, mh+tlt);
  rPath.curveTo(w*0.95-rbarc/2, mh+tlt, w*0.95, mh+tlt-rbarc/2, w*0.95, mh+tlt-rbarc);
  rPath.lineTo(w*0.95-t, mh+tlt-rbarc);
  rPath.curveTo(w*0.95-t, mh+tlt-rbarc+(rbarc-tlt)/2, w*0.95-rbarc+(rbarc-t)/2, mh,  w*0.95-rbarc, mh);
  rPath.moveTo(0, h);//top to top-top-arc
  rPath.lineTo(w-rtarc, h);
  rPath.curveTo(w-rtarc/2, h, w, h-rtarc/2, w, h-rtarc);
  rPath.lineTo(w-t, h-rtarc);
  rPath.curveTo(w-t, h-rtarc+(rtarc-tlt)/2, w-rtarc+(rtarc-t)/2, h-tlt, w-rtarc, h-tlt);
  rPath.lineTo(0, h-tlt);
  rPath.moveTo(w-t, mh+rtarc);
  rPath.lineTo(w, mh+rtarc);
  rPath.curveTo(w, mh+rtarc-rtarc/2, w-rtarc/2, mh, w-rtarc, mh);
  rPath.lineTo(0,mh);
  rPath.lineTo(0,mh+tlt);
  rPath.lineTo(w-rtarc, mh+tlt);
  rPath.curveTo(w-rtarc+(rtarc-t)/2, mh+tlt, w-t, mh+tlt+(rtarc-tlt)/2, w-t, mh+rtarc);
  rPath.moveTo(w-t, h-rtarc); //top-arc-connection
  rPath.lineTo(w, h-rtarc);
  rPath.lineTo(w, mh+rtarc);
  rPath.lineTo(w-t, mh+rtarc);
  rPath.moveTo(w*0.95-t, mh+tlt-rbarc); //bottom-right
  rPath.lineTo(w*0.95, mh+tlt-rbarc);
  rPath.lineTo(w*0.95, 0);
  rPath.lineTo(w*0.95-t, 0);
  if(srf) {
    rPath.moveTo(t+s, 0);//bottom-left-serif
    rPath.lineTo(-s, 0);
    rPath.lineTo(-s, tlt);
    rPath.curveTo(-s/2, tlt, 0, tlt+sh/2, 0, tlt+sh);
    rPath.lineTo(t, tlt+sh);
    rPath.curveTo(t, tlt+sh/2, t+s/2, tlt, t+s, tlt);
    rPath.moveTo(-s, h);//top-left-serif
    rPath.lineTo(t+s, h);
    rPath.lineTo(t+s, h-tlt);
    rPath.curveTo(t+s/2, h-tlt, t, h-tlt-sh/2, t, h-tlt-sh);
    rPath.lineTo(0, h-tlt-sh);
    rPath.curveTo(0, h-tlt-sh/2, -s/2, h-tlt, -s, h-tlt);
    rPath.moveTo(w*0.95+s, 0);//bottom-right-serif
    rPath.lineTo(w*0.95, 0);
    rPath.lineTo(w*0.95, tlt+sh);
    rPath.curveTo(w*0.95, tlt+sh/2, w*0.95+s/2, tlt, w*0.95+s, tlt);
  }
  var rGlyph = new opentype.Glyph({
    name: 'R',
    unicode: 82,
    advanceWidth: w+s*2+g,
    path: rPath
  });

  var sPath = new opentype.Path();
  var starc = arcs;
  var sbarc = arcs;
  if(w <= starc*2) {
    starc = Math.round((w/2)/10)*10;
    sbarc = Math.round((w/2)/10)*10;
  }
  if(h-mh<= starc*2)
  starc = Math.round(((h-mh)/2)/10)*10;
  // if(t>starc)
  //   starc = t;
  if(mh+t< sbarc*2)
  sbarc = Math.round(((mh+t)/2)/10)*10;
  // if(t>sbarc)
  //   sbarc = t;
  if(starc*2>=w*0.8)
  os= h*0.06*(w*0.2-(w-starc*2))/100;
  else os=0;

  sPath.moveTo(0, h+os-starc-os/2);//left-top-arc
  sPath.curveTo(0, h+os-starc+starc/2-os/2, starc/2, h+os-os/2, starc, h+os-os/2);
  sPath.lineTo(starc, h+os-tlt-os/2);
  sPath.curveTo(starc-(starc-t)/2, h+os-tlt-os/2, t, h+os-starc+(starc-tlt)/2-os/2, t, h+os-starc-os/2);
  sPath.moveTo(starc, h+os-os/2);//top-to-right-top-arc
  sPath.lineTo(w-starc, h+os-os/2);
  sPath.curveTo(w-starc/2, h+os-os/2, w, h+os-starc/2-os/2, w, h+os-starc-os/2);
  sPath.lineTo(w-tlt, h+os-starc-os/2);
  sPath.curveTo(w-tlt, h+os-starc+(starc-tlt)/2-os/2, w-starc+(starc-tlt)/2, h+os-tlt-os/2, w-starc, h+os-tlt-os/2);
  sPath.lineTo(starc, h+os-tlt-os/2);
  sPath.moveTo(0, sbarc-os/2);//left-bottom-arc
  sPath.lineTo(tlt, sbarc-os/2);
  sPath.curveTo(tlt, sbarc-(sbarc-tlt)/2-os/2, sbarc-(sbarc-tlt)/2, tlt-os/2, sbarc, tlt-os/2);
  sPath.lineTo(sbarc, 0-os/2);
  sPath.curveTo(sbarc/2, 0-os/2, 0, sbarc/2-os/2, 0, sbarc-os/2);

  sPath.moveTo(w, sbarc-os/2);//bottom-to-right-bottom-arc
  sPath.curveTo(w, sbarc/2-os/2, w-sbarc/2, 0-os/2, w-sbarc, 0-os/2);
  sPath.lineTo(sbarc, 0-os/2);
  sPath.lineTo(sbarc, tlt-os/2);
  sPath.lineTo(w-sbarc, tlt-os/2);
  sPath.curveTo(w-sbarc+(sbarc-t)/2, tlt-os/2, w-t, sbarc-(sbarc-tlt)/2-os/2, w-t, sbarc-os/2);
  sPath.moveTo(t, mh+starc-os/2);//bottom-bottom-left-arc
  sPath.curveTo(t, mh+starc-(starc-t)/2-os/2, starc-(starc-t)/2, mh+t-os/2, starc, mh+t-os/2);
  sPath.lineTo(starc, mh-os/2);
  sPath.curveTo(starc/2, mh-os/2, 0, mh+starc/2-os/2, 0, mh+starc-os/2);
  sPath.moveTo(starc, mh-os/2);//middle to bottom-top-arc
  sPath.lineTo(starc, mh+t-os/2);
  sPath.lineTo(w-sbarc, mh+t-os/2);
  sPath.curveTo(w-sbarc/2, mh+t-os/2, w, mh+t-sbarc/2-os/2, w, mh+t-sbarc-os/2);
  sPath.lineTo(w-t, mh+t-sbarc-os/2);
  sPath.curveTo(w-t, mh+t-sbarc+(sbarc-t)/2-os/2, w-sbarc+(sbarc-t)/2, mh-os/2,  w-sbarc, mh-os/2);
  sPath.moveTo(t, h+os-starc-os/2); //top-arc-connection
  sPath.lineTo(t, mh+starc-os/2);
  sPath.lineTo(0, mh+starc-os/2);
  sPath.lineTo(0, h+os-starc-os/2);
  sPath.moveTo(w-t, mh+t-sbarc); //bottom-arc-connection
  sPath.lineTo(w, mh+t-sbarc);
  sPath.lineTo(w, sbarc-os/2);
  sPath.lineTo(w-t, sbarc-os/2);

  if(srf) {
    sPath.moveTo(w, h-starc);//right-top-serif
    sPath.lineTo(w-tlt, h-starc);
    sPath.lineTo(w-tlt-tlt*0.1, h-starc+starc/2);
    sPath.lineTo(w-tlt, h-starc+s*starc*0.01);
    sPath.lineTo(w, h-starc+s*starc*0.01);

    sPath.moveTo(0, sbarc);//left-bottom-serif
    sPath.lineTo(tlt, sbarc);
    sPath.lineTo(tlt+tlt*0.1, sbarc/2);
    sPath.lineTo(tlt, sbarc-s*starc*0.01);
    sPath.lineTo(0, sbarc-s*starc*0.01);
  }
  if(starc<tlt) {
    sPath.moveTo(w-starc-t, h+os-starc-os/2);//top-right arcs끝부분 두께보다 작아지면서 역으로 말려들어가 구멍낙는거 막기
    sPath.lineTo(w, h+os-starc-os/2);
    sPath.lineTo(w, h+os-tlt-os/2);
    sPath.lineTo(w-starc-t, h+os-tlt-os/2);

    sPath.moveTo(0, tlt-os/2);//bottom-right arcs
    sPath.lineTo(t, tlt-os/2);
    sPath.lineTo(t, sbarc-os/2);
    sPath.lineTo(0, sbarc-os/2);
  }

  var sGlyph = new opentype.Glyph({
    name: 'S',
    unicode: 83,
    advanceWidth: w+g,
    path: sPath
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

  var uPath = new opentype.Path();
  var uarc = arcs;
  // if(w <= t*2)
  //   t = w/2;
  // if(t>uarc)
  //   uarc = t;
  if(w <= uarc*2)
  uarc = Math.round((w/2)/10)*10;
  else uarc = arcs;
  if(uarc*2>=w*0.8)
  os= h*0.06*(w*0.2-(w-uarc*2))/100;
  else os=0;

  uPath.moveTo(0, uarc-os/2);//left-bottom-arc
  uPath.lineTo(t, uarc-os/2);
  uPath.curveTo(t, uarc-(uarc-tlt)/2-os/2, uarc-(uarc-t)/2, tlt-os/2, uarc, tlt-os/2);
  uPath.lineTo(uarc, 0-os/2);
  uPath.curveTo(uarc/2, 0-os/2, 0, uarc/2-os/2, 0, uarc-os/2);
  uPath.moveTo(w, uarc-os/2);//right-bottom-arc
  uPath.curveTo(w, uarc/2-os/2, w-uarc/2, 0-os/2, w-uarc, 0-os/2);
  uPath.lineTo(w-uarc, tlt-os/2);
  uPath.curveTo(w-uarc+(uarc-tlt)/2, tlt-os/2, w-tlt, uarc-(uarc-tlt)/2-os/2, w-tlt, uarc-os/2);
  uPath.moveTo(0, h);//left
  uPath.lineTo(t, h);
  uPath.lineTo(t, uarc-os/2);
  uPath.lineTo(0, uarc-os/2);
  uPath.moveTo(w-tlt, h);//right
  uPath.lineTo(w, h);
  uPath.lineTo(w, uarc-os/2);
  uPath.lineTo(w-tlt, uarc-os/2);
  uPath.moveTo(uarc, 0-os/2);//bottom
  uPath.lineTo(uarc, tlt-os/2);
  uPath.lineTo(w-uarc, tlt-os/2);
  uPath.lineTo(w-uarc, 0-os/2);

  if(srf) {
    uPath.moveTo(-s, h);//top-left-serif
    uPath.lineTo(t+s, h);
    uPath.lineTo(t+s, h-tlt);
    uPath.curveTo(t+s/2, h-tlt, t, h-tlt-sh/2, t, h-tlt-sh);
    uPath.lineTo(0, h-tlt-sh);
    uPath.curveTo(0, h-tlt-sh/2, -s/2, h-tlt, -s, h-tlt);
    uPath.moveTo(w-tlt-s, h);//top-right-serif
    uPath.lineTo(w+s, h);
    uPath.lineTo(w+s, h-tlt);
    uPath.curveTo(w+s/2, h-tlt, w, h-tlt-sh/2, w, h-tlt-sh);
    uPath.lineTo(w-tlt, h-tlt-sh);
    uPath.curveTo(w-tlt, h-tlt-sh/2, w-tlt-s/2, h-tlt, w-tlt-s, h-tlt);
  }
  var uGlyph = new opentype.Glyph({
    name: 'U',
    unicode: 85,
    advanceWidth: w+s*2+g,
    path: uPath
  });

  var vPath = new opentype.Path();
  vPath.moveTo(0, h);//left
  vPath.lineTo(t*1.1, h);
  vPath.lineTo(w/2-t*1.1/2+t*1.1, 0);
  vPath.lineTo(w/2-t*1.1/2, 0);
  vPath.moveTo(w-tlt*1.1, h);//right
  vPath.lineTo(w, h);
  vPath.lineTo(w/2+t*1.1/2, 0);
  vPath.lineTo(w/2+t*1.1/2-tlt*1.1, 0);

  if(srf) {
    vPath.moveTo(-s*0.6, h);//top-left-serif
    vPath.lineTo(t+s*0.6, h);
    vPath.lineTo(t+s*0.6, h-tlt);
    vPath.curveTo(t+s*0.6/2, h-tlt, tlt, h-tlt-sh/2, tlt+(w/2-tlt/2)*sh*0.0016, h-tlt-sh);
    vPath.curveTo(tlt, h-tlt-sh/2, -s*0.6, h-tlt, -s*0.6, h-tlt);
    vPath.moveTo(w-t-s*0.6, h);//top-right-serif
    vPath.lineTo(w+s*0.6, h);
    vPath.lineTo(w+s*0.6, h-tlt);
    vPath.curveTo(w+s*0.6/2, h-tlt, w-tlt, h-tlt-sh/2, w-tlt-(w/2-tlt/2)*sh*0.0016, h-tlt-sh);
    vPath.curveTo(w-tlt, h-tlt-sh/2, w-t-s*0.6/2, h-tlt, w-t-s*0.6, h-tlt);
  }
  var vGlyph = new opentype.Glyph({
    name: 'V',
    unicode: 86,
    advanceWidth: w+s*2+g,
    path: vPath
  });

  var wPath = new opentype.Path();
  var ww = w+200;
  wPath.moveTo(0, h);//left
  wPath.lineTo(t, h);
  wPath.lineTo((ww/2+tlt/2)/2+tlt/2, 0);
  wPath.lineTo((ww/2+tlt/2)/2+tlt/2-t, 0);
  wPath.moveTo(ww/2-tlt/2, h);//middle-left
  wPath.lineTo(ww/2-tlt/2+tlt, h);
  wPath.lineTo((ww/2+tlt/2)/2+tlt/2, 0);
  wPath.lineTo((ww/2+tlt/2)/2+tlt/2-tlt, 0);
  wPath.moveTo(ww/2-tlt/2, h);//middle-right
  wPath.lineTo(ww/2-tlt/2+t, h);
  wPath.lineTo(ww-(ww/2+t/2)/2+tlt/2, 0);
  wPath.lineTo(ww-(ww/2+t/2)/2+tlt/2-t, 0);
  wPath.moveTo(ww-tlt, h);//right
  wPath.lineTo(ww, h);
  wPath.lineTo(ww-(ww/2+t/2)/2+tlt/2, 0);
  wPath.lineTo(ww-(ww/2+t/2)/2+tlt/2-tlt, 0);

  if(srf) {
    wPath.moveTo(-s*0.6, h);//top-left-serif
    wPath.lineTo(t+s*0.6, h);
    wPath.lineTo(t+s*0.6, h-tlt);
    wPath.curveTo(t+s*0.6/2, h-tlt, tlt, h-tlt-sh/2, tlt+(ww/2-tlt/2)*sh*0.0011, h-tlt-sh);
    wPath.curveTo(tlt, h-tlt-sh/2, -s*0.6, h-tlt, -s*0.6, h-tlt);
    wPath.moveTo(ww-t-s*0.6, h);//top-right-serif
    wPath.lineTo(ww+s*0.6, h);
    wPath.lineTo(ww+s*0.6, h-tlt);
    wPath.curveTo(ww+s*0.6/2, h-tlt, ww-tlt, h-tlt-sh/2, ww-tlt-(ww/2-tlt/2)*sh*0.001, h-tlt-sh);
    wPath.curveTo(ww-tlt, h-tlt-sh/2, ww-t-s*0.6/2, h-tlt, ww-t-s*0.6, h-tlt);
  }
  var wGlyph = new opentype.Glyph({
    name: 'W',
    unicode: 87,
    advanceWidth: ww+s*2+g,
    path: wPath
  });

  var xPath = new opentype.Path();
  xPath.moveTo(0, h);//"\" shape
  xPath.lineTo(t*1.25, h);
  xPath.lineTo(w, 0);
  xPath.lineTo(w-t*1.25, 0);
  xPath.moveTo(w-tlt*1.25, h);//"/" shape
  xPath.lineTo(w, h);
  xPath.lineTo(tlt*1.25, 0);
  xPath.lineTo(0, 0);

  if(srf) {
    xPath.moveTo(-s*0.6, h);//top-left-serif
    xPath.lineTo(t+s*0.6, h);
    xPath.lineTo(t+s*0.6, h-tlt);
    xPath.curveTo(t+s*0.6/2, h-tlt, tlt, h-tlt-sh/2, tlt+(w)*sh*0.00185, h-tlt-sh);
    xPath.curveTo(tlt, h-tlt-sh/2, -s*0.6, h-tlt, -s*0.6, h-tlt);
    xPath.moveTo(w-t-s*0.6, h);//top-right-serif
    xPath.lineTo(w+s*0.6, h);
    xPath.lineTo(w+s*0.6, h-tlt);
    xPath.curveTo(w+s*0.6/2, h-tlt, w-tlt, h-tlt-sh/2, w-tlt-(w)*sh*0.00185, h-tlt-sh);
    xPath.curveTo(w-tlt, h-tlt-sh/2, w-t-s*0.6/2, h-tlt, w-t-s*0.6, h-tlt);

    xPath.moveTo(-s*0.6, 0);//bottom-left-serif
    xPath.lineTo(-s*0.6, tlt);
    xPath.curveTo(-s*0.6/2, tlt, tlt, tlt+sh/2, tlt+(w)*sh*0.00185, tlt+sh);
    xPath.curveTo(tlt, tlt+sh/2, tlt+s*0.6, tlt, tlt+s, tlt);
    xPath.lineTo(tlt+s, 0);
    xPath.moveTo(w-t-s, 0);//bottom-right-serif
    xPath.lineTo(w-t-s, tlt);
    xPath.curveTo(w-t-s*0.6, tlt, w-tlt, tlt+sh/2, w-tlt-(w)*sh*0.00185, tlt+sh);
    xPath.curveTo(w-tlt, tlt+sh/2, w+s*0.6/2, tlt, w+s*0.6, tlt);
    xPath.lineTo(w+s*0.6, tlt);
    xPath.lineTo(w+s*0.6, 0);
  }
  var xGlyph = new opentype.Glyph({
    name: 'X',
    unicode: 88,
    advanceWidth: w+s*2+g,
    path: xPath
  });

  var yPath = new opentype.Path();
  yPath.moveTo(0, h);//left
  yPath.lineTo(t*1.2, h);
  yPath.lineTo(w/2-t/2+t, h*0.4+t*0.5);
  yPath.lineTo(w/2-t/2+t, h*0.4);
  yPath.lineTo(w/2-t/2, h*0.4);
  yPath.moveTo(w-tlt*1.2, h);//right
  yPath.lineTo(w, h);
  yPath.lineTo(w/2+t/2, h*0.4);
  yPath.lineTo(w/2+t/2-tlt, h*0.4);
  yPath.lineTo(w/2+t/2-tlt, h*0.4+tlt*0.3);
  yPath.moveTo(w/2+t/2,h*0.4);//middle
  yPath.lineTo(w/2+t/2,0);
  yPath.lineTo(w/2-t/2,0);
  yPath.lineTo(w/2-t/2,h*0.4);

  if(srf) {
    yPath.moveTo(-s*0.6, h);//top-left-serif
    yPath.lineTo(t+s*0.6, h);
    yPath.lineTo(t+s*0.6, h-tlt);
    yPath.curveTo(t+s*0.6/2, h-tlt, tlt, h-tlt-sh/2, tlt+(w)*sh*0.00185, h-tlt-sh*(600-h*0.4)*0.005);
    yPath.curveTo(tlt, h-tlt-sh/2, -s*0.6, h-tlt, -s*0.6, h-tlt);
    yPath.moveTo(w-t-s*0.6, h);//top-right-serif
    yPath.lineTo(w+s*0.6, h);
    yPath.lineTo(w+s*0.6, h-tlt);
    yPath.curveTo(w+s*0.6/2, h-tlt, w-tlt, h-tlt-sh/2, w-tlt-(w)*sh*0.00185, h-tlt-sh*(600-h*0.4)*0.005);
    yPath.curveTo(w-tlt, h-tlt-sh/2, w-t-s*0.6/2, h-tlt, w-t-s*0.6, h-tlt);
    yPath.moveTo(w/2+t/2+s, 0);//middle-serif
    yPath.lineTo(w/2-t/2-s, 0);
    yPath.lineTo(w/2-t/2-s, tlt);
    yPath.curveTo(w/2-t/2-s/2, tlt, w/2-t/2, tlt+sh/2, w/2-t/2, tlt+sh);
    yPath.lineTo(w/2-t/2+t, tlt+sh);
    yPath.curveTo(w/2-t/2+t, tlt+sh/2, w/2+t/2+s/2, tlt, w/2+t/2+s, tlt);
  }
  var yGlyph = new opentype.Glyph({
    name: 'Y',
    unicode: 89,
    advanceWidth: w+s*2+g,
    path: yPath
  });

  var zPath = new opentype.Path();
  zPath.moveTo(0, h);//top
  zPath.lineTo(w, h);
  zPath.lineTo(w, h-tlt);
  zPath.lineTo(0, h-tlt);
  zPath.moveTo(0, tlt);//bottom
  zPath.lineTo(w, tlt);
  zPath.lineTo(w, 0);
  zPath.lineTo(0, 0);
  zPath.moveTo(w-t*(w/1000+0.8), h-tlt);//"/" shape
  zPath.lineTo(w, h-tlt);
  zPath.lineTo(t*(w/1000+0.8), tlt);
  zPath.lineTo(0, tlt);
  if(srf) {
    zPath.moveTo(tlt+sh, h-tlt);//top-left-serif
    zPath.curveTo(tlt+sh/2, h-tlt, tlt, h-tlt-s/2, tlt, h-tlt-s);
    zPath.lineTo(0, h-tlt-s);
    zPath.lineTo(0, h-tlt);
    zPath.moveTo(w-tlt-sh, tlt);//bottom-right-serif
    zPath.curveTo(w-tlt-sh/2, tlt, w-tlt, tlt+s/2, w-tlt, tlt+s);
    zPath.lineTo(w, tlt+s);
    zPath.lineTo(w, tlt);
  }
  var zGlyph = new opentype.Glyph({
    name: 'Z',
    unicode: 90,
    advanceWidth: w+g,
    path: zPath
  });

  var aPaths = new opentype.Path();
  var atarcs = arcs;
  var abarcs = arcs;
  if(abarcs >= (lmh+tlt)/2)
  abarcs = Math.round(((lmh+tlt)/2)/10)*10;
  if(atarcs > lh-lmh-tlt-t/2)
  atarcs = Math.round((lh-lmh-tlt-tlt/2)/10)*10;
  if(atarcs > lw/2)
  atarcs = Math.round((lw/2)/10)*10;
  if(abarcs > lw/2)
  abarcs = Math.round((lw/2)/10)*10;
  // else atarcs = arcs;
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
  aPaths.curveTo(abarcs-(abarcs-t)/2, lmh, t, lmh+tlt-abarcs+(abarcs-tlt)/2, t, lmh+tlt-abarcs);
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


  var bPaths = new opentype.Path();
  var barcs = arcs;
  var bws = lw;
  if(barcs > bws/2)
  barcs = Math.round((bws/2)/10)*10;
  if(barcs > lh/2)
  barcs = Math.round((lh/2)/10)*10;
  if(barcs*2>=bws*0.8)
  os= lh*0.03*(100-(bws-barcs*2))/100;
  else os=0;

  bPaths.moveTo(t-tlt, lh+os-barcs-os/2);//left-top-arc
  bPaths.curveTo(t-tlt, lh+os-barcs+barcs/2-os/2, barcs-(barcs-(t-tlt))/2, lh+os-os/2, barcs, lh+os-os/2);
  bPaths.lineTo(barcs, lh+os-tlt-os/2);
  bPaths.curveTo(barcs-(barcs-t)/2, lh+os-tlt-os/2, t, lh+os-barcs+(barcs-tlt)/2-os/2, t, lh+os-barcs-os/2);
  bPaths.moveTo(bws-barcs, lh+os-os/2);//right-top-arc
  bPaths.curveTo(bws-barcs/2, lh+os-os/2, bws, lh+os-barcs/2-os/2, bws, lh+os-barcs-os/2);
  bPaths.lineTo(bws-t, lh+os-barcs-os/2);
  bPaths.curveTo(bws-t, lh+os-barcs+(barcs-tlt)/2-os/2, bws-barcs+(barcs-t)/2, lh+os-tlt-os/2, bws-barcs, lh+os-tlt-os/2);
  bPaths.moveTo(t-tlt, barcs-os/2);//left-bottom-arc
  bPaths.lineTo(t, barcs-os/2);
  bPaths.curveTo(t, barcs-(barcs-tlt)/2-os/2, barcs-(barcs-t)/2, tlt-os/2, barcs, tlt-os/2);
  bPaths.lineTo(barcs, 0-os/2);
  bPaths.curveTo(barcs-(barcs-(t-tlt))/2, 0-os/2, t-tlt, barcs/2-os/2, t-tlt, barcs-os/2);
  bPaths.moveTo(bws, barcs-os/2);//right-bottom-arc
  bPaths.curveTo(bws, barcs/2-os/2, bws-barcs/2, 0-os/2, bws-barcs, 0-os/2);
  bPaths.lineTo(bws-barcs, tlt-os/2);
  bPaths.curveTo(bws-barcs+(barcs-t)/2, tlt-os/2, bws-t, barcs-(barcs-tlt)/2-os/2, bws-t, barcs-os/2);
  bPaths.moveTo(0, lhh);//left
  bPaths.lineTo(t, lhh);
  bPaths.lineTo(t, 0);
  bPaths.lineTo(0, 0);
  bPaths.moveTo(bws-t, lh+os-barcs-os/2);//riglht
  bPaths.lineTo(bws, lh+os-barcs-os/2);
  bPaths.lineTo(bws, barcs-os/2);
  bPaths.lineTo(bws-t, barcs-os/2);
  bPaths.moveTo(barcs, lh+os-os/2);//top
  bPaths.lineTo(bws-barcs, lh+os-os/2);
  bPaths.lineTo(bws-barcs, lh+os-tlt-os/2);
  bPaths.lineTo(barcs, lh+os-tlt-os/2);
  bPaths.moveTo(barcs, 0-os/2);//bottom
  bPaths.lineTo(barcs, tlt-os/2);
  bPaths.lineTo(bws-barcs, tlt-os/2);
  bPaths.lineTo(bws-barcs, 0-os/2);
  if(srf) {
    bPaths.moveTo(-s, lhh);//top-left-serif
    bPaths.lineTo(0, lhh);
    bPaths.lineTo(0, lhh-tlt-sh);
    bPaths.curveTo(0, lhh-tlt-sh/2, -s/2, lhh-tlt, -s, lhh-tlt);

    bPaths.moveTo(0, 0);//bottom-left-serif
    bPaths.lineTo(-s, 0);
    bPaths.lineTo(-s, tlt);
    bPaths.curveTo(-s/2, tlt, 0, tlt+sh/2, 0, tlt+sh);
  }
  var bGlyphs = new opentype.Glyph({
    name: 'b',
    unicode: 98,
    advanceWidth: bws+s+g,
    path: bPaths
  });


  var cPaths = new opentype.Path();
  var carcs = arcs;
  if(carcs > lw/2)
  carcs = Math.round((lw/2)/10)*10;
  if(carcs > (lh-t)/2)
  carcs = Math.round(((lh-t)/2)/10)*10;
  if(carcs*2>=lw*0.8)
  os= lh*0.03*(100-(lw-carcs*2))/100;
  else os=0;

  cPaths.moveTo(0, lh+os-carcs-os/2);//left
  cPaths.lineTo(t, lh+os-carcs-os/2);
  cPaths.lineTo(t, carcs-os/2);
  cPaths.lineTo(0, carcs-os/2);
  cPaths.moveTo(carcs, lh+os-os/2);//top
  cPaths.lineTo(lw-carcs, lh+os-os/2);
  cPaths.lineTo(lw-carcs, lh+os-tlt-os/2);
  cPaths.lineTo(carcs, lh+os-tlt-os/2);
  cPaths.moveTo(carcs, 0-os/2);//bottom
  cPaths.lineTo(carcs, tlt-os/2);
  cPaths.lineTo(lw-carcs, tlt-os/2);
  cPaths.lineTo(lw-carcs, 0-os/2);
  cPaths.moveTo(0, lh+os-carcs-os/2);//left-top-arc
  cPaths.curveTo(0, lh+os-carcs+carcs/2-os/2, carcs/2, lh+os-os/2, carcs, lh+os-os/2);
  cPaths.lineTo(carcs, lh+os-tlt-os/2);
  cPaths.curveTo(carcs-(carcs-t)/2, lh+os-tlt-os/2, t, lh+os-carcs+(carcs-tlt)/2-os/2, t, lh+os-carcs-os/2);
  cPaths.moveTo(lw-carcs, lh+os-os/2);//right-top-arc
  cPaths.curveTo(lw-carcs/2, lh+os-os/2, lw, lh+os-carcs/2-os/2, lw, lh+os-carcs-os/2);
  cPaths.lineTo(lw-tlt, lh+os-carcs-os/2);
  cPaths.curveTo(lw-tlt, lh+os-carcs+(carcs-tlt)/2-os/2, lw-carcs+(carcs-tlt)/2, lh+os-tlt-os/2, lw-carcs, lh+os-tlt-os/2);
  cPaths.moveTo(t, carcs-os/2);//left-bottom-arc
  cPaths.curveTo(t, carcs-(carcs-tlt)/2-os/2, carcs-(carcs-t)/2, tlt-os/2, carcs, tlt-os/2);
  cPaths.lineTo(carcs, 0-os/2);
  cPaths.curveTo(carcs/2, 0-os/2, 0, carcs/2-os/2, 0, carcs-os/2);
  cPaths.moveTo(lw, carcs-os/2);//right-bottom-arc
  cPaths.curveTo(lw, carcs/2-os/2, lw-carcs/2, 0-os/2, lw-carcs, 0-os/2);
  cPaths.lineTo(lw-carcs, tlt-os/2);
  cPaths.curveTo(lw-carcs+(carcs-tlt)/2, tlt-os/2, lw-tlt, carcs-(carcs-tlt)/2-os/2, lw-tlt, carcs-os/2);
  if(srf) {
    cPaths.moveTo(lw, lh-carcs);//right-top-serif
    cPaths.lineTo(lw-tlt, lh-carcs);
    cPaths.lineTo(lw-tlt-sh*0.1, lh-carcs+carcs/2);
    cPaths.lineTo(lw-tlt, lh-carcs+s*carcs*0.01);
    cPaths.lineTo(lw, lh-carcs+s*carcs*0.01);
    cPaths.moveTo(lw, carcs);//right-bottom-serif
    cPaths.lineTo(lw, carcs-s*carcs*0.01);
    cPaths.lineTo(lw-tlt, carcs-s*carcs*0.01);
    cPaths.lineTo(lw-tlt-sh*0.1, carcs-carcs/2);
    cPaths.lineTo(lw-tlt, carcs);
  }
  if(carcs<tlt) {
    cPaths.moveTo(lw-carcs-t, lh+os-carcs-os/2);//top-right arcs끝부분 두께보다 작아지면서 역으로 말려들어가 구멍낙는거 막기
    cPaths.lineTo(lw, lh+os-carcs-os/2);
    cPaths.lineTo(lw, lh+os-tlt-os/2);
    cPaths.lineTo(lw-carcs-t, lh+os-tlt-os/2);

    cPaths.moveTo(lw-carcs-t, tlt-os/2);//bottom-right arcs
    cPaths.lineTo(lw, tlt-os/2);
    cPaths.lineTo(lw, carcs-os/2);
    cPaths.lineTo(lw-carcs-t, carcs-os/2);
  }

  var cGlyphs = new opentype.Glyph({
    name: 'c',
    unicode: 99,
    advanceWidth: lw+g,
    path: cPaths
  });



  var dPaths = new opentype.Path();
  var darcs = arcs;
  var dws = lw;
  if(darcs > dws/2)
  darcs = Math.round((dws/2)/10)*10;
  if(darcs > lh/2)
  darcs = Math.round((lh/2)/10)*10;
  if(darcs*2>=dws*0.8)
  os= lh*0.03*(100-(dws-darcs*2))/100;
  else os=0;

  dPaths.moveTo(0, lh+os-darcs-os/2);//left-top-arc
  dPaths.curveTo(0, lh+os-darcs+darcs/2-os/2, darcs/2, lh+os-os/2, darcs, lh+os-os/2);
  dPaths.lineTo(darcs, lh+os-tlt-os/2);
  dPaths.curveTo(darcs-(darcs-t)/2, lh+os-tlt-os/2, t, lh+os-darcs+(darcs-tlt)/2-os/2, t, lh+os-darcs-os/2);
  dPaths.moveTo(dws-darcs, lh+os-os/2);//right-top-arc
  dPaths.curveTo(dws-darcs+(darcs-t+tlt)/2, lh+os-os/2, dws-t+tlt, lh+os-darcs/2-os/2, dws-t+tlt, lh+os-darcs-os/2);
  dPaths.lineTo(dws-t, lh+os-darcs-os/2);
  dPaths.curveTo(dws-t, lh+os-darcs+(darcs-tlt)/2-os/2, dws-darcs+(darcs-t)/2, lh+os-tlt-os/2, dws-darcs, lh+os-tlt-os/2);
  dPaths.moveTo(0, darcs-os/2);//left-bottom-arc
  dPaths.lineTo(t, darcs-os/2);
  dPaths.curveTo(t, darcs-(darcs-tlt)/2-os/2, darcs-(darcs-t)/2, tlt-os/2, darcs, tlt-os/2);
  dPaths.lineTo(darcs, 0-os/2);
  dPaths.curveTo(darcs/2, 0-os/2, 0, darcs/2-os/2, 0, darcs-os/2);
  dPaths.moveTo(dws-t+tlt, darcs-os/2);//right-bottom-arc
  dPaths.curveTo(dws-t+tlt, darcs/2-os/2, dws-darcs+(darcs-t+tlt)/2, 0-os/2, dws-darcs, 0-os/2);
  dPaths.lineTo(dws-darcs, tlt-os/2);
  dPaths.curveTo(dws-darcs+(darcs-t)/2, tlt-os/2, dws-t, darcs-(darcs-tlt)/2-os/2, dws-t, darcs-os/2);
  dPaths.moveTo(0, lh+os-darcs-os/2);//left
  dPaths.lineTo(t, lh+os-darcs-os/2);
  dPaths.lineTo(t, darcs-os/2);
  dPaths.lineTo(0, darcs-os/2);
  dPaths.moveTo(dws-t, lhh);//right
  dPaths.lineTo(dws, lhh);
  dPaths.lineTo(dws, 0);
  dPaths.lineTo(dws-t, 0);
  dPaths.moveTo(darcs, lh+os-os/2);//top
  dPaths.lineTo(dws-darcs, lh+os-os/2);
  dPaths.lineTo(dws-darcs, lh+os-tlt-os/2);
  dPaths.lineTo(darcs, lh+os-tlt-os/2);
  dPaths.moveTo(darcs, 0-os/2);//bottom
  dPaths.lineTo(darcs, tlt-os/2);
  dPaths.lineTo(dws-darcs, tlt-os/2);
  dPaths.lineTo(dws-darcs, 0-os/2);
  if(srf) {
    dPaths.moveTo(dws-t-s, lhh);//top-serif
    dPaths.lineTo(dws-t, lhh);
    dPaths.lineTo(dws-t, lhh-tlt-sh);
    dPaths.curveTo(dws-t, lhh-tlt-sh/2, dws-t-s/2, lhh-tlt, dws-t-s, lhh-tlt);

    dPaths.moveTo(lw+s, 0);//bottom-right-serif
    dPaths.lineTo(lw, 0);
    dPaths.lineTo(lw, tlt+sh);
    dPaths.curveTo(lw, tlt+sh/2, lw+s/2, tlt, lw+s, tlt);
  }
  var dGlyphs = new opentype.Glyph({
    name: 'd',
    unicode: 100,
    advanceWidth: dws+s+g,
    path: dPaths
  });


  var ePaths = new opentype.Path();
  var etarcs = arcs;
  var ebarcs = arcs;
  if(ebarcs >= lmh-h/15)
  ebarcs = Math.round((lmh-h/15)/10)*10;
  if(etarcs > lh-lmh-t)
  etarcs = Math.round((lh-lmh-t)/10)*10;
  if(etarcs > lw/2)
  etarcs = Math.round((lw/2)/10)*10;
  if(ebarcs > lw/2)
  ebarcs = Math.round((lw/2)/10)*10;
  if(etarcs<=0)
  etarcs =0;
  if(ebarcs<=0)
  ebarcs =0;

  ePaths.moveTo(0, lh-etarcs);//left-top-arc
  ePaths.curveTo(0, lh-etarcs+etarcs/2, etarcs/2, lh, etarcs, lh);
  ePaths.lineTo(etarcs, lh-tlt);
  ePaths.curveTo(etarcs-(etarcs-t)/2, lh-tlt, t, lh-etarcs+(etarcs-tlt)/2, t, lh-etarcs);
  ePaths.moveTo(lw-etarcs, lh);//right-top-arc
  ePaths.curveTo(lw-etarcs/2, lh, lw, lh-etarcs/2, lw, lh-etarcs);
  ePaths.lineTo(lw-t, lh-etarcs);
  ePaths.curveTo(lw-t, lh-etarcs+(etarcs-tlt)/2, lw-etarcs+(etarcs-t)/2, lh-tlt, lw-etarcs, lh-tlt);
  ePaths.moveTo(t, ebarcs);//left-bottom-arc
  ePaths.curveTo(t, ebarcs-(ebarcs-tlt)/2, ebarcs-(ebarcs-t)/2, tlt, ebarcs, tlt);
  ePaths.lineTo(ebarcs, 0);
  ePaths.curveTo(ebarcs/2, 0, 0, ebarcs/2, 0, ebarcs);
  ePaths.moveTo(lw, ebarcs);//right-bottom-arc
  ePaths.curveTo(lw, ebarcs/2, lw-ebarcs/2, 0, lw-ebarcs, 0);
  ePaths.lineTo(lw-ebarcs, tlt);
  ePaths.curveTo(lw-ebarcs+(ebarcs-tlt)/2, tlt, lw-tlt, ebarcs-(ebarcs-tlt)/2, lw-tlt, ebarcs);
  ePaths.moveTo(0, lmh+tlt);//middle
  ePaths.lineTo(lw, lmh+tlt);
  ePaths.lineTo(lw, lmh);
  ePaths.lineTo(0, lmh);
  ePaths.moveTo(0, lh-etarcs);//left
  ePaths.lineTo(t, lh-etarcs);
  ePaths.lineTo(t, ebarcs);
  ePaths.lineTo(0, ebarcs);
  ePaths.moveTo(lw-t, lh-etarcs);//right
  ePaths.lineTo(lw, lh-etarcs);
  ePaths.lineTo(lw, lmh);
  ePaths.lineTo(lw-t, lmh);
  ePaths.moveTo(etarcs, lh);//top
  ePaths.lineTo(lw-etarcs, lh);
  ePaths.lineTo(lw-etarcs, lh-tlt);
  ePaths.lineTo(etarcs, lh-tlt);
  ePaths.moveTo(ebarcs, 0);//bottom
  ePaths.lineTo(ebarcs, tlt);
  ePaths.lineTo(lw-ebarcs, tlt);
  ePaths.lineTo(lw-ebarcs, 0);
  if(ebarcs<t) {
    ePaths.moveTo(lw-tlt, t);//right-bottom
    ePaths.lineTo(lw, t);
    ePaths.lineTo(lw, ebarcs);
    ePaths.lineTo(lw-tlt, ebarcs);
  }
  var eGlyphs = new opentype.Glyph({
    name: 'e',
    unicode: 101,
    advanceWidth: lw+s+g,
    path: ePaths
  });


  var fPaths = new opentype.Path();
  var fws = lw/4*3;
  var farcs = Math.round((arcs/3*2)/10)*10;
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
    advanceWidth: fws+g,
    path: fPaths
  });


  var gPaths = new opentype.Path();
  var garcs = arcs;
  var gbarcs = arcs;
  var gws = lw;
  if(garcs > gws/2)
  garcs = Math.round((gws/2)/10)*10;
  if(garcs > lh/2)
  garcs = Math.round((lh/2)/10)*10;
  gbarcs = garcs
  if(garcs*2>=gws*0.8)
  os= lh*0.03*(100-(gws-garcs*2))/100;
  else os=0;

  gPaths.moveTo(0, lh+os-garcs-os/2);//left-top-arc
  gPaths.curveTo(0, lh+os-garcs+garcs/2-os/2, garcs/2, lh+os-os/2, garcs, lh+os-os/2);
  gPaths.lineTo(garcs, lh+os-tlt-os/2);
  gPaths.curveTo(garcs-(garcs-t)/2, lh+os-tlt-os/2, t, lh+os-garcs+(garcs-tlt)/2-os/2, t, lh+os-garcs-os/2);
  gPaths.moveTo(gws-garcs, lh+os-os/2);//right-top-arc
  gPaths.curveTo(gws-garcs+(garcs-t+tlt)/2, lh+os-os/2, gws-t+tlt, lh+os-garcs/2-os/2, gws-t+tlt, lh+os-garcs-os/2);
  gPaths.lineTo(gws-t, lh+os-garcs-os/2);
  gPaths.curveTo(gws-t, lh+os-garcs+(garcs-tlt)/2-os/2, gws-garcs+(garcs-t)/2, lh+os-tlt-os/2, gws-garcs, lh+os-tlt-os/2);
  gPaths.moveTo(t, garcs-os/2);//left-bottom-arc
  gPaths.curveTo(t, garcs-(garcs-tlt)/2-os/2, garcs-(garcs-t)/2, tlt-os/2, garcs, tlt-os/2);
  gPaths.lineTo(garcs, 0-os/2);
  gPaths.curveTo(garcs/2, 0-os/2, 0, garcs/2-os/2, 0, garcs-os/2);
  gPaths.moveTo(gws-t+tlt, garcs-os/2);//right-bottom-arc
  gPaths.curveTo(gws-t+tlt, garcs/2-os/2, gws-garcs+(garcs-t+tlt)/2, 0-os/2, gws-garcs, 0-os/2);
  gPaths.lineTo(gws-garcs, tlt-os/2);
  gPaths.curveTo(gws-garcs+(garcs-t)/2, tlt-os/2, gws-t, garcs-(garcs-tlt)/2-os/2, gws-t, garcs-os/2);
  gPaths.moveTo(0, lh+os-garcs-os/2);//left
  gPaths.lineTo(t, lh+os-garcs-os/2);
  gPaths.lineTo(t, garcs-os/2);
  gPaths.lineTo(0, garcs-os/2);
  gPaths.moveTo(gws-t, lh);//right
  gPaths.lineTo(gws, lh);
  gPaths.lineTo(gws, -d+gbarcs-os/2);
  gPaths.lineTo(gws-t, -d+gbarcs-os/2);
  gPaths.moveTo(garcs, lh+os-os/2);//top
  gPaths.lineTo(gws-garcs, lh+os-os/2);
  gPaths.lineTo(gws-garcs, lh+os-tlt-os/2);
  gPaths.lineTo(garcs, lh+os-tlt-os/2);
  gPaths.moveTo(garcs, 0-os/2);//bottom
  gPaths.lineTo(garcs, tlt-os/2);
  gPaths.lineTo(gws-garcs, tlt-os/2);
  gPaths.lineTo(gws-garcs, 0-os/2);
  gPaths.moveTo(0, -d+gbarcs-os/2);//left-under-arc
  gPaths.lineTo(t, -d+gbarcs-os/2);
  gPaths.curveTo(t, -d+gbarcs-(gbarcs-tlt)/2-os/2, gbarcs-(gbarcs-t)/2, -d+tlt-os/2, gbarcs, -d+tlt-os/2);
  gPaths.lineTo(gbarcs, -d+0-os/2);
  gPaths.curveTo(gbarcs/2, -d-os/2, 0, -d+gbarcs/2-os/2, 0, -d+gbarcs-os/2);
  gPaths.moveTo(gws, -d+gbarcs-os/2);//right-under-arc
  gPaths.curveTo(gws, -d+gbarcs/2-os/2, gws-gbarcs/2, -d-os/2, gws-gbarcs, -d-os/2);
  gPaths.lineTo(gws-gbarcs, -d+tlt-os/2);
  gPaths.curveTo(gws-gbarcs+(gbarcs-t)/2, -d+tlt-os/2, gws-t, -d+gbarcs-(gbarcs-tlt)/2-os/2, gws-t, -d+gbarcs-os/2);
  gPaths.moveTo(gbarcs, -d-os/2);//under-bottom
  gPaths.lineTo(gbarcs, -d+tlt-os/2);
  gPaths.lineTo(gws-gbarcs, -d+tlt-os/2);
  gPaths.lineTo(gws-gbarcs, -d-os/2);
  if(gbarcs<t) {
    gPaths.moveTo(0, -d+t-os/2);//under-bottom
    gPaths.lineTo(t, -d+t-os/2);
    gPaths.lineTo(t, -d+gbarcs-os/2);
    gPaths.lineTo(0, -d+gbarcs-os/2);
  }
  if(srf) {
    gPaths.moveTo(gws, lh);//top-serif
    gPaths.lineTo(gws+s, lh);
    gPaths.lineTo(gws+s, lh-tlt);
    gPaths.curveTo(gws+s/2, lh-tlt, gws, lh-tlt-sh/2, gws, lh-tlt-sh);
  }
  var gGlyphs = new opentype.Glyph({
    name: 'g',
    unicode: 103,
    advanceWidth: gws+s+g,
    path: gPaths
  });

  var hPaths = new opentype.Path();
  var harcs = arcs;
  var hws = lw;
  if(harcs > hws/2)
  harcs = Math.round((hws/2)/10)*10;
  if(harcs*2>=hws*0.8)
  os= lh*0.03*(100-(hws-harcs*2))/100;
  else os=0;

  hPaths.moveTo(t-tlt, lh+os-harcs-os/2);//left-top-arc
  hPaths.curveTo(t-tlt, lh+os-harcs+harcs/2-os/2, harcs-(harcs-(t-tlt))/2, lh+os-os/2, harcs, lh+os-os/2);
  hPaths.lineTo(harcs, lh+os-tlt-os/2);
  hPaths.curveTo(harcs-(harcs-t)/2, lh+os-tlt-os/2, t, lh+os-harcs+(harcs-tlt)/2-os/2, t, lh+os-harcs-os/2);
  hPaths.moveTo(hws-harcs, lh+os-os/2);//right-top-arc
  hPaths.curveTo(hws-harcs/2, lh+os-os/2, hws, lh+os-harcs/2-os/2, hws, lh+os-harcs-os/2);
  hPaths.lineTo(hws-t, lh+os-harcs-os/2);
  hPaths.curveTo(hws-t, lh+os-harcs+(harcs-tlt)/2-os/2, hws-harcs+(harcs-t)/2, lh+os-tlt-os/2, hws-harcs, lh+os-tlt-os/2);
  hPaths.moveTo(0, lhh);//left
  hPaths.lineTo(t, lhh);
  hPaths.lineTo(t, 0);
  hPaths.lineTo(0, 0);
  hPaths.moveTo(hws-t, lh+os-harcs-os/2);//right
  hPaths.lineTo(hws, lh+os-harcs-os/2);
  hPaths.lineTo(hws, 0);
  hPaths.lineTo(hws-t, 0);
  hPaths.moveTo(harcs, lh+os-os/2);//top
  hPaths.lineTo(hws-harcs, lh+os-os/2);
  hPaths.lineTo(hws-harcs, lh+os-tlt-os/2);
  hPaths.lineTo(harcs, lh+os-tlt-os/2);

  if(srf) {
    hPaths.moveTo(-s, lhh);//top-left-serif
    hPaths.lineTo(0, lhh);
    hPaths.lineTo(0, lhh-tlt-sh);
    hPaths.curveTo(0, lhh-tlt-sh/2, -s/2, lhh-tlt, -s, lhh-tlt);

    hPaths.moveTo(t+s, 0);//bottom-left-serif
    hPaths.lineTo(-s, 0);
    hPaths.lineTo(-s, tlt);
    hPaths.curveTo(-s/2, tlt, 0, tlt+sh/2, 0, tlt+sh);
    hPaths.lineTo(t, tlt+sh);
    hPaths.curveTo(t, tlt+sh/2, t+s/2, tlt, t+s, tlt);

    hPaths.moveTo(lw+s, 0);//bottom-right-serif
    hPaths.lineTo(lw, 0);
    hPaths.lineTo(lw, tlt+sh);
    hPaths.curveTo(lw, tlt+sh/2, lw+s/2, tlt, lw+s, tlt);
  }
  var hGlyphs = new opentype.Glyph({
    name: 'h',
    unicode: 104,
    advanceWidth: hws+s*2+g,
    path: hPaths
  });


  var iPaths = new opentype.Path();
  var dos = t*0.12;
  var iarcs = arcs;
  if(iarcs > (t)/2)
    iarcs = (t)/2;//Math.round(((t+dos)/2)/10)*10;
  dos= t*0.04*(300-(t-iarcs*2))/100;

  iPaths.moveTo(0, lhh-t-dos-lhh/10);//middle
  iPaths.lineTo(t, lhh-t-dos-lhh/10);
  iPaths.lineTo(t, 0);
  iPaths.lineTo(0, 0);
  iPaths.moveTo(0-dos/2, lhh-iarcs+dos/2);//dot-point
  iPaths.curveTo(0-dos/2, lhh-iarcs/2+dos/2, iarcs/2-dos/2, lhh+dos/2, iarcs-dos/2, lhh+dos/2);
  iPaths.lineTo(t-iarcs+dos/2, lhh+dos/2);
  iPaths.curveTo(t-iarcs/2+dos/2, lhh+dos/2, t+dos/2, lhh-iarcs/2+dos/2, t+dos/2, lhh-iarcs+dos/2);
  iPaths.lineTo(t+dos/2, lhh-t+iarcs-dos/2);
  iPaths.curveTo(t+dos/2, lhh-t+iarcs/2-dos/2, t-iarcs/2+dos/2, lhh-t-dos/2, t-iarcs+dos/2, lhh-t-dos/2);
  iPaths.lineTo(iarcs-dos/2, lhh-t-dos/2);
  iPaths.curveTo(iarcs/2-dos/2, lhh-t-dos/2, 0-dos/2, lhh-t+iarcs/2-dos/2, 0-dos/2, lhh-t+iarcs-dos/2);
  if(srf) {
    iPaths.moveTo(-s, lhh-t-dos-lhh/10);//top-left-serif
    iPaths.lineTo(0, lhh-t-dos-lhh/10);
    iPaths.lineTo(0, lhh-t-dos-lhh/10-tlt-sh);
    iPaths.curveTo(0, lhh-t-dos-lhh/10-tlt-sh/2, -s/2, lhh-t-dos-lhh/10-tlt, -s, lhh-t-dos-lhh/10-tlt);

    iPaths.moveTo(t+s, 0);//bottom-left-serif
    iPaths.lineTo(-s, 0);
    iPaths.lineTo(-s, tlt);
    iPaths.curveTo(-s/2, tlt, 0, tlt+sh/2, 0, tlt+sh);
    iPaths.lineTo(t, tlt+sh);
    iPaths.curveTo(t, tlt+sh/2, t+s/2, tlt, t+s, tlt);
  }
  var iGlyphs = new opentype.Glyph({
    name: 'i',
    unicode: 105,
    advanceWidth: t+s*2+g,
    path: iPaths
  });

  var jPaths = new opentype.Path();
  var jws = Math.round((lw*0.8)/10)*10;
  // var jarcs = Math.round((t/2)/10)*10;
  var jbarcs = arcs;
  if(jbarcs >= jws/2)
  jbarcs = Math.round((jws/2)/10)*10;

  var jarcs = arcs;
  if(jarcs > (t)/2)
    jarcs = (t)/2;//Math.round(((t+dos)/2)/10)*10;
  dos= t*0.04*(300-(t-jarcs*2))/100;
  if(jbarcs*2>=jws*0.8)
  os= lh*0.03*(100-(jws-jbarcs*2))/100;

  jPaths.moveTo(jws-t-dos/2, lhh-jarcs+dos/2);//dot-pojnt
  jPaths.curveTo(jws-t-dos/2, lhh-jarcs/2+dos/2, jws-t+jarcs/2-dos/2, lhh+dos/2, jws-t+jarcs-dos/2, lhh+dos/2);
  jPaths.lineTo(jws-t+t-jarcs+dos/2, lhh+dos/2);
  jPaths.curveTo(jws-t+t-jarcs/2+dos/2, lhh+dos/2, jws-t+t+dos/2, lhh-jarcs/2+dos/2, jws-t+t+dos/2, lhh-jarcs+dos/2);
  jPaths.lineTo(jws-t+t+dos/2, lhh-t+jarcs-dos/2);
  jPaths.curveTo(jws-t+t+dos/2, lhh-t+jarcs/2-dos/2, jws-t+t-jarcs/2+dos/2, lhh-t-dos/2, jws-t+t-jarcs+dos/2, lhh-t-dos/2);
  jPaths.lineTo(jws-t+jarcs-dos/2, lhh-t-dos/2);
  jPaths.curveTo(jws-t+jarcs/2-dos/2, lhh-t-dos/2, jws-t-dos/2, lhh-t+jarcs/2-dos/2, jws-t-dos/2, lhh-t+jarcs-dos/2);

  jPaths.moveTo(0, -d+jbarcs-os/2);//left-under-arc
  jPaths.lineTo(t, -d+jbarcs-os/2);
  jPaths.curveTo(t, -d+jbarcs-(jbarcs-tlt)/2-os/2, jbarcs-(jbarcs-t)/2, -d+tlt-os/2, jbarcs, -d+tlt-os/2);
  jPaths.lineTo(jbarcs, -d+0-os/2);
  jPaths.curveTo(jbarcs/2, -d-os/2, 0, -d+jbarcs/2-os/2, 0, -d+jbarcs-os/2);
  jPaths.moveTo(jws-t, lhh-t-dos-lhh/10);//middle 점 크기 소수점 때문에 공백 생김. 아크에 합쳐버려서 공백 없애기
  jPaths.lineTo(jws, lhh-t-dos-lhh/10);
  jPaths.lineTo(jws, -d+jbarcs-os/2);//right-under-arc
  jPaths.curveTo(jws, -d+jbarcs/2-os/2, jws-jbarcs/2, -d-os/2, jws-jbarcs, -d-os/2);
  jPaths.lineTo(jws-jbarcs, -d+tlt-os/2);
  jPaths.curveTo(jws-jbarcs+(jbarcs-t)/2, -d+tlt-os/2, jws-t, -d+jbarcs-(jbarcs-tlt)/2-os/2, jws-t, -d+jbarcs-os/2);
  jPaths.moveTo(jbarcs, -d-os/2);//under-bottom
  jPaths.lineTo(jbarcs, -d+tlt-os/2);
  jPaths.lineTo(jws-jbarcs, -d+tlt-os/2);
  jPaths.lineTo(jws-jbarcs, -d-os/2);
  if(jbarcs<t) {
    jPaths.moveTo(0, -d+t-os/2);//under-bottom
    jPaths.lineTo(t, -d+t-os/2);
    jPaths.lineTo(t, -d+jbarcs-os/2);
    jPaths.lineTo(0, -d+jbarcs-os/2);
  }
  if(srf) {
    jPaths.moveTo(jws-t-s, lhh-t-dos-lhh/10);//top-left-serif
    jPaths.lineTo(jws-t, lhh-t-dos-lhh/10);
    jPaths.lineTo(jws-t, lhh-t-dos-lhh/10-tlt-sh);
    jPaths.curveTo(jws-t, lhh-t-dos-lhh/10-tlt-sh/2, jws-t-s/2, lhh-t-dos-lhh/10-tlt, jws-t-s, lhh-t-dos-lhh/10-tlt);
  }
  var jGlyphs = new opentype.Glyph({
    name: 'j',
    unicode: 106,
    advanceWidth: jws+g,
    path: jPaths
  });

  var kPaths = new opentype.Path();
  kPaths.moveTo(0, lhh);//left
  kPaths.lineTo(t, lhh);
  kPaths.lineTo(t, 0);
  kPaths.lineTo(0, 0);
  // kPaths.moveTo(lw-t, lh);//right-top "/"
  // kPaths.lineTo(lw, lh);
  // kPaths.lineTo(t, lmh);
  // kPaths.lineTo(0, lmh);
  // kPaths.moveTo(lw*0.5-t, (lh-lmh)*0.5+lmh);//right-bottom "\"
  // kPaths.lineTo(lw*0.5, (lh-lmh)*0.5+lmh);
  // kPaths.lineTo(lw, 0);
  // kPaths.lineTo(lw-t, 0);
  kPaths.moveTo(t, lh*0.4);// "/"shape
  kPaths.lineTo(t-tlt, lh*0.4);
  kPaths.lineTo(t-tlt, lh*0.4+tlt*lw/750*0.3);
  kPaths.lineTo(lw-tlt*w/500, lh);
  kPaths.lineTo(lw, lh);
  kPaths.moveTo((lw-t)*0.3+t, (lh-lh*0.4)*0.3+lh*0.4);// "\"shape
  kPaths.lineTo(lw, 0);
  kPaths.lineTo(lw-t-lw/35, 0);
  kPaths.lineTo(lw*(300-t*1.7)/1000+t/2, (lh-lh*0.4)*(190-t*0.8)/700+lh*0.4);//(w*(110-t)/700+t/2, (h-mh)*(180-t)/560+mh);
  if(srf) {
    kPaths.moveTo(-s, lhh);//top-left-serif
    kPaths.lineTo(0, lhh);
    kPaths.lineTo(0, lhh-tlt-sh);
    kPaths.curveTo(0, lhh-tlt-sh/2, -s/2, lhh-tlt, -s, lhh-tlt);

    kPaths.moveTo(t+s, 0);//bottom-left-serif
    kPaths.lineTo(-s, 0);
    kPaths.lineTo(-s, tlt);
    kPaths.curveTo(-s/2, tlt, 0, tlt+sh/2, 0, tlt+sh);
    kPaths.lineTo(t, tlt+sh);
    kPaths.curveTo(t, tlt+sh/2, t+s/2, tlt, t+s, tlt);

    kPaths.moveTo(lw+s*0.6, 0);//bottom-right-serif
    kPaths.lineTo(lw-t-s, 0);
    kPaths.lineTo(lw-t-s, tlt);
    kPaths.lineTo(lw-tlt-s-w*0.002-s*0.2, tlt+sh*0.2);
    kPaths.lineTo(lw+s*0.6, tlt);
    kPaths.moveTo(lw-tlt-s, lh);//top-right-serif
    kPaths.lineTo(lw+s*0.6, lh);
    kPaths.lineTo(lw+s*0.6, lh-tlt);
    kPaths.lineTo(lw-tlt-s-lw*0.04-s*0.2, lh-tlt-sh*0.2);
  }
  var kGlyphs = new opentype.Glyph({
    name: 'k',
    unicode: 107,
    advanceWidth: lw+s*2+g,
    path: kPaths
  });

  var lPaths = new opentype.Path();
  lPaths.moveTo(0, lhh);//middle
  lPaths.lineTo(t, lhh);
  lPaths.lineTo(t, 0);
  lPaths.lineTo(0, 0);
  if(srf) {
    lPaths.moveTo(-s, lhh);//top-left-serif
    lPaths.lineTo(0, lhh);
    lPaths.lineTo(0, lhh-tlt-sh);
    lPaths.curveTo(0, lhh-tlt-sh/2, -s/2, lhh-tlt, -s, lhh-tlt);

    lPaths.moveTo(t+s, 0);//bottom-left-serif
    lPaths.lineTo(-s, 0);
    lPaths.lineTo(-s, tlt);
    lPaths.curveTo(-s/2, tlt, 0, tlt+sh/2, 0, tlt+sh);
    lPaths.lineTo(t, tlt+sh);
    lPaths.curveTo(t, tlt+sh/2, t+s/2, tlt, t+s, tlt);
  }
  var lGlyphs = new opentype.Glyph({
    name: 'l',
    unicode: 108,
    advanceWidth: t+s*2+g,
    path: lPaths
  });


  var mPaths = new opentype.Path();
  var marcs = arcs;
  var mws = lw*2-t;
  if(marcs > (mws/2+t/2)/2)
  marcs = Math.round(((mws/2+t/2)/2)/10)*10;
  else marcs = arcs;
  if(marcs*2>=(mws/2+t/2)*0.8)
  os= lh*0.03*(100-(mws/2+t/2-marcs*2))/100;
  else os=0;

  mPaths.moveTo(t-tlt, lh+os-marcs-os/2);//left-top-arc
  mPaths.curveTo(t-tlt, lh+os-marcs+marcs/2-os/2, marcs-(marcs-(t-tlt))/2, lh+os-os/2, marcs, lh+os-os/2);
  mPaths.lineTo(marcs, lh+os-tlt-os/2);
  mPaths.curveTo(marcs-(marcs-t)/2, lh+os-tlt-os/2, t, lh+os-marcs+(marcs-tlt)/2-os/2, t, lh+os-marcs-os/2);
  mPaths.moveTo(mws/2+t/2-marcs, lh+os-os/2);//middle-left-arc
  mPaths.curveTo(mws/2+t/2-marcs/2, lh+os-os/2, mws/2+t/2, lh+os-marcs/2-os/2, mws/2+t/2, lh+os-marcs-os/2);
  mPaths.lineTo(mws/2+t/2-t, lh+os-marcs-os/2);
  mPaths.curveTo(mws/2+t/2-t, lh+os-marcs+(marcs-tlt)/2-os/2, mws/2+t/2-marcs+(marcs-t)/2, lh+os-tlt-os/2, mws/2+t/2-marcs, lh+os-tlt-os/2);
  mPaths.moveTo(mws/2+t/2-tlt, lh+os-marcs-os/2);//middle-right-arc
  mPaths.curveTo(mws/2+t/2-tlt, lh+os-marcs+marcs/2-os/2, mws/2+t/2-tlt+(marcs-t+tlt)/2, lh+os-os/2, mws/2-t/2+marcs, lh+os-os/2);
  mPaths.lineTo(mws/2-t/2+marcs, lh+os-tlt-os/2);
  mPaths.curveTo(mws/2-t/2+marcs-(marcs-t)/2, lh+os-tlt-os/2, mws/2-t/2+t, lh+os-marcs+(marcs-tlt)/2-os/2, mws/2-t/2+t, lh+os-marcs-os/2);
  mPaths.moveTo(mws-marcs, lh+os-os/2);//right-top-arc
  mPaths.curveTo(mws-marcs/2, lh+os-os/2, mws, lh+os-marcs/2-os/2, mws, lh+os-marcs-os/2);
  mPaths.lineTo(mws-t, lh+os-marcs-os/2);
  mPaths.curveTo(mws-t, lh+os-marcs+(marcs-tlt)/2-os/2, mws-marcs+(marcs-t)/2, lh+os-tlt-os/2, mws-marcs, lh+os-tlt-os/2);
  mPaths.moveTo(0, lh);//left
  mPaths.lineTo(t, lh);
  mPaths.lineTo(t, 0);
  mPaths.lineTo(0, 0);
  mPaths.moveTo(mws/2-t/2, lh-marcs+os/2);//middle
  mPaths.lineTo(mws/2+t/2, lh-marcs+os/2);
  mPaths.lineTo(mws/2+t/2, 0);
  mPaths.lineTo(mws/2-t/2, 0);
  mPaths.moveTo(mws-t, lh+os-marcs-os/2);//right
  mPaths.lineTo(mws, lh+os-marcs-os/2);
  mPaths.lineTo(mws, 0);
  mPaths.lineTo(mws-t, 0);
  mPaths.moveTo(marcs, lh+os/2);//top-left
  mPaths.lineTo(mws/2+t/2-marcs, lh+os/2);
  mPaths.lineTo(mws/2+t/2-marcs, lh-tlt+os/2);
  mPaths.lineTo(marcs, lh-tlt+os/2);
  mPaths.moveTo(mws/2-t/2+marcs, lh+os/2);//top-right
  mPaths.lineTo(mws-marcs, lh+os/2);
  mPaths.lineTo(mws-marcs, lh-tlt+os/2);
  mPaths.lineTo(mws/2-t/2+marcs, lh-tlt+os/2);
  if(srf) {
    mPaths.moveTo(-s, lh);//top-left-serif
    mPaths.lineTo(0, lh);
    mPaths.lineTo(0, lh-tlt-sh);
    mPaths.curveTo(0, lh-tlt-sh/2, -s/2, lh-tlt, -s, lh-tlt);

    mPaths.moveTo(t+s, 0);//bottom-left-serif
    mPaths.lineTo(-s, 0);
    mPaths.lineTo(-s, tlt);
    mPaths.curveTo(-s/2, tlt, 0, tlt+sh/2, 0, tlt+sh);
    mPaths.lineTo(t, tlt+sh);
    mPaths.curveTo(t, tlt+sh/2, t+s/2, tlt, t+s, tlt);

    mPaths.moveTo(mws/2+t/2+s, 0);//bottom-middle-serif
    mPaths.lineTo(mws/2+t/2, 0);
    mPaths.lineTo(mws/2+t/2, tlt+sh);
    mPaths.curveTo(mws/2+t/2, tlt+sh/2, mws/2+t/2+s/2, tlt, mws/2+t/2+s, tlt);

    mPaths.moveTo(mws+s, 0);//bottom-right-serif
    mPaths.lineTo(mws, 0);
    mPaths.lineTo(mws, tlt+sh);
    mPaths.curveTo(mws, tlt+sh/2, mws+s/2, tlt, mws+s, tlt);
  }
  var mGlyphs = new opentype.Glyph({
    name: 'm',
    unicode: 109,
    advanceWidth: mws+s*2+g,
    path: mPaths
  });

  var nPaths = new opentype.Path();
  var narcs = arcs;
  var nws = lw;
  if(narcs > nws/2)
  narcs = Math.round((nws/2)/10)*10;
  else narcs = arcs;
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
    advanceWidth: nws+s*2+g,
    path: nPaths
  });


  var oPaths = new opentype.Path();
  var oarcs = arcs;
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
    advanceWidth: ows+s+g,
    path: oPaths
  });


  var pPaths = new opentype.Path();
  var parcs = arcs;
  var pws = lw;
  if(parcs > pws/2)
  parcs = Math.round((pws/2)/10)*10;
  if(parcs > lh/2)
  parcs = Math.round((lh/2)/10)*10;
  if(parcs*2>=pws*0.8)
  os= lh*0.03*(100-(pws-parcs*2))/100;
  else os=0;

  pPaths.moveTo(t-tlt, lh+os-parcs-os/2);//left-top-arc
  pPaths.curveTo(t-tlt, lh+os-parcs+parcs/2-os/2, parcs-(parcs-(t-tlt))/2, lh+os-os/2, parcs, lh+os-os/2);
  pPaths.lineTo(parcs, lh+os-tlt-os/2);
  pPaths.curveTo(parcs-(parcs-t)/2, lh+os-tlt-os/2, t, lh+os-parcs+(parcs-tlt)/2-os/2, t, lh+os-parcs-os/2);
  pPaths.moveTo(pws-parcs, lh+os-os/2);//riglht-top-arc
  pPaths.curveTo(pws-parcs/2, lh+os-os/2, pws, lh+os-parcs/2-os/2, pws, lh+os-parcs-os/2);
  pPaths.lineTo(pws-t, lh+os-parcs-os/2);
  pPaths.curveTo(pws-t, lh+os-parcs+(parcs-tlt)/2-os/2, pws-parcs+(parcs-t)/2, lh+os-tlt-os/2, pws-parcs, lh+os-tlt-os/2);
  pPaths.moveTo(t-tlt, parcs-os/2);//left-bottom-arc
  pPaths.lineTo(t, parcs-os/2);
  pPaths.curveTo(t, parcs-(parcs-tlt)/2-os/2, parcs-(parcs-t)/2, tlt-os/2, parcs, tlt-os/2);
  pPaths.lineTo(parcs, 0-os/2);
  pPaths.curveTo(parcs-(parcs-(t-tlt))/2, 0-os/2, t-tlt, parcs/2-os/2, t-tlt, parcs-os/2);
  pPaths.moveTo(pws, parcs-os/2);//riglht-bottom-arc
  pPaths.curveTo(pws, parcs/2-os/2, pws-parcs/2, 0-os/2, pws-parcs, 0-os/2);
  pPaths.lineTo(pws-parcs, tlt-os/2);
  pPaths.curveTo(pws-parcs+(parcs-t)/2, tlt-os/2, pws-t, parcs-(parcs-tlt)/2-os/2, pws-t, parcs-os/2);
  pPaths.moveTo(0, lh);//left
  pPaths.lineTo(t, lh);
  pPaths.lineTo(t, -d);
  pPaths.lineTo(0, -d);
  pPaths.moveTo(pws-t, lh+os-parcs-os/2);//riglht
  pPaths.lineTo(pws, lh+os-parcs-os/2);
  pPaths.lineTo(pws, parcs-os/2);
  pPaths.lineTo(pws-t, parcs-os/2);
  pPaths.moveTo(parcs, lh+os-os/2);//top
  pPaths.lineTo(pws-parcs, lh+os-os/2);
  pPaths.lineTo(pws-parcs, lh+os-tlt-os/2);
  pPaths.lineTo(parcs, lh+os-tlt-os/2);
  pPaths.moveTo(parcs, 0-os/2);//pottom
  pPaths.lineTo(parcs, tlt-os/2);
  pPaths.lineTo(pws-parcs, tlt-os/2);
  pPaths.lineTo(pws-parcs, 0-os/2);
  if(srf) {
    pPaths.moveTo(-s, lh);//top-left-serif
    pPaths.lineTo(0, lh);
    pPaths.lineTo(0, lh-tlt-sh);
    pPaths.curveTo(0, lh-tlt-sh/2, -s/2, lh-tlt, -s, lh-tlt);

    pPaths.moveTo(t+s, -d);//bottom-left-serif
    pPaths.lineTo(-s, -d);
    pPaths.lineTo(-s, -d+tlt);
    pPaths.curveTo(-s/2, -d+tlt, 0, -d+tlt+sh/2, 0, -d+tlt+sh);
    pPaths.lineTo(t, -d+tlt+sh);
    pPaths.curveTo(t, -d+tlt+sh/2, t+s/2, -d+tlt, t+s, -d+tlt);
  }
  var pGlyphs = new opentype.Glyph({
    name: 'p',
    unicode: 112,
    advanceWidth: pws+s+g,
    path: pPaths
  });


  var qPaths = new opentype.Path();
  var qarcs = arcs;
  var qws = lw;
  if(qarcs > qws/2)
  qarcs = Math.round((qws/2)/10)*10;
  if(qarcs > lh/2)
  qarcs = Math.round((lh/2)/10)*10;
  if(qarcs*2>=qws*0.8)
  os= lh*0.03*(100-(qws-qarcs*2))/100;
  else os=0;

  qPaths.moveTo(0, lh+os-qarcs-os/2);//left-top-arc
  qPaths.curveTo(0, lh+os-qarcs+qarcs/2-os/2, qarcs/2, lh+os-os/2, qarcs, lh+os-os/2);
  qPaths.lineTo(qarcs, lh+os-tlt-os/2);
  qPaths.curveTo(qarcs-(qarcs-t)/2, lh+os-tlt-os/2, t, lh+os-qarcs+(qarcs-tlt)/2-os/2, t, lh+os-qarcs-os/2);
  qPaths.moveTo(qws-qarcs, lh+os-os/2);//right-top-arc
  qPaths.curveTo(qws-qarcs+(qarcs-t+tlt)/2, lh+os-os/2, qws-t+tlt, lh+os-qarcs/2-os/2, qws-t+tlt, lh+os-qarcs-os/2);
  qPaths.lineTo(qws-t, lh+os-qarcs-os/2);
  qPaths.curveTo(qws-t, lh+os-qarcs+(qarcs-tlt)/2-os/2, qws-qarcs+(qarcs-t)/2, lh+os-tlt-os/2, qws-qarcs, lh+os-tlt-os/2);
  qPaths.moveTo(t, qarcs-os/2);//left-bottom-arc
  qPaths.curveTo(t, qarcs-(qarcs-tlt)/2-os/2, qarcs-(qarcs-t)/2, tlt-os/2, qarcs, tlt-os/2);
  qPaths.lineTo(qarcs, 0-os/2);
  qPaths.curveTo(qarcs/2, 0-os/2, 0, qarcs/2-os/2, 0, qarcs-os/2);
  qPaths.moveTo(qws-t+tlt, qarcs-os/2);//right-bottom-arc
  qPaths.curveTo(qws-t+tlt, qarcs/2-os/2, qws-qarcs+(qarcs-t+tlt)/2, 0-os/2, qws-qarcs, 0-os/2);
  qPaths.lineTo(qws-qarcs, tlt-os/2);
  qPaths.curveTo(qws-qarcs+(qarcs-t)/2, tlt-os/2, qws-t, qarcs-(qarcs-tlt)/2-os/2, qws-t, qarcs-os/2);
  qPaths.moveTo(0, lh-oarcs+os/2);//left
  qPaths.lineTo(t, lh-oarcs+os/2);
  qPaths.lineTo(t, oarcs-os/2);
  qPaths.lineTo(0, oarcs-os/2);
  qPaths.moveTo(qws-t, lh);//riglht
  qPaths.lineTo(qws, lh);
  qPaths.lineTo(qws, -d);
  qPaths.lineTo(qws-t, -d);
  qPaths.moveTo(qarcs, lh+os-os/2);//top
  qPaths.lineTo(qws-qarcs, lh+os-os/2);
  qPaths.lineTo(qws-qarcs, lh+os-tlt-os/2);
  qPaths.lineTo(qarcs, lh+os-tlt-os/2);
  qPaths.moveTo(qarcs, 0-os/2);//qottom
  qPaths.lineTo(qarcs, tlt-os/2);
  qPaths.lineTo(qws-qarcs, tlt-os/2);
  qPaths.lineTo(qws-qarcs, 0-os/2);
  if(srf) {
    qPaths.moveTo(gws, lh);//top-serif
    qPaths.lineTo(gws+s, lh);
    qPaths.lineTo(gws+s, lh-tlt);
    qPaths.curveTo(gws+s/2, lh-tlt, gws, lh-tlt-sh/2, gws, lh-tlt-sh);

    qPaths.moveTo(qws+s, -d);//bottom-left-serif
    qPaths.lineTo(qws-t-s, -d);
    qPaths.lineTo(qws-t-s, -d+tlt);
    qPaths.curveTo(qws-t-s/2, -d+tlt, qws-t, -d+tlt+sh/2, qws-t, -d+tlt+sh);
    qPaths.lineTo(qws, -d+tlt+sh);
    qPaths.curveTo(qws, -d+tlt+sh/2, qws+s/2, -d+tlt, qws+s, -d+tlt);
  }
  var qGlyphs = new opentype.Glyph({
    name: 'q',
    unicode: 113,
    advanceWidth: qws+s*2+g,
    path: qPaths
  });


  var rPaths = new opentype.Path();
  var rarcs = arcs;
  var rws = lw/2+30;
  if(rws <= rarcs)
  rarcs = Math.round((rws)/10)*10;
  else rarcs = arcs;
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
  var starcs = arcs;
  var sbarcs = arcs;
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
  // else starcs = arcs;

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
    advanceWidth: lw+g,
    path: sPaths
  });


  var tPaths = new opentype.Path();
  var tws = lw/4*3;
  var tarcs = Math.round((arcs/3*2)/10)*10;
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
  tPaths.lineTo(tws, lh-tlt);
  tPaths.lineTo(0, lh-tlt);
  if(tarcs-t/2 < tws/2) {
    tPaths.moveTo(tws/2-t/2+tarcs, 0);//bottom
    tPaths.lineTo(tws/2-t/2+tarcs, tlt);
    tPaths.lineTo(tws, tlt);
    tPaths.lineTo(tws, 0);
  }
  var tGlyphs = new opentype.Glyph({
    name: 't',
    unicode: 116,
    advanceWidth: tws+s+g,
    path: tPaths
  });



  var uPaths = new opentype.Path();
  var uarcs = arcs;
  var uws = lw;
  // if(uws <= t*2)
  //   t = uws/2;
  if(uws <= uarcs*2)
  uarcs = Math.round((uws/2)/10)*10;
  else uarcs = arcs;
  if(uarcs*2>=uws*0.8)
  os= lh*0.03*(100-(uws-uarcs*2))/100;
  else os=0;

  uPaths.moveTo(t, uarcs-os/2);//left-bottom-arc
  uPaths.curveTo(t, uarcs-(uarcs-tlt)/2-os/2, uarcs-(uarcs-t)/2, tlt-os/2, uarcs, tlt-os/2);
  uPaths.lineTo(uarcs, 0-os/2);
  uPaths.curveTo(uarcs/2, 0-os/2, 0, uarcs/2-os/2, 0, uarcs-os/2);
  uPaths.moveTo(uws-t+tlt, uarcs-os/2);//right-bottom-arc
  uPaths.curveTo(uws-t+tlt, uarcs/2-os/2, uws-uarcs+(uarcs-t+tlt)/2, 0-os/2, uws-uarcs, 0-os/2);
  uPaths.lineTo(uws-uarcs, tlt-os/2);
  uPaths.curveTo(uws-uarcs+(uarcs-t)/2, tlt-os/2, uws-t, uarcs-(uarcs-tlt)/2-os/2, uws-t, uarcs-os/2);
  uPaths.moveTo(0, lh);//left
  uPaths.lineTo(t, lh);
  uPaths.lineTo(t, oarcs-os/2);
  uPaths.lineTo(0, oarcs-os/2);
  uPaths.moveTo(uws-t, lh);//right
  uPaths.lineTo(uws, lh);
  uPaths.lineTo(uws, 0);
  uPaths.lineTo(uws-t, 0);
  uPaths.moveTo(uarcs, 0-os/2);//bottom
  uPaths.lineTo(uarcs, tlt-os/2);
  uPaths.lineTo(uws-uarcs, tlt-os/2);
  uPaths.lineTo(uws-uarcs, 0-os/2);
  if(srf) {
    uPaths.moveTo(-s, lh);//top-left-serif
    uPaths.lineTo(0, lh);
    uPaths.lineTo(0, lh-tlt-sh);
    uPaths.curveTo(0, lh-tlt-sh/2, -s/2, lh-tlt, -s, lh-tlt);

    uPaths.moveTo(uws-t-s, lh);//top-serif
    uPaths.lineTo(uws-t, lh);
    uPaths.lineTo(uws-t, lh-tlt-sh);
    uPaths.curveTo(uws-t, lh-tlt-sh/2, uws-t-s/2, lh-tlt, uws-t-s, lh-tlt);

    uPaths.moveTo(lw+s, 0);//bottom-right-serif
    uPaths.lineTo(lw, 0);
    uPaths.lineTo(lw, tlt+sh);
    uPaths.curveTo(lw, tlt+sh/2, lw+s/2, tlt, lw+s, tlt);
  }
  var uGlyphs = new opentype.Glyph({
    name: 'u',
    unicode: 117,
    advanceWidth: uws+s*2+g,
    path: uPaths
  });


  var vPaths = new opentype.Path();
  vPaths.moveTo(0, lh);//left
  vPaths.lineTo(t*1.1, lh);
  vPaths.lineTo(lw/2-t*1.1/2+t*1.1, 0);
  vPaths.lineTo(lw/2-t*1.1/2, 0);
  vPaths.moveTo(lw-tlt*1.1, lh);//right
  vPaths.lineTo(lw, lh);
  vPaths.lineTo(lw/2+t*1.1/2, 0);
  vPaths.lineTo(lw/2+t*1.1/2-tlt*1.1, 0);

  if(srf) {
    vPaths.moveTo(-s*0.6, lh);//top-left-serif
    vPaths.lineTo(t+s*0.6, lh);
    vPaths.lineTo(t+s*0.6, lh-tlt);
    vPaths.curveTo(t+s*0.6/2, lh-tlt, tlt, lh-tlt-sh/2, tlt+(lw/2-tlt/2)*sh*0.0016, lh-tlt-sh);
    vPaths.curveTo(tlt, lh-tlt-sh/2, -s*0.6, lh-tlt, -s*0.6, lh-tlt);
    vPaths.moveTo(lw-t-s*0.6, lh);//top-riglht-serif
    vPaths.lineTo(lw+s*0.6, lh);
    vPaths.lineTo(lw+s*0.6, lh-tlt);
    vPaths.curveTo(lw+s*0.6/2, lh-tlt, lw-tlt, lh-tlt-sh/2, lw-tlt-(lw/2-tlt/2)*sh*0.0016, lh-tlt-sh);
    vPaths.curveTo(lw-tlt, lh-tlt-sh/2, lw-t-s*0.6/2, lh-tlt, lw-t-s*0.6, lh-tlt);
  }
  var vGlyphs = new opentype.Glyph({
    name: 'v',
    unicode: 118,
    advanceWidth: lw+s*2+g,
    path: vPaths
  });


  var wPaths = new opentype.Path();
  var ww = lw+200;
  wPaths.moveTo(0, lh);//left
  wPaths.lineTo(t, lh);
  wPaths.lineTo((ww/2+tlt/2)/2+tlt/2, 0);
  wPaths.lineTo((ww/2+tlt/2)/2+tlt/2-t, 0);
  wPaths.moveTo(ww/2-tlt/2, lh);//middle-left
  wPaths.lineTo(ww/2-tlt/2+tlt, lh);
  wPaths.lineTo((ww/2+tlt/2)/2+tlt/2, 0);
  wPaths.lineTo((ww/2+tlt/2)/2+tlt/2-tlt, 0);
  wPaths.moveTo(ww/2-tlt/2, lh);//middle-right
  wPaths.lineTo(ww/2-tlt/2+t, lh);
  wPaths.lineTo(ww-(ww/2+t/2)/2+tlt/2, 0);
  wPaths.lineTo(ww-(ww/2+t/2)/2+tlt/2-t, 0);
  wPaths.moveTo(ww-tlt, lh);//right
  wPaths.lineTo(ww, lh);
  wPaths.lineTo(ww-(ww/2+t/2)/2+tlt/2, 0);
  wPaths.lineTo(ww-(ww/2+t/2)/2+tlt/2-tlt, 0);

  if(srf) {
    wPaths.moveTo(-s*0.6, lh);//top-left-serif
    wPaths.lineTo(t+s*0.6, lh);
    wPaths.lineTo(t+s*0.6, lh-tlt);
    wPaths.curveTo(t+s*0.6/2, lh-tlt, tlt, lh-tlt-sh/2, tlt+(ww/2-tlt/2)*sh*0.0011, lh-tlt-sh);
    wPaths.curveTo(tlt, lh-tlt-sh/2, -s*0.6, lh-tlt, -s*0.6, lh-tlt);
    wPaths.moveTo(ww-t-s*0.6, lh);//top-right-serif
    wPaths.lineTo(ww+s*0.6, lh);
    wPaths.lineTo(ww+s*0.6, lh-tlt);
    wPaths.curveTo(ww+s*0.6/2, lh-tlt, ww-tlt, lh-tlt-sh/2, ww-tlt-(ww/2-tlt/2)*sh*0.001, lh-tlt-sh);
    wPaths.curveTo(ww-tlt, lh-tlt-sh/2, ww-t-s*0.6/2, lh-tlt, ww-t-s*0.6, lh-tlt);
  }
  var wGlyphs = new opentype.Glyph({
    name: 'w',
    unicode: 119,
    advanceWidth: ww+s*2+g,
    path: wPaths
  });


  var xPaths = new opentype.Path();
  xPaths.moveTo(0, lh);//"\" shape
  xPaths.lineTo(t*1.25, lh);
  xPaths.lineTo(lw, 0);
  xPaths.lineTo(lw-t*1.25, 0);
  xPaths.moveTo(lw-tlt*1.25, lh);//"/" shape
  xPaths.lineTo(lw, lh);
  xPaths.lineTo(tlt*1.25, 0);
  xPaths.lineTo(0, 0);

  if(srf) {
    xPaths.moveTo(-s*0.6, lh);//top-left-serif
    xPaths.lineTo(t+s*0.6, lh);
    xPaths.lineTo(t+s*0.6, lh-tlt);
    xPaths.curveTo(t+s*0.6/2, lh-tlt, tlt, lh-tlt-sh/2, tlt+(lw)*sh*0.00185, lh-tlt-sh);
    xPaths.curveTo(tlt, lh-tlt-sh/2, -s*0.6, lh-tlt, -s*0.6, lh-tlt);
    xPaths.moveTo(lw-t-s*0.6, lh);//top-right-serif
    xPaths.lineTo(lw+s*0.6, lh);
    xPaths.lineTo(lw+s*0.6, lh-tlt);
    xPaths.curveTo(lw+s*0.6/2, lh-tlt, lw-tlt, lh-tlt-sh/2, lw-tlt-(lw)*sh*0.00185, lh-tlt-sh);
    xPaths.curveTo(lw-tlt, lh-tlt-sh/2, lw-t-s*0.6/2, lh-tlt, lw-t-s*0.6, lh-tlt);

    xPaths.moveTo(-s*0.6, 0);//bottom-left-serif
    xPaths.lineTo(-s*0.6, tlt);
    xPaths.curveTo(-s*0.6/2, tlt, tlt, tlt+sh/2, tlt+(lw)*sh*0.00185, tlt+sh);
    xPaths.curveTo(tlt, tlt+sh/2, tlt+s*0.6, tlt, tlt+s, tlt);
    xPaths.lineTo(tlt+s, 0);
    xPaths.moveTo(lw-t-s, 0);//bottom-right-serif
    xPaths.lineTo(lw-t-s, tlt);
    xPaths.curveTo(lw-t-s*0.6, tlt, lw-tlt, tlt+sh/2, lw-tlt-(lw)*sh*0.00185, tlt+sh);
    xPaths.curveTo(lw-tlt, tlt+sh/2, lw+s*0.6/2, tlt, lw+s*0.6, tlt);
    xPaths.lineTo(lw+s*0.6, tlt);
    xPaths.lineTo(lw+s*0.6, 0);
  }
  var xGlyphs = new opentype.Glyph({
    name: 'x',
    unicode: 120,
    advanceWidth: lw+s*2+g,
    path: xPaths
  });


  var yPaths = new opentype.Path();
  yPaths.moveTo(0, lh);//left
  yPaths.lineTo(t*1.2, lh);
  // yPaths.lineTo(lw/2+(1-lt)*1*w/800+(190-tlt)*0.4*w/800+t/10*w/800, t*0.8+lt*90);
  // yPaths.lineTo(lw/2+(1-lt)*10*w/800, 0);
  yPaths.lineTo(lw/2+t*0.5+lw*0.02, lw/4*t/100-lw*0.05);
  yPaths.lineTo(lw/2, 0);

  yPaths.moveTo(lw-tlt*1.1, lh);//right
  yPaths.lineTo(lw, lh);
  yPaths.lineTo(tlt+w/6,-d);
  yPaths.lineTo(0+w/6,-d);

  if(srf) {
    yPaths.moveTo(-s*0.6, lh);//top-left-serif
    yPaths.lineTo(t+s*0.6, lh);
    yPaths.lineTo(t+s*0.6, lh-tlt);
    yPaths.curveTo(t+s*0.6/2, lh-tlt, tlt, lh-tlt-sh/2, tlt+(lw/2-tlt/2)*sh*0.0016, lh-tlt-sh);
    yPaths.curveTo(tlt, lh-tlt-sh/2, -s*0.6, lh-tlt, -s*0.6, lh-tlt);
    yPaths.moveTo(lw-t-s*0.6, lh);//top-riglht-serif
    yPaths.lineTo(lw+s*0.6, lh);
    yPaths.lineTo(lw+s*0.6, lh-tlt);
    yPaths.curveTo(lw+s*0.6/2, lh-tlt, lw-tlt, lh-tlt-sh/2, lw-tlt-(lw/2-tlt/2)*sh*0.0016, lh-tlt-sh);
    yPaths.curveTo(lw-tlt, lh-tlt-sh/2, lw-t-s*0.6/2, lh-tlt, lw-t-s*0.6, lh-tlt);
  }
  var yGlyphs = new opentype.Glyph({
    name: 'y',
    unicode: 121,
    advanceWidth: lw+s*2+g,
    path: yPaths
  });



  var zPaths = new opentype.Path();
  zPaths.moveTo(0, lh);//top
  zPaths.lineTo(lw, lh);
  zPaths.lineTo(lw, lh-tlt);
  zPaths.lineTo(0, lh-tlt);
  zPaths.moveTo(0, tlt);//bottom
  zPaths.lineTo(lw, tlt);
  zPaths.lineTo(lw, 0);
  zPaths.lineTo(0, 0);
  zPaths.moveTo(lw-t*(lw/900+0.8), lh-tlt);//"/" shape
  zPaths.lineTo(lw, lh-tlt);
  zPaths.lineTo(t*(lw/900+0.8), tlt);
  zPaths.lineTo(0, tlt);
  if(srf) {
    zPaths.moveTo(tlt+sh, lh-tlt);//top-left-serif
    zPaths.curveTo(tlt+sh/2, lh-tlt, tlt, lh-tlt-s/2, tlt, lh-tlt-s);
    zPaths.lineTo(0, lh-tlt-s);
    zPaths.lineTo(0, lh-tlt);
    zPaths.moveTo(lw-tlt-sh, tlt);//bottom-right-serif
    zPaths.curveTo(lw-tlt-sh/2, tlt, lw-tlt, tlt+s/2, lw-tlt, tlt+s);
    zPaths.lineTo(lw, tlt+s);
    zPaths.lineTo(lw, tlt);
  }
  var zGlyphs = new opentype.Glyph({
    name: 'z',
    unicode: 122,
    advanceWidth: lw+s+g,
    path: zPaths
  });




  var zeroPath = new opentype.Path();
  var zeroarc = arcs;
  var zerow = w*0.8;
  if(zeroarc > zerow/2)
  zeroarc = Math.round((zerow/2)/10)*10;
  if(zeroarc > h/2)
  zeroarc = Math.round((h/2)/10)*10;
  if(zeroarc*2>=zerow*0.8)
  os= h*0.06*(zerow*0.2-(zerow-zeroarc*2))/100;
  else os=0;

  zeroPath.moveTo(0, h+os-zeroarc-os/2);//left-top-arc
  zeroPath.curveTo(0, h+os-zeroarc+zeroarc/2-os/2, zeroarc/2, h+os-os/2, zeroarc, h+os-os/2);
  zeroPath.lineTo(zeroarc, h+os-tlt-os/2);
  zeroPath.curveTo(zeroarc-(zeroarc-t)/2, h+os-tlt-os/2, t, h+os-zeroarc+(zeroarc-tlt)/2-os/2, t, h+os-zeroarc-os/2);
  zeroPath.moveTo(zerow-zeroarc, h+os-os/2);//right-top-arc
  zeroPath.curveTo(zerow-zeroarc/2, h+os-os/2, zerow, h+os-zeroarc/2-os/2, zerow, h+os-zeroarc-os/2);
  zeroPath.lineTo(zerow-t, h+os-zeroarc-os/2);
  zeroPath.curveTo(zerow-t, h+os-zeroarc+(zeroarc-tlt)/2-os/2, zerow-zeroarc+(zeroarc-t)/2, h+os-tlt-os/2, zerow-zeroarc, h+os-tlt-os/2);
  zeroPath.moveTo(0, zeroarc-os/2);//left-bottom-arc
  zeroPath.lineTo(t, zeroarc-os/2);
  zeroPath.curveTo(t, zeroarc-(zeroarc-tlt)/2-os/2, zeroarc-(zeroarc-t)/2, tlt-os/2, zeroarc, tlt-os/2);
  zeroPath.lineTo(zeroarc, 0-os/2);
  zeroPath.curveTo(zeroarc/2, 0-os/2, 0, zeroarc/2-os/2, 0, zeroarc-os/2);
  zeroPath.moveTo(zerow, zeroarc-os/2);//right-bottom-arc
  zeroPath.curveTo(zerow, zeroarc/2-os/2, zerow-zeroarc/2, 0-os/2, zerow-zeroarc, 0-os/2);
  zeroPath.lineTo(zerow-zeroarc, tlt-os/2);
  zeroPath.curveTo(zerow-zeroarc+(zeroarc-t)/2, tlt-os/2, zerow-t, zeroarc-(zeroarc-tlt)/2-os/2, zerow-t, zeroarc-os/2);
  zeroPath.moveTo(0, h+os-zeroarc-os/2);//left
  zeroPath.lineTo(t, h+os-zeroarc-os/2);
  zeroPath.lineTo(t, zeroarc-os/2);
  zeroPath.lineTo(0, zeroarc-os/2);
  zeroPath.moveTo(zerow-t, h+os-zeroarc-os/2);//right
  zeroPath.lineTo(zerow, h+os-zeroarc-os/2);
  zeroPath.lineTo(zerow, zeroarc-os/2);
  zeroPath.lineTo(zerow-t, zeroarc-os/2);
  zeroPath.moveTo(zeroarc, h+os-os/2);//top
  zeroPath.lineTo(zerow-zeroarc, h+os-os/2);
  zeroPath.lineTo(zerow-zeroarc, h+os-tlt-os/2);
  zeroPath.lineTo(zeroarc, h+os-tlt-os/2);
  zeroPath.moveTo(zeroarc, 0-os/2);//bottom
  zeroPath.lineTo(zeroarc, tlt-os/2);
  zeroPath.lineTo(zerow-zeroarc, tlt-os/2);
  zeroPath.lineTo(zerow-zeroarc, 0-os/2);
  var zeroGlyph = new opentype.Glyph({
    name: '0',
    unicode: 48,
    advanceWidth: zerow+s+g,
    path: zeroPath
  });


  var onePath = new opentype.Path();
  var onew = t*2;

  onePath.moveTo(t, h);//middle
  onePath.lineTo(onew, h);
  onePath.lineTo(onew, 0);
  onePath.lineTo(t, 0);
  onePath.moveTo(0, h-t);//top
  onePath.lineTo(t, h);
  onePath.lineTo(t, h-t-t/2);
  onePath.lineTo(0, h-t-t/2);
  if(srf) {
    onePath.moveTo(onew-t+t+s, 0);//bottom-left-serif
    onePath.lineTo(onew-t-s, 0);
    onePath.lineTo(onew-t-s, tlt);
    onePath.curveTo(onew-t-s/2, tlt, onew-t, tlt+sh/2, onew-t, tlt+sh);
    onePath.lineTo(onew-t+t, tlt+sh);
    onePath.curveTo(onew-t+t, tlt+sh/2, onew-t+t+s/2, tlt, onew-t+t+s, tlt);
  }
  var oneGlyph = new opentype.Glyph({
    name: '1',
    unicode: 49,
    advanceWidth: onew+s+g,
    path: onePath
  });

  var twoPath = new opentype.Path();
  var twoarc = arcs;
  var twow = w*0.8;
  if(twoarc > twow/2)
  twoarc = Math.round((twow/2)/10)*10;
  if(twoarc > (h-mh)/2)
  twoarc = Math.round(((h-mh)/2)/10)*10;
  if(twoarc*2>=twow*0.8)
  os= h*0.06*(twow*0.2-(twow-twoarc*2))/100;
  else os=0;

  twoPath.moveTo(0, h+os-twoarc-os/2);//left-top-arc
  twoPath.curveTo(0, h+os-twoarc+twoarc/2-os/2, twoarc/2, h+os-os/2, twoarc, h+os-os/2);
  twoPath.lineTo(twoarc, h+os-tlt-os/2);
  twoPath.curveTo(twoarc-(twoarc-t)/2, h+os-tlt-os/2, t, h+os-twoarc+(twoarc-tlt)/2-os/2, t, h+os-twoarc-os/2);
  twoPath.moveTo(twow-twoarc, h+os-os/2);//right-top-arc
  twoPath.curveTo(twow-twoarc/2, h+os-os/2, twow, h+os-twoarc/2-os/2, twow, h+os-twoarc-os/2);
  twoPath.lineTo(twow-t, h+os-twoarc-os/2);
  twoPath.curveTo(twow-t, h+os-twoarc+(twoarc-tlt)/2-os/2, twow-twoarc+(twoarc-t)/2, h+os-tlt-os/2, twow-twoarc, h+os-tlt-os/2);

  twoPath.moveTo(twow-t, h-twoarc+os/2);//right
  twoPath.lineTo(twow, h-twoarc+os/2);
  twoPath.lineTo(twow, mh+tlt);
  twoPath.lineTo(twow-t, mh+tlt);
  twoPath.moveTo(0, h-twoarc+os/2);//left
  twoPath.lineTo(t, h-twoarc+os/2);
  twoPath.lineTo(t, h-twoarc-t/2+os/2);
  twoPath.lineTo(0, h-twoarc-t/2+os/2);
  twoPath.moveTo(twow-t, mh+tlt);//"/"shape
  twoPath.lineTo(twow, mh+tlt);
  twoPath.lineTo(twow, mh+tlt-t/2-(800-mh)*0.06+20);
  twoPath.lineTo(t+(800-mh)*0.05-(800-w)*0.02-10, tlt);
  twoPath.lineTo(0, tlt)
  twoPath.lineTo(0, tlt+tlt/2);
  twoPath.moveTo(twoarc, h+os-os/2);//top
  twoPath.lineTo(twow-twoarc, h+os-os/2);
  twoPath.lineTo(twow-twoarc, h+os-tlt-os/2);
  twoPath.lineTo(twoarc, h+os-tlt-os/2);
  twoPath.moveTo(0, 0);//bottom
  twoPath.lineTo(0, tlt);
  twoPath.lineTo(twow, tlt);
  twoPath.lineTo(twow, 0);

  if(twoarc<tlt) {
    twoPath.moveTo(0, h-twoarc+os/2);//right
    twoPath.lineTo(t, h-twoarc+os/2);
    twoPath.lineTo(t, h-t);
    twoPath.lineTo(0, h-t);
  }



  var twoGlyph = new opentype.Glyph({
    name: '2',
    unicode: 50,
    advanceWidth: twow+s+g,
    path: twoPath
  });


  var threePath = new opentype.Path();
  var threetarc = arcs;
  var threebarc = arcs;
  var threew = w*0.8;
  if((h-mh)/2 < threetarc)
  threetarc = Math.round(((h-mh)/2)/10)*10;
  if((mh+tlt)/2 < threebarc)
  threebarc = Math.round(((mh+tlt)/2)/10)*10;
  if(threetarc > threew*0.9/2)
  threetarc = Math.round((threew*0.9/2)/10)*10;
  if(threebarc > threew/2)
  threebarc = Math.round((threew/2)/10)*10;

  if(threetarc*2>=threew*0.8)
  os= lh*0.03*(100-(threew-threetarc*2))/100;
  else os=0;

  threePath.moveTo(0, h+os-threetarc-os/2);//left-top-arc
  threePath.curveTo(0, h+os-threetarc+threetarc/2-os/2, threetarc/2, h+os-os/2, threetarc, h+os-os/2);
  threePath.lineTo(threetarc, h+os-tlt-os/2);
  threePath.curveTo(threetarc-(threetarc-t)/2, h+os-tlt-os/2, t, h+os-threetarc+(threetarc-tlt)/2-os/2, t, h+os-threetarc-os/2);
  threePath.moveTo(threetarc, h+os/2);//top to top-top-arc
  threePath.lineTo(threew*0.9-threetarc, h+os/2);
  threePath.curveTo(threew*0.9-threetarc/2, h+os/2, threew*0.9, h-threetarc/2+os/2, threew*0.9, h-threetarc+os/2);
  threePath.lineTo(threew*0.9-t, h-threetarc+os/2);
  threePath.curveTo(threew*0.9-t, h-threetarc+(threetarc-tlt)/2+os/2, threew*0.9-threetarc+(threetarc-t)/2, h-tlt+os/2, threew*0.9-threetarc, h-tlt+os/2);
  threePath.lineTo(threetarc, h-tlt+os/2);
  threePath.moveTo(threew*0.9-t, h-threetarc+os/2); //top-arc-connection
  threePath.lineTo(threew*0.9, h-threetarc+os/2);
  threePath.lineTo(threew*0.9, mh+threetarc);
  threePath.lineTo(threew*0.9-t, mh+threetarc);

  threePath.moveTo(threew*0.9-t, mh+threetarc);//middle to top-bottom-arc
  threePath.lineTo(threew*0.9, mh+threetarc);
  threePath.curveTo(threew*0.9, mh+threetarc-threetarc/2, threew*0.9-threetarc/2, mh, threew*0.9-threetarc, mh);
  threePath.lineTo(threew/3,mh);
  threePath.lineTo(threew/3,mh+tlt);
  threePath.lineTo(threew*0.9-threetarc, mh+tlt);
  threePath.curveTo(threew*0.9-threetarc+(threetarc-t)/2, mh+tlt, threew*0.9-t, mh+tlt+(threetarc-tlt)/2, threew*0.9-t, mh+threetarc);
  threePath.moveTo(threew/3, mh);//middle to bottom-top-arc
  threePath.lineTo(threew/3, mh+tlt);
  threePath.lineTo(threew-threebarc, mh+tlt);
  threePath.curveTo(threew-threebarc/2, mh+tlt, threew, mh+tlt-threebarc/2, threew, mh+tlt-threebarc);
  threePath.lineTo(threew-t, mh+tlt-threebarc);
  threePath.curveTo(threew-t, mh+tlt-threebarc+(threebarc-tlt)/2, threew-threebarc+(threebarc-t)/2, mh,  threew-threebarc, mh);

  threePath.moveTo(0, threebarc-os/2);//left-bottom-arc
  threePath.lineTo(t, threebarc-os/2);
  threePath.curveTo(t, threebarc-(threebarc-tlt)/2-os/2, threebarc-(threebarc-t)/2, tlt-os/2, threebarc, tlt-os/2);
  threePath.lineTo(threebarc, 0-os/2);
  threePath.curveTo(threebarc/2, 0-os/2, 0, threebarc/2-os/2, 0, threebarc-os/2);
  threePath.moveTo(threew, threebarc-os/2);//bottom-bottom-arc
  threePath.curveTo(threew, threebarc/2-os/2, threew-threebarc/2, 0-os/2, threew-threebarc, 0-os/2);
  threePath.lineTo(threebarc, 0-os/2);
  threePath.lineTo(threebarc, tlt-os/2);
  threePath.lineTo(threew-threebarc, tlt-os/2);
  threePath.curveTo(threew-threebarc+(threebarc-t)/2, tlt-os/2, threew-t, tlt+(threebarc-tlt)/2-os/2, threew-t, threebarc-os/2);
  threePath.moveTo(threew-t, mh+tlt-threebarc); //bottom-arc-connection
  threePath.lineTo(threew, mh+tlt-threebarc);
  threePath.lineTo(threew, threebarc-os/2);
  threePath.lineTo(threew-t, threebarc-os/2);

  if(threetarc<tlt) {
    threePath.moveTo(0, h-threetarc+os/2);//top-left arcs끝부분 두께보다 작아지면서 역으로 말려들어가 구멍낙는거 막기
    threePath.lineTo(t, h-threetarc+os/2);
    threePath.lineTo(t, h-tlt+os/2);
    threePath.lineTo(0, h-tlt+os/2);

    threePath.moveTo(0, threetarc-os/2);//bottom-left arcs끝부분 두께보다 작아지면서 역으로 말려들어가 구멍낙는거 막기
    threePath.lineTo(0, tlt-os/2);
    threePath.lineTo(t, tlt-os/2);
    threePath.lineTo(t, threetarc-os/2);
  }

  var threeGlyph = new opentype.Glyph({
    name: '3',
    unicode: 51,
    advanceWidth: threew+s+g,
    path: threePath
  });


  var fourPath = new opentype.Path();
  var fourw = w*0.8;
  var fourmh = mh;
  if(fourmh < t+t)
  fourmh = t+t;

  fourPath.moveTo(0, fourmh);//horizontal
  fourPath.lineTo(fourw, fourmh);
  fourPath.lineTo(fourw, fourmh-t);
  fourPath.lineTo(0, fourmh-t);
  fourPath.moveTo(fourw-100-t, h);//vertical
  fourPath.lineTo(fourw-100, h);
  fourPath.lineTo(fourw-100, 0);
  fourPath.lineTo(fourw-100-t, 0);
  // fourPath.moveTo(fourw-100-t, h);//"/"shape
  // fourPath.lineTo(fourw-100, h);
  // fourPath.lineTo(fourw-100, h-tlt/2);
  // fourPath.lineTo(tlt*1.2, fourmh);
  // fourPath.lineTo(0, fourmh);
  // fourPath.lineTo(0, fourmh+t/2);
  fourPath.moveTo(fourw-100-t, h);//"/"shape
  fourPath.lineTo(fourw-100-t, h-tlt*1.8);
  fourPath.lineTo(tlt*1.2, fourmh);
  fourPath.lineTo(0, fourmh);
  if(srf) {
    fourPath.moveTo(fourw-100-t+t+s, 0);//bottom-left-serif
    fourPath.lineTo(fourw-100-t-s, 0);
    fourPath.lineTo(fourw-100-t-s, tlt);
    fourPath.curveTo(fourw-100-t-s/2, tlt, fourw-100-t, tlt+sh/2, fourw-100-t, tlt+sh);
    fourPath.lineTo(fourw-100-t+t, tlt+sh);
    fourPath.curveTo(fourw-100-t+t, tlt+sh/2, fourw-100-t+t+s/2, tlt, fourw-100-t+t+s, tlt);
  }
  var fourGlyph = new opentype.Glyph({
    name: '4',
    unicode: 52,
    advanceWidth: fourw+s+g,
    path: fourPath
  });



  var fivePath = new opentype.Path();
  var fivearc = arcs;
  var fivew = w*0.8;
  if(fivew <= fivearc*2)
  fivearc = Math.round((fivew/2)/10)*10;
  if((mh+t-h/10)/2< fivearc)
  fivearc = Math.round(((mh+t-h/10)/2)/10)*10;
  if(fivearc*2>=fivew*0.8)
  os= h*0.06*(fivew*0.2-(fivew-fivearc*2))/100;
  else os=0;

  fivePath.moveTo(0, h);//top
  fivePath.lineTo(fivew*0.95, h);
  fivePath.lineTo(fivew*0.95, h-tlt);
  fivePath.lineTo(0, h-tlt);

  fivePath.moveTo(0, fivearc-os/2);//left-bottom-arc
  fivePath.lineTo(tlt, fivearc-os/2);
  fivePath.curveTo(tlt, fivearc-(fivearc-tlt)/2-os/2, fivearc-(fivearc-tlt)/2, tlt-os/2, fivearc, tlt-os/2);
  fivePath.lineTo(fivearc, 0-os/2);
  fivePath.curveTo(fivearc/2, 0-os/2, 0, fivearc/2-os/2, 0, fivearc-os/2);
  fivePath.moveTo(fivew, fivearc-os/2);//right-bottom-arc
  fivePath.curveTo(fivew, fivearc/2-os/2, fivew-fivearc/2, 0-os/2, fivew-fivearc, 0-os/2);
  fivePath.lineTo(fivearc, 0-os/2);
  fivePath.lineTo(fivearc, tlt-os/2);
  fivePath.lineTo(fivew-fivearc, tlt-os/2);
  fivePath.curveTo(fivew-fivearc+(fivearc-t)/2, tlt-os/2, fivew-t, fivearc-(fivearc-tlt)/2-os/2, fivew-t, fivearc-os/2);

  fivePath.moveTo(fivearc, mh);//middle to right-top-arc
  fivePath.lineTo(fivearc, mh+t);
  fivePath.lineTo(fivew-fivearc, mh+t);
  fivePath.curveTo(fivew-fivearc/2, mh+t, fivew, mh+t-fivearc/2, fivew, mh+t-fivearc);
  fivePath.lineTo(fivew-t, mh+t-fivearc);
  fivePath.curveTo(fivew-t, mh+t-fivearc+(fivearc-t)/2, fivew-fivearc+(fivearc-t)/2, mh,  fivew-fivearc, mh);

  fivePath.moveTo(0, mh+t-fivearc);//left-top-arc
  fivePath.curveTo(0, mh+t-fivearc+fivearc/2, fivearc/2, mh+t, fivearc, mh+t);
  fivePath.lineTo(fivearc, mh);
  fivePath.curveTo(fivearc-(fivearc-t)/2, mh, t, mh+t-fivearc+(fivearc-t)/2, t, mh+t-fivearc);

  fivePath.moveTo(fivew-t, mh+t-fivearc); //bottom-arc-connection
  fivePath.lineTo(fivew, mh+t-fivearc);
  fivePath.lineTo(fivew, fivearc-os/2);
  fivePath.lineTo(fivew-t, fivearc-os/2);
  fivePath.moveTo(0, h); //left
  fivePath.lineTo(t, h);
  fivePath.lineTo(t, mh+t-fivearc);
  fivePath.lineTo(0, mh+t-fivearc);

  // if(srf) {
  //   fivePath.moveTo(0, fivearc);//left-bottom-serif
  //   fivePath.lineTo(tlt, fivearc);
  //   fivePath.lineTo(tlt+tlt*0.1, fivearc/2);
  //   fivePath.lineTo(tlt, fivearc-s*fivearc*0.01);
  //   fivePath.lineTo(0, fivearc-s*fivearc*0.01);
  // }

  if(srf) {
    fivePath.moveTo(fivew*0.95, h-tlt);//top-right-serif
    fivePath.lineTo(fivew*0.95, h-tlt-s);
    fivePath.lineTo(fivew*0.95-tlt, h-tlt-s);
    fivePath.curveTo(fivew*0.95-tlt, h-tlt-s/2, fivew*0.95-tlt-sh/2, h-tlt, fivew*0.95-tlt-sh, h-tlt);
  }
  if(fivearc<tlt) {
    fivePath.moveTo(0, mh+t-fivearc);//top-left arcs
    fivePath.lineTo(t, mh+t-fivearc);
    fivePath.lineTo(t, mh);
    fivePath.lineTo(0, mh);

    fivePath.moveTo(0, tlt-os/2);//bottom-left arcs
    fivePath.lineTo(t, tlt-os/2);
    fivePath.lineTo(t, fivearc-os/2);
    fivePath.lineTo(0, fivearc-os/2);
  }

  var fiveGlyph = new opentype.Glyph({
    name: '5',
    unicode: 53,
    advanceWidth: fivew+s+g,
    path: fivePath
  });


  var sixPath = new opentype.Path();
  var sixtarc = arcs;
  var sixbarc = arcs;
  var sixw = w*0.8;
  if(sixtarc > sixw/2)
  sixtarc = Math.round((sixw/2)/10)*10;
  if(sixbarc > sixw/2)
  sixbarc = Math.round((sixw/2)/10)*10;
  if(sixtarc >(h-mh-tlt))
  sixtarc = Math.round(((h-mh-tlt))/10)*10;
  if(sixbarc > (mh+tlt)/2)
  sixbarc = Math.round(((mh+tlt)/2)/10)*10;

  if(sixtarc*2>=sixw*0.8)
  os= lh*0.03*(100-(sixw-sixtarc*2))/100;
  else if(sixbarc*2>=sixw*0.8)
  os= lh*0.03*(100-(sixw-sixbarc*2))/100;
  else os=0;

  sixPath.moveTo(0, h+os-sixtarc-os/2);//left-top-arc
  sixPath.curveTo(0, h+os-sixtarc+sixtarc/2-os/2, sixtarc/2, h+os-os/2, sixtarc, h+os-os/2);
  sixPath.lineTo(sixtarc, h+os-tlt-os/2);
  sixPath.curveTo(sixtarc-(sixtarc-t)/2, h+os-tlt-os/2, t, h+os-sixtarc+(sixtarc-tlt)/2-os/2, t, h+os-sixtarc-os/2);
  sixPath.moveTo(sixtarc, h+os/2);//top to top-top-arc
  sixPath.lineTo(sixw-sixtarc, h+os/2);
  sixPath.curveTo(sixw-sixtarc/2, h+os/2, sixw, h-sixtarc/2+os/2, sixw, h-sixtarc+os/2);
  sixPath.lineTo(sixw-t, h-sixtarc+os/2);
  sixPath.curveTo(sixw-t, h-sixtarc+(sixtarc-tlt)/2+os/2, sixw-sixtarc+(sixtarc-t)/2, h-tlt+os/2, sixw-sixtarc, h-tlt+os/2);
  sixPath.lineTo(sixtarc, h-tlt+os/2);


  sixPath.moveTo(sixw-sixbarc, mh+t);//middle right-top-arc
  sixPath.curveTo(sixw-sixbarc/2, mh+t, sixw, mh+t-sixbarc/2, sixw, mh+t-sixbarc);
  sixPath.lineTo(sixw-t, mh+t-sixbarc);
  sixPath.curveTo(sixw-t, mh+t-sixbarc+(sixbarc-t)/2, sixw-sixbarc+(sixbarc-t)/2, mh,  sixw-sixbarc, mh);

  sixPath.moveTo(sixbarc, mh);//middle
  sixPath.lineTo(sixbarc, mh+t);
  sixPath.lineTo(sixw-sixbarc, mh+t);
  sixPath.lineTo(sixw-sixbarc, mh);

  sixPath.moveTo(0, mh+t-sixbarc);// middle left-top-arc
  sixPath.curveTo(0, mh+t-sixbarc+sixbarc/2, sixbarc/2, mh+t, sixbarc, mh+t);
  sixPath.lineTo(sixbarc, mh);
  sixPath.curveTo(sixbarc-(sixbarc-t)/2, mh, t, mh+t-sixbarc+(sixbarc-t)/2, t, mh+t-sixbarc);


  sixPath.moveTo(0, sixbarc-os/2);//left-bottom-arc
  sixPath.lineTo(t, sixbarc-os/2);
  sixPath.curveTo(t, sixbarc-(sixbarc-tlt)/2-os/2, sixbarc-(sixbarc-t)/2, tlt-os/2, sixbarc, tlt-os/2);
  sixPath.lineTo(sixbarc, 0-os/2);
  sixPath.curveTo(sixbarc/2, 0-os/2, 0, sixbarc/2-os/2, 0, sixbarc-os/2);

  sixPath.moveTo(sixw, sixbarc-os/2);//right-bottom-arc
  sixPath.curveTo(sixw, sixbarc/2-os/2, sixw-sixbarc/2, 0-os/2, sixw-sixbarc, 0-os/2);
  sixPath.lineTo(sixbarc, 0-os/2);
  sixPath.lineTo(sixbarc, tlt-os/2);
  sixPath.lineTo(sixw-sixbarc, tlt-os/2);
  sixPath.curveTo(sixw-sixbarc+(sixbarc-t)/2, tlt-os/2, sixw-t, sixbarc-(sixbarc-tlt)/2-os/2, sixw-t, sixbarc-os/2);

  sixPath.moveTo(sixw-t, mh+t-sixbarc); //bottom-arc-right-connection
  sixPath.lineTo(sixw, mh+t-sixbarc);
  sixPath.lineTo(sixw, sixbarc-os/2);
  sixPath.lineTo(sixw-t, sixbarc-os/2);


  sixPath.moveTo(0, h-sixtarc+os/2); //left-top
  sixPath.lineTo(t, h-sixtarc+os/2);
  sixPath.lineTo(t, mh+t-sixbarc-os/2);
  sixPath.lineTo(0, mh+t-sixbarc-os/2);

  sixPath.moveTo(0, mh+t-sixbarc-os/2); //left-connection
  sixPath.lineTo(t, mh+t-sixbarc-os/2);
  sixPath.lineTo(t, sixbarc-os/2);
  sixPath.lineTo(0, sixbarc-os/2);


  if(sixtarc<tlt) {
    sixPath.moveTo(sixw-t, h-sixtarc+os/2);//top
    sixPath.lineTo(sixw, h-sixtarc+os/2);
    sixPath.lineTo(sixw, h-t+os/2);
    sixPath.lineTo(sixw-t, h-t+os/2);
  }
  if(sixbarc<tlt) {//자꾸 구멍이 뚫려서 필요없지만 임시로 가져온거
    sixPath.moveTo(0, mh+t-sixbarc);//top-left arcs
    sixPath.lineTo(t, mh+t-sixbarc);
    sixPath.lineTo(t, mh);
    sixPath.lineTo(0, mh);

    sixPath.moveTo(0, tlt-os/2);//bottom-left arcs
    sixPath.lineTo(t, tlt-os/2);
    sixPath.lineTo(t, sixbarc-os/2);
    sixPath.lineTo(0, sixbarc-os/2);
  }

  var sixGlyph = new opentype.Glyph({
    name: '6',
    unicode: 54,
    advanceWidth: sixw+s+g,
    path: sixPath
  });

  var sevenPath = new opentype.Path();
  var sevenw = w*0.8;

  sevenPath.moveTo(0, h);//top
  sevenPath.lineTo(sevenw, h);
  sevenPath.lineTo(sevenw, h-tlt);
  sevenPath.lineTo(0, h-tlt);
  sevenPath.moveTo(sevenw-t-t*0.25, h-tlt);//"/" Shape
  sevenPath.lineTo(sevenw, h-tlt);
  sevenPath.lineTo(50+t+t*0.25, 0);
  sevenPath.lineTo(50, 0);
  if(srf) {
    sevenPath.moveTo(60-s*0.6, 0);//left-serif
    sevenPath.lineTo(60-s*0.6, t);
    sevenPath.curveTo(60-s*0.6/2, t, 60+t, t+sh/2, 60+t+(w/2-t/2)*sh*0.002, t+sh);
    sevenPath.curveTo(60+t, t+sh/2, 60+t+s*0.6, t, 60+t+s, t);
    sevenPath.lineTo(60+t+s, 0);

    sevenPath.moveTo(tlt+sh, h-tlt);//top-left-serif
    sevenPath.curveTo(tlt+sh/2, h-tlt, tlt, h-tlt-s/2, tlt, h-tlt-s);
    sevenPath.lineTo(0, h-tlt-s);
    sevenPath.lineTo(0, h-tlt);
  }
  var sevenGlyph = new opentype.Glyph({
    name: '7',
    unicode: 55,
    advanceWidth: sevenw+g,
    path: sevenPath
  });


  var eightPath = new opentype.Path();
  var eighttarc = arcs;
  var eightbarc = arcs;
  var eightw = w*0.8;
  if((h-mh)/2 < eighttarc)
  eighttarc = Math.round(((h-mh)/2)/10)*10;
  if((mh+tlt)/2 < eightbarc)
  eightbarc = Math.round(((mh+tlt)/2)/10)*10;
  if(eighttarc > eightw*0.8/2)
  eighttarc = Math.round((eightw*0.8/2)/10)*10;
  if(eightbarc > eightw/2)
  eightbarc = Math.round((eightw/2)/10)*10;

  if(eighttarc*2>=eightw*0.8)
  os= lh*0.03*(100-(eightw-eighttarc*2))/100;
  else os=0;

  eightPath.moveTo(eightw*0.1, h+os-eighttarc-os/2);//left-top-arc
  eightPath.curveTo(eightw*0.1, h+os-eighttarc+eighttarc/2-os/2, eightw*0.1+eighttarc/2, h+os-os/2, eightw*0.1+eighttarc, h+os-os/2);
  eightPath.lineTo(eightw*0.1+eighttarc, h+os-tlt-os/2);
  eightPath.curveTo(eightw*0.1+eighttarc-(eighttarc-t)/2, h+os-tlt-os/2, eightw*0.1+t, h+os-eighttarc+(eighttarc-tlt)/2-os/2, eightw*0.1+t, h+os-eighttarc-os/2);
  eightPath.moveTo(eightw*0.1+eighttarc, h+os/2);//top to top-top-arc
  eightPath.lineTo(eightw*0.9-eighttarc, h+os/2);
  eightPath.curveTo(eightw*0.9-eighttarc/2, h+os/2, eightw*0.9, h-eighttarc/2+os/2, eightw*0.9, h-eighttarc+os/2);
  eightPath.lineTo(eightw*0.9-t, h-eighttarc+os/2);
  eightPath.curveTo(eightw*0.9-t, h-eighttarc+(eighttarc-tlt)/2+os/2, eightw*0.9-eighttarc+(eighttarc-t)/2, h-tlt+os/2, eightw*0.9-eighttarc, h-tlt+os/2);
  eightPath.lineTo(eightw*0.1+eighttarc, h-tlt+os/2);
  eightPath.moveTo(eightw*0.9-t, h-eighttarc+os/2); //top-right-arc-connection
  eightPath.lineTo(eightw*0.9, h-eighttarc+os/2);
  eightPath.lineTo(eightw*0.9, mh+eighttarc);
  eightPath.lineTo(eightw*0.9-t, mh+eighttarc);
  eightPath.moveTo(eightw*0.1, h-eighttarc+os/2); //top-left-arc-connection
  eightPath.lineTo(eightw*0.1+t, h-eighttarc+os/2);
  eightPath.lineTo(eightw*0.1+t, mh+eighttarc);
  eightPath.lineTo(eightw*0.1, mh+eighttarc);

  eightPath.moveTo(eightw*0.9-t, mh+eighttarc);//middle to top-right-arc
  eightPath.lineTo(eightw*0.9, mh+eighttarc);
  eightPath.curveTo(eightw*0.9, mh+eighttarc-eighttarc/2, eightw*0.9-eighttarc/2, mh, eightw*0.9-eighttarc, mh);
  eightPath.lineTo(eightbarc,mh);
  eightPath.lineTo(eightbarc,mh+tlt);
  eightPath.lineTo(eightw*0.9-eighttarc, mh+tlt);
  eightPath.curveTo(eightw*0.9-eighttarc+(eighttarc-t)/2, mh+tlt, eightw*0.9-t, mh+tlt+(eighttarc-tlt)/2, eightw*0.9-t, mh+eighttarc);
  eightPath.moveTo(eightw*0.1+eighttarc, mh);//middle to top-left-arc
  eightPath.curveTo(eightw*0.1+eighttarc/2, mh, eightw*0.1, mh+eighttarc/2, eightw*0.1, mh+eighttarc);
  eightPath.lineTo(eightw*0.1+t, mh+eighttarc);
  eightPath.curveTo(eightw*0.1+t, mh+eighttarc-(eighttarc-tlt)/2, eightw*0.1+eighttarc-(eighttarc-t)/2, mh+tlt, eightw*0.1+eighttarc, mh+tlt);


  eightPath.moveTo(eightw*0.1+eighttarc, mh);//middle to bottom-right-arc
  eightPath.lineTo(eightw*0.1+eighttarc, mh+tlt);
  eightPath.lineTo(eightw-eightbarc, mh+tlt);
  eightPath.curveTo(eightw-eightbarc/2, mh+tlt, eightw, mh+tlt-eightbarc/2, eightw, mh+tlt-eightbarc);
  eightPath.lineTo(eightw-t, mh+tlt-eightbarc);
  eightPath.curveTo(eightw-t, mh+tlt-eightbarc+(eightbarc-tlt)/2, eightw-eightbarc+(eightbarc-t)/2, mh,  eightw-eightbarc, mh);
  eightPath.moveTo(0, mh+tlt-eightbarc);// middle to bottom-left-arc
  eightPath.curveTo(0, mh+tlt-eightbarc+eightbarc/2, eightbarc/2, mh+tlt, eightbarc, mh+tlt);
  eightPath.lineTo(eightbarc, mh);
  eightPath.curveTo(eightbarc-(eightbarc-t)/2, mh, t, mh+t-eightbarc+(eightbarc-t)/2, t, mh+tlt-eightbarc);

  eightPath.moveTo(0, eightbarc-os/2);//bottom-left-arc
  eightPath.lineTo(t, eightbarc-os/2);
  eightPath.curveTo(t, eightbarc-(eightbarc-tlt)/2-os/2, eightbarc-(eightbarc-t)/2, tlt-os/2, eightbarc, tlt-os/2);
  eightPath.lineTo(eightbarc, 0-os/2);
  eightPath.curveTo(eightbarc/2, 0-os/2, 0, eightbarc/2-os/2, 0, eightbarc-os/2);
  eightPath.moveTo(eightw, eightbarc-os/2);//bottom-right-arc
  eightPath.curveTo(eightw, eightbarc/2-os/2, eightw-eightbarc/2, 0-os/2, eightw-eightbarc, 0-os/2);
  eightPath.lineTo(eightbarc, 0-os/2);
  eightPath.lineTo(eightbarc, tlt-os/2);
  eightPath.lineTo(eightw-eightbarc, tlt-os/2);
  eightPath.curveTo(eightw-eightbarc+(eightbarc-t)/2, tlt-os/2, eightw-t, tlt+(eightbarc-tlt)/2-os/2, eightw-t, eightbarc-os/2);
  eightPath.moveTo(eightw-t, mh+tlt-eightbarc); //bottom-right-connection
  eightPath.lineTo(eightw, mh+tlt-eightbarc);
  eightPath.lineTo(eightw, eightbarc-os/2);
  eightPath.lineTo(eightw-t, eightbarc-os/2);

  eightPath.moveTo(0, mh+tlt-eightbarc); //bottom-left-connection
  eightPath.lineTo(t, mh+tlt-eightbarc);
  eightPath.lineTo(t, eightbarc-os/2);
  eightPath.lineTo(0, eightbarc-os/2);


  var eightGlyph = new opentype.Glyph({
    name: '8',
    unicode: 56,
    advanceWidth: eightw+s+g,
    path: eightPath
  });


  var ninePath = new opentype.Path();
  var ninetarc = arcs;
  var ninebarc = arcs;
  var ninemh = mh-t;
  var ninew = w*0.8;
  if(ninemh<t)
  ninemh = t;

  if((h-ninemh)/2 < ninetarc)
  ninetarc = Math.round(((h-ninemh)/2)/10)*10;
  if((ninemh+tlt)/2 < ninebarc)
  ninebarc = Math.round(((ninemh+tlt)/2)/10)*10;
  if(ninetarc > ninew/2)
  ninetarc = Math.round((ninew/2)/10)*10;
  if(ninebarc > ninew/2)
  ninebarc = Math.round((ninew/2)/10)*10;



  if(ninetarc*2>=ninew*0.8)
  os= lh*0.03*(100-(ninew-ninetarc*2))/100;
  else os=0;

  ninePath.moveTo(0, h+os-ninetarc-os/2);//left-top-arc
  ninePath.curveTo(0, h+os-ninetarc+ninetarc/2-os/2, ninetarc/2, h+os-os/2, ninetarc, h+os-os/2);
  ninePath.lineTo(ninetarc, h+os-tlt-os/2);
  ninePath.curveTo(ninetarc-(ninetarc-t)/2, h+os-tlt-os/2, t, h+os-ninetarc+(ninetarc-tlt)/2-os/2, t, h+os-ninetarc-os/2);
  ninePath.moveTo(ninetarc, h+os/2);//top to top-top-arc
  ninePath.lineTo(ninew-ninetarc, h+os/2);
  ninePath.curveTo(ninew-ninetarc/2, h+os/2, ninew, h-ninetarc/2+os/2, ninew, h-ninetarc+os/2);
  ninePath.lineTo(ninew-t, h-ninetarc+os/2);
  ninePath.curveTo(ninew-t, h-ninetarc+(ninetarc-tlt)/2+os/2, ninew-ninetarc+(ninetarc-t)/2, h-tlt+os/2, ninew-ninetarc, h-tlt+os/2);
  ninePath.lineTo(ninetarc, h-tlt+os/2);
  ninePath.moveTo(ninew-t, h-ninetarc+os/2); //top-right-arc-connection
  ninePath.lineTo(ninew, h-ninetarc+os/2);
  ninePath.lineTo(ninew, ninemh+ninetarc);
  ninePath.lineTo(ninew-t, ninemh+ninetarc);
  ninePath.moveTo(0, h-ninetarc+os/2); //top-left-arc-connection
  ninePath.lineTo(t, h-ninetarc+os/2);
  ninePath.lineTo(t, ninemh+ninetarc);
  ninePath.lineTo(0, ninemh+ninetarc);

  ninePath.moveTo(ninew-t, ninemh+ninetarc);//middle to top-right-arc
  ninePath.lineTo(ninew, ninemh+ninetarc);
  ninePath.curveTo(ninew, ninemh+ninetarc-ninetarc/2, ninew-ninetarc/2, ninemh, ninew-ninetarc, ninemh);
  ninePath.lineTo(ninetarc,ninemh);
  ninePath.lineTo(ninetarc,ninemh+tlt);
  ninePath.lineTo(ninew-ninetarc, ninemh+tlt);
  ninePath.curveTo(ninew-ninetarc+(ninetarc-t)/2, ninemh+tlt, ninew-t, ninemh+tlt+(ninetarc-tlt)/2, ninew-t, ninemh+ninetarc);
  ninePath.moveTo(ninetarc, ninemh);//middle to top-left-arc
  ninePath.curveTo(ninetarc/2, ninemh, 0, ninemh+ninetarc/2, 0, ninemh+ninetarc);
  ninePath.lineTo(t, ninemh+ninetarc);
  ninePath.curveTo(t, ninemh+ninetarc-(ninetarc-tlt)/2, ninetarc-(ninetarc-t)/2, ninemh+tlt, ninetarc, ninemh+tlt);

  ninePath.moveTo(0, ninebarc-os/2);//bottom-left-arc
  ninePath.lineTo(t, ninebarc-os/2);
  ninePath.curveTo(t, ninebarc-(ninebarc-tlt)/2-os/2, ninebarc-(ninebarc-t)/2, tlt-os/2, ninebarc, tlt-os/2);
  ninePath.lineTo(ninebarc, 0-os/2);
  ninePath.curveTo(ninebarc/2, 0-os/2, 0, ninebarc/2-os/2, 0, ninebarc-os/2);
  ninePath.moveTo(ninew, ninebarc-os/2);//bottom-right-arc
  ninePath.curveTo(ninew, ninebarc/2-os/2, ninew-ninebarc/2, 0-os/2, ninew-ninebarc, 0-os/2);
  ninePath.lineTo(ninebarc, 0-os/2);
  ninePath.lineTo(ninebarc, tlt-os/2);
  ninePath.lineTo(ninew-ninebarc, tlt-os/2);
  ninePath.curveTo(ninew-ninebarc+(ninebarc-t)/2, tlt-os/2, ninew-t, tlt+(ninebarc-tlt)/2-os/2, ninew-t, ninebarc-os/2);

  ninePath.moveTo(ninew-t, h-ninetarc+os/2); //right
  ninePath.lineTo(ninew, h-ninetarc+os/2);
  ninePath.lineTo(ninew, ninebarc-os/2);
  ninePath.lineTo(ninew-t, ninebarc-os/2);

  if(ninebarc<tlt) {
    ninePath.moveTo(0, t-os/2);//bottom
    ninePath.lineTo(t, t-os/2);
    ninePath.lineTo(t, ninebarc-os/2);
    ninePath.lineTo(0, ninebarc-os/2);
  }

  var nineGlyph = new opentype.Glyph({
    name: '9',
    unicode: 57,
    advanceWidth: ninew+s+g,
    path: ninePath
  });


  var dotPath = new opentype.Path();
  var dos = t*0.12;
  var dotarcs = arcs;
  if(dotarcs > (t)/2)
    dotarcs = (t)/2;//Math.round(((t+dos)/2)/10)*10;
  dos= t*0.04*(300-(t-dotarcs*2))/100;

  dotPath.moveTo(0-dos/2, t-dotarcs+dos/2);//dot-podotnt
  dotPath.curveTo(0-dos/2, t-dotarcs/2+dos/2, dotarcs/2-dos/2, t+dos/2, dotarcs-dos/2, t+dos/2);
  dotPath.lineTo(t-dotarcs+dos/2, t+dos/2);
  dotPath.curveTo(t-dotarcs/2+dos/2, t+dos/2, t+dos/2, t-dotarcs/2+dos/2, t+dos/2, t-dotarcs+dos/2);
  dotPath.lineTo(t+dos/2, dotarcs-dos/2);
  dotPath.curveTo(t+dos/2, dotarcs/2-dos/2, t-dotarcs/2+dos/2, -dos/2, t-dotarcs+dos/2, -dos/2);
  dotPath.lineTo(dotarcs-dos/2, -dos/2);
  dotPath.curveTo(dotarcs/2-dos/2, -dos/2, 0-dos/2, dotarcs/2-dos/2, 0-dos/2, dotarcs-dos/2);

  var dotGlyph = new opentype.Glyph({
    name: '.',
    unicode: 46,
    advanceWidth: t+s+g,
    path: dotPath
  });

  var commaPath = new opentype.Path();
  var dos = t*0.12;
  var commaarcs = arcs;
  if(commaarcs > (t)/2)
    commaarcs = (t)/2;//Math.round(((t+dos)/2)/10)*10;
  dos= t*0.04*(300-(t-commaarcs*2))/100;

  commaPath.moveTo(0-dos/2, t-commaarcs+dos/2);//comma-point
  commaPath.curveTo(0-dos/2, t-commaarcs/2+dos/2, commaarcs/2-dos/2, t+dos/2, commaarcs-dos/2, t+dos/2);
  commaPath.lineTo(t-commaarcs+dos/2, t+dos/2);
  commaPath.curveTo(t-commaarcs/2+dos/2, t+dos/2, t+dos/2, t-commaarcs/2+dos/2, t+dos/2, t-commaarcs+dos/2);
  commaPath.lineTo(t+dos/2, commaarcs-dos/2);
  commaPath.curveTo(t+dos/2, commaarcs/2-dos/2, t-commaarcs/2+dos/2, -dos/2, t-commaarcs+dos/2, -dos/2);
  commaPath.lineTo(commaarcs-dos/2, -dos/2);
  commaPath.curveTo(commaarcs/2-dos/2, -dos/2, 0-dos/2, commaarcs/2-dos/2, 0-dos/2, commaarcs-dos/2);

  commaPath.moveTo(t+dos/2, commaarcs-dos/2);//comma-tail
  commaPath.lineTo(t+dos/2, -dos/2-t/2);
  commaPath.curveTo(t+dos/2, -dos/2-t/2-t/4, t+dos/2-t/4, -dos/2-t, t+dos/2-t/2, -dos/2-t);
  commaPath.lineTo(t+dos/2-t/2-t/4, -dos/2-t);
  commaPath.lineTo(t+dos/2-t/2-t/4, -dos/2-t+tlt/2);
  commaPath.lineTo(t/2, -dos/2-t+tlt/2);
  // commaPath.curveTo(t+dos/2-t/2+t/8, -dos/2-t+tlt/2, t+dos/2-t/2+t/4, -dos/2-t/2-t/8, t+dos/2-t/2+t/4, -dos/2-t/2);
  commaPath.lineTo(t/2, commaarcs-dos/2);

  var commaGlyph = new opentype.Glyph({
    name: ',',
    unicode: 44,
    advanceWidth: t+g,
    path: commaPath
  });

  var quotePath = new opentype.Path();
  var dos = t*0.12;
  var quotearcs = arcs;
  if(quotearcs > (t)/2)
    quotearcs = (t)/2;//Math.round(((t+dos)/2)/10)*10;
  dos= t*0.04*(300-(t-quotearcs*2))/100;

  quotePath.moveTo(0-dos/2, lhh-quotearcs+dos/2);//quote-point
  quotePath.curveTo(0-dos/2, lhh-quotearcs/2+dos/2, quotearcs/2-dos/2, lhh+dos/2, quotearcs-dos/2, lhh+dos/2);
  quotePath.lineTo(t-quotearcs+dos/2, lhh+dos/2);
  quotePath.curveTo(t-quotearcs/2+dos/2, lhh+dos/2, t+dos/2, lhh-quotearcs/2+dos/2, t+dos/2, lhh-quotearcs+dos/2);
  quotePath.lineTo(t+dos/2, lhh-t+quotearcs-dos/2);
  quotePath.curveTo(t+dos/2, lhh-t+quotearcs/2-dos/2, t-quotearcs/2+dos/2, lhh-t-dos/2, t-quotearcs+dos/2, lhh-t-dos/2);
  quotePath.lineTo(quotearcs-dos/2, lhh-t-dos/2);
  quotePath.curveTo(quotearcs/2-dos/2, lhh-t-dos/2, 0-dos/2, lhh-t+quotearcs/2-dos/2, 0-dos/2, lhh-t+quotearcs-dos/2);

  quotePath.moveTo(t+dos/2, lhh-t+quotearcs-dos/2);//quote-tail
  quotePath.lineTo(t+dos/2, lhh-t-dos/2-t/2);
  quotePath.curveTo(t+dos/2, lhh-t-dos/2-t/2-t/4, t+dos/2-t/4, lhh-t-dos/2-t, t+dos/2-t/2, lhh-t-dos/2-t);
  quotePath.lineTo(t+dos/2-t/2-t/4, lhh-t-dos/2-t);
  quotePath.lineTo(t+dos/2-t/2-t/4, lhh-t-dos/2-t+tlt/2);
  quotePath.lineTo(t/2, lhh-t-dos/2-t+tlt/2);
  // quotePath.curveTo(t+dos/2-t/2+t/8, -dos/2-t+tlt/2, t+dos/2-t/2+t/4, -dos/2-t/2-t/8, t+dos/2-t/2+t/4, -dos/2-t/2);
  quotePath.lineTo(t/2, lhh-t+quotearcs-dos/2);

  var quoteGlyph = new opentype.Glyph({
    name: "'",
    unicode: 39,
    advanceWidth: t+g,
    path: quotePath
  });


  var qmarkPath = new opentype.Path();
  var qmarktarc = arcs;
  var qmarkbarc = arcs;
  var qmarkmh = mh;
  var qmarkw = w*0.8;
  if((h-qmarkmh)/2 < qmarktarc)
  qmarktarc = Math.round(((h-qmarkmh)/2)/10)*10;
  if(qmarktarc > qmarkw/2)
  qmarktarc = Math.round((qmarkw/2)/10)*10;
  if((h-qmarkmh)/2 < qmarkbarc)
  qmarkbarc = Math.round(((h-qmarkmh)/2)/10)*10;
  // if(mh+tlt-t-dos/2-h/10 < qmarkbarc)
  // qmarkbarc = Math.round((mh+tlt-t-dos/2-h/10)/10)*10;
  if(qmarkbarc > (qmarkw/2+t/2)/2)
  qmarkbarc = Math.round(((qmarkw/2+t/2)/2)/10)*10;

  if(qmarkmh < t+dos/2+h/10)// && t+tlt < h-(tlt+dos/2+h/10))
  qmarkmh = t+dos/2+h/10;

  if(qmarktarc*2>=qmarkw*0.8)
  os= lh*0.03*(100-(qmarkw-qmarktarc*2))/100;
  else os=0;

  var dos = t*0.12;
  var qmarkarcs = arcs;
  if(qmarkarcs > t/2)
    qmarkarcs = t/2;//Math.round(((t+dos)/2)/10)*10;
  dos= t*0.04*(300-(t-qmarkarcs*2))/100;


  qmarkPath.moveTo(0, h-qmarktarc+os/2);//left-top-arc
  qmarkPath.curveTo(0, h-qmarktarc+qmarktarc/2+os/2, qmarktarc/2, h+os/2, qmarktarc, h+os/2);
  qmarkPath.lineTo(qmarktarc, h-tlt+os/2);
  qmarkPath.curveTo(qmarktarc-(qmarktarc-t)/2, h-tlt+os/2, t, h-qmarktarc+(qmarktarc-tlt)/2+os/2, t, h-qmarktarc+os/2);
  qmarkPath.moveTo(qmarktarc, h+os/2);//right-top-arc + top connection
  qmarkPath.lineTo(qmarkw-qmarktarc, h+os/2);
  qmarkPath.curveTo(qmarkw-qmarktarc/2, h+os/2, qmarkw, h-qmarktarc/2+os/2, qmarkw, h-qmarktarc+os/2);
  qmarkPath.lineTo(qmarkw-t, h-qmarktarc+os/2);
  qmarkPath.curveTo(qmarkw-t, h-qmarktarc+(qmarktarc-tlt)/2+os/2, qmarkw-qmarktarc+(qmarktarc-t)/2, h-tlt+os/2, qmarkw-qmarktarc, h-tlt+os/2);
  qmarkPath.lineTo(qmarktarc, h-tlt+os/2);

  qmarkPath.moveTo(qmarkw-t, h-qmarktarc+os/2); //right-connection
  qmarkPath.lineTo(qmarkw, h-qmarktarc+os/2);
  qmarkPath.lineTo(qmarkw, qmarkmh+qmarkbarc);
  qmarkPath.lineTo(qmarkw-t, qmarkmh+qmarkbarc);

  qmarkPath.moveTo(qmarkw, qmarkmh+qmarkbarc);//middle to top-bottom-arc
  qmarkPath.curveTo(qmarkw, qmarkmh+qmarkbarc-qmarkbarc/2, qmarkw-qmarkbarc/2, qmarkmh, qmarkw-qmarkbarc, qmarkmh);
  qmarkPath.lineTo(qmarkw-qmarkbarc, qmarkmh+tlt);
  qmarkPath.curveTo(qmarkw-qmarkbarc+(qmarkbarc-t)/2, qmarkmh+tlt, qmarkw-t, qmarkmh+tlt+(qmarkbarc-tlt)/2, qmarkw-t, qmarkmh+qmarkbarc);

  qmarkPath.moveTo(qmarkw/2-t/2, qmarkmh+tlt-qmarkbarc);//middle to bottom-bottom-arc
  qmarkPath.curveTo(qmarkw/2-t/2, qmarkmh+tlt-qmarkbarc/2, qmarkw/2-t/2+qmarkbarc/2, qmarkmh+tlt, qmarkw/2-t/2+qmarkbarc, qmarkmh+tlt);
  qmarkPath.lineTo(qmarkw/2-t/2+qmarkbarc, qmarkmh);
  qmarkPath.curveTo(qmarkw/2-t/2+qmarkbarc-(qmarkbarc-t)/2, qmarkmh, qmarkw/2-t/2+t, qmarkmh+tlt-qmarkbarc+(qmarkbarc-tlt)/2, qmarkw/2-t/2+t, qmarkmh+tlt-qmarkbarc);

  qmarkPath.moveTo(qmarkw/2-t/2+qmarkbarc, qmarkmh+tlt); //middle-connection
  qmarkPath.lineTo(qmarkw-qmarkbarc, qmarkmh+tlt);
  qmarkPath.lineTo(qmarkw-qmarkbarc, qmarkmh);
  qmarkPath.lineTo(qmarkw/2-t/2+qmarkbarc, qmarkmh);

  qmarkPath.moveTo(qmarkw/2-t/2-dos/2, t-qmarkarcs+dos/2);//qmark-poqmarknt
  qmarkPath.curveTo(qmarkw/2-t/2-dos/2, t-qmarkarcs/2+dos/2, qmarkw/2-t/2+qmarkarcs/2-dos/2, t+dos/2, qmarkw/2-t/2+qmarkarcs-dos/2, t+dos/2);
  qmarkPath.lineTo(qmarkw/2-t/2+t-qmarkarcs+dos/2, t+dos/2);
  qmarkPath.curveTo(qmarkw/2-t/2+t-qmarkarcs/2+dos/2, t+dos/2, qmarkw/2-t/2+t+dos/2, t-qmarkarcs/2+dos/2, qmarkw/2-t/2+t+dos/2, t-qmarkarcs+dos/2);
  qmarkPath.lineTo(qmarkw/2-t/2+t+dos/2, qmarkarcs-dos/2);
  qmarkPath.curveTo(qmarkw/2-t/2+t+dos/2, qmarkarcs/2-dos/2, qmarkw/2-t/2+t-qmarkarcs/2+dos/2, -dos/2, qmarkw/2-t/2+t-qmarkarcs+dos/2, -dos/2);
  qmarkPath.lineTo(qmarkw/2-t/2+qmarkarcs-dos/2, -dos/2);
  qmarkPath.curveTo(qmarkw/2-t/2+qmarkarcs/2-dos/2, -dos/2, qmarkw/2-t/2-dos/2, qmarkarcs/2-dos/2, qmarkw/2-t/2-dos/2, qmarkarcs-dos/2);

  if(qmarkmh+tlt-qmarkbarc > t+dos/2+h/10) {
    qmarkPath.moveTo(qmarkw/2-t/2, qmarkmh+tlt-qmarkbarc); //middle-vertical
    qmarkPath.lineTo(qmarkw/2+t/2, qmarkmh+tlt-qmarkbarc);
    qmarkPath.lineTo(qmarkw/2+t/2, t+dos/2+h/10);
    qmarkPath.lineTo(qmarkw/2-t/2, t+dos/2+h/10);
  }

  if(qmarktarc<tlt) {
    qmarkPath.moveTo(0, h-qmarktarc+os/2);//top-left arc끝부분 두께보다 작아지면서 역으로 말려들어가 구멍낙는거 막기
    qmarkPath.lineTo(t, h-qmarktarc+os/2);
    qmarkPath.lineTo(t, h-tlt+os/2);
    qmarkPath.lineTo(0, h-tlt+os/2);
  }
  if(qmarkmh < t+dos/2+h/10) {
    qmarkPath.moveTo(qmarkw/2-t/2, qmarkmh+tlt-qmarkbarc); //중앙 기둥과 mh를 연결..? 뭔가 구멍 막기 용이긴 한데.. qmarkmh 제한을 강제 안하는 대신.
    qmarkPath.lineTo(qmarkw/2+t/2, qmarkmh+tlt-qmarkbarc);
    qmarkPath.lineTo(qmarkw/2+t/2, qmarkmh);
    qmarkPath.lineTo(qmarkw/2-t/2, qmarkmh);
  }

  var qmarkGlyph = new opentype.Glyph({
    name: '?',
    unicode: 63,
    advanceWidth: qmarkw+g,
    path: qmarkPath
  });

  var emarkPath = new opentype.Path();
  var emarkw = t;

  var dos = t*0.12;
  var emarkarcs = arcs;
  if(emarkarcs > t/2)
    emarkarcs = t/2;//Math.round(((t+dos)/2)/10)*10;
  dos= t*0.04*(300-(t-emarkarcs*2))/100;

  emarkPath.moveTo(emarkw/2-t/2, h); //middle-vertical
  emarkPath.lineTo(emarkw/2+t/2, h);
  emarkPath.lineTo(emarkw/2+t/2, t+dos/2+h/10);
  emarkPath.lineTo(emarkw/2-t/2, t+dos/2+h/10);

  emarkPath.moveTo(emarkw/2-t/2-dos/2, t-emarkarcs+dos/2);//emark-poemarknt
  emarkPath.curveTo(emarkw/2-t/2-dos/2, t-emarkarcs/2+dos/2, emarkw/2-t/2+emarkarcs/2-dos/2, t+dos/2, emarkw/2-t/2+emarkarcs-dos/2, t+dos/2);
  emarkPath.lineTo(emarkw/2-t/2+t-emarkarcs+dos/2, t+dos/2);
  emarkPath.curveTo(emarkw/2-t/2+t-emarkarcs/2+dos/2, t+dos/2, emarkw/2-t/2+t+dos/2, t-emarkarcs/2+dos/2, emarkw/2-t/2+t+dos/2, t-emarkarcs+dos/2);
  emarkPath.lineTo(emarkw/2-t/2+t+dos/2, emarkarcs-dos/2);
  emarkPath.curveTo(emarkw/2-t/2+t+dos/2, emarkarcs/2-dos/2, emarkw/2-t/2+t-emarkarcs/2+dos/2, -dos/2, emarkw/2-t/2+t-emarkarcs+dos/2, -dos/2);
  emarkPath.lineTo(emarkw/2-t/2+emarkarcs-dos/2, -dos/2);
  emarkPath.curveTo(emarkw/2-t/2+emarkarcs/2-dos/2, -dos/2, emarkw/2-t/2-dos/2, emarkarcs/2-dos/2, emarkw/2-t/2-dos/2, emarkarcs-dos/2);

  var emarkGlyph = new opentype.Glyph({
    name: '!',
    unicode: 33,
    advanceWidth: emarkw+g,
    path: emarkPath
  });



  var glyphs = [notdefGlyph, spaceGlyph, aGlyph, bGlyph, cGlyph, dGlyph,
    eGlyph, fGlyph, gGlyph, hGlyph, iGlyph, jGlyph, kGlyph, lGlyph, mGlyph,
    nGlyph, oGlyph, pGlyph, qGlyph, rGlyph, sGlyph, tGlyph, uGlyph, vGlyph,
    wGlyph, xGlyph, yGlyph, zGlyph, aGlyphs, bGlyphs, cGlyphs, dGlyphs,
    eGlyphs, fGlyphs, gGlyphs, hGlyphs, iGlyphs, jGlyphs, kGlyphs, lGlyphs,
    mGlyphs, nGlyphs, oGlyphs, pGlyphs, qGlyphs, rGlyphs, sGlyphs, tGlyphs,
    uGlyphs, vGlyphs, wGlyphs, xGlyphs, yGlyphs, zGlyphs,
    zeroGlyph, oneGlyph, twoGlyph, threeGlyph, fourGlyph, fiveGlyph, sixGlyph,
    sevenGlyph, eightGlyph, nineGlyph,
    dotGlyph, commaGlyph, quoteGlyph, qmarkGlyph, emarkGlyph];
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

    //이거 중요하다. 여기서는 잘된다.
    var options = {};//test
    let textForFindWidth = document.getElementById('textField').value;
    fontW = [];
    for(let i = 0; i < textForFindWidth.length; i++) {
      if(!fontW[i])
        fontW[i] = fontW[i-1];

      if(!fontW[i])
        fontW[i] = font2.getAdvanceWidth(textForFindWidth[i], fontSize, options) + s/4;
      else if(fontW[i])
        fontW[i] += font2.getAdvanceWidth(textForFindWidth[i], fontSize, options);//각자 크기만큼 담김 .이제 각자 앞에껄 합한만큼으로 해주자.
    }
    console.log(fontW[0]);
    // 여기서는 폰트간격에 문제가 안생기니 여기서 저장해서 아래 프리뷰 만들때 정보 제공할거임.

    // console.log(font2.getAdvanceWidth(document.getElementById('textField').value, fontSize, options));
    //여기서는 넓이값이 잘 나오다가 아래 renderTextPreview에서 출력하면 0으로 나오는 원인만 알아내면 된다.
    //문제는 draw다 draw를 하고나면 값이 0이된다.

    // document.getElementById('fontFamilyName').innerHTML = font2.names.fontFamily.en;

    for (var i = 2; i < font2.glyphs.length; i++) { // 폰트없을때랑 스페이스랑 제외하기 위해서 2로 시작
      var ctx;
      var glyph = font2.glyphs.get(i);
      var canvasSizeX = 45;
      var canvasSizeY = 50;
      var x = 10;
      var y = 30;
      var fontSize_g = 35;
      if(!firstDraw) {//만약 이게 처음 그리는게 아니라면 칸의 이름만 받아와서
        ctx = document.getElementById('c' + glyph.index).getContext('2d');
        ctx.clearRect(0, 0, canvasSizeX, canvasSizeY+20); // 흰색 네모를 그려서 덮어버리는거임
      }
      else
      ctx = createGlyphCanvas(glyph, canvasSizeX, canvasSizeY);
      glyph.draw(ctx, x, y, fontSize_g, 'white');
      // glyph.drawPoints(ctx, x, y, fontSize_g);
      // glyph.drawMetrics(ctx, x, y, fontSize_g);
    }
  }

function renderTextPreview() { //써둔 글자를 받아서 프리뷰에 써주는 부분
    if (!font2) return;
    textToRender = document.getElementById('textField').value;
    var previewCtx = document.getElementById('preview').getContext('2d');
    var options = {};
    previewCtx.clearRect(0, 0, 2000, 300);
    for (let i = 0; i < textToRender.length; i++) {
      if(i==0)
        font2.draw(previewCtx, textToRender[i], s/4, 200, fontSize, options, 'black');
      else
      font2.draw(previewCtx, textToRender[i], fontW[i-1], 200, fontSize, options, 'black');
    }

    //이거랑 위에를 통재로 위로 옮겨도 0으로 나오는거로 확인. 원인은 여기 내부에 있음.
    // console.log(font2.getAdvanceWidth(document.getElementById('textField').value, fontSize, options));

    // for (var i = 0; i < textToRender.length; i++) {
    //   font2.draw(previewCtx, textToRender[i], ((w+s*2)/9+30)*i*fontSize*0.007+10, 200, fontSize, options, 'black');
    //   // font2.drawPoints(previewCtx, textToRender[i], ((w+s*2)/9+30)*i*fontSize*0.007+10, 200, fontSize, options);
    // }
  }

function fontChanged() { //슬라이드를 통해 사이즈가 바뀌면 다시 작동 시켜서 수치를 바꿔주는 부분
  if(!cameraActive) {
    // fontSize = parseInt(fontSizeSlider.value, 10);
    // document.getElementById('fontSize').innerHTML = '' + fontSize;
    t = parseInt(thickSizeSlider.value, 10);
    //document.getElementById('thickSize').innerHTML = '' + t;
    arcs = parseInt(arcsSlider.value, 10);
    //document.getElementById('arcSize').innerHTML = '' + arcs;
    w = parseInt(widthSlider.value, 10);
    //document.getElementById('widthSize').innerHTML = '' + w;
    mh = parseInt(mhSlider.value, 10);
    //document.getElementById('mhSize').innerHTML = '' + mh;
    lt = parseInt(ltSlider.value, 10)/10;
    //document.getElementById('ltSize').innerHTML = '' + lt;
    s = parseInt(serifSlider.value, 10);
    //document.getElementById('serifSize').innerHTML = '' + s;
    sh = parseInt(shSlider.value, 10);
    //document.getElementById('shSize').innerHTML = '' + sh;
  }
    createGlyphFont(false);
    renderTextPreview();
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
  thickSizeSlider.addEventListener('input', fontChanged, false); // 슬라이더가 바뀔때마다 인지하게 하는 곳
  thickSizeSlider.addEventListener('change', fontChanged, false);
  arcsSlider.addEventListener('input', fontChanged, false); // 슬라이더가 바뀔때마다 인지하게 하는 곳
  arcsSlider.addEventListener('change', fontChanged, false);
  widthSlider.addEventListener('input', fontChanged, false); // 슬라이더가 바뀔때마다 인지하게 하는 곳
  widthSlider.addEventListener('change', fontChanged, false);
  mhSlider.addEventListener('input', fontChanged, false); // 슬라이더가 바뀔때마다 인지하게 하는 곳
  mhSlider.addEventListener('change', fontChanged, false);
  ltSlider.addEventListener('input', fontChanged, false); // 슬라이더가 바뀔때마다 인지하게 하는 곳
  ltSlider.addEventListener('change', fontChanged, false);
  serifSlider.addEventListener('input', fontChanged, false); // 슬라이더가 바뀔때마다 인지하게 하는 곳
  serifSlider.addEventListener('change', fontChanged, false);
  shSlider.addEventListener('input', fontChanged, false); // 슬라이더가 바뀔때마다 인지하게 하는 곳
  shSlider.addEventListener('change', fontChanged, false);
