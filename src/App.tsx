import { Fragment, useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import {
  ArrowRight, BookOpenCheck, CalendarDays, Check, ChevronDown, ChevronUp,
  Clipboard, Database, FileSpreadsheet, Languages, Lock, Mail, MailCheck, Menu, Mic2,
  ExternalLink, Moon, Network, PanelLeft, PanelLeftClose, PencilLine, Save, Search, Settings, Sparkles, Sun, Trash2, Users, X,
} from 'lucide-react'
import { defaultContent, loadLabs } from './content/store'
import MakerEditor from './editor/MakerEditor'
import Fireworks from './Fireworks'
import { localeNames, text, ui } from './content/ui'
import type { Lab, LabStep, Locale, LocalizedText } from './content/types'

const locales = Object.keys(localeNames) as Locale[]
const iconMap = { sparkles: Sparkles, database: Database, file: FileSpreadsheet, network: Network, mail: MailCheck, mic: Mic2 }

// Renders Markdown inline (no block <p> wrapper) so it can live inside headings like <h2>/<h3>.
// Headings are also flattened to inline so a stray "## " in a title never nests an <h2> inside an <h3>.
const inlinePassThrough = ({ children }: { children?: ReactNode }) => <Fragment>{children}</Fragment>
const inlineMarkdownComponents = { p: inlinePassThrough, h1: inlinePassThrough, h2: inlinePassThrough, h3: inlinePassThrough, h4: inlinePassThrough, h5: inlinePassThrough, h6: inlinePassThrough }
function InlineMarkdown({ children }: { children: string }) {
  return <ReactMarkdown remarkPlugins={[remarkGfm]} components={inlineMarkdownComponents}>{children}</ReactMarkdown>
}

// Strips Markdown syntax to plain text for navigation labels, selects, and the table of contents.
function stripMarkdown(value: string): string {
  return value
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/`([^`]*)`/g, '$1')
    .replace(/(\*\*|__)(.*?)\1/g, '$2')
    .replace(/(\*|_)(.*?)\1/g, '$2')
    .replace(/~~(.*?)~~/g, '$1')
    .replace(/^\s{0,3}#{1,6}\s+/gm, '')
    .replace(/^\s{0,3}>\s?/gm, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function PromptBlock({ title, content, locale }: { title?: string; content: string; locale: Locale }) {
  const [expanded, setExpanded] = useState(false)
  const [copied, setCopied] = useState(false)
  const copyPrompt = async () => {
    await navigator.clipboard.writeText(content)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }
  return (
    <section className="prompt-panel" aria-label={title || text(ui.input, locale)}>
      <div className="prompt-toolbar">
        <div><span className="eyebrow">{text(ui.input, locale)}</span><strong>{title || text(ui.promptDefaultTitle, locale)}</strong></div>
        <div className="toolbar-actions">
          <button className="icon-text-button" type="button" onClick={() => setExpanded(!expanded)}>
            {expanded ? <ChevronUp size={17} /> : <ChevronDown size={17} />}{text(expanded ? ui.collapse : ui.expand, locale)}
          </button>
          <button className="copy-button" type="button" onClick={copyPrompt}>
            {copied ? <Check size={17} /> : <Clipboard size={17} />}{text(copied ? ui.copied : ui.copy, locale)}
          </button>
        </div>
      </div>
      <pre className={expanded ? 'prompt expanded' : 'prompt'}><code>{content}</code></pre>
    </section>
  )
}

function Screenshot({ lab, imageKey, locale }: { lab: Lab; imageKey: string; locale: Locale }) {
  const localeSource = `${import.meta.env.BASE_URL}labs/${lab.id}/images/${locale}/${imageKey}.png`
  const enSource = `${import.meta.env.BASE_URL}labs/${lab.id}/images/en/${imageKey}.png`
  const [source, setSource] = useState(localeSource)
  const [missing, setMissing] = useState(false)
  // Reset to the locale image whenever the language or image changes.
  useEffect(() => { setSource(localeSource); setMissing(false) }, [localeSource])
  // If the locale image is missing, fall back to the English image before showing the placeholder.
  const handleError = () => {
    if (source !== enSource) setSource(enSource)
    else setMissing(true)
  }
  return (
    <figure className="screenshot-frame">
      {!missing && <img src={source} alt={`${text(lab.title, locale)} — ${imageKey}`} onError={handleError} />}
      {missing && <div className="screenshot-placeholder">
        <div className="placeholder-mark"><Sparkles size={28} /></div>
        <strong>{text(ui.screenshot, locale)}</strong><span>{text(ui.screenshotHint, locale)}</span><code>{enSource}</code>
      </div>}
      <figcaption>{source}</figcaption>
    </figure>
  )
}

function DocumentStep({
  lab,
  step,
  stepNumber,
  locale,
  completed,
  onToggleComplete,
}: {
  lab: Lab
  step: LabStep
  stepNumber: number
  locale: Locale
  completed: boolean
  onToggleComplete: () => void
}) {
  const pages = step.pages ?? [{
    id: 'main',
    paragraphs: step.body ? [step.body] : [],
    highlight: step.highlight,
    prompts: step.prompt ? [{ id: 'main-prompt', content: step.prompt }] : [],
    imageKeys: step.imageKey ? [step.imageKey] : [],
  }]

  return (
    <section className="document-step" id={`${lab.id}-${step.id}`}>
      <header className="document-step-heading">
        <span>{text(ui.step, locale)} {stepNumber}</span>
        <h2><InlineMarkdown>{text(step.title, locale)}</InlineMarkdown></h2>
      </header>
      {pages.map((page, pageIndex) => (
        <article className="document-page step-page" key={page.id}>
          <div className="page-number">{text(ui.page, locale)} {pageIndex + 1} / {pages.length}</div>
          {page.title && <h3><InlineMarkdown>{text(page.title, locale)}</InlineMarkdown></h3>}
          <div className="page-copy">
            {page.paragraphs.map((paragraph, paragraphIndex) => <div className="markdown-content" key={paragraphIndex}><ReactMarkdown remarkPlugins={[remarkGfm]}>{text(paragraph, locale)}</ReactMarkdown></div>)}
            {page.markdown && <div className="markdown-content"><ReactMarkdown remarkPlugins={[remarkGfm]}>{text(page.markdown, locale)}</ReactMarkdown></div>}
          </div>
          {page.highlight && text(page.highlight, locale).trim() && <aside className="highlight"><Sparkles size={20} /><div className="highlight-content"><strong className="highlight-label">{text(ui.highlight, locale)}</strong><ReactMarkdown remarkPlugins={[remarkGfm]}>{text(page.highlight, locale)}</ReactMarkdown></div></aside>}
          {page.prompts?.map((promptItem) => <PromptBlock key={promptItem.id} title={text(promptItem.title, locale)} content={promptItem.content} locale={locale} />)}
          {!!page.imageKeys?.filter(Boolean).length && <div className="embedded-figures">{page.imageKeys.filter(Boolean).map((imageKey) => <Screenshot lab={lab} imageKey={imageKey} locale={locale} key={imageKey} />)}</div>}
        </article>
      ))}
      <button className={completed ? 'step-complete-action checked' : 'step-complete-action'} type="button" onClick={onToggleComplete}>
        <span>{completed && <Check size={16} />}</span>{text(completed ? ui.completed : ui.complete, locale)}
      </button>
    </section>
  )
}

type Branding = { hostName: string; hostLogo: string; customerName: string; customerLogo: string }
const defaultBranding: Branding = { hostName: 'Microsoft', hostLogo: '', customerName: '', customerLogo: '' }

// Published branding ships with the site (public/content/branding.json) so every visitor
// of the hosted app sees the same cover. Falls back to the built-in default when absent.
async function loadPublishedBranding(): Promise<Branding | null> {
  try {
    const res = await fetch(`${import.meta.env.BASE_URL}content/branding.json`, { cache: 'no-store' })
    if (res.ok) return { ...defaultBranding, ...(await res.json()) }
  } catch { /* no published branding yet */ }
  return null
}
// Dev-only: writes the applied branding to the published file so it can be committed + pushed.
async function saveBrandingToFile(b: Branding): Promise<'published' | 'offline'> {
  try {
    const res = await fetch('/api/branding', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(b, null, 2) })
    return res.ok ? 'published' : 'offline'
  } catch { return 'offline' }
}

async function verifyMakerPassword(password: string): Promise<boolean> {
  try {
    const response = await fetch('/api/maker-auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })
    return response.ok
  } catch {
    return false
  }
}

const cover: Record<string, LocalizedText> = {
  tagline: {
    en: 'A hands-on learning path exploring the full breadth of custom agent innovation in Microsoft Copilot Studio.',
    zh: '一条动手实践的学习路径，全面探索 Microsoft Copilot Studio 中自定义 Agent 创新的方方面面。',
    ja: 'Microsoft Copilot Studio におけるカスタム Agent イノベーションの全体像を探る、ハンズオンの学習パスです。',
    ko: 'Microsoft Copilot Studio의 사용자 지정 Agent 혁신의 모든 영역을 탐구하는 실습 학습 경로입니다.',
    th: 'เส้นทางการเรียนรู้แบบลงมือทำ ที่สำรวจนวัตกรรม custom agent ใน Microsoft Copilot Studio อย่างครบถ้วน',
    hi: 'Microsoft Copilot Studio में कस्टम एजेंट नवाचार की पूरी व्यापकता का अन्वेषण करने वाला एक हैंड्स-ऑन लर्निंग पाथ।',
  },
  preparedBy: { en: 'Prepared by', zh: '准备者', ja: '作成者', ko: '작성자', th: 'จัดทำโดย', hi: 'द्वारा तैयार' },
  preparedIn: { en: 'Prepared in', zh: '编写时间', ja: '作成日', ko: '작성일', th: 'จัดทำเมื่อ', hi: 'तैयार किया गया' },
  date: { en: 'July 16, 2026', zh: '2026年7月16日', ja: '2026年7月16日', ko: '2026년 7월 16일', th: '16 กรกฎาคม 2026', hi: '16 जुलाई 2026' },
  contact: { en: 'Need help? Contact', zh: '需要帮助？请联系', ja: 'お困りですか？ お問い合わせ', ko: '도움이 필요하신가요? 문의', th: 'ต้องการความช่วยเหลือ? ติดต่อ', hi: 'मदद चाहिए? संपर्क करें' },
  cta: { en: 'Enter workshop', zh: '进入研讨会', ja: 'ワークショップを開く', ko: '워크숍 시작', th: 'เข้าสู่เวิร์กช็อป', hi: 'वर्कशॉप में प्रवेश करें' },
  deck: { en: 'Explore the workshop highlights', zh: '查看研讨会亮点', ja: 'ワークショップのハイライトを見る', ko: '워크숍 하이라이트 살펴보기', th: 'สำรวจไฮไลต์ของเวิร์กช็อป', hi: 'वर्कशॉप की मुख्य बातें देखें' },
}
const dedicatedText = (locale: Locale, name: string): string => {
  const n = name.trim()
  if (n) return ({ en: `A dedicated JumpStart workshop for ${n}.`, zh: `专为 ${n} 定制的 JumpStart 研讨会。`, ja: `${n} 向けの専用 JumpStart ワークショップ。`, ko: `${n}를 위한 전용 JumpStart 워크숍.`, th: `เวิร์กช็อป JumpStart เฉพาะสำหรับ ${n}`, hi: `${n} के लिए एक समर्पित JumpStart वर्कशॉप।` } as Record<Locale, string>)[locale]
  return ({ en: 'A dedicated JumpStart workshop.', zh: '定制的 JumpStart 研讨会。', ja: '専用の JumpStart ワークショップ。', ko: '전용 JumpStart 워크숍.', th: 'เวิร์กช็อป JumpStart เฉพาะทาง', hi: 'एक समर्पित JumpStart वर्कशॉप।' } as Record<Locale, string>)[locale]
}

function BrandLogo({ name, logo }: { name: string; logo: string }) {
  if (logo) return <img className="cover-brand-logo" src={logo} alt={name || 'logo'} />
  return <span className="cover-brand-name">{name || 'Microsoft'}</span>
}

type Workshop = { id: string; name: string; hostName: string; hostLogo: string; customerName: string; customerLogo: string; savedAt: number }
const loadWorkshops = (): Workshop[] => {
  try { const v = JSON.parse(localStorage.getItem('jumpstart-workshops') || '[]'); return Array.isArray(v) ? v : [] }
  catch { return [] }
}
const newWorkshopId = () => (typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : String(Date.now()) + Math.random().toString(36).slice(2, 8))

function BrandingSettings({ value, locale, onApply, onClose }: { value: Branding; locale: Locale; onApply: (b: Branding) => Promise<'published' | 'offline'>; onClose: () => void }) {
  const [draft, setDraft] = useState<Branding>(value)
  const [history, setHistory] = useState<Workshop[]>(() => loadWorkshops())
  const [query, setQuery] = useState('')
  const [flash, setFlash] = useState('')
  const readFile = (file: File | undefined, key: 'hostLogo' | 'customerLogo') => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setDraft((d) => ({ ...d, [key]: String(reader.result) }))
    reader.readAsDataURL(file)
  }
  const persist = (next: Workshop[]) => { setHistory(next); localStorage.setItem('jumpstart-workshops', JSON.stringify(next)) }
  const saveToHistory = () => {
    const name = draft.customerName.trim() || draft.hostName.trim() || 'Untitled workshop'
    const existing = history.find((w) => w.name.toLowerCase() === name.toLowerCase())
    const entry: Workshop = { id: existing?.id || newWorkshopId(), name, hostName: draft.hostName, hostLogo: draft.hostLogo, customerName: draft.customerName, customerLogo: draft.customerLogo, savedAt: Date.now() }
    persist(existing ? history.map((w) => (w.id === existing.id ? entry : w)) : [entry, ...history])
    setFlash(text(existing ? ui.updatedWorkshop : ui.savedWorkshop, locale).replace('{name}', name))
    window.setTimeout(() => setFlash(''), 2200)
  }
  const loadWorkshop = (w: Workshop) => { setDraft({ hostName: w.hostName, hostLogo: w.hostLogo, customerName: w.customerName, customerLogo: w.customerLogo }); setFlash(text(ui.loadedWorkshop, locale).replace('{name}', w.name)); window.setTimeout(() => setFlash(''), 2600) }
  const removeWorkshop = (id: string) => persist(history.filter((w) => w.id !== id))
  const q = query.trim().toLowerCase()
  const filtered = [...history].sort((a, b) => b.savedAt - a.savedAt).filter((w) => !q || w.name.toLowerCase().includes(q) || w.customerName.toLowerCase().includes(q) || w.hostName.toLowerCase().includes(q))
  return (
    <div className="settings-scrim" role="dialog" aria-label={text(ui.workshopBranding, locale)}>
      <div className="settings-card">
        <div className="settings-head"><strong>{text(ui.workshopBranding, locale)}</strong><button className="icon-button" type="button" onClick={onClose} aria-label={text(ui.closeDialog, locale)}><X size={18} /></button></div>
        <p className="settings-hint">{text(ui.brandingHint, locale)}</p>
        <div className="settings-grid">
          <label>{text(ui.hostName, locale)}<input type="text" value={draft.hostName} onChange={(e) => setDraft({ ...draft, hostName: e.target.value })} placeholder="Microsoft" /></label>
          <label>{text(ui.hostLogoUrl, locale)}<input type="text" value={draft.hostLogo.startsWith('data:') ? '' : draft.hostLogo} onChange={(e) => setDraft({ ...draft, hostLogo: e.target.value })} placeholder={text(ui.logoUrlHint, locale)} /></label>
          <label className="settings-file">{text(ui.uploadHostLogo, locale)}<input type="file" accept="image/*" onChange={(e) => readFile(e.target.files?.[0], 'hostLogo')} /></label>
          {draft.hostLogo && <div className="settings-preview"><img src={draft.hostLogo} alt={text(ui.hostLogoUrl, locale)} /><button type="button" onClick={() => setDraft({ ...draft, hostLogo: '' })}>{text(ui.removeLogo, locale)}</button></div>}
          <label>{text(ui.customerName, locale)}<input type="text" value={draft.customerName} onChange={(e) => setDraft({ ...draft, customerName: e.target.value })} placeholder={text(ui.customerNameHint, locale)} /></label>
          <label>{text(ui.customerLogoUrl, locale)}<input type="text" value={draft.customerLogo.startsWith('data:') ? '' : draft.customerLogo} onChange={(e) => setDraft({ ...draft, customerLogo: e.target.value })} placeholder={text(ui.logoUrlHint, locale)} /></label>
          <label className="settings-file">{text(ui.uploadCustomerLogo, locale)}<input type="file" accept="image/*" onChange={(e) => readFile(e.target.files?.[0], 'customerLogo')} /></label>
          {draft.customerLogo && <div className="settings-preview"><img src={draft.customerLogo} alt={text(ui.customerLogoUrl, locale)} /><button type="button" onClick={() => setDraft({ ...draft, customerLogo: '' })}>{text(ui.removeLogo, locale)}</button></div>}
        </div>
        <div className="settings-actions">
          <button className="ghost" type="button" onClick={() => setDraft(defaultBranding)}>{text(ui.reset, locale)}</button>
          <button className="ghost" type="button" onClick={saveToHistory}><Save size={15} /> {text(ui.saveToHistory, locale)}</button>
          <button className="primary" type="button" onClick={async () => { setFlash(text(ui.applying, locale)); const s = await onApply(draft); setFlash(text(s === 'published' ? ui.brandingPublished : ui.brandingOffline, locale)) }}>{text(ui.apply, locale)}</button>
        </div>
        {flash && <div className="settings-flash" role="status">{flash}</div>}
        <div className="history-section">
          <div className="history-head"><strong>{text(ui.workshopHistory, locale)}</strong><span className="history-count">{history.length}</span></div>
          <div className="history-search"><Search size={15} /><input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={text(ui.searchWorkshops, locale)} /></div>
          <div className="history-list">
            {filtered.length === 0 && <div className="history-empty">{text(history.length === 0 ? ui.noSavedWorkshops : ui.noMatchingWorkshops, locale)}</div>}
            {filtered.map((w) => (
              <div className="history-row" key={w.id}>
                <button className="history-item" type="button" onClick={() => loadWorkshop(w)} title={text(ui.loadWorkshop, locale)}>
                  <span className="history-logo">{(w.customerLogo || w.hostLogo) ? <img src={w.customerLogo || w.hostLogo} alt="" /> : <span className="history-initial">{(w.name[0] || '?').toUpperCase()}</span>}</span>
                  <span className="history-info"><strong>{w.name}</strong><small>{w.customerName ? `${w.hostName || 'Microsoft'} × ${w.customerName}` : (w.hostName || 'Microsoft')} · {new Date(w.savedAt).toLocaleDateString()}</small></span>
                </button>
                <button className="history-del" type="button" onClick={() => removeWorkshop(w.id)} aria-label={text(ui.deleteWorkshop, locale).replace('{name}', w.name)} title={text(ui.deleteWorkshop, locale).replace('{name}', w.name)}><Trash2 size={15} /></button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function CoverPage({ onEnter, dark, onToggleTheme, locale, onLocaleChange, branding, canConfigure, onOpenSettings }: {
  onEnter: () => void; dark: boolean; onToggleTheme: () => void;
  locale: Locale; onLocaleChange: (l: Locale) => void; branding: Branding; canConfigure: boolean; onOpenSettings: () => void;
}) {
  const hasCustomer = !!(branding.customerName.trim() || branding.customerLogo.trim())
  const [languageOpen, setLanguageOpen] = useState(false)
  const languageRef = useRef<HTMLDivElement>(null)
  const selectLocale = (nextLocale: Locale) => {
    onLocaleChange(nextLocale)
    setLanguageOpen(false)
  }
  useEffect(() => {
    if (!languageOpen) return
    const onPointerDown = (event: PointerEvent) => {
      if (languageRef.current && !languageRef.current.contains(event.target as Node)) setLanguageOpen(false)
    }
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') setLanguageOpen(false) }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [languageOpen])
  return (
    <div className="cover-hero">
      <div className="cover-controls">
        <div className={languageOpen ? 'cover-language open' : 'cover-language'} ref={languageRef}>
          <button className="cover-lang-toggle" type="button" aria-expanded={languageOpen} aria-controls="cover-language-options" onClick={() => setLanguageOpen((open) => !open)}>
            <Languages size={17} /><span>{localeNames[locale]}</span><ChevronDown size={15} />
          </button>
          <div className="cover-langbar" id="cover-language-options" role="group" aria-label={text(ui.language, locale)}>
            {locales.map((item) => (
              <button key={item} type="button" className={item === locale ? 'on' : ''} aria-pressed={item === locale} onClick={() => selectLocale(item)}>{item === 'en' ? 'EN' : localeNames[item]}</button>
            ))}
          </div>
        </div>
        {canConfigure && <button className="icon-button" type="button" onClick={onOpenSettings} title={text(ui.workshopBranding, locale)} aria-label={text(ui.workshopBranding, locale)}><Settings size={18} /></button>}
        <button className="icon-button" type="button" onClick={onToggleTheme} title={text(ui.theme, locale)} aria-label={text(ui.theme, locale)}>{dark ? <Sun size={19} /> : <Moon size={19} />}</button>
      </div>
      <span className="cover-orb one" aria-hidden="true" />
      <span className="cover-orb two" aria-hidden="true" />
      <span className="cover-orb three" aria-hidden="true" />
      <div className="cover-card">
        {hasCustomer
          ? <div className="cover-cobrand"><BrandLogo name={branding.hostName} logo={branding.hostLogo} /><span className="cover-cobrand-x" aria-hidden="true">×</span><BrandLogo name={branding.customerName} logo={branding.customerLogo} /></div>
          : <div className="cover-badge"><Sparkles size={16} /><span>Microsoft Copilot Studio</span></div>}
        <h1 className="cover-title">Jumpstart v2<br />AI Agent Workshop</h1>
        <p className="cover-tagline">{text(cover.tagline, locale)}</p>
        {hasCustomer && <p className="cover-dedicated">{dedicatedText(locale, branding.customerName)}</p>}
        <div className="cover-meta">
          <div className="cover-meta-row"><span className="cover-meta-icon"><Users size={18} /></span><div><small>{text(cover.preparedBy, locale)}</small><strong>Microsoft MCAPS Core — Agent Asia Team</strong></div></div>
          <div className="cover-meta-row"><span className="cover-meta-icon"><CalendarDays size={18} /></span><div><small>{text(cover.preparedIn, locale)}</small><strong>{text(cover.date, locale)}</strong></div></div>
          <div className="cover-meta-row"><span className="cover-meta-icon"><Mail size={18} /></span><div><small>{text(cover.contact, locale)}</small><strong className="cover-contacts"><a href="mailto:nshukla@microsoft.com">Nalin Shukla &middot; nshukla@microsoft.com</a><a href="mailto:zhijian@microsoft.com">Michael Jiang &middot; zhijian@microsoft.com</a></strong></div></div>
        </div>
        <div className="cover-actions">
          <button className="cover-cta" type="button" onClick={onEnter}>{text(cover.cta, locale)} <ArrowRight size={18} /></button>
          <a className="cover-deck-link" href={`${import.meta.env.BASE_URL}promo/JumpStart-v2-Workshop-Highlights.html?lang=${locale}`} target="_blank" rel="noreferrer">{text(cover.deck, locale)} <ExternalLink size={16} /></a>
        </div>
      </div>
      <div className="cover-footer">&copy; Microsoft &middot; MCAPS Core — Agent Asia Team</div>
    </div>
  )
}

function App() {
  const makerEnabled = import.meta.env.DEV
  const [locale, setLocale] = useState<Locale>(() => (localStorage.getItem('jumpstart-locale') as Locale) || 'en')
  const [labs, setLabs] = useState<Lab[]>(() => defaultContent())
  const [labIndex, setLabIndex] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)
  const [dark, setDark] = useState(() => document.documentElement.dataset.theme === 'dark')
  const [makerUnlocked, setMakerUnlocked] = useState(() => sessionStorage.getItem('jumpstart-maker') === '1')
  const [editorOpen, setEditorOpen] = useState(false)
  const [askPassword, setAskPassword] = useState(false)
  const [passwordValue, setPasswordValue] = useState('')
  const [passwordError, setPasswordError] = useState(false)
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem('jumpstart-collapsed') === '1')
  const [activeSection, setActiveSection] = useState(0)
  const [completed, setCompleted] = useState<Set<string>>(() => {
    try { return new Set(JSON.parse(localStorage.getItem('jumpstart-progress') || '[]')) }
    catch { return new Set() }
  })
  const [celebrate, setCelebrate] = useState(0)
  const [showCover, setShowCover] = useState(true)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [pendingUnlock, setPendingUnlock] = useState<'editor' | 'settings' | null>(null)
  const [branding, setBranding] = useState<Branding>(() => {
    try { return { ...defaultBranding, ...JSON.parse(localStorage.getItem('jumpstart-branding') || '{}') } }
    catch { return defaultBranding }
  })
  const lab = labs[labIndex] ?? labs[0]
  const totalSteps = labs.reduce((sum, item) => sum + item.steps.length, 0)
  const overallPercent = totalSteps ? Math.round((completed.size / totalSteps) * 100) : 0
  const sections = [
    { id: `${lab.id}-overview`, label: text(ui.overview, locale) },
    ...lab.steps.map((item, index) => ({ id: `${lab.id}-${item.id}`, label: `${index + 1}. ${stripMarkdown(text(item.title, locale))}` })),
  ]

  useEffect(() => { loadLabs().then(setLabs).catch(() => {}) }, [])

  useEffect(() => { loadPublishedBranding().then((published) => { if (published) setBranding(published) }) }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('cover-open', showCover)
    return () => document.documentElement.classList.remove('cover-open')
  }, [showCover])

  useEffect(() => {
    if (labIndex > labs.length - 1) setLabIndex(Math.max(0, labs.length - 1))
  }, [labs, labIndex])

  useEffect(() => {
    localStorage.setItem('jumpstart-locale', locale)
    document.documentElement.lang = locale === 'zh' ? 'zh-CN' : locale
  }, [locale])

  useEffect(() => {
    localStorage.setItem('jumpstart-collapsed', collapsed ? '1' : '0')
  }, [collapsed])

  useEffect(() => {
    localStorage.setItem('jumpstart-branding', JSON.stringify(branding))
  }, [branding])

  // Track which lab section is in view so the breadcrumb stays in sync while scrolling.
  useEffect(() => {
    const ids = [`${lab.id}-overview`, ...lab.steps.map((item) => `${lab.id}-${item.id}`)]
    const elements = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => !!el)
    if (!elements.length) return
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting)
      if (!visible.length) return
      const topMost = visible.reduce((a, b) => (a.boundingClientRect.top < b.boundingClientRect.top ? a : b))
      const index = ids.indexOf(topMost.target.id)
      if (index >= 0) setActiveSection(index)
    }, { rootMargin: '-64px 0px -65% 0px', threshold: [0, 1] })
    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [lab])

  const openMaker = () => {
    if (!makerEnabled) return
    if (makerUnlocked) { setEditorOpen(true); return }
    setPendingUnlock('editor'); setAskPassword(true); setPasswordValue(''); setPasswordError(false)
  }
  const openSettings = () => {
    if (!makerEnabled) return
    if (makerUnlocked) { setSettingsOpen(true); return }
    setPendingUnlock('settings'); setAskPassword(true); setPasswordValue(''); setPasswordError(false)
  }
  const submitPassword = async () => {
    if (await verifyMakerPassword(passwordValue)) {
      sessionStorage.setItem('jumpstart-maker', '1')
      setMakerUnlocked(true); setAskPassword(false)
      if (pendingUnlock === 'settings') setSettingsOpen(true)
      else setEditorOpen(true)
      setPendingUnlock(null)
    } else setPasswordError(true)
  }

  const selectLab = (index: number) => {
    setLabIndex(index)
    setActiveSection(0)
    setMenuOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const goToSection = (index: number) => {
    const clamped = Math.max(0, Math.min(index, sections.length - 1))
    setActiveSection(clamped)
    document.getElementById(sections[clamped].id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const toggleComplete = (step: LabStep) => {
    const key = `${lab.id}:${step.id}`
    const updated = new Set(completed)
    if (updated.has(key)) {
      updated.delete(key)
    } else {
      updated.add(key)
      // Celebrate only when a step transitions to complete.
      setCelebrate((value) => value + 1)
    }
    setCompleted(updated)
    localStorage.setItem('jumpstart-progress', JSON.stringify([...updated]))
  }
  const toggleTheme = () => {
    const next = !dark
    setDark(next)
    document.documentElement.dataset.theme = next ? 'dark' : 'light'
  }
  const applyBranding = async (next: Branding): Promise<'published' | 'offline'> => {
    setBranding(next)
    return saveBrandingToFile(next)
  }
  const LabIcon = iconMap[lab.icon]

  return <div className={collapsed ? 'app-shell sidebar-collapsed' : 'app-shell'}>
    <Fireworks trigger={celebrate} />
    {showCover && <CoverPage onEnter={() => setShowCover(false)} dark={dark} onToggleTheme={toggleTheme} locale={locale} onLocaleChange={setLocale} branding={branding} canConfigure={makerEnabled} onOpenSettings={openSettings} />}
    {settingsOpen && <BrandingSettings value={branding} locale={locale} onApply={applyBranding} onClose={() => setSettingsOpen(false)} />}
    <button className="mobile-menu" type="button" onClick={() => setMenuOpen(true)} title={text(ui.menu, locale)} aria-label={text(ui.menu, locale)}><Menu /></button>
    {menuOpen && <button className="nav-scrim" type="button" onClick={() => setMenuOpen(false)} aria-label={text(ui.close, locale)} />}
    <aside className={menuOpen ? 'sidebar open' : 'sidebar'}>
      <div className="brand-lockup"><button className="brand-mark" type="button" onClick={() => setShowCover(true)} title={text(ui.program, locale)} aria-label={text(ui.program, locale)}><Sparkles size={22} /></button><div><span>{text(ui.kicker, locale)}</span><strong>{text(ui.program, locale)}</strong></div><button className="collapse-menu" type="button" onClick={() => setCollapsed(true)} title={text(ui.collapseSidebar, locale)} aria-label={text(ui.collapseSidebar, locale)}><PanelLeftClose size={18} /></button><button className="close-menu" type="button" onClick={() => setMenuOpen(false)} title={text(ui.close, locale)}><X /></button></div>
      <div className="overall-progress"><div><span>{text(ui.progress, locale)}</span><strong>{overallPercent}%</strong></div><div className="progress-track"><span style={{ width: `${overallPercent}%` }} /></div></div>
      <nav className="lab-nav" aria-label="Labs">
        {labs.map((item, index) => {
          const Icon = iconMap[item.icon]
          const labDone = item.steps.filter((itemStep) => completed.has(`${item.id}:${itemStep.id}`)).length
          return <button className={index === labIndex ? 'lab-link active' : 'lab-link'} type="button" onClick={() => selectLab(index)} key={item.id}>
            <span className="lab-icon"><Icon size={19} /></span><span className="lab-link-copy"><small>{text(ui.lab, locale)} {item.number}</small><strong>{text(item.title, locale)}</strong></span><span className={labDone === item.steps.length ? 'lab-count done' : 'lab-count'}>{labDone}/{item.steps.length}</span>
          </button>
        })}
      </nav>
      <div className="sidebar-note"><BookOpenCheck size={18} /><span>{completed.size} / {totalSteps} {text(ui.completed, locale).toLowerCase()}</span></div>
    </aside>

    <main className="main-stage">
      <header className="topbar">
        <div className="topbar-left">
          {collapsed && <button className="icon-button rail-toggle" type="button" onClick={() => setCollapsed(false)} title={text(ui.expandSidebar, locale)} aria-label={text(ui.expandSidebar, locale)}><PanelLeft size={18} /></button>}
          <div className="breadcrumbs">
            <select className="crumb-select lab" value={labIndex} onChange={(event) => selectLab(Number(event.target.value))} aria-label={text(ui.lab, locale)}>
              {labs.map((item, index) => <option value={index} key={item.id}>{text(ui.lab, locale)} {item.number}: {text(item.title, locale)}</option>)}
            </select>
            <ArrowRight size={14} />
            <div className="crumb-steps">
              <button className="crumb-nav" type="button" disabled={activeSection === 0} onClick={() => goToSection(activeSection - 1)} title={text(ui.previous, locale)} aria-label={text(ui.previous, locale)}><ChevronUp size={16} /></button>
              <select className="crumb-select" value={activeSection} onChange={(event) => goToSection(Number(event.target.value))} aria-label={text(ui.guide, locale)}>
                {sections.map((section, index) => <option value={index} key={section.id}>{section.label}</option>)}
              </select>
              <button className="crumb-nav" type="button" disabled={activeSection === sections.length - 1} onClick={() => goToSection(activeSection + 1)} title={text(ui.next, locale)} aria-label={text(ui.next, locale)}><ChevronDown size={16} /></button>
            </div>
          </div>
        </div>
        <div className="top-actions"><label className="language-select"><Languages size={17} /><select value={locale} onChange={(event) => setLocale(event.target.value as Locale)} aria-label={text(ui.language, locale)}>{locales.map((item) => <option value={item} key={item}>{localeNames[item]}</option>)}</select></label>{makerEnabled && <button className="icon-button" type="button" onClick={openMaker} title={text(ui.maker, locale)} aria-label={text(ui.maker, locale)}>{makerUnlocked ? <PencilLine size={19} /> : <Lock size={18} />}</button>}<button className="icon-button" type="button" onClick={toggleTheme} title={text(ui.theme, locale)} aria-label={text(ui.theme, locale)}>{dark ? <Sun size={19} /> : <Moon size={19} />}</button></div>
      </header>

      <article className="lab-document">
        <section className="document-page cover-page" id={`${lab.id}-overview`}>
          <div className="overview-layout">
            <section className="overview-copy"><div className="lab-number"><LabIcon size={20} /><span>{text(ui.lab, locale)} {lab.number}</span><span className="dot" /><span>{lab.duration} {text(ui.minutes, locale)}</span></div><h1>{text(lab.title, locale)}</h1><p className="lead">{text(lab.summary, locale)}</p><div className="outcome-band"><span>{text(ui.outcome, locale)}</span><strong>{text(lab.outcome, locale)}</strong></div></section>
            <section className="overview-details"><div className="detail-section"><h2>{text(ui.objectives, locale)}</h2><ol>{lab.objectives.map((objective, index) => <li key={index}><span>{index + 1}</span>{text(objective, locale)}</li>)}</ol></div><div className="detail-section prerequisites"><h2>{text(ui.prerequisites, locale)}</h2><ul>{lab.prerequisites.map((item, index) => <li key={index}>{text(item, locale)}</li>)}</ul></div></section>
          </div>
        </section>

        <section className="document-page contents-page">
          <span className="eyebrow">{text(ui.guide, locale)}</span>
          <h2>{text(ui.contents, locale)}</h2>
          <nav className="document-toc" aria-label={text(ui.contents, locale)}>
            {lab.steps.map((item, index) => <a href={`#${lab.id}-${item.id}`} key={item.id}><span>{String(index + 1).padStart(2, '0')}</span><strong>{stripMarkdown(text(item.title, locale))}</strong><ArrowRight size={18} /></a>)}
          </nav>
        </section>

        {lab.steps.map((item, index) => <DocumentStep
          lab={lab}
          step={item}
          stepNumber={index + 1}
          locale={locale}
          completed={completed.has(`${lab.id}:${item.id}`)}
          onToggleComplete={() => toggleComplete(item)}
          key={item.id}
        />)}
      </article>
    </main>

    {askPassword && <div className="password-scrim" role="dialog" aria-label={text(ui.makerUnlock, locale)}>
      <div className="password-card">
        <div className="password-icon"><Lock size={22} /></div>
        <strong>{text(ui.makerUnlock, locale)}</strong>
        <input type="password" autoFocus value={passwordValue} onChange={(event) => { setPasswordValue(event.target.value); setPasswordError(false) }} onKeyDown={(event) => { if (event.key === 'Enter') submitPassword() }} />
        {passwordError && <span className="password-error">{text(ui.makerWrong, locale)}</span>}
        <div className="password-actions">
          <button type="button" className="ghost-button" onClick={() => setAskPassword(false)}>{text(ui.close, locale)}</button>
          <button type="button" className="copy-button" onClick={submitPassword}>{text(ui.unlock, locale)}</button>
        </div>
      </div>
    </div>}

    {editorOpen && <MakerEditor
      labs={labs}
      locale={locale}
      initialLabIndex={labIndex}
      onChange={setLabs}
      onClose={() => setEditorOpen(false)}
    />}
  </div>
}

export default App
