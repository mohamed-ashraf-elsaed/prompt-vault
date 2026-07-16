#!/usr/bin/env python3
"""Generate self-contained HTML scenes for Chrome Web Store assets.
Each file's <body> is sized to the exact required pixel dimensions so a
browser viewport screenshot matches Chrome Web Store requirements."""
import os

OUT = os.path.join(os.path.dirname(__file__), "promo")
os.makedirs(OUT, exist_ok=True)

FONT = "'Ubuntu','Noto Sans','DejaVu Sans',sans-serif"

BOOKMARK = ('<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" '
            'stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>')

BASE = f"""
* {{ margin:0; padding:0; box-sizing:border-box; }}
html,body {{ font-family:{FONT}; -webkit-font-smoothing:antialiased; }}
.stage {{ position:relative; overflow:hidden; }}
.mark {{ background:linear-gradient(135deg,#6366f1,#8b5cf6); display:grid; place-items:center; border-radius:22%; }}
.grad-text {{ background:linear-gradient(135deg,#6366f1,#8b5cf6); -webkit-background-clip:text; background-clip:text; color:transparent; }}
/* --- popup mock --- */
.popup {{ width:384px; background:#fff; border-radius:20px; overflow:hidden;
  box-shadow:0 40px 90px rgba(60,50,140,.28), 0 8px 24px rgba(60,50,140,.14); border:1px solid rgba(20,20,50,.06); }}
.pv-top {{ display:flex; align-items:center; gap:10px; padding:15px 16px; background:linear-gradient(135deg,#6366f1,#8b5cf6); color:#fff; }}
.pv-top .m {{ width:32px; height:32px; border-radius:9px; background:rgba(255,255,255,.2); display:grid; place-items:center; }}
.pv-top .m svg {{ width:18px; height:18px; }}
.pv-top strong {{ font-size:16px; display:block; }}
.pv-top small {{ font-size:11px; opacity:.85; }}
.pv-plus {{ margin-left:auto; width:34px; height:34px; border-radius:9px; background:rgba(255,255,255,.22); display:grid; place-items:center; color:#fff; font-size:20px; font-weight:300; }}
.pv-search {{ display:flex; align-items:center; gap:8px; padding:11px 14px; border-bottom:1px solid #eceef2; color:#9aa1b1; font-size:13px; }}
.pv-search .box {{ flex:1; }}
.pv-search .fav {{ width:30px; height:28px; border-radius:8px; background:#f1f2f6; display:grid; place-items:center; color:#c9ccd6; }}
.card {{ margin:9px 10px; padding:12px 13px; border:1px solid #eceef2; border-radius:13px; }}
.card.hot {{ border-color:#c7c3f7; box-shadow:0 3px 14px rgba(99,102,241,.12); }}
.card .t {{ display:flex; align-items:center; gap:8px; }}
.card .t b {{ font-size:14px; color:#1f2430; flex:1; }}
.card .t .star {{ color:#f59e0b; font-size:16px; }}
.card .t .star.off {{ color:#d3d6de; }}
.card .d {{ font-size:12.5px; color:#6b7280; line-height:1.5; margin:6px 0 9px;
  display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }}
.card .meta {{ display:flex; align-items:center; gap:6px; }}
.badge {{ font-size:10.5px; font-weight:700; padding:2px 8px; border-radius:999px; background:rgba(99,102,241,.12); color:#6366f1; }}
.tag {{ font-size:10.5px; padding:2px 8px; border-radius:999px; background:#f1f2f6; color:#7b8090; }}
.date {{ font-size:10.5px; color:#9aa1b1; margin-left:auto; }}
.acts {{ display:flex; gap:6px; margin-top:10px; padding-top:9px; border-top:1px solid #eceef2; }}
.acts span {{ flex:1; text-align:center; font-size:11.5px; font-weight:600; color:#6b7280; background:#f4f5f8; border-radius:8px; padding:6px 0; }}
.acts span.c {{ background:linear-gradient(135deg,#6366f1,#8b5cf6); color:#fff; }}
"""


