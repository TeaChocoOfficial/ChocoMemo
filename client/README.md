# ChocoMemo

**ChocoMemo** is a multi-language learning web application focused on helping users practice and memorize languages. It combines reference charts, interactive quizzes, speech (TTS), deck-based render/vocabulary/exam/review, and per-user settings into a clean, responsive app.

Built with **React Router v7 (framework mode)**, **TypeScript**, **Zustand**, **i18next**, and **Tailwind CSS**.

> Every target language is **active**: all six can be browsed and studied through decks. The **Japanese** (kana), **English** (alphabet) and **Thai** character charts are implemented, and the drill ships for **Japanese** and **English** — the other scripts' chart and drill routes still show a placeholder notice until they ship. **Another language** is a deck-only catch-all for languages the app has no built-in support for.

---

## ✨ Features

### Target language as a filter

The study language is **not** part of the URL path. Every route is language-agnostic and the target language is a filter:

- Deck-list pages read `?target=ja` from the query string, so a link is shareable and the loader/SSR can read it.
- When the query is absent, the last target the viewer browsed is used (saved on the device), falling back to a default.
- A **target-language selector** in the deck-list toolbar switches which language is browsed; every language is selectable, plus an "all languages" option.
- A single capabilities config (`app/data/language.ts`) declares each target language's character set and drill. The character routes read from it: `kana`, the `alphabet` and `thai` are implemented today, so Korean and Chinese still show a placeholder "coming soon" notice instead of a chart.

### Choosing a target language

There is no separate language-select page. The **Landing page** lists the languages, and picking one opens its vocabulary deck list (`/vocab?target=…`). The deck list's own selector changes the target later, and the choice is saved on the device.

### Landing page

`/:lang` introduces the app and lets the visitor pick a language. Its language section (`id="languages"`) lists every target language as a full-width actionable row; picking one opens its vocabulary deck list. The Landing has no study navigation of its own.

### Study hub

`/:lang/study` is the overview a visitor lands on after picking a language. It has three deliberately different groups:

- **Characters** — a tile per character set, dominated by the script glyph. Every tile links to its chart route; a language whose chart is not implemented yet lands on a placeholder notice.
- **Drill** — a list of character drills, one row each.
- **Decks** — a **Learn** column (vocabulary, render), a **Practice** column (review, exam), and a full-width **Manage** row (edit decks). Every deck link carries the active target as `?target=`.

The character and drill groups are driven by the capabilities config (`app/data/language.ts`), so every target language is listed (kana, the alphabet and Thai have a real chart; the other routes show a placeholder notice), and the Decks group follows the active target. The active target's items are highlighted, and a shared **target selector** in the header changes the target.

### Another language

`other` is a catch-all target for languages the app has no built-in support for (Spanish, French, ...). It is **deck-only**: users can create, browse and study decks, but there is no character chart or drill. Because `other` is not one specific language, a deck whose `targetLang` is `other` carries its own language info — a free-text `label` (e.g. "Spanish") and a BCP-47 `speechTag` (e.g. `es-ES`) used for TTS.

### Character charts

`/:lang/characters/:target` renders the character chart for a target language. Three scripts are wired today:

- **Japanese kana** — **Hiragana** and **Katakana**, organized into three groups:
  - **Voiceless** (清音 — seion)
  - **Voiced** (濁音・半濁音 — dakuten / handakuten)
  - **Contracted** (拗音 — yōon)
- **English alphabet** — uppercase and lowercase, split into **vowels** and **consonants**.
- **Thai** — consonants, vowels and tone marks, split into **headed** and **headless** groups.

Every chart shares the same behaviour:

- Each character card is clickable and will **speak the character aloud** using the browser's Web Speech API.
- A **reading order** walks the chart and remembers how far you got.
- The toolbar holds the group/set toggles, the sticky-header switch and the **voice picker**.

Korean and Chinese fall through to a "Coming Soon" notice until their chart ships.

