// Builds a single self-contained HTML deck with screenshots embedded as base64.
const fs = require('fs')
const path = require('path')

const imgDir = path.join(__dirname, 'img')
const MIME = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif', '.gif': 'image/gif' }
const b64 = (name) => {
  const p = path.join(imgDir, name)
  if (!fs.existsSync(p)) return ''
  const ext = path.extname(name).toLowerCase()
  return `data:${MIME[ext] || 'image/png'};base64,` + fs.readFileSync(p).toString('base64')
}
// Returns the first candidate that exists (as a data URL), else ''. Lets a real
// photo (michael-photo.*) override the generated monogram avatar when present.
const firstImg = (names) => {
  for (const n of names) { if (fs.existsSync(path.join(imgDir, n))) return b64(n) }
  return ''
}
const IMG = {
  cover: b64('cover-en.png'),
  coverJa: b64('cover-ja.png'),
  lab: b64('lab-overview.png'),
  labFireworks: b64('lab-fireworks.png'),
  labEn: b64('lab-en.png'),
  labZh: b64('lab-zh.png'),
  blueprint: {
    en: b64('agent-platform-blueprint-en.webp'),
    zh: b64('agent-platform-blueprint-zh.webp'),
    ja: b64('agent-platform-blueprint-ja.webp'),
    ko: b64('agent-platform-blueprint-ko.webp'),
    th: b64('agent-platform-blueprint-th.webp'),
    hi: b64('agent-platform-blueprint-hi.webp'),
  },
  coverLenovo: b64('cover-lenovo.png'),
  branding: b64('branding.png'),
  jumpstart: {
    en: b64('jumpstart-english.png'),
    zh: b64('jumpstart-chinese.png'),
    ja: b64('jumpstart-japanese.png'),
    ko: b64('jumpstart-korean.png'),
    th: b64('jumpstart-thai.png'),
    hi: b64('jumpstart-hindi.png'),
  },
  avatar: firstImg(['michael-photo.png', 'michael-photo.jpg', 'michael-photo.jpeg', 'michael-photo.webp', 'michael.png']),
}

// Self-contained CSS starfield (no external images) for the saga-themed slide 3.
const starfield = (n) => {
  let seed = 20260717
  const rnd = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff }
  const layers = []
  for (let i = 0; i < n; i++) {
    const x = (rnd() * 100).toFixed(2)
    const y = (rnd() * 100).toFixed(2)
    const s = (rnd() * 1.3 + 0.4).toFixed(2)
    const a = (rnd() * 0.6 + 0.3).toFixed(2)
    layers.push(`radial-gradient(${s}px ${s}px at ${x}% ${y}%, rgba(255,255,255,${a}) 50%, transparent 51%)`)
  }
  return layers.join(',')
}
const STARS = starfield(70)

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
      <span class="pill" data-i18n="c.p3">6 languages</span>
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
      <div class="stat"><div class="se">🌍</div><div class="num">6</div><div class="lbl" data-i18n="s2.l3">languages</div></div>
      <div class="stat"><div class="se">🔁</div><div class="num">&infin;</div><div class="lbl" data-i18n="s2.l4">reuse, any customer</div></div>
    </div>
  </div>
</section>

<!-- 3. THE 6 LABS -->
<section class="slide saga-slide" data-title="The 6 labs">
  <div class="saga-bg" style="background:${STARS}, radial-gradient(ellipse 85% 60% at 50% -12%, rgba(124,58,237,.24), transparent 60%), radial-gradient(ellipse 95% 75% at 50% 118%, rgba(34,211,238,.16), transparent 60%), #05030f"></div>
  <div class="saga-glow" aria-hidden="true"></div>
  <div class="s-head saga-head"><span class="kicker" data-i18n="s3.k">🧭 The learning path</span><h2 data-i18n="s3.h">Six labs, from first agent to <span class="grad">real-time voice</span> 🎙️</h2></div>
  <div class="saga-grid">
    <div class="ep" style="--saber:#4ea8ff"><div class="ep-top"><span class="ep-no">I</span><span class="ep-emoji">🤖</span><span class="ep-arch" data-i18n="s3.a1">The Apprentice</span></div><div class="blade"></div><h3 data-i18n="s3.t1">Meet the Agent Maker</h3><p data-i18n="s3.d1">Build a grounded, multilingual agent with Microsoft.com + Microsoft Learn MCP.</p></div>
    <div class="ep" style="--saber:#3ee06a"><div class="ep-top"><span class="ep-no">II</span><span class="ep-emoji">🗂️</span><span class="ep-arch" data-i18n="s3.a2">The Archivist</span></div><div class="blade"></div><h3 data-i18n="s3.t2">Bring in business context</h3><p data-i18n="s3.d2">Dataverse MCP, reusable Skills, Memory, and a CoWork customer-360 workflow.</p></div>
    <div class="ep" style="--saber:#b57bff"><div class="ep-top"><span class="ep-no">III</span><span class="ep-emoji">📝</span><span class="ep-arch" data-i18n="s3.a3">The Chronicler</span></div><div class="blade"></div><h3 data-i18n="s3.t3">Evidence-based RFP</h3><p data-i18n="s3.d3">Work IQ + Microsoft IQ generate sourced RFP/RFI responses across Office.</p></div>
    <div class="ep" style="--saber:#ffb020"><div class="ep-top"><span class="ep-no">IV</span><span class="ep-emoji">🔌</span><span class="ep-arch" data-i18n="s3.a4">The Envoy</span></div><div class="blade"></div><h3 data-i18n="s3.t4">Connect specialist agents</h3><p data-i18n="s3.d4">ServiceNow knowledge + tickets, connected agents, Teams &amp; M365 Copilot.</p></div>
    <div class="ep" style="--saber:#ff5c5c"><div class="ep-top"><span class="ep-no">V</span><span class="ep-emoji">📨</span><span class="ep-arch" data-i18n="s3.a5">The Squadron</span></div><div class="blade"></div><h3 data-i18n="s3.t5">Multi-agent email Workflow</h3><p data-i18n="s3.d5">Classify inbound email &rarr; route to the right agent &rarr; personalized reply.</p></div>
    <div class="ep" style="--saber:#34e2ff"><div class="ep-top"><span class="ep-no">VI</span><span class="ep-emoji">🎙️</span><span class="ep-arch" data-i18n="s3.a6">The Herald</span></div><div class="blade"></div><h3 data-i18n="s3.t6">Real-time voice agent</h3><p data-i18n="s3.d6">Classic agent + real-time voice, multilingual, tested live in the Test window.</p></div>
  </div>
</section>

<!-- 4. AGENT PLATFORM BLUEPRINT -->
<section class="slide blueprint-slide" data-title="Agent platform blueprint">
  <img class="blueprint-img" data-blueprint src="${IMG.blueprint.en}" alt="Copilot Studio Agent Platform Blueprint: six labs mapped from use case through agent mode, architecture, tools, and business value" />
</section>

<!-- 5. MULTILINGUAL -->
<section class="slide" data-title="Multilingual">
  <div class="s-head"><span class="kicker" data-i18n="s4.k">Unique feature 01</span><h2 data-i18n="s4.h">Multilingual <span class="grad">by design</span></h2></div>
  <div class="two shots-row">
    <div class="col">
      <p class="big" data-i18n="s4.big">One click switches the <b>entire lab experience</b> — the same page, instructions, sidebar, and UI — between <b>English, 中文, 日本語, 한국어, ไทย, हिन्दी</b>.</p>
      <ul class="ticks">
        <li data-i18n="s4.t1">Product names, prompts &amp; tool names stay in English on purpose</li>
        <li data-i18n="s4.t2">Copy-ready prompts never get "lost in translation"</li>
        <li data-i18n="s4.t3">Screenshots fall back to English automatically when a localized one isn't provided</li>
      </ul>
      <div class="chips"><span>EN</span><span>中文</span><span>日本語</span><span>한국어</span><span>ไทย</span><span>हिन्दी</span></div>
    </div>
    <div class="col">
      <div class="shotwrap">
        <span class="shot-blob"></span>
        <img class="s1" src="${IMG.labEn}" alt="Lab 1 in English" />
        <span class="btag b1">EN</span>
        <img class="s2" src="${IMG.labZh}" alt="Lab 1 in Chinese" />
        <span class="btag b2">中文</span>
      </div>
    </div>
  </div>
</section>

<!-- 6. LEARN BY DOING -->
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
    <div class="col"><img class="framed shot-solo" src="${IMG.labFireworks}" alt="Fireworks celebrate each completed step" /></div>
  </div>
</section>

<!-- 7. CO-BRANDING -->
<section class="slide" data-title="Co-branding">
  <div class="s-head"><span class="kicker" data-i18n="s6.k">Unique feature 03</span><h2 data-i18n="s6.h">Co-brand a <span class="grad">dedicated workshop</span> in seconds</h2></div>
  <div class="two wide-right">
    <div class="col"><img class="framed shot-solo" src="${IMG.coverLenovo}" alt="Microsoft x Lenovo co-branded cover" /></div>
    <div class="col feat">
      <div class="frow"><div class="fi">◇</div><div><b data-i18n="s6.b1">Microsoft &times; Customer</b><span data-i18n="s6.s1">Set a customer name or logo &mdash; the cover instantly co-brands.</span></div></div>
      <div class="frow"><div class="fi">⤓</div><div><b data-i18n="s6.b2">Save &amp; reuse</b><span data-i18n="s6.s2">Workshop history: save, retrieve, and quick-search past setups.</span></div></div>
      <div class="frow"><div class="fi">⌘</div><div><b data-i18n="s6.b3">Logos by URL or upload</b><span data-i18n="s6.s3">Self-contained &mdash; no external image hosting needed.</span></div></div>
      <div class="frow"><div class="fi">🔒</div><div><b data-i18n="s6.b4">Password-gated</b><span data-i18n="s6.s4">Only facilitators can change branding &mdash; same gate as edit mode.</span></div></div>
    </div>
  </div>
