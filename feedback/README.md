# Workshop feedback collectors

The app already collects feedback in the **All labs complete** celebration modal
(Overall experience, Level of effort, Would recommend — 1–5 stars — plus Comments).
Every submission is saved to the visitor's `localStorage` (`jumpstart-feedback`) **and**
best‑effort `POST`ed as JSON to a collector endpoint.

Because the site is hosted on **GitHub Pages (static)**, there is no server to
aggregate responses centrally. Pick one of the collectors below, then wire the app
to it (see “Wiring the app”).

## The payload the app sends

`POST` with `Content-Type: application/json`:

```json
{
  "overall": 5,
  "effort": 3,
  "recommend": 5,
  "comments": "Loved the hands-on labs!",
  "locale": "en",
  "at": 1784780000000
}
```

- `overall`, `effort`, `recommend` — integers 0–5 (0 = not answered).
- `comments` — free text (may be empty).
- `locale` — one of `en | zh | ja | ko | th | hi`.
- `at` — client timestamp (epoch ms).

See [payload.example.json](payload.example.json).

## Choose an approach

| Option | Effort | Cost | Central store | CORS | Best when |
|---|---|---|---|---|---|
| **A. Azure Function** ([azure-function/](azure-function/)) | Medium | ~free (consumption) | Azure Table Storage | you control | You want a custom UI + your own data store |
| **B. Power Automate** ([power-automate/](power-automate/)) | Low | Included w/ M365 | SharePoint list / Excel | handled by flow | You live in M365 and want no code |
| **C. Microsoft Forms** ([microsoft-forms/](microsoft-forms/)) | Lowest | Included w/ M365 | Forms → Excel | n/a (no POST) | You want zero code and built‑in charts |

- **A** and **B** keep the in‑app star UI and just receive the JSON above.
- **C** replaces the in‑app form with a hosted Microsoft Form (link or embed) — no POST, no CORS.

## Wiring the app (A or B)

The POST target lives in `saveFeedback()` in [`src/App.tsx`](../src/App.tsx). Today it posts to
the relative path `"/api/feedback"` (a no‑op on the static site). To use collector A or B, replace
that URL with the **absolute** endpoint URL you get from the setup steps, e.g.:

```ts
await fetch('https://<your-endpoint>/api/feedback', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(entry) })
```

> Tip: to change the endpoint **without a rebuild**, we can instead read it from a small
> `public/content/feedback.json` (`{ "endpoint": "https://…" }`), just like `branding.json`.
> Say the word and I'll add that hook.

The endpoint must allow the site origin via CORS: `https://jzh24516.github.io`.

## Wiring the app (C)

For Microsoft Forms you don't POST at all. Two integration styles are described in
[microsoft-forms/SETUP.md](microsoft-forms/SETUP.md): a **link** button (opens the Form,
locale prefilled) or an **iframe embed** inside the completion modal.
