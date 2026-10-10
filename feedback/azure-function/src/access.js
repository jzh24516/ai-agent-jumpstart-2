import { signWorkshopClaim } from './survey.js'
import { randomUUID } from 'node:crypto'

const MAX_REQUEST_BYTES = 4 * 1024
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

const parseAllowedOrigins = (value = '') => value.split(',').map((origin) => origin.trim()).filter(Boolean)

const corsHeaders = (origin, allowedOrigins) => ({
  ...(origin && allowedOrigins.includes(origin) ? { 'Access-Control-Allow-Origin': origin } : {}),
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Cache-Control': 'no-store',
  Vary: 'Origin',
})

const requiredText = (value, field, maximum) => {
  if (typeof value !== 'string' || !value.trim() || value.trim().length > maximum) {
    throw new Error(`${field} is invalid.`)
  }
  return value.trim()
}

export const parseAccessConfig = (raw) => {
  const value = JSON.parse(raw)
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Access configuration must be an object.')
  const workshop = value.workshop
  if (!workshop || typeof workshop !== 'object' || Array.isArray(workshop)) throw new Error('Access configuration needs a workshop.')
  const workshopId = requiredText(workshop.workshopId, 'workshopId', 36)
  if (!UUID_PATTERN.test(workshopId)) throw new Error('workshopId must be a UUID.')
  const normalizedWorkshop = {
    workshopId,
    workshopKey: `workshop:${workshopId}`,
    customerName: requiredText(workshop.customerName, 'customerName', 200),
    hostName: requiredText(workshop.hostName, 'hostName', 200),
    workshopStart: typeof workshop.workshopStart === 'string' ? workshop.workshopStart.trim() : '',
    workshopEnd: typeof workshop.workshopEnd === 'string' ? workshop.workshopEnd.trim() : '',
  }
  if (!Array.isArray(value.attendees) || !value.attendees.length) throw new Error('Access configuration needs attendees.')
  const attendees = [...new Set(value.attendees.map((email) => requiredText(email, 'attendee', 320).toLowerCase()))]
  if (attendees.some((email) => !EMAIL_PATTERN.test(email))) throw new Error('Access configuration contains an invalid attendee email.')
  if (!Array.isArray(value.labUsers) || !value.labUsers.length) throw new Error('Access configuration needs lab users.')
  const labUsers = value.labUsers.map((labUser) => {
    if (!labUser || typeof labUser !== 'object' || Array.isArray(labUser)) throw new Error('Lab user is invalid.')
    return {
      userName: requiredText(labUser.userName, 'lab user name', 320),
      accessCode: requiredText(labUser.accessCode, 'lab access code', 256),
    }
  })
  return { workshop: normalizedWorkshop, attendees, labUsers }
}

export const createAccessHandler = ({ env, rateLimiter = { consume: async () => true } }) => async (request, context) => {
  const allowedOrigins = parseAllowedOrigins(env.SURVEY_ALLOWED_ORIGINS)
  const origin = request.headers.get('origin') ?? ''
  const headers = corsHeaders(origin, allowedOrigins)
  if (origin && !allowedOrigins.includes(origin)) {
    return { status: 403, headers, jsonBody: { ok: false, code: 'ORIGIN_NOT_ALLOWED' } }
  }
  if (request.method === 'OPTIONS') return { status: 204, headers }
  if (request.method !== 'POST') return { status: 405, headers, jsonBody: { ok: false, code: 'METHOD_NOT_ALLOWED' } }

  const signingSecret = env.SURVEY_WORKSHOP_SIGNING_SECRET?.trim()
  const rawConfig = env.WORKSHOP_ACCESS_CONFIG?.trim()
  if (!signingSecret || !rawConfig) {
    context.error('Workshop access configuration is incomplete.')
    return { status: 503, headers, jsonBody: { ok: false, code: 'ACCESS_UNAVAILABLE' } }
  }

  try {
    const rawBody = await request.text()
    if (Buffer.byteLength(rawBody, 'utf8') > MAX_REQUEST_BYTES) {
      return { status: 413, headers, jsonBody: { ok: false, code: 'ACCESS_REQUEST_TOO_LARGE' } }
    }
    let body
    try {
      body = JSON.parse(rawBody)
    } catch {
      return { status: 400, headers, jsonBody: { ok: false, code: 'INVALID_JSON' } }
    }
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return { status: 400, headers, jsonBody: { ok: false, code: 'INVALID_ACCESS_REQUEST' } }
    }
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
    const workshopId = typeof body.workshopId === 'string' ? body.workshopId.trim() : ''
    if (email.length > 320 || !EMAIL_PATTERN.test(email) || !UUID_PATTERN.test(workshopId)) {
      return { status: 400, headers, jsonBody: { ok: false, code: 'INVALID_ACCESS_REQUEST' } }
    }
    const clientAddress = (request.headers.get('x-forwarded-for') ?? request.headers.get('x-azure-clientip') ?? 'unknown')
      .split(',')[0]
      .trim()
    if (!await rateLimiter.consume({ clientAddress: `access:${clientAddress}`, submissionId: randomUUID() })) {
      return {
        status: 429,
        headers: { ...headers, 'Retry-After': '3600' },
        jsonBody: { ok: false, code: 'ACCESS_RATE_LIMITED' },
      }
    }
    const config = parseAccessConfig(rawConfig)
    const attendeeIndex = config.attendees.indexOf(email)
    if (workshopId !== config.workshop.workshopId || attendeeIndex < 0) {
      return { status: 403, headers, jsonBody: { ok: false, code: 'ACCESS_DENIED' } }
    }
    const labUser = config.labUsers[attendeeIndex % config.labUsers.length]
    return {
      status: 200,
      headers,
      jsonBody: {
        ok: true,
        email,
        labUser,
        surveyToken: signWorkshopClaim(config.workshop, signingSecret),
      },
    }
  } catch (error) {
    context.error('Workshop access verification failed.', error)
    return { status: 503, headers, jsonBody: { ok: false, code: 'ACCESS_UNAVAILABLE' } }
  }
}
