// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

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
