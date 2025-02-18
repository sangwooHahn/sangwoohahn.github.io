var logoImage = document.getElementById('logo');
var aboutText = document.getElementById('about-button');
var contactText = document.getElementById('contact-button');

window.onload = function () {
	onScroll();  // 페이지 로드 시 onScroll 함수 호출
};

function onScroll() {
	requestAnimationFrame(() => {
		// Get the top visible element on the screen
		function getCSSVariableValue(variable) {
			var value = getComputedStyle(document.documentElement).getPropertyValue(variable);
			return parseFloat(value); // 단위가 포함되면 자동으로 무시
		}

		var paddingLeftRightFull = getCSSVariableValue("--padding-left-right-full");

		var element_left = getValidElement(paddingLeftRightFull + 4 + 20, 24);
		var element_right1 = getValidElement(window.innerWidth - paddingLeftRightFull - 4 - 68 - 32 - 26, 24); // 텍스트 중앙 기준
		var element_right2 = getValidElement(window.innerWidth - paddingLeftRightFull - 4 - 32, 24); // 텍스트 중앙 기준

		function getValidElement(x, y) {
			const elements = document.elementsFromPoint(x, y); // 좌표의 모든 요소 가져오기
			const allowedTags = ["img", "video", "section", "header"];
			const allowedClasses = ["webpage-container", "light-gray-box", "dark-image"];

			for (const element of elements) {
				const tagName = element.tagName.toLowerCase();

				// color-card 내부의 첫 번째 div인지 확인
				const colorCardParent = element.closest(".color-card");
				const isFirstDivInColorCard = colorCardParent &&
					element === colorCardParent.querySelector("div:first-of-type");

				if (
					allowedTags.includes(tagName) ||
					allowedClasses.some(cls => element.classList.contains(cls)) ||
					isFirstDivInColorCard
				) {
					return element; // 허용된 요소 반환
				}
			}
		}

		if (!element_left || !element_right1 || !element_right2) {
			return; // 요소가 없으면 실행하지 않음
		}

		var bgColor_left = window.getComputedStyle(element_left).backgroundColor;
		var bgColor_right1 = window.getComputedStyle(element_right1).backgroundColor;
		var bgColor_right2 = window.getComputedStyle(element_right2).backgroundColor;

		var dark_left  = element_left.classList.contains('dark-image');
		var dark_right1  = element_right1.classList.contains('dark-image');
		var dark_right2  = element_right2.classList.contains('dark-image');

		// Set the font color based on the brightness
		if ((getBrightness(bgColor_left) == 0 || getBrightness(bgColor_left) > 150) && !dark_left) {
			logoImage.setAttribute('fill', 'var(--text-header-secondary)');
		} else {
			logoImage.setAttribute('fill', 'var(--text-light)');
		}

		if ((getBrightness(bgColor_right1) == 0 || getBrightness(bgColor_right1) > 150) && !dark_right1) {
			aboutText.style.color = 'var(--text-header-secondary)';
			aboutText.style.background = 'linear-gradient(to right, var(--text-header-secondary) 50%, rgba(0, 0, 0, 0) 50%) left bottom / 0% 2px no-repeat';
		} else {
			aboutText.style.color = 'var(--text-light)';
			aboutText.style.background = 'linear-gradient(to right, var(--text-light) 50%, rgba(0, 0, 0, 0) 50%) left bottom / 0% 2px no-repeat';
		}

		if ((getBrightness(bgColor_right2) == 0 || getBrightness(bgColor_right2) > 150) && !dark_right2) {
			contactText.style.color = 'var(--text-header-secondary)';
			contactText.style.background = 'linear-gradient(to right, var(--text-header-secondary) 50%, rgba(0, 0, 0, 0) 50%) left bottom / 0% 2px no-repeat';
		} else {
			contactText.style.color = 'var(--text-light)';
			contactText.style.background = 'linear-gradient(to right, var(--text-light) 50%, rgba(0, 0, 0, 0) 50%) left bottom / 0% 2px no-repeat';
		}
	});
}

// Add event listeners for mouseover and mouseout
aboutText.addEventListener('mouseover', function () {
	aboutText.style.backgroundSize = '200% 2px';
});

aboutText.addEventListener('mouseout', function () {
	aboutText.style.backgroundSize = '0% 2px';
});

contactText.addEventListener('mouseover', function () {
	contactText.style.backgroundSize = '200% 2px';
});

contactText.addEventListener('mouseout', function () {
	contactText.style.backgroundSize = '0% 2px';
});

// Function to calculate the perceived brightness of a color
function getBrightness(color) {
	var match = /rgba?\((\d+), (\d+), (\d+)/.exec(color);
	if (!match) {
		return null;
	}
	var r = parseInt(match[1]);
	var g = parseInt(match[2]);
	var b = parseInt(match[3]);
	return Math.sqrt(
		r * r * .299 +
		g * g * .587 +
		b * b * .114
	);
}
