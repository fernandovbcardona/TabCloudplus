// SyncStore: saved windows shared across the devices signed into the same
// Chrome profile, via chrome.storage.sync. No server involved.
//
// chrome.storage.sync has hard quotas (QUOTA_BYTES ~100KB total,
// QUOTA_BYTES_PER_ITEM ~8KB per key, MAX_ITEMS ~512 keys), so each window is
// kept in its own key (tc_win_<id>) instead of one big blob, with a small
// index key (tc_index) holding the ordered list of ids.
//
// The public API mirrors the old server's behaviour (positional, newest
// window inserted at index 0) so callers can treat it as a drop-in
// replacement for the old $.post/$.get calls.
var SyncStore = (function () {
    var INDEX_KEY = 'tc_index';
    var WIN_PREFIX = 'tc_win_';
    var MAX_ITEM_BYTES = 7800; // leave headroom under chrome's 8192 cap

    var index = [];
    var windows = {};

    var ready = chrome.storage.sync.get(null).then(function (items) {
        index = items[INDEX_KEY] || [];
        index.forEach(function (id) {
            if (items[WIN_PREFIX + id] !== undefined) {
                try {
                    windows[id] = JSON.parse(items[WIN_PREFIX + id]);
                } catch (e) {
                    // corrupt entry, drop it
                }
            }
        });
        // drop any ids whose window data went missing
        index = index.filter(function (id) { return windows[id] !== undefined; });
    });

    function makeId() {
        return Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8);
    }

    function saveIndex() {
        var toSave = {};
        toSave[INDEX_KEY] = index;
        return chrome.storage.sync.set(toSave);
    }

    function saveWindow(id, data) {
        var json = JSON.stringify(data);
        if (json.length > MAX_ITEM_BYTES) {
            return Promise.reject(new Error('window_too_large'));
        }
        var toSave = {};
        toSave[WIN_PREFIX + id] = json;
        windows[id] = data;
        return chrome.storage.sync.set(toSave);
    }

    return {
        ready: ready,

        list: function () {
            return index.map(function (id) {
                return windows[id];
            });
        },

        // Adds a new window at the front, matching the old server's
        // Vector.add(0, ...) behaviour. Returns the new index (always 0).
        addFront: function (data) {
            var id = makeId();
            return saveWindow(id, data).then(function () {
                index.unshift(id);
                return saveIndex();
            }).then(function () {
                return 0;
            });
        },

        updateAt: function (pos, data) {
            var id = index[pos];
            if (id === undefined) {
                return Promise.reject(new Error('window_not_found'));
            }
            return saveWindow(id, data);
        },

        removeAt: function (pos) {
            var id = index[pos];
            if (id === undefined) {
                return Promise.resolve();
            }
            index.splice(pos, 1);
            delete windows[id];
            return chrome.storage.sync.remove(WIN_PREFIX + id).then(saveIndex);
        },

        moveAt: function (oldPos, newPos) {
            var id = index.splice(oldPos, 1)[0];
            if (id === undefined) {
                return Promise.resolve();
            }
            index.splice(newPos, 0, id);
            return saveIndex();
        }
    };
})();

self.SyncStore = SyncStore;
