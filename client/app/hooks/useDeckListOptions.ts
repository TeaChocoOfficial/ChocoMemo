// -Path: 'client/app/hooks/useDeckListOptions.ts'
import { useEffect, useState } from 'react';
import type { DeckListOptions } from '~/stores/config/deckList.store';
import { DEFAULT_DECK_LIST_OPTIONS, useDeckListStore } from '~/stores/config/deckList.store';

/**
 * The persisted deck-list options, read only after mount. Gate on hydration so
 * the server render and the client's first paint agree on the defaults rather
 * than flashing a stored preference and tripping a hydration mismatch.
 */
export function useDeckListOptions(): DeckListOptions {
    const targetLang = useDeckListStore((state) => state.targetLang);
    const sort = useDeckListStore((state) => state.sort);
    const density = useDeckListStore((state) => state.density);
    const nsfw = useDeckListStore((state) => state.nsfw);
    const [hydrated, setHydrated] = useState(false);

    useEffect(() => setHydrated(true), []);

    return hydrated ? { targetLang, sort, density, nsfw } : DEFAULT_DECK_LIST_OPTIONS;
}