def popup_mock():
    return f"""
<div class="popup">
  <div class="pv-top">
    <div class="m">{BOOKMARK}</div>
    <div><strong>PromptVault</strong><small>18 prompts</small></div>
    <div class="pv-plus">+</div>
  </div>
  <div class="pv-search">
    <span>🔍</span><div class="box">Search prompts, tags, sources…</div><div class="fav">★</div>
  </div>
  <div class="card hot">
    <div class="t"><b>SEO blog outline generator</b><span class="star">★</span></div>
    <div class="d">You are an expert content strategist. Create a detailed, H2/H3 blog outline for the topic below, with search intent, target keywords…</div>
    <div class="meta"><span class="badge">ChatGPT</span><span class="tag">#writing</span><span class="tag">#seo</span><span class="date">2h ago</span></div>
    <div class="acts"><span class="c">Copy</span><span>Edit</span><span>Open</span></div>
  </div>
  <div class="card">
    <div class="t"><b>Code review checklist</b><span class="star off">☆</span></div>
    <div class="d">Review this diff like a senior engineer. Flag correctness bugs, edge cases, and security issues before style…</div>
    <div class="meta"><span class="badge">Claude</span><span class="tag">#code</span><span class="date">1d ago</span></div>
  </div>
  <div class="card">
    <div class="t"><b>Cold email rewrite</b><span class="star off">☆</span></div>
    <div class="d">Rewrite this cold email to be concise, specific, and reply-worthy. Keep it under 90 words with one clear CTA…</div>
    <div class="meta"><span class="badge">Gemini</span><span class="tag">#sales</span><span class="date">3d ago</span></div>
  </div>
</div>"""


def scene(name, w, h, body, css=""):
    html = f"""<!DOCTYPE html><html><head><meta charset="utf-8"><style>
{BASE}
html,body{{width:{w}px;height:{h}px;}}
.stage{{width:{w}px;height:{h}px;}}
{css}
</style></head><body><div class="stage">{body}</div></body></html>"""
    with open(os.path.join(OUT, name), "w") as f:
        f.write(html)
    print(name)


# ---------- Screenshot 1: hero ----------
scene("s1-hero.html", 1280, 800, f"""
  <div class="bg"></div>
  <div class="wrap">
    <div class="left">
      <div class="logo"><div class="mark">{BOOKMARK}</div><span>PromptVault</span></div>
      <h1>Save your best<br><span class="grad-text">AI prompts.</span></h1>
      <p>One click to capture any prompt from Claude, ChatGPT, Gemini and more — with its <b>title</b>, <b>text</b>, and <b>source link</b>, neatly organized and always a click away.</p>
      <div class="pills"><span>Claude</span><span>ChatGPT</span><span>Gemini</span><span>Perplexity</span><span>+ more</span></div>
    </div>
    <div class="right">{popup_mock()}</div>
  </div>
""", css="""
.bg{position:absolute;inset:0;background:radial-gradient(1100px 700px at 78% 15%,#ede9fe,#eff2ff 55%,#f7f8fd);}
.wrap{position:absolute;inset:0;display:flex;align-items:center;padding:0 70px;gap:40px;}
.left{flex:1;}
.logo{display:flex;align-items:center;gap:12px;margin-bottom:30px;}
.logo .mark{width:44px;height:44px;}.logo .mark svg{width:24px;height:24px;}
.logo span{font-size:22px;font-weight:700;color:#2a2350;}
h1{font-size:62px;line-height:1.05;font-weight:800;color:#1e1b3a;letter-spacing:-1.5px;}
.left p{font-size:20px;line-height:1.55;color:#5a5570;margin:26px 0 30px;max-width:520px;}
.left p b{color:#4c46c9;font-weight:700;}
.pills{display:flex;gap:10px;flex-wrap:wrap;}
.pills span{font-size:14px;font-weight:600;color:#5b57b8;background:#fff;border:1px solid #e0dcfa;border-radius:999px;padding:8px 16px;box-shadow:0 2px 6px rgba(80,70,160,.06);}
.right{width:384px;display:grid;place-items:center;transform:rotate(1.2deg);}
""")

