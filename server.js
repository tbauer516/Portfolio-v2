const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const compression = require('compression');
const nunjucks = require('nunjucks');
const bodyParser = require('body-parser');
const app = express();

// Server Hosting Code Below

const oneDay = 0; //86400000;
const port = process.env.PORT || 8202;

app.set('view engine', 'njk');

app.use(compression());
app.use( bodyParser.json() );
app.use( bodyParser.urlencoded({
	extended: true
}));
app.use(cookieParser());
app.use(session({
	secret: 'password',
	name: 'portfolio',
	resave: true,
	saveUninitialized: true,
	maxAge: 600000
}));

// nunjucks.configure(['app/partials', 'app/views'], {
nunjucks.configure(['app'], {
	autoescape: true,
	express: app
});

// app.use('/', express.static(__dirname + '/public', { maxAge: oneDay }));
app.use('/static', express.static(__dirname + '/app/public', { maxAge: oneDay }));

require('./app/routes.js')(app);

app.listen(port, function () {
	console.log(`Application worker ${process.pid} started...`);
});