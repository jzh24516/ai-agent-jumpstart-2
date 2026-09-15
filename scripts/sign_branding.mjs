import { createHmac, randomUUID } from 'node:crypto'
import { readFile, writeFile } from 'node:fs/promises'

const brandingPath = new URL('../public/content/branding.json', import.meta.url)
const envPath = new URL('../.env', import.meta.url)
const workshopIdPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

const envText = await readFile(envPath, 'utf8')
const signingLine = envText.split(/\r?\n/).find((line) => line.startsWith('SURVEY_WORKSHOP_SIGNING_SECRET='))
const signingSecret = signingLine?.slice(signingLine.indexOf('=') + 1).trim()
if (!signingSecret) throw new Error('SURVEY_WORKSHOP_SIGNING_SECRET is missing from .env')

const branding = JSON.parse(await readFile(brandingPath, 'utf8'))
const workshopId = workshopIdPattern.test(branding.workshopId) ? branding.workshopId : randomUUID()
const claim = [
  workshopId,
  `workshop:${workshopId}`,
  String(branding.customerName ?? '').trim(),
  String(branding.hostName ?? '').trim(),
  String(branding.workshopStart ?? '').trim(),
  String(branding.workshopEnd ?? '').trim(),
]
const surveyToken = createHmac('sha256', signingSecret).update(JSON.stringify(claim)).digest('base64url')

await writeFile(brandingPath, `${JSON.stringify({ ...branding, workshopId, surveyToken }, null, 2)}\n`, 'utf8')
console.log(`Signed workshop branding ${workshopId}`)