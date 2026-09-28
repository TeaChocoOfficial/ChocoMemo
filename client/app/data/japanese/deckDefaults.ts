// Built-in decks, assembled into the shared `DeckData` model.
//
// The per-feature default sets live in `app/data/japanese/*` as their own
// shapes (vocab decks, render decks, exam sets). Each deck-list page needs all
// of them as `DeckData`, so the projections live here rather than being
// repeated in every page.
import type { DeckData, DeckLists } from '~/types/deck';
import type { ExamSet } from '~/types/exam';
import type { RenderDeck } from '~/types/render';
import { DEFAULT_DECKS } from '~/data/japanese/decks';
import { DEFAULT_RENDER_DECKS } from '~/data/japanese/renderDecks';
import { defaultExamSets } from '~/data/japanese/defaultExamSets';
import type { Languages } from '~/data/language';

/** Project a built-in render deck onto the deck model. */
function renderDeckToDeck(deck: RenderDeck): DeckData {
    return {
        id: deck.id,
        name: deck.name,
        description: deck.description,
        source: deck.source,
        type: 'render',
        tags: deck.tags,
        nsfw: deck.nsfw,
        contentIds: deck.passageIds,
    };
}

/** Project a built-in exam set onto the deck model. `ExamSet` has its own
 *  narrower sources, which collapse to the deck model's `local` / `default`. */
export function examSetToDeck(set: ExamSet): DeckData {
    return {
        id: set.id,
        name: set.title,
        description: set.description,
        source: set.source === 'default' ? 'default' : 'local',
        type: 'exam',
        tags: [],
        nsfw: false,
        contentIds: set.questions.map((q) => q.id),
    };
}

/** Built-in decks for a language, across every deck type. */
export function defaultDecks(_language: Languages): DeckData[] {
    return [
        ...DEFAULT_DECKS,
        ...DEFAULT_RENDER_DECKS.map(renderDeckToDeck),
        ...defaultExamSets.map(examSetToDeck),
    ];
}

/** Built-ins plus the user's own, for one language — the single source a
 *  deck-list page should read its `localItems` from. */
export function allDecksFor(language: Languages, localDecks: DeckData[]): DeckData[] {
    return [...defaultDecks(language), ...localDecks];
}

/** The shape `deckLists` is keyed by, for callers building one. */
export type { DeckLists };
