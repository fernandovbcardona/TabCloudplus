window.Favicon = (function(){
    /**
     * @param url
     * @returns {string}
     */
    function extractHostname(url)
    {
        var hostname;
        //find & remove protocol (http, ftp, etc.) and get hostname

        if (url.indexOf("://") > -1) {
            hostname = url.split('/')[2];
        }
        else {
            hostname = url.split('/')[0];
        }

        //find & remove port number
        hostname = hostname.split(':')[0];
        //find & remove "?"
        hostname = hostname.split('?')[0];

        return hostname;
    }
    var providerUrl = 'https://s2.googleusercontent.com/s2/favicons?domain_url=';
    // data: URI favicons (common for sites without a real favicon.ico) can be
    // several KB *each* - saving them verbatim is what blows past
    // chrome.storage.sync's per-item quota fastest. Anything data: or just
    // plain long gets dropped; the favicon proxy above fills in at render
    // time instead.
    var MAX_FAVICON_LEN = 300;
    return {
        getFavicon: function (url) {
            return providerUrl + extractHostname(url);
        },
        /**
         *
         * @param {string} url
         * @param {string} siteUrl
         * @returns {boolean}
         */
        isFaviconOf: function (url, siteUrl) {
            return url == providerUrl + extractHostname(siteUrl);
        },
        /**
         * Returns a favicon URL safe to persist, or '' if it's a data: URI
         * or otherwise too large to be worth storing.
         * @param {string} url
         * @returns {string}
         */
        clean: function (url) {
            if (!url || url.indexOf('data:') === 0 || url.length > MAX_FAVICON_LEN) {
                return '';
            }
            return url;
        }
    }
})();
