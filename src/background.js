chrome.webNavigation.onCompleted.addListener(pageLoaded);

function pageLoaded(details) {

  chrome.storage.sync.get('projects', function(data) {
    var projects = data.projects || [];

    projects.forEach(function(project){

      (project.environments || []).some(function(environment){

        if (new RegExp(environment.regex).test(details.url)) {
          chrome.pageAction.show(details.tabId);
          return true;
        }

      });

    });

  });

}
