# Workshop feedback pipeline

The **All labs complete** modal sends workshop feedback through a managed gateway only
after the participant receives a successful acknowledgement. Failed submissions keep
all answers in the modal and reuse the same submission ID when retried.

```text
GitHub Pages -> Azure Function -> Power Automate -> Dataverse
```

The browser never receives the Power Automate callback URL. The Azure Function validates
the payload, verifies the workshop HMAC token, applies server-owned timestamps and a
24-month retention date, enforces a persistent per-client rate limit, retries transient
Flow failures, and forwards normalized JSON.

## Deployed components

- Power Platform environment: `mjCopilotCXPCCaaS`
- Solution: `AgentJumpStartSurvey`
- Tables: `mjsrc_workshop`, `mjsrc_surveyresponse`
- Capture Flow: `Agent JumpStart | Capture Survey Response`
- Retention Flow: `Agent JumpStart | Purge Expired Survey Responses`
- Azure resource group: `azrge6s5zfqajgpoo` (`westus3`)
- Function App: `azfnuhqsqqzypov3s` (Flex Consumption, Node.js 22)
- Public gateway: `https://azfnuhqsqqzypov3s.azurewebsites.net/api/feedback`

`public/content/feedback.json` contains only the public Function endpoint. Power Automate
callback and signing secrets are stored in the private Key Vault and referenced by the
Function App. Storage and Key Vault disable public network access; the Function reaches
them through its isolated VNet and private endpoints using a user-assigned managed identity.
The private rate-limit table stores only hour buckets, HMAC client hashes, and submission
IDs. It never stores raw client IP addresses and removes limiter entries after 48 hours.

## Data and privacy

The submitted survey contains customer/workshop identity, locale, three 0-5 ratings,
comments, overall progress, and each public lab's completed step IDs. It never contains
lab usernames, access codes, contacts, or the attendee allow-list.

The verified attendee email is excluded by default. A participant must explicitly select
**Include my email** before it is sent. The modal states the 24-month retention period.
The daily retention Flow deletes expired Survey Response rows; Workshop rows contain no
participant PII and remain available for aggregate analysis.

## Maker feedback dashboard

Branding Settings shows a chart action for saved engagements that have a `workshopId`.
The dashboard is dev-only and requires the same signed Maker session as workshop history.
Its local `/api/workshop-feedback` route invokes `scripts/query_workshop_feedback.py`,
which uses `scripts/auth.py` and the Python Dataverse SDK to read only Survey Response
rows whose `mjsrc_workshopkey` matches the selected engagement.

The browser receives normalized ratings, progress, locale, comments, per-lab completion,
and an attendee email only when consent was recorded. It never receives Dataverse access
tokens, the workshop survey token, attendee allow-lists, or lab credentials. KPI cards and
distribution rows filter the detailed response list in place. Response details can switch
between cards and a wrapped table; the dashboard has its own light/dark theme preference.

**Export to HTML** downloads a self-contained interactive snapshot containing the currently
loaded response set. Filters, search, KPI drill-down, card/table switching, and theme
switching continue to work in the downloaded file. The export tries to embed the customer
logo and falls back to the engagement-name initial when the logo cannot be fetched. Because
the file can contain comments and consented email addresses, handle it as survey data.

See [payload.example.json](payload.example.json) for the browser-to-gateway contract.
The gateway removes `surveyToken` and adds `submittedAt`, `retentionExpiresAt`,
`completionPercent`, serialized `labStatusJson`, and a processing version before calling
Power Automate.

## Validation

```powershell
npm run build
npm run test:feedback-dashboard
npm --prefix feedback/azure-function test
node scripts/test_survey_gateway.mjs
```

The gateway smoke test uses fixed synthetic IDs and no real PII. Remove its response and
workshop rows after a run:

```powershell
dataverse data delete --table mjsrc_surveyresponses --id 40000000-0000-4000-8000-000000000001 --no-confirm
dataverse data delete --table mjsrc_workshops --id 30000000-0000-4000-8000-000000000001 --no-confirm
```

Dataverse schema provisioning and Flow setup details are in the component READMEs.
