# Chrome Web Store listing text

Copy/paste source for the Developer Dashboard fields. Not used by the extension itself.

## Summary (132 characters max)

Save, restore and sync browser windows across your computers — free, via Chrome's own sync. No external server required.

## Detailed description

TabCloud+ lets you save entire browser windows — every open tab, in order — and restore them later, on this computer or any other computer signed into the same Chrome profile.

Originally built as TabCloud by Connor Dunn, with window/session tracking added by Max Furtuna. This fork exists because the original was removed from the Chrome Web Store; it has been rebuilt on Manifest V3 and no longer depends on any third-party server.

WHAT IT DOES
• Save the tabs in any open window with one click
• Restore a saved window later, in a new window or in the same tab
• Rename saved windows, drag tabs between them, reorder your saved list
• Keeps a saved window "linked" to the local window that created it, so further changes are reflected with the next save

HOW SYNC WORKS
Saved windows sync through Chrome's own built-in sync (chrome.storage.sync) — the same mechanism that syncs your bookmarks and passwords. That means:
• It's free, forever
• Nothing is sent to any server this extension's developer runs
• Your saved windows appear automatically on every computer where you're signed into Chrome with Sync turned on

If you used an earlier version of TabCloud that stored windows in a cloud account at chrometabcloud.appspot.com, the Options page (and the first-run banner) has a one-time Import action to pull that data in — it only runs when you click it.

PERMISSIONS
• "tabs" — to read the URL, title and favicon of tabs you choose to save, and to open tabs when you restore a saved window
• "storage" — to save your windows and preferences

This extension shows no ads, collects no analytics, and sends no browsing data anywhere. Full privacy policy: see PRIVACY.md in the repository.

Source code: https://github.com/fernandovbcardona/TabCloudplus

## Category

Productivity

## Single purpose description (Developer Dashboard "Privacy practices" tab)

TabCloud+ lets users save the set of tabs open in a browser window and restore that same window later, on the same computer or a different one signed into the same Chrome account.

## Permission justifications (Developer Dashboard "Privacy practices" tab)

- **tabs**: "Used to read the URL, title and favicon of tabs when the user saves a window, and to open tabs when the user restores a previously saved window."
- **storage**: "Used to store the user's saved windows and preferences via chrome.storage.local and chrome.storage.sync."
- **Remote code / host permission (chrometabcloud.appspot.com, optional)**: "Requested only if the user explicitly chooses to import windows saved in a previous version's cloud account. Never requested or contacted automatically."

## Data usage (Developer Dashboard "Privacy practices" tab)

This item handles user data: **Yes**.

Check only:
- ☑ **Web history** — the extension stores the URL and title of tabs the user explicitly chooses to save.

Leave unchecked: Personally identifiable information, Health info, Financial and payment info, Authentication information, Personal communications, Location, User activity, Website content. (No content script exists, so no page content is ever read; no clicks/keys/scroll are tracked.)

Certifications to confirm (all true):
- I do not sell or transfer user data to third parties outside of approved use cases.
- I do not use or transfer user data for purposes unrelated to my item's single purpose.
- I do not use or transfer user data to determine creditworthiness or for lending purposes.

Privacy policy URL: `https://github.com/fernandovbcardona/TabCloudplus/blob/master/PRIVACY.md`
