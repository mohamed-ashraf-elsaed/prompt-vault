// PromptVault — content script
// Injects a floating "Save prompt" launcher on supported AI chat sites and a
// self-contained (Shadow DOM) panel to capture title + prompt text + source.
(() => {
  if (window.__promptVaultInjected) return;
  window.__promptVaultInjected = true;

  const BRAND = "PromptVault";

  // ---------- host element + shadow root (fully isolated styles) ----------
  const host = document.createElement("div");
  host.id = "promptvault-root";
  host.style.all = "initial";
  const shadow = host.attachShadow({ mode: "open" });
  document.documentElement.appendChild(host);

  const style = document.createElement("style");
  style.textContent = `
    :host { all: initial; }
    * { box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
    .fab {
      position: fixed; right: 20px; bottom: 20px; z-index: 2147483646;
      width: 48px; height: 48px; border-radius: 14px; border: none; cursor: pointer;
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      box-shadow: 0 6px 20px rgba(79,70,229,.45), 0 1px 3px rgba(0,0,0,.2);
      display: grid; place-items: center; transition: transform .15s ease, box-shadow .15s ease;
    }
    .fab:hover { transform: translateY(-2px) scale(1.04); box-shadow: 0 10px 28px rgba(79,70,229,.55); }
    .fab:active { transform: scale(.96); }
    .fab svg { width: 24px; height: 24px; }
    .panel {
      position: fixed; right: 20px; bottom: 80px; z-index: 2147483647;
      width: 360px; max-width: calc(100vw - 32px);
      background: #ffffff; color: #1f2430; border-radius: 16px;
      box-shadow: 0 24px 60px rgba(15,23,42,.28), 0 2px 8px rgba(15,23,42,.15);
      border: 1px solid rgba(15,23,42,.08);
      overflow: hidden; transform-origin: bottom right;
      animation: pop .16s ease-out;
    }
    @keyframes pop { from { opacity: 0; transform: translateY(8px) scale(.98); } to { opacity: 1; transform: none; } }
    .head {
      display: flex; align-items: center; gap: 8px; padding: 14px 16px;
      background: linear-gradient(135deg, #6366f1, #8b5cf6); color: #fff;
    }
    .head .logo { width: 22px; height: 22px; }
    .head h1 { font-size: 14px; font-weight: 700; margin: 0; letter-spacing: .2px; flex: 1; }
    .head .x { background: rgba(255,255,255,.18); border: none; color: #fff; width: 26px; height: 26px; border-radius: 8px; cursor: pointer; font-size: 15px; line-height: 1; }
    .head .x:hover { background: rgba(255,255,255,.3); }
    .body { padding: 14px 16px 16px; }
    label { display: block; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .5px; color: #6b7280; margin: 0 0 5px; }
    input, textarea {
      width: 100%; border: 1px solid #e2e5ec; border-radius: 10px; padding: 9px 11px;
      font-size: 13px; color: #1f2430; background: #f9fafb; resize: vertical; outline: none;
      transition: border-color .12s, background .12s;
    }
    input:focus, textarea:focus { border-color: #8b5cf6; background: #fff; box-shadow: 0 0 0 3px rgba(139,92,246,.12); }
    textarea { min-height: 96px; max-height: 260px; line-height: 1.45; }
    .field { margin-bottom: 12px; }
    .src { display: flex; align-items: center; gap: 6px; font-size: 12px; color: #6b7280; background: #f3f4f6; border-radius: 8px; padding: 7px 10px; }
    .src svg { width: 13px; height: 13px; flex: none; }
    .src span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .actions { display: flex; gap: 8px; margin-top: 14px; }
    .btn { flex: 1; border: none; border-radius: 10px; padding: 10px; font-size: 13px; font-weight: 700; cursor: pointer; transition: filter .12s, background .12s; }
    .btn.primary { background: linear-gradient(135deg, #6366f1, #8b5cf6); color: #fff; }
    .btn.primary:hover { filter: brightness(1.06); }
    .btn.ghost { background: #f1f2f6; color: #4b5563; }
    .btn.ghost:hover { background: #e5e7eb; }
    .toast {
      position: fixed; right: 20px; bottom: 80px; z-index: 2147483647;
      background: #111827; color: #fff; padding: 11px 15px; border-radius: 12px; font-size: 13px; font-weight: 600;
      box-shadow: 0 12px 30px rgba(0,0,0,.3); display: flex; align-items: center; gap: 8px;
      animation: pop .16s ease-out;
    }
    .toast svg { width: 16px; height: 16px; color: #34d399; }
    @media (prefers-color-scheme: dark) {
      .panel { background: #1c1f2b; color: #e5e7eb; border-color: rgba(255,255,255,.08); }
      input, textarea { background: #12141d; color: #e5e7eb; border-color: #2b2f3d; }
      input:focus, textarea:focus { background: #12141d; }
      .src { background: #12141d; color: #9ca3af; }
      .btn.ghost { background: #2b2f3d; color: #cbd5e1; }
      .btn.ghost:hover { background: #363b4c; }
      label { color: #9ca3af; }
    }
  `;
  shadow.appendChild(style);

  const bookmarkIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>`;

  // ---------- launcher ----------
  const fab = document.createElement("button");
  fab.className = "fab";
  fab.title = `${BRAND} — save this prompt`;
  fab.innerHTML = bookmarkIcon;
  shadow.appendChild(fab);

  let panel = null;

  // Best-effort detection of the prompt text the user is composing.
  function detectPromptText() {
    const sel = String(window.getSelection ? window.getSelection().toString() : "").trim();
    if (sel) return sel;
    const selectors = [
      'div.ProseMirror',
      'textarea#prompt-textarea',
      'textarea[data-testid="chat-input"]',
      'textarea[placeholder]',
      'div[contenteditable="true"][role="textbox"]',
      'div[contenteditable="true"]',
      'textarea',
    ];
    for (const s of selectors) {
      const el = document.querySelector(s);
      if (!el) continue;
      const val = (el.value !== undefined ? el.value : el.innerText || el.textContent || "").trim();
      if (val) return val;
    }
    return "";
  }

  function closePanel() {
    if (panel) { panel.remove(); panel = null; }
  }

  function openPanel() {
    if (panel) { closePanel(); return; }
    const detected = detectPromptText();
    const pageUrl = location.href;
    const safeUrl = pageUrl.replace(/"/g, "%22");
    let pageHost = "";
    try { pageHost = new URL(pageUrl).hostname.replace(/^www\./, ""); } catch {}

    panel = document.createElement("div");
    panel.className = "panel";
    panel.innerHTML = `
      <div class="head">
        <span class="logo">${bookmarkIcon}</span>
        <h1>Save prompt</h1>
        <button class="x" title="Close">✕</button>
      </div>
      <div class="body">
        <div class="field">
          <label>Title</label>
          <input id="pv-title" type="text" placeholder="Give this prompt a name" maxlength="120" />
        </div>
        <div class="field">
          <label>Prompt</label>
          <textarea id="pv-text" placeholder="Paste or write your prompt…"></textarea>
        </div>
        <div class="src" title="${safeUrl}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
          <span>Source: ${pageHost || "this page"}</span>
        </div>
        <div class="actions">
          <button class="btn ghost" id="pv-cancel">Cancel</button>
          <button class="btn primary" id="pv-save">Save prompt</button>
        </div>
      </div>`;
    shadow.appendChild(panel);

    const titleEl = shadow.getElementById("pv-title");
    const textEl = shadow.getElementById("pv-text");
    textEl.value = detected;
    if (detected) titleEl.value = detected.replace(/\s+/g, " ").slice(0, 60);
    (detected ? titleEl : textEl).focus();

    shadow.querySelector(".x").onclick = closePanel;
    shadow.getElementById("pv-cancel").onclick = closePanel;
    shadow.getElementById("pv-save").onclick = () => {
      const text = textEl.value.trim();
      if (!text) { textEl.focus(); return; }
      chrome.runtime.sendMessage(
        { type: "PV_SAVE_PROMPT", title: titleEl.value.trim(), text, url: pageUrl },
        (res) => {
          closePanel();
          if (res && res.ok) showToast("Prompt saved to PromptVault");
        }
      );
    };
    // Cmd/Ctrl+Enter to save quickly.
    panel.addEventListener("keydown", (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") shadow.getElementById("pv-save").click();
      if (e.key === "Escape") closePanel();
    });
  }

  function showToast(text) {
    const t = document.createElement("div");
    t.className = "toast";
    t.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg><span>${text}</span>`;
    shadow.appendChild(t);
    setTimeout(() => t.remove(), 2200);
  }

  fab.addEventListener("click", openPanel);

  // Close panel when clicking outside of the extension UI.
  document.addEventListener("click", (e) => {
    if (panel && e.target !== host) closePanel();
  });
})();
