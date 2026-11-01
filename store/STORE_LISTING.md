# PromptVault — Chrome Web Store submission pack

Everything below is **copy-paste ready** for the Chrome Web Store Developer
Dashboard. Fields are grouped and named exactly as they appear in the dashboard.
Character counts are noted where the store enforces a limit.

---

## 1. Store listing → Product details

### Title (from package)
> Taken automatically from `manifest.json` → `name`.
```
PromptVault — Save prompts from any AI chat
```
*(43 / 45 characters)*

### Summary (from package)
> Taken automatically from `manifest.json` → `description`.
```
Save and reuse your best AI prompts. One click to save from Claude, ChatGPT, Gemini & more — with title, text and source link.
```
*(126 / 132 characters)*

### Description
> Paste into the **Description** box (limit 16,000 chars).

```
Stop losing your best prompts in endless chat histories.

PromptVault is the fastest way to save, organize, and reuse the prompts that actually work — right from the AI chat you're already using. One click captures the prompt with a title, the full text, and a link back to where you saved it.

━━━━━━━━━━━━━━━━━━━━━━
WHY YOU'LL LOVE IT
━━━━━━━━━━━━━━━━━━━━━━

★ Save in one click
A floating save button appears on the AI chats you use every day — Claude, ChatGPT, Gemini, Perplexity, Copilot, DeepSeek, Grok, Mistral, Meta AI and HuggingChat. Click it and the prompt you're writing is captured instantly.

★ Save from anywhere
On any other website, just select text, right-click, and choose "Save selection as prompt." Your prompt library isn't limited to a handful of sites.

★ Title, text, and source — every time
Each saved prompt keeps a clear title, the full prompt text, and the source link so you always know where a prompt came from and can jump back to it.

★ Find it in seconds
Full-text search across titles, prompt text, tags, and sources. Star your favorites, tag prompts by project, and filter your list to exactly what you need.

★ Reuse instantly
Copy any prompt to your clipboard with a single click, then paste it into any chat. Edit and refine prompts as you learn what works.

★ Private by design
Your prompts are stored locally in your browser. No account, no sign-up, no servers, and no tracking. Nothing you save ever leaves your device — unless you choose to export it.

★ Yours to keep
Export your entire library to a JSON file for backup, and import it just as easily. Your prompts belong to you.

━━━━━━━━━━━━━━━━━━━━━━
HOW IT WORKS
━━━━━━━━━━━━━━━━━━━━━━

1. Open any supported AI chat and click the PromptVault button (bottom-right), or select any text on any page and right-click → "Save selection as prompt."
2. Give the prompt a title, tweak the text if you like, and save.
3. Open the PromptVault popup from your toolbar to search, copy, edit, favorite, or organize everything you've saved.

━━━━━━━━━━━━━━━━━━━━━━
PERFECT FOR
━━━━━━━━━━━━━━━━━━━━━━

• Writers and marketers reusing content and copy prompts
• Developers keeping code-review and refactoring prompts handy
• Founders and teams standardizing their go-to prompts
• Students and researchers building a personal prompt library
• Anyone who has ever thought "what was that prompt I used last week?"

Build your personal prompt library once — and never rewrite a great prompt again.

Questions or feedback? We'd love to hear from you.
```

### Category
```
Productivity
```

### Language
```
English (United States)
```

---

## 2. Graphic assets

| Asset | Requirement | File to upload |
|-------|-------------|----------------|
| Store icon | 128×128 PNG | `assets/store/store-icon-128.png` |
| Screenshot 1 | 1280×800 PNG (no alpha) | `assets/store/screenshot-1-hero.png` |
| Screenshot 2 | 1280×800 PNG (no alpha) | `assets/store/screenshot-2-inpage-save.png` |
| Screenshot 3 | 1280×800 PNG (no alpha) | `assets/store/screenshot-3-library.png` |
| Screenshot 4 | 1280×800 PNG (no alpha) | `assets/store/screenshot-4-right-click.png` |
| Screenshot 5 | 1280×800 PNG (no alpha) | `assets/store/screenshot-5-privacy.png` |
| Small promo tile | 440×280 PNG (no alpha) | `assets/store/promo-small-440x280.png` |
| Marquee promo tile | 1400×560 PNG (no alpha) | `assets/store/promo-marquee-1400x560.png` |

**Global promo video (YouTube URL):** *optional — leave blank.*

---

## 3. Additional fields

- **Official URL:** *None* (unless you register the domain in Google Search Console).
- **Homepage URL:**
  ```
  https://prompt-vault.mohamedashrafelsaed.com/
  ```
