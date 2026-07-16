import { Fragment, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import {
  ArrowRight, BookOpenCheck, CalendarDays, Check, ChevronDown, ChevronUp,
  Clipboard, Database, FileSpreadsheet, Languages, Lock, Mail, MailCheck, Menu, Mic2,
  Moon, Network, PanelLeft, PanelLeftClose, PencilLine, Sparkles, Sun, Users, X,
} from 'lucide-react'
import { defaultContent, loadLabs } from './content/store'
import MakerEditor from './editor/MakerEditor'
import Fireworks from './Fireworks'
import { localeNames, text, ui } from './content/ui'
import type { Lab, LabStep, Locale } from './content/types'

const locales = Object.keys(localeNames) as Locale[]
const iconMap = { sparkles: Sparkles, database: Database, file: FileSpreadsheet, network: Network, mail: MailCheck, mic: Mic2 }

// Renders Markdown inline (no block <p> wrapper) so it can live inside headings like <h2>/<h3>.
const inlineMarkdownComponents = { p: ({ children }: { children?: ReactNode }) => <Fragment>{children}</Fragment> }
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
  const localeSource = `/labs/${lab.id}/images/${locale}/${imageKey}.png`
  const enSource = `/labs/${lab.id}/images/en/${imageKey}.png`
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

function CoverPage({ onEnter, dark, onToggleTheme }: { onEnter: () => void; dark: boolean; onToggleTheme: () => void }) {
  return (
    <div className="cover-hero">
      <button className="icon-button cover-theme" type="button" onClick={onToggleTheme} title="Toggle color theme" aria-label="Toggle color theme">{dark ? <Sun size={19} /> : <Moon size={19} />}</button>
      <span className="cover-orb one" aria-hidden="true" />
      <span className="cover-orb two" aria-hidden="true" />
      <span className="cover-orb three" aria-hidden="true" />
      <div className="cover-card">
        <div className="cover-badge"><Sparkles size={16} /><span>Microsoft Copilot Studio</span></div>
        <h1 className="cover-title">Jumpstart v2<br />AI Agent Workshop</h1>
        <p className="cover-tagline">A hands-on learning path exploring the full breadth of custom agent innovation in Microsoft Copilot Studio.</p>
        <div className="cover-meta">
          <div className="cover-meta-row"><span className="cover-meta-icon"><Users size={18} /></span><div><small>Prepared by</small><strong>Microsoft MCAPS Core — Agent Asia Team</strong></div></div>
          <div className="cover-meta-row"><span className="cover-meta-icon"><CalendarDays size={18} /></span><div><small>Prepared in</small><strong>Sep 16, 2026</strong></div></div>
          <div className="cover-meta-row"><span className="cover-meta-icon"><Mail size={18} /></span><div><small>Need help? Contact</small><strong className="cover-contacts"><a href="mailto:nshukla@microsoft.com">Nalin Shukla &middot; nshukla@microsoft.com</a><a href="mailto:zhijian@microsoft.com">Michael Jiang &middot; zhijian@microsoft.com</a></strong></div></div>
        </div>
        <button className="cover-cta" type="button" onClick={onEnter}>Enter workshop <ArrowRight size={18} /></button>
      </div>
      <div className="cover-footer">&copy; Microsoft &middot; MCAPS Core — Agent Asia Team</div>
    </div>
  )
}

function App() {
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
  const lab = labs[labIndex] ?? labs[0]
  const totalSteps = labs.reduce((sum, item) => sum + item.steps.length, 0)
  const overallPercent = totalSteps ? Math.round((completed.size / totalSteps) * 100) : 0
  const sections = [
    { id: `${lab.id}-overview`, label: text(ui.overview, locale) },
    ...lab.steps.map((item, index) => ({ id: `${lab.id}-${item.id}`, label: `${index + 1}. ${stripMarkdown(text(item.title, locale))}` })),
  ]

  useEffect(() => { loadLabs().then(setLabs).catch(() => {}) }, [])

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
    if (makerUnlocked) { setEditorOpen(true); return }
    setAskPassword(true); setPasswordValue(''); setPasswordError(false)
  }
  const submitPassword = () => {
    if (passwordValue === 'copilotstudio123') {
      sessionStorage.setItem('jumpstart-maker', '1')
      setMakerUnlocked(true); setAskPassword(false); setEditorOpen(true)
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
  const LabIcon = iconMap[lab.icon]

  return <div className={collapsed ? 'app-shell sidebar-collapsed' : 'app-shell'}>
    <Fireworks trigger={celebrate} />
    {showCover && <CoverPage onEnter={() => setShowCover(false)} dark={dark} onToggleTheme={toggleTheme} />}
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
        <div className="top-actions"><label className="language-select"><Languages size={17} /><select value={locale} onChange={(event) => setLocale(event.target.value as Locale)} aria-label="Language">{locales.map((item) => <option value={item} key={item}>{localeNames[item]}</option>)}</select></label><button className="icon-button" type="button" onClick={openMaker} title={text(ui.maker, locale)} aria-label={text(ui.maker, locale)}>{makerUnlocked ? <PencilLine size={19} /> : <Lock size={18} />}</button><button className="icon-button" type="button" onClick={toggleTheme} title={text(ui.theme, locale)} aria-label={text(ui.theme, locale)}>{dark ? <Sun size={19} /> : <Moon size={19} />}</button></div>
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
