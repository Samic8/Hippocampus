chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  chrome.storage.sync.get("websites", function({ websites = [] }) {
    websites.forEach(({ name, count }) => {
      if (tab.url.includes(name)) {
        chrome.tabs.executeScript(tabId, { file: "content.js" });
      }
    });
  });
});
