export type InvitationContact = { name: string; email: string }

export type InvitationBranding = {
  hostName: string
  hostLogo: string
  customerName: string
  customerLogo: string
  preparedBy: string
  preparedDate: string
  workshopStart: string
  workshopEnd: string
  contacts: InvitationContact[]
}

const escapeHtml = (value: string) => value
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;')

const formatDate = (value: string): string => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
  if (!match) return value.trim()
  const date = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])))
  return new Intl.DateTimeFormat('en', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(date)
}

const formatWorkshopWindow = (start: string, end: string): string => {
  const formattedStart = formatDate(start)
  const formattedEnd = formatDate(end)
  if (formattedStart && formattedEnd) return formattedStart === formattedEnd ? formattedStart : `${formattedStart} - ${formattedEnd}`
  return formattedStart || formattedEnd || 'Date to be confirmed'
}

const blobToDataUrl = (blob: Blob) => new Promise<string>((resolve, reject) => {
  const reader = new FileReader()
  reader.onload = () => resolve(String(reader.result))
  reader.onerror = () => reject(reader.error)
  reader.readAsDataURL(blob)
})

type InlinedLogo = { dataUrl: string; failed: boolean }

const inlineLogo = async (source: string): Promise<InlinedLogo> => {
  const value = source.trim()
  if (!value) return { dataUrl: '', failed: false }
  if (/^data:image\//i.test(value)) return { dataUrl: value, failed: false }
  if (!/^https?:\/\//i.test(value)) return { dataUrl: '', failed: true }
  const controller = new AbortController()
  let timeout = 0
  const deadline = new Promise<string>((resolve) => {
    timeout = window.setTimeout(() => {
      controller.abort()
      resolve('')
    }, 3000)
  })
  const embed = (async () => {
    try {
      const response = await fetch(value, { mode: 'cors', signal: controller.signal })
      if (!response.ok) return ''
      const blob = await response.blob()
      if (!blob.type.toLowerCase().startsWith('image/')) return ''
      return blobToDataUrl(blob)
    } catch {
      return ''
    }
  })()
  try {
    const dataUrl = await Promise.race([embed, deadline])
    return { dataUrl, failed: !dataUrl }
  } finally {
    window.clearTimeout(timeout)
  }
}

const brandMark = (name: string, logo: string) => logo
  ? `<img src="${escapeHtml(logo)}" alt="${escapeHtml(name)}">`
  : `<span class="wordmark">${escapeHtml(name)}</span>`

const invitationFilename = (customerName: string) => {
  const slug = customerName.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  return `${slug || 'customer'}-ai-agent-jumpstart-workshop-invitation.html`
}

const svgIcon = (body: string) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" focusable="false" aria-hidden="true">${body}</svg>`

const icons = {
  cost: svgIcon('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18M7 15h2"/>'),
  audience: svgIcon('<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>'),
  logistics: svgIcon('<rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2M9 12h6M9 16h6"/>'),
  eligibility: svgIcon('<path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"/><path d="m9 12 2 2 4-4"/>'),
  agent: svgIcon('<rect x="4" y="6" width="16" height="13" rx="3"/><path d="M12 2v4M8 11h.01M16 11h.01M8 15h8"/>'),
  database: svgIcon('<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6"/>'),
  document: svgIcon('<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6M8 13h8M8 17h6"/>'),
  network: svgIcon('<rect x="9" y="2" width="6" height="5" rx="1"/><rect x="2" y="17" width="6" height="5" rx="1"/><rect x="16" y="17" width="6" height="5" rx="1"/><path d="M12 7v5M5 17v-3h14v3"/>'),
  mail: svgIcon('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>'),
  mic: svgIcon('<rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10a7 7 0 0 0 14 0M12 17v5M8 22h8"/>'),
  microsoft: svgIcon('<path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z"/>'),
  customer: svgIcon('<path d="M3 21h18M5 21V7l7-4 7 4v14M9 9h.01M15 9h.01M9 13h.01M15 13h.01M10 21v-4h4v4"/>'),
  calendar: svgIcon('<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 11h18M8 15h.01M12 15h.01M16 15h.01"/>'),
  check: svgIcon('<path d="M20 6 9 17l-5-5"/>'),
}

export async function buildWorkshopInvitation(branding: InvitationBranding): Promise<{ html: string; filename: string; logoFallbacks: string[] }> {
  const hostName = branding.hostName.trim() || 'Microsoft'
  const customerName = branding.customerName.trim()
  if (!customerName) throw new Error('A customer name is required to create an invitation.')
  const [hostLogo, customerLogo] = await Promise.all([inlineLogo(branding.hostLogo), inlineLogo(branding.customerLogo)])
  const logoFallbacks = [hostLogo.failed ? hostName : '', customerLogo.failed ? customerName : ''].filter(Boolean)
  const workshopWindow = formatWorkshopWindow(branding.workshopStart, branding.workshopEnd)
  const preparedBy = branding.preparedBy.trim() || hostName
  const preparedDate = branding.preparedDate.trim()
  const contacts = branding.contacts.filter(({ name, email }) => name.trim() || email.trim())
  const contactMarkup = contacts.length
    ? contacts.map(({ name, email }) => {
        const cleanName = name.trim() || email.trim()
        const cleanEmail = email.trim().replace(/[\r\n]/g, '')
        const validEmail = /^[^\s@?&#]+@[^\s@?&#]+\.[^\s@?&#]+$/.test(cleanEmail)
        return `<li><strong>${escapeHtml(cleanName)}</strong>${validEmail ? `<a href="mailto:${encodeURIComponent(cleanEmail)}">${escapeHtml(cleanEmail)}</a>` : ''}</li>`
      }).join('')
    : '<li><strong>Your Microsoft account team</strong><span>Contact details will be shared separately.</span></li>'

  const html = `<!doctype html>
<html lang="en" dir="ltr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>AI Agent JumpStart Workshop for ${escapeHtml(customerName)}</title>
<meta name="description" content="Customer workshop invitation and program overview for ${escapeHtml(customerName)}.">
<script>
  (() => {
    const param = new URLSearchParams(window.location.search).get("scoutTheme");
    const theme =
      param || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    document.documentElement.setAttribute("data-theme", theme);
  })();
</script>
<script>
  (() => {
    if (new URLSearchParams(window.location.search).get("scoutTheme")) return;
    try {
      const stored = window.localStorage.getItem("jumpstart-invitation-theme");
      if (stored === "light" || stored === "dark") document.documentElement.setAttribute("data-theme", stored);
    } catch {}
  })();
</script>
<style>
:root {
  color-scheme: light;
  --cp-bg: #f7f4ef;
  --cp-bg-elevated: #fcfbf8;
  --cp-surface: #ffffff;
  --cp-surface-soft: #f5f5f5;
  --cp-border: #dedede;
  --cp-border-strong: #919191;
  --cp-text: #242424;
  --cp-text-muted: #5c5c5c;
  --cp-text-soft: #6f6f6f;
  --cp-accent: #b11f4b;
  --cp-accent-hover: #9a1a41;
  --cp-accent-soft: rgba(177, 31, 75, 0.08);
  --cp-accent-fg: #ffffff;
  --cp-success: #16a34a;
  --cp-danger: #dc2626;
  --cp-warning: #f59e0b;
  --cp-link: #0078d4;
  --cp-shadow: 0 18px 48px rgba(0, 0, 0, 0.12);
  --cp-overlay: rgba(255, 255, 255, 0.8);
  --cp-panel: rgba(255, 255, 255, 0.86);
  --cp-panel-strong: rgba(255, 255, 255, 0.96);
  --cp-sheen: rgba(255, 255, 255, 0.55);
  --cp-highlight: rgba(177, 31, 75, 0.12);
}
html[data-theme="dark"] {
  color-scheme: dark;
  --cp-bg: #3d3b3a;
  --cp-bg-elevated: #343231;
  --cp-surface: #292929;
  --cp-surface-soft: #2e2e2e;
  --cp-border: #474747;
  --cp-border-strong: #5f5f5f;
  --cp-text: #dedede;
  --cp-text-muted: #919191;
  --cp-text-soft: #b0b0b0;
  --cp-accent: #fd8ea1;
  --cp-accent-hover: #fb7b91;
  --cp-accent-soft: rgba(253, 142, 161, 0.14);
  --cp-accent-fg: #1a1a1a;
  --cp-success: #4ade80;
  --cp-danger: #f87171;
  --cp-warning: #fbbf24;
  --cp-link: #4da6ff;
  --cp-shadow: 0 18px 48px rgba(0, 0, 0, 0.32);
  --cp-overlay: rgba(41, 41, 41, 0.88);
  --cp-panel: rgba(41, 41, 41, 0.72);
  --cp-panel-strong: rgba(41, 41, 41, 0.96);
  --cp-sheen: rgba(255, 255, 255, 0.04);
  --cp-highlight: rgba(253, 142, 161, 0.12);
}
:root{--cp-invite-blue-deep:#0a2a5e;--cp-invite-blue-mid:#1746c9;--cp-invite-blue-bright:#12a5e6;--cp-invite-on-blue:#ffffff;--cp-invite-overlay:rgba(7,12,23,.28);--cp-invite-sheen:rgba(255,255,255,.18);--cp-invite-clear:rgba(255,255,255,0);--cp-invite-fact-bg:rgba(255,255,255,.14);--cp-invite-fact-border:rgba(255,255,255,.28);--cp-invite-gradient:linear-gradient(135deg,var(--cp-invite-blue-deep) 0%,var(--cp-invite-blue-mid) 52%,var(--cp-invite-blue-bright) 100%);--cp-invite-shadow:0 1px 2px color-mix(in srgb,var(--cp-text) 6%,var(--cp-surface)),0 14px 34px -16px color-mix(in srgb,var(--cp-text) 28%,var(--cp-surface));--cp-invite-radius:18px;--cp-invite-maxw:66rem}
*{box-sizing:border-box}
html,body{margin:0;min-width:320px;padding:0}
body{color:var(--cp-text);background:var(--cp-bg);font-family:"Segoe UI",Aptos,Calibri,-apple-system,BlinkMacSystemFont,sans-serif;line-height:1.6;letter-spacing:0;-webkit-font-smoothing:antialiased}
a{color:var(--cp-link)}
.wrap{max-width:var(--cp-invite-maxw);margin-inline:auto;padding-inline:1.25rem}
.brandbar{background:var(--cp-surface);border-bottom:1px solid var(--cp-border)}.brandbar-inner{min-height:60px;display:flex;align-items:center;gap:1rem;padding-block:.8rem}.brandmark{min-width:0;display:flex;align-items:center;min-height:34px}.brandmark.customer{margin-left:auto;justify-content:flex-end;text-align:right}.brandmark img{display:block;max-width:min(230px,36vw);height:32px;object-fit:contain}.wordmark{color:var(--cp-text);font-size:1.18rem;font-weight:700;line-height:1.05;overflow-wrap:anywhere}.theme-toggle{width:38px;height:38px;flex:0 0 auto;display:grid;place-items:center;color:var(--cp-text-muted);background:var(--cp-surface-soft);border:1px solid var(--cp-border);border-radius:10px;cursor:pointer}.theme-toggle:hover{color:var(--cp-link);border-color:var(--cp-link)}.theme-toggle:focus-visible{outline:3px solid var(--cp-highlight);outline-offset:2px}.theme-toggle svg{width:19px;height:19px}.theme-toggle .moon{display:none}html[data-theme="dark"] .theme-toggle .sun{display:none}html[data-theme="dark"] .theme-toggle .moon{display:block}
.hero{position:relative;overflow:hidden;color:var(--cp-invite-on-blue);background:var(--cp-invite-gradient);border-end-start-radius:30px;border-end-end-radius:30px}.hero::before,.hero::after{content:"";position:absolute;inset:0;pointer-events:none}.hero::before{background:var(--cp-invite-overlay)}.hero::after{background:radial-gradient(120% 90% at 88% -20%,var(--cp-invite-sheen),var(--cp-invite-clear) 58%)}.hero-inner{position:relative;z-index:1;padding-block:2.6rem 2.3rem}.eyebrow{margin:0 0 .6rem;color:inherit;font-size:.76rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;opacity:.84}.hero h1{margin:0 0 .5rem;font-size:2.55rem;line-height:1.12;letter-spacing:0}.hero-sub{max-width:44rem;margin:0;color:inherit;font-size:1.1rem;opacity:.94}.facts{display:flex;flex-wrap:wrap;gap:.5rem;margin-top:1.4rem}.fact{max-width:100%;padding:.45rem .85rem;color:var(--cp-invite-on-blue);background:var(--cp-invite-fact-bg);border:1px solid var(--cp-invite-fact-border);border-radius:999px;font-size:.82rem;font-weight:650}
.eyebrow,.hero h1,.hero-sub,.fact,.lead,.card li,.lab h3,.lab p,.tag,.contacts strong,footer{max-width:100%;overflow-wrap:anywhere}
main{padding-bottom:2rem}.lead{margin-top:1.9rem;padding:1.15rem 1.3rem;background:var(--cp-surface);border:1px solid var(--cp-border);border-left:5px solid var(--cp-link);border-radius:14px;box-shadow:var(--cp-invite-shadow);font-size:1.06rem}.lead strong{color:var(--cp-link)}
.section{margin-top:2rem}.sec-title{display:flex;align-items:center;gap:.65rem;margin:0 0 1rem;font-size:1.3rem;letter-spacing:0}.sec-title::before{content:"";width:11px;height:24px;flex:0 0 auto;background:var(--cp-invite-gradient);border-radius:5px}.section-intro{margin:-.45rem 0 1rem;color:var(--cp-text-muted);font-size:.94rem}
.grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1.1rem}.card{padding:1.3rem 1.3rem 1.15rem;background:var(--cp-surface);border:1px solid var(--cp-border);border-radius:var(--cp-invite-radius);box-shadow:var(--cp-invite-shadow)}.chip{width:48px;height:48px;display:flex;align-items:center;justify-content:center;margin-bottom:.85rem;color:var(--cp-link);background:color-mix(in srgb,var(--cp-link) 10%,var(--cp-surface));border-radius:14px}.chip svg{width:25px;height:25px}.card h3{margin:.1rem 0 .6rem;font-size:1.14rem;letter-spacing:0}.card ul{margin:0;padding:0;list-style:none}.card li{position:relative;margin:.42rem 0;padding-left:1.35rem;color:var(--cp-text);font-size:.94rem}.card li::before{content:"";position:absolute;left:.2rem;top:.62em;width:6px;height:6px;background:var(--cp-link);border-radius:50%}
.labs{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:1rem}.lab{padding:1.15rem;background:var(--cp-surface);border:1px solid var(--cp-border);border-radius:var(--cp-invite-radius);box-shadow:var(--cp-invite-shadow)}.lab .chip{width:42px;height:42px;border-radius:12px}.lab .chip svg{width:22px;height:22px}.lab h3{margin:0;font-size:1rem}.lab p{margin:.45rem 0 0;color:var(--cp-text-muted);font-size:.86rem}
.included{display:grid;grid-template-columns:1fr 1fr;gap:1.1rem}.panel{padding:1.25rem 1.3rem;background:var(--cp-surface-soft);border:1px solid var(--cp-border);border-radius:var(--cp-invite-radius)}.panel-head{display:flex;align-items:center;gap:.75rem;margin-bottom:.8rem}.panel-head .chip{width:38px;height:38px;margin:0;border-radius:10px}.panel-head .chip svg{width:20px;height:20px}.panel h3{margin:0}.tag{display:inline-block;padding:.2rem .5rem;color:var(--cp-link);background:color-mix(in srgb,var(--cp-link) 10%,var(--cp-surface));border-radius:6px;font-size:.68rem;font-weight:700;letter-spacing:.06em;text-transform:uppercase}.checks{margin:0;padding:0;list-style:none}.checks li{display:flex;align-items:flex-start;gap:.6rem;margin:.55rem 0;font-size:.94rem}.checks svg{width:20px;height:20px;flex:0 0 auto;margin-top:.12rem;color:var(--cp-link)}
.cta{margin-top:2rem;padding:1.7rem 1.5rem;color:var(--cp-invite-on-blue);background:linear-gradient(var(--cp-invite-overlay),var(--cp-invite-overlay)),var(--cp-invite-gradient);border-radius:22px;box-shadow:var(--cp-invite-shadow);text-align:center}.cta-icon{width:46px;height:46px;display:grid;place-items:center;margin:0 auto .75rem;color:var(--cp-link);background:var(--cp-surface);border-radius:14px}.cta-icon svg{width:25px;height:25px}.cta h3{margin:0 0 .5rem;font-size:1.35rem}.cta>p{max-width:42rem;margin:0 auto;color:inherit;font-size:1.02rem;opacity:.94}.contacts{display:flex;flex-wrap:wrap;justify-content:center;gap:.65rem;margin:1.2rem 0 0;padding:0;list-style:none}.contacts li{min-width:220px;display:flex;flex-direction:column;gap:2px;padding:.7rem .9rem;color:var(--cp-text);background:var(--cp-surface);border-radius:10px;text-align:left}.contacts a{font-size:.82rem;overflow-wrap:anywhere}.contacts span{color:var(--cp-text-muted);font-size:.82rem}
footer{padding-block:1.5rem .6rem;color:var(--cp-text-muted);font-size:.8rem;text-align:center}
@media(max-width:640px){.grid,.included{grid-template-columns:1fr}.labs{grid-template-columns:1fr 1fr}.hero h1{font-size:2rem}.hero-inner{padding-block:2.1rem 1.9rem}.brandbar-inner{gap:.65rem}.brandmark img{height:28px}.wordmark{font-size:1rem}.theme-toggle{width:36px;height:36px}}
@media(max-width:430px){.labs{grid-template-columns:1fr}.brandmark img{max-width:39vw}.fact{font-size:.76rem}.contacts li{min-width:100%}}
@media print{:root,html[data-theme="dark"]{--cp-bg:#f7f4ef;--cp-bg-elevated:#fcfbf8;--cp-surface:#ffffff;--cp-surface-soft:#f5f5f5;--cp-border:#dedede;--cp-border-strong:#919191;--cp-text:#242424;--cp-text-muted:#5c5c5c;--cp-text-soft:#6f6f6f;--cp-accent:#b11f4b;--cp-accent-hover:#9a1a41;--cp-accent-soft:rgba(177,31,75,.08);--cp-accent-fg:#ffffff;--cp-success:#16a34a;--cp-danger:#dc2626;--cp-warning:#f59e0b;--cp-link:#0078d4;--cp-shadow:0 18px 48px rgba(0,0,0,.12);--cp-overlay:rgba(255,255,255,.8);--cp-panel:rgba(255,255,255,.86);--cp-panel-strong:rgba(255,255,255,.96);--cp-sheen:rgba(255,255,255,.55);--cp-highlight:rgba(177,31,75,.12)}*{-webkit-print-color-adjust:exact;print-color-adjust:exact}.theme-toggle{display:none}.hero,.cta{color:var(--cp-bg-elevated);background:var(--cp-invite-gradient)}.card,.lab,.panel,.cta{break-inside:avoid}.sec-title{break-after:avoid}}
</style>
</head>
<body>
<div class="brandbar"><div class="wrap brandbar-inner"><div class="brandmark">${brandMark(hostName, hostLogo.dataUrl)}</div><div class="brandmark customer">${brandMark(customerName, customerLogo.dataUrl)}</div><button class="theme-toggle" type="button" aria-label="Switch to dark theme" aria-pressed="false" title="Switch to dark theme"><svg class="sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.66 6.34l1.41-1.41"/></svg><svg class="moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.985 12.486A9 9 0 1 1 11.514 3.015 7 7 0 0 0 20.985 12.486Z"/></svg></button></div></div>
<header class="hero"><div class="wrap hero-inner"><p class="eyebrow">${escapeHtml(hostName)} AI Business Solutions · Prepared for ${escapeHtml(customerName)}</p><h1>AI Agent JumpStart Workshop</h1><p class="hero-sub">A hands-on, interactive workshop to explore, design, and build AI agents with GitHub Copilot and Microsoft Copilot Studio.</p><div class="facts"><span class="fact">No cost - first session</span><span class="fact">${escapeHtml(workshopWindow)}</span><span class="fact">Half day · 4-5 hours</span><span class="fact">20-30 participants</span><span class="fact">6 guided labs</span><span class="fact">9 languages</span><span class="fact">In-person preferred</span><span class="fact">3+ ${escapeHtml(hostName)} coaches</span></div></div></header>
<main class="wrap">
<p class="lead">The AI Agent JumpStart Workshop for <strong>${escapeHtml(customerName)}</strong> is a hands-on, interactive experience - <strong>not classroom training</strong> - that guides your team through current GitHub Copilot and Copilot Studio Agent capabilities across six multilingual labs. Participants finish with prioritized <strong>Hero Use Cases</strong>: the highest-value scenarios to take forward.</p>
<section class="section"><h2 class="sec-title">Program at a glance</h2><div class="grid">
<article class="card"><div class="chip">${icons.cost}</div><h3>Cost &amp; investment</h3><ul><li>The first workshop, hosted by ${escapeHtml(hostName)}, is delivered at <strong>no cost</strong> - an interactive workshop, not paid training.</li><li>${escapeHtml(hostName)} account and specialist teams participate as coaches and help identify follow-up opportunities.</li><li>Future customer-run sessions use your own Copilot credits and applicable licenses.</li></ul></article>
<article class="card"><div class="chip">${icons.audience}</div><h3>Class size &amp; setup</h3><ul><li>Ideal for <strong>up to 20</strong> participants; <strong>30 maximum</strong>.</li><li>A classroom-style room with power available at every seat.</li><li>Each participant brings a personal or corporate laptop.</li><li>Workshop access uses ${escapeHtml(hostName)}-provided training credentials.</li></ul></article>
<article class="card"><div class="chip">${icons.logistics}</div><h3>Logistics &amp; format</h3><ul><li><strong>In-person is recommended;</strong> facilitation can be on site or remote.</li><li>Half-day session - approximately <strong>4 to 5 hours</strong>.</li><li>At least <strong>three ${escapeHtml(hostName)} coaches</strong> guide participants.</li><li>Share attendee emails and branding before the session.</li></ul></article>
<article class="card"><div class="chip">${icons.eligibility}</div><h3>Commitments &amp; eligibility</h3><ul><li><strong>No hard pipeline threshold</strong> or commitment is required.</li><li>Scheduling is subject to the availability of a suitable date.</li><li>The first session can lead to a customer-run internal cadence.</li></ul></article>
</div></section>
<section class="section"><h2 class="sec-title">Six guided labs</h2><p class="section-intro">From the first grounded Agent to multi-agent orchestration and real-time voice.</p><div class="labs"><article class="lab"><div class="chip">${icons.agent}</div><h3>Meet the Agent Maker</h3><p>Build a grounded, multilingual Agent with trusted Microsoft knowledge.</p></article><article class="lab"><div class="chip">${icons.database}</div><h3>Bring in business context</h3><p>Use Dataverse MCP, Skills, Memory, and customer research.</p></article><article class="lab"><div class="chip">${icons.document}</div><h3>Evidence-based RFP</h3><p>Create sourced Excel and Word deliverables with review controls.</p></article><article class="lab"><div class="chip">${icons.network}</div><h3>Connect specialist Agents</h3><p>Delegate IT requests through ServiceNow and Connected Agents.</p></article><article class="lab"><div class="chip">${icons.mail}</div><h3>Multi-agent email Workflow</h3><p>Classify inbound email, route it, and draft personalized replies.</p></article><article class="lab"><div class="chip">${icons.mic}</div><h3>Real-time voice Agent</h3><p>Configure and test a natural multilingual voice experience.</p></article></div></section>
<section class="section"><h2 class="sec-title">What's included</h2><div class="included"><article class="panel"><div class="panel-head"><div class="chip">${icons.microsoft}</div><h3><span class="tag">${escapeHtml(hostName)} provides</span></h3></div><ul class="checks"><li>${icons.check}<span>Expert facilitation and at least three workshop coaches.</span></li><li>${icons.check}<span>The hands-on lab environment and participant credentials.</span></li><li>${icons.check}<span>A customized, co-branded workshop welcome experience.</span></li><li>${icons.check}<span>Guidance to capture and prioritize Hero Use Cases.</span></li></ul></article><article class="panel"><div class="panel-head"><div class="chip">${icons.customer}</div><h3><span class="tag">${escapeHtml(customerName)} provides</span></h3></div><ul class="checks"><li>${icons.check}<span>A classroom-style venue with power at every seat.</span></li><li>${icons.check}<span>Participant laptops able to reach the lab environment.</span></li><li>${icons.check}<span>The attendee email list shared before the session.</span></li><li>${icons.check}<span>Branding assets and customer contact people.</span></li></ul></article></div></section>
<section class="cta"><div class="cta-icon">${icons.calendar}</div><h3>Ready to run a session?</h3><p>Confirm the date, venue, and participant list with your workshop contacts. Access instructions and individual training credentials will be shared separately.</p><ul class="contacts">${contactMarkup}</ul></section>
</main>
<footer class="wrap">AI Agent JumpStart Workshop · Prepared by ${escapeHtml(preparedBy)}${preparedDate ? ` · ${escapeHtml(preparedDate)}` : ''} · For ${escapeHtml(customerName)}</footer>
<script>
  (() => {
    const button = document.querySelector(".theme-toggle");
    if (!button) return;
    const update = () => {
      const dark = document.documentElement.getAttribute("data-theme") === "dark";
      const label = dark ? "Switch to light theme" : "Switch to dark theme";
      button.setAttribute("aria-label", label);
      button.setAttribute("aria-pressed", String(dark));
      button.setAttribute("title", label);
    };
    button.addEventListener("click", () => {
      const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      try { window.localStorage.setItem("jumpstart-invitation-theme", next); } catch {}
      update();
    });
    update();
  })();
</script>
</body>
</html>`

  return { html, filename: invitationFilename(customerName), logoFallbacks }
}

export async function downloadWorkshopInvitation(branding: InvitationBranding): Promise<{ filename: string; logoFallbacks: string[] }> {
  const { html, filename, logoFallbacks } = await buildWorkshopInvitation(branding)
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 0)
  return { filename, logoFallbacks }
}