import type { Locale } from './types'

type FeedbackConfig = {
  enabled: boolean
  endpoint: string
}

export type SurveyLabStatus = {
  labId: string
  completedSteps: number
  totalSteps: number
  completedStepIds: string[]
}

export type SurveySubmission = {
  schemaVersion: 1
  submissionId: string
  workshopId: string
  workshopKey: string
  customerName: string
  hostName: string
  workshopStart: string
  workshopEnd: string
  surveyToken: string
  attendeeEmail: string
  emailConsent: boolean
  locale: Locale
  overall: number
  effort: number
  recommend: number
  comments: string
  completedSteps: number
  totalSteps: number
  labStatus: SurveyLabStatus[]
  sourcePageUrl: string
}

let configPromise: Promise<FeedbackConfig> | undefined

const loadFeedbackConfig = async (): Promise<FeedbackConfig> => {
  configPromise ??= fetch(`${import.meta.env.BASE_URL}content/feedback.json`, { cache: 'no-store' })
    .then(async (response) => {
      if (!response.ok) throw new Error('Survey collection is not configured.')
      const config = await response.json() as Partial<FeedbackConfig>
      if (config.enabled !== true || typeof config.endpoint !== 'string' || !config.endpoint.trim()) {
        throw new Error('Survey collection is unavailable.')
      }
      const endpoint = new URL(config.endpoint)
      if (endpoint.protocol !== 'https:' && endpoint.hostname !== 'localhost' && endpoint.hostname !== '127.0.0.1') {
        throw new Error('Survey endpoint must use HTTPS.')
      }
      return { enabled: true, endpoint: endpoint.toString() }
    })
    .catch((error) => {
      configPromise = undefined
      throw error
    })
  return configPromise
}

export const newSurveySubmissionId = (): string => {
  if (!crypto.randomUUID) throw new Error('This browser cannot create a secure survey identifier.')
  return crypto.randomUUID()
}

export async function submitWorkshopSurvey(submission: SurveySubmission): Promise<void> {
  const { endpoint } = await loadFeedbackConfig()
  const controller = new AbortController()
  const timeout = window.setTimeout(() => controller.abort(), 30_000)
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(submission),
      signal: controller.signal,
    })
    if (!response.ok) throw new Error(`Survey submission failed (${response.status}).`)
    const result = await response.json() as { ok?: boolean; submissionId?: string }
    if (result.ok !== true || result.submissionId !== submission.submissionId) {
      throw new Error('Survey gateway returned an invalid acknowledgement.')
    }
  } finally {
    window.clearTimeout(timeout)
  }
}