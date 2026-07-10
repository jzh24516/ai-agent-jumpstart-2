import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { execFile } from 'node:child_process'
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import type { IncomingMessage, ServerResponse } from 'node:http'

const rootDir = dirname(fileURLToPath(import.meta.url))
const contentFile = resolve(rootDir, 'public/content/labs.json')

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

// Dev-only content API: persists edits from maker mode to public/content/labs.json
// and (on publish) commits + pushes that file to the git remote.
function makerContentApi(): Plugin {
  return {
    name: 'maker-content-api',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/api/content', async (req, res, next) => {
        if (req.method !== 'POST') return next()
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

      server.middlewares.use('/api/publish', async (req, res, next) => {
        if (req.method !== 'POST') return next()
        const add = await run('git', ['add', 'public/content/labs.json'])
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
export default defineConfig({
  plugins: [react(), makerContentApi()],
})
