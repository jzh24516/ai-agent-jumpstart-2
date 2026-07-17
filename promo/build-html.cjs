// Builds a single self-contained HTML deck with screenshots embedded as base64.
const fs = require('fs')
const path = require('path')

const imgDir = path.join(__dirname, 'img')
const b64 = (name) => {
  const p = path.join(imgDir, name)
  if (!fs.existsSync(p)) return ''
  return 'data:image/png;base64,' + fs.readFileSync(p).toString('base64')
}
const IMG = {
  cover: b64('cover-en.png'),
  coverJa: b64('cover-ja.png'),
  lab: b64('lab-overview.png'),
  labEn: b64('lab-en.png'),
  labZh: b64('lab-zh.png'),
  coverLenovo: b64('cover-lenovo.png'),
  branding: b64('branding.png'),
  avatar: b64('michael.png'),
}

const slides = /* html */ `
<!-- 1. COVER -->
<section class="slide cover" data-title="Cover">
  <div class="orb o1"></div><div class="orb o2"></div><div class="orb o3"></div>
  <div class="cover-wrap">
    <div class="badge"><span class="dot"></span> Microsoft Copilot Studio</div>
    <h1 class="hero">AI Agent JumpStart<br><span class="grad">Workshop v2</span></h1>
    <p class="lede">A hands-on, self-guided, multilingual lab experience for building the full breadth of custom agents in Microsoft Copilot Studio.</p>
    <div class="cover-meta">
      <span>Microsoft MCAPS Core &mdash; Agent Asia Team</span><span class="sep">&middot;</span><span>July 16, 2026</span>
    </div>
    <div class="pillrow">
      <span class="pill">6 guided labs</span>
      <span class="pill">29 steps</span>
      <span class="pill">4 languages</span>
      <span class="pill">1 shareable link</span>
    </div>
  </div>
  <img class="cover-shot" src="${IMG.cover}" alt="JumpStart cover page" />
</section>

<!-- 2. WHAT IT IS -->
<section class="slide" data-title="What it is">
  <div class="s-head"><span class="kicker">🎬 The one-liner</span><h2>A workshop that runs itself &mdash; <span class="grad">learners just press play</span> ▶️</h2></div>
  <div class="two">
    <div class="col">
      <p class="big">JumpStart v2 turns a slide-and-demo session into a <b>living, do-it-yourself lab app</b>. Attendees open one link, pick their language, and build real agents step by step &mdash; while you facilitate instead of babysit.</p>
      <ul class="ticks emo">
        <li><span class="e">🖥️</span> Self-paced, browser-based, zero install</li>
        <li><span class="e">📋</span> Every step is copy-ready and screenshot-guided</li>
        <li><span class="e">🤝</span> Works for internal enablement <b>and</b> customer workshops</li>
      </ul>
    </div>
    <div class="col stats">
      <div class="stat"><div class="se">🧪</div><div class="num">6</div><div class="lbl">hands-on labs</div></div>
      <div class="stat"><div class="se">👣</div><div class="num">29</div><div class="lbl">guided steps</div></div>
      <div class="stat"><div class="se">🌍</div><div class="num">4</div><div class="lbl">languages</div></div>
      <div class="stat"><div class="se">🔁</div><div class="num">&infin;</div><div class="lbl">reuse, any customer</div></div>
    </div>
  </div>
</section>

<!-- 3. THE 6 LABS -->
<section class="slide" data-title="The 6 labs">
  <div class="s-head"><span class="kicker">🧭 The learning path</span><h2>Six labs, from first agent to <span class="grad">real-time voice</span> 🎙️</h2></div>
  <div class="labgrid">
    <div class="labcard"><div class="li"><span class="le">🤖</span>01</div><h3>Meet the Agent Maker</h3><p>Build a grounded, multilingual agent with Microsoft.com + Microsoft Learn MCP.</p></div>
    <div class="labcard"><div class="li"><span class="le">🗂️</span>02</div><h3>Bring in business context</h3><p>Dataverse MCP, reusable Skills, Memory, and a CoWork customer-360 workflow.</p></div>
    <div class="labcard"><div class="li"><span class="le">📝</span>03</div><h3>Evidence-based RFP</h3><p>Work IQ + Microsoft IQ generate sourced RFP/RFI responses across Office.</p></div>
    <div class="labcard"><div class="li"><span class="le">🔌</span>04</div><h3>Connect specialist agents</h3><p>ServiceNow knowledge + tickets, connected agents, Teams &amp; M365 Copilot.</p></div>
    <div class="labcard"><div class="li"><span class="le">📨</span>05</div><h3>Multi-agent email Workflow</h3><p>Classify inbound email &rarr; route to the right agent &rarr; personalized reply.</p></div>
    <div class="labcard"><div class="li"><span class="le">🎙️</span>06</div><h3>Real-time voice agent</h3><p>Classic agent + real-time voice, multilingual, tested live in the Test window.</p></div>
  </div>
</section>

<!-- 4. MULTILINGUAL -->
<section class="slide" data-title="Multilingual">
  <div class="s-head"><span class="kicker">Unique feature 01</span><h2>Multilingual <span class="grad">by design</span></h2></div>
  <div class="two wide-left">
    <div class="col">
      <p class="big">One click switches the <b>entire lab experience</b> — the same page, instructions, sidebar, and UI — between <b>English, 中文, 日本語, 한국어</b>.</p>
      <ul class="ticks">
        <li>Product names, prompts &amp; tool names stay in English on purpose</li>
        <li>Copy-ready prompts never get "lost in translation"</li>
        <li>Screenshots fall back to English automatically when a localized one isn't provided</li>
      </ul>
      <div class="chips"><span>EN</span><span>中文</span><span>日本語</span><span>한국어</span></div>
    </div>
    <div class="col shots2">
      <img src="${IMG.labEn}" alt="Lab 1 in English" />
      <img src="${IMG.labZh}" alt="Lab 1 in Chinese" />
    </div>
  </div>
</section>

<!-- 5. LEARN BY DOING -->
<section class="slide" data-title="Learn by doing">
  <div class="s-head"><span class="kicker">Unique feature 02</span><h2>A learn-by-doing UX that's <span class="grad">actually joyful</span></h2></div>
  <div class="two">
    <div class="col feat">
      <div class="frow"><div class="fi">✦</div><div><b>Markdown-rich steps</b><span>Headings, tables, callouts &amp; highlights render beautifully.</span></div></div>
      <div class="frow"><div class="fi">⧉</div><div><b>Copy-ready prompts</b><span>Every instruction is one click to clipboard.</span></div></div>
      <div class="frow"><div class="fi">◒</div><div><b>Progress tracking</b><span>Per-step completion across all 29 steps, saved locally.</span></div></div>
      <div class="frow"><div class="fi">✺</div><div><b>Fireworks on completion</b><span>A celebratory burst rewards every finished step.</span></div></div>
      <div class="frow"><div class="fi">◐</div><div><b>Glass UI, light &amp; dark</b><span>Modern frosted-glass design, theme-aware everywhere.</span></div></div>
    </div>
    <div class="col"><img class="framed" src="${IMG.lab}" alt="Lab overview" /></div>
  </div>
</section>

<!-- 6. CO-BRANDING -->
<section class="slide" data-title="Co-branding">
  <div class="s-head"><span class="kicker">Unique feature 03</span><h2>Co-brand a <span class="grad">dedicated workshop</span> in seconds</h2></div>
  <div class="two wide-right">
    <div class="col"><img class="framed" src="${IMG.coverLenovo}" alt="Microsoft x Lenovo co-branded cover" /></div>
    <div class="col feat">
      <div class="frow"><div class="fi">◇</div><div><b>Microsoft &times; Customer</b><span>Set a customer name or logo &mdash; the cover instantly co-brands.</span></div></div>
      <div class="frow"><div class="fi">⤓</div><div><b>Save &amp; reuse</b><span>Workshop history: save, retrieve, and quick-search past setups.</span></div></div>
      <div class="frow"><div class="fi">⌘</div><div><b>Logos by URL or upload</b><span>Self-contained &mdash; no external image hosting needed.</span></div></div>
      <div class="frow"><div class="fi">🔒</div><div><b>Password-gated</b><span>Only facilitators can change branding &mdash; same gate as edit mode.</span></div></div>
    </div>
  </div>
</section>

<!-- 7. PUBLISH ONCE -->
<section class="slide" data-title="Publish once">
  <div class="s-head"><span class="kicker">Unique feature 04</span><h2>Publish once &mdash; <span class="grad">everyone sees it</span></h2></div>
  <div class="flow">
    <div class="fstep"><div class="fnum">1</div><b>Configure locally</b><span>Set branding &amp; edit lab content in the maker view.</span></div>
    <div class="farrow">&rarr;</div>
    <div class="fstep"><div class="fnum">2</div><b>Apply &amp; commit</b><span>Branding &amp; content ship as <code>branding.json</code> + <code>labs.json</code>.</span></div>
    <div class="farrow">&rarr;</div>
    <div class="fstep"><div class="fnum">3</div><b>Auto-deploy</b><span>GitHub Actions builds &amp; publishes to GitHub Pages on every push.</span></div>
    <div class="farrow">&rarr;</div>
    <div class="fstep hot"><div class="fnum">4</div><b>Everyone sees it</b><span>Attendees open the live URL &mdash; same content, same brand.</span></div>
  </div>
  <p class="note">No per-user setup. The published files are the single source of truth for every visitor.</p>
</section>

<!-- 8. HOW TO RUN -->
<section class="slide" data-title="How to run">
  <div class="s-head"><span class="kicker">For your attendees</span><h2>Running it is <span class="grad">three steps</span></h2></div>
  <div class="flow big3">
    <div class="fstep"><div class="fnum">1</div><b>Open the link</b><span>One URL, any modern browser. No install, no sign-in to start.</span></div>
    <div class="farrow">&rarr;</div>
    <div class="fstep"><div class="fnum">2</div><b>Pick a language</b><span>Switch to EN / 中文 / 日本語 / 한국어 on the cover.</span></div>
    <div class="farrow">&rarr;</div>
    <div class="fstep"><div class="fnum">3</div><b>Enter &amp; build</b><span>Work lab by lab, copy prompts, track progress, celebrate.</span></div>
  </div>
  <div class="urlbar"><span class="urllbl">Live workshop</span><code>https://jzh24516.github.io/ai-agent-jumpstart-2/</code></div>
</section>

<!-- 9. CLOSING -->
<section class="slide closing" data-title="Bring it to your workshop">
  <div class="orb o1"></div><div class="orb o2"></div>
  <div class="close-grid">
    <div class="close-wrap">
      <div class="badge"><span class="dot"></span> Ready when you are</div>
      <h2 class="hero sm">Bring JumpStart v2 to your<br><span class="grad">next customer workshop</span></h2>
      <p class="lede">Internal enablement or external customer event &mdash; co-brand it, share the link, and let attendees build real agents hands-on.</p>
      <div class="contacts">
        <a href="mailto:zhijian@microsoft.com"><b>Michael Jiang</b><span>zhijian@microsoft.com</span></a>
      </div>
      <div class="madeby">Microsoft MCAPS Core &mdash; Agent Asia Team</div>
    </div>
    <div class="close-avatar">
      <img src="${IMG.avatar}" alt="Michael Jiang" />
      <b>Michael Jiang</b>
      <span>Microsoft MCAPS Core &mdash; Agent Asia Team</span>
    </div>
  </div>
</section>
`

