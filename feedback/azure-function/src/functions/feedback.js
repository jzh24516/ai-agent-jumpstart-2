import { app } from '@azure/functions'
import { TableClient } from '@azure/data-tables'

// Azure Table Storage is cheap, schemaless, and perfect for append-only feedback.
const CONNECTION = process.env.FEEDBACK_STORAGE_CONNECTION
const TABLE_NAME = process.env.FEEDBACK_TABLE_NAME || 'JumpStartFeedback'
// Lock this down to your published site origin. '*' is acceptable for anonymous public feedback.
const ALLOWED_ORIGIN = process.env.FEEDBACK_ALLOWED_ORIGIN || '*'

const corsHeaders = {
  'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

// Clamp incoming ratings to a safe 0–5 integer so bad input can't poison the table.
const clampRating = (value) => {
  const n = Number(value)
  return Number.isFinite(n) ? Math.min(5, Math.max(0, Math.round(n))) : 0
}

app.http('feedback', {
  methods: ['POST', 'OPTIONS'],
  authLevel: 'anonymous',
  route: 'feedback',
  handler: async (request, context) => {
    // CORS preflight from the browser.
    if (request.method === 'OPTIONS') return { status: 204, headers: corsHeaders }

    if (!CONNECTION) {
      context.error('FEEDBACK_STORAGE_CONNECTION is not configured')
      return { status: 500, headers: corsHeaders, jsonBody: { error: 'Not configured' } }
    }

    let body
    try {
      body = await request.json()
    } catch {
      return { status: 400, headers: corsHeaders, jsonBody: { error: 'Invalid JSON' } }
    }

    const entity = {
      // Partition by day for easy date-range queries; unique row key per submission.
      partitionKey: new Date().toISOString().slice(0, 10),
      rowKey: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      overall: clampRating(body.overall),
      effort: clampRating(body.effort),
      recommend: clampRating(body.recommend),
      comments: String(body.comments ?? '').slice(0, 4000),
      locale: String(body.locale ?? '').slice(0, 8),
      submittedAt: new Date(Number(body.at) || Date.now()).toISOString(),
      userAgent: String(request.headers.get('user-agent') || '').slice(0, 256),
    }

    try {
      const client = TableClient.fromConnectionString(CONNECTION, TABLE_NAME)
      await client.createTable().catch(() => { /* already exists */ })
      await client.createEntity(entity)
    } catch (err) {
      context.error('Failed to store feedback', err)
      return { status: 500, headers: corsHeaders, jsonBody: { error: 'Storage error' } }
    }

    return { status: 200, headers: corsHeaders, jsonBody: { ok: true } }
  },
})
