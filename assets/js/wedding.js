// 0. 사용자 언어 감지
function getUserLang() {
  // localStorage에 저장된 언어 확인
  let storedLang = localStorage.getItem("lang");

  if (!storedLang) {
    // 없으면 브라우저 언어 감지 후 저장
    const lang = navigator.language.toLowerCase();
    storedLang = lang.startsWith("ko") ? "KR" : "EN";
    localStorage.setItem("lang", storedLang);
  }

  return storedLang;
}


// 1. 구글 시트 데이터 불러오기
async function fetchSheetData() {
  const sheetUrl = "https://docs.google.com/spreadsheets/d/1C_G5IezKbH6oyfxZtZK853zgnKhIL7we1jiZerd2mmo/gviz/tq?tqx=out:json";
  const res = await fetch(sheetUrl);
  const text = await res.text();
  const json = JSON.parse(text.substr(47).slice(0, -2));
  return json.table.rows;
}

// 2. 텍스트맵 만들기
async function buildTextMap(lang) {
  const rows = await fetchSheetData();
  const textMap = {};
  rows.forEach(row => {
    const key = row.c[0]?.v;
    const krText = row.c[1]?.v;
    const enText = row.c[2]?.v;
    textMap[key] = (lang === "KR" ? krText : enText) || "";
  });
  return textMap;
}

// 3. 텍스트 적용
function applyAllTexts(textMap) {
  // 일반 텍스트 적용
  document.querySelectorAll("[data-key]").forEach(el => {
    const key = el.getAttribute("data-key");
    const text = textMap[key] || "";
    el.innerHTML = text.replace(/\n/g, "<br>");
  });

  // input placeholder
  document.querySelectorAll("[data-key-placeholder]").forEach(el => {
    const key = el.getAttribute("data-key-placeholder");
    el.setAttribute("placeholder", textMap[key] || "");
  });

  // 버튼용 전화번호 dataset 적용
  document.querySelectorAll("[data-phone-key]").forEach(btn => {
    const key = btn.getAttribute("data-phone-key");
    if (textMap[key]) {
      btn.dataset.phone = textMap[key];
    }
  });

  // 버튼용 계좌번호 dataset 적용
  document.querySelectorAll("[data-account-key]").forEach(btn => {
    const key = btn.getAttribute("data-account-key");
    if (textMap[key]) {
      btn.dataset.account = textMap[key];
    }
  });
}

// 4. 언어별 테마
function applyLanguageTheme(lang) {
  const body = document.body;
  body.classList.remove("Language-Korean", "Language-English");
  body.classList.add(lang === "KR" ? "Language-Korean" : "Language-English");
}

// 5. 커스텀 alert 모달
function showAlert(message) {
  const modal = document.getElementById("custom-modal");
  const alertText = document.getElementById("alert-text");
  alertText.textContent = message;
  modal.classList.remove("hidden");

  const okBtn = document.getElementById("alert-ok-btn");
  okBtn.onclick = () => {
    modal.classList.add("hidden");
  };
}

// ----------------------
// 6. 탭 기본값 설정 및 클릭 처리 (모듈 전용)
// ----------------------
document.addEventListener('DOMContentLoaded', async () => {
  const lang = getUserLang();
  applyLanguageTheme(lang);
  const textMap = await buildTextMap(lang);
  window.textMap = textMap;
  applyAllTexts(textMap);

  // 모듈 폼 탭 설정
  const defaultButton = document.querySelector('.RSVP-module form .tab-button[data-tab="groom"]');
  if (defaultButton) {
    defaultButton.classList.add('active');
    const sideInput = document.getElementById('sideInput_module');
    sideInput.value = '신랑측';
  }

  // 탭 버튼 클릭 (모듈 전용)
  document.querySelectorAll('.RSVP-module form .tab-button').forEach(button => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.RSVP-module form .tab-button').forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const sideInput = document.getElementById('sideInput_module');
      sideInput.value = button.dataset.tab === 'groom' ? '신랑측' : '신부측';
    });
  });
});

// 탭 기본값 설정 및 클릭 처리 (모달 전용)
document.addEventListener('DOMContentLoaded', () => {
  const defaultButton = document.querySelector('.RSVP-module.custom-modal form .tab-button[data-tab="groom"]');
  if (defaultButton) {
    defaultButton.classList.add('active');
    const sideInput = document.getElementById('sideInput_modal');
    sideInput.value = '신랑측';
  }

  document.querySelectorAll('.RSVP-module.custom-modal form .tab-button').forEach(button => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.RSVP-module.custom-modal form .tab-button').forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const sideInput = document.getElementById('sideInput_modal');
      sideInput.value = button.dataset.tab === 'groom' ? '신랑측' : '신부측';
    });
  });
});

