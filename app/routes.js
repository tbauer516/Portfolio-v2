const root = './app/';
const fs = require('fs');
const utils = require('./logic/utils.js');
const autodeploy = require('./logic/autodeploy.js');

const indexData = {
	dateMonthYear: utils.formatMillisToMonthYear,
	dateFull: utils.formatMillisToDate
};

autodeploy.updateData().then(data => { indexData.data = data; });

const deploy = (req, res) => {
	autodeploy.deploy().then(data => { indexData.data = data; });
	res.end();
};

module.exports = (app) => {

	app.get('/', (req, res) => {
		res.render('views/index.njk', indexData);
	});

	app.get('/autodeploy', deploy);
	app.post('/autodeploy', deploy);

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