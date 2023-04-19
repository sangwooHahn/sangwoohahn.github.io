var logoImage = document.getElementById('porfolioLogo');
var aboutText = document.getElementById('about_button');
var contactText = document.getElementById('contact_button');

function onScroll() {
	// Get the top visible element on the screen
	var element_left = document.elementFromPoint(
		40, 51
	);
	var element_right = document.elementFromPoint(
		window.innerWidth - 40, 51
	);

	if(window.innerWidth < 599) {
		element_left = document.elementFromPoint(1, 51);
		element_right = document.elementFromPoint(window.innerWidth - 1, 51);
	}

	var bgColor_left = window.getComputedStyle(element_left).backgroundColor;// Get the background color of the element
	var bgColor_right = window.getComputedStyle(element_right).backgroundColor;// Get the background color of the element


	// Set the font color based on the brightness
	if (getBrightness(bgColor_left) == 0 || getBrightness(bgColor_left) > 230) { //full white all 0 for the no bg color. it means white or no bg set (white)
		logoImage.src = 'images/all/portfolio_logo_black.png';
	} else {
		logoImage.src = 'images/all/portfolio_logo_white.png';
	}

	if (getBrightness(bgColor_right) == 0 || getBrightness(bgColor_right) > 230) { //full white all 0 for the no bg color. it means white or no bg set (white)
		aboutText.style.color = '#353535';
		contactText.style.color = '#353535';
		aboutText.style.background = 'linear-gradient(to right, rgb(53, 53, 53) 50%, rgba(0, 0, 0, 0) 50%) left bottom / 0% 2px no-repeat';
		contactText.style.background = 'linear-gradient(to right, rgb(53, 53, 53) 50%, rgba(0, 0, 0, 0) 50%) left bottom / 0% 2px no-repeat';

	} else {
		aboutText.style.color = '#fafafa';
		contactText.style.color = '#fafafa';
		aboutText.style.background = 'linear-gradient(to right, rgb(250, 250, 250) 50%, rgba(0, 0, 0, 0) 50%) left bottom / 0% 2px no-repeat';
		contactText.style.background = 'linear-gradient(to right, rgb(250, 250, 250) 50%, rgba(0, 0, 0, 0) 50%) left bottom / 0% 2px no-repeat';
	}

}

// Add event listeners for mouseover and mouseout
aboutText.addEventListener('mouseover', function() {
	aboutText.style.backgroundSize = '200% 2px';
});

aboutText.addEventListener('mouseout', function() {
	aboutText.style.backgroundSize = '0% 2px';
});

contactText.addEventListener('mouseover', function() {
	contactText.style.backgroundSize = '200% 2px';
});

contactText.addEventListener('mouseout', function() {
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
