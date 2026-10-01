// What a deck-list tab holds, and how many.
//
// Kept out of the components so the page shell and the list agree on the
// numbers: the header says "12 decks" and the tab says the same, from one
// read. `official` is the odd one out — its decks ship in the bundle, so it
// reads static data while the other three read stores.
import { useMemo } from 'react';
import type { DeckData, DeckSource, DeckType } from '~/types/deck';
import type { Languages } from '~/data/language';
import { officialDecksOfType } from '~/data/japanese/officialDecks';
import { useDeckListLocalStore } from '~/stores/deck/deckListLocal.store';
import { useDeckListCloudStore } from '~/stores/deck/deckListCloud.store';
import { useDeckListCommunityStore } from '~/stores/deck/deckListCommunity.store';


/** The decks one tab shows, or an empty list while its store rehydrates. */
export function useDecksForTab(
    language: Languages,
    type: DeckType,
    tab: DeckSource,
): DeckData[] {
    const localLists = useDeckListLocalStore((state) => state.deckLists);
    const cloudLists = useDeckListCloudStore((state) => state.deckLists);
    const communityLists = useDeckListCommunityStore((state) => state.deckLists);

    return useMemo(() => {
        const byType = (decks: DeckData[]) => decks.filter((deck) => deck.type === type);
        if (tab === 'local') return byType(localLists[language] ?? []);
        if (tab === 'official') return byType(officialDecksOfType(language, type));
        if (tab === 'cloud') return byType(cloudLists[language] ?? []);
        return byType(communityLists[language] ?? []);
    }, [tab, type, language, localLists, cloudLists, communityLists]);
}

/** Deck count per tab, for the tab labels and the page header. */
export function useDeckCounts(
    language: Languages,
    type: DeckType,
): Record<DeckSource, number> {
    const localLists = useDeckListLocalStore((state) => state.deckLists);
    const cloudLists = useDeckListCloudStore((state) => state.deckLists);
    const communityLists = useDeckListCommunityStore((state) => state.deckLists);

    return useMemo(() => {
        const count = (decks: DeckData[]) => decks.filter((deck) => deck.type === type).length;
        return {
            local: count(localLists[language] ?? []),
            official: officialDecksOfType(language, type).length,
            cloud: count(cloudLists[language] ?? []),
            community: count(communityLists[language] ?? []),
        };
    }, [type, language, localLists, cloudLists, communityLists]);
}
