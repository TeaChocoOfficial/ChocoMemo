# ChocoMemo

**ChocoMemo** is a multi-language learning web application focused on helping users practice and memorize Japanese. It combines reference charts, interactive quizzes, speech (TTS), and per-user settings into a clean, responsive app.

Built with **React Router v7 (framework mode)**, **TypeScript**, **Zustand**, **i18next**, and **Tailwind CSS**.

> Currently only the **Japanese** track is implemented. **English** is planned as a future track and is shown on the language-select screen as "Coming Soon".

---

## ✨ Features

### Language Select
Choose which language to study. Japanese is active; English appears but is disabled ("Coming Soon").

### Japanese Hub
The hub links to the two core learning features.

### Basic Characters
Browse **Hiragana** and **Katakana** reference charts, organized into three groups:
- **Voiceless** (清音 — seion)
- **Voiced** (濁音・半濁音 — dakuten / handakuten)
- **Contracted** (拗音 — yōon)

Each character card is clickable and will **speak the character aloud** using the browser's Web Speech API.

### Character Quiz
A fully configurable multiple-choice quiz:

- **Character groups** — toggle Hiragana / Katakana and any combination of Voiceless / Voiced / Contracted; each switch shows the character count it adds, plus a running total.
- **Question set** — toggle between *all* characters in the selected groups or a specific *number* (2–12).
- **Per-question timer** (1–20s) with a countdown bar.
- **Auto-advance** — optionally hide the Next button and advance automatically.
- **Live stats** during play — Correct / Wrong / Timeout counters.
- **End Game** at any time to return to settings.
- **Detailed results** — score rank, score bar, a Correct / Wrong / Timeout breakdown, a settings summary, a scrollable answer history per question, and Play Again / Settings / Exit actions.

### Vocabulary Quiz
Test vocabulary by matching a Japanese word to its meaning. Ships with a default word list and supports **adding your own custom words** via a manage dialog (persisted locally).

### Voice (TTS)
- Per-character click-to-speak on the character charts.
- A **Voice Picker** on the characters page to choose the TTS voice, language, and speech rate (with an "Auto" option and a preview button).

---

## 🧭 Routes

| Route | Page |
|-------|------|
| `/:lang` | Home |
| `/:lang/language-select` | Choose a language |
| `/:lang/japanese` | Japanese hub |
| `/:lang/japanese/characters` | Hiragana / Katakana charts + voice picker |
| `/:lang/japanese/characters/quiz` | Character quiz |
| `/:lang/japanese/vocabulary/quiz` | Vocabulary quiz |

> `:lang` is the active i18n locale segment (`en-US`, `th-TH`, `ja-JP`, `zh-CN`).

---

## 🧩 Code Layout

```
app/
  pages/
    home/                       # home landing
    language-select/            # pick a language
    japanese/
      Japanese.tsx              # hub
      characters/
        Characters.tsx
        components/
          CharacterGrid.tsx
          CharacterCard.tsx     # click-to-speak card
          CharacterSetTabs.tsx
          VoicePicker.tsx
        quiz/
          CharacterQuiz.tsx        # phase orchestration (intro/playing/result)
          hooks/
            useCharacterQuiz.ts   # engine: pool, timer, scoring, mode choices
          components/
            QuizIntro.tsx         # hero + settings + start
            QuizPlaying.tsx       # stats + timer + question + choices + feedback
            QuizStats.tsx         # live Correct / Wrong / Timeout + end game
            QuizTimer.tsx         # per-question countdown bar
            QuizFeedback.tsx      # correct/wrong/timeout + next
            QuizSettings.tsx      # groups × count × timer + mode + auto-advance
            QuizQuestion.tsx
            QuizChoices.tsx
            CharacterQuizResult.tsx # stats + answer history
      vocabulary/
        quiz/
          VocabularyQuiz.tsx
          components/
            VocabQuestion.tsx
            VocabChoices.tsx
            VocabResult.tsx
      quiz/
        components/
          QuizProgress.tsx          # shared progress bar
          QuizResult.tsx            # shared simple result
  components/
    custom/                     # Badge, Button, Card, Modal, RangeSlider,
                                # Select, Switch, Skeleton, Rating, Activity …
    layout/                     # Navbar, Footer
    config/                     # LanguageSwitcher, ThemePicker
  hooks/
    useQuizEngine.ts            # buildChoices / choice engine
    useSpeak.ts                 # Web Speech API wrapper
  stores/
    quizSettings.store.ts       # quiz settings (persisted)
    speech.store.ts             # voice language + rate (persisted)
    theme.store.ts              # theme (persisted)
    vocabulary.store.ts         # custom vocab (persisted)
  data/
    japanese/
      kana.ts                   # KANA_CHARS: voiceless / voiced / contracted
      vocabulary.ts             # DEFAULT_VOCABULARY
  i18n/
    locales/                    # en-US, ja-JP, zh-CN, th-TH JSON
```

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

---

## 🚀 Getting Started

Install dependencies:

```bash
pnpm install
```

Run the dev server:

```bash
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

---

## 🗺️ Roadmap

- [x] Home page
- [x] Language Select (Japanese active, English "Coming Soon")
- [x] Japanese hub
- [x] Basic Characters charts + click-to-speak + voice picker
- [x] Character Quiz (configurable, stats, history)
- [x] Vocabulary Quiz (default words + custom words)
- [ ] Progress tracking / persistence across sessions
- [ ] English language track