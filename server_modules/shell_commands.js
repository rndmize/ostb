var sys = require('sys')
var exec = require('child_process').exec;
var fs = require('fs');
var Promise = require('bluebird');
var execute = Promise.promisify(exec);

exports.createUser = function(username) {
  return execute('mkdir ~/users/' + username);
}

exports.init = function(username, repo) {
  return execute('git init ~/users/' + username + '/' + repo);
}

exports.commit = function(username, repo, commitMessage) {
  exec('cd ~/users/' + username + '/' + repo + ' && ' + 'git add --all' + ' && ' + 'git commit -m "' + commitMessage +'"', function (error, stdout, stderr) {
    sys.print('stdout: ' + stdout);
  });
}

exports.log = function(username, repo) {
  exec('cd ~/users/' + username + '/' + repo + ' && ' + 'git log', function (error, stdout, stderr) {
    sys.print('stdout: ' + stdout + stderr);
  });
}

exports.deleteRepo = function(username, repo) {
  return execute('rm -rf  ~/users/' + username + '/' + repo);
}