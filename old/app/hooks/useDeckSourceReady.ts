// Whether a deck source is still fetching, i.e. whether a skeleton is honest.
//
// Only the two server-backed sources can be in that state. `local` is out of
// `localStorage`, which zustand rehydrates synchronously before the first
// client render, and `official` decks ship in the bundle — neither has anything
// to wait for, and putting a skeleton in front of them would be a lie.
//
// Derived state only: this reads the stores, it never writes to them.
import { useEffect } from 'react';
import type { DeckSource } from '~/types/deck';
import type { Languages } from '~/data/language';
import { useDeckListCloudStore } from '~/stores/deck/deckListCloud.store';
import { useDeckListCommunityStore } from '~/stores/deck/deckListCommunity.store';


/**
 * @returns `true` while the source still owes the UI its decks, so the caller
 * should show a skeleton instead of an empty state.
 */
export function useDeckSourceReady(language: Languages, source: DeckSource): boolean {
    const cloudStatus = useDeckListCloudStore((state) => state.status[language]);
    const communityStatus = useDeckListCommunityStore((state) => state.status[language]);

    useEffect(() => {
        // The remote stores are never asked to load on their own, so a tab that
        // has not been visited stays `idle`; kick them off here. Both fail soft,
        // so this settles quickly either way.
        if (source === 'cloud') void useDeckListCloudStore.getState().fetchDecks(language);
        if (source === 'community') void useDeckListCommunityStore.getState().fetchDecks(language);
    }, [language, source]);

    // `status` starts undefined rather than 'idle', so an unvisited source
    // counts as pending on the server render too — which is right, because the
    // server genuinely has nothing. The client's first render agrees, so no
    // hydration mismatch.
    switch (source) {
        case 'cloud':
            return cloudStatus !== 'ready';
        case 'community':
            return communityStatus !== 'ready';
        default:
            // `local` and `official` are synchronous, and so is any source added
            // later until somebody says otherwise. Defaulting to "not loading"
            // keeps a new source safe: a skeleton that never goes away is worse
            // than one that never appeared.
            return false;
    }
}
