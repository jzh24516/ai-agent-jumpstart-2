const pptxgen = require('pptxgenjs')
const path = require('path')

const IMG = (n) => path.join(__dirname, 'img', n)
const p = new pptxgen()
p.defineLayout({ name: 'W', width: 13.333, height: 7.5 })
p.layout = 'W'
p.author = 'Microsoft MCAPS Core - Agent Asia Team'
p.title = 'AI Agent JumpStart Workshop v2 - Highlights'

const C = {
  bg: '120F22', bg2: '181334', panel: '221C3F', panelHi: '2B2450', brd: '3B3460',
  txt: 'ECECF5', mut: 'B4B1CC', pur: 'A78BFA', pink: 'F472B6', cyan: '22D3EE', white: 'FFFFFF',
}
const FH = 'Segoe UI Semibold'
const FB = 'Segoe UI'

const bgFill = (s) => {
  s.background = { color: C.bg }
  s.addShape(p.shapes.OVAL, { x: -2.4, y: -3, w: 7.5, h: 7.5, fill: { color: '7C3AED', transparency: 78 }, line: { type: 'none' } })
  s.addShape(p.shapes.OVAL, { x: 9.2, y: 4.4, w: 7, h: 7, fill: { color: 'EC4899', transparency: 82 }, line: { type: 'none' } })
}
const kicker = (s, t, x = 0.7, y = 0.58) =>
  s.addText(t.toUpperCase(), { x, y, w: 8, h: 0.34, fontFace: FH, fontSize: 12.5, bold: true, color: C.pur, charSpacing: 3, align: 'left', margin: 0 })
const title = (s, runs, y = 1.0, w = 12.1, size = 33) =>
  s.addText(runs, { x: 0.7, y, w, h: 1.0, fontFace: FH, fontSize: size, bold: true, color: C.txt, align: 'left', margin: 0 })
const card = (s, x, y, w, h, fill = C.panel) =>
  s.addShape(p.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.12, fill: { color: fill }, line: { color: C.brd, width: 1 } })
const frame = (s, x, y, w, h) =>
  s.addShape(p.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.06, fill: { type: 'none' }, line: { color: C.brd, width: 1.25 } })

// ---------- Slide 1: Cover ----------
let s = p.addSlide(); bgFill(s)
s.addText([{ text: '● ', options: { color: C.pink } }, { text: 'Microsoft Copilot Studio', options: { color: 'E9E6FF' } }],
  { x: 0.7, y: 0.7, w: 5, h: 0.4, fontFace: FB, fontSize: 12, bold: true, align: 'left' })
s.addText([
  { text: 'AI Agent JumpStart', options: { color: C.white, breakLine: true } },
  { text: 'Workshop v2', options: { color: C.pur } },
], { x: 0.66, y: 1.5, w: 7.2, h: 1.9, fontFace: FH, fontSize: 46, bold: true, align: 'left', lineSpacingMultiple: 0.98, margin: 0 })
s.addText('A hands-on, self-guided, multilingual lab experience for building the full breadth of custom agents in Microsoft Copilot Studio.',
  { x: 0.7, y: 3.55, w: 6.6, h: 1.1, fontFace: FB, fontSize: 15, color: 'CFCDE0', align: 'left', lineSpacingMultiple: 1.05 })
s.addText('Microsoft MCAPS Core — Agent Asia Team   ·   July 16, 2026',
  { x: 0.7, y: 4.7, w: 6.6, h: 0.35, fontFace: FB, fontSize: 12, color: C.mut, align: 'left' })
let px = 0.7
;['6 guided labs', '29 steps', '4 languages', '1 shareable link'].forEach((t) => {
  const w = 0.42 + t.length * 0.098
  s.addShape(p.shapes.ROUNDED_RECTANGLE, { x: px, y: 5.35, w, h: 0.5, rectRadius: 0.1, fill: { color: C.panel }, line: { color: C.brd, width: 1 } })
  s.addText(t, { x: px, y: 5.35, w, h: 0.5, fontFace: FH, fontSize: 12, bold: true, color: 'EFEDFA', align: 'center', valign: 'middle', margin: 0 })
  px += w + 0.18
})
s.addImage({ path: IMG('cover-en.png'), x: 8.0, y: 1.6, w: 5.05, h: 3.56, rounding: true })
frame(s, 8.0, 1.6, 5.05, 3.56)

