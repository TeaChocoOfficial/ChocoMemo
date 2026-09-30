// Built-in decks, assembled into the shared `DeckData` model.
//
// The bundled content lives in `app/data/japanese/*` under the shapes each
// feature wants (vocab decks, render decks, exam sets). Every deck-list page
// and the deck details page need them as `DeckData`, so the projections live
// here once instead of being repeated per page.
import type { DeckData } from '~/types/deck';
import type { ExamSet } from '~/types/deck/exam';
import type { RenderDeck } from '~/types/deck/render';
import { DEFAULT_DECKS } from '~/data/japanese/decks';
import { DEFAULT_RENDER_DECKS } from '~/data/japanese/renderDecks';
import { defaultExamSets } from '~/data/japanese/defaultExamSets';
import { Languages } from '~/data/language';
import { shippedDeckMeta } from '~/utils/deckMeta';

/** Languages with bundled content. The data in `app/data/japanese` is
 *  Japanese, so every other track has nothing official to list yet.
 *  @todo Drop an entry as each track gets its own bundled decks. */
const BUNDLED_LANGUAGES: readonly Languages[] = [Languages.ja];

/** Project a bundled render deck onto the deck model. Its passages become
 *  `contentIds`, the same way a vocab deck's words do. */
function renderDeckToDeck(deck: RenderDeck): DeckData {
    return {
        id: deck.id,
        name: deck.name,
        description: deck.description,
        source: 'official',
        type: 'render',
        tags: deck.tags,
        nsfw: deck.nsfw,
        contentIds: deck.passageIds,
        meta: shippedDeckMeta(),
    };
}

/** Project a bundled exam set onto the deck model. `ExamSet` calls its title a
 *  title; a deck calls the same string a name. */
function examSetToDeck(set: ExamSet): DeckData {
    return {
        id: set.id,
        name: set.title,
        description: set.description,
        source: 'official',
        type: 'exam',
        tags: [],
        nsfw: false,
        contentIds: set.questions.map((question) => question.id),
        meta: shippedDeckMeta(),
    };
}

/** Every deck that ships with the app for a language, across all deck types.
 *  `DEFAULT_DECKS` are already in the deck model, so they pass straight
 *  through. */
export function officialDecks(language: Languages): DeckData[] {
    if (!BUNDLED_LANGUAGES.includes(language)) return [];
    return [
        ...DEFAULT_DECKS,
        ...DEFAULT_RENDER_DECKS.map(renderDeckToDeck),
        ...defaultExamSets.map(examSetToDeck),
    ];
}

/** Bundled decks of one type, as a deck-list tab wants them. */
export function officialDecksOfType(language: Languages, type: DeckData['type']): DeckData[] {
    return officialDecks(language).filter((deck) => deck.type === type);
}
