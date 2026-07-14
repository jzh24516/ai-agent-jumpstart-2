import { labs as defaultLabs } from './labs'
import type { Lab, LabPrompt, LabStep, LabStepPage, LocalizedText } from './types'

const CONTENT_URL = '/content/labs.json'
export const CONTENT_VERSION = 2

const uid = (prefix: string) => {
  const random = typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID().slice(0, 8)
    : Math.random().toString(36).slice(2, 10)
  return `${prefix}-${random}`
}

export const emptyText = (): LocalizedText => ({ en: '', zh: '', ja: '', ko: '' })

const cloneText = (value?: LocalizedText): LocalizedText =>
  value ? { en: value.en, zh: value.zh, ja: value.ja, ko: value.ko } : emptyText()

// Every step is normalized so the editor and reader only work with `pages`.
const normalizePrompt = (prompt: LabPrompt): LabPrompt => ({
  id: prompt.id || uid('prompt'),
  title: prompt.title ? cloneText(prompt.title) : undefined,
  content: prompt.content ?? '',
})

const normalizePage = (page: LabStepPage): LabStepPage => {
  // Legacy single `prompt` string is converted to the `prompts` array.
  const prompts = page.prompts?.length
    ? page.prompts
    : (page.prompt ? [{ id: uid('prompt'), content: page.prompt }] : [])
  return {
    id: page.id || uid('page'),
    title: page.title ? cloneText(page.title) : undefined,
    paragraphs: (page.paragraphs ?? []).map(cloneText),
    markdown: page.markdown ? cloneText(page.markdown) : undefined,
    highlight: page.highlight ? cloneText(page.highlight) : undefined,
    prompts: prompts.map(normalizePrompt),
    imageKeys: page.imageKeys ? [...page.imageKeys] : [],
  }
}

const normalizeStep = (step: LabStep): LabStep => {
  const pages = step.pages?.length
    ? step.pages
    : [{
        id: 'main',
        paragraphs: step.body ? [step.body] : [],
        highlight: step.highlight,
        prompt: step.prompt,
        imageKeys: step.imageKey ? [step.imageKey] : [],
      }]
  return {
    id: step.id || uid('step'),
    title: cloneText(step.title),
    pages: pages.map(normalizePage),
  }
}

export const normalizeLab = (lab: Lab): Lab => ({
  id: lab.id || uid('lab'),
  number: lab.number,
  icon: lab.icon,
  duration: lab.duration,
  title: cloneText(lab.title),
  summary: cloneText(lab.summary),
  outcome: cloneText(lab.outcome),
  objectives: lab.objectives.map(cloneText),
  prerequisites: lab.prerequisites.map(cloneText),
  steps: lab.steps.map(normalizeStep),
})

const renumber = (labs: Lab[]): Lab[] => labs.map((lab, index) => ({ ...lab, number: index + 1 }))

const migrateContent = (labs: Lab[], version: number): Lab[] => {
  const normalized = labs.map(normalizeLab)
  if (version < 2) {
    const lab01 = normalized.find((lab) => lab.id === 'lab-01')
    const setupStep = defaultLabs
      .find((lab) => lab.id === 'lab-01')
      ?.steps.find((step) => step.id === 'browser-profile-setup')
    if (lab01 && setupStep && !lab01.steps.some((step) => step.id === setupStep.id)) {
      lab01.steps.unshift(normalizeStep(setupStep))
    }
  }
  return renumber(normalized)
}

export const defaultContent = (): Lab[] => renumber(defaultLabs.map(normalizeLab))

export async function loadLabs(): Promise<Lab[]> {
  try {
    const response = await fetch(CONTENT_URL, { cache: 'no-store' })
    if (response.ok) {
      const data = await response.json()
      if (Array.isArray(data?.labs) && data.labs.length) {
        return migrateContent(data.labs as Lab[], Number(data.version) || 0)
      }
    }
  } catch {
    // No published content yet — fall back to the bundled defaults.
  }
  return defaultContent()
}

export async function saveLabs(labs: Lab[]): Promise<void> {
  const response = await fetch('/api/content', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ version: CONTENT_VERSION, labs: renumber(labs) }, null, 2),
  })
  if (!response.ok) {
    throw new Error(await response.text() || `Save failed (${response.status})`)
  }
}

export async function publishLabs(): Promise<string> {
  const response = await fetch('/api/publish', { method: 'POST' })
  const message = await response.text()
  if (!response.ok) throw new Error(message || `Publish failed (${response.status})`)
  return message
}

// --- factories used by the editor -------------------------------------------

export const newPage = (): LabStepPage => ({
  id: uid('page'),
  title: emptyText(),
  paragraphs: [emptyText()],
  highlight: undefined,
  prompts: [],
  imageKeys: [],
})

export const newPrompt = (): LabPrompt => ({
  id: uid('prompt'),
  title: emptyText(),
  content: '',
})

export const newStep = (): LabStep => ({
  id: uid('step'),
  title: emptyText(),
  pages: [newPage()],
})

export const newLab = (number: number): Lab => ({
  id: uid('lab'),
  number,
  icon: 'sparkles',
  duration: 30,
  title: emptyText(),
  summary: emptyText(),
  outcome: emptyText(),
  objectives: [emptyText()],
  prerequisites: [emptyText()],
  steps: [newStep()],
})

export const applyNumbers = renumber
