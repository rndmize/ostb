var mocha = require('mocha');
var should = require('should');
var fs = require('fs');
var Promise = require('bluebird');
var port = 3000;
var express = require('express');
var shell = require('../server_modules/shell_commands');

var app;
var origHash;

describe('repo & user testing', function() {

  before(function() {
    app = express();
    app.listen(3000);
  });

  after(function(done) {
    shell.deleteRepo('alejandroTest', 'test_repo')
    .then(function() {
      return shell.deleteRepo('alejandroTest', 'test repo')
    })
    .then(function(stdout) {
      return shell.deleteUser('alejandroTest');
    })
    .then(function() {
      done();
    })
    .catch(function(err){
      console.log(err);
    });
  })

  it('should create a user directory', function(done) {
    var newUser = Promise.promisify(shell.createUser);
    newUser('alejandroTEST')
    .then(function(stdout) {
      (fs.existsSync('/Users/ethoreby/users/alejandroTest')).should.equal(true);
      done();
    })
    .catch(function(err){
      console.log(err);
    })
  });

  it('should initialize a repo', function(done) {
    var newRepo = Promise.promisify(shell.init);
    newRepo('alejandroTest', 'test_repo')
    .then(function() {
      (fs.existsSync('/Users/ethoreby/users/alejandroTest/test_repo')).should.equal(true);
      done();
    })
    .catch(function(err){
      console.log(err);
    })
  });

  it('should create an initial commit', function(done) {
    shell.getCommitHash('alejandroTest', 'test_repo')
    .then(function(hash) {
      (hash.length > 0).should.equal(true);
      done();
    })
    .catch(function(err){
      console.log(err);
    })
  });

  it('should commit file changes', function(done) {
    fs.writeFileSync('/Users/ethoreby/users/alejandroTest/test_repo/p1.txt', 'Changes to the file.');
    var cmt = Promise.promisify(shell.commit);
    cmt('alejandroTest', 'test_repo', 'second commit')
    .then(function(hash) {
      (hash.length > 0).should.equal(true);
      done();
    })
    .catch(function(err){
      console.log(err);
    })
  });

  it('should sanitize white space in inputs', function(done) {
    var newRepo = Promise.promisify(shell.init);
    newRepo('alejandroTest', ' test repo ')
    .then(function() {
      (fs.existsSync('/Users/ethoreby/users/alejandroTest/test\ repo')).should.equal(true);
      done();
    })
    .catch(function(err){
      console.log(err);
    })
  });

  it('should throw an error for inputs with illegal characters', function(done) {
    var newRepo = Promise.promisify(shell.init);
    newRepo('alejandroTest', 'test repo !!!OMG!?@$!')
    .then(function() {
      (true).should.equal(false);     //should not execute .then
      done();
    })
    .catch(function(err){
      (typeof err).should.not.equal('undefined');
      done();
    })
  });
});



