// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// Listen for any changes to the URL of any tab.
chrome.tabs.onUpdated.addListener(checkForEnvironment);

function checkForEnvironment(tabId, changeInfo, tab) {


  var servers = {
    'repo': /github.com/i,
    'io': /github.io/i
  };

  for (var server in servers) {
    if (servers[server].test(tab.url)) {
      chrome.pageAction.show(tabId);
    }
  }

}