const html = /* html */ `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>AI Agent JumpStart Workshop v2 — Highlights</title>
<style>
  :root{
    --bg:#0f0d1a; --bg2:#171430; --card:rgba(255,255,255,.05); --cardbrd:rgba(255,255,255,.12);
    --txt:#ECECF5; --muted:#A9A7C0; --purple:#a78bfa; --pink:#f472b6; --cyan:#22d3ee;
    --grad:linear-gradient(115deg,#a78bfa 0%,#f472b6 52%,#22d3ee 100%);
    --glow:0 24px 70px rgba(124,58,237,.35);
  }
  *{box-sizing:border-box;margin:0;padding:0}
  html,body{height:100%}
  body{background:var(--bg);color:var(--txt);font-family:"Segoe UI",system-ui,-apple-system,Roboto,Helvetica,Arial,"Microsoft YaHei","Yu Gothic","Malgun Gothic",sans-serif;overflow:hidden}
  #stage{position:fixed;inset:0;display:grid;place-items:center;background:
    radial-gradient(60vmax 60vmax at 12% -8%,rgba(124,58,237,.30),transparent 60%),
    radial-gradient(55vmax 55vmax at 108% 118%,rgba(236,72,153,.26),transparent 60%),
    var(--bg)}
  .deck{position:relative;width:min(96vw,calc(96vh*16/9));aspect-ratio:16/9;
    background:linear-gradient(160deg,#151228,#0f0d1a);border:1px solid var(--cardbrd);
    border-radius:22px;overflow:hidden;box-shadow:0 40px 120px rgba(0,0,0,.6)}
  .slide{position:absolute;inset:0;padding:5.2% 6%;display:none;flex-direction:column;
    animation:fade .5s ease both}
  .slide.active{display:flex}
  @keyframes fade{from{opacity:0;transform:translateY(14px) scale(.995)}to{opacity:1;transform:none}}
  .grad{background:var(--grad);-webkit-background-clip:text;background-clip:text;color:transparent}

  /* headings */
  .s-head{margin-bottom:3.4%}
  .kicker{display:inline-block;font-size:.92rem;font-weight:800;letter-spacing:.16em;text-transform:uppercase;
    color:var(--purple);background:rgba(167,139,250,.14);border:1px solid var(--cardbrd);
    padding:7px 15px;border-radius:999px;margin-bottom:16px}
  h2{font-size:3rem;line-height:1.06;letter-spacing:-.02em;font-weight:800}
  .big{font-size:1.6rem;line-height:1.5;color:#DEDCEC}
  .note{margin-top:auto;color:var(--muted);font-size:1.2rem;padding-top:18px}

  /* cover */
  .cover{padding:0}
  .cover-wrap{position:absolute;inset:0;width:56%;padding:6% 0 6% 6%;display:flex;flex-direction:column;justify-content:center;z-index:2}
  .badge{display:inline-flex;align-items:center;gap:9px;align-self:flex-start;font-size:.82rem;font-weight:700;
    color:#E9E6FF;background:rgba(255,255,255,.06);border:1px solid var(--cardbrd);padding:8px 15px;border-radius:999px;margin-bottom:22px}
  .badge .dot{width:9px;height:9px;border-radius:50%;background:var(--grad)}
  .hero{font-size:4.1rem;line-height:1.02;letter-spacing:-.03em;font-weight:900}
  .hero.sm{font-size:3.1rem}
  .lede{margin-top:20px;max-width:30ch;color:#CFCDE0;font-size:1.18rem;line-height:1.5}
  .cover-meta{margin-top:22px;color:var(--muted);font-size:.98rem;display:flex;gap:10px;align-items:center}
  .cover-meta .sep{opacity:.5}
  .pillrow{display:flex;flex-wrap:wrap;gap:10px;margin-top:26px}
  .pill{font-size:.92rem;font-weight:700;color:#EFEDFA;background:rgba(255,255,255,.06);
    border:1px solid var(--cardbrd);padding:9px 15px;border-radius:12px}
  .cover-shot{position:absolute;right:-4%;top:50%;transform:translateY(-50%) rotate(2deg);
    width:52%;border-radius:16px;border:1px solid var(--cardbrd);box-shadow:var(--glow);z-index:1}

  /* two-col */
  .two{flex:1;display:grid;grid-template-columns:1fr 1fr;gap:5%;align-items:center}
  .two.wide-left{grid-template-columns:1.15fr .85fr}
  .two.wide-right{grid-template-columns:.85fr 1.15fr}
  .col{min-width:0}
  .ticks{list-style:none;margin-top:24px;display:flex;flex-direction:column;gap:16px}
  .ticks li{position:relative;padding-left:34px;color:#D7D5E6;font-size:1.3rem;line-height:1.45}
  .ticks li:before{content:"";position:absolute;left:0;top:.42em;width:17px;height:17px;border-radius:50%;
    background:var(--grad)}
  .chips{display:flex;gap:12px;margin-top:28px}
  .chips span{font-weight:800;font-size:1.2rem;color:#EFEDFA;background:rgba(167,139,250,.16);
    border:1px solid var(--cardbrd);padding:12px 20px;border-radius:13px}

  /* stats */
  .stats{display:grid;grid-template-columns:1fr 1fr;gap:18px}
  .stat{background:var(--card);border:1px solid var(--cardbrd);border-radius:18px;padding:26px 24px;text-align:center}
  .stat .se{font-size:2rem;line-height:1;margin-bottom:8px}
  .stat .num{font-size:4.4rem;font-weight:900;line-height:1;background:var(--grad);-webkit-background-clip:text;background-clip:text;color:transparent}
  .stat .lbl{margin-top:10px;color:var(--muted);font-weight:600;font-size:1.18rem}
  .ticks.emo li{padding-left:42px}
  .ticks.emo li:before{display:none}
  .ticks.emo .e{position:absolute;left:0;top:-.05em;font-size:1.5rem;line-height:1.45}

  /* lab grid */
  .labgrid{flex:1;display:grid;grid-template-columns:repeat(3,1fr);grid-auto-rows:1fr;gap:20px}
  .labcard{background:var(--card);border:1px solid var(--cardbrd);border-radius:16px;padding:26px 24px;
    display:flex;flex-direction:column;justify-content:center}
  .labcard .li{font-size:1.12rem;font-weight:900;color:var(--purple);letter-spacing:.06em;display:flex;align-items:center;gap:8px}
  .labcard .le{font-size:1.7rem;line-height:1}
  .labcard h3{margin-top:10px;font-size:1.42rem;font-weight:800;letter-spacing:-.01em}
  .labcard p{margin-top:10px;color:var(--muted);font-size:1.15rem;line-height:1.42}

  /* feature rows */
  .feat{display:flex;flex-direction:column;gap:20px}
  .frow{display:flex;gap:16px;align-items:flex-start}
  .frow .fi{flex:0 0 auto;width:50px;height:50px;display:grid;place-items:center;border-radius:13px;
    font-size:1.35rem;color:#fff;background:var(--grad);box-shadow:0 8px 22px rgba(124,58,237,.35)}
  .frow b{display:block;font-size:1.34rem}
  .frow span{display:block;color:var(--muted);font-size:1.16rem;line-height:1.4;margin-top:3px}

  /* images */
  .framed{width:100%;border-radius:14px;border:1px solid var(--cardbrd);box-shadow:var(--glow)}
  .shots2{display:grid;grid-template-columns:1fr 1fr;gap:14px;align-items:center}
  .shots2 img{width:100%;border-radius:12px;border:1px solid var(--cardbrd);box-shadow:0 16px 40px rgba(0,0,0,.4)}

  /* flow */
  .flow{flex:1;display:flex;align-items:center;justify-content:center;gap:16px}
  .flow.big3 .fstep{padding:34px 26px}
  .fstep{flex:1;background:var(--card);border:1px solid var(--cardbrd);border-radius:16px;padding:28px 22px;position:relative}
  .fstep.hot{background:linear-gradient(160deg,rgba(167,139,250,.22),rgba(236,72,153,.16));border-color:rgba(236,72,153,.4)}
  .fstep .fnum{width:42px;height:42px;display:grid;place-items:center;border-radius:12px;font-weight:900;font-size:1.25rem;color:#fff;background:var(--grad);margin-bottom:16px}
  .fstep b{font-size:1.36rem}
  .fstep span{display:block;color:var(--muted);font-size:1.16rem;line-height:1.4;margin-top:8px}
  .fstep code{color:#EFEDFA;background:rgba(255,255,255,.08);padding:1px 6px;border-radius:5px;font-size:.86em}
  .farrow{color:var(--purple);font-size:2rem;font-weight:900;flex:0 0 auto}
  .urlbar{margin-top:30px;display:flex;align-items:center;gap:16px;background:var(--card);border:1px solid var(--cardbrd);
    border-radius:14px;padding:22px 26px}
  .urlbar .urllbl{font-size:.9rem;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:var(--purple)}
  .urlbar code{font-size:1.55rem;color:#EFEDFA;font-weight:600}

  /* closing */
  .closing{align-items:center;justify-content:center}
  .close-grid{position:relative;z-index:2;width:100%;display:grid;grid-template-columns:1.35fr .75fr;gap:5%;align-items:center}
  .close-wrap{min-width:0}
  .close-avatar{display:flex;flex-direction:column;align-items:center;text-align:center;gap:12px}
  .close-avatar img{width:min(320px,90%);aspect-ratio:1;border-radius:50%;box-shadow:0 30px 80px rgba(124,58,237,.55)}
  .close-avatar b{font-size:1.5rem;margin-top:6px}
  .close-avatar span{color:var(--muted);font-size:1rem;max-width:22ch}
  .contacts{display:flex;gap:16px;margin-top:26px}
  .contacts a{text-decoration:none;background:var(--card);border:1px solid var(--cardbrd);border-radius:14px;
    padding:16px 22px;min-width:230px}
  .contacts b{display:block;color:var(--txt);font-size:1.06rem}
  .contacts span{display:block;color:var(--cyan);font-size:.95rem;margin-top:3px}
  .madeby{margin-top:26px;color:var(--muted);font-size:.95rem}

  /* orbs */
  .orb{position:absolute;border-radius:50%;filter:blur(70px);opacity:.5;z-index:0}
  .o1{width:34%;aspect-ratio:1;background:#7c3aed;top:-10%;left:-6%}
  .o2{width:30%;aspect-ratio:1;background:#ec4899;bottom:-14%;right:-6%}
  .o3{width:22%;aspect-ratio:1;background:#06b6d4;bottom:8%;left:40%;opacity:.32}

  /* chrome */
  .chrome{position:fixed;left:0;right:0;bottom:18px;display:flex;align-items:center;justify-content:center;gap:16px;z-index:50}
  .nav{display:flex;align-items:center;gap:8px;background:rgba(20,18,32,.82);border:1px solid var(--cardbrd);
    border-radius:999px;padding:8px 10px;backdrop-filter:blur(10px)}
  .nav button{width:38px;height:38px;border-radius:50%;border:1px solid var(--cardbrd);background:rgba(255,255,255,.05);
    color:var(--txt);font-size:1.1rem;cursor:pointer;display:grid;place-items:center;transition:.15s}
  .nav button:hover{border-color:var(--purple);color:var(--purple)}
  .dots{display:flex;gap:7px;padding:0 6px}
  .dots i{width:8px;height:8px;border-radius:50%;background:rgba(255,255,255,.22);cursor:pointer;transition:.2s}
  .dots i.on{background:var(--grad);width:22px;border-radius:6px}
  .count{color:var(--muted);font-size:.9rem;font-variant-numeric:tabular-nums;min-width:44px;text-align:center}
  .pbar{position:fixed;top:0;left:0;height:3px;background:var(--grad);z-index:60;transition:width .35s ease}
  .fs{position:fixed;top:16px;right:16px;z-index:60;width:40px;height:40px;border-radius:11px;border:1px solid var(--cardbrd);
    background:rgba(20,18,32,.7);color:var(--txt);cursor:pointer;font-size:1.05rem;backdrop-filter:blur(8px)}
  .hint{position:fixed;top:18px;left:18px;z-index:60;color:var(--muted);font-size:.82rem;opacity:.7}
  @media (max-width:640px){h2{font-size:1.7rem}.hero{font-size:2.5rem}.two,.labgrid{grid-template-columns:1fr}.cover-shot{display:none}.cover-wrap{width:100%}}
</style>
</head>
<body>
  <div class="pbar" id="pbar"></div>
  <button class="fs" id="fs" title="Fullscreen (F)">⛶</button>
  <div class="hint">← → to navigate · F fullscreen</div>
  <div id="stage"><div class="deck" id="deck">${slides}</div></div>
  <div class="chrome">
    <div class="nav">
      <button id="prev" title="Previous (←)">‹</button>
      <div class="dots" id="dots"></div>
      <button id="next" title="Next (→)">›</button>
    </div>
    <div class="count" id="count"></div>
  </div>
<script>
  const slides=[...document.querySelectorAll('.slide')];
  const dots=document.getElementById('dots');
  const count=document.getElementById('count');
  const pbar=document.getElementById('pbar');
  let i=0;
  slides.forEach((s,n)=>{const d=document.createElement('i');d.onclick=()=>go(n);dots.appendChild(d);});
  const dotEls=[...dots.children];
  function go(n){
    i=Math.max(0,Math.min(slides.length-1,n));
    slides.forEach((s,k)=>s.classList.toggle('active',k===i));
    dotEls.forEach((d,k)=>d.classList.toggle('on',k===i));
    count.textContent=(i+1)+' / '+slides.length;
    pbar.style.width=((i+1)/slides.length*100)+'%';
    history.replaceState(null,'','#'+(i+1));
  }
  document.getElementById('next').onclick=()=>go(i+1);
  document.getElementById('prev').onclick=()=>go(i-1);
  document.getElementById('fs').onclick=()=>{document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen();};
  addEventListener('keydown',e=>{
    if(e.key==='ArrowRight'||e.key==='PageDown'||e.key===' ')go(i+1);
    else if(e.key==='ArrowLeft'||e.key==='PageUp')go(i-1);
    else if(e.key==='Home')go(0);
    else if(e.key==='End')go(slides.length-1);
    else if(e.key.toLowerCase()==='f')document.getElementById('fs').click();
  });
  const start=Math.max(0,(parseInt(location.hash.slice(1))||1)-1);
  go(start);
  addEventListener('hashchange',()=>{const n=(parseInt(location.hash.slice(1))||1)-1;if(n!==i)go(n);});
</script>
</body>
</html>`

const out = path.join(__dirname, 'JumpStart-v2-Workshop-Highlights.html')
const publicOut = path.join(__dirname, '..', 'public', 'promo', 'JumpStart-v2-Workshop-Highlights.html')
fs.writeFileSync(out, html, 'utf8')
fs.mkdirSync(path.dirname(publicOut), { recursive: true })
fs.writeFileSync(publicOut, html, 'utf8')
console.log('HTML deck written:', out, 'and', publicOut, '(' + Math.round(html.length / 1024) + ' KB)')
