export {}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url) {
    chrome.storage.sync.get("projects", (data) => {
      const projects = data.projects || []
      const shouldShow = projects.some((project) =>
        project.environments.some((environment) =>
          new RegExp(environment.regex).test(tab.url)
        )
      )

      if (shouldShow) {
        chrome.pageAction.show(tabId)
      } else {
        chrome.pageAction.hide(tabId)
      }
    })
  }
})
