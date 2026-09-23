import assert from 'node:assert/strict'
import { createServer } from 'vite'

const server = await createServer({
  configFile: false,
  root: process.cwd(),
  logLevel: 'silent',
  server: { middlewareMode: true },
  appType: 'custom',
})

try {
  const {
    completionBand,
    filterFeedback,
    labCompletionStats,
    parseWorkshopFeedback,
    summarizeFeedback,
  } = await server.ssrLoadModule('/src/content/feedbackDashboard.ts')
  const { buildFeedbackDashboardHtml } = await server.ssrLoadModule('/src/content/feedbackDashboardExport.ts')

  const responses = [
    {
      id: 'a', submissionId: 'submission-a', submittedAt: '2026-09-23T10:00:00Z', retentionExpiresAt: '', locale: 'en',
      overall: 5, effort: 1, recommend: 5, comments: 'Excellent', completionPercent: 100,
      completedSteps: 10, totalSteps: 10, emailConsent: true, attendeeEmail: 'one@example.com',
      labStatus: [{ labId: 'lab-01', completedSteps: 5, totalSteps: 5, completedStepIds: ['a'] }],
    },
    {
      id: 'b', submissionId: 'submission-b', submittedAt: '2026-09-23T11:00:00Z', retentionExpiresAt: '', locale: 'zh-TW',
      overall: 3, effort: 4, recommend: 2, comments: '', completionPercent: 60,
      completedSteps: 6, totalSteps: 10, emailConsent: false, attendeeEmail: 'must-not-survive@example.com',
      labStatus: [{ labId: 'lab-01', completedSteps: 3, totalSteps: 5, completedStepIds: ['a'] }],
    },
  ]
  const parsed = parseWorkshopFeedback({ workshopId: 'workshop-id', responses })
  assert.equal(parsed.responses.length, 2)
  assert.equal(parsed.responses[1].attendeeEmail, '')
  assert.equal(completionBand(100), 'complete')
  assert.equal(completionBand(76), 'high')
  assert.equal(completionBand(50), 'medium')
  assert.equal(completionBand(49), 'low')

  const summary = summarizeFeedback(parsed.responses)
  assert.equal(summary.responses, 2)
  assert.equal(summary.averageOverall, 4)
  assert.equal(summary.recommendationRate, 50)
  assert.equal(summary.averageCompletion, 80)
  assert.equal(filterFeedback(parsed.responses, { overall: 'positive' }).length, 1)
  assert.equal(filterFeedback(parsed.responses, { effort: 'easy' }).length, 1)
  assert.equal(filterFeedback(parsed.responses, { locale: 'zh-TW' }).length, 1)
  assert.equal(filterFeedback(parsed.responses, { completion: 'complete' }).length, 1)
  assert.equal(filterFeedback(parsed.responses, { completedLabId: 'lab-01' }).length, 1)
  assert.equal(filterFeedback(parsed.responses, { query: 'excellent' }).length, 1)

  const labStats = labCompletionStats(parsed.responses)
  assert.equal(labStats[0].completed, 1)
  assert.equal(labStats[0].responses, 2)
  assert.equal(labStats[0].averagePercent, 80)

  const labels = {
    documentTitle: 'Feedback dashboard', subtitle: 'Workshop-level survey analysis', responses: 'Responses', overall: 'Avg. overall', effort: 'Avg. effort', recommend: 'Recommend', completion: 'Avg. completion', comments: 'With comments', positiveRatings: 'Overall score 4-5', easyRatings: 'Effort score 1-2', recommendRate: 'Recommend score 4-5', completeResponses: '100% completion', commentedResponses: 'Responses with comments', ratingBreakdown: 'Rating breakdown', completionBreakdown: 'Completion bands', localeBreakdown: 'Language', labCompletion: 'Lab completion', details: 'Survey responses', submitted: 'Submitted', respondent: 'Respondent', anonymous: 'Anonymous', progress: 'Progress', retention: 'Retention expiry', search: 'Search', clearFilters: 'Clear filters', allResponses: 'All responses', noMatches: 'No matches', cards: 'Cards', table: 'Table', lightTheme: 'Light', darkTheme: 'Dark', overallScore: 'Overall', effortScore: 'Effort', recommendScore: 'Recommend',
    completionBands: { complete: '100%', high: '75-99%', medium: '50-74%', low: '<50%' },
    localeNames: { en: 'English', 'zh-TW': 'Traditional Chinese' },
  }
  const exportRecords = structuredClone(parsed.responses)
  exportRecords[0].comments = '</script><script>alert(1)</script>'
  const { html, filename } = await buildFeedbackDashboardHtml({
    workshop: { name: 'Contoso Session', customerName: 'Contoso', customerLogo: '', hostName: 'Microsoft', workshopStart: '2026-09-23', workshopEnd: '2026-09-24', workshopId: 'workshop-id' },
    records: exportRecords,
    labels,
    locale: 'en',
    theme: 'dark',
    viewMode: 'table',
  })
  assert.equal(filename, 'contoso-session-feedback-dashboard.html')
  assert.match(html, /<html lang="en" data-theme="dark">/)
  assert.match(html, /<div class="mark"><span>C<\/span><\/div>/)
  assert.match(html, /id="cardsBtn"/)
  assert.match(html, /id="tableBtn"/)
  assert.match(html, /id="themeBtn"/)
  assert.ok(!html.includes('</script><script>alert(1)</script>'))
  assert.ok(!html.includes('surveyToken'))
  const script = html.match(/<script>([\s\S]*)<\/script>/)?.[1]
  assert.ok(script)
  new Function(script)

  console.log('PASS: feedback dashboard parsing, KPIs, and drill-down filters')
} finally {
  await server.close()
}