// ----------------------
// 7. RSVP 전송 - 모듈 버전
// ----------------------
function submitFormModule(isAttending) {
  const nameInputEl = document.getElementById('nameInput_module');
  const sideInputEl = document.getElementById('sideInput_module');

  const name = nameInputEl.value.trim();
  if (!name) {
    showAlert(document.getElementById('alert-name-required').textContent || '성함을 입력해주세요.');
    return;
  }
  if (!sideInputEl.value) {
    showAlert(document.getElementById('alert-side-required').textContent || '신랑측 또는 신부측을 선택해주세요.');
    return;
  }

  // 참석/불참 값
  document.getElementById('attendingInput_module').value = isAttending ? '참석' : '불참';

  // 직렬화
  const form = document.getElementById('rsvpForm_module');
  const formData = new FormData(form);
  formData.append('action', 'rsvp');
  const query = new URLSearchParams(formData).toString();
  const url = form.action + '?' + query;

  // 전송
  showAlert(document.getElementById('alert-wait-text').textContent || '응답을 전송 중입니다...');
  document.getElementById('alert-ok-btn').style.display = 'none';

  fetch(url, { method: 'GET', mode: 'no-cors' })
    .then(() => {
      updateAlertText(document.getElementById('alert-success').textContent || '응답이 기록되었습니다. 감사합니다!');
      document.getElementById('alert-ok-btn').style.display = 'block';
    })
    .catch(() => {
      updateAlertText(document.getElementById('alert-error-text').textContent || '전송 중 오류가 발생했습니다.');
      document.getElementById('alert-ok-btn').style.display = 'block';
    });
}


// ----------------------
// 8. RSVP 전송 - 모달 버전
// ----------------------
function submitFormModal(isAttending) {
  const modal = document.querySelector('.RSVP-module.custom-modal');
  const nameInputEl = document.getElementById('nameInput_modal');
  const sideInputEl = document.getElementById('sideInput_modal');

  const name = nameInputEl.value.trim();
  if (!name) {
    showAlert(document.getElementById('alert-name-required').textContent || '성함을 입력해주세요.');
    return;
  }
  if (!sideInputEl.value) {
    showAlert(document.getElementById('alert-side-required').textContent || '신랑측 또는 신부측을 선택해주세요.');
    return;
  }

  // 참석/불참 값
  document.getElementById('attendingInput_modal').value = isAttending ? '참석' : '불참';

  // 직렬화
  const form = document.getElementById('rsvpForm_modal');
  const formData = new FormData(form);
  formData.append('action', 'rsvp');
  const query = new URLSearchParams(formData).toString();
  const url = form.action + '?' + query;

  // 전송
  showAlert(document.getElementById('alert-wait-text').textContent || '응답을 전송 중입니다...');
  document.getElementById('alert-ok-btn').style.display = 'none';

  fetch(url, { method: 'GET', mode: 'no-cors' })
    .then(() => {
      updateAlertText(document.getElementById('alert-success').textContent || '응답이 기록되었습니다. 감사합니다!');
      document.getElementById('alert-ok-btn').style.display = 'block';

      // 전송 후 모달 닫기
      modal.style.display = 'none';
    })
    .catch(() => {
      updateAlertText(document.getElementById('alert-error-text').textContent || '전송 중 오류가 발생했습니다.');
      document.getElementById('alert-ok-btn').style.display = 'block';

      // 실패해도 모달 닫을지 선택 가능
      // modal.style.display = 'none';
    });
}

// 9. 메시지 전송
function submitMessage() {
  const name = document.getElementById('messageNameInput').value.trim() || '익명';
  const content = document.getElementById('messageContentInput').value.trim();

  if (!content) {
    showAlert(document.getElementById('alert-message-required')?.textContent || '내용을 입력해주세요.');
    return;
  }

  const params = new URLSearchParams({
    action: 'message',
    name,
    content
  });

  const url = `https://script.google.com/macros/s/AKfycbwuT2SWQg33Xz50BV5L5TUVdGeGGbOFO2KRxiAJDJjBo0wKI5juw-D_Y49SLS3EY97S/exec?${params.toString()}`;

  // 전송 대기 모달 표시
  showAlert(document.getElementById('alert-message-wait')?.textContent || '응답을 전송 중입니다...');
  document.getElementById('alert-ok-btn').style.display = 'none';

  fetch(url, { method: 'GET', mode: 'no-cors' })
    .finally(() => {
      updateAlertText(document.getElementById('alert-message-success')?.textContent || '축하 메시지가 등록되었습니다!');
      document.getElementById('alert-ok-btn').style.display = 'block';

      // 입력 초기화
      document.getElementById('messageNameInput').value = '';
      document.getElementById('messageContentInput').value = '';
    });
}

/// 메시지 받아오기
async function loadMessages() {
  const url = 'https://script.google.com/macros/s/AKfycbwuT2SWQg33Xz50BV5L5TUVdGeGGbOFO2KRxiAJDJjBo0wKI5juw-D_Y49SLS3EY97S/exec?action=getMessages';

  try {
    const response = await fetch(url);
    const messages = await response.json();

    const listEl = document.getElementById('messageList');
    listEl.innerHTML = '';

    messages.forEach(msg => {
      const item = document.createElement('div');
      item.className = 'message-item';

      // 이름 요소
      const nameEl = document.createElement('div');
      nameEl.className = 'message-name';
      nameEl.textContent = msg.name;

      // 내용 요소
      const contentEl = document.createElement('div');
      contentEl.className = 'message-content';
      contentEl.textContent = msg.content;

      // item에 추가
      item.appendChild(nameEl);
      item.appendChild(contentEl);

      listEl.appendChild(item);
    });
  } catch (err) {
    console.error('메시지 불러오기 실패', err);
  }
}

// 모달 닫기 버튼 이벤트
document.getElementById('alert-ok-btn').addEventListener('click', () => {
  // 모달 숨기기
  document.getElementById('custom-modal').classList.add('hidden');

  // 메시지 새로 불러오기
  loadMessages();
});

// 페이지 로드 시 메시지 불러오기
document.addEventListener('DOMContentLoaded', loadMessages);


