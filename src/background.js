// Listen for any changes to the URL of any tab.
chrome.tabs.onUpdated.addListener(pageLoaded);

function pageLoaded(tabId, changeInfo, tab) {
  if (!tab.url) {
    return;
  }

  chrome.storage.sync.get('projects', function(data) {
    const projects = data.projects || [];
    const isMatch = projects.some(project =>
      (project.environments || []).some(environment => {
        try {
          return new RegExp(environment.regex).test(tab.url);
        } catch (e) {
          // Ignore invalid regex patterns stored by the user.
          return false;
        }
      })
    );

    if (isMatch) {
      chrome.action.enable(tabId);
    } else {
      chrome.action.disable(tabId);
    }
  });
}
