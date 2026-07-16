// PromptVault — popup logic
const STORAGE_KEY = "prompts";

const $ = (id) => document.getElementById(id);
const listEl = $("list");
const emptyEl = $("empty");
const editorEl = $("editor");
const searchEl = $("search");
const countEl = $("count");
const favFilterEl = $("favFilter");
const searchbarEl = document.querySelector(".searchbar");
const footerEl = document.querySelector(".footer");

let prompts = [];
let editingId = null;
let query = "";
let favOnly = false;

// ---------- storage ----------
async function load() {
  const data = await chrome.storage.local.get(STORAGE_KEY);
  prompts = Array.isArray(data[STORAGE_KEY]) ? data[STORAGE_KEY] : [];
}
async function save() {
  await chrome.storage.local.set({ [STORAGE_KEY]: prompts });
}
function makeId() {
  return Date.now().toString(36) + "-" + Math.floor(Math.random() * 1e9).toString(36);
}

// ---------- helpers ----------
function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => (
    { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]
  ));
}
function siteLabel(url) {
  try {
    const host = new URL(url).hostname.replace(/^www\./, "");
    const map = {
      "claude.ai": "Claude", "chatgpt.com": "ChatGPT", "chat.openai.com": "ChatGPT",
      "gemini.google.com": "Gemini", "perplexity.ai": "Perplexity", "poe.com": "Poe",
      "copilot.microsoft.com": "Copilot", "chat.deepseek.com": "DeepSeek",
      "grok.com": "Grok", "x.com": "Grok", "chat.mistral.ai": "Mistral",
      "meta.ai": "Meta AI", "huggingface.co": "HuggingChat",
    };
    return map[host] || host;
  } catch { return ""; }
}
function timeAgo(ts) {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return "just now";
  const m = Math.floor(s / 60); if (m < 60) return m + "m ago";
  const h = Math.floor(m / 60); if (h < 24) return h + "h ago";
  const d = Math.floor(h / 24); if (d < 30) return d + "d ago";
  return new Date(ts).toLocaleDateString();
}
function toast(msg) {
  const t = $("toast");
  t.textContent = msg;
  t.classList.remove("hidden");
  clearTimeout(toast._t);
  toast._t = setTimeout(() => t.classList.add("hidden"), 1800);
}

// ---------- rendering ----------
function filtered() {
  const q = query.trim().toLowerCase();
  return prompts.filter((p) => {
    if (favOnly && !p.favorite) return false;
    if (!q) return true;
    const hay = [p.title, p.text, p.source, (p.tags || []).join(" ")].join(" ").toLowerCase();
    return hay.includes(q);
  });
}

function render() {
  countEl.textContent = `${prompts.length} prompt${prompts.length === 1 ? "" : "s"}`;
  const items = filtered();

  if (prompts.length === 0) {
    listEl.classList.add("hidden");
    emptyEl.classList.remove("hidden");
    listEl.innerHTML = "";
    return;
  }
  emptyEl.classList.add("hidden");
  listEl.classList.remove("hidden");

  if (items.length === 0) {
    listEl.innerHTML = `<div style="text-align:center;color:var(--muted);padding:32px 16px;font-size:12.5px">No matches for “${esc(query)}”.</div>`;
    return;
  }

  listEl.innerHTML = items.map((p) => {
    const tags = (p.tags || []).slice(0, 3).map((t) => `<span class="tag">#${esc(t)}</span>`).join("");
    const src = p.source || (p.url ? siteLabel(p.url) : "");
    const badge = src ? `<span class="badge">${esc(src)}</span>` : "";
    const link = p.url
      ? `<button class="act open" data-id="${p.id}" title="Open source"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><path d="M15 3h6v6M10 14L21 3"/></svg></button>`
      : "";
    return `
      <div class="card" data-id="${p.id}">
        <div class="card-top">
          <div class="card-title">${esc(p.title)}</div>
          <button class="star ${p.favorite ? "on" : ""}" data-id="${p.id}" title="Favorite">${p.favorite ? "★" : "☆"}</button>
        </div>
        <div class="card-text">${esc(p.text)}</div>
        <div class="card-meta">${badge}${tags}<span class="date">${timeAgo(p.updatedAt || p.createdAt)}</span></div>
        <div class="card-actions">
          <button class="act copy" data-id="${p.id}" title="Copy prompt"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>Copy</button>
          <button class="act edit" data-id="${p.id}" title="Edit"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>Edit</button>
          ${link}
          <button class="act del" data-id="${p.id}" title="Delete"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/></svg></button>
        </div>
      </div>`;
  }).join("");
}

