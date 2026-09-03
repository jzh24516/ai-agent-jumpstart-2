import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { execFile } from 'node:child_process'
import { createHmac, scryptSync, timingSafeEqual } from 'node:crypto'
import { copyFile, mkdir, readFile, rename, stat, unlink, writeFile } from 'node:fs/promises'
import { homedir } from 'node:os'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import type { IncomingMessage, ServerResponse } from 'node:http'

const rootDir = dirname(fileURLToPath(import.meta.url))
const contentFile = resolve(rootDir, 'public/content/labs.json')
const brandingFile = resolve(rootDir, 'public/content/branding.json')
const localDataRoot = process.env.LOCALAPPDATA || resolve(homedir(), '.local', 'share')
const workshopHistoryFile = resolve(localDataRoot, 'Agent JumpStart 2', 'workshop-history.json')
const workshopHistoryBackupFile = `${workshopHistoryFile}.bak`
const legacyWorkshopHistoryFile = resolve(rootDir, '.data/workshop-history.json')
const MAX_REQUEST_BYTES = 25_000_000

class PayloadTooLargeError extends Error {}

const readBody = (req: IncomingMessage) =>
  new Promise<string>((res, rej) => {
    const chunks: Buffer[] = []
    let receivedBytes = 0
    let settled = false
    req.on('data', (chunk) => {
      if (settled) return
      const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)
      receivedBytes += buffer.length
      if (receivedBytes > MAX_REQUEST_BYTES) {
        settled = true
        rej(new PayloadTooLargeError('Request body exceeds the 25 MB limit.'))
        return
      }
      chunks.push(buffer)
    })
    req.on('end', () => { if (!settled) res(Buffer.concat(chunks).toString('utf8')) })
    req.on('error', (error) => { if (!settled) rej(error) })
  })

const run = (command: string, args: string[]) =>
  new Promise<string>((res) => {
    execFile(command, args, { cwd: rootDir }, (error, stdout, stderr) => {
      res([stdout, stderr, error ? `exit: ${error.message}` : ''].filter(Boolean).join('\n').trim())
    })
  })

const runGit = (args: string[]) =>
  new Promise<string>((res, rej) => {
    execFile('git', args, { cwd: rootDir, maxBuffer: 10_000_000 }, (error, stdout) => {
      if (error) rej(error)
      else res(stdout)
    })
  })

const json = (res: ServerResponse, status: number, body: string) => {
  res.statusCode = status
  res.setHeader('Content-Type', 'text/plain; charset=utf-8')
  res.setHeader('Cache-Control', 'no-store')
  res.end(body)
}

const jsonData = (res: ServerResponse, status: number, value: unknown) => {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.setHeader('Cache-Control', 'no-store')
  res.end(JSON.stringify(value))
}

type StoredContact = { name: string; email: string }
type StoredLabUser = { userName: string; accessCode: string }

type StoredWorkshop = {
  id: string
  name: string
  hostName: string
  hostLogo: string
  customerName: string
  customerLogo: string
  preparedBy?: string
  preparedDate?: string
  workshopStart?: string
  workshopEnd?: string
  contacts?: StoredContact[]
  attendees?: string[]
  labUsers?: StoredLabUser[]
  savedAt: number
}

type StoredWorkshopDeletion = {
  id: string
  name: string
  deletedAt: number
}

type StoredWorkshopState = {
  version: 1
  workshops: StoredWorkshop[]
  deletions: StoredWorkshopDeletion[]
}

type WorkshopMutation =
  | { action: 'upsert'; workshop: StoredWorkshop }
  | { action: 'clone'; workshop: StoredWorkshop }
  | { action: 'delete'; id: string }
  | { action: 'import'; workshops: StoredWorkshop[] }

class WorkshopConflictError extends Error {}

const normalizeWorkshopName = (value: string) => value.normalize('NFKC').trim().replace(/\s+/gu, ' ')
const canonicalWorkshopName = (value: string) => normalizeWorkshopName(value).toLowerCase()

const isStringRecord = (value: unknown, keys: string[]): value is Record<string, string> => {
  if (!value || typeof value !== 'object') return false
  const item = value as Record<string, unknown>
  return keys.every((key) => typeof item[key] === 'string')
}