// 모달 텍스트 업데이트 함수
function updateAlertText(text) {
  const alertTextEl = document.getElementById('alert-text');
  if (alertTextEl) alertTextEl.textContent = text;
}


//인앱에서 누르면 외부로 나가서 달력 받는 함수
// 달력 다운로드 + 인앱 브라우저 외부 브라우저 처리 통합
// === 인앱 브라우저 외부 이동 + 달력 다운로드 ===
(function () {
  const userAgent = navigator.userAgent.toLowerCase();
  const targetUrl = location.href;
  const sessionFlag = 'inAppExternalTried';

  const browserPatterns = {
    kakaotalk: /kakaotalk/i,
    line: /line/i,
    otherInApp: /inapp|naver|snapchat|instagram|whatsapp|electron|aliapp|iphone(.*)whale|android(.*)whale|kakaostory|band|twitter|fb_iab|fb4a|fban|fbios|fbss|samsungbrowser/i,
    ios: /iphone|ipad|ipod/i
  };

  function isInApp() {
    return browserPatterns.kakaotalk.test(userAgent) ||
      browserPatterns.line.test(userAgent) ||
      browserPatterns.otherInApp.test(userAgent);
  }

  function downloadCalendar() {
    const summary = textMap["Event_Summary"];
    const description = textMap["Event_Description"];
    const location = textMap["Event_Location"];
    const url = textMap["Event_URL"];
    const alarm1 = textMap["Event_Alarm1"];
    const alarm7 = textMap["Event_Alarm7"];

    const icsContent = `
BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//sangwoohahn.com/JennyMyWife//EN
BEGIN:VEVENT
UID:20260124T030000Z@sangwoohahn.com
DTSTAMP:20260124T030000Z
DTSTART:20260124T030000Z
DTEND:20260124T050000Z
SUMMARY:${summary}
DESCRIPTION:${description}
LOCATION:${location}
URL:${url}
BEGIN:VALARM
TRIGGER:-P1D
ACTION:DISPLAY
DESCRIPTION:${alarm1}
END:VALARM
BEGIN:VALARM
TRIGGER:-P7D
ACTION:DISPLAY
DESCRIPTION:${alarm7}
END:VALARM
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: "text/calendar" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "SangwooJenny_WeddingDay.ics";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // 버튼 클릭
  const calendarBtn = document.getElementById("add-to-calendar");
  if (calendarBtn) {
    calendarBtn.addEventListener("click", (e) => {
      e.preventDefault();

      // 일반 브라우저라면 바로 다운로드
      if (!isInApp()) {
        downloadCalendar();
        return;
      }

      // 인앱 브라우저라면 외부 브라우저 + 달력 파라미터
      if (sessionStorage.getItem(sessionFlag)) return;
      sessionStorage.setItem(sessionFlag, 'true');

      const externalUrl = targetUrl + (targetUrl.includes('?') ? '&' : '?') + 'downloadCalendar=1#date-section';

      if (browserPatterns.kakaotalk.test(userAgent)) {
        location.href = 'kakaotalk://web/openExternal?url=' + encodeURIComponent(externalUrl);
      } else if (browserPatterns.line.test(userAgent)) {
        location.href = externalUrl + '&openExternalBrowser=1';
      } else if (browserPatterns.otherInApp.test(userAgent)) {
        if (browserPatterns.ios.test(userAgent)) {
          location.href = externalUrl;
        } else {
          location.href = 'intent://' + externalUrl.replace(/^https?:\/\//i, '') + '#Intent;scheme=http;package=com.android.chrome;end';
        }
      }
    });
  }
})();

function downloadCalendarIfParam() {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get("downloadCalendar") === "1") {
    downloadCalendar();
  }
}

// 페이지 접속 후 1초 뒤 실행
setTimeout(downloadCalendarIfParam, 1000);


// 갤러리 모듈
// 갤러리 모듈
const galleryTrack = document.getElementById('thumbnailTrack');
const galleryImages = Array.from(document.querySelectorAll('#thumbnailTrack img'));
const indicatorDots = Array.from(document.querySelectorAll('.indicator span'));
const prevArrow = document.querySelector('.indicator-wrapper .prev');
const nextArrow = document.querySelector('.indicator-wrapper .next');

let currentSlide = 0;
let isDragging = false;
let startX = 0;
let startY = 0;
let scrollLeftStart = 0;
let dragStartTime = 0;
let lastX = 0;
let lastTime = 0;
const snapThreshold = 0.35; // 35%
const velocityThreshold = 0.3; // 빠른 스와이프 임계

// 스냅 이동 + 인디케이터 업데이트
function scrollToSlide(index) {
  index = Math.min(Math.max(index, 0), galleryImages.length - 1);
  currentSlide = index;
  updateIndicator(index);

  const imageWidth = galleryImages[0].offsetWidth + 8;
  const targetScroll = index * imageWidth - galleryTrack.offsetWidth * 0.05;
  galleryTrack.scrollTo({ left: targetScroll, behavior: 'smooth' });
}

// 인디케이터 업데이트
function updateIndicator(index) {
  indicatorDots.forEach((dot, i) => dot.classList.toggle('active', i === index));
}

// 터치/마우스 시작
galleryTrack.addEventListener('mousedown', e => {
  isDragging = true;
  startX = e.pageX - galleryTrack.offsetLeft;
  startY = e.pageY - galleryTrack.offsetTop;
  scrollLeftStart = galleryTrack.scrollLeft;
  dragStartTime = Date.now();
  lastX = startX;
  lastTime = dragStartTime;
  document.body.style.overflow = 'hidden';
});

galleryTrack.addEventListener('touchstart', e => {
  startX = e.touches[0].pageX;
  startY = e.touches[0].pageY;
  scrollLeftStart = galleryTrack.scrollLeft;
  dragStartTime = Date.now();
  lastX = startX;
  lastTime = dragStartTime;
  isDragging = true;
  document.body.style.overflow = 'hidden';
}, {passive:false});

let isHorizontalScroll = false;

// 터치/마우스 이동
galleryTrack.addEventListener('mousemove', handleMove);
galleryTrack.addEventListener('touchmove', handleMove, {passive:false});

function handleMove(e) {
  if (!isDragging) return;

  const x = e.type.includes('touch') ? e.touches[0].pageX : e.pageX - galleryTrack.offsetLeft;
  const y = e.type.includes('touch') ? e.touches[0].pageY : e.pageY - galleryTrack.offsetTop;
  const dx = x - startX;
  const dy = y - startY;

  if (!isHorizontalScroll && Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 5) {
    isHorizontalScroll = true;
  }

  if (isHorizontalScroll) {
    e.preventDefault();
    galleryTrack.scrollLeft = scrollLeftStart - dx;

    // 속도 계산용
    const now = Date.now();
    lastX = x;
    lastTime = now;
  }
}

// 드래그/터치 종료
galleryTrack.addEventListener('mouseup', handleEnd);
galleryTrack.addEventListener('mouseleave', handleEnd);
galleryTrack.addEventListener('touchend', handleEnd);

function handleEnd() {
  if (!isDragging) return;
  isDragging = false;
  document.body.style.overflow = '';
  if (!isHorizontalScroll) return; // 수직 스크롤일 경우 스냅 안함

  const imageWidth = galleryImages[0].offsetWidth + 8;
  const dx = lastX - startX;
  const dt = (Date.now() - dragStartTime) / 1000;
  const velocity = dx / dt / imageWidth;

  let index = currentSlide;
  const scrollRatio = (galleryTrack.scrollLeft + galleryTrack.offsetWidth*0.05) / imageWidth;

  if (velocity > velocityThreshold || scrollRatio < currentSlide + (1 - snapThreshold) && scrollRatio < currentSlide) {
    index = currentSlide - 1;
  } else if (velocity < -velocityThreshold || scrollRatio > currentSlide + snapThreshold) {
    index = currentSlide + 1;
  }

  scrollToSlide(index);
  isHorizontalScroll = false;
}

// 인디케이터 클릭
indicatorDots.forEach((dot, i) => {
  dot.addEventListener('click', () => scrollToSlide(i));
});

// 화살표 클릭
function getVisibleDots() {
  return indicatorDots.filter(dot => window.getComputedStyle(dot).display!=='none');
}

prevArrow.addEventListener('click', () => {
  const visibleDots = getVisibleDots();
  let idx = visibleDots.indexOf(indicatorDots[currentSlide]) - 1;
  if (idx < 0) idx = visibleDots.length - 1;
  scrollToSlide(Array.from(indicatorDots).indexOf(visibleDots[idx]));
});

nextArrow.addEventListener('click', () => {
  const visibleDots = getVisibleDots();
  let idx = visibleDots.indexOf(indicatorDots[currentSlide]) + 1;
  if (idx >= visibleDots.length) idx = 0;
  scrollToSlide(Array.from(indicatorDots).indexOf(visibleDots[idx]));
});

// 초기 인디케이터
updateIndicator(currentSlide);


//갤러리 클릭 줌

const images = document.querySelectorAll('.images img');
const lightbox = document.querySelector('.lightbox');
const lightboxImage = document.querySelector('.lightbox-image');
const closeBtn = document.querySelector('.close');
const prevBtn = document.querySelector('.arrow-wrapper .prev');
const nextBtn = document.querySelector('.arrow-wrapper .next');

let currentIndex = 0;

function showLightbox(index) {
  currentIndex = index;
  lightboxImage.src = images[currentIndex].src;
  lightbox.style.display = 'flex';
  updateIndicator(currentIndex);
}

function closeLightbox() {
  lightbox.style.display = 'none';
}

function nextImage() {
  currentIndex = (currentIndex + 1) % images.length;
  showLightbox(currentIndex);
}

function prevImage() {
  currentIndex = (currentIndex - 1 + images.length) % images.length;
  showLightbox(currentIndex);
}

// function updateIndicator(index) {
//   indicators.forEach((el, i) => {
//     el.classList.toggle('active', i === index);
//   });
// }

// Event Listeners
images.forEach((img, i) => {
  img.addEventListener('click', () => showLightbox(i));
});

closeBtn.addEventListener('click', closeLightbox);
nextBtn.addEventListener('click', nextImage);
prevBtn.addEventListener('click', prevImage);

// ESC 키로 닫기
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowRight') nextImage();
  if (e.key === 'ArrowLeft') prevImage();
});


//지도
// 사용자 언어 감지
const lang = getUserLang(); // "KR" 또는 "EN"
// const styleJson = 'https://api.maptiler.com/maps/0198736c-7d0f-7d3f-86bd-6112b6939cea/style.json?key=cdqp09bHBUjkatg709VX';
const styleJson = lang === 'KR'
  ? 'https://api.maptiler.com/maps/0198736c-7d0f-7d3f-86bd-6112b6939cea/style.json?key=cdqp09bHBUjkatg709VX'
  : 'https://api.maptiler.com/maps/019906d5-2c72-7c4e-8f31-1a499924884f/style.json?key=cdqp09bHBUjkatg709VX';


const attribution = new ol.control.Attribution({
  collapsible: true,
});

const map = new ol.Map({
  target: 'map',
  controls: ol.control.defaults.defaults({ attribution: false }).extend([attribution]),
  view: new ol.View({
    constrainResolution: false,
    center: ol.proj.fromLonLat([126.9978, 37.5389]),
    zoom: 15.8,
    maxZoom: 18,
    minZoom: 5,
    maxBounds: [
      [124.5, 33.0], // 서남쪽 (경도, 위도)
      [131.0, 38.7]  // 동북쪽
    ]
  })
});

// DragPan interaction 가져오기
const dragPan = map.getInteractions().getArray().find(i => i instanceof ol.interaction.DragPan);

// 한 손가락 터치 막기
map.getViewport().addEventListener('touchstart', (evt) => {
  if (evt.touches.length === 1) {
    dragPan.setActive(false); // 한 손가락이면 드래그 비활성화
  } else {
    dragPan.setActive(true);  // 두 손가락 이상이면 활성화
  }
});

map.getViewport().addEventListener('touchend', () => {
  dragPan.setActive(true); // 터치 끝나면 다시 활성화
});

// MapTiler 스타일 적용
olms.apply(map, styleJson).then(() => {

  // 그랜드 하얏트 서울 건물 GeoJSON (예시 좌표)
  const grandHyattGeoJSON = {
    "type": "FeatureCollection",
    "features": [
      {
        "type": "Feature",
        "properties": { "name": "Grand Hyatt Seoul" },
        "geometry": {
          "type": "Polygon",
          "coordinates": [[
            [126.99686, 37.53873], //가장 아래 꼭지점
            [126.99691, 37.538795],
            [126.996986, 37.538762],
            [126.997075, 37.538865],
            [126.997085, 37.538865],
            [126.997152, 37.538945],
            [126.997175, 37.538928],
            [126.997221, 37.538964],
            [126.997219, 37.538966],
            [126.997245, 37.53899],
            [126.99726, 37.53898],
            [126.997285, 37.538999],
            [126.997301, 37.538995],
            [126.997315, 37.53901],
            [126.997356, 37.538987],
            [126.997475, 37.53908],
            [126.997455, 37.539095],
            [126.997517, 37.539138],
            [126.997545, 37.53912],
            [126.997596, 37.53911],
            [126.997636, 37.539115],
            [126.997663, 37.539126], //동그라미 가장 끝
            [126.997691, 37.539148],
            [126.997713, 37.539186],
            [126.997715, 37.539215],
            [126.997705, 37.53925],
            [126.997917, 37.53934],
            [126.997952, 37.5393],
            [126.998193, 37.539405], //오른쪽 아래 꼭지점
            [126.99803, 37.53967],
            [126.998155, 37.539726],
            [126.998065, 37.53984],
            [126.997931, 37.539789],
            [126.997784, 37.53996], //오른쪽 위 꼭지점
            [126.997337, 37.53975],
            [126.99708, 37.539984],
            [126.997, 37.53994],
            [126.996975, 37.53996],
            [126.99693, 37.53993],
            [126.996876, 37.539999],
            [126.996652, 37.539845],
            [126.996395, 37.53962],
            [126.996205, 37.539441], //왼쪽 위 꼭지점
            [126.99651, 37.539255],
            [126.996383, 37.5390909],
            [126.996545, 37.539],
            [126.99652, 37.53897],
            [126.996491, 37.538986],
            [126.99647, 37.53896],
            [126.996587, 37.53886],
            [126.99686, 37.53873] //시작점
          ]]
        }
      }
    ]
  };

  // 그랜드 하얏트 강조 레이어
  const highlightLayer = new ol.layer.Vector({
    source: new ol.source.Vector({
      features: new ol.format.GeoJSON().readFeatures(grandHyattGeoJSON, {
        featureProjection: 'EPSG:3857'
      })
    }),
    style: function (feature, resolution) {
      const scale = 0.8; // 필요하면 값 조정
      return new ol.style.Style({
        fill: new ol.style.Fill({
          color: '#853BA9'
        }),
        stroke: new ol.style.Stroke({
          color: '#853BA9',
          width: 3
        }),
        text: new ol.style.Text({
          text: lang == "KR" ? "그랜드 하얏트 서울" : "Grand Hyatt Seoul",
          font: 'bold 16px sans-serif',
          fill: new ol.style.Fill({ color: '#853BA9' }),
          stroke: new ol.style.Stroke({ color: '#fff', width: 3 }),
          offsetY: 0,
          scale: scale,
          overflow: true // 지도 밖으로 벗어나도 텍스트 렌더링
        })
      });
    }
  });

  map.addLayer(highlightLayer);
});


// 내비게이션 앱 오픈
const langCheck = getUserLang();
const searchQueryKr = encodeURIComponent('그랜드 하얏트 서울');
const searchQueryEn = encodeURIComponent('Grand Hyatt Seoul');

// 네이버 검색어 선택
const searchQuery = langCheck === "EN" ? searchQueryEn : searchQueryKr;

const links = {
  naver: {
    web: `https://map.naver.com/v5/search/${searchQuery}`,
    app: `nmap://search?query=${searchQuery}`
  },
  kakao: {
    web: `https://map.kakao.com/?q=${searchQuery}`,
    app: `kakaonavi://navigate?query=${searchQuery}`
  },
  tmap: {
    web: `https://www.tmap.co.kr/search?query=${searchQuery}`,
    app: `tmap://search?name=${searchQuery}`
  },
  google: {
    web: `https://www.google.com/maps/search/?api=1&query=${searchQuery}`,
    app: `comgooglemaps://?q=${searchQuery}`
  }
};

function isMobile() {
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
}

// 앱 → 없으면 웹 fallback, 티맵만 alert
function setupMapButton(buttonId, linkObj) {
  const btn = document.getElementById(buttonId);
  if (!btn) return;

  btn.addEventListener("click", (e) => {
    e.preventDefault();

    // --- 환경 감지 ---
    const ua = navigator.userAgent || navigator.vendor || window.opera;
    const isIOS = /iPad|iPhone|iPod/.test(ua) && !window.MSStream;
    const isAndroid = /android/i.test(ua);
    const isMobile = isIOS || isAndroid;

    if (!isMobile) {
      // PC/맥 → 웹 링크 바로 열기
      window.open(linkObj.web, "_blank");
      return;
    }

    const appUrl = linkObj.app || null;
    const webUrl = linkObj.web || null;
    const storeUrl = isIOS ? linkObj.appStore : linkObj.playStore;

    // 앱 URL 자체가 없으면 바로 웹
    if (!appUrl) {
      if (webUrl) window.open(webUrl, "_blank");
      return;
    }

    // --- 앱 실행 시도 ---
    let hidden = false;
    const handleVisibility = () => {
      hidden = true;
    };
    document.addEventListener("visibilitychange", handleVisibility);

    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = appUrl;
    document.body.appendChild(iframe);

    // --- fallback 처리 ---
    setTimeout(() => {
      document.removeEventListener("visibilitychange", handleVisibility);
      document.body.removeChild(iframe);

      if (!hidden) {
        // 앱 실행 실패
        if (linkObj.isTmap) {
          // Tmap만 alert (스토어/웹 열지 않음)
          alert("티맵 앱이 설치되어 있지 않습니다.");
        } else if (storeUrl) {
          // 스토어 fallback
          window.location.href = storeUrl;
        } else if (webUrl) {
          // 마지막 fallback: 웹
          window.open(webUrl, "_blank");
        }
      }
    }, 1200);
  });
}

// 버튼에 적용
setupMapButton("naver-map-link", links.naver);
setupMapButton("kakao-navi-link", links.kakao);
setupMapButton("google-link", links.google);
setupMapButton("tmap-link", { ...links.tmap, isTmap: true }); // 티맵만 예외 처리

// 언어별 버튼 표시
if (langCheck === 'EN') {
  document.getElementById('tmap-link').style.display = 'none';
  document.getElementById('kakao-navi-link').style.display = 'none';
  document.getElementById('google-link').style.display = 'flex';
} else {
  document.getElementById('google-link').style.display = 'none';
}


// 축하글 작성하기 보여지기 버튼
document.getElementById("showMessageBtn").addEventListener("click", () => {
  document.getElementById("messageSection").classList.remove("hidden"); // 섹션 보이기
  document.getElementById("showMessageBtn").style.display = "none"; // 버튼 숨기기
});


// 연락처 탭 스위칭
document.querySelectorAll('.contact-tab').forEach(btn => {
  const lang = getUserLang();

  if (lang === 'EN') { // 영어일 때는 두 패널 모두 항상 열림
    document.querySelectorAll('.contact-panel').forEach(p => {
      p.classList.add('active');
    });
    return;
  }

  btn.addEventListener('click', () => {

    // 버튼 상태
    document.querySelectorAll('.contact-tab').forEach(b => {
      b.classList.toggle('active', b === btn);
      b.setAttribute('aria-selected', b === btn ? 'true' : 'false');
    });

    // 패널 상태
    const tab = btn.dataset.tab;
    document.querySelectorAll('.contact-panel').forEach(p => {
      p.classList.toggle('active', p.dataset.tab === tab);
    });
  });
});

//연락처 버튼 작동
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".contact-button").forEach(btn => {
    btn.addEventListener("click", () => {
      const phone = btn.dataset.phone;
      const action = btn.dataset.action;

      if (!phone) return;

      if (action === "tel") {
        // 전화 걸기
        window.location.href = `tel:${phone}`;
      } else if (action === "sms") {
        // 문자 보내기
        window.location.href = `sms:${phone}`;
      }
    });
  });
});

