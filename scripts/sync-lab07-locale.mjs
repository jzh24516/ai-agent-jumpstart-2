import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

const locale = process.argv[2]
if (!locale) throw new Error('Usage: node --experimental-strip-types scripts/sync-lab07-locale.mjs <locale>')

const root = resolve(import.meta.dirname, '..')
const contentPath = resolve(root, 'public/content/labs.json')
const { lab07: source } = await import(pathToFileURL(resolve(root, 'src/content/labs/lab-07/content.ts')).href)
const content = JSON.parse(await readFile(contentPath, 'utf8'))
const target = content.labs.find((lab) => lab.id === source.id)
if (!target) throw new Error('Runtime Lab 7 was not found.')

const copyText = (sourceText, targetText, label) => {
  const value = sourceText?.[locale]
  if (typeof value !== 'string' || !value.trim()) throw new Error(`Missing ${locale} translation: ${label}`)
  targetText[locale] = value
}

copyText(source.title, target.title, 'title')
copyText(source.summary, target.summary, 'summary')
copyText(source.outcome, target.outcome, 'outcome')
source.objectives.forEach((item, index) => copyText(item, target.objectives[index], `objectives[${index}]`))
source.prerequisites.forEach((item, index) => copyText(item, target.prerequisites[index], `prerequisites[${index}]`))

for (const sourceStep of source.steps) {
  const targetStep = target.steps.find((step) => step.id === sourceStep.id)
  if (!targetStep) throw new Error(`Runtime step not found: ${sourceStep.id}`)
  copyText(sourceStep.title, targetStep.title, `${sourceStep.id}.title`)

  for (const sourcePage of sourceStep.pages ?? []) {
    const targetPage = targetStep.pages.find((page) => page.id === sourcePage.id)
    if (!targetPage) throw new Error(`Runtime page not found: ${sourceStep.id}/${sourcePage.id}`)
    if (sourcePage.title) copyText(sourcePage.title, targetPage.title, `${sourceStep.id}/${sourcePage.id}.title`)
    sourcePage.paragraphs.forEach((paragraph, index) => copyText(paragraph, targetPage.paragraphs[index], `${sourceStep.id}/${sourcePage.id}.paragraphs[${index}]`))
    if (sourcePage.markdown) copyText(sourcePage.markdown, targetPage.markdown, `${sourceStep.id}/${sourcePage.id}.markdown`)
    if (sourcePage.highlight) copyText(sourcePage.highlight, targetPage.highlight, `${sourceStep.id}/${sourcePage.id}.highlight`)

    for (const sourcePrompt of sourcePage.prompts ?? []) {
      const targetPrompt = targetPage.prompts.find((prompt) => prompt.id === sourcePrompt.id)
      if (!targetPrompt) throw new Error(`Runtime prompt not found: ${sourcePrompt.id}`)
      if (sourcePrompt.title) copyText(sourcePrompt.title, targetPrompt.title, `${sourcePrompt.id}.title`)
    }
  }
}

await writeFile(contentPath, `${JSON.stringify(content, null, 2)}\n`, 'utf8')
console.log(`Synchronized Lab 7 locale: ${locale}`)