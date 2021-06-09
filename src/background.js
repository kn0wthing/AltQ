import browser from "webextension-polyfill";
import * as mruUtils from "./mruUtils";

async function addCurrentTabToRegistry() {
  const [currentTab] = await browser.tabs.query({
    active: true,
    currentWindow: true,
  });
  // the tab can be instantly closed and therefore currentTab can be null
  if (currentTab) {
    chrome.windows.getAll({ populate: true }, function (windows) {
      windows.forEach(function (window) {
        if (window.focused === true) {
          mruUtils.push(currentTab, window.id);
        }
      });
    });
  }
}
chrome.windows.getAll({ populate: true }, function (windows) {
  windows.forEach(function (window) {
    if (window.focused === true) {
      mruUtils.addWindowToMapping(window.id);
      window.tabs.forEach(function (tab) {
        mruUtils.push(tab, window.id);
      });
    }
  });
});
// initialize registry with currently active tab
addCurrentTabToRegistry();

function isSpecialTab(currentTab) {
  return /^(chrome:|view-source:|https?:\/\/chrome.google.com)/.test(currentTab.url);
}

async function handleCommand(command) {

  const [currentTab] = await browser.tabs.query({
    active: true,
    currentWindow: true,
  });
  if (!currentTab) return;
  // handle special chrome tabs separately because they do not allow script executions
  if (isSpecialTab(currentTab)) {
    chrome.windows.getAll({ populate: true }, function (windows) {
      windows.forEach(function (window) {
        if (window.focused === true) {
          const previousTab = mruUtils.getTabs(window.id)[1];
          if (previousTab) {
            browser.tabs.update(previousTab.id, { active: true });
          } 
        }
      });
    });

    return;
  }

  // initialize content script
  chrome.windows.getAll({ populate: true }, function (windows) {
    windows.forEach(function (window) {
      if (window.focused === true) {
        if (!mruUtils.isInitialized(currentTab, window.id)) {
          browser.tabs.executeScript(currentTab.id, { file: "content.js" });
          mruUtils.addToInitialized(currentTab, window.id);
        }
      }
    });
  });

  // send the command to the content script
  chrome.windows.getAll({ populate: true }, function (windows) {
    windows.forEach(function (window) {
      if (window.focused === true) {
        browser.tabs.sendMessage(currentTab.id, {
          type: command,
          tabsData: mruUtils.getTabs(window.id),
        });
      }
    });
  });
}
// browser.windows.onFocusChanged.addListener(()=>{
//   mruUtils.init();
//   chrome.windows.getAll({ populate: true }, function (windows) {
//     windows.forEach(function (window) {
//       if (window.focused === true) {
//         window.tabs.forEach(function (tab) {
//           mruUtils.push(tab);
//         });
//       }
//     });
//   });
// });

chrome.windows.onRemoved.addListener((windowId) => {
  mruUtils.removeWindowToMapping(windowId);
});

chrome.windows.onCreated.addListener(() => {
  chrome.windows.getAll({ populate: true }, function (windows) {
    windows.forEach(function (window) {
      if (window.focused === true) {
        mruUtils.addWindowToMapping(window.id);
        window.tabs.forEach(function (tab) {
          mruUtils.push(tab, window.id);
        });
      }
    });
  });
  addCurrentTabToRegistry();
});

browser.commands.onCommand.addListener(handleCommand);

browser.tabs.onActivated.addListener(addCurrentTabToRegistry);

chrome.tabs.onCreated.addListener((tab) => {
  chrome.windows.getAll({ populate: true }, function (windows) {
    windows.forEach(function (window) {
      if (window.focused === true) {
          mruUtils.insert(tab, window.id,1);
      }
    });
  });
});

browser.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete") {
    chrome.windows.getAll({ populate: true }, function (windows) {
      windows.forEach(function (window) {
        if (
          window.focused === true &&
          Object.keys(mruUtils.getMapping()).length !== 0
        ) {
          mruUtils.removeFromInitialized(tabId, window.id);
          if (tab.url.includes("https://www.youtube.com")) {
            setTimeout(() => {
              chrome.tabs.get(tabId, (tab) => {
                mruUtils.update(tab, window.id);
              });
            }, 1000);
          } else {
            mruUtils.update(tab, window.id);
          }
        }
      });
    });
  }
});

browser.tabs.onRemoved.addListener(async (tabId) => {
  chrome.windows.getAll({ populate: true }, function (windows) {
    windows.forEach(function (window) {
      if (window.focused === true) {
        mruUtils.remove(tabId, window.id);
        let tabss = mruUtils.getTabs(window.id);
        const currentTab = tabss[0];
        if (currentTab) {
          browser.tabs.update(currentTab.id, { active: true });
          if (tabss.length < 10 && window.tabs.length > 9) {
            window.tabs.forEach(function loop(tab) {
              if (loop.stop) {
                return;
              }
              let flag = false;
              for (let i = 0; i < tabss.length; i++) {
                if (tabss[i].id === tab.id) flag = true;
              }
              if (!flag) {
                mruUtils.pushAtEnd(tab, window.id);
                loop.stop = true;
              }
            });
          }
        }
      }
    });
  });
});

// function isAllowedUrl(url) {
//   return url !== 'about:blank' && !url.startsWith('chrome:');
// }

browser.runtime.onConnect.addListener((port) => {
  if (port.name === "content script") {
    port.onMessage.addListener(async ({ selectedTab }) => {
      await browser.tabs.update(selectedTab.id, { active: true });
    });
  }
});
