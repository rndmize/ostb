var express = require('express');
var share   = require('share');
var Promise = require('bluebird');
var git = require('git-node');

var app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
// app.use(express.static(__dirname + '/views'));

var options = {
  db: {type: 'none'},
  browserChannel: {cors: '*'},
  // auth: function(client, action) {}
}
share.server.attach(app, options);

// var example = require('git-node/examples/create');
// var example = require('git-node/examples/read');
var files = require('./server/create');
// files.createUser('alejandro');
var userInfo = {
  name: 'alejandro',
  email: 'alejandro@ostb.io'
}
files.initRepo(userInfo, 'Intro Biology');


app.get('/', function(req, res) {
  console.log('received request');
  res.render('index');
});

app.listen(3000);