# ---------- Screenshot 2: in-page save panel ----------
PANEL = f"""
<div class="panel">
  <div class="ph">{BOOKMARK}<b>Save prompt</b><span class="x">✕</span></div>
  <div class="pb">
    <div class="lbl">TITLE</div>
    <div class="inp">Product launch tweet thread</div>
    <div class="lbl">PROMPT</div>
    <div class="ta">Write a punchy 6-tweet launch thread for a new Chrome extension. Hook in tweet 1, one benefit per tweet, casual founder voice, end with a CTA to install…</div>
    <div class="src">🔗 Source: chatgpt.com</div>
    <div class="pact"><span>Cancel</span><span class="c">Save prompt</span></div>
  </div>
</div>"""
scene("s2-inpage.html", 1280, 800, f"""
  <div class="chatbg">
    <div class="topbar"><span class="dotr"></span><span class="doty"></span><span class="dotg"></span><div class="url">chatgpt.com</div></div>
    <div class="chat">
      <div class="row user"><div class="bub">Help me write a launch thread for my new extension.</div></div>
      <div class="row ai"><div class="av">AI</div><div class="bub ai">Absolutely — here's a 6-tweet thread you can tweak…</div></div>
      <div class="composer">Message… <span class="send">➤</span></div>
    </div>
  </div>
  <div class="cap"><b>Save without leaving the chat.</b> A floating button on every AI site captures the prompt in one click.</div>
  <div class="fab">{BOOKMARK}</div>
  {PANEL}
""", css="""
.chatbg{position:absolute;inset:0;background:#f2f3f7;}
.topbar{height:44px;background:#fff;border-bottom:1px solid #e6e8ee;display:flex;align-items:center;gap:8px;padding:0 16px;}
.topbar span{width:12px;height:12px;border-radius:50%;}
.dotr{background:#ff5f57;}.doty{background:#febc2e;}.dotg{background:#28c840;}
.url{margin-left:14px;background:#f0f1f5;border-radius:8px;padding:5px 16px;font-size:13px;color:#8a8f9c;flex:1;max-width:420px;}
.chat{padding:36px 90px;}
.row{display:flex;margin-bottom:20px;}
.row.user{justify-content:flex-end;}
.bub{max-width:560px;padding:14px 18px;border-radius:16px;font-size:16px;line-height:1.5;background:#6366f1;color:#fff;}
.bub.ai{background:#fff;color:#2b2f3a;border:1px solid #e6e8ee;}
.row.ai{gap:12px;align-items:flex-start;}
.av{width:38px;height:38px;border-radius:10px;background:linear-gradient(135deg,#10a37f,#0e8f6f);color:#fff;display:grid;place-items:center;font-size:13px;font-weight:700;flex:none;}
.composer{margin:40px 0 0;background:#fff;border:1px solid #e0e2ea;border-radius:16px;padding:18px 20px;font-size:16px;color:#9aa0ad;display:flex;align-items:center;box-shadow:0 6px 20px rgba(40,40,80,.06);}
.send{margin-left:auto;color:#c7cad3;}
.cap{position:absolute;left:90px;bottom:46px;font-size:19px;color:#3a3550;background:rgba(255,255,255,.82);backdrop-filter:blur(4px);padding:14px 20px;border-radius:14px;box-shadow:0 8px 24px rgba(60,50,120,.12);max-width:640px;}
.cap b{color:#4c46c9;}
.fab{position:absolute;right:40px;bottom:40px;width:56px;height:56px;border-radius:16px;background:linear-gradient(135deg,#6366f1,#8b5cf6);display:grid;place-items:center;box-shadow:0 10px 28px rgba(79,70,229,.5);}
.fab svg{width:28px;height:28px;}
.panel{position:absolute;right:40px;bottom:112px;width:380px;background:#fff;border-radius:18px;overflow:hidden;box-shadow:0 34px 80px rgba(50,40,120,.32);border:1px solid rgba(20,20,50,.06);}
.ph{display:flex;align-items:center;gap:9px;padding:15px 17px;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;font-size:15px;}
.ph svg{width:20px;height:20px;}.ph b{flex:1;}.ph .x{opacity:.85;}
.pb{padding:16px 17px;}
.lbl{font-size:11px;font-weight:700;letter-spacing:.5px;color:#8a8f9c;margin:0 0 6px;}
.inp{border:1px solid #e2e5ec;border-radius:10px;padding:11px 12px;font-size:14px;color:#1f2430;margin-bottom:14px;background:#fafbfc;}
.ta{border:1.5px solid #8b5cf6;border-radius:10px;padding:11px 12px;font-size:13.5px;color:#33384a;line-height:1.5;background:#fff;box-shadow:0 0 0 3px rgba(139,92,246,.12);}
.src{display:flex;align-items:center;gap:6px;font-size:12.5px;color:#7b8090;background:#f3f4f6;border-radius:9px;padding:9px 11px;margin:14px 0;}
.pact{display:flex;gap:9px;}
.pact span{flex:1;text-align:center;font-size:13px;font-weight:700;padding:11px 0;border-radius:10px;background:#f1f2f6;color:#5a6070;}
.pact span.c{background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;}
""")

