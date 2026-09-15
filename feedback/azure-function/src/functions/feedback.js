import { app } from '@azure/functions'
import { createFeedbackHandler } from '../survey.js'
import { createAzureTableRateLimiter } from '../rateLimit.js'

const rateLimiter = createAzureTableRateLimiter(process.env)
const feedbackHandler = createFeedbackHandler({ env: process.env, rateLimiter })

app.http('feedback', {
  methods: ['POST', 'OPTIONS'],
  authLevel: 'anonymous',
  route: 'feedback',
  handler: feedbackHandler,
})

app.http('health', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'health',
  handler: async () => ({
    status: 200,
    jsonBody: {
      ok: true,
      flowConfigured: Boolean(process.env.SURVEY_FLOW_URL),
      signingConfigured: Boolean(process.env.SURVEY_WORKSHOP_SIGNING_SECRET),
      rateLimitConfigured: Boolean(process.env.SURVEY_RATE_LIMIT_TABLE_ENDPOINT && process.env.SURVEY_RATE_LIMIT_TABLE_NAME),
    },
  }),
})

app.timer('rateLimitCleanup', {
  schedule: '0 15 4 * * *',
  handler: async (_timer, context) => {
    const deleted = await rateLimiter.cleanup()
    context.log('Survey rate-limit cleanup completed.', { deleted })
  },
})
