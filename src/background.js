// PromptVault — background service worker (MV3)
// Responsibilities: right-click "Save selection as prompt", storage writes,
// toolbar badge with the saved-prompt count, and open-popup requests.

const STORAGE_KEY = "prompts";

// ---------- storage helpers ----------
async function getPrompts() {
  const data = await chrome.storage.local.get(STORAGE_KEY);
  return Array.isArray(data[STORAGE_KEY]) ? data[STORAGE_KEY] : [];
}

async function setPrompts(prompts) {
  await chrome.storage.local.set({ [STORAGE_KEY]: prompts });
  await refreshBadge(prompts.length);
}

function makeId() {
  // Time-ordered, collision-resistant enough for a local list.
  return (
    Date.now().toString(36) +
    "-" +
    Math.floor(Math.random() * 1e9).toString(36)
  );
}

function siteLabelFromUrl(url) {
  try {
    const host = new URL(url).hostname.replace(/^www\./, "");
    const map = {
      "claude.ai": "Claude",
      "chatgpt.com": "ChatGPT",
      "chat.openai.com": "ChatGPT",
      "gemini.google.com": "Gemini",
      "perplexity.ai": "Perplexity",
      "poe.com": "Poe",
      "copilot.microsoft.com": "Copilot",
      "chat.deepseek.com": "DeepSeek",
      "grok.com": "Grok",
      "x.com": "Grok",
      "chat.mistral.ai": "Mistral",
      "meta.ai": "Meta AI",
      "huggingface.co": "HuggingChat",
    };
    return map[host] || host;
  } catch {
    return "";
  }
}

async function addPrompt({ title, text, url }) {
  const now = Date.now();
  const clean = (text || "").trim();
  if (!clean) return null;
  const prompt = {
    id: makeId(),
    title: (title || clean.slice(0, 60)).trim() || "Untitled prompt",
    text: clean,
    url: url || "",
    source: url ? siteLabelFromUrl(url) : "",
    tags: [],
    favorite: false,
    createdAt: now,
    updatedAt: now,
  };
  const prompts = await getPrompts();
  prompts.unshift(prompt);
  await setPrompts(prompts);
  return prompt;
}

// ---------- badge ----------
async function refreshBadge(count) {
  const n = typeof count === "number" ? count : (await getPrompts()).length;
  await chrome.action.setBadgeBackgroundColor({ color: "#6366f1" });
  await chrome.action.setBadgeText({ text: n > 0 ? String(n > 999 ? "999+" : n) : "" });
}

// ---------- context menu ----------
const MENU_ID = "promptvault-save-selection";

function createMenu() {
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: MENU_ID,
      title: 'Save selection as prompt',
      contexts: ["selection"],
    });
  });
}

chrome.runtime.onInstalled.addListener(() => {
  createMenu();
  refreshBadge();
});
chrome.runtime.onStartup.addListener(() => {
  createMenu();
  refreshBadge();
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId !== MENU_ID) return;
  const text = info.selectionText || "";
  if (!text.trim()) return;
  const saved = await addPrompt({
    title: text.trim().slice(0, 60),
    text,
    url: (tab && tab.url) || info.pageUrl || "",
  });
  if (saved) {
    // Brief confirmation via badge flash.
    await chrome.action.setBadgeText({ text: "✓" });
    setTimeout(() => refreshBadge(), 1200);
  }
});

// ---------- message bridge (content script + popup) ----------
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  (async () => {
    if (msg && msg.type === "PV_SAVE_PROMPT") {
      const url = msg.url || (sender.tab && sender.tab.url) || "";
      const saved = await addPrompt({ title: msg.title, text: msg.text, url });
      sendResponse({ ok: !!saved, prompt: saved });
      return;
    }
    if (msg && msg.type === "PV_GET_COUNT") {
      sendResponse({ count: (await getPrompts()).length });
      return;
    }
    sendResponse({ ok: false, error: "unknown message" });
  })();
  return true; // keep the channel open for the async response
});

// Keep badge in sync if storage is edited elsewhere (e.g. popup).
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "local" && changes[STORAGE_KEY]) {
    const next = changes[STORAGE_KEY].newValue || [];
    refreshBadge(Array.isArray(next) ? next.length : 0);
  }
});
