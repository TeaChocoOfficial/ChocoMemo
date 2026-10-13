# ChocoMemo

**ChocoMemo** is a multi-language learning web application focused on helping users practice and memorize languages. It combines reference charts, interactive quizzes, speech (TTS), deck-based render/vocabulary/exam/review, and per-user settings into a clean, responsive app.

Built with **React Router v7 (framework mode)**, **TypeScript**, **Zustand**, **i18next**, and **Tailwind CSS**.

> The **Japanese** track is complete. **English** has the study hub, deck-list browsing, deck management, and per-deck session routes, but no character set or drill yet. **Korean, Thai, and Chinese** are still disabled ("Coming Soon"). **Another language** is a deck-only catch-all for languages the app has no built-in support for.

---

## ✨ Features

### Target language as a filter

The study language is **not** part of the URL path. Every route is language-agnostic and the target language is a filter:

- Deck-list pages read `?target=ja` from the query string, so a link is shareable and the loader/SSR can read it.
- When the query is absent, the last target the viewer browsed is used (saved on the device), falling back to a default.
- A **target-language selector** in the deck-list toolbar switches which language is browsed; unready languages are listed but disabled.
- A single capabilities config (`app/data/language.ts`) declares each target language's status (`ready` / `coming-soon`) and its character set. The character routes read from it, so a language without a set (English today) shows a coming-soon notice instead of a chart.

### Choosing a target language

There is no separate language-select page. The **Landing page** lists the languages, and picking a ready one opens its vocabulary deck list (`/vocab?target=…`). The deck list's own selector changes the target later, and the choice is saved on the device.

### Landing page

`/:lang` introduces the app and lets the visitor pick a language. Its language section (`id="languages"`) lists every target language: ready ones are full-width actionable rows, and the unbuilt ones are grouped under a quiet "Coming Soon" heading and disabled. Picking a ready language opens its vocabulary deck list. The Landing has no study navigation of its own.

### Study hub

`/:lang/study` is the overview a visitor lands on after picking a language. It has three deliberately different groups:

- **Characters** — a tile per character set, dominated by the script glyph, ready ones first. A language without a chart yet is an inert "Coming Soon" tile.
- **Drill** — a list of character drills, one row each, ready ones first.
- **Decks** — a **Learn** column (vocabulary, render), a **Practice** column (review, exam), and a full-width **Manage** row (edit decks). Every deck link carries the active target as `?target=`.

The character and drill groups are driven by the capabilities config (`app/data/language.ts`), so every target language is listed and a missing chart/drill shows as "Coming Soon"; the Decks group follows the active target. The active target's ready items are highlighted, and a shared **target selector** in the header changes the target.

### Another language

`other` is a catch-all target for languages the app has no built-in support for (Spanish, French, ...). It is **deck-only**: users can create, browse and study decks, but there is no character chart or drill. Because `other` is not one specific language, a deck whose `targetLang` is `other` carries its own language info — a free-text `label` (e.g. "Spanish") and a BCP-47 `speechTag` (e.g. `es-ES`) used for TTS.

### Character charts

`/:lang/characters/:target` renders the character chart for a target language. Only **Japanese kana** is wired today:

- Browse **Hiragana** and **Katakana** reference charts, organized into three groups:
  - **Voiceless** (清音 — seion)
  - **Voiced** (濁音・半濁音 — dakuten / handakuten)
  - **Contracted** (拗音 — yōon)
- Each character card is clickable and will **speak the character aloud** using the browser's Web Speech API.

Other languages fall through to a "Coming Soon" notice until their chart ships.

### Character drill

`/:lang/drill/:target` runs the character drill for a target language. Only **Japanese kana** is wired today. A fully configurable multiple-choice drill:

- **Kana groups** — toggle Hiragana / Katakana and any combination of Voiceless / Voiced / Contracted; each switch shows the character count it adds, plus a running total.
- **Question set** — toggle between *all* characters in the selected groups or a specific *number* (2–12).
- **Per-question timer** (1–20s) with a countdown bar.
- **Auto-advance** — optionally hide the Next button and advance automatically.
- **Live stats** during play — Correct / Wrong / Timeout counters.
- **End Game** at any time to return to settings.
- **Detailed results** — score rank, score bar, a Correct / Wrong / Timeout breakdown, a settings summary, a scrollable answer history per question, and Play Again / Settings / Exit actions.

### Shared Deck List UI

**Render, Vocabulary, exam, and Review** are four separate features that all reuse the **same deck-list page and card components** — the same browsing layout, filters, and deck card shown everywhere. Only the underlying deck data (and what happens when you open a deck) differs per feature:

