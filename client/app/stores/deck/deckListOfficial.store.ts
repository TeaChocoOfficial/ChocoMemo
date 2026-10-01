// Deck lists that ship inside the app bundle.
//
// The `official` tab is the odd one out among the deck stores: its decks are
// deck is authored in `app/data/<language>/deck` and evaluated with the bundle, so
// there is nothing to fetch and nothing to persist. Persisting would be worse
// than useless — a stale localStorage copy would outlive the code that shipped
// the deck and shadow it — so the list is seeded from the data module and never
// written to. It is also read-only: an official deck belongs to the app, so
// unlike the local, cloud and community stores there is no `add`/`update`/
// `remove` to offer.
import { create } from 'zustand';
import { deckListOfficialData } from '~/data/japanese/deck/deckListOfficialData';
import type { Languages } from '~/data/language';
import type { DeckData, DeckLists, DeckType } from '~/types/deck';

interface DeckListOfficialState {
    /** language id -> the decks that ship with the app in that language.
     *  Read straight from the data module, so it is complete on the server
     *  render and on the client's first paint alike. */
    deckLists: DeckLists;
}

export const useDeckListOfficialStore = create<DeckListOfficialState>(() => ({
    deckLists: deckListOfficialData,
}));

/** The bundled decks for a language, across every deck type. */
export function officialDecks(language: Languages): DeckData[] {
    return useDeckListOfficialStore.getState().deckLists[language] ?? [];
}

/** Bundled decks of one type, as a deck-list tab wants them. */
export function officialDecksOfType(language: Languages, type: DeckType): DeckData[] {
    return officialDecks(language).filter((deck) => deck.type === type);
}
