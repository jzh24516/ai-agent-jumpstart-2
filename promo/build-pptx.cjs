// Builds one localized PowerPoint deck per supported language.
// Non-English text is sourced from the HTML deck's translation table (build-html.cjs)
// so the PPTX stays in sync with the live deck. Blueprint + JumpStart images are
// per-language PNGs (PowerPoint doesn't embed WebP reliably).
const pptxgen = require('pptxgenjs')
const path = require('path')
const fs = require('fs')

const IMG = (n) => path.join(__dirname, 'img', n)
const imgExists = (n) => fs.existsSync(IMG(n))

// ---- Pull non-English strings straight from the HTML deck (single source of truth) ----
const htmlSrc = fs.readFileSync(path.join(__dirname, 'build-html.cjs'), 'utf8')
let T = {}
const tMatch = htmlSrc.match(/const T=\{[\s\S]*?\n {2}\};/)
if (tMatch) {
  const literal = tMatch[0].replace(/^const T=/, '').replace(/;\s*$/, '')
  // eslint-disable-next-line no-new-func
  T = new Function('return (' + literal + ')')()
}

const strip = (s) => (s == null ? '' : String(s)
  .replace(/<br\s*\/?>/gi, ' ')
  .replace(/<[^>]+>/g, '')
  .replace(/&mdash;/g, '\u2014').replace(/&rarr;/g, '\u2192').replace(/&times;/g, '\u00d7')
  .replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  .replace(/\s+/g, ' ').trim())

