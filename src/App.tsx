import { Fragment, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import {
  ArrowRight, BookOpenCheck, Check, ChevronDown, ChevronUp,
  Clipboard, Database, FileSpreadsheet, Languages, Lock, MailCheck, Menu, Mic2,
  Moon, Network, PanelLeft, PanelLeftClose, PencilLine, Sparkles, Sun, X,
} from 'lucide-react'
import { defaultContent, loadLabs } from './content/store'
import MakerEditor from './editor/MakerEditor'
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

function PromptBlock({ prompt, locale }: { prompt: string; locale: Locale }) {
  const [expanded, setExpanded] = useState(false)
  const [copied, setCopied] = useState(false)
  const copyPrompt = async () => {
    await navigator.clipboard.writeText(prompt)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }
  return (
    <section className="prompt-panel" aria-label={text(ui.input, locale)}>
      <div className="prompt-toolbar">
        <div><span className="eyebrow">{text(ui.input, locale)}</span><strong>Instructions / Input</strong></div>
        <div className="toolbar-actions">
          <button className="icon-text-button" type="button" onClick={() => setExpanded(!expanded)}>
            {expanded ? <ChevronUp size={17} /> : <ChevronDown size={17} />}{text(expanded ? ui.collapse : ui.expand, locale)}
          </button>
          <button className="copy-button" type="button" onClick={copyPrompt}>
            {copied ? <Check size={17} /> : <Clipboard size={17} />}{text(copied ? ui.copied : ui.copy, locale)}
          </button>
        </div>
      </div>
      <pre className={expanded ? 'prompt expanded' : 'prompt'}><code>{prompt}</code></pre>
    </section>
  )
}

function Screenshot({ lab, imageKey, locale }: { lab: Lab; imageKey: string; locale: Locale }) {
  const [missing, setMissing] = useState(false)
  const source = `/labs/${lab.id}/images/${locale}/${imageKey}.png`
  useEffect(() => setMissing(false), [source])
  return (
    <figure className="screenshot-frame">
      {!missing && <img src={source} alt={`${text(lab.title, locale)} — ${imageKey}`} onError={() => setMissing(true)} />}
      {missing && <div className="screenshot-placeholder">
        <div className="placeholder-mark"><Sparkles size={28} /></div>
        <strong>{text(ui.screenshot, locale)}</strong><span>{text(ui.screenshotHint, locale)}</span><code>{source}</code>
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
    prompt: step.prompt,
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
          {page.highlight && <aside className="highlight"><Sparkles size={20} /><div className="highlight-content"><strong className="highlight-label">{text(ui.highlight, locale)}</strong><ReactMarkdown remarkPlugins={[remarkGfm]}>{text(page.highlight, locale)}</ReactMarkdown></div></aside>}
          {page.prompt && <PromptBlock prompt={page.prompt} locale={locale} />}
          {!!page.imageKeys?.filter(Boolean).length && <div className="embedded-figures">{page.imageKeys.filter(Boolean).map((imageKey) => <Screenshot lab={lab} imageKey={imageKey} locale={locale} key={imageKey} />)}</div>}
        </article>
      ))}
      <button className={completed ? 'step-complete-action checked' : 'step-complete-action'} type="button" onClick={onToggleComplete}>
        <span>{completed && <Check size={16} />}</span>{text(completed ? ui.completed : ui.complete, locale)}
      </button>
    </section>
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
    if (updated.has(key)) updated.delete(key); else updated.add(key)
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
    <button className="mobile-menu" type="button" onClick={() => setMenuOpen(true)} title={text(ui.menu, locale)} aria-label={text(ui.menu, locale)}><Menu /></button>
    {menuOpen && <button className="nav-scrim" type="button" onClick={() => setMenuOpen(false)} aria-label={text(ui.close, locale)} />}
    <aside className={menuOpen ? 'sidebar open' : 'sidebar'}>
      <div className="brand-lockup"><div className="brand-mark"><Sparkles size={22} /></div><div><span>{text(ui.kicker, locale)}</span><strong>{text(ui.program, locale)}</strong></div><button className="collapse-menu" type="button" onClick={() => setCollapsed(true)} title={text(ui.collapseSidebar, locale)} aria-label={text(ui.collapseSidebar, locale)}><PanelLeftClose size={18} /></button><button className="close-menu" type="button" onClick={() => setMenuOpen(false)} title={text(ui.close, locale)}><X /></button></div>
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
