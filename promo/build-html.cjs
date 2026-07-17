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
    <p class="lede" data-i18n="c.lede">A hands-on, self-guided, multilingual lab experience for building the full breadth of custom agents in Microsoft Copilot Studio.</p>
    <div class="cover-meta">
      <span>Microsoft MCAPS Core &mdash; Agent Asia Team</span><span class="sep">&middot;</span><span>July 16, 2026</span>
    </div>
    <div class="pillrow">
      <span class="pill" data-i18n="c.p1">6 guided labs</span>
      <span class="pill" data-i18n="c.p2">29 steps</span>
      <span class="pill" data-i18n="c.p3">4 languages</span>
      <span class="pill" data-i18n="c.p4">1 shareable link</span>
    </div>
  </div>
  <img class="cover-shot" src="${IMG.cover}" alt="JumpStart cover page" />
</section>

<!-- 2. WHAT IT IS -->
<section class="slide" data-title="What it is">
  <div class="s-head"><span class="kicker" data-i18n="s2.k">🎬 The one-liner</span><h2 data-i18n="s2.h">A workshop that runs itself &mdash; <span class="grad">learners just press play</span> ▶️</h2></div>
  <div class="two">
    <div class="col">
      <p class="big" data-i18n="s2.big">JumpStart v2 turns a slide-and-demo session into a <b>living, do-it-yourself lab app</b>. Attendees open one link, pick their language, and build real agents step by step &mdash; while you facilitate instead of babysit.</p>
      <ul class="ticks emo">
        <li data-i18n="s2.t1"><span class="e">🖥️</span> Self-paced, browser-based, zero install</li>
        <li data-i18n="s2.t2"><span class="e">📋</span> Every step is copy-ready and screenshot-guided</li>
        <li data-i18n="s2.t3"><span class="e">🤝</span> Works for internal enablement <b>and</b> customer workshops</li>
      </ul>
    </div>
    <div class="col stats">
      <div class="stat"><div class="se">🧪</div><div class="num">6</div><div class="lbl" data-i18n="s2.l1">hands-on labs</div></div>
      <div class="stat"><div class="se">👣</div><div class="num">29</div><div class="lbl" data-i18n="s2.l2">guided steps</div></div>
      <div class="stat"><div class="se">🌍</div><div class="num">4</div><div class="lbl" data-i18n="s2.l3">languages</div></div>
      <div class="stat"><div class="se">🔁</div><div class="num">&infin;</div><div class="lbl" data-i18n="s2.l4">reuse, any customer</div></div>
    </div>
  </div>
</section>

<!-- 3. THE 6 LABS -->
<section class="slide" data-title="The 6 labs">
  <div class="s-head"><span class="kicker" data-i18n="s3.k">🧭 The learning path</span><h2 data-i18n="s3.h">Six labs, from first agent to <span class="grad">real-time voice</span> 🎙️</h2></div>
  <div class="labgrid">
    <div class="labcard"><div class="li"><span class="le">🤖</span>01</div><h3 data-i18n="s3.t1">Meet the Agent Maker</h3><p data-i18n="s3.d1">Build a grounded, multilingual agent with Microsoft.com + Microsoft Learn MCP.</p></div>
    <div class="labcard"><div class="li"><span class="le">🗂️</span>02</div><h3 data-i18n="s3.t2">Bring in business context</h3><p data-i18n="s3.d2">Dataverse MCP, reusable Skills, Memory, and a CoWork customer-360 workflow.</p></div>
    <div class="labcard"><div class="li"><span class="le">📝</span>03</div><h3 data-i18n="s3.t3">Evidence-based RFP</h3><p data-i18n="s3.d3">Work IQ + Microsoft IQ generate sourced RFP/RFI responses across Office.</p></div>
    <div class="labcard"><div class="li"><span class="le">🔌</span>04</div><h3 data-i18n="s3.t4">Connect specialist agents</h3><p data-i18n="s3.d4">ServiceNow knowledge + tickets, connected agents, Teams &amp; M365 Copilot.</p></div>
    <div class="labcard"><div class="li"><span class="le">📨</span>05</div><h3 data-i18n="s3.t5">Multi-agent email Workflow</h3><p data-i18n="s3.d5">Classify inbound email &rarr; route to the right agent &rarr; personalized reply.</p></div>
    <div class="labcard"><div class="li"><span class="le">🎙️</span>06</div><h3 data-i18n="s3.t6">Real-time voice agent</h3><p data-i18n="s3.d6">Classic agent + real-time voice, multilingual, tested live in the Test window.</p></div>
  </div>