const isStoredWorkshop = (value: unknown): value is StoredWorkshop => {
  if (!value || typeof value !== 'object') return false
  const item = value as Record<string, unknown>
  return typeof item.id === 'string'
    && item.id.trim().length > 0
    && typeof item.name === 'string'
    && item.name.trim().length > 0
    && normalizeWorkshopName(item.name).length <= 120
    && typeof item.hostName === 'string'
    && typeof item.hostLogo === 'string'
    && typeof item.customerName === 'string'
    && typeof item.customerLogo === 'string'
    && typeof item.savedAt === 'number'
    && Number.isFinite(item.savedAt)
    && (item.preparedBy === undefined || typeof item.preparedBy === 'string')
    && (item.preparedDate === undefined || typeof item.preparedDate === 'string')
    && (item.workshopStart === undefined || typeof item.workshopStart === 'string')
    && (item.workshopEnd === undefined || typeof item.workshopEnd === 'string')
    && (item.contacts === undefined || (Array.isArray(item.contacts) && item.contacts.every((contact) => isStringRecord(contact, ['name', 'email']))))
    && (item.attendees === undefined || (Array.isArray(item.attendees) && item.attendees.every((email) => typeof email === 'string')))
    && (item.labUsers === undefined || (Array.isArray(item.labUsers) && item.labUsers.every((labUser) => isStringRecord(labUser, ['userName', 'accessCode']))))
}

const parseWorkshopHistory = (value: unknown): StoredWorkshop[] => {
  if (!Array.isArray(value) || !value.every(isStoredWorkshop)) throw new Error('Workshop history must be an array of valid workshop records.')
  return value
}

const isStoredWorkshopDeletion = (value: unknown): value is StoredWorkshopDeletion => {
  if (!value || typeof value !== 'object') return false
  const item = value as Record<string, unknown>
  return typeof item.id === 'string'
    && item.id.trim().length > 0
    && typeof item.name === 'string'
    && item.name.trim().length > 0
    && typeof item.deletedAt === 'number'
    && Number.isFinite(item.deletedAt)
}

const parseWorkshopState = (value: unknown): StoredWorkshopState => {
  if (Array.isArray(value)) return { version: 1, workshops: parseWorkshopHistory(value), deletions: [] }
  if (!value || typeof value !== 'object') throw new Error('Workshop history state must be an object.')
  const item = value as Record<string, unknown>
  if (item.version !== 1 || !Array.isArray(item.deletions) || !item.deletions.every(isStoredWorkshopDeletion)) {
    throw new Error('Workshop history state is invalid.')
  }
  return { version: 1, workshops: parseWorkshopHistory(item.workshops), deletions: item.deletions }
}

const parseWorkshopMutation = (value: unknown): WorkshopMutation => {
  if (!value || typeof value !== 'object') throw new Error('Workshop mutation must be an object.')
  const item = value as Record<string, unknown>
  if (item.action === 'upsert' && isStoredWorkshop(item.workshop)) return { action: 'upsert', workshop: item.workshop }
  if (item.action === 'clone' && isStoredWorkshop(item.workshop)) return { action: 'clone', workshop: item.workshop }
  if (item.action === 'delete' && typeof item.id === 'string') return { action: 'delete', id: item.id }
  if (item.action === 'import') return { action: 'import', workshops: parseWorkshopHistory(item.workshops) }
  throw new Error('Workshop mutation is invalid.')
}

const saveWorkshopHistory = async (state: StoredWorkshopState) => {
  await mkdir(dirname(workshopHistoryFile), { recursive: true })
  const temporaryFile = `${workshopHistoryFile}.${process.pid}.${Date.now()}.tmp`
  const temporaryBackupFile = `${workshopHistoryBackupFile}.${process.pid}.${Date.now()}.tmp`
  try {
    await writeFile(temporaryFile, JSON.stringify(state, null, 2), 'utf8')
    await rename(temporaryFile, workshopHistoryFile)
    try {
      await copyFile(workshopHistoryFile, temporaryBackupFile)
      await unlink(workshopHistoryBackupFile).catch(() => {})
      await rename(temporaryBackupFile, workshopHistoryBackupFile)
    } catch (error) {
      console.warn('Workshop history was saved, but its backup could not be refreshed.', error)
    }
  } finally {
    await unlink(temporaryFile).catch(() => {})
    await unlink(temporaryBackupFile).catch(() => {})
  }
}