</section>

<!-- 8. PUBLISH ONCE -->
<section class="slide" data-title="Publish once">
  <div class="s-head"><span class="kicker" data-i18n="s7.k">Unique feature 04</span><h2 data-i18n="s7.h">Publish once &mdash; <span class="grad">everyone sees it</span></h2></div>
  <div class="flow">
    <div class="fstep"><div class="femoji" style="animation-delay:0s"><span>🛠️</span></div><div class="fnum">1</div><b data-i18n="s7.b1">Configure locally</b><span data-i18n="s7.s1">Set branding &amp; edit lab content in the maker view.</span></div>
    <div class="farrow">&rarr;</div>
    <div class="fstep"><div class="femoji" style="animation-delay:.5s"><span>💾</span></div><div class="fnum">2</div><b data-i18n="s7.b2">Apply &amp; commit</b><span data-i18n="s7.s2">Branding &amp; content ship as <code>branding.json</code> + <code>labs.json</code>.</span></div>
    <div class="farrow">&rarr;</div>
    <div class="fstep"><div class="femoji" style="animation-delay:1s"><span>🚀</span></div><div class="fnum">3</div><b data-i18n="s7.b3">Auto-deploy</b><span data-i18n="s7.s3">GitHub Actions builds &amp; publishes to GitHub Pages on every push.</span></div>
    <div class="farrow">&rarr;</div>
    <div class="fstep hot"><div class="femoji" style="animation-delay:1.5s"><span>🎉</span></div><div class="fnum">4</div><b data-i18n="s7.b4">Everyone sees it</b><span data-i18n="s7.s4">Attendees open the live URL &mdash; same content, same brand.</span></div>
  </div>
  <p class="note" data-i18n="s7.note">No per-user setup. The published files are the single source of truth for every visitor.</p>
</section>

<!-- 9. FAST START — FROM LAB TO IMPACT -->
<section class="slide vp-slide" data-title="From Lab to Impact">
  <div class="vp-grid">
    <div class="vp-art"><img data-jumpstart class="vp-img" src="${IMG.jumpstart.en}" alt="JumpStart — Fast Start" /></div>
    <div class="vp-copy">
      <span class="kicker" data-i18n="s10.k">⚡ JumpStart V2</span>
      <h2 data-i18n="s10.h">From <span class="grad">Lab to Impact</span></h2>
      <div class="vflow">
        <div class="vstep"><span class="vi">⚡</span><div class="vt"><b data-i18n="s10.t1">Fast Start</b><span data-i18n="s10.d1">Open one link and go &mdash; zero install, zero setup.</span></div></div>
        <div class="vstep"><span class="vi">🙌</span><div class="vt"><b data-i18n="s10.t2">Self-Serve &amp; Self-Paced</b><span data-i18n="s10.d2">Attendees drive their own journey while you facilitate.</span></div></div>
        <div class="vstep"><span class="vi">📋</span><div class="vt"><b data-i18n="s10.t3">Copy &amp; Build</b><span data-i18n="s10.d3">Copy-ready prompts turn each step into a real, working agent.</span></div></div>
        <div class="vstep"><span class="vi">🌍</span><div class="vt"><b data-i18n="s10.t4">Multilingual Ready</b><span data-i18n="s10.d4">Six languages, one shareable link.</span></div></div>
        <div class="vstep hot"><span class="vi">🚀</span><div class="vt"><b data-i18n="s10.t5">From Lab to Impact</b><span data-i18n="s10.d5">Ship agents that deliver real business value &mdash; fast.</span></div></div>
      </div>
    </div>
  </div>
</section>