// 전화 버튼
document.querySelectorAll(".phone-button").forEach(btn => {
  btn.addEventListener("click", () => {
    const phoneNumber = btn.dataset.phone;
    if (!phoneNumber) return;
    window.location.href = `tel:${phoneNumber}`;
  });
});

// 문자 버튼
document.querySelectorAll(".sms-button").forEach(btn => {
  btn.addEventListener("click", () => {
    const phoneNumber = btn.dataset.phone;
    if (!phoneNumber) return;
    window.location.href = `sms:${phoneNumber}`;
  });
});

// 연락처 모달 띄우기
function showContactModal() {
  const modal = document.querySelector(".contact-modal");
  modal.classList.remove("hidden"); // hidden 제거해서 표시

  // 모달 바깥 클릭 시 닫기 (선택 사항)
  modal.onclick = (e) => {
    if (e.target === modal) {
      modal.classList.add("hidden");
    }
  };

  // 닫기 버튼이 있으면 연결
  const closeBtn = modal.querySelector(".close-btn");
  if (closeBtn) {
    closeBtn.onclick = () => {
      modal.classList.add("hidden");
    };
  }
}

// 계좌 탭 스위칭
document.querySelectorAll('.account-tab').forEach(btn => {
  const lang = getUserLang();

  // if (lang === 'EN') { // 영어일 때는 두 패널 모두 항상 열림
  document.querySelectorAll('.account-panel').forEach(p => {
    p.classList.add('active');
  });
  //   return;
  // }

  btn.addEventListener('click', () => {
    // 버튼 상태
    document.querySelectorAll('.account-tab').forEach(b => {
      b.classList.toggle('active', b === btn);
      b.setAttribute('aria-selected', b === btn ? 'true' : 'false');
    });

    // 패널 상태
    const tab = btn.dataset.tab;
    document.querySelectorAll('.account-panel').forEach(p => {
      p.classList.toggle('active', p.dataset.tab === tab);
    });
  });
});

