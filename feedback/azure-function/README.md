# Azure Function survey gateway

This Node.js 22 Azure Functions v4 app validates and signs the boundary between the
public workshop and Power Automate. It does not store survey data itself.

## Runtime behavior

- `POST /api/feedback`: validates origin, UUIDs, ratings, workshop dates, progress,
  lab status, optional email consent, and the workshop HMAC token.
- `OPTIONS /api/feedback`: answers CORS preflight for the configured workshop origin.
- `GET /api/health`: reports whether Flow and signing configuration references resolve.
- Server time controls `submittedAt`; the gateway derives the retention expiry.
- Transient downstream failures are retried three times with the same submission ID.
- A private Azure Table limits each HMAC client bucket to 120 distinct submissions per
  hour. Retrying the same submission ID is not counted twice; a daily timer removes
  limiter rows after 48 hours. Raw client IP addresses are never stored.
- The Flow callback URL and signing secret are never returned to the browser or logged.

## Local validation

```powershell
cd feedback/azure-function
npm install
npm test
Copy-Item local.settings.json.example local.settings.json
npm start
```

Fill `local.settings.json` locally only. Never commit a real Flow URL or signing secret.

## Infrastructure

The templates in `infra/` deploy:

- Flex Consumption (`FC1`) Function App using Node.js 22
- User-assigned managed identity
- Keyless Storage with Blob/Queue/Table RBAC
- Private Key Vault with RBAC
- Isolated VNet, Function integration subnet, private endpoint subnet
- Blob, Queue, Table, and Vault private endpoints plus private DNS
- Workspace-based Application Insights and diagnostic settings

Resource names are deterministic and the current deployment is in `westus3`, resource
group `azrge6s5zfqajgpoo`. The inherited management-group policy forces Storage and Key
Vault public network access off; the private networking in the template is required.

```powershell
az deployment sub validate `
  --subscription 339bb819-f689-437f-9981-42676b6487fb `
  --location westus3 `
  --template-file infra/main.bicep `
  --parameters '@infra/main.parameters.json'

az deployment sub create `
  --subscription 339bb819-f689-437f-9981-42676b6487fb `
  --location westus3 `
  --name agent-jumpstart-survey `
  --template-file infra/main.bicep `
  --parameters '@infra/main.parameters.json'

func azure functionapp publish azfnuhqsqqzypov3s --javascript
```

`infra/secrets.bicep` accepts secure ARM parameters for the callback URL and signing
secret. Use an ephemeral local parameter file and delete it immediately after deployment.
Do not place secret values in parameter files tracked by Git.
