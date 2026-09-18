import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

const locale = process.argv[2]
if (!locale) throw new Error('Usage: node --experimental-strip-types scripts/verify-lab07-locale.mjs <locale>')

const root = resolve(import.meta.dirname, '..')
const { lab07: source } = await import(pathToFileURL(resolve(root, 'src/content/labs/lab-07/content.ts')).href)
const content = JSON.parse(await readFile(resolve(root, 'public/content/labs.json'), 'utf8'))
const target = content.labs.find((lab) => lab.id === source.id)
if (!target) throw new Error('Runtime Lab 7 was not found.')

const fields = []
const compareText = (sourceText, targetText, label) => {
  fields.push({ label, source: sourceText?.[locale], target: targetText?.[locale] })
}

compareText(source.title, target.title, 'title')
compareText(source.summary, target.summary, 'summary')
compareText(source.outcome, target.outcome, 'outcome')
source.objectives.forEach((item, index) => compareText(item, target.objectives[index], `objectives[${index}]`))
source.prerequisites.forEach((item, index) => compareText(item, target.prerequisites[index], `prerequisites[${index}]`))

for (const sourceStep of source.steps) {
  const targetStep = target.steps.find((step) => step.id === sourceStep.id)
  if (!targetStep) throw new Error(`Runtime step not found: ${sourceStep.id}`)
  compareText(sourceStep.title, targetStep.title, `${sourceStep.id}.title`)

  for (const sourcePage of sourceStep.pages ?? []) {
    const targetPage = targetStep.pages.find((page) => page.id === sourcePage.id)
    if (!targetPage) throw new Error(`Runtime page not found: ${sourceStep.id}/${sourcePage.id}`)
    if (sourcePage.title) compareText(sourcePage.title, targetPage.title, `${sourceStep.id}/${sourcePage.id}.title`)
    sourcePage.paragraphs.forEach((paragraph, index) => compareText(paragraph, targetPage.paragraphs[index], `${sourceStep.id}/${sourcePage.id}.paragraphs[${index}]`))
    if (sourcePage.markdown) compareText(sourcePage.markdown, targetPage.markdown, `${sourceStep.id}/${sourcePage.id}.markdown`)
    if (sourcePage.highlight) compareText(sourcePage.highlight, targetPage.highlight, `${sourceStep.id}/${sourcePage.id}.highlight`)

    for (const sourcePrompt of sourcePage.prompts ?? []) {
      const targetPrompt = targetPage.prompts.find((prompt) => prompt.id === sourcePrompt.id)
      if (!targetPrompt) throw new Error(`Runtime prompt not found: ${sourcePrompt.id}`)
      if (sourcePrompt.title) compareText(sourcePrompt.title, targetPrompt.title, `${sourcePrompt.id}.title`)
    }
  }
}

const failures = fields.filter(({ source: sourceValue, target: targetValue }) =>
  typeof sourceValue !== 'string' || !sourceValue.trim() || sourceValue !== targetValue)

if (failures.length) {
  throw new Error(`Locale ${locale} failed for: ${failures.map(({ label }) => label).join(', ')}`)
}

console.log(JSON.stringify({
  locale,
  translatedFields: fields.length,
  steps: target.steps.length,
  pages: target.steps.flatMap((step) => step.pages).length,
}))