<!-- 10. CLOSING -->
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
      <div class="thanks">
        <span class="thanks-label" data-i18n="s9.thanks">With thanks to the contribution of JumpStart v-Team</span>
        <div class="thanks-names"><span>Nalin Shukla</span><span>Scott Berry</span><span>Steve Ng</span><span>Jalilah Halim</span><span>Anand Ponnusamy</span></div>
      </div>
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
  html{font-size:clamp(13px,min(0.98vw,1.742vh),32px)}
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
  h2{font-size:3.4rem;line-height:1.05;letter-spacing:-.022em;font-weight:800}
  .big{font-size:1.82rem;line-height:1.48;color:#DEDCEC}
  .note{margin-top:auto;color:var(--muted);font-size:1.28rem;padding-top:18px}

  /* cover */
  .cover{padding:0}
  .cover-wrap{position:absolute;inset:0;width:56%;padding:6% 0 6% 6%;display:flex;flex-direction:column;justify-content:center;z-index:2}
  .badge{display:inline-flex;align-items:center;gap:9px;align-self:flex-start;font-size:.82rem;font-weight:700;
    color:#E9E6FF;background:rgba(255,255,255,.06);border:1px solid var(--cardbrd);padding:8px 15px;border-radius:999px;margin-bottom:22px}
  .badge .dot{width:9px;height:9px;border-radius:50%;background:var(--grad)}
  .hero{font-size:4.6rem;line-height:1.01;letter-spacing:-.032em;font-weight:900}
  .hero.sm{font-size:3.5rem}
  .lede{margin-top:20px;max-width:30ch;color:#CFCDE0;font-size:1.32rem;line-height:1.48}
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
  .two.shots-row{grid-template-columns:.86fr 1.14fr;gap:3%}
  .col{min-width:0}
  .ticks{list-style:none;margin-top:24px;display:flex;flex-direction:column;gap:16px}
  .ticks li{position:relative;padding-left:34px;color:#D7D5E6;font-size:1.44rem;line-height:1.44}
  .ticks li:before{content:"";position:absolute;left:0;top:.42em;width:17px;height:17px;border-radius:50%;
    background:var(--grad)}
  .chips{display:flex;flex-wrap:wrap;gap:10px;margin-top:28px}
  .chips span{font-weight:800;font-size:1.2rem;color:#EFEDFA;background:rgba(167,139,250,.16);
    border:1px solid var(--cardbrd);padding:12px 20px;border-radius:13px}

  /* stats */
  .stats{display:grid;grid-template-columns:1fr 1fr;gap:18px}
  .stat{background:var(--card);border:1px solid var(--cardbrd);border-radius:18px;padding:26px 24px;text-align:center}
  .stat .se{font-size:2rem;line-height:1;margin-bottom:8px}
  .stat .num{font-size:4.9rem;font-weight:900;line-height:1;background:var(--grad);-webkit-background-clip:text;background-clip:text;color:transparent}
  .stat .lbl{margin-top:10px;color:var(--muted);font-weight:600;font-size:1.28rem}
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

  /* saga theme (slide 3) */
  .saga-slide{overflow:hidden}
  .saga-bg{position:absolute;inset:0;z-index:0}
  .saga-glow{position:absolute;left:50%;bottom:-46%;width:120%;aspect-ratio:2/1;transform:translateX(-50%);z-index:0;
    background:radial-gradient(ellipse at 50% 100%,rgba(124,58,237,.30),rgba(5,3,15,0) 62%)}
  .saga-slide .s-head,.saga-slide .saga-grid{position:relative;z-index:2}
  .saga-slide .kicker{color:#ffd94a;background:rgba(245,182,10,.12);border-color:rgba(245,182,10,.35)}
  .saga-slide h2{color:#f3ecd2}
  .saga-slide h2 .grad{background:linear-gradient(180deg,#ffe98a,#f5b60a);-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 0 18px rgba(245,182,10,.4))}
  .saga-grid{flex:1;display:grid;grid-template-columns:repeat(3,1fr);grid-auto-rows:1fr;gap:18px}
  .ep{position:relative;overflow:hidden;border-radius:16px;padding:18px 20px;display:flex;flex-direction:column;
    background:linear-gradient(160deg,rgba(255,255,255,.07),rgba(255,255,255,.02));
    border:1px solid rgba(255,255,255,.12);box-shadow:0 18px 44px rgba(0,0,0,.55)}
  .ep::before{content:"";position:absolute;top:0;left:0;right:0;height:3px;background:var(--saber);box-shadow:0 0 18px var(--saber)}
  .ep::after{content:"";position:absolute;right:-30%;top:-30%;width:60%;aspect-ratio:1;border-radius:50%;
    background:radial-gradient(circle,var(--saber),transparent 62%);opacity:.14}
  .ep-top{display:flex;align-items:center;gap:10px}
  .ep-no{font-weight:900;font-size:1.45rem;line-height:1;color:var(--saber);text-shadow:0 0 14px var(--saber);min-width:1.7em}
  .ep-emoji{font-size:1.35rem;line-height:1}
  .ep-arch{font-size:.76rem;font-weight:800;letter-spacing:.16em;text-transform:uppercase;color:#c9cce6}
  .blade{height:2px;margin:12px 0;border-radius:2px;background:linear-gradient(90deg,var(--saber),transparent);box-shadow:0 0 12px var(--saber)}
  .ep h3{font-size:1.24rem;font-weight:800;letter-spacing:-.01em;color:#f2f1fa}
  .ep p{margin-top:8px;color:#b9b7cf;font-size:1.04rem;line-height:1.4}

  /* layered platform blueprint (slide 4, locale-specific bitmap) */
  .blueprint-slide{padding:1.6%;background:radial-gradient(120% 120% at 50% 0%,#171430,#0f0d1a)}
  .blueprint-img{display:block;width:100%;height:100%;object-fit:contain;border-radius:18px;
    box-shadow:0 30px 70px rgba(0,0,0,.5);animation:blueprintIn .6s cubic-bezier(.2,.7,.2,1) both}
  @keyframes blueprintIn{from{opacity:0;transform:scale(.978)}to{opacity:1;transform:scale(1)}}

  /* feature rows */
  .feat{display:flex;flex-direction:column;gap:20px}
  .frow{display:flex;gap:16px;align-items:flex-start}
  .frow .fi{flex:0 0 auto;width:50px;height:50px;display:grid;place-items:center;border-radius:13px;
    font-size:1.35rem;color:#fff;background:var(--grad);box-shadow:0 8px 22px rgba(124,58,237,.35)}
  .frow b{display:block;font-size:1.34rem}
  .frow span{display:block;color:var(--muted);font-size:1.16rem;line-height:1.4;margin-top:3px}

  /* images */
  .framed{width:100%;border-radius:14px;border:1px solid var(--cardbrd);box-shadow:var(--glow)}
  .shot-solo{transition:transform .45s cubic-bezier(.2,.7,.2,1),box-shadow .45s ease;will-change:transform}
  .shot-solo:hover,.shot-solo.hovering{transform:perspective(1200px) rotateX(2deg) rotateY(-5deg) translateY(-12px) scale(1.03);box-shadow:0 44px 100px rgba(124,58,237,.55)}
  .shotwrap{position:relative;width:100%;aspect-ratio:4/3}
  .shotwrap .shot-blob{position:absolute;inset:6%;background:var(--grad);filter:blur(52px);opacity:.38;border-radius:46% 54% 58% 42%;z-index:0;animation:blob 9s ease-in-out infinite}
  .shotwrap img{position:absolute;width:76%;border-radius:16px;border:1px solid rgba(255,255,255,.18);
    box-shadow:0 30px 70px rgba(0,0,0,.55);transition:transform .4s cubic-bezier(.2,.7,.2,1)}
  .shotwrap .s1{top:0;left:0;transform:rotate(-5deg);z-index:1}
  .shotwrap .s2{bottom:0;right:0;transform:rotate(5deg);z-index:2}
  .shotwrap:hover .s1,.shotwrap.hovering .s1{transform:rotate(-8deg) translateY(-10px)}
  .shotwrap:hover .s2,.shotwrap.hovering .s2{transform:rotate(8deg) translateY(10px)}
  .shotwrap .btag{position:absolute;z-index:3;font-weight:800;font-size:.95rem;color:#fff;background:var(--grad);
    padding:8px 15px;border-radius:999px;box-shadow:0 12px 26px rgba(124,58,237,.55)}
  .shotwrap .btag.b1{top:-3%;left:5%}
  .shotwrap .btag.b2{bottom:-3%;right:5%;z-index:4}
  @keyframes blob{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(4%,-3%) scale(1.06)}}

  /* flow */
  .flow{flex:1;display:flex;align-items:stretch;justify-content:center;gap:16px}
  .flow.big3 .fstep{padding:34px 26px}
  .fstep{flex:1;background:var(--card);border:1px solid var(--cardbrd);border-radius:16px;padding:28px 22px 7rem;position:relative}
  .flow.big3 .fstep{padding-bottom:34px}
  .fstep .femoji{position:absolute;left:50%;top:68%;transform:translate(-50%,-50%);font-size:4.32rem;line-height:1;z-index:2;pointer-events:none}
  .flow.big3 .fstep .femoji{font-size:3.456rem;left:auto;right:1.2rem;top:1rem;transform:none}
  .fstep .femoji span{display:block;font-size:inherit;line-height:inherit}
  /* slide 8 step icons show off with looping teasers (delays come from inline animation-delay) */
  .flow:not(.big3) .fstep:nth-child(1) .femoji{animation:teaseWiggle 2s ease-in-out infinite}
  .flow:not(.big3) .fstep:nth-child(3) .femoji{animation:teaseZoom 2.2s ease-in-out infinite}
  .flow:not(.big3) .fstep:nth-child(5) .femoji{animation:teaseLaunch 2.4s ease-in-out infinite}
  .flow:not(.big3) .fstep:nth-child(7) .femoji{animation:teaseTada 2.6s ease-in-out infinite}
  @keyframes teaseWiggle{0%,100%{transform:translate(-50%,-50%) rotate(-16deg)}50%{transform:translate(-50%,-50%) rotate(16deg)}}
  @keyframes teaseZoom{0%,100%{transform:translate(-50%,-50%) scale(1)}50%{transform:translate(-50%,-50%) scale(1.32)}}
  @keyframes teaseLaunch{0%,100%{transform:translate(-50%,-50%) translateY(0) rotate(0)}45%{transform:translate(-50%,-50%) translateY(-14px) rotate(-10deg)}70%{transform:translate(-50%,-50%) translateY(-4px) rotate(-4deg)}}
  @keyframes teaseTada{0%,100%{transform:translate(-50%,-50%) scale(1) rotate(0)}20%{transform:translate(-50%,-50%) scale(1.2) rotate(-12deg)}40%{transform:translate(-50%,-50%) scale(1.2) rotate(12deg)}60%{transform:translate(-50%,-50%) scale(1.16) rotate(-9deg)}80%{transform:translate(-50%,-50%) scale(1.1) rotate(9deg)}}
  .fstep.hot{background:linear-gradient(160deg,rgba(167,139,250,.22),rgba(236,72,153,.16));border-color:rgba(236,72,153,.4)}
  .fstep .fnum{width:42px;height:42px;display:grid;place-items:center;border-radius:12px;font-weight:900;font-size:1.25rem;color:#fff;background:var(--grad);margin-bottom:16px}
  .fstep b{font-size:1.36rem}
  .fstep span{display:block;color:var(--muted);font-size:1.16rem;line-height:1.4;margin-top:8px}
  .fstep code{color:#EFEDFA;background:rgba(255,255,255,.08);padding:1px 6px;border-radius:5px;font-size:.86em}
  .farrow{color:var(--purple);font-size:2rem;font-weight:900;flex:0 0 auto;align-self:center}
  .urlbar{margin-top:30px;display:flex;align-items:center;gap:16px;background:var(--card);border:1px solid var(--cardbrd);
    border-radius:14px;padding:22px 26px}
  .urlbar .urllbl{font-size:.9rem;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:var(--purple)}
  .urlbar code{font-size:1.55rem;color:#EFEDFA;font-weight:600}

  /* slide 9 fast-start messaging */
  .s9-head{margin-bottom:1.6%}
  .s9-lede{font-size:1.6rem;line-height:1.4;color:#E4E2F0;font-weight:600;max-width:64ch;margin:0 0 3%}
  .powerchips{display:flex;flex-wrap:wrap;gap:14px;margin-bottom:3.4%}
  .pchip{position:relative;top:0;display:inline-flex;align-items:center;gap:11px;font-weight:800;font-size:1.24rem;color:#F3F1FB;
    background:linear-gradient(155deg,rgba(167,139,250,.24),rgba(34,211,238,.12));
    border:1px solid rgba(167,139,250,.42);border-radius:999px;padding:11px 20px;
    box-shadow:0 8px 24px rgba(124,58,237,.2);transition:top .25s ease,box-shadow .25s ease,border-color .25s ease}
  .pchip i{font-style:normal;font-size:1.5rem;line-height:1;filter:drop-shadow(0 3px 7px rgba(0,0,0,.45))}
  .pchip:hover{top:-4px;border-color:rgba(34,211,238,.6);box-shadow:0 16px 34px rgba(124,58,237,.34)}
  .slide.active .pchip{animation:pcpop .55s cubic-bezier(.2,.8,.2,1) both}
  .slide.active .pchip:nth-child(1){animation-delay:.12s}
  .slide.active .pchip:nth-child(2){animation-delay:.22s}
  .slide.active .pchip:nth-child(3){animation-delay:.32s}
  .slide.active .pchip:nth-child(4){animation-delay:.42s}
  .slide.active .pchip:nth-child(5){animation-delay:.52s}
  @keyframes pcpop{from{opacity:0;transform:translateY(16px) scale(.88)}to{opacity:1;transform:none}}
  .flow.big3 .farrow{animation:flowpulse 1.6s ease-in-out infinite}
  @keyframes flowpulse{0%,100%{transform:translateX(0);opacity:.72}50%{transform:translateX(5px);opacity:1}}

  /* slide 11 value proposition (left image + right vertical flow) */
  .vp-grid{flex:1;min-height:0;display:grid;grid-template-columns:.92fr 1.08fr;gap:5%;align-items:center}
  .vp-art{height:100%;min-height:0;display:flex;align-items:center;justify-content:center;min-width:0}
  .vp-img{max-width:100%;max-height:100%;border-radius:20px;border:1px solid var(--cardbrd);box-shadow:0 30px 70px rgba(0,0,0,.5);object-fit:contain}
  .vp-copy{min-width:0}
  .vflow{margin-top:24px;display:flex;flex-direction:column;gap:16px}
  .vstep{display:flex;align-items:flex-start;gap:16px;position:relative}
  .vstep:not(:last-child)::before{content:"";position:absolute;left:27px;top:56px;bottom:-16px;width:2px;
    background:linear-gradient(180deg,rgba(167,139,250,.55),rgba(34,211,238,.18))}
  .vstep .vi{flex:0 0 auto;width:56px;height:56px;display:grid;place-items:center;border-radius:15px;font-size:1.7rem;position:relative;z-index:1;
    background:linear-gradient(160deg,rgba(167,139,250,.22),rgba(34,211,238,.12));border:1px solid var(--cardbrd)}
  .vstep.hot .vi{background:var(--grad);border:0;box-shadow:0 12px 26px rgba(124,58,237,.42)}
  .vstep .vt{min-width:0;padding-top:4px}
  .vstep .vt b{display:block;font-size:1.42rem;font-weight:800;letter-spacing:-.01em;color:#F3F1FB}
  .vstep .vt span{display:block;color:var(--muted);font-size:1.14rem;line-height:1.4;margin-top:3px}

  /* closing */
  .closing{align-items:center;justify-content:center}
  .close-grid{position:relative;z-index:2;width:100%;display:grid;grid-template-columns:1.35fr .75fr;gap:5%;align-items:center}
  .close-wrap{min-width:0}
  .close-avatar{display:flex;flex-direction:column;align-items:center;text-align:center;gap:12px}
  .close-avatar img{width:min(320px,90%);aspect-ratio:1;object-fit:cover;object-position:center;border-radius:50%;box-shadow:0 30px 80px rgba(124,58,237,.55)}
  .close-avatar b{font-size:1.5rem;margin-top:6px}
  .close-avatar span{color:var(--muted);font-size:1rem;max-width:22ch}
  .contacts{display:flex;gap:16px;margin-top:26px}
  .contacts a{text-decoration:none;background:var(--card);border:1px solid var(--cardbrd);border-radius:14px;
    padding:16px 22px;min-width:230px}
  .contacts b{display:block;color:var(--txt);font-size:1.06rem}
  .contacts span{display:block;color:var(--cyan);font-size:.95rem;margin-top:3px}
  .madeby{margin-top:26px;color:var(--muted);font-size:.95rem}
  .thanks{margin-top:20px;padding-top:18px;border-top:1px solid var(--cardbrd)}
  .thanks-label{display:block;color:var(--muted);font-size:.92rem;font-weight:700;letter-spacing:.03em;margin-bottom:11px}
  .thanks-names{display:flex;flex-wrap:wrap;gap:9px}
  .thanks-names span{font-size:1rem;font-weight:700;color:#EFEDFA;background:rgba(167,139,250,.14);border:1px solid var(--cardbrd);padding:7px 15px;border-radius:999px}

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
    <button data-lang="th">ไทย</button>
    <button data-lang="hi">हिन्दी</button>
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
    i=((n%slides.length)+slides.length)%slides.length;
    slides.forEach((s,k)=>s.classList.toggle('active',k===i));
    dotEls.forEach((d,k)=>d.classList.toggle('on',k===i));
    count.textContent=(i+1)+' / '+slides.length;
    pbar.style.width=((i+1)/slides.length*100)+'%';
    const nu=new URL(location.href);nu.hash='#'+(i+1);history.replaceState(null,'',nu);
    autoHover();
  }
  let hoverTimer=null;
  function autoHover(){
    clearTimeout(hoverTimer);
    document.querySelectorAll('.shot-solo.hovering,.shotwrap.hovering').forEach(el=>el.classList.remove('hovering'));
    const targets=[...slides[i].querySelectorAll('.shot-solo,.shotwrap')];
    if(!targets.length)return;
    let on=false;
    (function loop(){
      on=!on;
      targets.forEach(el=>el.classList.toggle('hovering',on));
      hoverTimer=setTimeout(loop,2000);
    })();
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
  const blueprintImages=${JSON.stringify(IMG.blueprint)};
  const jumpstartImages=${JSON.stringify(IMG.jumpstart)};
  const blueprintAlt={
    en:'Copilot Studio Agent Platform Blueprint: six labs mapped from use case through agent mode, architecture, tools, and business value',
    zh:'Copilot Studio Agent 平台蓝图：六个实验映射用例、Agent 模式、架构、工具与业务价值',
    ja:'Copilot Studio Agent プラットフォーム設計図：6 つのラボをユースケース、Agent モード、アーキテクチャ、ツール、ビジネス価値で整理',
    ko:'Copilot Studio Agent 플랫폼 블루프린트: 6개 랩의 사용 사례, Agent 모드, 아키텍처, 도구, 비즈니스 가치',
    th:'Copilot Studio Agent Platform Blueprint: 6 แล็บที่เชื่อมกรณีใช้งาน โหมด Agent สถาปัตยกรรม เครื่องมือ และคุณค่าทางธุรกิจ',
    hi:'Copilot Studio Agent Platform Blueprint: उपयोग मामले, Agent मोड, आर्किटेक्चर, उपकरण और व्यावसायिक मूल्य के अनुसार छह लैब',
  };
  const T={
    zh:{
      'c.lede':'一个动手、自主、多语言的实验体验，全面构建 Microsoft Copilot Studio 中的各类自定义 Agent。',
      'c.p1':'6 个引导实验','c.p2':'29 个步骤','c.p3':'6 种语言','c.p4':'1 个可分享链接',
      's2.k':'🎬 一句话概括','s2.h':'自动运行的研讨会 &mdash; <span class="grad">学员只需按下播放</span> ▶️',
      's2.big':'JumpStart v2 把“幻灯片 + 演示”变成一个<b>可动手操作的实时实验应用</b>。参与者打开一个链接、选择语言，逐步构建真实的 Agent &mdash; 你只需引导，而不必手把手照看。',
      's2.t1':'<span class="e">🖥️</span> 自主进度、基于浏览器、零安装','s2.t2':'<span class="e">📋</span> 每一步都可一键复制，并配有截图引导','s2.t3':'<span class="e">🤝</span> 既适用于内部赋能，<b>也</b>适用于客户研讨会',
      's2.l1':'动手实验','s2.l2':'引导步骤','s2.l3':'种语言','s2.l4':'复用，任意客户',
      's3.k':'🧭 学习路径','s3.h':'六个实验，从第一个 Agent 到<span class="grad">实时语音</span> 🎙️','s3.a1':'学徒','s3.a2':'档案官','s3.a3':'记述者','s3.a4':'使者','s3.a5':'中队','s3.a6':'传令者',
      's3.t1':'认识 Agent Maker','s3.d1':'使用 Microsoft.com + Microsoft Learn MCP 构建有依据的多语言 Agent。',
      's3.t2':'引入业务上下文','s3.d2':'Dataverse MCP、可复用 Skills、Memory，以及 CoWork 客户 360 工作流。',
      's3.t3':'基于证据的 RFP','s3.d3':'Work IQ + Microsoft IQ 在 Office 中生成有出处的 RFP/RFI 回复。',
      's3.t4':'连接专家 Agent','s3.d4':'ServiceNow 知识 + 工单、连接的 Agent、Teams 与 M365 Copilot。',
      's3.t5':'多 Agent 邮件工作流','s3.d5':'分类来件邮件 &rarr; 路由到合适的 Agent &rarr; 个性化回复。',
      's3.t6':'实时语音 Agent','s3.d6':'经典 Agent + 实时语音，多语言，在测试窗口中实时验证。',
      's4.k':'独特功能 01','s4.h':'<span class="grad">与生俱来</span>的多语言',
      's4.big':'一键即可在 <b>English、中文、日本語、한국어、ไทย、हिन्दी</b> 之间切换<b>整个实验体验</b> —— 同一页面、说明、侧栏与界面。',
      's4.t1':'产品名、提示词与工具名有意保留英文','s4.t2':'可复制的提示词绝不会“翻译走样”','s4.t3':'未提供本地化截图时自动回退为英文截图',
      's5.k':'独特功能 02','s5.h':'边做边学、<span class="grad">真正愉悦</span>的体验',
      's5.b1':'丰富的 Markdown 步骤','s5.s1':'标题、表格、提示框与重点都渲染精美。','s5.b2':'可复制的提示词','s5.s2':'每条说明一键复制到剪贴板。','s5.b3':'进度跟踪','s5.s3':'全部 29 个步骤逐步完成，本地保存。','s5.b4':'完成时的烟花','s5.s4':'每完成一步都有庆祝的烟花奖励。','s5.b5':'玻璃拟态界面，明暗主题','s5.s5':'现代磨砂玻璃设计，处处适配主题。',
      's6.k':'独特功能 03','s6.h':'几秒钟即可联合品牌化一个<span class="grad">专属研讨会</span>',
      's6.b1':'Microsoft × 客户','s6.s1':'设置客户名称或徽标 &mdash; 封面即刻联合品牌化。','s6.b2':'保存与复用','s6.s2':'研讨会历史：保存、检索并快速搜索过往配置。','s6.b3':'徽标可用 URL 或上传','s6.s3':'自包含 &mdash; 无需外部图片托管。','s6.b4':'密码保护','s6.s4':'仅主持人可更改品牌设置 &mdash; 与编辑模式同一道门槛。',
      's7.k':'独特功能 04','s7.h':'发布一次 &mdash; <span class="grad">人人可见</span>',
      's7.b1':'本地配置','s7.s1':'在创作者视图中设置品牌并编辑实验内容。','s7.b2':'应用并提交','s7.s2':'品牌与内容以 <code>branding.json</code> + <code>labs.json</code> 形式发布。','s7.b3':'自动部署','s7.s3':'每次推送时 GitHub Actions 自动构建并发布到 GitHub Pages。','s7.b4':'人人可见','s7.s4':'参与者打开在线 URL &mdash; 相同内容、相同品牌。',
      's7.note':'无需逐个用户配置。发布的文件是每位访问者的唯一可信来源。',
      's8.k':'⚡ 快速起步','s8.h':'JumpStart v2 就是<span class="grad">快速起步</span>',
      's8.b1':'打开链接','s8.s1':'一个 URL，任意现代浏览器。开始无需安装、无需登录。','s8.b2':'选择语言','s8.s2':'在封面切换 EN / 中文 / 日本語 / 한국어 / ไทย / हिन्दी。','s8.b3':'进入并构建','s8.s3':'逐个实验推进，复制提示词，跟踪进度，尽情庆祝。','s8.url':'在线研讨会','s8.lede':'一个链接。任意语言。几分钟内构建真实 Agent — 无需安装、无需等待。','s8.c1':'上手超简单','s8.c2':'自助服务','s8.c3':'自定进度','s8.c4':'复制即构建','s8.c5':'多语言就绪',
      's9.badge':'随时可以开始','s9.thanks':'特别感谢 JumpStart v-Team 团队的贡献','s9.h':'把 JumpStart v2 带到你的<br><span class="grad">下一场客户研讨会</span>','s9.lede':'无论是内部赋能还是外部客户活动 &mdash; 联合品牌化、分享链接，让参与者亲手构建真实 Agent。','s10.k':'⚡ JumpStart V2','s10.h':'从<span class="grad">实验到影响</span>','s10.t1':'快速起步','s10.d1':'打开一个链接即可开始 — 无需安装、无需配置。','s10.t2':'自助 & 自定进度','s10.d2':'参与者自主推进，你只需引导。','s10.t3':'复制即构建','s10.d3':'可复制的提示词，将每一步变成真正可用的 Agent。','s10.t4':'多语言就绪','s10.d4':'六种语言，一个可分享链接。','s10.t5':'从实验到影响','s10.d5':'快速交付带来真实业务价值的 Agent。',
      'ui.hint':'← → 切换 · F 全屏',
    },
    ja:{
      'c.lede':'Microsoft Copilot Studio でカスタム Agent の全領域を構築する、ハンズオン・自習型・多言語のラボ体験。',
      'c.p1':'6 つのガイド ラボ','c.p2':'29 ステップ','c.p3':'6 言語','c.p4':'共有リンク 1 つ',
      's2.k':'🎬 ひとことで言うと','s2.h':'自走するワークショップ &mdash; <span class="grad">受講者は再生を押すだけ</span> ▶️',
      's2.big':'JumpStart v2 は「スライド＋デモ」を<b>自分で操作できるライブなラボ アプリ</b>に変えます。参加者はリンクを 1 つ開き、言語を選び、実際の Agent を一歩ずつ構築 &mdash; あなたは付きっきりではなくファシリテートに専念できます。',
      's2.t1':'<span class="e">🖥️</span> 自分のペース・ブラウザ完結・インストール不要','s2.t2':'<span class="e">📋</span> すべての手順はコピーしてすぐ使え、スクリーンショット付き','s2.t3':'<span class="e">🤝</span> 社内イネーブルメント<b>にも</b>顧客ワークショップにも対応',
      's2.l1':'ハンズオン ラボ','s2.l2':'ガイド付き手順','s2.l3':'言語','s2.l4':'再利用・どの顧客でも',
      's3.k':'🧭 学習パス','s3.h':'6 つのラボ、最初の Agent から<span class="grad">リアルタイム音声</span>まで 🎙️','s3.a1':'見習い','s3.a2':'記録官','s3.a3':'年代記者','s3.a4':'使者','s3.a5':'部隊','s3.a6':'伝令',
      's3.t1':'Agent Maker を知る','s3.d1':'Microsoft.com + Microsoft Learn MCP で根拠のある多言語 Agent を構築。',
      's3.t2':'ビジネス コンテキストを取り込む','s3.d2':'Dataverse MCP、再利用可能な Skills、Memory、CoWork の顧客 360 ワークフロー。',
      's3.t3':'根拠ベースの RFP','s3.d3':'Work IQ + Microsoft IQ が Office 全体で出典付きの RFP/RFI 回答を生成。',
      's3.t4':'専門 Agent を接続','s3.d4':'ServiceNow のナレッジ + チケット、接続された Agent、Teams と M365 Copilot。',
      's3.t5':'マルチ Agent メール ワークフロー','s3.d5':'受信メールを分類 &rarr; 適切な Agent へ振り分け &rarr; パーソナライズ返信。',
      's3.t6':'リアルタイム音声 Agent','s3.d6':'クラシック Agent + リアルタイム音声、多言語、テスト画面でライブ検証。',
      's4.k':'独自機能 01','s4.h':'<span class="grad">設計思想としての</span>多言語対応',
      's4.big':'ワンクリックで <b>English・中文・日本語・한국어・ไทย・हिन्दी</b> を切り替え、<b>ラボ体験全体</b>（同じページ、手順、サイドバー、UI）が切り替わります。',
      's4.t1':'製品名・プロンプト・ツール名は意図的に英語のまま','s4.t2':'コピーして使うプロンプトが「翻訳で崩れる」ことはありません','s4.t3':'ローカライズ版のスクショが無い場合は自動的に英語版にフォールバック',
      's5.k':'独自機能 02','s5.h':'<span class="grad">本当に楽しい</span>、手を動かして学ぶ UX',
      's5.b1':'Markdown 対応の充実した手順','s5.s1':'見出し・表・コールアウト・ハイライトが美しく表示。','s5.b2':'コピーしてすぐ使えるプロンプト','s5.s2':'すべての指示がワンクリックでクリップボードへ。','s5.b3':'進捗トラッキング','s5.s3':'全 29 手順の完了状況を手順ごとに、ローカル保存。','s5.b4':'完了時の花火','s5.s4':'手順を終えるたびにお祝いの演出。','s5.b5':'グラス UI、ライト＆ダーク','s5.s5':'モダンなすりガラス デザイン、全体がテーマ対応。',
      's6.k':'独自機能 03','s6.h':'数秒で<span class="grad">専用ワークショップ</span>を共同ブランド化',
      's6.b1':'Microsoft × 顧客','s6.s1':'顧客名またはロゴを設定 &mdash; 表紙が即座に共同ブランド化。','s6.b2':'保存＆再利用','s6.s2':'ワークショップ履歴：過去の設定を保存・呼び出し・クイック検索。','s6.b3':'ロゴは URL またはアップロード','s6.s3':'自己完結 &mdash; 外部の画像ホスティング不要。','s6.b4':'パスワード保護','s6.s4':'ブランディング変更はファシリテーターのみ &mdash; 編集モードと同じゲート。',
      's7.k':'独自機能 04','s7.h':'一度公開すれば &mdash; <span class="grad">全員に反映</span>',
      's7.b1':'ローカルで設定','s7.s1':'メーカー ビューでブランディング設定とラボ編集。','s7.b2':'適用してコミット','s7.s2':'ブランディングとコンテンツは <code>branding.json</code> + <code>labs.json</code> として配信。','s7.b3':'自動デプロイ','s7.s3':'プッシュのたびに GitHub Actions がビルドして GitHub Pages に公開。','s7.b4':'全員が閲覧','s7.s4':'参加者はライブ URL を開くだけ &mdash; 同じ内容・同じブランド。',
      's7.note':'ユーザーごとの設定は不要。公開ファイルがすべての訪問者にとって唯一の信頼できる情報源です。',
      's8.k':'⚡ ファストスタート','s8.h':'JumpStart v2 は<span class="grad">ファストスタート</span>',
      's8.b1':'リンクを開く','s8.s1':'URL 1 つ、モダンなブラウザで。インストールもサインインも不要。','s8.b2':'言語を選ぶ','s8.s2':'表紙で EN / 中文 / 日本語 / 한국어 / ไทย / हिन्दी に切り替え。','s8.b3':'入って構築','s8.s3':'ラボごとに進め、プロンプトをコピー、進捗を記録、お祝い。','s8.url':'ライブ ワークショップ','s8.lede':'リンク 1 つ。どの言語でも。数分で本物の Agent — インストールも待ち時間もなし。','s8.c1':'起動は超かんたん','s8.c2':'セルフサービス','s8.c3':'自分のペースで','s8.c4':'コピーして構築','s8.c5':'多言語対応',
      's9.badge':'準備はいつでも','s9.thanks':'JumpStart v-Team の皆さんの貢献に感謝します','s9.h':'JumpStart v2 を<br><span class="grad">次の顧客ワークショップ</span>へ','s9.lede':'社内イネーブルメントでも外部の顧客イベントでも &mdash; 共同ブランド化してリンクを共有し、参加者に実際の Agent を手を動かして構築してもらいましょう。','s10.k':'⚡ JumpStart V2','s10.h':'<span class="grad">ラボからインパクト</span>へ','s10.t1':'ファストスタート','s10.d1':'リンク 1 つで開始 — インストールも設定も不要。','s10.t2':'セルフサービス & 自分のペース','s10.d2':'参加者が自ら進め、あなたはファシリテート。','s10.t3':'コピーして構築','s10.d3':'コピーできるプロンプトで、各ステップを本物の Agent に。','s10.t4':'多言語対応','s10.d4':'6 言語、共有リンク 1 つ。','s10.t5':'ラボからインパクトへ','s10.d5':'実際のビジネス価値を生む Agent を、素早く届ける。',
      'ui.hint':'← → で移動 · F 全画面',
    },
    ko:{
      'c.lede':'Microsoft Copilot Studio에서 다양한 맞춤형 Agent를 구축하는 실습형, 자기 주도, 다국어 랩 경험.',
      'c.p1':'가이드 랩 6개','c.p2':'29단계','c.p3':'6개 언어','c.p4':'공유 링크 1개',
      's2.k':'🎬 한마디로','s2.h':'스스로 진행되는 워크숍 &mdash; <span class="grad">학습자는 재생만 누르면 됩니다</span> ▶️',
      's2.big':'JumpStart v2는 “슬라이드+데모” 세션을 <b>직접 해보는 실시간 랩 앱</b>으로 바꿉니다. 참가자는 링크 하나를 열고 언어를 선택해 실제 Agent를 단계별로 구축하며 &mdash; 여러분은 일일이 챙기는 대신 퍼실리테이션에 집중합니다.',
      's2.t1':'<span class="e">🖥️</span> 자기 주도, 브라우저 기반, 설치 불필요','s2.t2':'<span class="e">📋</span> 모든 단계는 복사해 바로 쓰고 스크린샷으로 안내','s2.t3':'<span class="e">🤝</span> 내부 역량 강화<b>와</b> 고객 워크숍 모두에 적합',
      's2.l1':'실습 랩','s2.l2':'가이드 단계','s2.l3':'개 언어','s2.l4':'재사용, 모든 고객',
      's3.k':'🧭 학습 경로','s3.h':'여섯 개의 랩, 첫 Agent부터 <span class="grad">실시간 음성</span>까지 🎙️','s3.a1':'견습생','s3.a2':'기록관','s3.a3':'연대기록자','s3.a4':'특사','s3.a5':'편대','s3.a6':'전령',
      's3.t1':'Agent Maker 만나기','s3.d1':'Microsoft.com + Microsoft Learn MCP로 근거 있는 다국어 Agent 구축.',
      's3.t2':'비즈니스 컨텍스트 가져오기','s3.d2':'Dataverse MCP, 재사용 가능한 Skills, Memory, CoWork 고객 360 워크플로.',
      's3.t3':'근거 기반 RFP','s3.d3':'Work IQ + Microsoft IQ가 Office 전반에서 출처 있는 RFP/RFI 응답 생성.',
      's3.t4':'전문 Agent 연결','s3.d4':'ServiceNow 지식 + 티켓, 연결된 Agent, Teams 및 M365 Copilot.',
      's3.t5':'멀티 Agent 이메일 워크플로','s3.d5':'수신 메일 분류 &rarr; 적합한 Agent로 라우팅 &rarr; 맞춤형 회신.',
      's3.t6':'실시간 음성 Agent','s3.d6':'클래식 Agent + 실시간 음성, 다국어, 테스트 창에서 실시간 검증.',
      's4.k':'고유 기능 01','s4.h':'<span class="grad">설계부터</span> 다국어',
      's4.big':'클릭 한 번으로 <b>English, 中文, 日本語, 한국어, ไทย, हिन्दी</b> 사이에서 <b>랩 경험 전체</b>(같은 페이지, 안내, 사이드바, UI)가 전환됩니다.',
      's4.t1':'제품명, 프롬프트, 도구 이름은 의도적으로 영어 유지','s4.t2':'복사해 쓰는 프롬프트가 “번역으로 왜곡”되지 않습니다','s4.t3':'현지화된 스크린샷이 없으면 자동으로 영어 스크린샷으로 대체',
      's5.k':'고유 기능 02','s5.h':'직접 해보며 배우는, <span class="grad">정말 즐거운</span> UX',
      's5.b1':'Markdown이 풍부한 단계','s5.s1':'제목, 표, 콜아웃, 강조가 아름답게 렌더링.','s5.b2':'복사해 바로 쓰는 프롬프트','s5.s2':'모든 지침을 클릭 한 번으로 클립보드에.','s5.b3':'진행 상황 추적','s5.s3':'전체 29단계의 단계별 완료를 로컬 저장.','s5.b4':'완료 시 불꽃놀이','s5.s4':'단계를 마칠 때마다 축하 연출로 보상.','s5.b5':'글래스 UI, 라이트 & 다크','s5.s5':'모던한 프로스트 글래스 디자인, 어디서나 테마 대응.',
      's6.k':'고유 기능 03','s6.h':'몇 초 만에 <span class="grad">전용 워크숍</span>을 공동 브랜딩',
      's6.b1':'Microsoft × 고객','s6.s1':'고객 이름이나 로고 설정 &mdash; 표지가 즉시 공동 브랜딩.','s6.b2':'저장 및 재사용','s6.s2':'워크숍 기록: 과거 설정을 저장, 불러오기, 빠른 검색.','s6.b3':'로고는 URL 또는 업로드','s6.s3':'자체 완결 &mdash; 외부 이미지 호스팅 불필요.','s6.b4':'비밀번호 보호','s6.s4':'브랜딩 변경은 퍼실리테이터만 &mdash; 편집 모드와 동일한 게이트.',
      's7.k':'고유 기능 04','s7.h':'한 번 게시하면 &mdash; <span class="grad">모두가 봅니다</span>',
      's7.b1':'로컬에서 구성','s7.s1':'메이커 뷰에서 브랜딩 설정 및 랩 콘텐츠 편집.','s7.b2':'적용 및 커밋','s7.s2':'브랜딩과 콘텐츠는 <code>branding.json</code> + <code>labs.json</code>으로 배포.','s7.b3':'자동 배포','s7.s3':'푸시할 때마다 GitHub Actions가 빌드하여 GitHub Pages에 게시.','s7.b4':'모두가 봅니다','s7.s4':'참가자는 라이브 URL만 열면 &mdash; 같은 콘텐츠, 같은 브랜드.',
      's7.note':'사용자별 설정이 필요 없습니다. 게시된 파일이 모든 방문자의 단일 진실 소스입니다.',
      's8.k':'⚡ 빠른 시작','s8.h':'JumpStart v2는 <span class="grad">빠른 시작</span>',
      's8.b1':'링크 열기','s8.s1':'URL 하나, 최신 브라우저면 됩니다. 설치·로그인 없이 시작.','s8.b2':'언어 선택','s8.s2':'표지에서 EN / 中文 / 日本語 / 한국어 / ไทย / हिन्दी로 전환.','s8.b3':'입장 후 구축','s8.s3':'랩을 차례로 진행하고 프롬프트 복사, 진행 추적, 축하까지.','s8.url':'라이브 워크숍','s8.lede':'링크 하나. 어떤 언어든. 몇 분 만에 진짜 Agent — 설치도 대기도 없이.','s8.c1':'시작이 매우 쉬움','s8.c2':'셀프 서비스','s8.c3':'자기 주도 학습','s8.c4':'복사하고 빌드','s8.c5':'다국어 지원',
      's9.badge':'언제든 준비 완료','s9.thanks':'JumpStart v-Team의 기여에 감사드립니다','s9.h':'JumpStart v2를<br><span class="grad">다음 고객 워크숍</span>으로','s9.lede':'내부 역량 강화든 외부 고객 행사든 &mdash; 공동 브랜딩하고 링크를 공유해 참가자가 실제 Agent를 직접 만들게 하세요.','s10.k':'⚡ JumpStart V2','s10.h':'<span class="grad">랩에서 임팩트</span>로','s10.t1':'빠른 시작','s10.d1':'링크 하나로 시작 — 설치도 설정도 없이.','s10.t2':'셀프 서비스 & 자기 주도','s10.d2':'참가자가 스스로 진행하고 당신은 퍼실리테이션.','s10.t3':'복사하고 빌드','s10.d3':'복사 가능한 프롬프트로 각 단계를 진짜 작동하는 Agent로.','s10.t4':'다국어 지원','s10.d4':'여섯 개 언어, 하나의 공유 링크.','s10.t5':'랩에서 임팩트로','s10.d5':'실제 비즈니스 가치를 주는 Agent를 빠르게 제공.',
      'ui.hint':'← → 이동 · F 전체화면',
    },
    th:{
      'c.lede':'ประสบการณ์แล็บแบบลงมือทำ เรียนรู้ด้วยตนเอง และหลายภาษา สำหรับสร้าง Agent แบบกำหนดเองครบทุกรูปแบบใน Microsoft Copilot Studio',
      'c.p1':'6 แล็บพร้อมคำแนะนำ','c.p2':'29 ขั้นตอน','c.p3':'6 ภาษา','c.p4':'1 ลิงก์สำหรับแชร์',
      's2.k':'🎬 สรุปในหนึ่งประโยค','s2.h':'เวิร์กช็อปที่ดำเนินเอง &mdash; <span class="grad">ผู้เรียนแค่กดเล่น</span> ▶️',
      's2.big':'JumpStart v2 เปลี่ยนเซสชัน “สไลด์และเดโม” ให้เป็น<b>แอปแล็บที่ลงมือทำได้จริงแบบสด</b> ผู้เข้าร่วมเปิดลิงก์เดียว เลือกภาษา แล้วสร้าง Agent จริงทีละขั้น &mdash; ขณะที่คุณเป็นผู้อำนวยความสะดวกแทนการคอยประคบประหงม',
      's2.t1':'<span class="e">🖥️</span> เรียนตามจังหวะตัวเอง ทำงานบนเบราว์เซอร์ ไม่ต้องติดตั้ง','s2.t2':'<span class="e">📋</span> ทุกขั้นตอนคัดลอกใช้ได้ทันทีและมีภาพหน้าจอแนะนำ','s2.t3':'<span class="e">🤝</span> ใช้ได้ทั้งการเสริมศักยภาพภายใน<b>และ</b>เวิร์กช็อปกับลูกค้า',
      's2.l1':'แล็บลงมือทำ','s2.l2':'ขั้นตอนพร้อมคำแนะนำ','s2.l3':'ภาษา','s2.l4':'นำกลับมาใช้ กับลูกค้าทุกราย',
      's3.k':'🧭 เส้นทางการเรียนรู้','s3.h':'หกแล็บ ตั้งแต่ Agent แรกจนถึง<span class="grad">เสียงแบบเรียลไทม์</span> 🎙️','s3.a1':'ผู้ฝึกหัด','s3.a2':'ผู้เก็บบันทึก','s3.a3':'ผู้บันทึกเรื่องราว','s3.a4':'ทูต','s3.a5':'ฝูงบิน','s3.a6':'ผู้ประกาศ',
      's3.t1':'รู้จัก Agent Maker','s3.d1':'สร้าง Agent หลายภาษาที่มีแหล่งอ้างอิงด้วย Microsoft.com + Microsoft Learn MCP',
      's3.t2':'นำบริบททางธุรกิจเข้ามา','s3.d2':'Dataverse MCP, Skills ที่นำกลับมาใช้ได้, Memory และเวิร์กโฟลว์ลูกค้า 360 ของ CoWork',
      's3.t3':'RFP ที่อิงหลักฐาน','s3.d3':'Work IQ + Microsoft IQ สร้างคำตอบ RFP/RFI ที่มีแหล่งอ้างอิงทั่วทั้ง Office',
      's3.t4':'เชื่อมต่อ Agent ผู้เชี่ยวชาญ','s3.d4':'ความรู้ + ทิกเก็ตของ ServiceNow, Agent ที่เชื่อมต่อ, Teams &amp; M365 Copilot',
      's3.t5':'เวิร์กโฟลว์อีเมลแบบหลาย Agent','s3.d5':'จัดประเภทอีเมลขาเข้า &rarr; ส่งต่อไปยัง Agent ที่เหมาะสม &rarr; ตอบกลับแบบเฉพาะบุคคล',
      's3.t6':'Agent เสียงแบบเรียลไทม์','s3.d6':'Agent แบบคลาสสิก + เสียงเรียลไทม์ หลายภาษา ทดสอบสดในหน้าต่าง Test',
      's4.k':'คุณสมบัติเฉพาะ 01','s4.h':'หลายภาษา<span class="grad">ตั้งแต่การออกแบบ</span>',
      's4.big':'คลิกเดียวสลับ<b>ประสบการณ์แล็บทั้งหมด</b> — หน้าเดียวกัน คำแนะนำ แถบข้าง และ UI — ระหว่าง <b>English, 中文, 日本語, 한국어, ไทย, हिन्दी</b>',
      's4.t1':'ชื่อผลิตภัณฑ์ พรอมป์ &amp; ชื่อเครื่องมือคงไว้เป็นภาษาอังกฤษโดยตั้งใจ','s4.t2':'พรอมป์ที่คัดลอกใช้ได้จะไม่ “เพี้ยนเพราะการแปล”','s4.t3':'ภาพหน้าจอจะกลับไปใช้ภาษาอังกฤษโดยอัตโนมัติเมื่อไม่มีเวอร์ชันแปล',
      's5.k':'คุณสมบัติเฉพาะ 02','s5.h':'UX เรียนรู้ด้วยการลงมือทำที่<span class="grad">สนุกอย่างแท้จริง</span>',
      's5.b1':'ขั้นตอนที่เต็มไปด้วย Markdown','s5.s1':'หัวข้อ ตาราง คำอธิบาย &amp; ไฮไลต์แสดงผลอย่างสวยงาม','s5.b2':'พรอมป์คัดลอกใช้ได้ทันที','s5.s2':'ทุกคำสั่งคัดลอกไปยังคลิปบอร์ดได้ในคลิกเดียว','s5.b3':'การติดตามความคืบหน้า','s5.s3':'ความสำเร็จรายขั้นครบทั้ง 29 ขั้นตอน บันทึกไว้ในเครื่อง','s5.b4':'พลุเมื่อทำสำเร็จ','s5.s4':'พลุเฉลิมฉลองเป็นรางวัลทุกครั้งที่ทำขั้นตอนเสร็จ','s5.b5':'Glass UI ทั้งสว่าง &amp; มืด','s5.s5':'ดีไซน์กระจกฝ้าสมัยใหม่ รองรับธีมทุกที่',
      's6.k':'คุณสมบัติเฉพาะ 03','s6.h':'ร่วมแบรนด์<span class="grad">เวิร์กช็อปเฉพาะ</span>ได้ในไม่กี่วินาที',
      's6.b1':'Microsoft &times; ลูกค้า','s6.s1':'ตั้งชื่อหรือโลโก้ลูกค้า &mdash; หน้าปกร่วมแบรนด์ทันที','s6.b2':'บันทึก &amp; นำกลับมาใช้','s6.s2':'ประวัติเวิร์กช็อป: บันทึก เรียกคืน และค้นหาการตั้งค่าเดิมอย่างรวดเร็ว','s6.b3':'โลโก้ด้วย URL หรืออัปโหลด','s6.s3':'อยู่ในตัวเอง &mdash; ไม่ต้องมีโฮสต์รูปภาพภายนอก','s6.b4':'ป้องกันด้วยรหัสผ่าน','s6.s4':'เฉพาะผู้อำนวยความสะดวกเท่านั้นที่เปลี่ยนแบรนด์ได้ &mdash; ประตูเดียวกับโหมดแก้ไข',
      's7.k':'คุณสมบัติเฉพาะ 04','s7.h':'เผยแพร่ครั้งเดียว &mdash; <span class="grad">ทุกคนเห็น</span>',
      's7.b1':'ตั้งค่าในเครื่อง','s7.s1':'ตั้งแบรนด์ &amp; แก้ไขเนื้อหาแล็บในมุมมองผู้สร้าง','s7.b2':'ใช้งาน &amp; คอมมิต','s7.s2':'แบรนด์ &amp; เนื้อหาถูกส่งเป็น <code>branding.json</code> + <code>labs.json</code>','s7.b3':'ปรับใช้อัตโนมัติ','s7.s3':'GitHub Actions สร้าง &amp; เผยแพร่ไปยัง GitHub Pages ทุกครั้งที่พุช','s7.b4':'ทุกคนเห็น','s7.s4':'ผู้เข้าร่วมเปิด URL สด &mdash; เนื้อหาเดียวกัน แบรนด์เดียวกัน',
      's7.note':'ไม่ต้องตั้งค่ารายบุคคล ไฟล์ที่เผยแพร่คือแหล่งข้อมูลจริงเพียงหนึ่งเดียวสำหรับผู้เยี่ยมชมทุกคน',
      's8.k':'⚡ เริ่มเร็ว','s8.h':'JumpStart v2 คือ<span class="grad">การเริ่มต้นที่รวดเร็ว</span>',
      's8.b1':'เปิดลิงก์','s8.s1':'URL เดียว เบราว์เซอร์สมัยใหม่ใดก็ได้ เริ่มได้โดยไม่ต้องติดตั้งหรือลงชื่อเข้าใช้','s8.b2':'เลือกภาษา','s8.s2':'สลับเป็น EN / 中文 / 日本語 / 한국어 / ไทย / हिन्दी ที่หน้าปก','s8.b3':'เข้าสู่ระบบ &amp; สร้าง','s8.s3':'ทำทีละแล็บ คัดลอกพรอมป์ ติดตามความคืบหน้า และเฉลิมฉลอง','s8.url':'เวิร์กช็อปสด','s8.lede':'ลิงก์เดียว ทุกภาษา สร้าง Agent จริงในไม่กี่นาที — ไม่ต้องติดตั้ง ไม่ต้องรอ','s8.c1':'เริ่มง่ายสุด ๆ','s8.c2':'บริการตนเอง','s8.c3':'เรียนตามจังหวะตัวเอง','s8.c4':'คัดลอกแล้วสร้าง','s8.c5':'พร้อมหลายภาษา',
      's9.badge':'พร้อมเมื่อคุณพร้อม','s9.thanks':'ขอขอบคุณการมีส่วนร่วมจากทีม JumpStart v-Team','s9.h':'นำ JumpStart v2 ไปสู่<br><span class="grad">เวิร์กช็อปลูกค้าครั้งถัดไป</span>','s9.lede':'ไม่ว่าจะเป็นการเสริมศักยภาพภายในหรืออีเวนต์ลูกค้าภายนอก &mdash; ร่วมแบรนด์ แชร์ลิงก์ และให้ผู้เข้าร่วมสร้าง Agent จริงด้วยตนเอง','s10.k':'⚡ JumpStart V2','s10.h':'จาก<span class="grad">แล็บสู่ผลลัพธ์</span>','s10.t1':'เริ่มเร็ว','s10.d1':'เปิดลิงก์เดียวก็เริ่มได้ — ไม่ต้องติดตั้ง ไม่ต้องตั้งค่า','s10.t2':'บริการตนเอง & ตามจังหวะ','s10.d2':'ผู้เข้าร่วมขับเคลื่อนเอง ส่วนคุณเป็นผู้อำนวยความสะดวก','s10.t3':'คัดลอกแล้วสร้าง','s10.d3':'พรอมป์ที่คัดลอกได้ เปลี่ยนแต่ละขั้นตอนเป็น Agent ที่ใช้งานได้จริง','s10.t4':'พร้อมหลายภาษา','s10.d4':'หกภาษา ลิงก์แชร์เดียว','s10.t5':'จากแล็บสู่ผลลัพธ์','s10.d5':'ส่งมอบ Agent ที่สร้างคุณค่าทางธุรกิจจริง — อย่างรวดเร็ว',
      'ui.hint':'← → เลื่อน · F เต็มจอ',
    },
    hi:{
      'c.lede':'Microsoft Copilot Studio में कस्टम Agent की पूरी श्रृंखला बनाने के लिए एक व्यावहारिक, स्व-निर्देशित, बहुभाषी लैब अनुभव।',
      'c.p1':'6 निर्देशित लैब','c.p2':'29 चरण','c.p3':'6 भाषाएँ','c.p4':'1 साझा करने योग्य लिंक',
      's2.k':'🎬 एक पंक्ति में','s2.h':'एक वर्कशॉप जो खुद चलती है &mdash; <span class="grad">सीखने वाले बस प्ले दबाते हैं</span> ▶️',
      's2.big':'JumpStart v2 “स्लाइड और डेमो” सत्र को एक <b>जीवंत, खुद-करें लैब ऐप</b> में बदल देता है। प्रतिभागी एक लिंक खोलते हैं, अपनी भाषा चुनते हैं, और चरण-दर-चरण असली Agent बनाते हैं &mdash; जबकि आप देखरेख के बजाय मार्गदर्शन करते हैं।',
      's2.t1':'<span class="e">🖥️</span> स्व-गति, ब्राउज़र-आधारित, शून्य इंस्टॉल','s2.t2':'<span class="e">📋</span> हर चरण कॉपी-तैयार और स्क्रीनशॉट-निर्देशित है','s2.t3':'<span class="e">🤝</span> आंतरिक सक्षमता <b>और</b> ग्राहक वर्कशॉप दोनों के लिए उपयुक्त',
      's2.l1':'व्यावहारिक लैब','s2.l2':'निर्देशित चरण','s2.l3':'भाषाएँ','s2.l4':'पुनः उपयोग, कोई भी ग्राहक',
      's3.k':'🧭 सीखने का मार्ग','s3.h':'छह लैब, पहले Agent से <span class="grad">रीयल-टाइम आवाज़</span> तक 🎙️','s3.a1':'प्रशिक्षु','s3.a2':'अभिलेखी','s3.a3':'वृत्तांतकार','s3.a4':'दूत','s3.a5':'स्क्वाड्रन','s3.a6':'उद्घोषक',
      's3.t1':'Agent Maker से मिलें','s3.d1':'Microsoft.com + Microsoft Learn MCP के साथ एक आधारित, बहुभाषी Agent बनाएँ।',
      's3.t2':'व्यावसायिक संदर्भ लाएँ','s3.d2':'Dataverse MCP, पुन: प्रयोज्य Skills, Memory, और एक CoWork ग्राहक-360 वर्कफ़्लो।',
      's3.t3':'साक्ष्य-आधारित RFP','s3.d3':'Work IQ + Microsoft IQ पूरे Office में स्रोत-सहित RFP/RFI उत्तर तैयार करते हैं।',
      's3.t4':'विशेषज्ञ Agent जोड़ें','s3.d4':'ServiceNow ज्ञान + टिकट, कनेक्टेड Agent, Teams &amp; M365 Copilot।',
      's3.t5':'मल्टी-Agent ईमेल Workflow','s3.d5':'आने वाले ईमेल को वर्गीकृत करें &rarr; सही Agent पर भेजें &rarr; वैयक्तिकृत उत्तर।',
      's3.t6':'रीयल-टाइम आवाज़ Agent','s3.d6':'क्लासिक Agent + रीयल-टाइम आवाज़, बहुभाषी, Test विंडो में लाइव परीक्षण।',
      's4.k':'अद्वितीय सुविधा 01','s4.h':'<span class="grad">डिज़ाइन से ही</span> बहुभाषी',
      's4.big':'एक क्लिक <b>पूरे लैब अनुभव</b> को — वही पृष्ठ, निर्देश, साइडबार, और UI — <b>English, 中文, 日本語, 한국어, ไทย, हिन्दी</b> के बीच बदल देता है।',
      's4.t1':'उत्पाद नाम, प्रॉम्प्ट &amp; टूल नाम जानबूझकर अंग्रेज़ी में रहते हैं','s4.t2':'कॉपी-तैयार प्रॉम्प्ट कभी “अनुवाद में खो” नहीं जाते','s4.t3':'स्थानीयकृत स्क्रीनशॉट न होने पर स्क्रीनशॉट स्वतः अंग्रेज़ी में बदल जाते हैं',
      's5.k':'अद्वितीय सुविधा 02','s5.h':'करके-सीखने वाला UX जो <span class="grad">वाकई आनंददायक</span> है',
      's5.b1':'Markdown-समृद्ध चरण','s5.s1':'शीर्षक, तालिकाएँ, कॉलआउट &amp; हाइलाइट सुंदर ढंग से प्रस्तुत होते हैं।','s5.b2':'कॉपी-तैयार प्रॉम्प्ट','s5.s2':'हर निर्देश एक क्लिक में क्लिपबोर्ड पर।','s5.b3':'प्रगति ट्रैकिंग','s5.s3':'सभी 29 चरणों में प्रति-चरण पूर्णता, स्थानीय रूप से सहेजी गई।','s5.b4':'पूर्ण होने पर आतिशबाज़ी','s5.s4':'हर पूरा हुआ चरण एक उत्सवी आतिशबाज़ी से पुरस्कृत होता है।','s5.b5':'Glass UI, हल्का &amp; गहरा','s5.s5':'आधुनिक फ्रॉस्टेड-ग्लास डिज़ाइन, हर जगह थीम-अनुरूप।',
      's6.k':'अद्वितीय सुविधा 03','s6.h':'सेकंडों में एक <span class="grad">समर्पित वर्कशॉप</span> को को-ब्रांड करें',
      's6.b1':'Microsoft &times; ग्राहक','s6.s1':'ग्राहक का नाम या लोगो सेट करें &mdash; कवर तुरंत को-ब्रांड हो जाता है।','s6.b2':'सहेजें &amp; पुनः उपयोग करें','s6.s2':'वर्कशॉप इतिहास: पिछले सेटअप सहेजें, पुनः प्राप्त करें, और त्वरित खोजें।','s6.b3':'URL या अपलोड द्वारा लोगो','s6.s3':'स्व-निहित &mdash; किसी बाहरी छवि होस्टिंग की आवश्यकता नहीं।','s6.b4':'पासवर्ड-संरक्षित','s6.s4':'केवल सूत्रधार ही ब्रांडिंग बदल सकते हैं &mdash; संपादन मोड जैसा ही गेट।',
      's7.k':'अद्वितीय सुविधा 04','s7.h':'एक बार प्रकाशित करें &mdash; <span class="grad">सब देखते हैं</span>',
      's7.b1':'स्थानीय रूप से कॉन्फ़िगर करें','s7.s1':'मेकर व्यू में ब्रांडिंग सेट करें &amp; लैब सामग्री संपादित करें।','s7.b2':'लागू करें &amp; कमिट करें','s7.s2':'ब्रांडिंग &amp; सामग्री <code>branding.json</code> + <code>labs.json</code> के रूप में भेजी जाती है।','s7.b3':'स्वतः-डिप्लॉय','s7.s3':'हर पुश पर GitHub Actions बनाकर GitHub Pages पर प्रकाशित करता है।','s7.b4':'सब देखते हैं','s7.s4':'प्रतिभागी लाइव URL खोलते हैं &mdash; वही सामग्री, वही ब्रांड।',
      's7.note':'कोई प्रति-उपयोगकर्ता सेटअप नहीं। प्रकाशित फ़ाइलें हर आगंतुक के लिए एकमात्र विश्वसनीय स्रोत हैं।',
      's8.k':'⚡ फ़ास्ट स्टार्ट','s8.h':'JumpStart v2 है एक <span class="grad">फ़ास्ट स्टार्ट</span>',
      's8.b1':'लिंक खोलें','s8.s1':'एक URL, कोई भी आधुनिक ब्राउज़र। शुरू करने के लिए न इंस्टॉल, न साइन-इन।','s8.b2':'एक भाषा चुनें','s8.s2':'कवर पर EN / 中文 / 日本語 / 한국어 / ไทย / हिन्दी पर स्विच करें।','s8.b3':'प्रवेश करें &amp; बनाएँ','s8.s3':'लैब दर लैब काम करें, प्रॉम्प्ट कॉपी करें, प्रगति ट्रैक करें, जश्न मनाएँ।','s8.url':'लाइव वर्कशॉप','s8.lede':'एक लिंक। कोई भी भाषा। मिनटों में असली Agent — न इंस्टॉल, न इंतज़ार।','s8.c1':'शुरू करना बेहद आसान','s8.c2':'सेल्फ-सर्व','s8.c3':'अपनी गति से','s8.c4':'कॉपी करें और बनाएँ','s8.c5':'बहुभाषी तैयार',
      's9.badge':'जब आप तैयार हों','s9.thanks':'JumpStart v-Team टीम के योगदान के लिए हार्दिक धन्यवाद','s9.h':'JumpStart v2 को अपनी<br><span class="grad">अगली ग्राहक वर्कशॉप</span> में लाएँ','s9.lede':'आंतरिक सक्षमता हो या बाहरी ग्राहक कार्यक्रम &mdash; इसे को-ब्रांड करें, लिंक साझा करें, और प्रतिभागियों को असली Agent व्यावहारिक रूप से बनाने दें।','s10.k':'⚡ JumpStart V2','s10.h':'<span class="grad">लैब से प्रभाव</span> तक','s10.t1':'फ़ास्ट स्टार्ट','s10.d1':'एक लिंक खोलें और शुरू करें — न इंस्टॉल, न सेटअप।','s10.t2':'सेल्फ-सर्व और अपनी गति','s10.d2':'प्रतिभागी खुद आगे बढ़ते हैं, आप सहायक बनते हैं।','s10.t3':'कॉपी करें और बनाएँ','s10.d3':'कॉपी-तैयार प्रॉम्प्ट हर चरण को असली, काम करते Agent में बदलते हैं।','s10.t4':'बहुभाषी तैयार','s10.d4':'छह भाषाएँ, एक साझा लिंक।','s10.t5':'लैब से प्रभाव तक','s10.d5':'असली व्यावसायिक मूल्य देने वाले Agent तेज़ी से पहुँचाएँ।',
      'ui.hint':'← → नेविगेट · F पूर्ण स्क्रीन',
    },
  };
  const LANGS=['en','zh','ja','ko','th','hi'];
  const i18nEls=[...document.querySelectorAll('[data-i18n]')];
  i18nEls.forEach(el=>{el.dataset.en=el.innerHTML;});
  const langBtns=[...document.querySelectorAll('#langbar button')];
  function applyLang(lang){
    if(!LANGS.includes(lang))lang='en';
    i18nEls.forEach(el=>{const k=el.getAttribute('data-i18n');const v=lang==='en'?el.dataset.en:(T[lang]&&T[lang][k]);el.innerHTML=(v!=null?v:el.dataset.en);});
    const blueprint=document.querySelector('[data-blueprint]');
    if(blueprint){blueprint.src=blueprintImages[lang]||blueprintImages.en;blueprint.alt=blueprintAlt[lang]||blueprintAlt.en;}
    const jumpstart=document.querySelector('[data-jumpstart]');
    if(jumpstart){jumpstart.src=jumpstartImages[lang]||jumpstartImages.en;}
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
