# Power Automate survey flows

Both flows are solution-aware components in the unmanaged `AgentJumpStartSurvey`
solution in environment `mjCopilotCXPCCaaS`.

## Capture flow

**Agent JumpStart | Capture Survey Response** receives normalized JSON from the Azure
Function, never directly from the browser. Its callback URL is a secret stored in Azure
Key Vault.

1. `Upsert_Workshop` uses the deterministic `workshopId` as the Dataverse row ID.
2. `Upsert_Survey_Response` uses `submissionId` as the row ID and associates the Workshop.
3. A duplicate request updates the same records rather than creating duplicates.
4. The Flow returns HTTP 200 only after both Dataverse operations succeed.

The complete deployable definition is [flow-definition.json](flow-definition.json), and
the normalized request contract is [request-schema.json](request-schema.json).

## Retention flow

**Agent JumpStart | Purge Expired Survey Responses** runs daily at 03:15 UTC. It reads
only expired response IDs, in bounded batches of 5,000, and deletes those rows. It never
deletes Workshop master rows.

The definition is [retention-flow-definition.json](retention-flow-definition.json).

## Dataverse schema

| Display name | Logical name | Purpose |
|---|---|---|
| Agent JumpStart Workshop | `mjsrc_workshop` | Customer and workshop identity |
| Agent JumpStart Survey Response | `mjsrc_surveyresponse` | Ratings, comments, consent, progress, and retention |

Alternate keys exist on `mjsrc_workshopkey` and `mjsrc_submissionid`. Survey Response
has a lookup to Workshop. Run the idempotent schema provisioner with:

```powershell
python scripts/provision_survey_dataverse.py --apply
```

## ALM and secrets

Use `scripts/add_survey_flow_to_solution.ps1` only for migrating a newly created
non-solution Flow into the solution. Never commit or display the HTTP trigger callback.
The callback is retrieved through the authenticated management API and passed to
`infra/secrets.bicep` as a secure ARM parameter.

The HTTP Request trigger and Dataverse connector are Premium. The Flow owner must retain
an appropriate Power Automate Premium or Process license.