const workshopFromBranding = (branding: Record<string, unknown>, id: string, savedAt: number): StoredWorkshop | null => {
  const hostName = typeof branding.hostName === 'string' ? branding.hostName : ''
  const customerName = typeof branding.customerName === 'string' ? branding.customerName : ''
  const name = customerName.trim() || hostName.trim() || 'Untitled workshop'
  const record: StoredWorkshop = {
    id,
    name,
    hostName,
    hostLogo: typeof branding.hostLogo === 'string' ? branding.hostLogo : '',
    customerName,
    customerLogo: typeof branding.customerLogo === 'string' ? branding.customerLogo : '',
    preparedBy: typeof branding.preparedBy === 'string' ? branding.preparedBy : undefined,
    preparedDate: typeof branding.preparedDate === 'string' ? branding.preparedDate : undefined,
    workshopStart: typeof branding.workshopStart === 'string' ? branding.workshopStart : undefined,
    workshopEnd: typeof branding.workshopEnd === 'string' ? branding.workshopEnd : undefined,
    contacts: Array.isArray(branding.contacts) ? branding.contacts : [],
    attendees: Array.isArray(branding.attendees) ? branding.attendees.filter((email): email is string => typeof email === 'string') : [],
    labUsers: Array.isArray(branding.labUsers) ? branding.labUsers : [],
    savedAt,
  }
  return isStoredWorkshop(record) ? record : null
}

const recoverWorkshopHistory = async (): Promise<StoredWorkshopState> => {
  const log = await runGit(['log', '--format=%H%x09%ct', '--', 'public/content/branding.json'])
  const recovered: StoredWorkshop[] = []
  const names = new Set<string>()

  try {
    const currentBranding = JSON.parse(await readFile(brandingFile, 'utf8')) as Record<string, unknown>
    const current = workshopFromBranding(currentBranding, 'current-branding', (await stat(brandingFile)).mtimeMs)
    if (current) {
      recovered.push(current)
      names.add(canonicalWorkshopName(current.name))
    }
  } catch {
    // Historical revisions remain available if the active file is missing or invalid.
  }

  for (const line of log.trim().split(/\r?\n/).filter(Boolean)) {
    const [hash, timestamp] = line.split('\t')
    try {
      const branding = JSON.parse(await runGit(['show', `${hash}:public/content/branding.json`])) as Record<string, unknown>
      const record = workshopFromBranding(branding, `git-${hash.slice(0, 12)}`, Number(timestamp) * 1000)
      if (!record) continue
      const normalizedName = canonicalWorkshopName(record.name)
      if (names.has(normalizedName)) continue
      recovered.push(record)
      names.add(normalizedName)
    } catch {
      // Skip malformed historical revisions while preserving every valid record.
    }
  }

  const state: StoredWorkshopState = { version: 1, workshops: recovered, deletions: [] }
  await saveWorkshopHistory(state)
  return state
}

const loadWorkshopHistory = async (): Promise<StoredWorkshopState> => {
  try {
    return parseWorkshopState(JSON.parse(await readFile(workshopHistoryFile, 'utf8')))
  } catch (primaryError) {
    try {
      const backup = parseWorkshopState(JSON.parse(await readFile(workshopHistoryBackupFile, 'utf8')))
      await saveWorkshopHistory(backup)
      return backup
    } catch {
      if ((primaryError as NodeJS.ErrnoException).code !== 'ENOENT') {
        await rename(workshopHistoryFile, `${workshopHistoryFile}.corrupt-${Date.now()}`).catch(() => {})
      }
    }

    try {
      const legacy = parseWorkshopState(JSON.parse(await readFile(legacyWorkshopHistoryFile, 'utf8')))
      await saveWorkshopHistory(legacy)
      await unlink(legacyWorkshopHistoryFile).catch(() => {})
      return legacy
    } catch (legacyError) {
      if ((legacyError as NodeJS.ErrnoException).code !== 'ENOENT') {
        await rename(legacyWorkshopHistoryFile, `${legacyWorkshopHistoryFile}.corrupt-${Date.now()}`).catch(() => {})
      }
    }

    return recoverWorkshopHistory()
  }
}

let workshopOperationQueue: Promise<void> = Promise.resolve()

const readWorkshopHistory = async () => {
  const operation = workshopOperationQueue.then(() => loadWorkshopHistory())
  workshopOperationQueue = operation.then(() => {}, () => {})
  return operation.then((state) => state.workshops)
}

