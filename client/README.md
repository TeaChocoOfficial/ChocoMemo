# ChocoMemo

**ChocoMemo** is a multi-language learning web application focused on helping users practice and memorize Japanese. It combines reference charts, interactive quizzes, speech (TTS), deck-based render/vocabulary/exam/review, and per-user settings into a clean, responsive app.

Built with **React Router v7 (framework mode)**, **TypeScript**, **Zustand**, **i18next**, and **Tailwind CSS**.

> The **Japanese** track is complete. **English** has a hub, deck-list browsing, deck management, and per-deck session routes, but no character set or drill yet. The language-select screen lists five languages; **Korean, Thai, and Chinese** are still disabled ("Coming Soon").

---

## ✨ Features

### Language Select
Choose which language to study. The page is a list: the ready languages (Japanese, English) are full-width actionable rows, and the unbuilt ones (Korean, Thai, Chinese) are grouped below under a quiet "Coming Soon" heading.

### Japanese Hub
The hub groups its destinations into three sections: **Learn** (kana charts, vocabulary, render), **Practice** (kana drill, review, exam), and **Manage** (edit decks).

### Kana Charts
Browse **Hiragana** and **Katakana** reference charts, organized into three groups:
- **Voiceless** (清音 — seion)
- **Voiced** (濁音・半濁音 — dakuten / handakuten)
- **Contracted** (拗音 — yōon)

Each character card is clickable and will **speak the character aloud** using the browser's Web Speech API.

### Kana Drill
A fully configurable multiple-choice drill:

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

Decks come from the built-in set or the user's own local words. The shared list component also accepts **cloud** and **community** tabs, but those have no backend yet and render a "Coming Soon" state only.

### Edit Decks
One page for editing across **every** deck type — vocabulary, render, review, and exam — instead of per feature, so it lives in the hub's **Manage** section rather than under Learn or Practice. The route and hub entry exist today; the editor screen itself is still an empty placeholder.

### Character Drill (per language)
The character drill is one shared component fed a different character set per track. Only **Japanese (kana)** is wired today; the rest are planned:
- **Japanese** — Kana (Hiragana/Katakana)
- **English** — Alphabet (A–Z)
- **Korean** — Hangul
- **Chinese** — Hanzi
- **Thai** — Thai alphabet (consonants, vowels, tone marks)

### Voice (TTS)
- Per-character click-to-speak on the character charts.
- A **Voice Picker** on the characters page to choose the TTS voice, language, and speech rate (with an "Auto" option and a preview button).

### Profile & Settings
All account routes are locale-scoped, so these are reached as `/:lang/...`:
- **`/settings`** — app-wide preferences (not tied to a specific study language).
- **`/profile`** — the signed-in user's own profile.
- **`/profile/:nameTag`** — public profile view for any user, looked up by their public `nameTag` handle.
- **`/auth`** — where OAuth providers send the browser back to; it picks up the session cookie and returns home.

---

## 🧭 Routes

> Every route is nested under `:lang`, the active i18n locale segment. The UI ships **18 locales**: `en`, `th`, `ja`, `zh`, `ko`, `vi`, `id`, `es`, `pt`, `fr`, `de`, `ar`, `hi`, `ru`, `it`, `tr`, `fil`, `ms`. Visiting the bare `/` redirects to your detected locale.

### Core

| Route | Page |
|-------|------|
| `/:lang` | Home |
| `/:lang/language-select` | Choose a language |

### Account

Account concerns are locale-scoped like everything else, so `/settings` is reached as `/:lang/settings`.

| Route | Page |
|-------|------|
| `/:lang/settings` | App settings |
| `/:lang/profile` | Your own profile |
| `/:lang/profile/:nameTag` | Public profile view for another user |
| `/:lang/auth` | OAuth landing route — re-fetches the session cookie, then redirects home |

### Japanese track

