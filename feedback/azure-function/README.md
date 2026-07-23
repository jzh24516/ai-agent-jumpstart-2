# Option A — Azure Function collector

A tiny HTTP-triggered Azure Function (Node.js v4 model) that receives the feedback
JSON and appends it to **Azure Table Storage**. You keep the in‑app star UI; the
function just stores each submission.

## Files
- `src/functions/feedback.js` — the HTTP function (`POST /api/feedback`).
- `host.json`, `package.json` — Functions app config.
- `local.settings.json.example` — copy to `local.settings.json` for local runs.

## Prerequisites
- [Azure Functions Core Tools v4](https://learn.microsoft.com/azure/azure-functions/functions-run-local)
- Node.js 20+
- An Azure subscription (Consumption plan is effectively free for this volume)

## Run locally
```bash
cd feedback/azure-function
npm install
cp local.settings.json.example local.settings.json   # set FEEDBACK_STORAGE_CONNECTION
npm start
# → POST http://localhost:7071/api/feedback
```
For a local table store, install Azurite and keep `AzureWebJobsStorage=UseDevelopmentStorage=true`,
and set `FEEDBACK_STORAGE_CONNECTION=UseDevelopmentStorage=true`.

## Deploy to Azure (CLI)
```bash
# 1) Resource group + storage (feedback lives here) + function app
az group create -n rg-jumpstart-feedback -l eastus
az storage account create -n stjumpstartfb$RANDOM -g rg-jumpstart-feedback -l eastus --sku Standard_LRS
az functionapp create -g rg-jumpstart-feedback -n jumpstart-feedback \
  --consumption-plan-location eastus --runtime node --runtime-version 20 \
  --functions-version 4 --storage-account <the-storage-account-name>

# 2) App settings (the function reads these)
CONN=$(az storage account show-connection-string -g rg-jumpstart-feedback -n <the-storage-account-name> -o tsv)
az functionapp config appsettings set -g rg-jumpstart-feedback -n jumpstart-feedback --settings \
  FEEDBACK_STORAGE_CONNECTION="$CONN" \
  FEEDBACK_TABLE_NAME="JumpStartFeedback" \
  FEEDBACK_ALLOWED_ORIGIN="https://jzh24516.github.io"

# 3) Publish the code
cd feedback/azure-function
func azure functionapp publish jumpstart-feedback
```
Your endpoint: `https://jumpstart-feedback.azurewebsites.net/api/feedback`

## CORS
The function returns permissive CORS headers itself, but also set the platform CORS
allow‑list so preflight succeeds:
```bash
az functionapp cors add -g rg-jumpstart-feedback -n jumpstart-feedback \
  --allowed-origins https://jzh24516.github.io
```

## Wire the app
In [`../../src/App.tsx`](../../src/App.tsx) `saveFeedback()`, point the POST at the endpoint above.
(Or ask me to add a `public/content/feedback.json` `{ "endpoint": "…" }` hook so you can change it
without a rebuild.)

## Read the results
Browse the `JumpStartFeedback` table in **Storage browser** (Azure Portal), Azure Storage
Explorer, or query with the CLI:
```bash
az storage entity query --table-name JumpStartFeedback --connection-string "$CONN"
```
