import { createHmac } from 'node:crypto'
import { readFile } from 'node:fs/promises'

const endpoint = 'https://azfnuhqsqqzypov3s.azurewebsites.net/api/feedback'
const origin = 'https://jzh24516.github.io'
const workshopId = '30000000-0000-4000-8000-000000000001'
const submissionId = '40000000-0000-4000-8000-000000000001'
const invalidTokenTest = process.argv.includes('--invalid-token')

const envText = await readFile(new URL('../.env', import.meta.url), 'utf8')
const signingLine = envText.split(/\r?\n/).find((line) => line.startsWith('SURVEY_WORKSHOP_SIGNING_SECRET='))
const signingSecret = signingLine?.slice(signingLine.indexOf('=') + 1).trim()
if (!signingSecret) throw new Error('SURVEY_WORKSHOP_SIGNING_SECRET is missing from .env')

const claim = {
  workshopId,
  workshopKey: `workshop:${workshopId}`,
  customerName: 'Gateway E2E Test Customer',
  hostName: 'Microsoft',
  workshopStart: '2026-09-15',
  workshopEnd: '2026-09-15',
}
const signedSurveyToken = createHmac('sha256', signingSecret)
  .update(JSON.stringify([
    claim.workshopId,
    claim.workshopKey,
    claim.customerName,
    claim.hostName,
    claim.workshopStart,
    claim.workshopEnd,
  ]))
  .digest('base64url')

const response = await fetch(endpoint, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Origin: origin,
  },
  body: JSON.stringify({
    schemaVersion: 1,
    submissionId,
    ...claim,
    surveyToken: invalidTokenTest ? 'invalid' : signedSurveyToken,
    attendeeEmail: 'gateway-e2e@example.invalid',
    emailConsent: false,
    locale: 'en',
    overall: 5,
    effort: 2,
    recommend: 5,
    comments: 'Gateway end-to-end smoke test',
    completedSteps: 2,
    totalSteps: 2,
    labStatus: [
      {
        labId: 'lab-01',
        completedSteps: 2,
        totalSteps: 2,
        completedStepIds: ['step-01', 'step-02'],
      },
    ],
    sourcePageUrl: 'https://jzh24516.github.io/ai-agent-jumpstart-2/',
  }),
})

const result = await response.json().catch(() => ({}))
if (invalidTokenTest) {
  if (response.status !== 403 || result.code !== 'INVALID_WORKSHOP_TOKEN') {
    throw new Error(`Invalid-token test expected HTTP 403, received ${response.status}`)
  }
  console.log('PASS: gateway rejected an invalid workshop token')
} else {
  if (!response.ok || result.ok !== true || result.submissionId !== submissionId) {
    throw new Error(`Gateway smoke test failed with HTTP ${response.status}`)
  }
  console.log(`PASS: gateway accepted survey ${submissionId}`)
}