// ---------- editor ----------
async function openEditor(id) {
  editingId = id || null;
  const p = id ? prompts.find((x) => x.id === id) : null;
  $("editorTitle").textContent = id ? "Edit prompt" : "Add prompt";
  $("fTitle").value = p ? p.title : "";
  $("fText").value = p ? p.text : "";
  $("fTags").value = p ? (p.tags || []).join(", ") : "";
  $("fUrl").value = p ? p.url || "" : "";

  // Prefill source with the active tab when adding a brand-new prompt.
  if (!id) {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab && tab.url && /^https?:/.test(tab.url)) $("fUrl").value = tab.url;
    } catch {}
  }
  // Switch to the editor view: hide the browsing UI.
  searchbarEl.classList.add("hidden");
  footerEl.classList.add("hidden");
  listEl.classList.add("hidden");
  emptyEl.classList.add("hidden");
  editorEl.classList.remove("hidden");
  $("fTitle").focus();
}
function closeEditor() {
  editorEl.classList.add("hidden");
  editingId = null;
  // Restore the browsing UI.
  searchbarEl.classList.remove("hidden");
  footerEl.classList.remove("hidden");
  render();
}
async function saveEditor() {
  const title = $("fTitle").value.trim();
  const text = $("fText").value.trim();
  if (!text) { $("fText").focus(); toast("Prompt text is required"); return; }
  const url = $("fUrl").value.trim();
  const tags = $("fTags").value.split(",").map((t) => t.trim().replace(/^#/, "")).filter(Boolean);
  const now = Date.now();

  if (editingId) {
    const p = prompts.find((x) => x.id === editingId);
    if (p) {
      p.title = title || text.slice(0, 60);
      p.text = text; p.url = url; p.tags = tags;
      p.source = url ? siteLabel(url) : "";
      p.updatedAt = now;
    }
  } else {
    prompts.unshift({
      id: makeId(),
      title: title || text.slice(0, 60),
      text, url, tags,
      source: url ? siteLabel(url) : "",
      favorite: false, createdAt: now, updatedAt: now,
    });
  }
  await save();
  closeEditor();
  render();
  toast("Saved");
}

// ---------- list actions ----------
listEl.addEventListener("click", async (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;
  const id = btn.dataset.id;
  const p = prompts.find((x) => x.id === id);
  if (!p) return;

  if (btn.classList.contains("copy")) {
    try { await navigator.clipboard.writeText(p.text); toast("Copied to clipboard"); }
    catch { toast("Copy failed"); }
  } else if (btn.classList.contains("edit")) {
    openEditor(id);
  } else if (btn.classList.contains("del")) {
    prompts = prompts.filter((x) => x.id !== id);
    await save(); render(); toast("Deleted");
  } else if (btn.classList.contains("star")) {
    p.favorite = !p.favorite; p.updatedAt = Date.now();
    await save(); render();
  } else if (btn.classList.contains("open")) {
    if (p.url) chrome.tabs.create({ url: p.url });
  }
});

// ---------- export / import ----------
$("exportBtn").addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(prompts, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "promptvault-export.json";
  a.click();
  URL.revokeObjectURL(url);
  toast("Exported " + prompts.length + " prompts");
});
$("importBtn").addEventListener("click", () => $("importFile").click());
$("importFile").addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  try {
    const text = await file.text();
    const incoming = JSON.parse(text);
    if (!Array.isArray(incoming)) throw new Error("bad format");
    const existing = new Set(prompts.map((p) => p.id));
    let added = 0;
    for (const raw of incoming) {
      if (!raw || typeof raw.text !== "string") continue;
      const id = existing.has(raw.id) ? makeId() : raw.id || makeId();
      prompts.unshift({
        id,
        title: (raw.title || raw.text.slice(0, 60) || "Untitled").toString(),
        text: raw.text,
        url: raw.url || "",
        source: raw.source || (raw.url ? siteLabel(raw.url) : ""),
        tags: Array.isArray(raw.tags) ? raw.tags : [],
        favorite: !!raw.favorite,
        createdAt: raw.createdAt || Date.now(),
        updatedAt: raw.updatedAt || Date.now(),
      });
      added++;
    }
    await save(); render();
    toast(`Imported ${added} prompt${added === 1 ? "" : "s"}`);
  } catch {
    toast("Import failed — invalid file");
  }
  e.target.value = "";
});

// ---------- wiring ----------
$("addBtn").addEventListener("click", () => openEditor(null));
$("emptyAdd").addEventListener("click", () => openEditor(null));
$("backBtn").addEventListener("click", closeEditor);
$("cancelBtn").addEventListener("click", closeEditor);
$("saveBtn").addEventListener("click", saveEditor);
searchEl.addEventListener("input", (e) => { query = e.target.value; render(); });
favFilterEl.addEventListener("click", () => {
  favOnly = !favOnly;
  favFilterEl.classList.toggle("active", favOnly);
  render();
});
document.addEventListener("keydown", (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key === "Enter" && !editorEl.classList.contains("hidden")) saveEditor();
});

// Live-update if a prompt is saved from a page while the popup is open.
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "local" && changes[STORAGE_KEY]) {
    prompts = changes[STORAGE_KEY].newValue || [];
    if (editorEl.classList.contains("hidden")) render();
  }
});

(async function init() {
  await load();
  render();
})();