# ---------- Screenshot 3: library / search ----------
scene("s3-library.html", 1280, 800, f"""
  <div class="bg"></div>
  <div class="wrap">
    <div class="right">{popup_mock()}</div>
    <div class="left">
      <h1>Your whole prompt<br><span class="grad-text">library, searchable.</span></h1>
      <p>Every saved prompt in one tidy list. Search by text, filter favorites, tag by project, and <b>copy to clipboard</b> in a single click.</p>
      <ul>
        <li><i></i> Instant full-text search</li>
        <li><i></i> Star favorites & tag by project</li>
        <li><i></i> One-click copy, edit, or open source</li>
      </ul>
    </div>
  </div>
""", css="""
.bg{position:absolute;inset:0;background:radial-gradient(1100px 700px at 22% 20%,#ede9fe,#eff2ff 55%,#f7f8fd);}
.wrap{position:absolute;inset:0;display:flex;align-items:center;padding:0 80px;gap:60px;}
.right{width:384px;display:grid;place-items:center;transform:rotate(-1.2deg);}
.left{flex:1;}
h1{font-size:56px;line-height:1.06;font-weight:800;color:#1e1b3a;letter-spacing:-1.3px;}
.left p{font-size:19px;line-height:1.55;color:#5a5570;margin:24px 0 26px;max-width:470px;}
.left p b{color:#4c46c9;}
ul{list-style:none;}
li{display:flex;align-items:center;gap:12px;font-size:17px;color:#3f3a5a;font-weight:500;margin:14px 0;}
li i{width:22px;height:22px;border-radius:50%;background:linear-gradient(135deg,#6366f1,#8b5cf6);flex:none;position:relative;}
li i::after{content:"✓";position:absolute;inset:0;display:grid;place-items:center;color:#fff;font-size:13px;font-weight:800;}
""")

# ---------- Screenshot 4: right-click ----------
scene("s4-context.html", 1280, 800, f"""
  <div class="bg"></div>
  <div class="cap"><b>Right-click to save anything.</b> Select text on any page and store it as a prompt instantly.</div>
  <div class="doc">
    <p>System prompt for the research agent:</p>
    <p class="sel">You are a meticulous research analyst. For every claim, cite a primary source, flag uncertainty explicitly, and never fabricate references.</p>
    <div class="menu">
      <div class="mi">Copy</div>
      <div class="mi">Search the web</div>
      <div class="mi hot"><span class="mm">{BOOKMARK}</span> Save selection as prompt</div>
      <div class="mi">Print…</div>
      <div class="mi">Inspect</div>
    </div>
  </div>
""", css="""
.bg{position:absolute;inset:0;background:linear-gradient(160deg,#f7f8fd,#eef0fb);}
.cap{position:absolute;left:90px;top:70px;font-size:26px;color:#3a3550;max-width:760px;line-height:1.4;}
.cap b{color:#4c46c9;}
.doc{position:absolute;left:90px;top:200px;right:90px;background:#fff;border-radius:18px;padding:44px 54px;box-shadow:0 24px 60px rgba(60,50,120,.14);border:1px solid #eceef2;}
.doc p{font-size:21px;line-height:1.65;color:#3a3f4d;margin-bottom:18px;}
.sel{background:#b7c6ff;color:#10204a !important;display:inline;padding:2px 0;box-shadow:6px 0 0 #b7c6ff,-6px 0 0 #b7c6ff;}
.menu{position:absolute;left:60px;top:210px;width:290px;background:#fff;border-radius:12px;padding:7px;box-shadow:0 22px 50px rgba(20,20,50,.28);border:1px solid #e6e8ee;}
.mi{padding:10px 14px;font-size:15px;color:#3a3f4d;border-radius:8px;display:flex;align-items:center;gap:10px;}
.mi.hot{background:linear-gradient(135deg,#eef0ff,#f3edff);color:#4c46c9;font-weight:700;}
.mm{width:24px;height:24px;border-radius:7px;background:linear-gradient(135deg,#6366f1,#8b5cf6);display:grid;place-items:center;}
.mm svg{width:14px;height:14px;}
""")

