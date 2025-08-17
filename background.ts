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

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url) {
      const projects = (await storage.get("projects")) || []
      const shouldShow = projects?.find?.((project) =>
        project.environments?.some((environment) =>
          new RegExp(environment.regex).test(tab.url)
        )
      )

      shouldShowMap.set(tabId, !!shouldShow)

      if (!!shouldShow) {
        // chrome.action.setBadgeBackgroundColor({ color: "#4CAF50" })
        chrome.action.setBadgeText({ text: `${shouldShow.environments.length}` })
        // chrome.action.setTitle({ title: "Dev Hopper Active" })
        // chrome.action.setBadgeTextColor({ color: "#FF0000" })
        chrome.action.setPopup({ popup })
        chrome.action.setIcon({ tabId, path: {
          "16": icon16green,
          "32": icon32green,
          "48": icon64green,
          "128": icon128green
        } })

      } else {
        chrome.action.setPopup({ popup: '' })
        chrome.action.setBadgeText({ text: '' })
        chrome.action.setIcon({ tabId, path: {
          "16": icon16blue,
          "32": icon32blue,
          "48": icon64blue,
          "128": icon128blue
        } })
      }
  }
})

chrome.action.onClicked.addListener((tab) => {
  if (!shouldShowMap.get(tab.id)) {
    chrome.runtime.openOptionsPage()
  }
})