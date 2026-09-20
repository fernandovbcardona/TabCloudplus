# Privacy Policy — TabCloud+

_Last updated: 2026-09-20_

TabCloud+ is a browser extension that lets you save and restore browser window sessions (tabs). This policy explains what data it handles and how.

## What data is collected

When you choose to save a window, TabCloud+ stores:

- The URL, title, and favicon of each tab in that window
- A name you give the saved window
- Your extension preferences (e.g. how restored windows should open)

This data is only created when you explicitly click "save" — nothing is collected automatically or in the background.

## Where it is stored

- **Locally**, in your browser's `chrome.storage.local` — which local window tracks which saved window, and your preferences.
- **Synced**, in your browser's `chrome.storage.sync` — the saved windows themselves. This is the same mechanism Chrome uses to sync your bookmarks and passwords, governed by your own Google Account and Chrome's own privacy policy. This extension's developer has no access to it.

No data is sent to any server operated by this extension's developer. There is no analytics, tracking, or advertising code in this extension.

## The one exception: importing from the old TabCloud cloud account

Earlier versions of TabCloud synced through a third-party server at `chrometabcloud.appspot.com`, operated by the original TabCloud author — not this extension's developer. TabCloud+ can optionally import data from that account, but only when you explicitly click "Import" in the Options page or the onboarding banner; it never happens automatically. That request reuses your own existing login session with that third-party server. This extension's developer does not operate, and has no access to, that server or any data on it.

## Permissions

- `tabs` — to read the URL, title, and favicon of tabs when you choose to save a window, and to open tabs when you restore a saved window.
- `storage` — to save your windows and preferences via `chrome.storage`.
- Optional access to `chrometabcloud.appspot.com` — requested only if and when you use the legacy import feature described above.

## Data retention and deletion

Your saved windows and preferences stay in Chrome's storage until you delete them from within the extension, or uninstall the extension. Uninstalling clears local storage; data removed from `chrome.storage.sync` is removed from Chrome Sync once your signed-in browsers have synced the change.

## Changes to this policy

If this policy changes, the updated version will be published at this same URL.

## Contact

Questions or issues: https://github.com/fernandovbcardona/TabCloudplus/issues