### Character drill

`/:lang/drill/:target` runs the character drill for a target language. **Japanese kana** and the **English alphabet** are wired today. A fully configurable multiple-choice drill:

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

Decks live in one shared collection; each deck carries a `targetLang` so a list can filter by it. The deck-list toolbar has a **target-language selector**, so the viewer can switch which language's decks they are browsing without leaving the page (every language plus an "all languages" option). The list's display options (source, sort, density, nsfw) live in the URL for shareable links, and the sort/density/nsfw choices plus the target are also **remembered on the device**, so a bare deck list opens the way you last left it. Decks come from the built-in set or the user's own local words. The shared list component also accepts **cloud** and **community** tabs, but those have no backend yet and render a "Coming Soon" state only.

### Edit Decks

One page for editing across **every** deck type — vocabulary, render, review, and exam — instead of per feature, so it lives in the study hub's **Manage** section rather than under Learn or Practice. The route is a full-screen workspace of **dockable panels** (deck list, editor, preview, inspector, settings): drag, resize, pin a tab, or reset the layout. On a phone the same panels become a tab strip with a slide-out menu.

### Guide page

`/:lang/guide` is the in-app manual: a quick start of four steps (pick a language → read the chart → drill it → review the words) followed by one card per area of the app — landing, study hub, charts, drill, decks, deck editor, voice and appearance, account and community. Every card links straight to the page it describes. It sits in the **navbar** (desktop and mobile) and the footer's **Explore** list, and the landing page's *How it works* section links to it with "Read the full guide".

### Voice (TTS)

- Per-character click-to-speak on the character charts.
- A **Voice Picker** on the character page to choose the TTS voice, language, and speech rate (with an "Auto" option and a preview button).
- Speech follows the **target language**, never the interface locale. An `other` deck speaks its own `targetInfo.speechTag`.
- Thai reads through **Google Cloud TTS** (the server proxies it): every Thai voice Google offers is listed, with a pre-recorded clip as the fallback when the API key is not configured.

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
| `/:lang/guide` | Guide — the in-app manual: quick start plus one card per area |

### Study

| Route | Page |
|-------|------|
| `/:lang/edit` | Edit decks (Manage; dockable-panel workspace) |
| `/:lang/decks/:deckId` | Deck details (any deck type) |
| `/:lang/vocab` | Vocabulary deck list |
| `/:lang/vocab/:deckId` | Browse a vocabulary deck |
| `/:lang/render` | Render deck list |
| `/:lang/render/:deckId` | Read a render deck |
| `/:lang/exam` | Exam deck list |
| `/:lang/exam/:deckId` | Run an exam |
| `/:lang/review` | Review deck list |
| `/:lang/review/:deckId` | Flashcard / spaced review |
| `/:lang/characters/:target` | Character chart (kana, alphabet, thai implemented; hangul and hanzi pending) + voice picker |
| `/:lang/drill/:target` | Character drill |

### Account

Account concerns are locale-scoped like everything else, so `/settings` is reached as `/:lang/settings`.

| Route | Page |
|-------|------|
| `/:lang/settings` | App settings |
| `/:lang/profile` | Your own profile |
| `/:lang/profile/:nameTag` | Public profile view for another user |
| `/:lang/auth` | OAuth landing route — re-fetches the session cookie, then redirects home |

### Target languages

| Target | Code | Character set |
|--------|------|---------------|
| Japanese | `ja` | Kana (chart + drill) |
| English | `en` | Alphabet (chart + drill) |
| Another language | `other` | none (decks only) |
| Korean | `ko` | Hangul (planned) |
| Thai | `th` | Thai (chart) |
| Chinese | `zh` | Hanzi (planned) |

All six targets are active — selectable in every selector and studyable through decks. The character chart is implemented for `ja`, `en` and `th`, and the drill for `ja` and `en` — the other chart/drill routes render a placeholder notice until their script ships.

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