// English strings (authoritative for en, fallback for any missing translation).
const EN = {
  'c.lede': 'A hands-on, self-guided, multilingual lab experience for building the full breadth of custom agents in Microsoft Copilot Studio.',
  'c.p1': '6 guided labs', 'c.p2': '29 steps', 'c.p3': '6 languages', 'c.p4': '1 shareable link',
  's2.k': '\uD83C\uDFAC The one-liner',
  's2.h': 'A workshop that runs itself \u2014 learners just press play  \u25B6\uFE0F',
  's2.big': 'JumpStart v2 turns a slide-and-demo session into a living, do-it-yourself lab app. Attendees open one link, pick their language, and build real agents step by step \u2014 while you facilitate instead of babysit.',
  's2.t1': 'Self-paced, browser-based, zero install',
  's2.t2': 'Every step is copy-ready and screenshot-guided',
  's2.t3': 'Works for internal enablement and customer workshops',
  's2.l1': 'hands-on labs', 's2.l2': 'guided steps', 's2.l3': 'languages', 's2.l4': 'reuse, any customer',
  's3.k': '\uD83E\uDDED The learning path',
  's3.h': 'Six labs, from first agent to real-time voice  \uD83C\uDF99\uFE0F',
  's3.t1': 'Meet the Agent Maker', 's3.d1': 'Build a grounded, multilingual agent with Microsoft.com + Microsoft Learn MCP.',
  's3.t2': 'Bring in business context', 's3.d2': 'Dataverse MCP, reusable Skills, Memory, and a CoWork customer-360 workflow.',
  's3.t3': 'Evidence-based RFP', 's3.d3': 'Work IQ + Microsoft IQ generate sourced RFP/RFI responses across Office.',
  's3.t4': 'Connect specialist agents', 's3.d4': 'ServiceNow knowledge + tickets, connected agents, Teams & M365 Copilot.',
  's3.t5': 'Multi-agent email Workflow', 's3.d5': 'Classify inbound email, route to the right agent, personalized reply.',
  's3.t6': 'Real-time voice agent', 's3.d6': 'Classic agent + real-time voice, multilingual, tested live in the Test window.',
  's4.k': 'Unique feature 01', 's4.h': 'Multilingual by design',
  's4.big': 'One click switches the entire experience \u2014 cover, labs, instructions, and UI \u2014 between English, \u4E2D\u6587, \u65E5\u672C\u8A9E, \uD55C\uAD6D\uC5B4, \u0E44\u0E17\u0E22, and \u0939\u093F\u0928\u094D\u0926\u0940.',
  's4.t1': 'Product names, prompts & tool names stay in English on purpose',
  's4.t2': 'Copy-ready prompts never get "lost in translation"',
  's4.t3': 'Screenshots fall back to English automatically',
  's5.k': 'Unique feature 02', 's5.h': "A learn-by-doing UX that's actually joyful",
  's5.b1': 'Markdown-rich steps', 's5.s1': 'Headings, tables, callouts & highlights render beautifully.',
  's5.b2': 'Copy-ready prompts', 's5.s2': 'Every instruction is one click to clipboard.',
  's5.b3': 'Progress tracking', 's5.s3': 'Per-step completion across all 29 steps, saved locally.',
  's5.b4': 'Fireworks on completion', 's5.s4': 'A celebratory burst rewards every finished step.',
  's5.b5': 'Glass UI, light & dark', 's5.s5': 'Modern frosted-glass design, theme-aware everywhere.',
  's6.k': 'Unique feature 03', 's6.h': 'Co-brand a dedicated workshop in seconds',
  's6.b1': 'Microsoft \u00D7 Customer', 's6.s1': 'Set a customer name or logo \u2014 the cover instantly co-brands.',
  's6.b2': 'Save & reuse', 's6.s2': 'Workshop history: save, retrieve, and quick-search past setups.',
  's6.b3': 'Logos by URL or upload', 's6.s3': 'Self-contained \u2014 no external image hosting needed.',
  's6.b4': 'Password-gated', 's6.s4': 'Only facilitators can change branding \u2014 same gate as edit mode.',
  's7.k': 'Unique feature 04', 's7.h': 'Publish once \u2014 everyone sees it',
  's7.b1': 'Configure locally', 's7.s1': 'Set branding & edit lab content in the maker view.',
  's7.b2': 'Apply & commit', 's7.s2': 'Branding & content ship as branding.json + labs.json.',
  's7.b3': 'Auto-deploy', 's7.s3': 'GitHub Actions builds & publishes to GitHub Pages on every push.',
  's7.b4': 'Everyone sees it', 's7.s4': 'Attendees open the live URL \u2014 same content, same brand.',
  's7.note': 'No per-user setup. The published files are the single source of truth for every visitor.',
  's10.k': '\u26A1 JumpStart V2', 's10.h': 'From Lab to Impact',
  's10.t1': 'Fast Start', 's10.d1': 'Open one link and go \u2014 zero install, zero setup.',
  's10.t2': 'Self-Serve & Self-Paced', 's10.d2': 'Attendees drive their own journey while you facilitate.',
  's10.t3': 'Copy & Build', 's10.d3': 'Copy-ready prompts turn each step into a real, working agent.',
  's10.t4': 'Multilingual Ready', 's10.d4': 'Six languages, one shareable link.',
  's10.t5': 'From Lab to Impact', 's10.d5': 'Ship agents that deliver real business value \u2014 fast.',
  's9.badge': 'Ready when you are', 's9.h': 'Bring JumpStart v2 to your next customer workshop',
  's9.lede': 'Internal enablement or external customer event \u2014 co-brand it, share the link, and let attendees build real agents hands-on.',
}

const C = {
  bg: '120F22', bg2: '181334', panel: '221C3F', panelHi: '2B2450', brd: '3B3460',
  txt: 'ECECF5', mut: 'B4B1CC', pur: 'A78BFA', pink: 'F472B6', cyan: '22D3EE', white: 'FFFFFF',
}

const FONTS = {
  en: { h: 'Segoe UI Semibold', b: 'Segoe UI' },
  zh: { h: 'Microsoft YaHei', b: 'Microsoft YaHei' },
  ja: { h: 'Yu Gothic', b: 'Yu Gothic' },
  ko: { h: 'Malgun Gothic', b: 'Malgun Gothic' },
  th: { h: 'Leelawadee UI', b: 'Leelawadee UI' },
  hi: { h: 'Nirmala UI', b: 'Nirmala UI' },
}

const JUMP = {
  en: 'jumpstart-english.png', zh: 'jumpstart-chinese.png', ja: 'jumpstart-japanese.png',
  ko: 'jumpstart-korean.png', th: 'jumpstart-thai.png', hi: 'jumpstart-hindi.png',
}