- **Render** — decks whose content is readable material (imported from PDF/txt or authored directly), for practicing reading comprehension.
- **Vocabulary** — decks of words to browse/learn.
- **exam** — decks used to generate a multiple-choice test.
- **Review** — decks used for spaced/flashcard-style review of previously studied words.

Decks live in one shared collection; each deck carries a `targetLang` so a list can filter by it. The deck-list toolbar has a **target-language selector**, so the viewer can switch which language's decks they are browsing without leaving the page (unready languages are disabled). The list's display options (source, sort, density, nsfw) live in the URL for shareable links, and the sort/density/nsfw choices plus the target are also **remembered on the device**, so a bare deck list opens the way you last left it. Decks come from the built-in set or the user's own local words. The shared list component also accepts **cloud** and **community** tabs, but those have no backend yet and render a "Coming Soon" state only.

### Edit Decks

One page for editing across **every** deck type — vocabulary, render, review, and exam — instead of per feature, so it lives in the study hub's **Manage** section rather than under Learn or Practice. The route and hub entry exist today; the editor screen itself is still an empty placeholder.

### Voice (TTS)

- Per-character click-to-speak on the character charts.
- A **Voice Picker** on the character page to choose the TTS voice, language, and speech rate (with an "Auto" option and a preview button).
- Speech follows the **target language**, never the interface locale. An `other` deck speaks its own `targetInfo.speechTag`.

### Profile & Settings

All account routes are locale-scoped, so these are reached as `/:lang/...`:

- **`/settings`** — app-wide preferences (not tied to a specific study language).
- **`/profile`** — the signed-in user's own profile.
- **`/profile/:nameTag`** — public profile view for any user, looked up by their public `nameTag` handle.
- **`/auth`** — where OAuth providers send the browser back to; it picks up the session cookie and returns home.

---

## 🧭 Routes

> Every route is nested under `:lang`, the active i18n locale segment. The UI ships **18 locales**: `en`, `th`, `ja`, `zh`, `ko`, `vi`, `id`, `es`, `pt`, `fr`, `de`, `ar`, `hi`, `ru`, `it`, `tr`, `fil`, `ms`. Visiting the bare `/` redirects to your detected locale.
>
> The study language is a **filter**, not a path segment: deck lists read `?target=ja`, and the character routes carry the target in `:target` (`ja`, `en`, `other`, `ko`, `zh`, `th`).

### Core

| Route | Page |
|-------|------|
| `/:lang` | Landing — introduces the app and lets the visitor pick a language |
| `/:lang/study` | Study hub — Characters / Drill / Decks for the active target language |

### Study

| Route | Page |
|-------|------|
| `/:lang/edit` | Edit decks (Manage; placeholder) |
| `/:lang/decks/:deckId` | Deck details (any deck type) |
| `/:lang/vocab` | Vocabulary deck list |
| `/:lang/vocab/:deckId` | Browse a vocabulary deck |
| `/:lang/render` | Render deck list |
| `/:lang/render/:deckId` | Read a render deck |
| `/:lang/exam` | Exam deck list |
| `/:lang/exam/:deckId` | Run an exam |
| `/:lang/review` | Review deck list |
| `/:lang/review/:deckId` | Flashcard / spaced review |
| `/:lang/characters/:target` | Character chart (kana, alphabet, hangul, hanzi, thai) + voice picker |
| `/:lang/drill/:target` | Character drill |

### Account

Account concerns are locale-scoped like everything else, so `/settings` is reached as `/:lang/settings`.

| Route | Page |
|-------|------|
| `/:lang/settings` | App settings |
| `/:lang/profile` | Your own profile |
| `/:lang/profile/:nameTag` | Public profile view for another user |
| `/:lang/auth` | OAuth landing route — re-fetches the session cookie, then redirects home |

### Target language status

| Target | Code | Status | Character set |
|--------|------|--------|---------------|
| Japanese | `ja` | Ready | Kana |
| English | `en` | Ready | none (planned) |
| Another language | `other` | Ready (decks only) | none |
| Korean | `ko` | Coming soon | Hangul (planned) |
| Thai | `th` | Coming soon | Thai (planned) |
| Chinese | `zh` | Coming soon | Hanzi (planned) |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React Router v7 (Vite, SSR framework mode) |
| Language | TypeScript |
| State | Zustand (with `persist`) |
| i18n | i18next / react-i18next |
| Styling | Tailwind CSS |
| Animation | Framer Motion |
| Speech | Web Speech API |
