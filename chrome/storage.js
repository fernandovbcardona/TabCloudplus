var StorageCache = (function () {
    var cache = {};
    var ready = new Promise(function (resolve) {
        chrome.storage.local.get(null, function (items) {
            cache = items || {};
            resolve();
        });
    });

    return {
        ready: ready,
        get: function (key) {
            return cache[key];
        },
        set: function (key, value) {
            cache[key] = value;
            var toSave = {};
            toSave[key] = value;
            chrome.storage.local.set(toSave);
        }
    };
})();

// Storage: for JSON object values (trackedWindows, tempWindowNames), always
// returns an object so callers can index into it without extra checks.
self.Storage = (function () {
    return {
        ready: StorageCache.ready,
        get: function (key) {
            var result = StorageCache.get(key);
            result = result || {};
            console.log('data get: ' + key, result);
            return result;
        },
        set: function (key, value) {
            console.log('data set: ' + key, value, JSON.stringify(value));
            StorageCache.set(key, value);
        }
    };
})();

// Settings: for simple scalar preferences (openin, deleteconfirm, ...),
// which need an explicit default instead of an empty object.
self.Settings = (function () {
    return {
        ready: StorageCache.ready,
        get: function (key, defaultValue) {
            var result = StorageCache.get(key);
            return result === undefined ? defaultValue : result;
        },
        set: function (key, value) {
            StorageCache.set(key, value);
        }
    };
})();
