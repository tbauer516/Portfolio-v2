const childProcess = require('child_process');
const root = './app/';
const fs = require('fs');
const utils = require('./logic/utils.js');

const indexData = {
	// data: fullData,
	dateMonthYear: utils.formatMillisToMonthYear,
	dateFull: utils.formatMillisToDate
};

const updateData = () => {
	Promise.resolve().then(() => {
		return new Promise((resolve, reject) => {
			fs.readFile('./app/data/index.json', 'utf8', (err, data) => {
				if (err) reject(err);
				resolve(JSON.parse(data));
				return;
			});
		});
	}).then(data => {
		indexData.data = data;
	}).catch(err => {
		console.log(err);
	});
};

const autodeploy = (req, res) => {
	let command = 'git pull origin master';
	
	new Promise((resolve, reject) => {
		childProcess.exec(command, (err, stdout, stderr) => {
			if (err) reject(err);
			resolve(stdout);
			return;
		});
	}).then(stdout => {
		console.log(stdout);
		updateData();
		res.redirect('/');
	});
}

updateData();

module.exports = (app) => {

	app.get('/', (req, res) => {
		res.render('views/index.njk', indexData);
	});

	app.get('/autodeploy', autodeploy);
	app.post('/autodeploy', autodeploy);

	// ============================================
	// 404 in case a path is wrong ================
	// ============================================

	app.get('/error', (req, res) => {
		res.render('views/error.njk', {
			title: 'Error',
			message: req.query.message
		});
	});

	app.get('*', (req, res) => {
		res.status(404).render('views/404.njk', {
			title: '404 | Portfolio Not Found'
		});
	});
};