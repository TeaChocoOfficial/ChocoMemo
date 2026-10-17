// -Path: 'client/app/components/edit/useDeckStoreHydrated.ts'
import { useEffect, useState } from 'react';
import { useDeckListLocalStore } from '~/stores/deck/deckListLocal.store';

/**
 * Whether the local deck store has finished rehydrating from storage. Always
 * `false` on the server and on the first client paint, so the editor can show a
 * skeleton instead of a briefly-empty collection; the persist API is only
 * touched inside the effect, where it is guaranteed to exist.
 *
 * @returns `true` once persisted decks are available.
 */
export function useDeckStoreHydrated(): boolean {
    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
        const persist = useDeckListLocalStore.persist;
        if (!persist || persist.hasHydrated()) return setHydrated(true);
        return persist.onFinishHydration(() => setHydrated(true));
    }, []);

    return hydrated;
}
