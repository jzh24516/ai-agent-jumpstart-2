export type LabAccess = {
  userName: string
  accessCode: string
}

export type WorkshopAccessGrant = {
  email: string
  labUser: LabAccess
  surveyToken: string
}

type AccessConfig = {
  accessEndpoint: string
}

export class WorkshopAccessError extends Error {
  readonly code: 'denied' | 'unavailable'

  constructor(code: 'denied' | 'unavailable') {
    super(code)
    this.code = code
  }
}

let configPromise: Promise<AccessConfig> | undefined

const loadAccessConfig = async (): Promise<AccessConfig> => {
  if (import.meta.env.DEV) return { accessEndpoint: '/api/access' }
  configPromise ??= fetch(`${import.meta.env.BASE_URL}content/feedback.json`, { cache: 'no-store' })
    .then(async (response) => {
      if (!response.ok) throw new Error('Workshop access is not configured.')
      const config = await response.json() as Partial<AccessConfig>
      if (typeof config.accessEndpoint !== 'string' || !config.accessEndpoint.trim()) {
        throw new Error('Workshop access is unavailable.')
      }
      const endpoint = new URL(config.accessEndpoint)
      if (endpoint.protocol !== 'https:') throw new Error('Workshop access endpoint must use HTTPS.')
      return { accessEndpoint: endpoint.toString() }
    })
    .catch((error) => {
      configPromise = undefined
      throw error
    })
  return configPromise
}

export async function verifyWorkshopAccess(email: string, workshopId: string): Promise<WorkshopAccessGrant> {
  try {
    const { accessEndpoint } = await loadAccessConfig()
    const response = await fetch(accessEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, workshopId }),
    })
    if (response.status === 403) throw new WorkshopAccessError('denied')
    if (!response.ok) throw new WorkshopAccessError('unavailable')
    const value = await response.json() as Partial<WorkshopAccessGrant> & { ok?: boolean }
    if (
      value.ok !== true
      || typeof value.email !== 'string'
      || !value.labUser
      || typeof value.labUser.userName !== 'string'
      || typeof value.labUser.accessCode !== 'string'
      || typeof value.surveyToken !== 'string'
    ) {
      throw new WorkshopAccessError('unavailable')
    }
    return {
      email: value.email,
      labUser: value.labUser,
      surveyToken: value.surveyToken,
    }
  } catch (error) {
    if (error instanceof WorkshopAccessError) throw error
    throw new WorkshopAccessError('unavailable')
  }
}
