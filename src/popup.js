angular.module('app', [])

.run(function($rootScope){

  $rootScope.options = function(){
    chrome.runtime.openOptionsPage();
  };

  chrome.tabs.getSelected(null, function(activeTab){

    $rootScope.go = function(url) {
      chrome.tabs.update(activeTab.id, { url: url });
      window.close();
    };

    chrome.storage.sync.get('projects', function(data) {

      var projects = data.projects || [];

      projects.some(function(project){

        var match;

        (project.environments || []).some(function(environment){

          if (new RegExp(environment.regex).test(activeTab.url)) {
            environment.active = true;
            match = activeTab.url.match(environment.regex);
            return true;
          }

        });

        if (!match.length) return;

        (project.environments || []).forEach(function(environment) {
          if (environment.active) return;
          environment.url = activeTab.url.replace(match[0], environment.base);
        });

        $rootScope.project = project;
        return true;

      });

      $rootScope.$apply();

    });

  });


});
