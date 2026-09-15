import assert from 'node:assert/strict'
import test from 'node:test'
import { createFeedbackHandler, signWorkshopClaim } from '../src/survey.js'

const secret = 'test-signing-secret'
const claim = {
  workshopId: '10000000-0000-4000-8000-000000000001',
  workshopKey: 'workshop:10000000-0000-4000-8000-000000000001',
  customerName: 'Contoso',
  hostName: 'Microsoft',
  workshopStart: '2026-09-15',
  workshopEnd: '2026-09-15',
}
const validSurvey = {
  schemaVersion: 1,
  submissionId: '20000000-0000-4000-8000-000000000001',
  ...claim,
  surveyToken: signWorkshopClaim(claim, secret),
  attendeeEmail: 'person@example.com',
  emailConsent: true,
  locale: 'en',
  overall: 5,
  effort: 2,
  recommend: 5,
  comments: 'Useful workshop',
  completedSteps: 2,
  totalSteps: 2,
  labStatus: [{ labId: 'lab-01', completedSteps: 2, totalSteps: 2, completedStepIds: ['one', 'two'] }],
  sourcePageUrl: 'https://jzh24516.github.io/ai-agent-jumpstart-2/',
}
const env = {
  SURVEY_FLOW_URL: 'https://flow.example.test/callback',
  SURVEY_WORKSHOP_SIGNING_SECRET: secret,
  SURVEY_ALLOWED_ORIGINS: 'https://jzh24516.github.io',
  SURVEY_SOURCE_SITE_URL: 'https://jzh24516.github.io/ai-agent-jumpstart-2/',
  SURVEY_RETENTION_MONTHS: '24',
}

const request = (body, method = 'POST', origin = 'https://jzh24516.github.io') => ({
  method,
  headers: new Headers({ origin, 'user-agent': 'Survey unit test' }),
  text: async () => JSON.stringify(body),
})
const context = { log() {}, error() {} }

test('forwards a validated survey and enriches server-owned fields', async () => {
  const calls = []
  const handler = createFeedbackHandler({
    env,
    now: () => new Date('2026-09-15T12:00:00Z'),
    fetchImpl: async (url, options) => {
      calls.push({ url, payload: JSON.parse(options.body) })
      return new Response('{}', { status: 200 })
    },
  })
  const response = await handler(request(validSurvey), context)
  assert.equal(response.status, 200)
  assert.equal(calls.length, 1)
  assert.equal(calls[0].payload.submittedAt, '2026-09-15T12:00:00.000Z')
  assert.equal(calls[0].payload.retentionExpiresAt, '2028-09-15T12:00:00.000Z')
  assert.equal(calls[0].payload.completionPercent, 100)
  assert.equal(calls[0].payload.attendeeEmail, 'person@example.com')
  assert.equal(calls[0].payload.surveyToken, undefined)
})

test('removes attendee email when consent is not granted', async () => {
  let forwarded
  const handler = createFeedbackHandler({
    env,
    fetchImpl: async (_url, options) => {
      forwarded = JSON.parse(options.body)
      return new Response('{}', { status: 200 })
    },
  })
  const response = await handler(request({ ...validSurvey, emailConsent: false }), context)
  assert.equal(response.status, 200)
  assert.equal(forwarded.attendeeEmail, '')
  assert.equal(forwarded.emailConsent, false)
})

test('rejects an invalid workshop signature without calling the flow', async () => {
  let calls = 0
  const handler = createFeedbackHandler({ env, fetchImpl: async () => { calls += 1 } })
  const response = await handler(request({ ...validSurvey, surveyToken: 'invalid' }), context)
  assert.equal(response.status, 403)
  assert.equal(response.jsonBody.code, 'INVALID_WORKSHOP_TOKEN')
  assert.equal(calls, 0)
})

test('rejects an origin outside the allowlist', async () => {
  const handler = createFeedbackHandler({ env, fetchImpl: async () => new Response('{}') })
  const response = await handler(request(validSurvey, 'POST', 'https://attacker.example'), context)
  assert.equal(response.status, 403)
  assert.equal(response.headers['Access-Control-Allow-Origin'], undefined)
})

test('retries transient downstream failures', async () => {
  let calls = 0
  const handler = createFeedbackHandler({
    env,
    sleep: async () => {},
    fetchImpl: async () => {
      calls += 1
      return new Response('{}', { status: calls < 3 ? 503 : 200 })
    },
  })
  const response = await handler(request(validSurvey), context)
  assert.equal(response.status, 200)
  assert.equal(calls, 3)
})

test('returns a gateway error after retry exhaustion', async () => {
  const handler = createFeedbackHandler({
    env,
    sleep: async () => {},
    fetchImpl: async () => new Response('{}', { status: 503 }),
  })
  const response = await handler(request(validSurvey), context)
  assert.equal(response.status, 502)
  assert.equal(response.jsonBody.code, 'SURVEY_FORWARD_FAILED')
})

test('answers CORS preflight without forwarding', async () => {
  const handler = createFeedbackHandler({ env, fetchImpl: async () => { throw new Error('unexpected') } })
  const response = await handler(request({}, 'OPTIONS'), context)
  assert.equal(response.status, 204)
  assert.equal(response.headers['Access-Control-Allow-Origin'], 'https://jzh24516.github.io')
})

test('returns 429 before calling the flow when the durable limiter is exceeded', async () => {
  let flowCalls = 0
  const handler = createFeedbackHandler({
    env,
    rateLimiter: { consume: async () => false },
    fetchImpl: async () => { flowCalls += 1 },
  })
  const response = await handler(request(validSurvey), context)
  assert.equal(response.status, 429)
  assert.equal(response.jsonBody.code, 'SURVEY_RATE_LIMITED')
  assert.equal(response.headers['Retry-After'], '3600')
  assert.equal(flowCalls, 0)
})