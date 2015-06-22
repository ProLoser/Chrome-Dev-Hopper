angular.module('app', ['ngAnimate'])

.run(function($rootScope, $timeout) {

  chrome.storage.sync.get('projects', function(data){
    $rootScope.projects = data.projects || $rootScope.projects;

    $rootScope.$apply();
  });

  $rootScope.projects = [];

  $rootScope.newProject = function() {
    $rootScope.projects.unshift({
      environments: [{}]
    });
  };

  $rootScope.save = function() {
    chrome.storage.sync.set({ projects: angular.copy($rootScope.projects) });
    $rootScope.saved = true;
    $timeout(function(){
      $rootScope.saved = false;
    }, 2000);
  };

  $rootScope.newProject();
});
