const express = require('express');
const fs = require('fs');
const compression = require('compression');
const nunjucks = require('nunjucks');
const app = express();

// Server Hosting Code Below

const oneDay = 0; //86400000;
const port = 8108;

app.set('view engine', 'njk');

app.use(compression());

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