import type { Locale } from './types'

export type FeedbackDashboardWorkshop = {
  name: string
  customerName: string
  customerLogo: string
  hostName: string
  workshopStart?: string
  workshopEnd?: string
  workshopId?: string
}

export type FeedbackLabStatus = {
  labId: string
  completedSteps: number
  totalSteps: number
  completedStepIds: string[]
}

export type WorkshopFeedbackRecord = {
  id: string
  submissionId: string
  submittedAt: string
  retentionExpiresAt: string
  locale: Locale
  overall: number
  effort: number
  recommend: number
  comments: string
  completionPercent: number
  completedSteps: number
  totalSteps: number
  emailConsent: boolean
  attendeeEmail: string
  labStatus: FeedbackLabStatus[]
}

export type WorkshopFeedbackPayload = {
  workshopId: string
  responses: WorkshopFeedbackRecord[]
}

export type CompletionBand = 'complete' | 'high' | 'medium' | 'low'

export type FeedbackFilters = {
  overall?: number | 'positive'
  effort?: number | 'easy'
  recommend?: number | 'positive'
  completion?: CompletionBand
  locale?: Locale
  comments?: boolean
  emailConsent?: boolean
  completedLabId?: string
  query?: string
}

export type FeedbackSummary = {
  responses: number
  averageOverall: number
  averageEffort: number
  averageRecommend: number
  recommendationRate: number
  averageCompletion: number
  commentRate: number
}

const supportedLocales = new Set<Locale>(['en', 'zh', 'zh-HK', 'zh-TW', 'ja', 'ko', 'th', 'hi', 'vi'])
const isRecord = (value: unknown): value is Record<string, unknown> => Boolean(value) && typeof value === 'object' && !Array.isArray(value)
const textValue = (value: unknown, maxLength: number) => typeof value === 'string' ? value.trim().slice(0, maxLength) : ''
const numberValue = (value: unknown, minimum: number, maximum: number) => {
  const parsed = typeof value === 'number' ? value : Number(value)
  return Number.isFinite(parsed) ? Math.min(maximum, Math.max(minimum, Math.round(parsed))) : minimum
}

const parseLabStatus = (value: unknown): FeedbackLabStatus[] => {
  if (!Array.isArray(value)) return []
  return value.flatMap((item) => {
    if (!isRecord(item)) return []
    const labId = textValue(item.labId, 100)
    if (!labId) return []
    const totalSteps = numberValue(item.totalSteps, 0, 10_000)
    const completedSteps = numberValue(item.completedSteps, 0, totalSteps)
    const completedStepIds = Array.isArray(item.completedStepIds)
      ? item.completedStepIds.map((stepId) => textValue(stepId, 100)).filter(Boolean).slice(0, totalSteps)
      : []
    return [{ labId, completedSteps, totalSteps, completedStepIds }]
  })
}

const parseFeedbackRecord = (value: unknown): WorkshopFeedbackRecord | null => {
  if (!isRecord(value)) return null
  const submissionId = textValue(value.submissionId, 100)
  const locale = textValue(value.locale, 10) as Locale
  if (!submissionId || !supportedLocales.has(locale)) return null
  const emailConsent = value.emailConsent === true
  return {
    id: textValue(value.id, 36),
    submissionId,
    submittedAt: textValue(value.submittedAt, 64),
    retentionExpiresAt: textValue(value.retentionExpiresAt, 64),
    locale,
    overall: numberValue(value.overall, 0, 5),
    effort: numberValue(value.effort, 0, 5),
    recommend: numberValue(value.recommend, 0, 5),
    comments: textValue(value.comments, 10_000),
    completionPercent: numberValue(value.completionPercent, 0, 100),
    completedSteps: numberValue(value.completedSteps, 0, 10_000),
    totalSteps: numberValue(value.totalSteps, 0, 10_000),
    emailConsent,
    attendeeEmail: emailConsent ? textValue(value.attendeeEmail, 320) : '',
    labStatus: parseLabStatus(value.labStatus),
  }
}

export const parseWorkshopFeedback = (value: unknown): WorkshopFeedbackPayload => {
  if (!isRecord(value)) throw new Error('Invalid workshop feedback response.')
  const workshopId = textValue(value.workshopId, 36)
  if (!workshopId || !Array.isArray(value.responses)) throw new Error('Invalid workshop feedback response.')
  return { workshopId, responses: value.responses.map(parseFeedbackRecord).filter((item): item is WorkshopFeedbackRecord => item !== null) }
}

