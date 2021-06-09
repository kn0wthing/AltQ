let tabs = [];
const maxTabsNumber = 11;
const initializedTabs = {};
const windowTabMapping = {};

//windowTabMapping object
// windowid:{tabs:[],initializedTabs:{}}

export function addToInitialized(tab, windowId) {
  windowTabMapping[windowId].initializedTabs[tab.id] = tab;
}

export function removeFromInitialized(tabId, windowId) {
  delete windowTabMapping[windowId].initializedTabs[tabId];
}

export function push(current, windowId) {
  windowTabMapping[windowId].tabs = windowTabMapping[windowId].tabs.filter(
    ({ id }) => id !== current.id
  );
  windowTabMapping[windowId].tabs.unshift(current);
  windowTabMapping[windowId].tabs = windowTabMapping[windowId].tabs.slice(
    0,
    maxTabsNumber - 1
  );
}
export function pushAtEnd(current, windowId) {
  windowTabMapping[windowId].tabs = windowTabMapping[windowId].tabs.filter(
    ({ id }) => id !== current.id
  );
  windowTabMapping[windowId].tabs.push(current);
  windowTabMapping[windowId].tabs = windowTabMapping[windowId].tabs.slice(
    0,
    maxTabsNumber - 1
  );
}
export function insert(current, windowId,index) {
  windowTabMapping[windowId].tabs = windowTabMapping[windowId].tabs.filter(
    ({ id }) => id !== current.id
  );
  windowTabMapping[windowId].tabs.splice(index,0,current);
  windowTabMapping[windowId].tabs = windowTabMapping[windowId].tabs.slice(
    0,
    maxTabsNumber - 1
  );
}

export function remove(tabId, windowId) {
  windowTabMapping[windowId].tabs = windowTabMapping[windowId].tabs.filter(
    ({ id }) => id !== tabId
  );
  removeFromInitialized(tabId, windowId);
}

export function update(tabToUpdate, windowId) {
  windowTabMapping[windowId].tabs = windowTabMapping[windowId].tabs.map((t) => {
    if (t.id === tabToUpdate.id) {
      return tabToUpdate;
    }
    return t;
  });
}

export function init(initialTabs = [], windowId) {
  windowTabMapping[windowId].tabs = initialTabs;
}

export function getTabs(windowId) {
  return windowTabMapping[windowId].tabs.slice();
}

export function isInitialized(tab, windowId) {
  return windowTabMapping[windowId].initializedTabs[tab.id];
}

export function addWindowToMapping(windowId) {
  windowTabMapping[windowId] = { tabs: [], initializedTabs: {} };
}

export function removeWindowToMapping(windowId) {
  delete windowTabMapping[windowId];
}
export function getMapping() {
  return windowTabMapping;
}

export function changeTabTitle(tabId,windowId,newTitle) {
  windowTabMapping[windowId].tabs.filter((tab)=>{
    if(tab.id === tabId){
      tab.title = newTitle;
    }
  });
}

// ///////////////////////////////////////////////////////////////////////////////////////
// stable code
// ///////////////////////////////////////////////////////////////////////////////////////
/*
let tabs = [];
const maxTabsNumber = 11;
const initializedTabs = {};

export function addToInitialized(tab) {
  initializedTabs[tab.id] = tab;
}

export function removeFromInitialized(tabId) {
  delete initializedTabs[tabId];
}

export function push(current) {
  tabs = tabs.filter(({ id }) => id !== current.id);
  tabs.unshift(current);
  tabs = tabs.slice(0, maxTabsNumber - 1);
}

export function remove(tabId) {
  tabs = tabs.filter(({ id }) => id !== tabId);
  removeFromInitialized(tabId);
}

export function update(tabToUpdate) {
  tabs = tabs.map((t) => {
    if (t.id === tabToUpdate.id) {
      return tabToUpdate;
    }
    return t;
  });
}

export function init(initialTabs = []) {
  tabs = initialTabs;
}

export function getTabs() {
  return tabs.slice();
}

export function isInitialized(tab) {
  return initializedTabs[tab.id];
}
*/
