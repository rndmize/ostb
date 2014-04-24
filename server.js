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
var create = require('./server_modules/create');
// create.createUser('alejandro');
var userInfo = {
  name: 'alejandro',
  email: 'alejandro@ostb.io'
}
// create.initRepo(userInfo, 'Intro Biology');
// var read = require('./server_modules/read');
// var walk = require('./server_modules/walk');
var write = require('./server_modules/write');


app.get('/', function(req, res) {
  console.log('received request');
  res.render('index');
});

app.listen(3000);