</section>

<!-- 4. MULTILINGUAL -->
<section class="slide" data-title="Multilingual">
  <div class="s-head"><span class="kicker" data-i18n="s4.k">Unique feature 01</span><h2 data-i18n="s4.h">Multilingual <span class="grad">by design</span></h2></div>
  <div class="two wide-left">
    <div class="col">
      <p class="big" data-i18n="s4.big">One click switches the <b>entire lab experience</b> — the same page, instructions, sidebar, and UI — between <b>English, 中文, 日本語, 한국어</b>.</p>
      <ul class="ticks">
        <li data-i18n="s4.t1">Product names, prompts &amp; tool names stay in English on purpose</li>
        <li data-i18n="s4.t2">Copy-ready prompts never get "lost in translation"</li>
        <li data-i18n="s4.t3">Screenshots fall back to English automatically when a localized one isn't provided</li>
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
  <div class="s-head"><span class="kicker" data-i18n="s5.k">Unique feature 02</span><h2 data-i18n="s5.h">A learn-by-doing UX that's <span class="grad">actually joyful</span></h2></div>
  <div class="two">
    <div class="col feat">
      <div class="frow"><div class="fi">✦</div><div><b data-i18n="s5.b1">Markdown-rich steps</b><span data-i18n="s5.s1">Headings, tables, callouts &amp; highlights render beautifully.</span></div></div>
      <div class="frow"><div class="fi">⧉</div><div><b data-i18n="s5.b2">Copy-ready prompts</b><span data-i18n="s5.s2">Every instruction is one click to clipboard.</span></div></div>
      <div class="frow"><div class="fi">◒</div><div><b data-i18n="s5.b3">Progress tracking</b><span data-i18n="s5.s3">Per-step completion across all 29 steps, saved locally.</span></div></div>
      <div class="frow"><div class="fi">✺</div><div><b data-i18n="s5.b4">Fireworks on completion</b><span data-i18n="s5.s4">A celebratory burst rewards every finished step.</span></div></div>
      <div class="frow"><div class="fi">◐</div><div><b data-i18n="s5.b5">Glass UI, light &amp; dark</b><span data-i18n="s5.s5">Modern frosted-glass design, theme-aware everywhere.</span></div></div>
    </div>
    <div class="col"><img class="framed" src="${IMG.lab}" alt="Lab overview" /></div>
  </div>
</section>

<!-- 6. CO-BRANDING -->
<section class="slide" data-title="Co-branding">
  <div class="s-head"><span class="kicker" data-i18n="s6.k">Unique feature 03</span><h2 data-i18n="s6.h">Co-brand a <span class="grad">dedicated workshop</span> in seconds</h2></div>
  <div class="two wide-right">
    <div class="col"><img class="framed" src="${IMG.coverLenovo}" alt="Microsoft x Lenovo co-branded cover" /></div>
    <div class="col feat">
      <div class="frow"><div class="fi">◇</div><div><b data-i18n="s6.b1">Microsoft &times; Customer</b><span data-i18n="s6.s1">Set a customer name or logo &mdash; the cover instantly co-brands.</span></div></div>
      <div class="frow"><div class="fi">⤓</div><div><b data-i18n="s6.b2">Save &amp; reuse</b><span data-i18n="s6.s2">Workshop history: save, retrieve, and quick-search past setups.</span></div></div>
      <div class="frow"><div class="fi">⌘</div><div><b data-i18n="s6.b3">Logos by URL or upload</b><span data-i18n="s6.s3">Self-contained &mdash; no external image hosting needed.</span></div></div>
      <div class="frow"><div class="fi">🔒</div><div><b data-i18n="s6.b4">Password-gated</b><span data-i18n="s6.s4">Only facilitators can change branding &mdash; same gate as edit mode.</span></div></div>
    </div>
  </div>
