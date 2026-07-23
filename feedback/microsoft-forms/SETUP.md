# Option C — Microsoft Forms collector (zero code)

The simplest path: a hosted Microsoft Form with built‑in response storage, charts, and
Excel export. There is **no POST and no CORS** — you either link to the Form or embed it.

## 1. Create the Form
[forms.office.com](https://forms.office.com) → **New Form** → add questions:

| # | Question | Type |
|---|---|---|
| 1 | Overall experience | **Rating** — 5 stars |
| 2 | Level of effort (1 = easy · 5 = very difficult) | **Rating** — 5 stars |
| 3 | Would recommend to others | **Rating** — 5 stars |
| 4 | Comments | **Text** (long answer) |
| 5 | *(optional)* Language | **Choice** — en, zh, ja, ko, th, hi |

## 2. Integrate — pick one style

### Style 1 — Link button (recommended, trivial)
Replace the in‑app **Submit feedback** button with a link that opens the Form in a new tab.
Get the link from **Collect responses → Copy link**. You can prefill the language answer via
a URL parameter (Forms “Get pre‑filled URL”).

The change is a few lines in [`../../src/App.tsx`](../../src/App.tsx) `AllCompleteModal` — ask me and
I’ll swap the star form for a themed **“Share feedback”** button that opens your Form URL
(with `?lang=<locale>` mapped to the prefilled field).

### Style 2 — Embed (iframe)
**Collect responses → Embed → Copy** gives an `<iframe …>`. Drop it into the completion
modal so attendees never leave the app. Slightly more layout work; still no code/CORS.

## 3. Read the results
In the Form: **Responses** tab shows live summaries and charts; **Open in Excel** exports
everything. Optionally connect the Form to a Power Automate flow for notifications.

## Trade‑off vs A/B
- ✅ Zero code, zero infra, built‑in analytics.
- ➖ You lose the in‑app star styling (Style 1) or embed a differently‑styled frame (Style 2),
  and responses live in Forms rather than your own store.
