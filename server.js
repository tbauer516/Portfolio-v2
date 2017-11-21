const express = require('express');
const compression = require('compression');
const nunjucks = require('nunjucks');
const bodyParser = require('body-parser');
const app = express();

// Server Hosting Code Below

const oneDay = 0; //86400000;
const port = process.env.PORT || 8108;

app.set('view engine', 'njk');

app.use(compression());
app.use( bodyParser.json() );
app.use( bodyParser.urlencoded({
	extended: true
}));

nunjucks.configure(['app'], {
	autoescape: true,
	express: app
});

app.use('/static', express.static(__dirname + '/app/public', { maxAge: oneDay }));

require('./app/routes.js')(app);

app.listen(port, function () {
	console.log(`Application running on port ${port}`);
});