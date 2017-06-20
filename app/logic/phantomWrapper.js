let isWin = /^win/.test(process.platform);

let path = require('path')
let childProcess = require('child_process')
// let phantomjs = require('./phantomjs')
// let binPath = phantomjs.path
let bin = isWin ? './phantomjs.exe' : './phantomjs';
let binPath = path.join(__dirname, 'phantomjs', bin);


module.exports.saveScreenshot = (url, filename) => {
	return new Promise((resolve, reject) => {
		let childArgs = [
			path.join(__dirname, 'screenshot.js'),
			url,
			filename
		];

		childProcess.execFile(binPath, childArgs, { encoding: 'utf8' }, (err, stdout, stderr) => {
			// handle results
			if (err) reject(err);
			console.log(stdout);
			resolve();
		});
	});
}