// 계좌 모달 띄우기
function showAccountModal() {
  const modal = document.querySelector(".account-modal");
  modal.classList.remove("hidden"); // hidden 제거해서 표시

  // 모달 바깥 클릭 시 닫기 (선택 사항)
  modal.onclick = (e) => {
    if (e.target === modal) {
      modal.classList.add("hidden");
    }
  };

  // 닫기 버튼이 있으면 연결
  const closeBtn = modal.querySelector(".close-btn");
  if (closeBtn) {
    closeBtn.onclick = () => {
      modal.classList.add("hidden");
    };
  }
}

//카톡 공유하기 버튼
Kakao.init('2ed2abdd736520c949eaff9503434532');
const shareBtn = document.querySelector('#share-kakao');

if (lang === 'KR') {
  // 카카오 공유 버튼
  Kakao.Link.createDefaultButton({
    container: '#share-kakao',
    objectType: 'feed',
    content: {
      title: '상우와 연서의 결혼식에 초대합니다.',
      description: '2026.01.24 모두 축하해주세요!',
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3k8QD2Ty9XCxSBUucxssdkV8aolbj2vrQlw&s',
      link: {
        mobileWebUrl: 'https://sangwoohahn.com/JennyMyWife.html',
        webUrl: 'https://sangwoohahn.com/JennyMyWife.html'
      }
    },
    buttons: [
      {
        title: '청첩장 보기',
        link: {
          mobileWebUrl: 'https://sangwoohahn.com/JennyMyWife.html',
          webUrl: 'https://sangwoohahn.com/JennyMyWife.html'
        }
      },
      {
        title: '식장 안내',
        link: {
          mobileWebUrl: 'https://sangwoohahn.com/JennyMyWife.html#location-section',
          webUrl: 'https://sangwoohahn.com/JennyMyWife.html#location-section'
        }
      }
    ]
  });
} else {
  // 영어 버전 → 주소 복사
  shareBtn.addEventListener('click', () => {
    const url = 'https://sangwoohahn.com/JennyMyWife.html';
    navigator.clipboard.writeText(url)
      .then(() => {
        showToast();
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
      });
  });
}


