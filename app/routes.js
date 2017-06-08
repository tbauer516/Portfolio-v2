module.exports = function(app) {

	app.get('/', function(req, res) {
		res.render('views/index.html', {
			title: 'Portfolio Home Page',
			data: require("./data/index.json")
		});
	});


	app.get('*', function(req, res){
		res.status(404).render('404', {
			title: '404 | Portfolio Home Page'
		});
	});
};