- **Support URL:**
  ```
  https://github.com/mohamed-ashraf-elsaed/prompt-vault/issues
  ```
- **Mature content:** **No.**

---

## 4. Privacy

### Single purpose (dashboard field)
```
PromptVault lets users save, organize, and reuse text prompts for AI chat tools. It captures a prompt's title, text, and source URL and stores them locally so the user can search, copy, and reuse them later.
```

### Single purpose description (limit 1,000)
```
PromptVault has one purpose: to help users save and reuse their AI prompts. Users can save a prompt (its title, text, and the URL it came from) using an on-page button on supported AI chat sites or a right-click menu on any page, then browse, search, copy, edit, favorite, and organize those saved prompts from the extension popup. All data is stored locally in the browser. Every permission the extension requests exists solely to support this single saving-and-reusing-prompts workflow.
```

### Permission justifications

**`storage` justification** (limit 1,000)
```
Used to save the user's prompts (title, text, source URL, tags, and favorite flag) locally in the browser via chrome.storage.local so they persist between sessions. This is the core function of the extension. No data is transmitted anywhere.
```

**`contextMenus` justification** (limit 1,000)
```
Adds a single right-click menu item, "Save selection as prompt," that appears only when text is selected. It lets the user save highlighted text as a prompt on any page. This is a primary way users capture prompts and directly serves the extension's single purpose.
```

**`activeTab` justification** (limit 1,000)
```
Used only when the user actively invokes the extension (clicking the toolbar popup or the right-click "Save selection as prompt" item) to read the current tab's URL and title so the saved prompt can record where it came from. It does not grant persistent or background access to browsing activity.
```

**Host permission justification** (limit 1,000)
> Covers the `content_scripts.matches` list in the manifest.
```
Content scripts run on a fixed list of popular AI chat sites (Claude, ChatGPT, Gemini, Perplexity, Poe, Copilot, DeepSeek, Grok, Mistral, Meta AI, HuggingChat) to inject a single "Save prompt" button and read the prompt the user is currently composing when they choose to save it. Access is limited to these AI chat domains — the extension does not request access to all sites. The scripts do not read, collect, or transmit page content beyond the prompt text the user explicitly saves.
```

> **Note:** This build does NOT request `scripting`, `tabs`, `<all_urls>`, `webNavigation`, `cookies`, or any remote-host permissions. If the dashboard shows justification boxes for permissions you are not using, leave them blank.

### Are you using remote code?
```
No, I am not using remote code.
```
*(All JavaScript is bundled in the package. No external `<script>` tags, no remote modules, no eval of remote strings.)*

---

## 5. Data usage

**What user data do you plan to collect?**
> Check **NONE** of the boxes. PromptVault does not collect or transmit any user
> data. Prompts are stored locally on the user's device via `chrome.storage.local`.

Leave every category unchecked:
- Personally identifiable information — ☐ no
- Health information — ☐ no
- Financial and payment information — ☐ no
- Authentication information — ☐ no
- Personal communications — ☐ no
- Location — ☐ no
- Web history — ☐ no
- User activity — ☐ no
- Website content — ☐ no

**Certifications (check all three — all true):**
- ☑ I do not sell or transfer user data to third parties, outside of the approved use cases.
- ☑ I do not use or transfer user data for purposes that are unrelated to my item's single purpose.
- ☑ I do not use or transfer user data to determine creditworthiness or for lending purposes.

### Privacy policy URL
> Hosted on GitHub Pages (source: `docs/privacy.html`). Paste this in:
```
https://prompt-vault.mohamedashrafelsaed.com/privacy.html
```

---

## 6. Distribution

- **Payments:** Free of charge (no in-app purchases).
- **Visibility:** Public *(or Unlisted while you test — your choice)*.
- **Distribution / regions:** All regions.

---

## 7. Pre-submission checklist

- [ ] Load `prompt-vault/` unpacked in `chrome://extensions` (Developer mode) and confirm the button, popup, save, search, copy, edit, delete, export/import, and right-click all work.
- [ ] Run `bash build.sh` (or the zip command in README) to produce `promptvault.zip` from the packaged files only.
- [ ] Upload `promptvault.zip` on the dashboard.
- [ ] Upload the icon, 5 screenshots, and 2 promo tiles from `assets/store/`.
- [ ] Paste the title/summary (auto from package), description, single purpose, and permission justifications above.
- [ ] Set category = Productivity, language = English, data collection = none, remote code = no.
- [ ] Publish a public Privacy Policy URL and paste it in.
- [ ] Submit for review.
