angular.module('factories.projects', [])

.factory('ProjectsFactory', function($http, $q) {

  return {
    create: function(project) {

      project.reponame = project.repo;
      project.repo = project.repo.trim().replace(/\s/g, '_');

      var dfd = $q.defer();
      $http.post('/api/projects', project)
      .success(function(data, status, headers, config) {
        dfd.resolve();
      })
      .error(function(data, status, headers, config) {
        console.log('arguments',arguments);
        dfd.reject(data);
      });
      return dfd.promise;
    },

    delete: function(project) {
      var dfd = $q.defer();
      $http.delete('/api/projects?username=' + project.username + '&repo=' + project.repo)
      .success(function(data, status, headers, config) {
        dfd.resolve();
      })
      .error(function(data, status, headers, config) {
        console.log('fail', arguments);
        dfd.reject(data);
      });
      return dfd.promise;
    },

    clone: function(project) {
      var dfd = $q.defer();
      $http.post('/api/projects/clone', project)
      .success(function(data, status, headers, config) {
        dfd.resolve();
      })
      .error(function(data, status, headers, config) {
        console.log('fail', arguments);
        dfd.reject(data);
      });
      return dfd.promise;
    },

    commit: function(project) {
      var dfd = $q.defer();
      $http.post('/api/projects/commit', project)
      .success(function(data, status, headers, config) {
        dfd.resolve();
      })
      .error(function(data, status, headers, config) {
        console.log('fail', arguments);
        dfd.reject(data);
      });
      return dfd.promise;
    },

    removeContribution: function(project) {
      var dfd = $q.defer();
      $http.delete('/api/projects/commit?username=' + project.username + '&repo=' + project.repo + '&commitHash=' + project.commitHash)
      .success(function(data, status, headers, config) {
        dfd.resolve();
      })
      .error(function(data, status, headers, config) {
        console.log('fail', arguments);
        dfd.reject(data);
      });
      return dfd.promise;
    },

    getVersions: function(project) {
      var dfd = $q.defer();
      $http.get('/api/projects/commit?username=' + project.username + '&repo=' + project.repo)
      .success(function(data, status, headers, config) {
        dfd.resolve(data);
      })
      .error(function(data, status, headers, config) {
        dfd.reject(data);
      });
      return dfd.promise;
    },

    addMember: function(project) {
      var dfd = $q.defer();
      $http.post('/api/projects/member', project)
      .success(function(data, status, headers, config) {
        dfd.resolve(data);
      })
      .error(function(data, status, headers, config) {
        dfd.reject(data);
      });
      return dfd.promise;
    },

    deleteMember: function(project) {
      var dfd = $q.defer();
      $http.delete('/api/projects/member?username=' + project.username + '&repo=' + project.repo + '&member=' + project.member)
      .success(function(data, status, headers, config) {
        dfd.resolve(data);
      })
      .error(function(data, status, headers, config) {
        dfd.reject(data);
      });
      return dfd.promise;
    },

    getMembers: function(project) {
      var dfd = $q.defer();
      $http.get('/api/projects/member?username=' + project.username + '&repo=' + project.repo)
      .success(function(data, status, headers, config) {
        dfd.resolve(data);
      })
      .error(function(data, status, headers, config) {
        dfd.reject(data);
      });
      return dfd.promise;
    },

    getProjects: function(project) {
      var dfd = $q.defer();
      var queryString = '/api/projects?'
      if(project){
        if(project.username) {
          queryString += 'username=' + project.username;
        }else if(project.id){
          queryString += 'id=' + project.id;
        }
        if(project.repo) {
          queryString += '&repo=' + project.repo
        }
      }

      $http.get(queryString)
      .success(function(data, status, headers, config) {
        dfd.resolve(data);
      })
      .error(function(data, status, headers, config) {
        dfd.reject(data);
      });
      return dfd.promise;
    },

    checkout: function(project) {

      var dfd = $q.defer();
      var queryString = '/api/projects/checkout?'
      if(project.username) {
        queryString += 'username=' + project.username;
      }else if(project.id){
        queryString += 'id=' + project.id;
      }
      if(project.repo) {
        queryString += '&repo=' + project.repo
      }
      if(project.commitHash) {
        queryString += '&commitHash=' + project.commitHash
      }

      $http.get(queryString)
      .success(function(data, status, headers, config) {
        dfd.resolve(data);
      })
      .error(function(data, status, headers, config) {
        dfd.reject(data);
      });
      return dfd.promise;
    },

    getFolder: function(project) {
      var dfd = $q.defer();
      var queryString = '/api/projects/download?'
      if(project.username) {
        queryString += 'username=' + project.username;
      }else if(project.id){
        queryString += 'id=' + project.id;
      }
      if(project.repo) {
        queryString += '&repo=' + project.repo
      }

      $http.get(queryString)
      .success(function(data, status, headers, config) {
        dfd.resolve(data);
      })
      .error(function(data, status, headers, config) {
        dfd.reject(data);
      });
      return dfd.promise;
    }
  }
});