//계좌번호 복사후 복사 알람
function showToast() {
  const toast = document.getElementById('toast');
  // toast.textContent = message;
  toast.classList.add('show');

  // 2초 뒤 자동으로 내려가면서 사라짐
  setTimeout(() => {
    toast.classList.remove('show');
  }, 2000);
}

document.querySelectorAll('.account-button').forEach(button => {
  button.addEventListener('click', () => {
    const key = button.getAttribute('data-account-key');
    const targetSpan = document.querySelector(`span[data-key="${key}"]`);

    if (targetSpan) {
      const textToCopy = targetSpan.textContent.trim();

      if (textToCopy) {
        navigator.clipboard.writeText(textToCopy)
          .then(() => {
            showToast();
          })
          .catch(err => {
            console.error('복사 실패:', err);
          });
      }
    }
  });
});


//RSVP 모달 10초 후 자동등장
document.addEventListener("DOMContentLoaded", () => {
  const modal = document.querySelector(".RSVP-module.custom-modal");
  const modalContent = document.querySelector(".RSVP-module .custom-modal-content");

  // 이미 본 적 있는지 확인 (localStorage)
  const hasSeenModal = localStorage.getItem("rsvpModalShown");

  if (!hasSeenModal) {
    setTimeout(() => {
      modal.style.display = "flex";  // 보이기
      localStorage.setItem("rsvpModalShown", "true");
    }, 10000); // 10초 후 표시
  }

  // 모달 외부 클릭 시 닫기
  modal.addEventListener("click", (e) => {
    if (!modalContent.contains(e.target)) {
      modal.style.display = "none";
    }
  });

  // ESC 키로 닫기
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      modal.style.display = "none";
    }
  });
});


