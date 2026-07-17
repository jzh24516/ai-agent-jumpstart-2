import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { execFile } from 'node:child_process'
import { createHmac, scryptSync, timingSafeEqual } from 'node:crypto'
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import type { IncomingMessage, ServerResponse } from 'node:http'

const rootDir = dirname(fileURLToPath(import.meta.url))
const contentFile = resolve(rootDir, 'public/content/labs.json')
const brandingFile = resolve(rootDir, 'public/content/branding.json')

const readBody = (req: IncomingMessage) =>
  new Promise<string>((res, rej) => {
    let data = ''
    req.on('data', (chunk) => { data += chunk; if (data.length > 5_000_000) req.destroy() })
    req.on('end', () => res(data))
    req.on('error', rej)
  })

const run = (command: string, args: string[]) =>
  new Promise<string>((res) => {
    execFile(command, args, { cwd: rootDir }, (error, stdout, stderr) => {
      res([stdout, stderr, error ? `exit: ${error.message}` : ''].filter(Boolean).join('\n').trim())
    })
  })

const json = (res: ServerResponse, status: number, body: string) => {
  res.statusCode = status
  res.setHeader('Content-Type', 'text/plain; charset=utf-8')
  res.end(body)
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
        } catch {
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
          json(res, 400, `Invalid branding: ${(error as Error).message}`)
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
  }
})