const WIDE = { zh: 1, ja: 1, ko: 1 } // rough per-char width class for pill sizing

function build (lang) {
  const p = new pptxgen()
  p.defineLayout({ name: 'W', width: 13.333, height: 7.5 })
  p.layout = 'W'
  p.author = 'Microsoft MCAPS Core - Agent Asia Team'
  p.title = 'AI Agent JumpStart Workshop v2 - Highlights'

  const FH = FONTS[lang].h
  const FB = FONTS[lang].b
  const t = (k) => (lang === 'en' ? (EN[k] != null ? EN[k] : '') : (T[lang] && T[lang][k] != null ? strip(T[lang][k]) : (EN[k] != null ? EN[k] : '')))
  const charW = WIDE[lang] ? 0.155 : 0.098

  const bgFill = (s) => {
    s.background = { color: C.bg }
    s.addShape(p.shapes.OVAL, { x: -2.4, y: -3, w: 7.5, h: 7.5, fill: { color: '7C3AED', transparency: 78 }, line: { type: 'none' } })
    s.addShape(p.shapes.OVAL, { x: 9.2, y: 4.4, w: 7, h: 7, fill: { color: 'EC4899', transparency: 82 }, line: { type: 'none' } })
  }
  const kicker = (s, txt, x = 0.7, y = 0.58) =>
    s.addText(txt, { x, y, w: 8, h: 0.4, fontFace: FH, fontSize: 12.5, bold: true, color: C.pur, charSpacing: 2, align: 'left', valign: 'middle', margin: 0 })
  const H = (s, txt, y = 1.0, w = 12.1, size = 33, x = 0.7) =>
    s.addText(txt, { x, y, w, h: 1.05, fontFace: FH, fontSize: size, bold: true, color: C.txt, align: 'left', valign: 'top', margin: 0 })
  const card = (s, x, y, w, h, fill = C.panel) =>
    s.addShape(p.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.12, fill: { color: fill }, line: { color: C.brd, width: 1 } })
  const frame = (s, x, y, w, h) =>
    s.addShape(p.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.06, fill: { type: 'none' }, line: { color: C.brd, width: 1.25 } })

  // ---------- Slide 1: Cover ----------
  let s = p.addSlide(); bgFill(s)
  s.addText([{ text: '\u25CF ', options: { color: C.pink } }, { text: 'Microsoft Copilot Studio', options: { color: 'E9E6FF' } }],
    { x: 0.7, y: 0.7, w: 5, h: 0.4, fontFace: FB, fontSize: 12, bold: true, align: 'left' })
  s.addText([
    { text: 'AI Agent JumpStart', options: { color: C.white, breakLine: true } },
    { text: 'Workshop v2', options: { color: C.pur } },
  ], { x: 0.66, y: 1.5, w: 7.2, h: 1.9, fontFace: FH, fontSize: 46, bold: true, align: 'left', lineSpacingMultiple: 0.98, margin: 0 })
  s.addText(t('c.lede'), { x: 0.7, y: 3.55, w: 6.6, h: 1.25, fontFace: FB, fontSize: 15, color: 'CFCDE0', align: 'left', lineSpacingMultiple: 1.06 })
  s.addText('Microsoft MCAPS Core \u2014 Agent Asia Team   \u00B7   July 16, 2026',
    { x: 0.7, y: 4.85, w: 6.6, h: 0.35, fontFace: FB, fontSize: 12, color: C.mut, align: 'left' })
  let px = 0.7
  ;[t('c.p1'), t('c.p2'), t('c.p3'), t('c.p4')].forEach((txt) => {
    const w = 0.44 + [...txt].length * charW
    s.addShape(p.shapes.ROUNDED_RECTANGLE, { x: px, y: 5.4, w, h: 0.5, rectRadius: 0.1, fill: { color: C.panel }, line: { color: C.brd, width: 1 } })
    s.addText(txt, { x: px, y: 5.4, w, h: 0.5, fontFace: FH, fontSize: 12, bold: true, color: 'EFEDFA', align: 'center', valign: 'middle', margin: 0 })
    px += w + 0.18
  })
  const coverImg = imgExists('cover-' + lang + '.png') ? 'cover-' + lang + '.png' : 'cover-en.png'
  s.addImage({ path: IMG(coverImg), x: 8.0, y: 1.6, w: 5.05, h: 3.56, rounding: true })
  frame(s, 8.0, 1.6, 5.05, 3.56)

  // ---------- Slide 2: What it is ----------
  s = p.addSlide(); s.background = { color: C.bg2 }
  kicker(s, t('s2.k'))
  H(s, t('s2.h'), 1.0, 7.1, 30)
  s.addText(t('s2.big'), { x: 0.7, y: 2.5, w: 6.7, h: 2.0, fontFace: FB, fontSize: 18, color: 'E4E2F0', align: 'left', lineSpacingMultiple: 1.16 })
  ;[t('s2.t1'), t('s2.t2'), t('s2.t3')].forEach((txt, i) => {
    const y = 4.7 + i * 0.72
    s.addShape(p.shapes.OVAL, { x: 0.74, y: y + 0.09, w: 0.2, h: 0.2, fill: { color: C.pur }, line: { type: 'none' } })
    s.addText(txt, { x: 1.14, y, w: 6.3, h: 0.55, fontFace: FB, fontSize: 16, color: 'D7D5E6', align: 'left', valign: 'top', margin: 0 })
  })
  ;[['6', t('s2.l1'), '\uD83E\uDDEA'], ['29', t('s2.l2'), '\uD83D\uDC63'], ['6', t('s2.l3'), '\uD83C\uDF0D'], ['\u221E', t('s2.l4'), '\uD83D\uDD01']].forEach((st, i) => {
    const x = 8.0 + (i % 2) * 2.72; const y = 2.15 + Math.floor(i / 2) * 2.55
    card(s, x, y, 2.5, 2.3)
    s.addText(st[2], { x, y: y + 0.2, w: 2.5, h: 0.5, fontSize: 22, align: 'center', margin: 0 })
    s.addText(st[0], { x, y: y + 0.6, w: 2.5, h: 1.0, fontFace: FH, fontSize: 50, bold: true, color: C.pur, align: 'center', margin: 0 })
    s.addText(st[1], { x, y: y + 1.66, w: 2.5, h: 0.55, fontFace: FB, fontSize: 15, color: C.mut, align: 'center', valign: 'top', margin: 0 })
  })

  // ---------- Slide 3: 6 labs ----------
  s = p.addSlide(); s.background = { color: C.bg }
  kicker(s, t('s3.k'))
  H(s, t('s3.h'), 1.0, 12.1, 30)
  ;[
    ['01', t('s3.t1'), t('s3.d1'), '\uD83E\uDD16'],
    ['02', t('s3.t2'), t('s3.d2'), '\uD83D\uDDC2\uFE0F'],
    ['03', t('s3.t3'), t('s3.d3'), '\uD83D\uDCDD'],
    ['04', t('s3.t4'), t('s3.d4'), '\uD83D\uDD0C'],
    ['05', t('s3.t5'), t('s3.d5'), '\uD83D\uDCE8'],
    ['06', t('s3.t6'), t('s3.d6'), '\uD83C\uDF99\uFE0F'],
  ].forEach((l, i) => {
    const x = 0.7 + (i % 3) * 4.06; const y = 2.2 + Math.floor(i / 3) * 2.5; const w = 3.86; const h = 2.28
    card(s, x, y, w, h)
    s.addText(l[3], { x: x + w - 1.02, y: y + 0.22, w: 0.8, h: 0.5, fontSize: 22, align: 'right', margin: 0 })
    s.addText(l[0], { x: x + 0.32, y: y + 0.28, w: 2, h: 0.34, fontFace: FH, fontSize: 15, bold: true, color: C.pur, margin: 0 })
    s.addText(l[1], { x: x + 0.32, y: y + 0.66, w: w - 0.64, h: 0.55, fontFace: FH, fontSize: 18, bold: true, color: C.txt, valign: 'top', margin: 0 })
    s.addText(l[2], { x: x + 0.32, y: y + 1.26, w: w - 0.6, h: 0.9, fontFace: FB, fontSize: 14, color: C.mut, valign: 'top', margin: 0, lineSpacingMultiple: 1.05 })
  })

  // ---------- Slide 4: Agent platform blueprint ----------
  s = p.addSlide(); s.background = { color: '0F0D1A' }
  s.addImage({ path: IMG('agent-platform-blueprint-' + lang + '.png'), x: 0.302, y: 0.17, w: 12.729, h: 7.16 })

  // ---------- Slide 5: Multilingual ----------
  s = p.addSlide(); s.background = { color: C.bg2 }
  kicker(s, t('s4.k'))
  H(s, t('s4.h'), 1.0, 6.3, 30)
  s.addText(t('s4.big'), { x: 0.7, y: 2.4, w: 5.95, h: 1.9, fontFace: FB, fontSize: 18, color: 'E4E2F0', align: 'left', lineSpacingMultiple: 1.16 })
  ;[t('s4.t1'), t('s4.t2'), t('s4.t3')].forEach((txt, i) => {
    const y = 4.5 + i * 0.72
    s.addShape(p.shapes.OVAL, { x: 0.74, y: y + 0.08, w: 0.2, h: 0.2, fill: { color: C.pink }, line: { type: 'none' } })
    s.addText(txt, { x: 1.14, y, w: 5.6, h: 0.55, fontFace: FB, fontSize: 16, color: 'D7D5E6', align: 'left', valign: 'top', margin: 0 })
  })
  let lx = 0.7
  ;['EN', '\u4E2D\u6587', '\u65E5\u672C\u8A9E', '\uD55C\uAD6D\uC5B4', '\u0E44\u0E17\u0E22', '\u0939\u093F\u0928\u094D\u0926\u0940'].forEach((txt) => {
    const w = 1.15
    s.addShape(p.shapes.ROUNDED_RECTANGLE, { x: lx, y: 6.55, w, h: 0.72, rectRadius: 0.1, fill: { color: C.panelHi }, line: { color: C.brd, width: 1 } })
    s.addText(txt, { x: lx, y: 6.55, w, h: 0.72, fontFace: FH, fontSize: 18, bold: true, color: 'EFEDFA', align: 'center', valign: 'middle', margin: 0 })
    lx += w + 0.2
  })
  s.addImage({ path: IMG('lab-en.png'), x: 6.95, y: 1.95, w: 3.55, h: 2.49, rounding: true }); frame(s, 6.95, 1.95, 3.55, 2.49)
  s.addImage({ path: IMG('lab-zh.png'), x: 9.25, y: 4.05, w: 3.55, h: 2.49, rounding: true }); frame(s, 9.25, 4.05, 3.55, 2.49)

  // ---------- Slide 6: Learn by doing ----------
  s = p.addSlide(); s.background = { color: C.bg }
  kicker(s, t('s5.k'))
  H(s, t('s5.h'), 1.0, 7.0, 30)
  ;[
    [t('s5.b1'), t('s5.s1')], [t('s5.b2'), t('s5.s2')], [t('s5.b3'), t('s5.s3')],
    [t('s5.b4'), t('s5.s4')], [t('s5.b5'), t('s5.s5')],
  ].forEach((f, i) => {
    const y = 2.2 + i * 0.98
    s.addShape(p.shapes.ROUNDED_RECTANGLE, { x: 0.7, y, w: 0.62, h: 0.62, rectRadius: 0.11, fill: { color: C.pur }, line: { type: 'none' } })
    s.addText('\u25C6', { x: 0.7, y, w: 0.62, h: 0.62, fontFace: FB, fontSize: 17, color: C.white, align: 'center', valign: 'middle', margin: 0 })
    s.addText(f[0], { x: 1.5, y: y - 0.02, w: 5.7, h: 0.4, fontFace: FH, fontSize: 18, bold: true, color: C.txt, valign: 'top', margin: 0 })
    s.addText(f[1], { x: 1.5, y: y + 0.4, w: 5.7, h: 0.5, fontFace: FB, fontSize: 14, color: C.mut, valign: 'top', margin: 0 })
  })
  s.addImage({ path: IMG('lab-overview.png'), x: 7.55, y: 2.05, w: 5.1, h: 3.66, rounding: true }); frame(s, 7.55, 2.05, 5.1, 3.66)

  // ---------- Slide 7: Co-branding ----------
  s = p.addSlide(); s.background = { color: C.bg2 }
  kicker(s, t('s6.k'))
  H(s, t('s6.h'), 1.0, 12.1, 30)
  s.addImage({ path: IMG('cover-lenovo.png'), x: 0.7, y: 2.1, w: 5.6, h: 3.92, rounding: true }); frame(s, 0.7, 2.1, 5.6, 3.92)
  ;[
    [t('s6.b1'), t('s6.s1')], [t('s6.b2'), t('s6.s2')], [t('s6.b3'), t('s6.s3')], [t('s6.b4'), t('s6.s4')],
  ].forEach((f, i) => {
    const y = 2.25 + i * 1.05
    s.addShape(p.shapes.ROUNDED_RECTANGLE, { x: 6.7, y, w: 0.62, h: 0.62, rectRadius: 0.11, fill: { color: C.pink }, line: { type: 'none' } })
    s.addText('\u25C7', { x: 6.7, y, w: 0.62, h: 0.62, fontFace: FB, fontSize: 17, color: C.white, align: 'center', valign: 'middle', margin: 0 })
    s.addText(f[0], { x: 7.5, y: y - 0.02, w: 5.2, h: 0.4, fontFace: FH, fontSize: 18, bold: true, color: C.txt, valign: 'top', margin: 0 })
    s.addText(f[1], { x: 7.5, y: y + 0.42, w: 5.2, h: 0.55, fontFace: FB, fontSize: 14, color: C.mut, valign: 'top', margin: 0, lineSpacingMultiple: 1.04 })
  })

  // ---------- Slide 8: Publish once ----------
  s = p.addSlide(); s.background = { color: C.bg }
  kicker(s, t('s7.k'))
  H(s, t('s7.h'), 1.0, 12.1, 30)
  ;[
    ['1', t('s7.b1'), t('s7.s1')], ['2', t('s7.b2'), t('s7.s2')],
    ['3', t('s7.b3'), t('s7.s3')], ['4', t('s7.b4'), t('s7.s4')],
  ].forEach((f, i) => {
    const x = 0.7 + i * 3.12; const y = 2.35; const w = 2.75; const h = 3.15
    card(s, x, y, w, h, i === 3 ? C.panelHi : C.panel)
    s.addShape(p.shapes.ROUNDED_RECTANGLE, { x: x + 0.3, y: y + 0.32, w: 0.62, h: 0.62, rectRadius: 0.11, fill: { color: i === 3 ? C.pink : C.pur }, line: { type: 'none' } })
    s.addText(f[0], { x: x + 0.3, y: y + 0.32, w: 0.62, h: 0.62, fontFace: FH, fontSize: 18, bold: true, color: C.white, align: 'center', valign: 'middle', margin: 0 })
    s.addText(f[1], { x: x + 0.3, y: y + 1.16, w: w - 0.5, h: 0.6, fontFace: FH, fontSize: 17, bold: true, color: C.txt, valign: 'top', margin: 0 })
    s.addText(f[2], { x: x + 0.3, y: y + 1.78, w: w - 0.52, h: 1.1, fontFace: FB, fontSize: 14, color: C.mut, valign: 'top', margin: 0, lineSpacingMultiple: 1.07 })
    if (i < 3) s.addText('\u2192', { x: x + w - 0.04, y: y + 1.2, w: 0.42, h: 0.6, fontFace: FB, fontSize: 24, bold: true, color: C.pur, align: 'center', valign: 'middle', margin: 0 })
  })
  s.addText(t('s7.note'), { x: 0.7, y: 5.95, w: 12, h: 0.6, fontFace: FB, fontSize: 16, italic: true, color: C.mut, align: 'left', valign: 'top' })

  // ---------- Slide 9: From Lab to Impact ----------
  s = p.addSlide(); s.background = { color: C.bg2 }
  s.addImage({ path: IMG(JUMP[lang]), x: 0.75, y: 0.62, w: 4.17, h: 6.26, rounding: true }); frame(s, 0.75, 0.62, 4.17, 6.26)
  kicker(s, t('s10.k'), 5.5, 0.6)
  H(s, t('s10.h'), 1.05, 7.2, 32, 5.5)
  ;[
    ['\u26A1', t('s10.t1'), t('s10.d1'), false],
    ['\uD83D\uDE4C', t('s10.t2'), t('s10.d2'), false],
    ['\uD83D\uDCCB', t('s10.t3'), t('s10.d3'), false],
    ['\uD83C\uDF0D', t('s10.t4'), t('s10.d4'), false],
    ['\uD83D\uDE80', t('s10.t5'), t('s10.d5'), true],
  ].forEach((v, i) => {
    const y = 2.15 + i * 0.98
    s.addShape(p.shapes.ROUNDED_RECTANGLE, { x: 5.5, y, w: 0.7, h: 0.7, rectRadius: 0.13, fill: { color: v[3] ? C.pur : C.panel }, line: { color: C.brd, width: 1 } })
    s.addText(v[0], { x: 5.5, y, w: 0.7, h: 0.7, fontSize: 24, align: 'center', valign: 'middle', margin: 0 })
    s.addText(v[1], { x: 6.4, y: y - 0.02, w: 6.4, h: 0.42, fontFace: FH, fontSize: 17, bold: true, color: C.txt, valign: 'top', margin: 0 })
    s.addText(v[2], { x: 6.4, y: y + 0.4, w: 6.5, h: 0.55, fontFace: FB, fontSize: 13.5, color: C.mut, valign: 'top', margin: 0, lineSpacingMultiple: 1.04 })
  })

  // ---------- Slide 10: Closing ----------
  s = p.addSlide(); bgFill(s)
  s.addText([{ text: '\u25CF ', options: { color: C.pink } }, { text: t('s9.badge'), options: { color: 'E9E6FF' } }],
    { x: 0.7, y: 0.9, w: 6, h: 0.4, fontFace: FB, fontSize: 12, bold: true, align: 'left' })
  s.addText(t('s9.h'), { x: 0.66, y: 1.7, w: 8.3, h: 1.9, fontFace: FH, fontSize: 38, bold: true, color: C.txt, align: 'left', lineSpacingMultiple: 1.02, valign: 'top', margin: 0 })
  s.addText(t('s9.lede'), { x: 0.7, y: 3.85, w: 8.1, h: 1.0, fontFace: FB, fontSize: 16, color: 'CFCDE0', align: 'left', lineSpacingMultiple: 1.1, valign: 'top' })
  card(s, 0.7, 5.0, 4.0, 1.15)
  s.addText('Michael Jiang', { x: 1.02, y: 5.17, w: 3.5, h: 0.42, fontFace: FH, fontSize: 17, bold: true, color: C.txt, margin: 0 })
  s.addText('zhijian@microsoft.com', { x: 1.02, y: 5.61, w: 3.5, h: 0.38, fontFace: FB, fontSize: 13.5, color: C.cyan, margin: 0 })
  s.addText('Microsoft MCAPS Core \u2014 Agent Asia Team', { x: 0.7, y: 6.45, w: 8, h: 0.4, fontFace: FB, fontSize: 12.5, color: C.mut, align: 'left' })
  s.addImage({ path: IMG('michael.png'), x: 9.35, y: 1.95, w: 3.1, h: 3.1 })
  s.addText('Michael Jiang', { x: 9.05, y: 5.15, w: 3.7, h: 0.4, fontFace: FH, fontSize: 17, bold: true, color: C.txt, align: 'center', margin: 0 })
  s.addText('Microsoft MCAPS Core \u2014 Agent Asia Team', { x: 9.05, y: 5.58, w: 3.7, h: 0.6, fontFace: FB, fontSize: 12, color: C.mut, align: 'center', margin: 0 })

  const out = path.join(__dirname, 'JumpStart-v2-Workshop-Highlights-' + lang + '.pptx')
  return p.writeFile({ fileName: out }).then(() => console.log('PPTX written:', out))
}

;(async () => {
  for (const lang of ['en', 'zh', 'ja', 'ko', 'th', 'hi']) {
    await build(lang)
  }
  console.log('All language decks generated.')
})()
