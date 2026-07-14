import { useEffect, useState } from 'react'
import {
  ArrowDown, ArrowUp, ChevronDown, ChevronRight, Copy, Plus, Save, Trash2, UploadCloud, X,
} from 'lucide-react'
import { localeNames, text, ui } from '../content/ui'
import { applyNumbers, emptyText, newLab, newPage, newPrompt, newStep, publishLabs, saveLabs } from '../content/store'
import type { Lab, LabIconName, Locale, LocalizedText } from '../content/types'

const editLocales = Object.keys(localeNames) as Locale[]
const iconOptions: LabIconName[] = ['sparkles', 'database', 'file', 'network', 'mail', 'mic']

function moveItem<T>(list: T[], from: number, direction: -1 | 1) {
  const to = from + direction
  if (to < 0 || to >= list.length) return
  const [item] = list.splice(from, 1)
  list.splice(to, 0, item)
}

function LocalizedField({
  label, value, locale, rows = 2, onChange,
}: {
  label: string
  value: LocalizedText
  locale: Locale
  rows?: number
  onChange: (next: LocalizedText) => void
}) {
  return (
    <label className="editor-field">
      <span className="editor-field-label">
        {label}
        {locale !== 'en' && (
          <button type="button" className="ghost-button" onClick={() => onChange({ ...value, [locale]: value.en })}>
            <Copy size={13} />{text(ui.copyEnglish, locale)}
          </button>
        )}
      </span>
      <textarea
        rows={rows}
        value={value[locale]}
        placeholder={locale === 'en' ? '' : value.en}
        onChange={(event) => onChange({ ...value, [locale]: event.target.value })}
      />
    </label>
  )
}

