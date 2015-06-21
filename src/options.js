angular.module('app', [])

.run(function($rootScope) {

  chrome.storage.sync.get('projects', function(data){
    $rootScope.projects = data.projects || $rootScope.projects;

    $rootScope.$apply();
  });

  $rootScope.projects = [];

  $rootScope.newProject = function() {
    $rootScope.projects.push({
      environments: [{}]
    });
  };

  $rootScope.save = function(project) {
    chrome.storage.sync.set({ projects: angular.copy($rootScope.projects) });
  };

  $rootScope.newProject();
});
