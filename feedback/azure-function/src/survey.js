import { createHmac, timingSafeEqual } from 'node:crypto'

const MAX_REQUEST_BYTES = 128 * 1024
const MAX_LAB_STATUS_BYTES = 100_000
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const LOCALES = new Set(['en', 'zh', 'zh-HK', 'zh-TW', 'ja', 'ko', 'th', 'hi', 'vi'])

class SurveyError extends Error {
  constructor(status, code, message) {
    super(message)
    this.status = status
    this.code = code
  }
}

const text = (value, field, maxLength, required = true) => {
  if (typeof value !== 'string') throw new SurveyError(400, 'INVALID_SURVEY', `${field} must be a string.`)
  const normalized = value.trim()
  if (required && !normalized) throw new SurveyError(400, 'INVALID_SURVEY', `${field} is required.`)
  if (normalized.length > maxLength) throw new SurveyError(400, 'INVALID_SURVEY', `${field} is too long.`)
  return normalized
}

const integer = (value, field, minimum, maximum) => {
  if (!Number.isInteger(value) || value < minimum || value > maximum) {
    throw new SurveyError(400, 'INVALID_SURVEY', `${field} must be an integer from ${minimum} to ${maximum}.`)
  }
  return value
}

const parseAllowedOrigins = (value = '') => value.split(',').map((origin) => origin.trim()).filter(Boolean)

const corsHeaders = (origin, allowedOrigins) => ({
  ...(origin && allowedOrigins.includes(origin) ? { 'Access-Control-Allow-Origin': origin } : {}),
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, X-Correlation-ID',
  'Cache-Control': 'no-store',
  Vary: 'Origin',
})

export const workshopClaim = (survey) => JSON.stringify([
  survey.workshopId,
  survey.workshopKey,
  survey.customerName,
  survey.hostName,
  survey.workshopStart,
  survey.workshopEnd,
])

export const signWorkshopClaim = (survey, secret) => createHmac('sha256', secret)
  .update(workshopClaim(survey))
  .digest('base64url')

const signaturesMatch = (actual, expected) => {
  const actualBuffer = Buffer.from(actual)
  const expectedBuffer = Buffer.from(expected)
  return actualBuffer.length === expectedBuffer.length && timingSafeEqual(actualBuffer, expectedBuffer)
}

const normalizeLabStatus = (value) => {
  if (!Array.isArray(value) || value.length > 100) {
    throw new SurveyError(400, 'INVALID_SURVEY', 'labStatus must be an array with at most 100 items.')
  }
  const normalized = value.map((lab) => {
    if (!lab || typeof lab !== 'object' || Array.isArray(lab)) {
      throw new SurveyError(400, 'INVALID_SURVEY', 'Each lab status must be an object.')
    }
    const labId = text(lab.labId, 'labStatus.labId', 100)
    const totalSteps = integer(lab.totalSteps, 'labStatus.totalSteps', 0, 10_000)
    const completedSteps = integer(lab.completedSteps, 'labStatus.completedSteps', 0, totalSteps)
    const completedStepIds = Array.isArray(lab.completedStepIds)
      ? lab.completedStepIds.map((stepId) => text(stepId, 'labStatus.completedStepIds', 100))
      : []
    if (completedStepIds.length > totalSteps) {
      throw new SurveyError(400, 'INVALID_SURVEY', 'Completed step IDs exceed total steps.')
    }
    return { labId, completedSteps, totalSteps, completedStepIds }
  })
  const serialized = JSON.stringify(normalized)
  if (Buffer.byteLength(serialized, 'utf8') > MAX_LAB_STATUS_BYTES) {
    throw new SurveyError(400, 'INVALID_SURVEY', 'labStatus is too large.')
  }
  return { normalized, serialized }
}

const addRetentionMonths = (date, months) => {
  const retained = new Date(date)
  retained.setUTCMonth(retained.getUTCMonth() + months)
  return retained.toISOString()
}

const safeSourcePageUrl = (value, allowedOrigins, fallback) => {
  try {
    const parsed = new URL(text(value, 'sourcePageUrl', 500, false) || fallback)
    return allowedOrigins.includes(parsed.origin) ? parsed.toString() : fallback
  } catch {
    return fallback
  }
}