// ---------- Slide 2: What it is ----------
s = p.addSlide(); s.background = { color: C.bg2 }
kicker(s, '🎬 The one-liner')
title(s, [{ text: 'A workshop that runs itself — ', options: { color: C.txt } }, { text: 'learners just press play', options: { color: C.pink } }, { text: '  ▶️', options: { color: C.txt } }])
s.addText('JumpStart v2 turns a slide-and-demo session into a living, do-it-yourself lab app. Attendees open one link, pick their language, and build real agents step by step — while you facilitate instead of babysit.',
  { x: 0.7, y: 2.35, w: 6.7, h: 2.0, fontFace: FB, fontSize: 20, color: 'E4E2F0', align: 'left', lineSpacingMultiple: 1.18 })
;['Self-paced, browser-based, zero install', 'Every step is copy-ready and screenshot-guided', 'Works for internal enablement and customer workshops'].forEach((t, i) => {
  const y = 4.55 + i * 0.72
  s.addShape(p.shapes.OVAL, { x: 0.74, y: y + 0.09, w: 0.2, h: 0.2, fill: { color: C.pur }, line: { type: 'none' } })
  s.addText(t, { x: 1.14, y, w: 6.3, h: 0.5, fontFace: FB, fontSize: 17, color: 'D7D5E6', align: 'left', valign: 'top', margin: 0 })
})
;[['6', 'hands-on labs', '🧪'], ['29', 'guided steps', '👣'], ['4', 'languages', '🌍'], ['∞', 'reuse, any customer', '🔁']].forEach((st, i) => {
  const x = 8.0 + (i % 2) * 2.72, y = 2.15 + Math.floor(i / 2) * 2.55
  card(s, x, y, 2.5, 2.3)
  s.addText(st[2], { x, y: y + 0.2, w: 2.5, h: 0.5, fontSize: 22, align: 'center', margin: 0 })
  s.addText(st[0], { x, y: y + 0.6, w: 2.5, h: 1.0, fontFace: FH, fontSize: 50, bold: true, color: C.pur, align: 'center', margin: 0 })
  s.addText(st[1], { x, y: y + 1.66, w: 2.5, h: 0.5, fontFace: FB, fontSize: 16, color: C.mut, align: 'center', margin: 0 })
})

// ---------- Slide 3: 6 labs ----------
s = p.addSlide(); s.background = { color: C.bg }
kicker(s, '🧭 The learning path')
title(s, [{ text: 'Six labs, from first agent to ', options: { color: C.txt } }, { text: 'real-time voice', options: { color: C.cyan } }, { text: '  🎙️', options: { color: C.txt } }])
;[
  ['01', 'Meet the Agent Maker', 'Build a grounded, multilingual agent with Microsoft.com + Microsoft Learn MCP.', '🤖'],
  ['02', 'Bring in business context', 'Dataverse MCP, reusable Skills, Memory, and a CoWork customer-360 workflow.', '🗂️'],
  ['03', 'Evidence-based RFP', 'Work IQ + Microsoft IQ generate sourced RFP/RFI responses across Office.', '📝'],
  ['04', 'Connect specialist agents', 'ServiceNow knowledge + tickets, connected agents, Teams & M365 Copilot.', '🔌'],
  ['05', 'Multi-agent email Workflow', 'Classify inbound email, route to the right agent, personalized reply.', '📨'],
  ['06', 'Real-time voice agent', 'Classic agent + real-time voice, multilingual, tested live in the Test window.', '🎙️'],
].forEach((l, i) => {
  const x = 0.7 + (i % 3) * 4.06, y = 2.2 + Math.floor(i / 3) * 2.5, w = 3.86, h = 2.28
  card(s, x, y, w, h)
  s.addText(l[3], { x: x + w - 1.02, y: y + 0.22, w: 0.8, h: 0.5, fontSize: 22, align: 'right', margin: 0 })
  s.addText(l[0], { x: x + 0.32, y: y + 0.28, w: 2, h: 0.34, fontFace: FH, fontSize: 15, bold: true, color: C.pur, margin: 0 })
  s.addText(l[1], { x: x + 0.32, y: y + 0.66, w: w - 0.64, h: 0.55, fontFace: FH, fontSize: 19, bold: true, color: C.txt, margin: 0 })
  s.addText(l[2], { x: x + 0.32, y: y + 1.26, w: w - 0.6, h: 0.9, fontFace: FB, fontSize: 14.5, color: C.mut, margin: 0, lineSpacingMultiple: 1.06 })
})

