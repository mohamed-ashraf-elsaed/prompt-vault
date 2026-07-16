# PromptVault — Privacy Policy

_Last updated: 2026-07-16_

PromptVault is designed to be private by default.

## What we collect

**Nothing.** PromptVault does not collect, transmit, sell, or share any personal
information or usage data. There are no analytics, no trackers, no accounts, and
no servers.

## What the extension stores

The prompts you choose to save — their title, text, an optional source URL,
optional tags, and a favorite flag — are stored **locally on your device** using
the browser's `chrome.storage.local` API. This data never leaves your browser
unless you explicitly export it to a file.

## Permissions

- **storage** — to save your prompts locally.
- **contextMenus** — to add the "Save selection as prompt" right-click item.
- **activeTab** — to read the current page's URL/title (only when you invoke the
  extension) so a saved prompt can remember its source.
- **Host access** to a fixed list of AI chat sites — to show the on-page "Save
  prompt" button and read the prompt you choose to save.

The extension only reads the prompt text you explicitly save. It does not read,
store, or transmit any other page content.

## Data export and deletion

You can export all your prompts to a JSON file at any time from the popup. To
delete your data, remove individual prompts in the popup or uninstall the
extension, which clears its local storage.

## Third parties

None. No data is shared with any third party.

## Contact

Questions about this policy? Open an issue on the project repository or contact
the developer listed on the Chrome Web Store listing.
