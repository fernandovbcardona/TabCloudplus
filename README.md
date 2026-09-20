# TabCloud+

> Save, restore, and track browser window sessions — across time and across computers.

![Manifest V3](https://img.shields.io/badge/manifest-v3-blue)
![Sync](https://img.shields.io/badge/sync-chrome.storage.sync-brightgreen)
![Status](https://img.shields.io/badge/status-unofficial%20fork-orange)

**Originally created by Connor Dunn**, with additional work (window/session tracking) by **Max Furtuna**.
This repository is an unofficial fork that keeps the Chrome extension alive now that its Chrome Web Store listing has been taken down.

📁 The Chrome extension lives in [`chrome/`](chrome). The Firefox and Android folders in this repo are **not** maintained by this fork.

---

## 📦 What's new in this fork

| Change | Details |
|---|---|
| **Manifest V3** | Background page → service worker; `localStorage` → `chrome.storage.local`; `browser_action` → `action`. |
| **New sync backend** | Saved windows no longer depend on the original author's Google App Engine server. They now sync via Chrome's own `chrome.storage.sync`. |
| **Legacy import** | One-time, opt-in importer in the Options page for anyone with data still sitting in the old cloud account. |
| **Bug fix** | Fixed a `ReferenceError` (`deleteWindowNames` typo) in the "close window" confirmation flow. |

See [`chrome/CHANGELOG`](chrome/CHANGELOG) for the extension's own version history.

---

## ✨ What it does

TabCloud+ lets you save the tabs in a window and restore them later — on this computer or another — and keeps a saved window **linked** to the local window that opened it, so tabs you add or close afterward stay in sync with the saved copy the next time you hit save.

On top of the original TabCloud, this fork adds window/session tracking:

1. **Open an already-saved window** → the newly opened local window automatically tracks it. Tabs added or removed are reflected back into that saved window the next time you click **Save**.
2. **Save a brand-new local window** → that window starts tracking the save it just created, so future edits followed by **Save** update it in place instead of duplicating it.

---

## ⚙️ How it works

- **Local state** — which local window tracks which saved window, plus your settings — lives in `chrome.storage.local`, backing the extension's background service worker.
- **Saved windows** — the ones you restore, delete, or drag to reorder — live in `chrome.storage.sync`, synced automatically between any computers signed into the same Chrome profile with Sync turned on. No account, no login screen.

---

## ⚠️ Storage change from earlier versions

> Earlier versions of TabCloud+ synced saved windows through a Google App Engine service at `chrometabcloud.appspot.com`, owned by the original author. **This fork no longer uses it for normal operation** — sync now happens entirely through `chrome.storage.sync`.

### 🕒 Migrating old data — do this soon

If you're upgrading from a previous version and still have a valid login on `chrometabcloud.appspot.com`, you can pull your old data across — but don't wait. That server isn't maintained by this fork and could go offline at any time, without notice.

1. Log in to the old account in a normal browser tab: **https://chrometabcloud.appspot.com/login**
2. Open the extension's **Options** page → **Import from the old TabCloud cloud account** → click **Import my old saved windows**.
3. This is a one-time action — permission to reach that domain is requested just for the import, and it isn't contacted again afterward.

### Limitations of `chrome.storage.sync`

| Limit | Detail |
|---|---|
| **Total storage** | ~100KB across all saved windows |
| **Per window** | ~8KB — a window over this size fails to save with a warning; remove a few tabs and retry |
| **Sync scope** | Only across browsers signed into the *same Google account* with Chrome Sync **on**. Doesn't reach Firefox, a different Chrome profile, or a browser with Sync off |
| **No web dashboard** | The old `appspot.com` site, for viewing saved windows outside the extension, is gone |

---

## 💬 A note from the fork maintainer

*I use and genuinely like this extension, and when it was recently taken down from the Chrome Web Store I took the time to update it for my own use — mainly to keep it working under Manifest V3 and to stop depending on someone else's server that could disappear at any moment. Nevertheless, feel free to use it as much as you'd like.*