// ---------- Slide 4: Multilingual ----------
s = p.addSlide(); s.background = { color: C.bg2 }
kicker(s, 'Unique feature 01')
title(s, [{ text: 'Multilingual ', options: { color: C.txt } }, { text: 'by design', options: { color: C.pur } }])
s.addText('One click switches the entire experience — cover, labs, instructions, and UI — between English, 中文, 日本語, and 한국어.',
  { x: 0.7, y: 2.35, w: 5.9, h: 1.7, fontFace: FB, fontSize: 20, color: 'E4E2F0', align: 'left', lineSpacingMultiple: 1.18 })
;['Product names, prompts & tool names stay in English on purpose', 'Copy-ready prompts never get "lost in translation"', 'Screenshots fall back to English automatically'].forEach((t, i) => {
  const y = 4.35 + i * 0.72
  s.addShape(p.shapes.OVAL, { x: 0.74, y: y + 0.08, w: 0.2, h: 0.2, fill: { color: C.pink }, line: { type: 'none' } })
  s.addText(t, { x: 1.14, y, w: 5.6, h: 0.5, fontFace: FB, fontSize: 17, color: 'D7D5E6', align: 'left', margin: 0 })
})
let lx = 0.7
;['EN', '中文', '日本語', '한국어'].forEach((t) => {
  const w = 1.15
  s.addShape(p.shapes.ROUNDED_RECTANGLE, { x: lx, y: 6.55, w, h: 0.72, rectRadius: 0.1, fill: { color: C.panelHi }, line: { color: C.brd, width: 1 } })
  s.addText(t, { x: lx, y: 6.55, w, h: 0.72, fontFace: FH, fontSize: 18, bold: true, color: 'EFEDFA', align: 'center', valign: 'middle', margin: 0 })
  lx += w + 0.2
})
s.addImage({ path: IMG('lab-en.png'), x: 6.95, y: 1.95, w: 3.55, h: 2.49, rounding: true }); frame(s, 6.95, 1.95, 3.55, 2.49)
s.addImage({ path: IMG('lab-zh.png'), x: 9.25, y: 4.05, w: 3.55, h: 2.49, rounding: true }); frame(s, 9.25, 4.05, 3.55, 2.49)

// ---------- Slide 5: Learn by doing ----------
s = p.addSlide(); s.background = { color: C.bg }
kicker(s, 'Unique feature 02')
title(s, [{ text: "A learn-by-doing UX that's ", options: { color: C.txt } }, { text: 'actually joyful', options: { color: C.pink } }])
;[
  ['Markdown-rich steps', 'Headings, tables, callouts & highlights render beautifully.'],
  ['Copy-ready prompts', 'Every instruction is one click to clipboard.'],
  ['Progress tracking', 'Per-step completion across all 29 steps, saved locally.'],
  ['Fireworks on completion', 'A celebratory burst rewards every finished step.'],
  ['Glass UI, light & dark', 'Modern frosted-glass design, theme-aware everywhere.'],
].forEach((f, i) => {
  const y = 2.2 + i * 0.98
  s.addShape(p.shapes.ROUNDED_RECTANGLE, { x: 0.7, y, w: 0.62, h: 0.62, rectRadius: 0.11, fill: { color: C.pur }, line: { type: 'none' } })
  s.addText('◆', { x: 0.7, y, w: 0.62, h: 0.62, fontFace: FB, fontSize: 17, color: C.white, align: 'center', valign: 'middle', margin: 0 })
  s.addText(f[0], { x: 1.5, y: y - 0.02, w: 5.7, h: 0.38, fontFace: FH, fontSize: 18.5, bold: true, color: C.txt, margin: 0 })
  s.addText(f[1], { x: 1.5, y: y + 0.38, w: 5.7, h: 0.5, fontFace: FB, fontSize: 14.5, color: C.mut, margin: 0 })
})
s.addImage({ path: IMG('lab-overview.png'), x: 7.55, y: 2.05, w: 5.1, h: 3.66, rounding: true }); frame(s, 7.55, 2.05, 5.1, 3.66)

