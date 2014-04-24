var git = require('git-node');
var fs = require('fs');
var Promise = require('bluebird');

exports.createUser = function(username) {

  if(fs.existsSync('../users/' + username + '/')) {
    console.log('user already exists');
  }else {
    fs.mkdirSync('../users/' + username + '/');
    console.log('created user ', username);
  }
}

exports.initRepo = function(user, repoName) {
  var repo = git.repo('../users/' + user.name + '/' + repoName + '.git');
  var commitInfo = {
    author: { name: "Tim Caswell", email: "tim@creationix.com" },
    committer: { name: "JS-Git", email: "js-git@creationix.com" },
    commits: {
      "Initial Commit\n": {
        "README.md": "# This is a test Repo\n\nIt's generated entirely by JavaScript\n"
      },
      "Add package.json and blank module\n": {
        "README.md": "# This is a test Repo\n\nIt's generated entirely by JavaScript\n",
        "package.json": '{\n  "name": "awesome-lib",\n  "version": "3.1.3",\n  "main": "awesome.js"\n}\n',
        "awesome.js": 'module.exports = function () {\n  throw new Error("TODO: Implement Awesome");\n};\n'
      },
      "Implement awesome and bump version to 3.1.4\n": {
        "README.md": "# This is a test Repo\n\nIt's generated entirely by JavaScript\n",
        "package.json": '{\n  "name": "awesome-lib",\n  "version": "3.1.4",\n  "main": "awesome.js"\n}\n',
        "awesome.js": 'module.exports = function () {\n  return 42;\n};\n'
      }
    }
  }

  repo.setHead("master", function (err) {
    if (err) throw err;
    console.log("Git database Initialized");

    var parent;
    serialEach(commitInfo.commits, function (message, files, next) {
      // Start building a tree object.
      var tree = {};
      parallelEach(files, function (name, contents, next) {
        repo.saveAs("blob", contents, function (err, hash) {
          if (err) return next(err);
          tree[name] = {
            mode: 0100644,
            hash: hash
          };
          next();
        });
      }, function (err) {
        if (err) return next(err);
        repo.saveAs("tree", tree, function (err, hash) {
          if (err) return next(err);
          var commit = {
            tree: hash,
            parent: parent,
            author: commitInfo.author,
            committer: commitInfo.committer,
            message: message
          };
          if (!parent) delete commit.parent;
          repo.saveAs("commit", commit, function (err, hash) {
            if (err) return next(err);
            parent = hash;
            repo.updateHead(hash, next);
          });
        });
      });
    }, function (err) {
      if (err) throw err;
      console.log("Done");
    });
  });
}

// Create a filesystem backed bare repo
// var repo = git.repo("test.git");
// var mock = {
//   author: { name: "Tim Caswell", email: "tim@creationix.com" },
//   committer: { name: "JS-Git", email: "js-git@creationix.com" },
//   commits: {
//     "Initial Commit\n": {
//       "README.md": "# This is a test Repo\n\nIt's generated entirely by JavaScript\n"
//     },
//     "Add package.json and blank module\n": {
//       "README.md": "# This is a test Repo\n\nIt's generated entirely by JavaScript\n",
//       "package.json": '{\n  "name": "awesome-lib",\n  "version": "3.1.3",\n  "main": "awesome.js"\n}\n',
//       "awesome.js": 'module.exports = function () {\n  throw new Error("TODO: Implement Awesome");\n};\n'
//     },
//     "Implement awesome and bump version to 3.1.4\n": {
//       "README.md": "# This is a test Repo\n\nIt's generated entirely by JavaScript\n",
//       "package.json": '{\n  "name": "awesome-lib",\n  "version": "3.1.4",\n  "main": "awesome.js"\n}\n',
//       "awesome.js": 'module.exports = function () {\n  return 42;\n};\n'
//     }
//   }
// }

// repo.setHead("master", function (err) {
//   if (err) throw err;
//   console.log("Git database Initialized");

//   var parent;
//   serialEach(mock.commits, function (message, files, next) {
//     // Start building a tree object.
//     var tree = {};
//     parallelEach(files, function (name, contents, next) {
//       repo.saveAs("blob", contents, function (err, hash) {
//         if (err) return next(err);
//         tree[name] = {
//           mode: 0100644,
//           hash: hash
//         };
//         next();
//       });
//     }, function (err) {
//       if (err) return next(err);
//       repo.saveAs("tree", tree, function (err, hash) {
//         if (err) return next(err);
//         var commit = {
//           tree: hash,
//           parent: parent,
//           author: mock.author,
//           committer: mock.committer,
//           message: message
//         };
//         if (!parent) delete commit.parent;
//         repo.saveAs("commit", commit, function (err, hash) {
//           if (err) return next(err);
//           parent = hash;
//           repo.updateHead(hash, next);
//         });
//       });
//     });
//   }, function (err) {
//     if (err) throw err;
//     console.log("Done");
//   });

// });

// Mini control-flow library
function serialEach(object, fn, callback) {
  var keys = Object.keys(object);
  next();
  function next(err) {
    if (err) return callback(err);
    var key = keys.shift();
    if (!key) return callback();
    fn(key, object[key], next);
  }
}
function parallelEach(object, fn, callback) {
  var keys = Object.keys(object);
  var left = keys.length + 1;
  var done = false;
  keys.forEach(function (key) {
    fn(key, object[key], check);
  });
  check();
  function check(err) {
    if (done) return;
    if (err) {
      done = true;
      return callback(err);
    }
    if (--left) return;
    done = true;
    callback();
  }
}