//계좌번호 대신 벤모
document.querySelectorAll(".venmo-button").forEach(btn => {
  btn.addEventListener("click", () => {
    const username = btn.dataset.account;
    if (!username) return;

    // venmo 앱 열기
    window.location.href = `venmo://paycharge?recipients=${encodeURIComponent(username)}`;

    // fallback: 앱이 없으면 웹으로
    setTimeout(() => {
      window.open(`https://venmo.com/${username}`, "_blank");
    }, 1200);
  });
});




//------ 타이틀 애니메이션 ------ //

// ScrollTrigger 플러그인 등록
gsap.registerPlugin(ScrollTrigger);
let mm = gsap.matchMedia();

let tl = gsap.timeline({
  scrollTrigger: {
    trigger: ".title-module",
    start: "top top",
    end: "+=" + window.innerHeight * 4, // 화면 높이 3배 길이 확보
    pin: true,
    scrub: true
  }
});


tl
  .to(".title-text", { scale: 1.2, opacity: 0, duration: 0.5 }, 0.1)
  .to(".title-date", { y: 220, scale: 1.4, opacity: 0, duration: 0.5 }, 0.1)
  .to(".title-shine", { scale: 1.5, rotation: 60, duration: 0.5 }, 0.2)
  .to(".title-shine", { scale: 0, duration: 0.6 }, 0.35)

