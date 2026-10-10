import assert from 'node:assert/strict'
import test from 'node:test'
import { createAccessHandler, parseAccessConfig } from '../src/access.js'
import { signWorkshopClaim } from '../src/survey.js'

const workshop = {
  workshopId: '10000000-0000-4000-8000-000000000001',
  customerName: 'Contoso',
  hostName: 'Microsoft',
  workshopStart: '2026-09-15',
  workshopEnd: '2026-09-16',
}
const accessConfig = JSON.stringify({
  workshop,
  attendees: ['first@example.com', 'second@example.com'],
  labUsers: [
    { userName: 'student01@example.com', accessCode: 'first-code' },
    { userName: 'student02@example.com', accessCode: 'second-code' },
  ],
})
const env = {
  SURVEY_ALLOWED_ORIGINS: 'https://jzh24516.github.io',
  SURVEY_WORKSHOP_SIGNING_SECRET: 'test-signing-secret',
  WORKSHOP_ACCESS_CONFIG: accessConfig,
}
const request = (body, method = 'POST', origin = 'https://jzh24516.github.io') => ({
  method,
  headers: new Headers({ origin }),
  text: async () => JSON.stringify(body),
})
const context = { error() {} }

test('returns the assigned lab user and a server-signed survey token', async () => {
  const handler = createAccessHandler({ env })
  const response = await handler(request({ email: 'SECOND@example.com', workshopId: workshop.workshopId }), context)
  assert.equal(response.status, 200)
  assert.deepEqual(response.jsonBody.labUser, {
    userName: 'student02@example.com',
    accessCode: 'second-code',
  })
  assert.equal(response.jsonBody.email, 'second@example.com')
  assert.equal(response.jsonBody.surveyToken, signWorkshopClaim({
    ...workshop,
    workshopKey: `workshop:${workshop.workshopId}`,
  }, env.SURVEY_WORKSHOP_SIGNING_SECRET))
})

test('rejects an email outside the private attendee list', async () => {
  const handler = createAccessHandler({ env })
  const response = await handler(request({ email: 'unknown@example.com', workshopId: workshop.workshopId }), context)
  assert.equal(response.status, 403)
  assert.equal(response.jsonBody.code, 'ACCESS_DENIED')
})

test('rejects a request for another workshop', async () => {
  const handler = createAccessHandler({ env })
  const response = await handler(request({
    email: 'first@example.com',
    workshopId: '20000000-0000-4000-8000-000000000002',
  }), context)
  assert.equal(response.status, 403)
  assert.equal(response.jsonBody.code, 'ACCESS_DENIED')
})

test('does not allow an untrusted browser origin', async () => {
  const handler = createAccessHandler({ env })
  const response = await handler(request(
    { email: 'first@example.com', workshopId: workshop.workshopId },
    'POST',
    'https://attacker.example',
  ), context)
  assert.equal(response.status, 403)
  assert.equal(response.headers['Access-Control-Allow-Origin'], undefined)
})

test('fails closed when private access configuration is invalid', async () => {
  assert.throws(() => parseAccessConfig('{}'))
  const handler = createAccessHandler({ env: { ...env, WORKSHOP_ACCESS_CONFIG: '{}' } })
  const response = await handler(request({ email: 'first@example.com', workshopId: workshop.workshopId }), context)
  assert.equal(response.status, 503)
  assert.equal(response.jsonBody.code, 'ACCESS_UNAVAILABLE')
})

test('rejects non-object JSON as an invalid request', async () => {
  const handler = createAccessHandler({ env })
  for (const body of [null, [], 'email']) {
    const response = await handler(request(body), context)
    assert.equal(response.status, 400)
    assert.equal(response.jsonBody.code, 'INVALID_ACCESS_REQUEST')
  }
})

test('returns no other attendees or credentials in an access grant', async () => {
  const handler = createAccessHandler({ env })
  const response = await handler(request({ email: 'first@example.com', workshopId: workshop.workshopId }), context)
  assert.deepEqual(Object.keys(response.jsonBody).sort(), ['email', 'labUser', 'ok', 'surveyToken'])
  assert.deepEqual(Object.keys(response.jsonBody.labUser).sort(), ['accessCode', 'userName'])
  assert.equal(JSON.stringify(response.jsonBody).includes('second@example.com'), false)
  assert.equal(JSON.stringify(response.jsonBody).includes('second-code'), false)
})

test('answers CORS preflight without needing private configuration', async () => {
  const handler = createAccessHandler({ env: { SURVEY_ALLOWED_ORIGINS: env.SURVEY_ALLOWED_ORIGINS } })
  const response = await handler(request({}, 'OPTIONS'), context)
  assert.equal(response.status, 204)
  assert.equal(response.headers['Access-Control-Allow-Origin'], 'https://jzh24516.github.io')
})

test('rejects oversized requests', async () => {
  const handler = createAccessHandler({ env })
  const response = await handler(request({ email: 'a'.repeat(4096), workshopId: workshop.workshopId }), context)
  assert.equal(response.status, 413)
})

test('rate limits access requests before returning credentials', async () => {
  const attempts = []
  const handler = createAccessHandler({
    env,
    rateLimiter: { consume: async (attempt) => { attempts.push(attempt); return false } },
  })
  const response = await handler(request({ email: 'first@example.com', workshopId: workshop.workshopId }), context)
  assert.equal(response.status, 429)
  assert.equal(response.jsonBody.code, 'ACCESS_RATE_LIMITED')
  assert.equal(response.headers['Retry-After'], '3600')
  assert.equal(response.jsonBody.labUser, undefined)
  assert.equal(attempts[0].clientAddress.startsWith('access:'), true)
})

test('fails closed if the access rate limiter is unavailable', async () => {
  const handler = createAccessHandler({
    env,
    rateLimiter: { consume: async () => { throw new Error('Storage unavailable') } },
  })
  const response = await handler(request({ email: 'first@example.com', workshopId: workshop.workshopId }), context)
  assert.equal(response.status, 503)
  assert.equal(response.jsonBody.labUser, undefined)
})
