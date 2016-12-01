var express = require('express');
var compression = require('compression');
var app = express();

// var MongoClient = require('mongodb').MongoClient
// var assert = require('assert');

// // Connection URL
// var url = 'mongodb://localhost:27017/portfolio';

// // Use connect method to connect to the server
// MongoClient.connect(url, function(err, db) {
//   assert.equal(null, err);
//   console.log("Connected successfully to server");

//   db.close();
// });


// Server Hosting Code Below

var oneDay = 86400000;

app.use(compression());

app.use('/', express.static(__dirname + '/public', {maxAge: oneDay}));

var port = 8108;

app.listen(port, function() {
  console.log(`Application worker ${process.pid} started...`);
});