export const normalizeSurvey = (body, options) => {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    throw new SurveyError(400, 'INVALID_SURVEY', 'Survey payload must be an object.')
  }
  const schemaVersion = integer(body.schemaVersion, 'schemaVersion', 1, 100)
  const submissionId = text(body.submissionId, 'submissionId', 36)
  const workshopId = text(body.workshopId, 'workshopId', 36)
  if (!UUID_PATTERN.test(submissionId) || !UUID_PATTERN.test(workshopId)) {
    throw new SurveyError(400, 'INVALID_SURVEY', 'submissionId and workshopId must be UUIDs.')
  }

  const workshopKey = text(body.workshopKey, 'workshopKey', 200)
  const customerName = text(body.customerName, 'customerName', 200)
  const hostName = text(body.hostName, 'hostName', 200)
  const workshopStart = text(body.workshopStart, 'workshopStart', 10, false)
  const workshopEnd = text(body.workshopEnd, 'workshopEnd', 10, false)
  if ((workshopStart && !DATE_PATTERN.test(workshopStart)) || (workshopEnd && !DATE_PATTERN.test(workshopEnd))) {
    throw new SurveyError(400, 'INVALID_SURVEY', 'Workshop dates must use YYYY-MM-DD.')
  }

  const claim = { workshopId, workshopKey, customerName, hostName, workshopStart, workshopEnd }
  const surveyToken = text(body.surveyToken, 'surveyToken', 256)
  const expectedToken = signWorkshopClaim(claim, options.signingSecret)
  if (!signaturesMatch(surveyToken, expectedToken)) {
    throw new SurveyError(403, 'INVALID_WORKSHOP_TOKEN', 'Workshop token is invalid.')
  }

  if (typeof body.emailConsent !== 'boolean') {
    throw new SurveyError(400, 'INVALID_SURVEY', 'emailConsent must be a boolean.')
  }
  const candidateEmail = text(body.attendeeEmail ?? '', 'attendeeEmail', 320, false).toLowerCase()
  if (body.emailConsent && !EMAIL_PATTERN.test(candidateEmail)) {
    throw new SurveyError(400, 'INVALID_SURVEY', 'A valid attendee email is required when consent is granted.')
  }

  const totalSteps = integer(body.totalSteps, 'totalSteps', 0, 10_000)
  const completedSteps = integer(body.completedSteps, 'completedSteps', 0, totalSteps)
  const completionPercent = totalSteps ? Math.round((completedSteps / totalSteps) * 100) : 0
  const { normalized: labStatus, serialized: labStatusJson } = normalizeLabStatus(body.labStatus)
  const labCompleted = labStatus.reduce((sum, lab) => sum + lab.completedSteps, 0)
  const labTotal = labStatus.reduce((sum, lab) => sum + lab.totalSteps, 0)
  if (labCompleted !== completedSteps || labTotal !== totalSteps) {
    throw new SurveyError(400, 'INVALID_SURVEY', 'Lab status totals do not match the survey totals.')
  }

  const locale = text(body.locale, 'locale', 10)
  if (!LOCALES.has(locale)) throw new SurveyError(400, 'INVALID_SURVEY', 'Locale is not supported.')
  const submittedAt = options.now().toISOString()

  return {
    schemaVersion,
    submissionId,
    workshopId,
    workshopKey,
    customerName,
    hostName,
    workshopStart,
    workshopEnd,
    sourceSiteUrl: options.sourceSiteUrl,
    attendeeEmail: body.emailConsent ? candidateEmail : '',
    emailConsent: body.emailConsent,
    submittedAt,
    retentionExpiresAt: addRetentionMonths(submittedAt, options.retentionMonths),
    locale,
    overall: integer(body.overall, 'overall', 0, 5),
    effort: integer(body.effort, 'effort', 0, 5),
    recommend: integer(body.recommend, 'recommend', 0, 5),
    comments: text(body.comments ?? '', 'comments', 10_000, false),
    completionPercent,
    completedSteps,
    totalSteps,
    labStatusJson,
    sourcePageUrl: safeSourcePageUrl(body.sourcePageUrl, options.allowedOrigins, options.sourceSiteUrl),
    userAgent: text(options.userAgent, 'userAgent', 500, false),
    processingVersion: 'gateway-v1',
  }
}

