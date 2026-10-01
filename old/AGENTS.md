# AGENTS.md

Guidance for AI coding agents working on **ChocoMemo** (`client/`). Read this before making changes. If something here conflicts with what the user asks in the conversation, the user wins.

## Project summary

ChocoMemo is a multi-language learning web app (Japanese implemented; English, Korean, Chinese, Thai planned). Users study character sets, vocabulary, exam and review, and can share decks.

- **Client:** React + React Router v7 (framework mode, SSR) + TypeScript, in `client/`
- **Server:** NestJS (separate package, not covered by this file)
- **State:** Zustand (`persist`) · **i18n:** i18next · **Styling:** Tailwind CSS · **Animation:** Framer Motion

## Commands

Use **pnpm only**. Never use npm or yarn, and never commit a different lockfile.

```bash
pnpm install
pnpm dev          # dev server
pnpm build        # production build
pnpm start        # serve the production build
pnpm typecheck    # run after every non-trivial change
```

Always run `pnpm typecheck` before saying a task is done.

## Working with the user

- **Ask before reading a file** if you are not sure it is relevant. The user is happy to answer "which file?" rather than have you guess or scan the whole repo.
- Do not read or print `.env`, `.env.production.local`, or any secret. Environment values are accessed through `app/secure/env.ts`.
- Reply to the user in **Thai** unless they write in another language. Code, comments, commit messages and identifiers stay in **English**.

## Code style

### Language and typing
- TypeScript everywhere. No `any` unless unavoidable, and explain why in a comment.
- Prefer `interface` for object shapes and `type` for unions. Shared types live in `app/types/`.
- Comments are **JSDoc, in English**. Document every exported function, component, hook and type. Explain the *why*, not the obvious *what*.

```ts
/** Picks the next question, skipping ids already answered in this session. */
export function pickNextQuestion(...) {}
```

### Keep files small and focused
Do **not** put large logic in a single file or a single component. Files must never feel crammed.

- One component per file. Split a component when it mixes concerns or grows past roughly 150–200 lines.
- Move stateful logic into a hook (`app/hooks/` or the feature's own `hooks/` folder).
- Move pure helpers into `app/utils/`. Move static data into `app/data/`. Move types into `app/types/`.
- Prefer several small, well-named files over one large one. Extract sub-components (`components/` folder next to the page) instead of nesting big JSX blocks.

## Project structure

```
client/
  app/
    routes.ts            # route config
    routes/              # thin route modules (loader/meta + render a page)
      $lang.tsx          # locale layout (validates :lang)
      layout.tsx
      not-found.tsx
      page/              # route modules, mirrors URL structure
        japanese/        # /:lang/japanese/*
    pages/               # actual page UI, one folder per page/feature
      japanese/<feature>/{components,content,hooks}/
    components/
      custom/            # design-system primitives (Button, Card, Modal, ...)
      container/         # shared deck UI (DecksList, DeckCard, ExamSetCard)
      layout/            # navbar, footer
      auth/  config/  provider/
    hooks/  stores/  services/  utils/  types/  data/  constants/  secure/
    i18n/                # index.ts, locales.ts, routing.tsx, locales/*.json
  public/                # static assets (sounds, icons)
```

Rules of thumb:
- Route modules in `app/routes/` stay **thin**. UI lives in `app/pages/`.
- Reusable primitives go in `components/custom/`. Do not duplicate them inside a page.
- **Never edit generated output:** `.react-router/` (typegen) and `build/`.

## Routing

- Every route is nested under **`/:lang`** (the i18n locale segment), account pages included: `/:lang/settings`, `/:lang/profile`, `/:lang/profile/:nameTag`.
- Language tracks live under the language name: `/:lang/japanese/...`, later `/:lang/english/...`, `/:lang/korean/...`, `/:lang/chinese/...`, `/:lang/thai/...`.
- Each track has: hub, a character set page, a drill, then `render`, `vocabulary`, `exam`, `review`.
- Character set naming per language: `kana` (ja), `alphabet` (en, th), `hangul` (ko), `hanzi` (zh); drills use `<name>-drill`.
- Feature name is **`render`** (not `reading`, not `ebook`).
- Use the locale-aware link/navigate helpers from `app/i18n/routing.tsx` so links keep the current `:lang`. Ask the user before reading it if you need its API.

## Shared deck UI

`render`, `vocabulary`, `exam` and `review` all use the **same deck-list page and card components** (`components/container/`). They differ only in the data they load and what happens when a deck opens. When adding to one, prefer extending the shared component over copying it into a feature folder.

Deck types are in `app/types/deck.ts` (`DeckData`, `DeckMeta`, `DeckSource`). Decks come from `default`, `local` or (planned) `cloud` sources.

## Styling

- Tailwind CSS with the project's **semantic tokens** (`bg-primary`, `text-primary-foreground`, `bg-surface`, `border-line`, ...). Do not hardcode hex colors for theme-able UI.
- Themes are driven by `theme.store.ts`. New UI must work in every theme.
- Conditional class merging must resolve conflicts properly (a later `bg-*` must beat an earlier one). Use the project's class-merge helper rather than plain string concatenation.

## State

- Stores are `app/stores/<name>.store.ts` using Zustand. Persist only what must survive a reload.
- Keep stores small and single-purpose. Derived data belongs in selectors or hooks, not stored.

## Internationalization (important)

All user-facing text must come from i18next. **Never hardcode UI strings** in components.

**Locale update rule:**
1. When you add or change a string, edit **only `app/i18n/locales/en-US.json`**.
2. **Do not touch the other locale files** (`th-TH`, `ja-JP`, `ko-KR`, `zh-CN`, and the rest). The user will sync them all in one batch later.
3. Do not add placeholder or copied English values to the other files.
4. Keep key names stable and descriptive (`feature.section.label`). Renaming or removing a key in `en-US.json` should be mentioned to the user, since other locales will need the same change.
5. At the end of the task, list the new/changed/removed keys so the user can batch-translate them.

## Definition of done

- `pnpm typecheck` passes.
- No new hardcoded UI strings; new keys exist in `en-US.json` only.
- New files have JSDoc on exports and no file is overstuffed.
- No edits to generated folders, secrets, or unrelated locale files.