const mutateWorkshopHistory = (mutation: WorkshopMutation): Promise<StoredWorkshop[]> => {
  const operation = workshopOperationQueue.then(async () => {
    const current = await loadWorkshopHistory()
    let workshops = current.workshops
    let deletions = current.deletions

    if (mutation.action === 'delete') {
      const deleted = workshops.find((workshop) => workshop.id === mutation.id)
      if (deleted) {
        const key = canonicalWorkshopName(deleted.name)
        workshops = workshops.filter((workshop) => workshop.id !== mutation.id)
        deletions = [
          ...deletions.filter((item) => item.id !== deleted.id && canonicalWorkshopName(item.name) !== key),
          { id: deleted.id, name: deleted.name, deletedAt: Date.now() },
        ]
      }
    } else if (mutation.action === 'clone') {
      const workshop = mutation.workshop
      const key = canonicalWorkshopName(workshop.name)
      if (workshops.some((item) => item.id === workshop.id || canonicalWorkshopName(item.name) === key)) {
        throw new WorkshopConflictError('A workshop configuration with that name already exists.')
      }
      const deletion = deletions.find((item) => item.id === workshop.id || canonicalWorkshopName(item.name) === key)
      if (deletion && deletion.deletedAt >= workshop.savedAt) {
        throw new WorkshopConflictError('A newer deletion exists for that workshop configuration.')
      }
      workshops = [workshop, ...workshops].sort((a, b) => b.savedAt - a.savedAt)
      deletions = deletions.filter((item) => item.id !== workshop.id && canonicalWorkshopName(item.name) !== key)
    } else {
      const incoming = mutation.action === 'upsert' ? [mutation.workshop] : mutation.workshops
      const byName = new Map(workshops.map((workshop) => [canonicalWorkshopName(workshop.name), workshop]))
      for (const workshop of incoming) {
        const key = canonicalWorkshopName(workshop.name)
        const deletion = deletions.find((item) => item.id === workshop.id || canonicalWorkshopName(item.name) === key)
        if (deletion && deletion.deletedAt >= workshop.savedAt) continue
        const existing = workshops.find((candidate) => candidate.id === workshop.id) || byName.get(key)
        if (existing && existing.savedAt > workshop.savedAt) continue
        const normalized = { ...workshop, id: existing?.id || workshop.id }
        byName.set(key, normalized)
        deletions = deletions.filter((item) => item.id !== workshop.id && canonicalWorkshopName(item.name) !== key)
      }
      workshops = [...byName.values()].sort((a, b) => b.savedAt - a.savedAt)
    }

    await saveWorkshopHistory({ version: 1, workshops, deletions })
    return workshops
  })
  workshopOperationQueue = operation.then(() => {}, () => {})
  return operation
}

type MakerAuthConfig = { passwordHash: string; sessionSecret: string }

const parseCookies = (req: IncomingMessage) => Object.fromEntries(
  (req.headers.cookie || '').split(';').map((part) => {
    const [key, ...value] = part.trim().split('=')
    return [key, value.join('=')]
  }).filter(([key]) => key),
)

const sessionSignature = (expiresAt: string, sessionSecret: string) =>
  createHmac('sha256', sessionSecret).update(expiresAt).digest('base64url')

const hasValidMakerSession = (req: IncomingMessage, config: MakerAuthConfig) => {
  const token = parseCookies(req)['jumpstart-maker']
  const [expiresAt, signature] = token?.split('.') || []
  if (!expiresAt || !signature || Number(expiresAt) <= Date.now()) return false
  const expected = sessionSignature(expiresAt, config.sessionSecret)
  const actualBuffer = Buffer.from(signature)
  const expectedBuffer = Buffer.from(expected)
  return actualBuffer.length === expectedBuffer.length && timingSafeEqual(actualBuffer, expectedBuffer)
}

const passwordMatches = (password: string, passwordHash: string) => {
  const [salt, encodedHash] = passwordHash.split(':')
  if (!salt || !encodedHash || !/^[0-9a-f]+$/i.test(encodedHash)) return false
  const expected = Buffer.from(encodedHash, 'hex')
  const actual = scryptSync(password, salt, expected.length)
  return actual.length === expected.length && timingSafeEqual(actual, expected)
}