// ---------- Slide 6: Co-branding ----------
s = p.addSlide(); s.background = { color: C.bg2 }
kicker(s, 'Unique feature 03')
title(s, [{ text: 'Co-brand a ', options: { color: C.txt } }, { text: 'dedicated workshop', options: { color: C.cyan } }, { text: ' in seconds', options: { color: C.txt } }])
s.addImage({ path: IMG('cover-lenovo.png'), x: 0.7, y: 2.1, w: 5.6, h: 3.92, rounding: true }); frame(s, 0.7, 2.1, 5.6, 3.92)
;[
  ['Microsoft × Customer', 'Set a customer name or logo — the cover instantly co-brands.'],
  ['Save & reuse', 'Workshop history: save, retrieve, and quick-search past setups.'],
  ['Logos by URL or upload', 'Self-contained — no external image hosting needed.'],
  ['Password-gated', 'Only facilitators can change branding — same gate as edit mode.'],
].forEach((f, i) => {
  const y = 2.25 + i * 1.05
  s.addShape(p.shapes.ROUNDED_RECTANGLE, { x: 6.7, y, w: 0.62, h: 0.62, rectRadius: 0.11, fill: { color: C.pink }, line: { type: 'none' } })
  s.addText('◇', { x: 6.7, y, w: 0.62, h: 0.62, fontFace: FB, fontSize: 17, color: C.white, align: 'center', valign: 'middle', margin: 0 })
  s.addText(f[0], { x: 7.5, y: y - 0.02, w: 5.2, h: 0.38, fontFace: FH, fontSize: 18.5, bold: true, color: C.txt, margin: 0 })
  s.addText(f[1], { x: 7.5, y: y + 0.4, w: 5.2, h: 0.55, fontFace: FB, fontSize: 14.5, color: C.mut, margin: 0, lineSpacingMultiple: 1.04 })
})

// ---------- Slide 7: Publish once ----------
s = p.addSlide(); s.background = { color: C.bg }
kicker(s, 'Unique feature 04')
title(s, [{ text: 'Publish once — ', options: { color: C.txt } }, { text: 'everyone sees it', options: { color: C.pur } }])
;[
  ['1', 'Configure locally', 'Set branding & edit lab content in the maker view.'],
  ['2', 'Apply & commit', 'Branding & content ship as branding.json + labs.json.'],
  ['3', 'Auto-deploy', 'GitHub Actions builds & publishes to GitHub Pages on push.'],
  ['4', 'Everyone sees it', 'Attendees open the live URL — same content, same brand.'],
].forEach((f, i) => {
  const x = 0.7 + i * 3.12, y = 2.35, w = 2.75, h = 3.15
  card(s, x, y, w, h, i === 3 ? C.panelHi : C.panel)
  s.addShape(p.shapes.ROUNDED_RECTANGLE, { x: x + 0.3, y: y + 0.32, w: 0.62, h: 0.62, rectRadius: 0.11, fill: { color: i === 3 ? C.pink : C.pur }, line: { type: 'none' } })
  s.addText(f[0], { x: x + 0.3, y: y + 0.32, w: 0.62, h: 0.62, fontFace: FH, fontSize: 18, bold: true, color: C.white, align: 'center', valign: 'middle', margin: 0 })
  s.addText(f[1], { x: x + 0.3, y: y + 1.16, w: w - 0.5, h: 0.6, fontFace: FH, fontSize: 18, bold: true, color: C.txt, margin: 0 })
  s.addText(f[2], { x: x + 0.3, y: y + 1.78, w: w - 0.52, h: 1.1, fontFace: FB, fontSize: 14.5, color: C.mut, margin: 0, lineSpacingMultiple: 1.08 })
  if (i < 3) s.addText('→', { x: x + w - 0.04, y: y + 1.2, w: 0.42, h: 0.6, fontFace: FB, fontSize: 24, bold: true, color: C.pur, align: 'center', valign: 'middle', margin: 0 })
})
s.addText('No per-user setup. The published files are the single source of truth for every visitor.',
  { x: 0.7, y: 5.95, w: 12, h: 0.5, fontFace: FB, fontSize: 17, italic: true, color: C.mut, align: 'left' })

