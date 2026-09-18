import assert from 'node:assert/strict'
import { createServer } from 'vite'

const locales = ['en', 'zh', 'zh-HK', 'zh-TW', 'ja', 'ko', 'th', 'hi', 'vi']
const htmlLocales = {
  en: 'en-US',
  zh: 'zh-CN',
  'zh-HK': 'zh-HK',
  'zh-TW': 'zh-TW',
  ja: 'ja-JP',
  ko: 'ko-KR',
  th: 'th-TH',
  hi: 'hi-IN',
  vi: 'vi-VN',
}

const expectedSixthLabTitles = {
  en: 'Build an MRM app with Copilot Studio Apps (Preview)',
  zh: '使用 Copilot Studio Apps（预览版）构建 MRM 应用',
  'zh-HK': '使用 Copilot Studio Apps（預覽版）建立 MRM 應用程式',
  'zh-TW': '使用 Copilot Studio Apps（預覽版）建置 MRM 應用程式',
  ja: 'Copilot Studio Apps (Preview) で MRM アプリを構築する',
  ko: 'Copilot Studio Apps (Preview)에서 MRM 앱 만들기',
  th: 'สร้างแอปการจัดการทรัพยากรการตลาด (MRM) ด้วย Copilot Studio Apps (Preview)',
  hi: 'Copilot Studio Apps (Preview) में MRM ऐप बनाएं',
  vi: 'Xây dựng ứng dụng MRM bằng Copilot Studio Apps (Preview)',
}

const legacyVoiceTerms = {
  en: 'real-time voice',
  zh: '实时语音',
  'zh-HK': '實時語音',
  'zh-TW': '即時語音',
  ja: 'リアルタイム音声',
  ko: '실시간 음성',
  th: 'เสียงแบบเรียลไทม์',
  hi: 'real-time voice',
  vi: 'giọng nói theo thời gian thực',
}

const server = await createServer({
  configFile: false,
  root: process.cwd(),
  logLevel: 'silent',
  server: { middlewareMode: true },
  appType: 'custom',
})

try {
  const { buildWorkshopInvitation } = await server.ssrLoadModule('/src/content/invitation.ts')
  const { invitationCopies } = await server.ssrLoadModule('/src/content/invitation-locales/index.ts')

  for (const locale of locales) {
    const { html, filename } = await buildWorkshopInvitation({
      hostName: 'Contoso & Partners',
      hostLogo: '',
      customerName: 'ACME <script>alert(1)</script>',
      customerLogo: '',
      preparedBy: 'A & B',
      preparedDate: '2026-08-20',
      workshopStart: '2026-09-14',
      workshopEnd: '2026-09-15',
      contacts: [],
      attendees: ['ATTENDEE_SECRET'],
      accessCodes: ['ACCESS_SECRET'],
    }, locale)

    const label = `Invitation locale ${locale}`
    const dateFormatter = new Intl.DateTimeFormat(htmlLocales[locale], {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone: 'UTC',
    })
    const expectedWorkshopDate = dateFormatter.format(new Date(Date.UTC(2026, 8, 14)))
    const expectedPreparedDate = dateFormatter.format(new Date(Date.UTC(2026, 7, 20)))
    assert.ok(filename.endsWith(`-${locale.toLowerCase()}.html`), `${label}: filename`)
    assert.ok(html.includes(`<html lang="${htmlLocales[locale]}"`), `${label}: HTML language`)
    assert.ok(html.includes(expectedWorkshopDate), `${label}: workshop date`)
    assert.ok(html.includes(expectedPreparedDate), `${label}: prepared date`)
    assert.ok(html.includes(invitationCopies[locale].programTitle), `${label}: body copy`)
    assert.ok(html.includes(invitationCopies[locale].switchToDark), `${label}: dark theme label`)
    assert.ok(html.includes(invitationCopies[locale].switchToLight), `${label}: light theme label`)
    assert.ok(html.includes(invitationCopies[locale].fallbackContactName), `${label}: fallback contact`)
    assert.equal(invitationCopies[locale].labItems.length, 6, `${label}: source lab count`)
    assert.equal(invitationCopies[locale].labItems[5].title, expectedSixthLabTitles[locale], `${label}: sixth lab title`)
    assert.equal((html.match(/class="lab"/g) ?? []).length, 6, `${label}: lab count`)
    assert.ok(html.includes(expectedSixthLabTitles[locale]), `${label}: Apps/MRM sixth lab rendered`)
    assert.ok(!html.toLocaleLowerCase().includes(legacyVoiceTerms[locale].toLocaleLowerCase()), `${label}: legacy voice copy removed`)
    assert.equal((html.match(/class="card"/g) ?? []).length, 4, `${label}: program card count`)
    assert.ok(html.includes('ACME &lt;script&gt;alert(1)&lt;/script&gt;'), `${label}: customer escaping`)
    assert.ok(html.includes('Contoso &amp; Partners'), `${label}: host escaping`)
    assert.ok(!html.includes('<script>alert(1)</script>'), `${label}: raw customer injection`)
    assert.ok(!html.includes('ATTENDEE_SECRET'), `${label}: attendee privacy`)
    assert.ok(!html.includes('ACCESS_SECRET'), `${label}: access-code privacy`)
    assert.ok(!/\{(?:host|customer|start|end|preparedBy|preparedDate)\}/.test(html), `${label}: unresolved placeholder`)
  }

  console.log(`PASS: generated and validated invitation HTML for ${locales.length} locales`)
} finally {
  await server.close()
}