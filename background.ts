import { Storage } from "@plasmohq/storage"
import icon16blue from 'url:~assets/icon16.blue.png'
import icon32blue from 'url:~assets/icon32.blue.png'
import icon64blue from 'url:~assets/icon64.blue.png'
import icon128blue from 'url:~assets/icon128.blue.png'
import icon16green from 'url:~assets/icon16.green.png'
import icon32green from 'url:~assets/icon32.green.png'
import icon64green from 'url:~assets/icon64.green.png'
import icon128green from 'url:~assets/icon128.green.png'
const popup = chrome.runtime.getURL("popup.html")

export {}

const shouldShowMap = new Map<number, boolean>()
const storage = new Storage()

const onUpdate = async (tabId, tab) => {
  if (tab.url) {
    const projects = (await storage.get("projects")) || []
    const shouldShow = projects?.find?.((project) =>
      project.environments?.some((environment) =>
        new RegExp(environment.regex).test(tab.url)
      )
    )

    shouldShowMap.set(tabId, !!shouldShow)

    if (!!shouldShow) {
      // chrome.action.setBadgeBackgroundColor({ color: "#4CAF50" })
      // chrome.action.setTitle({ title: "Dev Hopper Active" })
      // chrome.action.setBadgeTextColor({ color: "#FF0000" })
      chrome.action.setBadgeText({ tabId, text: `${shouldShow.environments.length}` })
      chrome.action.setPopup({ tabId, popup })
      chrome.action.setIcon({ tabId, path: {
        "16": icon16green,
        "32": icon32green,
        "48": icon64green,
        "128": icon128green
      } })

    } else {
      chrome.action.setPopup({ tabId, popup: '' })
      chrome.action.setBadgeText({ tabId, text: '' })
      chrome.action.setIcon({ tabId, path: {
        "16": icon16blue,
        "32": icon32blue,
        "48": icon64blue,
        "128": icon128blue
      } })
    }
  }
}

chrome.tabs.onActivated.addListener(async (activeInfo) => {
  const tab = await chrome.tabs.get(activeInfo.tabId)
  await onUpdate(tab.id, tab)
})
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete") {
    await onUpdate(tabId, tab)
  }
})

chrome.action.onClicked.addListener((tab) => {
  if (!shouldShowMap.get(tab.id)) {
    chrome.runtime.openOptionsPage()
  }
})