const forwardSurvey = async (payload, options) => {
  let lastError
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 20_000)
    try {
      const response = await options.fetchImpl(options.flowUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Correlation-ID': payload.submissionId },
        body: JSON.stringify(payload),
        signal: controller.signal,
      })
      if (response.ok) return
      lastError = new Error(`Power Automate returned ${response.status}.`)
      if (response.status < 500 && response.status !== 429) break
    } catch (error) {
      lastError = error
    } finally {
      clearTimeout(timeout)
    }
    if (attempt < 3) await options.sleep(attempt * 250)
  }
  throw lastError ?? new Error('Power Automate request failed.')
}

export const createFeedbackHandler = ({
  env,
  fetchImpl = fetch,
  now = () => new Date(),
  sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds)),
  rateLimiter = { consume: async () => true },
}) => async (request, context) => {
  const allowedOrigins = parseAllowedOrigins(env.SURVEY_ALLOWED_ORIGINS)
  const origin = request.headers.get('origin') ?? ''
  const headers = corsHeaders(origin, allowedOrigins)

  if (origin && !allowedOrigins.includes(origin)) {
    return { status: 403, headers, jsonBody: { ok: false, code: 'ORIGIN_NOT_ALLOWED' } }
  }
  if (request.method === 'OPTIONS') return { status: 204, headers }
  if (request.method !== 'POST') return { status: 405, headers, jsonBody: { ok: false, code: 'METHOD_NOT_ALLOWED' } }

  const flowUrl = env.SURVEY_FLOW_URL?.trim()
  const signingSecret = env.SURVEY_WORKSHOP_SIGNING_SECRET?.trim()
  const sourceSiteUrl = env.SURVEY_SOURCE_SITE_URL?.trim()
  if (!flowUrl || !signingSecret || !sourceSiteUrl) {
    context.error('Survey gateway configuration is incomplete.')
    return { status: 503, headers, jsonBody: { ok: false, code: 'SURVEY_UNAVAILABLE' } }
  }

  try {
    const rawBody = await request.text()
    if (Buffer.byteLength(rawBody, 'utf8') > MAX_REQUEST_BYTES) {
      throw new SurveyError(413, 'SURVEY_TOO_LARGE', 'Survey payload is too large.')
    }
    let body
    try {
      body = JSON.parse(rawBody)
    } catch {
      throw new SurveyError(400, 'INVALID_JSON', 'Survey payload is not valid JSON.')
    }
    const retentionMonths = Number.parseInt(env.SURVEY_RETENTION_MONTHS ?? '24', 10)
    const payload = normalizeSurvey(body, {
      signingSecret,
      sourceSiteUrl,
      allowedOrigins,
      retentionMonths: Number.isInteger(retentionMonths) && retentionMonths > 0 ? retentionMonths : 24,
      userAgent: request.headers.get('user-agent') ?? '',
      now,
    })
    const clientAddress = (request.headers.get('x-forwarded-for') ?? request.headers.get('x-azure-clientip') ?? 'unknown')
      .split(',')[0]
      .trim()
    try {
      if (!await rateLimiter.consume({ clientAddress, submissionId: payload.submissionId })) {
        return {
          status: 429,
          headers: { ...headers, 'Retry-After': '3600' },
          jsonBody: { ok: false, code: 'SURVEY_RATE_LIMITED' },
        }
      }
    } catch (error) {
      context.error('Survey rate limiter failed.', error)
      return { status: 503, headers, jsonBody: { ok: false, code: 'SURVEY_UNAVAILABLE' } }
    }
    await forwardSurvey(payload, { flowUrl, fetchImpl, sleep })
    context.log('Survey response stored.', { submissionId: payload.submissionId })
    return { status: 200, headers, jsonBody: { ok: true, submissionId: payload.submissionId } }
  } catch (error) {
    if (error instanceof SurveyError) {
      return { status: error.status, headers, jsonBody: { ok: false, code: error.code } }
    }
    context.error('Survey forwarding failed.', error)
    return { status: 502, headers, jsonBody: { ok: false, code: 'SURVEY_FORWARD_FAILED' } }
  }
}