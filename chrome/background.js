importScripts('storage.js');

chrome.runtime.onInstalled.addListener(function () {
    Settings.ready.then(function () {
        if (Settings.get('openin', undefined) === undefined)
            Settings.set('openin', 'window');
        if (Settings.get('deleteconfirm', undefined) === undefined)
            Settings.set('deleteconfirm', 'yes');
        if (Settings.get('encryption', undefined) === undefined)
            Settings.set('encryption', 'no');
    });
});

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.method !== "open_saved_window") {
            return false;
        }

        (async function () {
            await Storage.ready;

            var trackedWindows = Storage.get('trackedWindows');
            var tempWindowNames = Storage.get('tempWindowNames');
            var openin = Settings.get('openin', 'window');

            if (openin === 'window') {
                var onWindowCreated = function (window) {
                    chrome.tabs.query({windowId: window.id}, function (tabs) {
                        chrome.tabs.remove(tabs[0].id);
                    });
                    request.tabs.forEach(function (tab) {
                        var curTab = {windowId: window.id,
                            url: tab.url,
                            //selected: false,
                            active:false
                        };
                        if (Settings.get('supportPinned', 0) == 1 && tab.pinned) {
                            curTab.pinned = true;
                        }
                        chrome.tabs.create(curTab);
                    });
                    /* update tracked windows */
                    trackedWindows[window.id] = request.windowId;
                    /* update window name */
                    tempWindowNames['winl'+window.id] = request.windowName;

                    Storage.set('trackedWindows', trackedWindows);
                    Storage.set('tempWindowNames', tempWindowNames);

                    /* send response with this newly created local window Id */
                    //sendResponse({localWindowId: window.id});
                };
                if(typeof browser !== "undefined") {
                    browser.windows.create({}, onWindowCreated);
                } else {
                    chrome.windows.create({focused: false}, onWindowCreated);
                }
            } else if (openin === 'tab') {
                request.tabs.forEach(function (tab) {
                    chrome.tabs.create({url: tab.url});
                });
            }
        })();

        return true;
    }
);