</section>

<!-- 7. PUBLISH ONCE -->
<section class="slide" data-title="Publish once">
  <div class="s-head"><span class="kicker" data-i18n="s7.k">Unique feature 04</span><h2 data-i18n="s7.h">Publish once &mdash; <span class="grad">everyone sees it</span></h2></div>
  <div class="flow">
    <div class="fstep"><div class="fnum">1</div><b data-i18n="s7.b1">Configure locally</b><span data-i18n="s7.s1">Set branding &amp; edit lab content in the maker view.</span></div>
    <div class="farrow">&rarr;</div>
    <div class="fstep"><div class="fnum">2</div><b data-i18n="s7.b2">Apply &amp; commit</b><span data-i18n="s7.s2">Branding &amp; content ship as <code>branding.json</code> + <code>labs.json</code>.</span></div>
    <div class="farrow">&rarr;</div>
    <div class="fstep"><div class="fnum">3</div><b data-i18n="s7.b3">Auto-deploy</b><span data-i18n="s7.s3">GitHub Actions builds &amp; publishes to GitHub Pages on every push.</span></div>
    <div class="farrow">&rarr;</div>
    <div class="fstep hot"><div class="fnum">4</div><b data-i18n="s7.b4">Everyone sees it</b><span data-i18n="s7.s4">Attendees open the live URL &mdash; same content, same brand.</span></div>
  </div>
  <p class="note" data-i18n="s7.note">No per-user setup. The published files are the single source of truth for every visitor.</p>
</section>

<!-- 8. HOW TO RUN -->
<section class="slide" data-title="How to run">
  <div class="s-head"><span class="kicker" data-i18n="s8.k">For your attendees</span><h2 data-i18n="s8.h">Running it is <span class="grad">three steps</span></h2></div>
  <div class="flow big3">
    <div class="fstep"><div class="fnum">1</div><b data-i18n="s8.b1">Open the link</b><span data-i18n="s8.s1">One URL, any modern browser. No install, no sign-in to start.</span></div>
    <div class="farrow">&rarr;</div>
    <div class="fstep"><div class="fnum">2</div><b data-i18n="s8.b2">Pick a language</b><span data-i18n="s8.s2">Switch to EN / 中文 / 日本語 / 한국어 on the cover.</span></div>
    <div class="farrow">&rarr;</div>
    <div class="fstep"><div class="fnum">3</div><b data-i18n="s8.b3">Enter &amp; build</b><span data-i18n="s8.s3">Work lab by lab, copy prompts, track progress, celebrate.</span></div>
  </div>
  <div class="urlbar"><span class="urllbl" data-i18n="s8.url">Live workshop</span><code>https://jzh24516.github.io/ai-agent-jumpstart-2/</code></div>
</section>