// ---------- Slide 8: How to run ----------
s = p.addSlide(); s.background = { color: C.bg2 }
kicker(s, 'For your attendees')
title(s, [{ text: 'Running it is ', options: { color: C.txt } }, { text: 'three steps', options: { color: C.cyan } }])
;[
  ['1', 'Open the link', 'One URL, any modern browser. No install, no sign-in to start.'],
  ['2', 'Pick a language', 'Switch to EN / 中文 / 日本語 / 한국어 on the cover.'],
  ['3', 'Enter & build', 'Work lab by lab, copy prompts, track progress, celebrate.'],
].forEach((f, i) => {
  const x = 0.7 + i * 4.12, y = 2.4, w = 3.7, h = 2.95
  card(s, x, y, w, h)
  s.addShape(p.shapes.ROUNDED_RECTANGLE, { x: x + 0.32, y: y + 0.34, w: 0.72, h: 0.72, rectRadius: 0.12, fill: { color: C.pur }, line: { type: 'none' } })
  s.addText(f[0], { x: x + 0.32, y: y + 0.34, w: 0.72, h: 0.72, fontFace: FH, fontSize: 22, bold: true, color: C.white, align: 'center', valign: 'middle', margin: 0 })
  s.addText(f[1], { x: x + 0.32, y: y + 1.25, w: w - 0.6, h: 0.5, fontFace: FH, fontSize: 20, bold: true, color: C.txt, margin: 0 })
  s.addText(f[2], { x: x + 0.32, y: y + 1.82, w: w - 0.6, h: 0.9, fontFace: FB, fontSize: 15, color: C.mut, margin: 0, lineSpacingMultiple: 1.08 })
})
s.addShape(p.shapes.ROUNDED_RECTANGLE, { x: 0.7, y: 5.75, w: 11.93, h: 1.0, rectRadius: 0.11, fill: { color: C.panel }, line: { color: C.brd, width: 1 } })
s.addText('LIVE WORKSHOP', { x: 1.0, y: 5.75, w: 2.5, h: 1.0, fontFace: FH, fontSize: 13, bold: true, color: C.pur, charSpacing: 2, valign: 'middle', margin: 0 })
s.addText('https://jzh24516.github.io/ai-agent-jumpstart-2/', { x: 3.4, y: 5.75, w: 9.0, h: 1.0, fontFace: FB, fontSize: 21, bold: true, color: 'EFEDFA', valign: 'middle', margin: 0 })

// ---------- Slide 9: Closing ----------
s = p.addSlide(); bgFill(s)
s.addText([{ text: '● ', options: { color: C.pink } }, { text: 'Ready when you are', options: { color: 'E9E6FF' } }],
  { x: 0.7, y: 0.9, w: 5, h: 0.4, fontFace: FB, fontSize: 12, bold: true, align: 'left' })
s.addText([
  { text: 'Bring JumpStart v2 to your', options: { color: C.white, breakLine: true } },
  { text: 'next customer workshop', options: { color: C.pur } },
], { x: 0.66, y: 1.7, w: 8.3, h: 1.9, fontFace: FH, fontSize: 40, bold: true, align: 'left', lineSpacingMultiple: 1.0, margin: 0 })
s.addText('Internal enablement or external customer event — co-brand it, share the link, and let attendees build real agents hands-on.',
  { x: 0.7, y: 3.7, w: 8.1, h: 0.9, fontFace: FB, fontSize: 16, color: 'CFCDE0', align: 'left', lineSpacingMultiple: 1.1 })
card(s, 0.7, 4.85, 4.0, 1.15)
s.addText('Michael Jiang', { x: 1.02, y: 5.02, w: 3.5, h: 0.42, fontFace: FH, fontSize: 17, bold: true, color: C.txt, margin: 0 })
s.addText('zhijian@microsoft.com', { x: 1.02, y: 5.46, w: 3.5, h: 0.38, fontFace: FB, fontSize: 13.5, color: C.cyan, margin: 0 })
s.addText('Microsoft MCAPS Core — Agent Asia Team', { x: 0.7, y: 6.35, w: 8, h: 0.4, fontFace: FB, fontSize: 12.5, color: C.mut, align: 'left' })
s.addImage({ path: IMG('michael.png'), x: 9.35, y: 1.95, w: 3.1, h: 3.1 })
s.addText('Michael Jiang', { x: 9.05, y: 5.15, w: 3.7, h: 0.4, fontFace: FH, fontSize: 17, bold: true, color: C.txt, align: 'center', margin: 0 })
s.addText('Microsoft MCAPS Core — Agent Asia Team', { x: 9.05, y: 5.58, w: 3.7, h: 0.6, fontFace: FB, fontSize: 12, color: C.mut, align: 'center', margin: 0 })

const out = path.join(__dirname, 'JumpStart-v2-Workshop-Highlights.pptx')
p.writeFile({ fileName: out }).then(() => console.log('PPTX written:', out))
