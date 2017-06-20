const root = './app/';
const fs = require('fs');
const imgSave = require('./logic/phantomWrapper.js');
const utils = require('./logic/utils.js');
const passport = require('./logic/passport.js');
const cms = require('./logic/cms.js');

module.exports = (app) => {

	app.use(passport.initialize());
	app.use(passport.session());

	app.get('/', (req, res) => {
		cms.getIndexData(req.user)
		.then(metaData => {
			res.render('views/index.njk', metaData);
		});
	});

	app.get('/edit/:type/:id?', passport.isLoggedIn, (req, res) => {
		const type = req.params.type;
		const id = req.params.id;

		cms.getEditData(type, id)
		.then(metaData => {
			res.render('views/edit.njk', metaData);
		});
	});

	app.post('/edit/:type/:id?', passport.isLoggedIn, (req, res) => {
		const type = req.params.type;
		const id = req.params.id === 'body' ? 'body' : parseInt(req.params.id);

		cms.postEditData(type, id, req.body)
		.then(() => {
			res.redirect('/');
		});
	});

	app.get('/login', (req, res) => {
		res.redirect('/auth');
	});

	app.get('/auth', passport.auth());

	app.get('/auth/callback', passport.authCallback(), (req, res) => {
		res.redirect('/');
	});

	app.get('/logout', (req, res) => {
		req.logout();
		res.redirect('/');
	});

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