// Dev-only content API: persists edits from maker mode to public/content/labs.json
// and (on publish) commits + pushes that file to the git remote.
function makerContentApi(env: Record<string, string>): Plugin {
  const config = env.WORKSHOP_MAKER_PASSWORD_HASH && env.WORKSHOP_MAKER_SESSION_SECRET
    ? { passwordHash: env.WORKSHOP_MAKER_PASSWORD_HASH, sessionSecret: env.WORKSHOP_MAKER_SESSION_SECRET }
    : null
  const requireMakerSession = (req: IncomingMessage, res: ServerResponse) => {
    if (!config) { json(res, 503, 'Maker authentication is not configured.'); return false }
    if (!hasValidMakerSession(req, config)) { json(res, 401, 'Maker authentication is required.'); return false }
    return true
  }
  return {
    name: 'maker-content-api',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const requestPath = decodeURIComponent((req.url || '').split('?')[0]).replace(/\\/g, '/')
        if (/(?:^|\/)\.data(?:\/|$)/i.test(requestPath)) return json(res, 404, 'Not found.')
        next()
      })

      server.middlewares.use('/api/maker-auth', async (req, res, next) => {
        if (req.method !== 'POST') return next()
        if (!config) return json(res, 503, 'Maker authentication is not configured.')
        try {
          const { password } = JSON.parse(await readBody(req)) as { password?: string }
          if (typeof password !== 'string' || !passwordMatches(password, config.passwordHash)) {
            return json(res, 401, 'Invalid password.')
          }
          const expiresAt = String(Date.now() + 60 * 60 * 1000)
          res.setHeader('Set-Cookie', `jumpstart-maker=${expiresAt}.${sessionSignature(expiresAt, config.sessionSecret)}; HttpOnly; SameSite=Strict; Path=/; Max-Age=3600`)
          json(res, 204, '')
        } catch (error) {
          if (error instanceof PayloadTooLargeError) return json(res, 413, error.message)
          json(res, 400, 'Invalid authentication request.')
        }
      })

      server.middlewares.use('/api/content', async (req, res, next) => {
        if (req.method !== 'POST') return next()
        if (!requireMakerSession(req, res)) return
        try {
          const body = await readBody(req)
          JSON.parse(body) // validate before writing
          await mkdir(dirname(contentFile), { recursive: true })
          await writeFile(contentFile, body, 'utf8')
          json(res, 200, 'saved')
        } catch (error) {
          if (error instanceof PayloadTooLargeError) return json(res, 413, error.message)
          json(res, 400, `Invalid content: ${(error as Error).message}`)
        }
      })

      // Persists the applied workshop branding to public/content/branding.json so it
      // ships with the site and is visible to every visitor once committed + pushed.
      server.middlewares.use('/api/branding', async (req, res, next) => {
        if (req.method !== 'POST') return next()
        if (!requireMakerSession(req, res)) return
        try {
          const body = await readBody(req)
          JSON.parse(body) // validate before writing
          await mkdir(dirname(brandingFile), { recursive: true })
          await writeFile(brandingFile, body, 'utf8')
          json(res, 200, 'saved')
        } catch (error) {
          if (error instanceof PayloadTooLargeError) return json(res, 413, error.message)
          json(res, 400, `Invalid branding: ${(error as Error).message}`)
        }
      })

      server.middlewares.use('/api/workshops', async (req, res) => {
        if (req.method !== 'GET' && req.method !== 'POST') {
          res.setHeader('Allow', 'GET, POST')
          return json(res, 405, 'Method not allowed.')
        }
        if (!requireMakerSession(req, res)) return
        if (req.method === 'GET') {
          try {
            return jsonData(res, 200, await readWorkshopHistory())
          } catch {
            return json(res, 500, 'Workshop history storage failed.')
          }
        }

        let mutation: WorkshopMutation
        try {
          mutation = parseWorkshopMutation(JSON.parse(await readBody(req)))
        } catch (error) {
          if (error instanceof PayloadTooLargeError) return json(res, 413, error.message)
          return json(res, 400, `Invalid workshop history: ${(error as Error).message}`)
        }
        try {
          jsonData(res, 200, await mutateWorkshopHistory(mutation))
        } catch (error) {
          if (error instanceof WorkshopConflictError) return json(res, 409, error.message)
          json(res, 500, 'Workshop history storage failed.')
        }
      })

      server.middlewares.use('/api/publish', async (req, res, next) => {
        if (req.method !== 'POST') return next()
        if (!requireMakerSession(req, res)) return
        const add = await run('git', ['add', 'public/content/labs.json', 'public/content/branding.json'])
        const commit = await run('git', ['commit', '-m', 'Update lab content via maker editor'])
        const alreadyCommitted = /nothing to commit/i.test(commit)
        const push = await run('git', ['push'])
        const failed = /error|fatal|rejected|exit:/i.test(push)
        const log = [add, commit, push].filter(Boolean).join('\n\n')
        if (failed && !alreadyCommitted) return json(res, 500, log || 'Publish failed')
        json(res, 200, log || 'Published')
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, rootDir, '')
  return {
  // Served at the repo subpath on GitHub Pages; root during local dev so the maker
  // API middleware and the 127.0.0.1:5173 workflow keep working.
  base: command === 'build' ? '/ai-agent-jumpstart-2/' : '/',
    plugins: [react(), makerContentApi(env)],
    server: { fs: { deny: ['.env', '.env.*', '*.{crt,pem,key,p12,pfx,cer,der}', '.npmrc', '.yarnrc.yml', '**/.git/**', '.data/**', '**/.data/**'] } },
  }
})
