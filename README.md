# AI Agent JumpStart 2

An interactive, multilingual lab manual for building AI agents with Microsoft Copilot Studio and Power Platform. Each lab reads like a continuous PDF: its overview, contents, steps, paragraphs, input blocks, and embedded figures share one vertically scrollable document.

## Labs

1. New Agent Experience and a multilingual Ask Me Anything agent
2. Dataverse MCP, Account Planning Skills, Memory, and CoWork customer 360
3. RFP Generator with Work IQ, Word, and Excel tools
4. ServiceNow specialist and connected-agent publishing to M365 and Teams
5. Autonomous email classification, routing, and grounded answers
6. Multilingual, multi-turn Voice Agent in the classic experience

## Run locally

```powershell
npm install
npm run dev
```

Production validation:

```powershell
npm run lint
npm run build
```

## Content structure

Each lab is maintained independently under `src/content/labs/lab-XX/content.ts`. Every user-facing field contains `en`, `zh`, `ja`, and `ko` variants. Shared labels are in `src/content/ui.ts`.

A step can use the original `body`, `highlight`, `prompt`, and `imageKey` fields for a single-page instruction. For longer instructions, use `pages` instead; no legacy single-page fields are required. Each page accepts a localized title, any number of localized paragraphs, an optional highlight or prompt, and any number of embedded screenshot keys:

```ts
pages: [
  {
    id: 'configure',
    title: { en: 'Configure the agent', zh: '配置 Agent', ja: 'Agent を構成', ko: 'Agent 구성' },
    paragraphs: [
      { en: 'First paragraph...', zh: '第一段...', ja: '最初の段落...', ko: '첫 번째 단락...' },
      { en: 'Second paragraph...', zh: '第二段...', ja: '2 番目の段落...', ko: '두 번째 단락...' },
    ],
    imageKeys: ['01-agent-overview', '02-agent-settings'],
  },
]
```

Screenshot paths are deterministic:

```text
public/labs/lab-XX/images/{en|zh|ja|ko}/{imageKey}.png
```

The exact image keys are listed in each lab's `public/labs/lab-XX/images/README.md`. Missing screenshots render as localized placeholders, so content authors can add images incrementally without changing React code. Use a 16:10 image ratio where possible.

Learner progress and language preference are stored in browser local storage. No learner data is sent to a server.

## Maker mode (edit and publish content)

Content authors can edit every lab directly in the browser — no code changes required.

1. Run `npm run dev` (maker mode uses a dev-only content API, so it works while the dev server is running).
2. Click the lock icon in the top bar and enter the maker password (`copilotstudio123`).
3. Edit lab metadata, titles, steps, pages, paragraphs, highlights, inputs, and screenshot keys. You can also add, remove, and reorder labs, steps, and pages.
4. **Save** writes your changes to `public/content/labs.json` and the reader updates immediately.
5. **Publish to GitHub** saves, then `git add`/`commit`/`push`es `public/content/labs.json` to the current branch's remote. The command output (including any git errors) is shown in the editor.

The password is a lightweight gate defined in `src/App.tsx` (`submitPassword`) — it is client-side only and not a security boundary. Change it there if needed.

### Content source of truth

- If `public/content/labs.json` exists, it is the live content (loaded at runtime and shipped in the production build).
- If it does not exist yet, the app falls back to the bundled defaults in `src/content/labs/lab-XX/content.ts`. The first Save creates the JSON.

### Translation model

English is the default language. When editing another language, empty fields automatically **fall back to English** for learners, and each field has a **Copy from English** helper to seed a translation. `prompt` / input blocks are shared across all languages.