export const loadWorkshopFeedback = async (workshopId: string): Promise<WorkshopFeedbackPayload> => {
  const response = await fetch(`/api/workshop-feedback?workshopId=${encodeURIComponent(workshopId)}`, { cache: 'no-store' })
  if (!response.ok) {
    const error = new Error(await response.text() || `Feedback query failed (${response.status}).`)
    if (response.status === 401 || response.status === 503) error.name = 'AuthRequired'
    throw error
  }
  return parseWorkshopFeedback(await response.json())
}

const average = (records: WorkshopFeedbackRecord[], selector: (record: WorkshopFeedbackRecord) => number) =>
  records.length ? records.reduce((sum, record) => sum + selector(record), 0) / records.length : 0

export const summarizeFeedback = (records: WorkshopFeedbackRecord[]): FeedbackSummary => ({
  responses: records.length,
  averageOverall: average(records, (record) => record.overall),
  averageEffort: average(records, (record) => record.effort),
  averageRecommend: average(records, (record) => record.recommend),
  recommendationRate: records.length ? records.filter((record) => record.recommend >= 4).length / records.length * 100 : 0,
  averageCompletion: average(records, (record) => record.completionPercent),
  commentRate: records.length ? records.filter((record) => Boolean(record.comments)).length / records.length * 100 : 0,
})

export const completionBand = (value: number): CompletionBand => {
  if (value >= 100) return 'complete'
  if (value >= 75) return 'high'
  if (value >= 50) return 'medium'
  return 'low'
}

export const filterFeedback = (records: WorkshopFeedbackRecord[], filters: FeedbackFilters): WorkshopFeedbackRecord[] => {
  const query = filters.query?.trim().toLocaleLowerCase() ?? ''
  return records.filter((record) => {
    if (filters.overall === 'positive' ? record.overall < 4 : filters.overall !== undefined && record.overall !== filters.overall) return false
    if (filters.effort === 'easy' ? record.effort > 2 : filters.effort !== undefined && record.effort !== filters.effort) return false
    if (filters.recommend === 'positive' ? record.recommend < 4 : filters.recommend !== undefined && record.recommend !== filters.recommend) return false
    if (filters.completion && completionBand(record.completionPercent) !== filters.completion) return false
    if (filters.locale && record.locale !== filters.locale) return false
    if (filters.comments !== undefined && Boolean(record.comments) !== filters.comments) return false
    if (filters.emailConsent !== undefined && record.emailConsent !== filters.emailConsent) return false
    if (filters.completedLabId && !record.labStatus.some((lab) => lab.labId === filters.completedLabId && lab.totalSteps > 0 && lab.completedSteps === lab.totalSteps)) return false
    if (query) {
      const haystack = [record.submissionId, record.attendeeEmail, record.comments, record.locale].join(' ').toLocaleLowerCase()
      if (!haystack.includes(query)) return false
    }
    return true
  })
}

export const countBy = <T extends string | number>(records: WorkshopFeedbackRecord[], selector: (record: WorkshopFeedbackRecord) => T) => {
  const counts = new Map<T, number>()
  records.forEach((record) => {
    const key = selector(record)
    counts.set(key, (counts.get(key) ?? 0) + 1)
  })
  return counts
}

export const labCompletionStats = (records: WorkshopFeedbackRecord[]) => {
  const stats = new Map<string, { labId: string; completed: number; responses: number; averagePercent: number; percentTotal: number }>()
  records.forEach((record) => record.labStatus.forEach((lab) => {
    const current = stats.get(lab.labId) ?? { labId: lab.labId, completed: 0, responses: 0, averagePercent: 0, percentTotal: 0 }
    current.responses += 1
    if (lab.totalSteps > 0 && lab.completedSteps === lab.totalSteps) current.completed += 1
    current.percentTotal += lab.totalSteps ? lab.completedSteps / lab.totalSteps * 100 : 0
    current.averagePercent = current.percentTotal / current.responses
    stats.set(lab.labId, current)
  }))
  return [...stats.values()].sort((left, right) => left.labId.localeCompare(right.labId))
}
