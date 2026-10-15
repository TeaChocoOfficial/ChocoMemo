// What a deck-list tab holds, and how many.
//
// Kept out of the components so the page shell and the list agree on the
// numbers: the header says "12 decks" and the tab says the same, from one
// read. `official` is the odd one out — its store is seeded from the bundled
// data rather than fetched, so it is already complete on the first paint.
import { useMemo } from 'react';
import type { DeckData, DeckLists, DeckSource, DeckType } from '~/types/deck';
import { ALL_TARGETS, languages, type TargetFilter } from '~/data/language';
import { officialDecksOfType } from '~/stores/deck/deckListOfficial.store';
import { useDeckListLocalStore } from '~/stores/deck/deckListLocal.store';
import { useDeckListCloudStore } from '~/stores/deck/deckListCloud.store';
import { useDeckListCommunityStore } from '~/stores/deck/deckListCommunity.store';


/** Every language's decks in a store, flattened for the "all languages" filter. */
const allDecks = (lists: DeckLists): DeckData[] =>
    Object.values(lists).flatMap((decks) => decks ?? []);

/** The decks one tab shows, or an empty list while its store rehydrates. */
export function useDecksForTab(
    language: TargetFilter,
    type: DeckType,
    tab: DeckSource,
): DeckData[] {
    const localLists = useDeckListLocalStore((state) => state.deckLists);
    const cloudLists = useDeckListCloudStore((state) => state.deckLists);
    const communityLists = useDeckListCommunityStore((state) => state.deckLists);

    return useMemo(() => {
        const byType = (decks: DeckData[]) => decks.filter((deck) => deck.type === type);
        if (tab === 'official') {
            return language === ALL_TARGETS
                ? languages.flatMap((entry) => officialDecksOfType(entry.id, type))
                : byType(officialDecksOfType(language, type));
        }
        const lists = tab === 'local' ? localLists : tab === 'cloud' ? cloudLists : communityLists;
        const decks = language === ALL_TARGETS ? allDecks(lists) : (lists[language] ?? []);
        return byType(decks);
    }, [tab, type, language, localLists, cloudLists, communityLists]);
}

/** Deck count per tab, for the tab labels and the page header. */
export function useDeckCounts(
    language: TargetFilter,
    type: DeckType,
): Record<DeckSource, number> {
    const localLists = useDeckListLocalStore((state) => state.deckLists);
    const cloudLists = useDeckListCloudStore((state) => state.deckLists);
    const communityLists = useDeckListCommunityStore((state) => state.deckLists);

    return useMemo(() => {
        const count = (decks: DeckData[]) => decks.filter((deck) => deck.type === type).length;
        const pick = (lists: DeckLists): DeckData[] =>
            language === ALL_TARGETS ? allDecks(lists) : (lists[language] ?? []);
        const official =
            language === ALL_TARGETS
                ? languages.flatMap((entry) => officialDecksOfType(entry.id, type))
                : officialDecksOfType(language, type);
        return {
            local: count(pick(localLists)),
            official: official.length,
            cloud: count(pick(cloudLists)),
            community: count(pick(communityLists)),
        };
    }, [type, language, localLists, cloudLists, communityLists]);
}
