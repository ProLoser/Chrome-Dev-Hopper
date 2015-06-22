// Listen for any changes to the URL of any tab.
chrome.tabs.onUpdated.addListener(pageLoaded);

function pageLoaded(tabId, changeInfo, tab) {

  chrome.storage.sync.get('projects', function(data) {
    var projects = data.projects || [];

    projects.forEach(function(project){

      (project.environments || []).some(function(environment){

        if (new RegExp(environment.regex).test(tab.url)) {
          chrome.pageAction.show(tabId);
          return true;
        }

      });

    });

  });

}
