# Learn Choco Language

**Learn Choco Language** is a web application for learning, teaching, and practicing foreign languages. The project is built with **React Router (Vite)** on the client side, using **TypeScript**, **Zustand** for state, **i18next** for internationalization, and **Tailwind CSS** for styling.

Currently, only **Japanese** is available. **English** is planned for a future release but is not accessible yet.

---

## 🎯 Project Goal

Provide an interactive way to learn a language through:
- Reference material (characters, vocabulary)
- Practice modes (flashcards, quizzes)
- Progress tracking (planned)

---

## 🗺️ Feature Plan

### 1. Language Select
Landing page where the user picks which language to study.
- ✅ Japanese — available
- 🚧 English — shown as "Coming Soon" (disabled)

### 2. Japanese Hub
Once Japanese is selected, the user lands on a hub page with navigation to three core features:

| # | Page | Description |
|---|------|--------------|
| 1 | **Basic Characters** | Browse Hiragana & Katakana character charts (Seion, Dakuten, Handakuten, Yōon groupings). |
| 2 | **Character Quiz / Practice** | Test and reinforce memory of Hiragana & Katakana (flashcards, multiple choice, or typing recall). |
| 3 | **Vocabulary Quiz / Practice** | Test and reinforce memory of Japanese vocabulary (word ↔ meaning matching, multiple choice, spaced repetition-style review). |

---

## 🧭 Proposed Route Structure

```
/:lang/language-select        → choose a language to study
/:lang/japanese                → Japanese hub (links to the 3 features below)
/:lang/japanese/characters      → view Hiragana / Katakana charts
/:lang/japanese/characters/quiz → character quiz & practice
/:lang/japanese/vocabulary/quiz → vocabulary quiz & practice
```

> `:lang` refers to the existing i18n locale segment already used in the app's routing (`en-US`, `th-TH`, `ja-JP`, `zh-CN`).

---

## 🧩 Suggested Folder Structure

Following the existing convention in `pages/auth` (splitting into `panel/`, `components/content`, `components/custom`), new features should be split the same way to avoid large, monolithic files:

```
pages/
  language-select/
    LanguageSelect.tsx
    LanguageCard.tsx
  japanese/
    Japanese.tsx                 # hub page, links to sub-features
    JapaneseHero.tsx
    JapaneseNavCard.tsx
    characters/
      Characters.tsx
      components/
        CharacterGrid.tsx
        CharacterCard.tsx
        CharacterSetTabs.tsx     # switch between Hiragana / Katakana
      quiz/
        CharacterQuiz.tsx
        components/
          QuizQuestion.tsx
          QuizChoices.tsx
          QuizResult.tsx
          QuizProgress.tsx
    vocabulary/
      quiz/
        VocabularyQuiz.tsx
        components/
          VocabQuestion.tsx
          VocabChoices.tsx
          VocabResult.tsx
```

Quiz logic (state, scoring, timers, question generation) should live in dedicated hooks rather than inside the page components, e.g.:

```
app/
  hooks/
    useCharacterQuiz.ts
    useVocabularyQuiz.ts
```

Character and vocabulary source data should live under `app/data/`, similar to the existing `data/portfolioData.ts`:

```
data/
  japanese/
    hiragana.ts
    katakana.ts
    vocabulary.ts
```

---

## 🛣️ Roadmap

- [ ] Language Select page (Japanese enabled, English disabled/"Coming Soon")
- [ ] Japanese hub page
- [ ] Basic Characters page (Hiragana / Katakana charts)
- [ ] Character Quiz / Practice page
- [ ] Vocabulary Quiz / Practice page
- [ ] Progress tracking / persistence (local storage or backend)
- [ ] English language track (future)

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React Router (Vite) |
| Language | TypeScript |
| State | Zustand |
| i18n | i18next / react-i18next |
| Styling | Tailwind CSS |
| Animation | Framer Motion |
| HTTP | Axios |
| Package Manager | pnpm |

---

## 🚀 Getting Started

```bash
pnpm install
pnpm dev
```

Build for production:

```bash
pnpm build
pnpm start
```

Type check:

```bash
pnpm typecheck
```