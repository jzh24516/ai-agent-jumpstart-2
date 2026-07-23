# Option B — Power Automate collector (no code)

An HTTP‑triggered cloud flow receives the feedback JSON and writes a row to a
**SharePoint list** (or Excel table / Dataverse). You keep the in‑app star UI.

## 1. Create the destination (SharePoint list)
Create a list named **JumpStart Feedback** with columns:

| Column | Type |
|---|---|
| Title | Single line (default — store the row key / timestamp) |
| Overall | Number |
| Effort | Number |
| Recommend | Number |
| Comments | Multiple lines of text |
| Locale | Single line |
| SubmittedAt | Date and time |

## 2. Build the flow
1. Go to [make.powerautomate.com](https://make.powerautomate.com) → **Create** →
   **Instant cloud flow** → trigger **“When an HTTP request is received.”**
2. In the trigger, paste the JSON schema from [request-schema.json](request-schema.json)
   into **Request Body JSON Schema**.
3. (Recommended) Set the trigger’s **Method** to `POST`.
4. Add action **SharePoint → Create item** (or **Excel → Add a row**, or
   **Dataverse → Add a new row**). Map:
   - Title → `@{utcNow()}`
   - Overall → **overall**
   - Effort → **effort**
   - Recommend → **recommend**
   - Comments → **comments**
   - Locale → **locale**
   - SubmittedAt → `@{formatDateTime(addSeconds('1970-01-01', div(triggerBody()?['at'], 1000)), 'yyyy-MM-ddTHH:mm:ss')}`
     (or just use `utcNow()` if the client timestamp isn’t needed).
5. **Save.** The trigger now shows an **HTTP POST URL** — copy it. This is your endpoint.

## 3. CORS
Power Automate HTTP‑request triggers respond to browser preflight automatically, so no
extra CORS config is usually needed. If a browser blocks it, front the flow with an
Azure API Management / Function proxy that adds CORS headers.

> Note: the generated POST URL contains a SAS signature — treat it as a secret‑ish URL.
> Anyone with it can submit rows. That’s acceptable for anonymous workshop feedback.

## 4. Wire the app
In [`../../src/App.tsx`](../../src/App.tsx) `saveFeedback()`, replace the POST URL with the flow’s
HTTP POST URL. (Or ask me to add a `public/content/feedback.json` hook so you can paste the URL
without a rebuild.)

## 5. Read the results
Open the SharePoint list (or Excel/Dataverse). Add views, charts, or a Power BI report as needed.
