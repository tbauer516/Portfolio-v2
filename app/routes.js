module.exports = function(app) {

	app.get('/', function(req, res) {
		res.render('index', {
			title: 'Portfolio Home Page'
		});
	});


	app.get('*', function(req, res){
		res.status(404).render('404', {
			title: '404 | Portfolio Home Page'
		});
	});
};