mm.add("(max-width: 767px)", () => { // 모바일
  tl
    .to(".title-flower-01", { x: -75, y: -55, duration: 0.5 }, 0)
    .to(".title-flower-02", { x: -45, y: -160, duration: 0.5 }, 0)
    .to(".title-flower-03", { x: -75, y: 150, duration: 0.5 }, 0)
    .to(".title-flower-04", { x: -40, y: 110, duration: 0.5 }, 0)
    .to(".title-flower-05", { x: 100, y: 210, duration: 0.5 }, 0)
    .to(".title-ring", { scale: 0.8, duration: 0.6 }, 0.3)
    .to(".photo-groom", { x: -10, scale: 1, duration: 0.8 }, 0.5)
    .to(".photo-bride", { x: 10, scale: 1, duration: 0.8 }, 0.5)
    .to(".flower-01", { x: 150, rotation: 0, scale: 1.4, duration: 1 }, 1.2)
    .to(".title-ring", { y: -130, duration: 1.6 }, 1.2)
    .to(".name-container", { y: -170, duration: 1.6 }, 1.2)
    .to(".flower-01", { y: -120, duration: 1.6 }, 1.2)
    .to(".flower-leaf", { x: -100, y: 105, rotation: 180, scale: 1, duration: 1.8 }, 1.5)
    .to(".intro-text", { y: 70, opacity: 1, duration: 1.6 }, 1.4)
});

mm.add("(min-width: 768px)", () => { // 데스크탑
  tl
    .to(".title-flower-01", { x: -105, y: -105, duration: 0.5 }, 0)
    .to(".title-flower-02", { x: -85, y: -230, duration: 0.5 }, 0)
    .to(".title-flower-03", { x: -95, y: 170, duration: 0.5 }, 0)
    .to(".title-flower-04", { x: -60, y: 130, duration: 0.5 }, 0)
    .to(".title-flower-05", { x: 120, y: 250, duration: 0.5 }, 0)
    .to(".title-ring", { scale: 1, duration: 0.6 }, 0.3)
    .to(".photo-groom", { x: -120, scale: 1, duration: 0.8 }, 0.5)
    .to(".photo-bride", { x: 120, scale: 1, duration: 0.8 }, 0.5)
    .to(".flower-01", { x: 240, rotation: 0, scale: 1.4, duration: 1 }, 1.2)
    .to(".title-ring", { y: -120, duration: 1.6 }, 1.2)
    .to(".name-container", { y: -210, duration: 1.6 }, 1.2)
    .to(".flower-01", { y: -110, duration: 1.6 }, 1.2)
    .to(".flower-leaf", { x: window.innerWidth * -0.5 - 60, y: 195, rotation: 180, scale: 1, duration: 1.8 }, 1.5)
    .to(".intro-text", { y: 140, opacity: 1, duration: 1.6 }, 1.4)
});

tl
  .to(".title-flower-01", { opacity: 0, duration: 0.5 }, 0.5)
  .to(".title-flower-02", { opacity: 0, duration: 0.5 }, 0.5)
  .to(".title-flower-03", { opacity: 0, duration: 0.5 }, 0.5)
  .to(".title-flower-04", { opacity: 0, duration: 0.5 }, 0.5)
  .to(".title-flower-05", { opacity: 0, duration: 0.5 }, 0.5)


const petals = [
  { selector: ".title-flower-leaf-01", x: 200, y: -100, rotation: 200 },
  { selector: ".title-flower-leaf-02", x: -180, y: -80, rotation: -120 },
  { selector: ".title-flower-leaf-03", x: 220, y: -90, rotation: 150 },
  { selector: ".title-flower-leaf-04", x: 30, y: 200, rotation: 150 },
  { selector: ".title-flower-leaf-05", x: 220, y: -90, rotation: 150 },
];

petals.forEach(p => {
  document.querySelectorAll(p.selector).forEach(el => {
    tl.to(el, {
      x: () => p.x,
      y: () => p.y,
      rotation: () => p.rotation,
      ease: "power1.inOut",
      duration: 0.5
    }, 0);

    tl.to(el, {
      opacity: 0,
      duration: 0.5
    }, 0.5);
  });
});


// 버튼 예시 (토글)
document.getElementById("icon-setting").addEventListener("click", () => {
  const current = getUserLang();
  const next = current === "KR" ? "EN" : "KR";
  setUserLang(next);
});

// 언어 강제 변경 함수
function setUserLang(lang) {
  localStorage.setItem("lang", lang);

  // 알림 메시지
  if (lang === "KR") {
    alert("언어가 한국어로 변경되었습니다!");
  } else {
    alert("Language has been changed to English!");
  }

  location.reload(); // 저장 후 새로고침
}

