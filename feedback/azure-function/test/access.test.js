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