| Route | Page |
|-------|------|
| `/:lang/japanese` | Japanese hub |
| `/:lang/japanese/kana` | Hiragana / Katakana charts + voice picker |
| `/:lang/japanese/drill` | Kana drill |
| `/:lang/japanese/edit` | Edit decks (Manage; placeholder) |
| `/:lang/japanese/decks/:deckId` | Deck details (any deck type) |
| `/:lang/japanese/vocab` | Vocabulary decks (deck list UI) |
| `/:lang/japanese/vocab/:deckId` | Browse a vocabulary deck |
| `/:lang/japanese/render` | Render decks (deck list UI) |
| `/:lang/japanese/render/:deckId` | Read a render deck |
| `/:lang/japanese/exam` | Exam decks (deck list UI) |
| `/:lang/japanese/exam/:deckId` | Run an exam |
| `/:lang/japanese/review` | Review decks (deck list UI) |
| `/:lang/japanese/review/:deckId` | Flashcard / spaced review of a deck |

### English track

The hub, deck-list browsing, deck management, and per-deck session routes are in place; the alphabet and drill are still to come.

| Route | Page |
|-------|------|
| `/:lang/english` | English hub |
| `/:lang/english/alphabet` | Alphabet chart + voice picker |
| `/:lang/english/drill` | Alphabet drill |
| `/:lang/english/edit` | Edit decks (Manage; placeholder) |
| `/:lang/english/decks/:deckId` | Deck details (any deck type) |
| `/:lang/english/vocab` | Vocabulary decks (deck list UI) |
| `/:lang/english/vocab/:deckId` | Browse a vocabulary deck |
| `/:lang/english/render` | Render decks (deck list UI) |
| `/:lang/english/render/:deckId` | Read a render deck |
| `/:lang/english/exam` | Exam decks (deck list UI) |
| `/:lang/english/exam/:deckId` | Run an exam |
| `/:lang/english/review` | Review decks (deck list UI) |
| `/:lang/english/review/:deckId` | Flashcard / spaced review of a deck |

### Korean track *(planned)*

| Route | Page |
|-------|------|
| `/:lang/korean` | Korean hub |
| `/:lang/korean/hangul` | Hangul chart + voice picker |
| `/:lang/korean/drill` | Hangul drill |
| `/:lang/korean/render` | Render decks (deck list UI) |
| `/:lang/korean/render/:deckId` | Read a render deck |
| `/:lang/korean/vocab` | Vocabulary decks (deck list UI) |
| `/:lang/korean/vocab/:deckId` | Browse a vocabulary deck |
| `/:lang/korean/exam` | Exam decks (deck list UI) |
| `/:lang/korean/exam/:deckId` | Run an exam |
| `/:lang/korean/review` | Review decks (deck list UI) |
| `/:lang/korean/review/:deckId` | Flashcard / spaced review of a deck |

### Chinese track *(planned)*

| Route | Page |
|-------|------|
| `/:lang/chinese` | Chinese hub |
| `/:lang/chinese/hanzi` | Hanzi chart + voice picker |
| `/:lang/chinese/drill` | Hanzi drill |
| `/:lang/chinese/render` | Render decks (deck list UI) |
| `/:lang/chinese/render/:deckId` | Read a render deck |
| `/:lang/chinese/vocab` | Vocabulary decks (deck list UI) |
| `/:lang/chinese/vocab/:deckId` | Browse a vocabulary deck |
| `/:lang/chinese/exam` | Exam decks (deck list UI) |
| `/:lang/chinese/exam/:deckId` | Run an exam |
| `/:lang/chinese/review` | Review decks (deck list UI) |
| `/:lang/chinese/review/:deckId` | Flashcard / spaced review of a deck |

### Thai track *(planned)*

| Route | Page |
|-------|------|
| `/:lang/thai` | Thai hub |
| `/:lang/thai/alphabet` | Thai alphabet chart + voice picker |
| `/:lang/thai/drill` | Alphabet drill |
| `/:lang/thai/render` | Render decks (deck list UI) |
| `/:lang/thai/render/:deckId` | Read a render deck |
| `/:lang/thai/vocab` | Vocabulary decks (deck list UI) |
| `/:lang/thai/vocab/:deckId` | Browse a vocabulary deck |
| `/:lang/thai/exam` | Exam decks (deck list UI) |
| `/:lang/thai/exam/:deckId` | Run an exam |
| `/:lang/thai/review` | Review decks (deck list UI) |
| `/:lang/thai/review/:deckId` | Flashcard / spaced review of a deck |

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