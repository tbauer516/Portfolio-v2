"use strict";
var page = require('webpage').create();
var system = require('system');
var address, output;
var pageWidth = 1280;
var pageHeight = 720;
console.log('render');
if (system.args.length !== 3) {
	console.log('Usage: rasterize.js URL filename');
	phantom.exit(1);
} else {
	address = system.args[1];
	output = system.args[2];
	output = 'app/public/img/' + output;
	page.viewportSize = { width: pageWidth, height: pageHeight };
	page.clipRect = { top: 0, left: 0, width: pageWidth, height: pageHeight };
	page.open(address, function (status) {
		if (status !== 'success') {
			console.log('Unable to load the address!');
			phantom.exit(1);
		} else {
			window.setTimeout(function () {
				console.log('Saved to :' + output);
				page.render(output);
				phantom.exit();
			}, 5000);
		}
	});
}