<!-- 9. CLOSING -->
<section class="slide closing" data-title="Bring it to your workshop">
  <div class="orb o1"></div><div class="orb o2"></div>
  <div class="close-grid">
    <div class="close-wrap">
      <div class="badge"><span class="dot"></span> <span data-i18n="s9.badge">Ready when you are</span></div>
      <h2 class="hero sm" data-i18n="s9.h">Bring JumpStart v2 to your<br><span class="grad">next customer workshop</span></h2>
      <p class="lede" data-i18n="s9.lede">Internal enablement or external customer event &mdash; co-brand it, share the link, and let attendees build real agents hands-on.</p>
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
  .langbar{position:fixed;top:14px;left:50%;transform:translateX(-50%);z-index:60;display:flex;gap:4px;
    background:rgba(20,18,32,.72);border:1px solid var(--cardbrd);border-radius:999px;padding:4px;backdrop-filter:blur(8px)}
  .langbar button{border:0;background:transparent;color:var(--muted);font-size:.82rem;font-weight:700;
    padding:6px 13px;border-radius:999px;cursor:pointer;font-family:inherit;transition:.15s}
  .langbar button.on{background:var(--grad);color:#fff}
  .langbar button:hover:not(.on){color:var(--txt)}
  @media (max-width:640px){h2{font-size:1.7rem}.hero{font-size:2.5rem}.two,.labgrid{grid-template-columns:1fr}.cover-shot{display:none}.cover-wrap{width:100%}}
</style>
</head>
<body>
  <div class="pbar" id="pbar"></div>
  <button class="fs" id="fs" title="Fullscreen (F)">⛶</button>
  <div class="langbar" id="langbar">
    <button data-lang="en">EN</button>
    <button data-lang="zh">中文</button>
    <button data-lang="ja">日本語</button>
    <button data-lang="ko">한국어</button>
  </div>
  <div class="hint" data-i18n="ui.hint">← → to navigate · F fullscreen</div>
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
    const nu=new URL(location.href);nu.hash='#'+(i+1);history.replaceState(null,'',nu);
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
  const T={
    zh:{
      'c.lede':'一个动手、自主、多语言的实验体验，全面构建 Microsoft Copilot Studio 中的各类自定义 Agent。',
      'c.p1':'6 个引导实验','c.p2':'29 个步骤','c.p3':'4 种语言','c.p4':'1 个可分享链接',
      's2.k':'🎬 一句话概括','s2.h':'自动运行的研讨会 &mdash; <span class="grad">学员只需按下播放</span> ▶️',
      's2.big':'JumpStart v2 把“幻灯片 + 演示”变成一个<b>可动手操作的实时实验应用</b>。参与者打开一个链接、选择语言，逐步构建真实的 Agent &mdash; 你只需引导，而不必手把手照看。',
      's2.t1':'<span class="e">🖥️</span> 自主进度、基于浏览器、零安装','s2.t2':'<span class="e">📋</span> 每一步都可一键复制，并配有截图引导','s2.t3':'<span class="e">🤝</span> 既适用于内部赋能，<b>也</b>适用于客户研讨会',
      's2.l1':'动手实验','s2.l2':'引导步骤','s2.l3':'种语言','s2.l4':'复用，任意客户',
      's3.k':'🧭 学习路径','s3.h':'六个实验，从第一个 Agent 到<span class="grad">实时语音</span> 🎙️',
      's3.t1':'认识 Agent Maker','s3.d1':'使用 Microsoft.com + Microsoft Learn MCP 构建有依据的多语言 Agent。',
      's3.t2':'引入业务上下文','s3.d2':'Dataverse MCP、可复用 Skills、Memory，以及 CoWork 客户 360 工作流。',
      's3.t3':'基于证据的 RFP','s3.d3':'Work IQ + Microsoft IQ 在 Office 中生成有出处的 RFP/RFI 回复。',
      's3.t4':'连接专家 Agent','s3.d4':'ServiceNow 知识 + 工单、连接的 Agent、Teams 与 M365 Copilot。',
      's3.t5':'多 Agent 邮件工作流','s3.d5':'分类来件邮件 &rarr; 路由到合适的 Agent &rarr; 个性化回复。',
      's3.t6':'实时语音 Agent','s3.d6':'经典 Agent + 实时语音，多语言，在测试窗口中实时验证。',
      's4.k':'独特功能 01','s4.h':'<span class="grad">与生俱来</span>的多语言',
      's4.big':'一键即可在 <b>English、中文、日本語、한국어</b> 之间切换<b>整个实验体验</b> —— 同一页面、说明、侧栏与界面。',
      's4.t1':'产品名、提示词与工具名有意保留英文','s4.t2':'可复制的提示词绝不会“翻译走样”','s4.t3':'未提供本地化截图时自动回退为英文截图',
      's5.k':'独特功能 02','s5.h':'边做边学、<span class="grad">真正愉悦</span>的体验',
      's5.b1':'丰富的 Markdown 步骤','s5.s1':'标题、表格、提示框与重点都渲染精美。','s5.b2':'可复制的提示词','s5.s2':'每条说明一键复制到剪贴板。','s5.b3':'进度跟踪','s5.s3':'全部 29 个步骤逐步完成，本地保存。','s5.b4':'完成时的烟花','s5.s4':'每完成一步都有庆祝的烟花奖励。','s5.b5':'玻璃拟态界面，明暗主题','s5.s5':'现代磨砂玻璃设计，处处适配主题。',
      's6.k':'独特功能 03','s6.h':'几秒钟即可联合品牌化一个<span class="grad">专属研讨会</span>',
      's6.b1':'Microsoft × 客户','s6.s1':'设置客户名称或徽标 &mdash; 封面即刻联合品牌化。','s6.b2':'保存与复用','s6.s2':'研讨会历史：保存、检索并快速搜索过往配置。','s6.b3':'徽标可用 URL 或上传','s6.s3':'自包含 &mdash; 无需外部图片托管。','s6.b4':'密码保护','s6.s4':'仅主持人可更改品牌设置 &mdash; 与编辑模式同一道门槛。',
      's7.k':'独特功能 04','s7.h':'发布一次 &mdash; <span class="grad">人人可见</span>',
      's7.b1':'本地配置','s7.s1':'在创作者视图中设置品牌并编辑实验内容。','s7.b2':'应用并提交','s7.s2':'品牌与内容以 <code>branding.json</code> + <code>labs.json</code> 形式发布。','s7.b3':'自动部署','s7.s3':'每次推送时 GitHub Actions 自动构建并发布到 GitHub Pages。','s7.b4':'人人可见','s7.s4':'参与者打开在线 URL &mdash; 相同内容、相同品牌。',
      's7.note':'无需逐个用户配置。发布的文件是每位访问者的唯一可信来源。',
      's8.k':'面向你的参与者','s8.h':'运行只需<span class="grad">三步</span>',
      's8.b1':'打开链接','s8.s1':'一个 URL，任意现代浏览器。开始无需安装、无需登录。','s8.b2':'选择语言','s8.s2':'在封面切换 EN / 中文 / 日本語 / 한국어。','s8.b3':'进入并构建','s8.s3':'逐个实验推进，复制提示词，跟踪进度，尽情庆祝。','s8.url':'在线研讨会',
      's9.badge':'随时可以开始','s9.h':'把 JumpStart v2 带到你的<br><span class="grad">下一场客户研讨会</span>','s9.lede':'无论是内部赋能还是外部客户活动 &mdash; 联合品牌化、分享链接，让参与者亲手构建真实 Agent。',
      'ui.hint':'← → 切换 · F 全屏',
    },
    ja:{
      'c.lede':'Microsoft Copilot Studio でカスタム Agent の全領域を構築する、ハンズオン・自習型・多言語のラボ体験。',
      'c.p1':'6 つのガイド ラボ','c.p2':'29 ステップ','c.p3':'4 言語','c.p4':'共有リンク 1 つ',
      's2.k':'🎬 ひとことで言うと','s2.h':'自走するワークショップ &mdash; <span class="grad">受講者は再生を押すだけ</span> ▶️',
      's2.big':'JumpStart v2 は「スライド＋デモ」を<b>自分で操作できるライブなラボ アプリ</b>に変えます。参加者はリンクを 1 つ開き、言語を選び、実際の Agent を一歩ずつ構築 &mdash; あなたは付きっきりではなくファシリテートに専念できます。',
      's2.t1':'<span class="e">🖥️</span> 自分のペース・ブラウザ完結・インストール不要','s2.t2':'<span class="e">📋</span> すべての手順はコピーしてすぐ使え、スクリーンショット付き','s2.t3':'<span class="e">🤝</span> 社内イネーブルメント<b>にも</b>顧客ワークショップにも対応',
      's2.l1':'ハンズオン ラボ','s2.l2':'ガイド付き手順','s2.l3':'言語','s2.l4':'再利用・どの顧客でも',
      's3.k':'🧭 学習パス','s3.h':'6 つのラボ、最初の Agent から<span class="grad">リアルタイム音声</span>まで 🎙️',
      's3.t1':'Agent Maker を知る','s3.d1':'Microsoft.com + Microsoft Learn MCP で根拠のある多言語 Agent を構築。',
      's3.t2':'ビジネス コンテキストを取り込む','s3.d2':'Dataverse MCP、再利用可能な Skills、Memory、CoWork の顧客 360 ワークフロー。',
      's3.t3':'根拠ベースの RFP','s3.d3':'Work IQ + Microsoft IQ が Office 全体で出典付きの RFP/RFI 回答を生成。',
      's3.t4':'専門 Agent を接続','s3.d4':'ServiceNow のナレッジ + チケット、接続された Agent、Teams と M365 Copilot。',
      's3.t5':'マルチ Agent メール ワークフロー','s3.d5':'受信メールを分類 &rarr; 適切な Agent へ振り分け &rarr; パーソナライズ返信。',
      's3.t6':'リアルタイム音声 Agent','s3.d6':'クラシック Agent + リアルタイム音声、多言語、テスト画面でライブ検証。',
      's4.k':'独自機能 01','s4.h':'<span class="grad">設計思想としての</span>多言語対応',
      's4.big':'ワンクリックで <b>English・中文・日本語・한국어</b> を切り替え、<b>ラボ体験全体</b>（同じページ、手順、サイドバー、UI）が切り替わります。',
      's4.t1':'製品名・プロンプト・ツール名は意図的に英語のまま','s4.t2':'コピーして使うプロンプトが「翻訳で崩れる」ことはありません','s4.t3':'ローカライズ版のスクショが無い場合は自動的に英語版にフォールバック',
      's5.k':'独自機能 02','s5.h':'<span class="grad">本当に楽しい</span>、手を動かして学ぶ UX',
      's5.b1':'Markdown 対応の充実した手順','s5.s1':'見出し・表・コールアウト・ハイライトが美しく表示。','s5.b2':'コピーしてすぐ使えるプロンプト','s5.s2':'すべての指示がワンクリックでクリップボードへ。','s5.b3':'進捗トラッキング','s5.s3':'全 29 手順の完了状況を手順ごとに、ローカル保存。','s5.b4':'完了時の花火','s5.s4':'手順を終えるたびにお祝いの演出。','s5.b5':'グラス UI、ライト＆ダーク','s5.s5':'モダンなすりガラス デザイン、全体がテーマ対応。',
      's6.k':'独自機能 03','s6.h':'数秒で<span class="grad">専用ワークショップ</span>を共同ブランド化',
      's6.b1':'Microsoft × 顧客','s6.s1':'顧客名またはロゴを設定 &mdash; 表紙が即座に共同ブランド化。','s6.b2':'保存＆再利用','s6.s2':'ワークショップ履歴：過去の設定を保存・呼び出し・クイック検索。','s6.b3':'ロゴは URL またはアップロード','s6.s3':'自己完結 &mdash; 外部の画像ホスティング不要。','s6.b4':'パスワード保護','s6.s4':'ブランディング変更はファシリテーターのみ &mdash; 編集モードと同じゲート。',
      's7.k':'独自機能 04','s7.h':'一度公開すれば &mdash; <span class="grad">全員に反映</span>',
      's7.b1':'ローカルで設定','s7.s1':'メーカー ビューでブランディング設定とラボ編集。','s7.b2':'適用してコミット','s7.s2':'ブランディングとコンテンツは <code>branding.json</code> + <code>labs.json</code> として配信。','s7.b3':'自動デプロイ','s7.s3':'プッシュのたびに GitHub Actions がビルドして GitHub Pages に公開。','s7.b4':'全員が閲覧','s7.s4':'参加者はライブ URL を開くだけ &mdash; 同じ内容・同じブランド。',
      's7.note':'ユーザーごとの設定は不要。公開ファイルがすべての訪問者にとって唯一の信頼できる情報源です。',
      's8.k':'参加者向け','s8.h':'実行は<span class="grad">3 ステップ</span>',
      's8.b1':'リンクを開く','s8.s1':'URL 1 つ、モダンなブラウザで。インストールもサインインも不要。','s8.b2':'言語を選ぶ','s8.s2':'表紙で EN / 中文 / 日本語 / 한국어 に切り替え。','s8.b3':'入って構築','s8.s3':'ラボごとに進め、プロンプトをコピー、進捗を記録、お祝い。','s8.url':'ライブ ワークショップ',
      's9.badge':'準備はいつでも','s9.h':'JumpStart v2 を<br><span class="grad">次の顧客ワークショップ</span>へ','s9.lede':'社内イネーブルメントでも外部の顧客イベントでも &mdash; 共同ブランド化してリンクを共有し、参加者に実際の Agent を手を動かして構築してもらいましょう。',
      'ui.hint':'← → で移動 · F 全画面',
    },
    ko:{
      'c.lede':'Microsoft Copilot Studio에서 다양한 맞춤형 Agent를 구축하는 실습형, 자기 주도, 다국어 랩 경험.',
      'c.p1':'가이드 랩 6개','c.p2':'29단계','c.p3':'4개 언어','c.p4':'공유 링크 1개',
      's2.k':'🎬 한마디로','s2.h':'스스로 진행되는 워크숍 &mdash; <span class="grad">학습자는 재생만 누르면 됩니다</span> ▶️',
      's2.big':'JumpStart v2는 “슬라이드+데모” 세션을 <b>직접 해보는 실시간 랩 앱</b>으로 바꿉니다. 참가자는 링크 하나를 열고 언어를 선택해 실제 Agent를 단계별로 구축하며 &mdash; 여러분은 일일이 챙기는 대신 퍼실리테이션에 집중합니다.',
      's2.t1':'<span class="e">🖥️</span> 자기 주도, 브라우저 기반, 설치 불필요','s2.t2':'<span class="e">📋</span> 모든 단계는 복사해 바로 쓰고 스크린샷으로 안내','s2.t3':'<span class="e">🤝</span> 내부 역량 강화<b>와</b> 고객 워크숍 모두에 적합',
      's2.l1':'실습 랩','s2.l2':'가이드 단계','s2.l3':'개 언어','s2.l4':'재사용, 모든 고객',
      's3.k':'🧭 학습 경로','s3.h':'여섯 개의 랩, 첫 Agent부터 <span class="grad">실시간 음성</span>까지 🎙️',
      's3.t1':'Agent Maker 만나기','s3.d1':'Microsoft.com + Microsoft Learn MCP로 근거 있는 다국어 Agent 구축.',
      's3.t2':'비즈니스 컨텍스트 가져오기','s3.d2':'Dataverse MCP, 재사용 가능한 Skills, Memory, CoWork 고객 360 워크플로.',
      's3.t3':'근거 기반 RFP','s3.d3':'Work IQ + Microsoft IQ가 Office 전반에서 출처 있는 RFP/RFI 응답 생성.',
      's3.t4':'전문 Agent 연결','s3.d4':'ServiceNow 지식 + 티켓, 연결된 Agent, Teams 및 M365 Copilot.',
      's3.t5':'멀티 Agent 이메일 워크플로','s3.d5':'수신 메일 분류 &rarr; 적합한 Agent로 라우팅 &rarr; 맞춤형 회신.',
      's3.t6':'실시간 음성 Agent','s3.d6':'클래식 Agent + 실시간 음성, 다국어, 테스트 창에서 실시간 검증.',
      's4.k':'고유 기능 01','s4.h':'<span class="grad">설계부터</span> 다국어',
      's4.big':'클릭 한 번으로 <b>English, 中文, 日本語, 한국어</b> 사이에서 <b>랩 경험 전체</b>(같은 페이지, 안내, 사이드바, UI)가 전환됩니다.',
      's4.t1':'제품명, 프롬프트, 도구 이름은 의도적으로 영어 유지','s4.t2':'복사해 쓰는 프롬프트가 “번역으로 왜곡”되지 않습니다','s4.t3':'현지화된 스크린샷이 없으면 자동으로 영어 스크린샷으로 대체',
      's5.k':'고유 기능 02','s5.h':'직접 해보며 배우는, <span class="grad">정말 즐거운</span> UX',
      's5.b1':'Markdown이 풍부한 단계','s5.s1':'제목, 표, 콜아웃, 강조가 아름답게 렌더링.','s5.b2':'복사해 바로 쓰는 프롬프트','s5.s2':'모든 지침을 클릭 한 번으로 클립보드에.','s5.b3':'진행 상황 추적','s5.s3':'전체 29단계의 단계별 완료를 로컬 저장.','s5.b4':'완료 시 불꽃놀이','s5.s4':'단계를 마칠 때마다 축하 연출로 보상.','s5.b5':'글래스 UI, 라이트 & 다크','s5.s5':'모던한 프로스트 글래스 디자인, 어디서나 테마 대응.',
      's6.k':'고유 기능 03','s6.h':'몇 초 만에 <span class="grad">전용 워크숍</span>을 공동 브랜딩',
      's6.b1':'Microsoft × 고객','s6.s1':'고객 이름이나 로고 설정 &mdash; 표지가 즉시 공동 브랜딩.','s6.b2':'저장 및 재사용','s6.s2':'워크숍 기록: 과거 설정을 저장, 불러오기, 빠른 검색.','s6.b3':'로고는 URL 또는 업로드','s6.s3':'자체 완결 &mdash; 외부 이미지 호스팅 불필요.','s6.b4':'비밀번호 보호','s6.s4':'브랜딩 변경은 퍼실리테이터만 &mdash; 편집 모드와 동일한 게이트.',
      's7.k':'고유 기능 04','s7.h':'한 번 게시하면 &mdash; <span class="grad">모두가 봅니다</span>',
      's7.b1':'로컬에서 구성','s7.s1':'메이커 뷰에서 브랜딩 설정 및 랩 콘텐츠 편집.','s7.b2':'적용 및 커밋','s7.s2':'브랜딩과 콘텐츠는 <code>branding.json</code> + <code>labs.json</code>으로 배포.','s7.b3':'자동 배포','s7.s3':'푸시할 때마다 GitHub Actions가 빌드하여 GitHub Pages에 게시.','s7.b4':'모두가 봅니다','s7.s4':'참가자는 라이브 URL만 열면 &mdash; 같은 콘텐츠, 같은 브랜드.',
      's7.note':'사용자별 설정이 필요 없습니다. 게시된 파일이 모든 방문자의 단일 진실 소스입니다.',
      's8.k':'참가자를 위해','s8.h':'실행은 <span class="grad">세 단계</span>',
      's8.b1':'링크 열기','s8.s1':'URL 하나, 최신 브라우저면 됩니다. 설치·로그인 없이 시작.','s8.b2':'언어 선택','s8.s2':'표지에서 EN / 中文 / 日本語 / 한국어로 전환.','s8.b3':'입장 후 구축','s8.s3':'랩을 차례로 진행하고 프롬프트 복사, 진행 추적, 축하까지.','s8.url':'라이브 워크숍',
      's9.badge':'언제든 준비 완료','s9.h':'JumpStart v2를<br><span class="grad">다음 고객 워크숍</span>으로','s9.lede':'내부 역량 강화든 외부 고객 행사든 &mdash; 공동 브랜딩하고 링크를 공유해 참가자가 실제 Agent를 직접 만들게 하세요.',
      'ui.hint':'← → 이동 · F 전체화면',
    },
  };
  const LANGS=['en','zh','ja','ko'];
  const i18nEls=[...document.querySelectorAll('[data-i18n]')];
  i18nEls.forEach(el=>{el.dataset.en=el.innerHTML;});
  const langBtns=[...document.querySelectorAll('#langbar button')];
  function applyLang(lang){
    if(!LANGS.includes(lang))lang='en';
    i18nEls.forEach(el=>{const k=el.getAttribute('data-i18n');const v=lang==='en'?el.dataset.en:(T[lang]&&T[lang][k]);el.innerHTML=(v!=null?v:el.dataset.en);});
    document.documentElement.lang=lang==='zh'?'zh-CN':lang;
    langBtns.forEach(b=>b.classList.toggle('on',b.dataset.lang===lang));
    try{localStorage.setItem('jumpstart-deck-lang',lang);}catch(e){}
    const u=new URL(location.href);u.searchParams.set('lang',lang);history.replaceState(null,'',u);
  }
  langBtns.forEach(b=>b.onclick=()=>applyLang(b.dataset.lang));
  let storedLang=null;try{storedLang=localStorage.getItem('jumpstart-deck-lang');}catch(e){}
  applyLang(new URLSearchParams(location.search).get('lang')||storedLang||'en');
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