export default function MakerEditor({
  labs, locale, initialLabIndex, onChange, onClose,
}: {
  labs: Lab[]
  locale: Locale
  initialLabIndex: number
  onChange: (labs: Lab[]) => void
  onClose: () => void
}) {
  const [editLocale, setEditLocale] = useState<Locale>('en')
  const [selected, setSelected] = useState(Math.min(initialLabIndex, labs.length - 1))
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'publishing' | 'published' | 'error'>('idle')
  const [log, setLog] = useState('')
  const [stepsCollapsed, setStepsCollapsed] = useState<boolean>(() => localStorage.getItem('jumpstart-editor-steps-collapsed') === '1')
  const [collapsedSteps, setCollapsedSteps] = useState<Set<string>>(() => {
    try { return new Set(JSON.parse(localStorage.getItem('jumpstart-editor-collapsed-steps') || '[]')) }
    catch { return new Set() }
  })

  useEffect(() => {
    localStorage.setItem('jumpstart-editor-steps-collapsed', stepsCollapsed ? '1' : '0')
  }, [stepsCollapsed])

  useEffect(() => {
    localStorage.setItem('jumpstart-editor-collapsed-steps', JSON.stringify([...collapsedSteps]))
  }, [collapsedSteps])

  const toggleStep = (id: string) => setCollapsedSteps((current) => {
    const next = new Set(current)
    if (next.has(id)) next.delete(id); else next.add(id)
    return next
  })

  const update = (mutator: (draft: Lab[]) => void) => {
    const draft: Lab[] = structuredClone(labs)
    mutator(draft)
    onChange(applyNumbers(draft))
    setStatus('idle')
  }

  const lab = labs[selected]

  const save = async () => {
    setStatus('saving'); setLog('')
    try { await saveLabs(labs); setStatus('saved') }
    catch (error) { setStatus('error'); setLog((error as Error).message) }
  }
  const publish = async () => {
    setStatus('publishing'); setLog('')
    try { await saveLabs(labs); const out = await publishLabs(); setStatus('published'); setLog(out) }
    catch (error) { setStatus('error'); setLog((error as Error).message) }
  }

  const statusLabel = () => {
    if (status === 'saving') return text(ui.saving, locale)
    if (status === 'saved') return text(ui.saved, locale)
    if (status === 'publishing') return text(ui.publishing, locale)
    if (status === 'published') return text(ui.published, locale)
    return ''
  }

  return (
    <div className="editor-overlay" role="dialog" aria-label={text(ui.editContent, locale)}>
      <header className="editor-topbar">
        <div className="editor-topbar-left">
          <strong>{text(ui.editContent, locale)}</strong>
          <label className="language-select compact">
            <span>{text(ui.editingLanguage, locale)}</span>
            <select value={editLocale} onChange={(event) => setEditLocale(event.target.value as Locale)}>
              {editLocales.map((item) => <option value={item} key={item}>{localeNames[item]}</option>)}
            </select>
          </label>
        </div>
        <div className="editor-topbar-actions">
          <span className={status === 'error' ? 'editor-status error' : 'editor-status'}>{status === 'error' ? log : statusLabel()}</span>
          <button type="button" className="ghost-button" onClick={save} disabled={status === 'saving' || status === 'publishing'}>
            <Save size={15} />{text(ui.save, locale)}
          </button>
          <button type="button" className="copy-button" onClick={publish} disabled={status === 'saving' || status === 'publishing'}>
            <UploadCloud size={15} />{text(ui.publish, locale)}
          </button>
          <button type="button" className="icon-button" onClick={onClose} title={text(ui.exitMaker, locale)} aria-label={text(ui.exitMaker, locale)}><X size={18} /></button>
        </div>
      </header>

      <p className="editor-hint">{text(ui.publishHint, locale)} · {text(ui.fallbackNote, locale)}</p>

      <div className="editor-body">
        <aside className="editor-labs">
          {labs.map((item, index) => (
            <div className={index === selected ? 'editor-lab-link active' : 'editor-lab-link'} key={item.id}>
              <button type="button" onClick={() => setSelected(index)}>
                <small>{text(ui.lab, locale)} {item.number}</small>
                <strong>{text(item.title, editLocale) || text(item.title, locale) || '—'}</strong>
              </button>
              <div className="editor-lab-tools">
                <button type="button" title={text(ui.moveUp, locale)} onClick={() => update((d) => moveItem(d, index, -1))}><ArrowUp size={14} /></button>
                <button type="button" title={text(ui.moveDown, locale)} onClick={() => update((d) => moveItem(d, index, 1))}><ArrowDown size={14} /></button>
                <button type="button" title={text(ui.remove, locale)} onClick={() => {
                  if (labs.length <= 1) return
                  update((d) => d.splice(index, 1))
                  setSelected((current) => Math.max(0, Math.min(current, labs.length - 2)))
                }}><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
          <button type="button" className="ghost-button add-lab" onClick={() => {
            update((d) => d.push(newLab(d.length + 1)))
            setSelected(labs.length)
          }}><Plus size={15} />{text(ui.addLab, locale)}</button>
        </aside>

        {lab && (
          <section className="editor-form" key={lab.id}>
            <div className="editor-row">
              <label className="editor-field small">
                <span className="editor-field-label">{text(ui.labIcon, locale)}</span>
                <select value={lab.icon} onChange={(event) => update((d) => { d[selected].icon = event.target.value as LabIconName })}>
                  {iconOptions.map((icon) => <option value={icon} key={icon}>{icon}</option>)}
                </select>
              </label>
              <label className="editor-field small">
                <span className="editor-field-label">{text(ui.labDuration, locale)}</span>
                <input type="number" min={1} value={lab.duration} onChange={(event) => update((d) => { d[selected].duration = Number(event.target.value) || 0 })} />
              </label>
            </div>

            <LocalizedField label={text(ui.labTitle, locale)} value={lab.title} locale={editLocale} onChange={(next) => update((d) => { d[selected].title = next })} />
            <LocalizedField label={text(ui.labSummary, locale)} value={lab.summary} locale={editLocale} rows={3} onChange={(next) => update((d) => { d[selected].summary = next })} />
            <LocalizedField label={text(ui.labOutcome, locale)} value={lab.outcome} locale={editLocale} rows={2} onChange={(next) => update((d) => { d[selected].outcome = next })} />

            <ListEditor
              legend={text(ui.objectives, locale)} addLabel={text(ui.addObjective, locale)} locale={locale} editLocale={editLocale}
              items={lab.objectives}
              onAdd={() => update((d) => d[selected].objectives.push(emptyText()))}
              onRemove={(i) => update((d) => d[selected].objectives.splice(i, 1))}
              onChange={(i, next) => update((d) => { d[selected].objectives[i] = next })}
              onMove={(i, dir) => update((d) => moveItem(d[selected].objectives, i, dir))}
            />
            <ListEditor
              legend={text(ui.prerequisites, locale)} addLabel={text(ui.addPrerequisite, locale)} locale={locale} editLocale={editLocale}
              items={lab.prerequisites}
              onAdd={() => update((d) => d[selected].prerequisites.push(emptyText()))}
              onRemove={(i) => update((d) => d[selected].prerequisites.splice(i, 1))}
              onChange={(i, next) => update((d) => { d[selected].prerequisites[i] = next })}
              onMove={(i, dir) => update((d) => moveItem(d[selected].prerequisites, i, dir))}
            />

            <button type="button" className="editor-section-toggle" onClick={() => setStepsCollapsed((v) => !v)} aria-expanded={!stepsCollapsed}>
              {stepsCollapsed ? <ChevronRight size={18} /> : <ChevronDown size={18} />}
              <h3 className="editor-section-title">{text(ui.step, locale)}s</h3>
              <span className="editor-section-count">{lab.steps.length}</span>
            </button>
            {!stepsCollapsed && <>
            {lab.steps.map((step, stepIndex) => {
              const stepCollapsed = collapsedSteps.has(step.id)
              return (
              <div className={stepCollapsed ? 'editor-step collapsed' : 'editor-step'} key={step.id}>
                <div className="editor-step-head">
                  <button type="button" className="editor-collapse-toggle" onClick={() => toggleStep(step.id)} aria-expanded={!stepCollapsed}>
                    {stepCollapsed ? <ChevronRight size={15} /> : <ChevronDown size={15} />}
                    <span className="editor-badge">{text(ui.step, locale)} {stepIndex + 1}</span>
                    <span className="editor-step-preview">{text(step.title, editLocale) || text(step.title, locale)}</span>
                  </button>
                  <div className="editor-lab-tools">
                    <button type="button" title={text(ui.moveUp, locale)} onClick={() => update((d) => moveItem(d[selected].steps, stepIndex, -1))}><ArrowUp size={14} /></button>
                    <button type="button" title={text(ui.moveDown, locale)} onClick={() => update((d) => moveItem(d[selected].steps, stepIndex, 1))}><ArrowDown size={14} /></button>
                    <button type="button" title={text(ui.remove, locale)} onClick={() => update((d) => { if (d[selected].steps.length > 1) d[selected].steps.splice(stepIndex, 1) })}><Trash2 size={14} /></button>
                  </div>
                </div>
                {!stepCollapsed && <>
                <LocalizedField label={text(ui.stepTitle, locale)} value={step.title} locale={editLocale} onChange={(next) => update((d) => { d[selected].steps[stepIndex].title = next })} />

                {(step.pages ?? []).map((page, pageIndex) => (
                  <div className="editor-page" key={page.id}>
                    <div className="editor-step-head">
                      <span className="editor-badge subtle">{text(ui.page, locale)} {pageIndex + 1}</span>
                      <div className="editor-lab-tools">
                        <button type="button" title={text(ui.moveUp, locale)} onClick={() => update((d) => moveItem(d[selected].steps[stepIndex].pages!, pageIndex, -1))}><ArrowUp size={14} /></button>
                        <button type="button" title={text(ui.moveDown, locale)} onClick={() => update((d) => moveItem(d[selected].steps[stepIndex].pages!, pageIndex, 1))}><ArrowDown size={14} /></button>
                        <button type="button" title={text(ui.remove, locale)} onClick={() => update((d) => { const pages = d[selected].steps[stepIndex].pages!; if (pages.length > 1) pages.splice(pageIndex, 1) })}><Trash2 size={14} /></button>
                      </div>
                    </div>
                    <LocalizedField label={text(ui.pageTitle, locale)} value={page.title ?? emptyText()} locale={editLocale} onChange={(next) => update((d) => { d[selected].steps[stepIndex].pages![pageIndex].title = next })} />

                    {page.paragraphs.map((paragraph, paraIndex) => (
                      <div className="editor-inline" key={paraIndex}>
                        <LocalizedField label={`${text(ui.page, locale)} ¶ ${paraIndex + 1} (Markdown)`} value={paragraph} locale={editLocale} rows={3} onChange={(next) => update((d) => { d[selected].steps[stepIndex].pages![pageIndex].paragraphs[paraIndex] = next })} />
                        <button type="button" className="row-remove" title={text(ui.remove, locale)} onClick={() => update((d) => { const paras = d[selected].steps[stepIndex].pages![pageIndex].paragraphs; if (paras.length > 1) paras.splice(paraIndex, 1) })}><Trash2 size={14} /></button>
                      </div>
                    ))}
                    <button type="button" className="ghost-button" onClick={() => update((d) => d[selected].steps[stepIndex].pages![pageIndex].paragraphs.push(emptyText()))}><Plus size={14} />{text(ui.addParagraph, locale)}</button>

                    <LocalizedField label="Markdown" value={page.markdown ?? emptyText()} locale={editLocale} rows={12} onChange={(next) => update((d) => { d[selected].steps[stepIndex].pages![pageIndex].markdown = next })} />

                    <LocalizedField label={text(ui.fieldHighlight, locale)} value={page.highlight ?? emptyText()} locale={editLocale} rows={2} onChange={(next) => update((d) => { d[selected].steps[stepIndex].pages![pageIndex].highlight = next })} />

                    <div className="editor-prompts">
                      {(page.prompts ?? []).map((prompt, promptIndex) => (
                        <div className="editor-prompt" key={prompt.id}>
                          <div className="editor-step-head">
                            <span className="editor-badge subtle">{text(ui.addPrompt, locale)} {promptIndex + 1}</span>
                            <div className="editor-lab-tools">
                              <button type="button" title={text(ui.moveUp, locale)} onClick={() => update((d) => moveItem(d[selected].steps[stepIndex].pages![pageIndex].prompts!, promptIndex, -1))}><ArrowUp size={14} /></button>
                              <button type="button" title={text(ui.moveDown, locale)} onClick={() => update((d) => moveItem(d[selected].steps[stepIndex].pages![pageIndex].prompts!, promptIndex, 1))}><ArrowDown size={14} /></button>
                              <button type="button" title={text(ui.remove, locale)} onClick={() => update((d) => { d[selected].steps[stepIndex].pages![pageIndex].prompts!.splice(promptIndex, 1) })}><Trash2 size={14} /></button>
                            </div>
                          </div>
                          <LocalizedField label={text(ui.fieldPromptTitle, locale)} value={prompt.title ?? emptyText()} locale={editLocale} onChange={(next) => update((d) => { d[selected].steps[stepIndex].pages![pageIndex].prompts![promptIndex].title = next })} />
                          <label className="editor-field">
                            <span className="editor-field-label">{text(ui.fieldPrompt, locale)}</span>
                            <textarea rows={4} value={prompt.content} onChange={(event) => update((d) => { d[selected].steps[stepIndex].pages![pageIndex].prompts![promptIndex].content = event.target.value })} />
                          </label>
                        </div>
                      ))}
                      <button type="button" className="ghost-button" onClick={() => update((d) => { const target = d[selected].steps[stepIndex].pages![pageIndex]; target.prompts = [...(target.prompts ?? []), newPrompt()] })}><Plus size={14} />{text(ui.addPrompt, locale)}</button>
                    </div>

                    <div className="editor-images">
                      <span className="editor-field-label">{text(ui.screenshot, locale)}</span>
                      {(page.imageKeys ?? []).map((key, keyIndex) => (
                        <div className="editor-inline" key={keyIndex}>
                          <input value={key} placeholder="01-screenshot-key" onChange={(event) => update((d) => { d[selected].steps[stepIndex].pages![pageIndex].imageKeys![keyIndex] = event.target.value })} />
                          <button type="button" className="row-remove" title={text(ui.remove, locale)} onClick={() => update((d) => { d[selected].steps[stepIndex].pages![pageIndex].imageKeys!.splice(keyIndex, 1) })}><Trash2 size={14} /></button>
                        </div>
                      ))}
                      <button type="button" className="ghost-button" onClick={() => update((d) => { const target = d[selected].steps[stepIndex].pages![pageIndex]; target.imageKeys = [...(target.imageKeys ?? []), ''] })}><Plus size={14} />{text(ui.addImage, locale)}</button>
                    </div>
                  </div>
                ))}
                <button type="button" className="ghost-button add-page" onClick={() => update((d) => { const pages = d[selected].steps[stepIndex].pages ??= []; pages.push(newPage()) })}><Plus size={15} />{text(ui.addPage, locale)}</button>
                </>}
              </div>
              )
            })}
            <button type="button" className="ghost-button add-step" onClick={() => update((d) => d[selected].steps.push(newStep()))}><Plus size={15} />{text(ui.addStep, locale)}</button>
            </>}
          </section>
        )}
      </div>
    </div>
  )
}

function ListEditor({
  legend, addLabel, items, locale, editLocale, onAdd, onRemove, onChange, onMove,
}: {
  legend: string
  addLabel: string
  items: LocalizedText[]
  locale: Locale
  editLocale: Locale
  onAdd: () => void
  onRemove: (index: number) => void
  onChange: (index: number, next: LocalizedText) => void
  onMove: (index: number, direction: -1 | 1) => void
}) {
  return (
    <fieldset className="editor-list">
      <legend>{legend}</legend>
      {items.map((item, index) => (
        <div className="editor-inline" key={index}>
          <LocalizedField label={`${index + 1}`} value={item} locale={editLocale} onChange={(next) => onChange(index, next)} />
          <div className="editor-lab-tools">
            <button type="button" title={text(ui.moveUp, locale)} onClick={() => onMove(index, -1)}><ArrowUp size={14} /></button>
            <button type="button" title={text(ui.moveDown, locale)} onClick={() => onMove(index, 1)}><ArrowDown size={14} /></button>
            <button type="button" title={text(ui.remove, locale)} onClick={() => onRemove(index)}><Trash2 size={14} /></button>
          </div>
        </div>
      ))}
      <button type="button" className="ghost-button" onClick={onAdd}><Plus size={14} />{addLabel}</button>
    </fieldset>
  )
}
