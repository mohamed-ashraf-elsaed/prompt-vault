<div align="center">

# 🔖 PromptVault

**Save prompts from any AI chat — with title, text, and source link.**

Save, organize, search, and reuse your best AI prompts. Works on Claude, ChatGPT,
Gemini, Perplexity, Copilot, DeepSeek, Grok, Mistral, Meta AI & HuggingChat — and
everywhere else via right-click. Private by design: everything is stored locally.

</div>

---

## ✨ Features

- **One-click save** — a floating button on supported AI chat sites captures the prompt you're composing.
- **Save from anywhere** — select text on any page → right-click → *Save selection as prompt*.
- **Title · text · source** — every prompt keeps a title, its full text, and the link it came from.
- **Search & organize** — full-text search, favorites, and tags.
- **Reuse instantly** — one-click copy to clipboard; edit any time.
- **Export / import** — back up your library to JSON and restore it anywhere.
- **Private** — no account, no servers, no tracking. Data lives in `chrome.storage.local`.

## 📁 Project structure

```
prompt-vault/
├── manifest.json          # MV3 manifest
├── src/
│   ├── background.js       # service worker: context menu, storage, badge
│   ├── content.js          # floating "Save prompt" button + panel (Shadow DOM)
│   ├── popup.html/.css/.js # library UI: browse, search, edit, copy, export
├── icons/                  # 16/32/48/128 px extension icons
├── assets/                 # icon + promo source (make_icons.py, make_promo_html.py)
│   └── store/              # ready-to-upload store graphics
├── store/
│   ├── STORE_LISTING.md    # ← all Chrome Web Store submission data
│   ├── PRIVACY.md          # privacy policy (markdown)
│   └── privacy.html        # privacy policy (hostable page)
└── README.md
```

## 🧪 Load it locally (development)

1. Go to `chrome://extensions`.
2. Turn on **Developer mode** (top-right).
3. Click **Load unpacked** and select the `prompt-vault/` folder.
4. Pin PromptVault to your toolbar. Open any AI chat and click the bottom-right button, or select text anywhere and right-click.

## 📦 Build the upload package

Only the runtime files belong in the store zip (not `assets/`, `store/`, or this README):

```bash
cd prompt-vault
zip -r promptvault.zip manifest.json src icons -x ".*"
```

Then upload `promptvault.zip` at the [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole) and fill in the fields from [`store/STORE_LISTING.md`](store/STORE_LISTING.md).

**Live links** (GitHub Pages):
- Homepage: https://mohamed-ashraf-elsaed.github.io/prompt-vault/
- Privacy policy: https://mohamed-ashraf-elsaed.github.io/prompt-vault/privacy.html
- Support: https://github.com/mohamed-ashraf-elsaed/prompt-vault/issues

## 🎨 Regenerating assets

```bash
python3 assets/make_icons.py          # icons/ + store icon
python3 assets/make_promo_html.py     # assets/promo/*.html (render to PNG for the store)
```

## 🔐 Permissions used

| Permission | Why |
|-----------|-----|
| `storage` | Save prompts locally |
| `contextMenus` | "Save selection as prompt" right-click item |
| `activeTab` | Read current tab URL/title when you save (on invocation only) |
| host access (AI chat sites) | Inject the on-page save button + read the prompt you save |

No remote code. No `<all_urls>`. No `tabs`/`scripting`/`cookies`.

## 📄 License

MIT — do what you like. See notice in individual files.
