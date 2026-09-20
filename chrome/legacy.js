// LegacyImport: talks to the old chrometabcloud.appspot.com account, only
// on demand (never automatically), and copies its windows into SyncStore.
// Shared by popup.js (onboarding banner) and options.js (Options page).
var LegacyImport = (function () {
    var ORIGIN_PATTERN = 'https://chrometabcloud.appspot.com/*';
    var TABCLOUD_URL = 'https://chrometabcloud.appspot.com/tabcloud';
    var LOGIN_URL = 'https://chrometabcloud.appspot.com/login';

    function requestPermission() {
        return new Promise(function (resolve) {
            chrome.permissions.request({ origins: [ORIGIN_PATTERN] }, function (granted) {
                resolve(!!granted);
            });
        });
    }

    // Resolves with { status: 'loggedin', windows: [...] } or { status: 'loggedout' }
    // or { status: 'error' } if the old server couldn't be reached.
    function fetchLegacyWindows() {
        return fetch(TABCLOUD_URL, { credentials: 'include' })
            .then(function (res) { return res.json(); })
            .catch(function () { return { status: 'error' }; });
    }

    // Copies every window into SyncStore, front-inserting in reverse so the
    // final order matches the original list. Returns { imported, skipped }.
    async function importAll(windows) {
        await SyncStore.ready;
        var imported = 0, skipped = 0;
        for (var i = windows.length - 1; i >= 0; i--) {
            try {
                await SyncStore.addFront(windows[i]);
                imported++;
            } catch (e) {
                skipped++;
            }
        }
        return { imported: imported, skipped: skipped };
    }

    return {
        LOGIN_URL: LOGIN_URL,
        requestPermission: requestPermission,
        fetchLegacyWindows: fetchLegacyWindows,
        importAll: importAll
    };
})();

self.LegacyImport = LegacyImport;
