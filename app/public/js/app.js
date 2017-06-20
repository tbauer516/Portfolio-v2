// Do stuff on page load

let $sections = $('.section');
let $window = $(window);
let topHeight = 50;

let doResize = () => {
	for (let i = 0; i < $sections.length; i++) {
		$sections.eq(i).css('min-height', $window.height() - ((i !== 0 ? 2 : 1) * topHeight));
	}
}

$window.resize(() => {
	doResize();
});

$(document).ready(() => {
	doResize();
});

// =================================================
// Initialize ScrollSpy ============================
// =================================================

let lastId;
const topMenuHeight = 54;
const menuItems = $('#sidebar a, #top a.nav');
const scrollItems = menuItems.map((_, item) => {
	let hash = $(item)[0].hash;
	let elem = '#title';
	if (hash !== '')
		elem = hash;
	return $(elem);
});

// =================================================
// On In Page Link click, scroll to element ========
// =================================================

menuItems.click((event) => {
	const hash = $(event.target)[0].hash;
	let elem = $('#title');
	if (hash !== '')
		elem = $(hash);

	event.preventDefault();
	event.returnValue = false;

	$('#nav-trigger')[0].checked = false;

	$('html, body').stop().animate({
		scrollTop: '+=' + elem.offset().top
	}, 500, () => {
		elem.focus();
	});
	return false;
});

// =================================================
// On scroll, see which element is in the viewport =
// =================================================

$(window).scroll(() => {
	let cur = scrollItems.map((_, item) => {
		if (item.offset().top < topMenuHeight)
			return item;
	});
	
	cur = cur[cur.length - 1];
	const id = cur && cur.length ? cur[0].id : "";

	if (lastId !== id) {
		lastId = id;

		menuItems.removeClass("active")
			.filter('[href="#' + id + '"]').addClass('active');
	}
});


// =================================================
// Clipboard.js for copying email to their clipboard
// =================================================

const clipboard = new Clipboard($('#my-email')[0], {
	text: () => {
		return 'tbauer16@uw.edu';
	}
});
const clipboardTrigger = $('#my-email');
const clipboardTooltip = $('.tooltip');

clipboardTrigger.click((event) => {
	event.preventDefault();
	event.returnValue = false;
	return false;
});

clipboard.on('success', (e) => {
	console.log(e);
	clipboardTooltip.addClass('tooltip-active');
	setTimeout(() => {
		clipboardTooltip.removeClass('tooltip-active');
	}, 2000);
});

clipboard.on('error', (e) => {
	console.log(e);
});

// =================================================
// Unused Code =====================================
// =================================================

const getDate = (date, needDay) => {
	if (needDay == undefined) {
		needDay = true;
	}
	const monthNames = [
		'January', 'February', 'March',
		'April', 'May', 'June', 'July',
		'August', 'September', 'October',
		'November', 'December'
	];

	date = new Date(date);
	const day = '';
	if (needDay) {
		day = date.getDate() + ', ';
	}
	const monthIndex = date.getMonth();
	const year = date.getFullYear();
	return monthNames[monthIndex] + ' ' + day + year;
}