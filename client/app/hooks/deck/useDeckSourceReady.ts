// Whether a deck source is still fetching, i.e. whether a skeleton is honest.
//
// Only the two server-backed sources can be in that state. `local` is out of
// `localStorage`, which zustand rehydrates synchronously before the first
// client render, and `official` decks ship in the bundle — neither has anything
// to wait for, and putting a skeleton in front of them would be a lie.
//
// Derived state only: this reads the stores, it never writes to them.
import { useEffect } from 'react';
import type { DeckListStatus, DeckSource } from '~/types/deck';
import { ALL_TARGETS, languages, type Languages, type TargetFilter } from '~/data/language';
import { useDeckListCloudStore } from '~/stores/deck/deckListCloud.store';
import { useDeckListCommunityStore } from '~/stores/deck/deckListCommunity.store';


/**
 * @returns `true` while the source still owes the UI its decks, so the caller
 * should show a skeleton instead of an empty state.
 */
export function useDeckSourceReady(language: TargetFilter, source: DeckSource): boolean {
    const cloudStatus = useDeckListCloudStore((state) => state.status);
    const communityStatus = useDeckListCommunityStore((state) => state.status);

    useEffect(() => {
        // The remote stores are never asked to load on their own, so a tab that
        // has not been visited stays `idle`; kick them off here. Both fail soft,
        // so this settles quickly either way. The "all languages" filter has no
        // single list to ask for, so it asks for every language in turn.
        const targets = language === ALL_TARGETS ? languages.map((entry) => entry.id) : [language];
        if (source === 'cloud')
            targets.forEach((id) => void useDeckListCloudStore.getState().fetchDecks(id));
        if (source === 'community')
            targets.forEach((id) => void useDeckListCommunityStore.getState().fetchDecks(id));
    }, [language, source]);

    /** True once every requested language has settled, so "all" waits for all. */
    const isReady = (status: Partial<Record<Languages, DeckListStatus>>): boolean =>
        language === ALL_TARGETS
            ? languages.every((entry) => status[entry.id] === 'ready')
            : status[language] === 'ready';

    // `status` starts undefined rather than 'idle', so an unvisited source
    // counts as pending on the server render too — which is right, because the
    // server genuinely has nothing. The client's first render agrees, so no
    // hydration mismatch.
    switch (source) {
        case 'cloud':
            return !isReady(cloudStatus);
        case 'community':
            return !isReady(communityStatus);
        default:
            // `local` and `official` are synchronous, and so is any source added
            // later until somebody says otherwise. Defaulting to "not loading"
            // keeps a new source safe: a skeleton that never goes away is worse
            // than one that never appeared.
            return false;
    }
}
