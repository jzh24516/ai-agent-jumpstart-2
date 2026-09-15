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

See [payload.example.json](payload.example.json) for the browser-to-gateway contract.
The gateway removes `surveyToken` and adds `submittedAt`, `retentionExpiresAt`,
`completionPercent`, serialized `labStatusJson`, and a processing version before calling
Power Automate.

## Validation

```powershell
npm run build
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