# ---------- Screenshot 5: privacy / everywhere ----------
scene("s5-privacy.html", 1280, 800, f"""
  <div class="bg"></div>
  <div class="center">
    <div class="mark big">{BOOKMARK}</div>
    <h1>Private by design.<br><span class="grad-text">Yours to keep.</span></h1>
    <div class="cards">
      <div class="c"><div class="ci">🔒</div><b>Stored locally</b><span>Prompts live in your browser. No account, no sign-in.</span></div>
      <div class="c"><div class="ci">🚫</div><b>Zero tracking</b><span>Nothing is sent to any server. No analytics, ever.</span></div>
      <div class="c"><div class="ci">💾</div><b>Export anytime</b><span>Back up or move your library with one-click JSON export.</span></div>
    </div>
    <div class="works">Works on <b>Claude · ChatGPT · Gemini · Perplexity · Copilot · DeepSeek · Grok · Mistral</b> — and everywhere else via right-click.</div>
  </div>
""", css="""
.bg{position:absolute;inset:0;background:radial-gradient(900px 600px at 50% 0%,#ede9fe,#f7f8fd 60%);}
.center{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:0 80px;}
.mark.big{width:76px;height:76px;margin-bottom:24px;}.mark.big svg{width:40px;height:40px;}
h1{font-size:52px;line-height:1.08;font-weight:800;color:#1e1b3a;letter-spacing:-1.2px;}
.cards{display:flex;gap:22px;margin:44px 0 36px;}
.c{width:280px;background:#fff;border:1px solid #ece9fb;border-radius:18px;padding:26px 24px;box-shadow:0 10px 30px rgba(80,70,160,.08);text-align:left;}
.ci{font-size:30px;margin-bottom:14px;}
.c b{display:block;font-size:19px;color:#221d44;margin-bottom:8px;}
.c span{font-size:14.5px;color:#65607e;line-height:1.5;}
.works{font-size:17px;color:#5a5570;}
.works b{color:#4c46c9;font-weight:700;}
""")

# ---------- Small promo tile 440x280 ----------
scene("promo-small.html", 440, 280, f"""
  <div class="bg"></div>
  <div class="c">
    <div class="mark">{BOOKMARK}</div>
    <div class="name">PromptVault</div>
    <div class="tag">Save prompts from any AI chat</div>
  </div>
""", css="""
.bg{position:absolute;inset:0;background:linear-gradient(135deg,#6366f1,#8b5cf6);}
.c{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;}
.mark{width:74px;height:74px;background:rgba(255,255,255,.16);border-radius:20px;}
.mark svg{width:40px;height:40px;}
.name{font-size:38px;font-weight:800;color:#fff;margin-top:18px;letter-spacing:-.5px;}
.tag{font-size:16px;color:rgba(255,255,255,.9);margin-top:6px;}
""")

# ---------- Marquee 1400x560 ----------
scene("promo-marquee.html", 1400, 560, f"""
  <div class="bg"></div>
  <div class="blob"></div>
  <div class="wrap">
    <div class="left">
      <div class="logo"><div class="mark">{BOOKMARK}</div><span>PromptVault</span></div>
      <h1>Save your best AI prompts.</h1>
      <p>One click to capture any prompt — title, text and source — from Claude, ChatGPT, Gemini and more.</p>
    </div>
    <div class="right">{popup_mock()}</div>
  </div>
""", css="""
.bg{position:absolute;inset:0;background:linear-gradient(120deg,#4f46e5,#7c3aed 55%,#8b5cf6);}
.blob{position:absolute;right:-120px;top:-120px;width:620px;height:620px;border-radius:50%;background:radial-gradient(circle,rgba(255,255,255,.14),transparent 65%);}
.wrap{position:absolute;inset:0;display:flex;align-items:center;padding:0 90px;gap:60px;}
.left{flex:1;color:#fff;}
.logo{display:flex;align-items:center;gap:13px;margin-bottom:26px;}
.logo .mark{width:46px;height:46px;background:rgba(255,255,255,.18);}
.logo .mark svg{width:26px;height:26px;}
.logo span{font-size:24px;font-weight:700;}
h1{font-size:60px;font-weight:800;letter-spacing:-1.4px;line-height:1.05;}
.left p{font-size:22px;line-height:1.5;color:rgba(255,255,255,.92);margin-top:22px;max-width:560px;}
.right{width:384px;display:grid;place-items:center;transform:rotate(1.5deg) scale(1.04);}
""")

print("all scenes written to", OUT)
