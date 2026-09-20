// SyncStore: saved windows shared across the devices signed into the same
// Chrome profile, via chrome.storage.sync. No server involved.
//
// chrome.storage.sync has hard quotas (QUOTA_BYTES ~100KB total,
// QUOTA_BYTES_PER_ITEM ~8KB per key, MAX_ITEMS ~512 keys). A single window
// can still be a few KB (many tabs), so each window's JSON is split into
// same-sized string chunks and stored as tc_win_<id>__0, __1, ... (a
// single-chunk window keeps the old, unsuffixed tc_win_<id> key so existing
// saves from before chunking existed keep working). A small index key
// (tc_index) holds the ordered list of {id, parts}.
//
// The public API mirrors the old server's behaviour (positional, newest
// window inserted at index 0) so callers can treat it as a drop-in
// replacement for the old $.post/$.get calls.
var SyncStore = (function () {
    var INDEX_KEY = 'tc_index';
    var WIN_PREFIX = 'tc_win_';
    // Conservative character budget per chunk. chrome.storage counts the
    // *encoded* (JSON.stringify'd) size of the value, and a chunk is itself
    // already-JSON text, so re-encoding it escapes every quote/backslash -
    // this stays comfortably under the ~8192 byte cap even with heavy
    // escaping or multi-byte titles.
    var CHUNK_SIZE = 4000;
    // Sanity cap so one runaway window can't eat the whole sync budget.
    var MAX_CHUNKS = 15;

    var index = []; // [{ id, parts }]
    var windows = {}; // id -> parsed window data

    function chunkKeys(id, parts) {
        if (parts <= 1) {
            return [WIN_PREFIX + id];
        }
        var keys = [];
        for (var i = 0; i < parts; i++) {
            keys.push(WIN_PREFIX + id + '__' + i);
        }
        return keys;
    }

    function chunkString(str) {
        var chunks = [];
        for (var i = 0; i < str.length; i += CHUNK_SIZE) {
            chunks.push(str.slice(i, i + CHUNK_SIZE));
        }
        return chunks.length ? chunks : [''];
    }

    var ready = chrome.storage.sync.get(null).then(function (items) {
        var rawIndex = items[INDEX_KEY] || [];
        index = rawIndex.map(function (entry) {
            // Entries saved before chunking existed were plain id strings.
            return (typeof entry === 'string') ? { id: entry, parts: 1 } : entry;
        }).filter(function (entry) {
            var pieces = chunkKeys(entry.id, entry.parts).map(function (k) { return items[k]; });
            if (pieces.some(function (p) { return p === undefined; })) {
                return false;
            }
            try {
                windows[entry.id] = JSON.parse(pieces.join(''));
                return true;
            } catch (e) {
                return false;
            }
        });
    });

    function makeId() {
        return Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8);
    }

    function saveIndex() {
        var toSave = {};
        toSave[INDEX_KEY] = index;
        return chrome.storage.sync.set(toSave);
    }

    // Writes a window's data, splitting into chunks if needed, and removes
    // any now-unused chunk keys left over from a previous (larger) save.
    // Resolves with the number of chunks used.
    function writeWindow(id, data, oldParts) {
        var pieces = chunkString(JSON.stringify(data));
        if (pieces.length > MAX_CHUNKS) {
            return Promise.reject(new Error('window_too_large'));
        }

        var newKeys = chunkKeys(id, pieces.length);
        var toSave = {};
        newKeys.forEach(function (key, i) {
            toSave[key] = pieces[i];
        });

        var toRemove = [];
        if (oldParts) {
            chunkKeys(id, oldParts).forEach(function (key) {
                if (newKeys.indexOf(key) === -1) {
                    toRemove.push(key);
                }
            });
        }

        windows[id] = data;
        return chrome.storage.sync.set(toSave).then(function () {
            return toRemove.length ? chrome.storage.sync.remove(toRemove) : undefined;
        }).then(function () {
            return pieces.length;
        });
    }

    return {
        ready: ready,

        list: function () {
            return index.map(function (entry) {
                return windows[entry.id];
            });
        },

        // Adds a new window at the front, matching the old server's
        // Vector.add(0, ...) behaviour. Returns the new index (always 0).
        addFront: function (data) {
            var id = makeId();
            return writeWindow(id, data, 0).then(function (parts) {
                index.unshift({ id: id, parts: parts });
                return saveIndex();
            }).then(function () {
                return 0;
            });
        },

        updateAt: function (pos, data) {
            var entry = index[pos];
            if (entry === undefined) {
                return Promise.reject(new Error('window_not_found'));
            }
            return writeWindow(entry.id, data, entry.parts).then(function (parts) {
                entry.parts = parts;
                return saveIndex();
            });
        },

        removeAt: function (pos) {
            var entry = index[pos];
            if (entry === undefined) {
                return Promise.resolve();
            }
            index.splice(pos, 1);
            delete windows[entry.id];
            return chrome.storage.sync.remove(chunkKeys(entry.id, entry.parts)).then(saveIndex);
        },

        moveAt: function (oldPos, newPos) {
            var entry = index.splice(oldPos, 1)[0];
            if (entry === undefined) {
                return Promise.resolve();
            }
            index.splice(newPos, 0, entry);
            return saveIndex();
        }
    };
})();

self.SyncStore = SyncStore;
