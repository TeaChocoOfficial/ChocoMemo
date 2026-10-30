import type { DeckSource, DeckType } from '~/types/deck';

/** The deck types the editor can file a deck under, in the order the pickers
 *  offer them. */
export const DECK_TYPES: DeckType[] = ['vocab', 'render', 'review', 'exam'];

/** Sources the viewer does not own. Decks from one of these ship inside the app
 *  or were published by someone else, so the editor shows them read-only and a
 *  new deck can never be filed under them. */
export const LOCKED_DECK_SOURCES: DeckSource[] = ['official', 'community'];

/** A full screen of cards plus room to spare. The list reveals further pages
 *  client-side for now; when the catalogue outgrows that, `fetchMore` is
 *  already there and the reveal becomes a trigger for it. */
export const PAGE_SIZE = 40;