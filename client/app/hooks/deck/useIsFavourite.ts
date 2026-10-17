// Whether one deck is in the viewer's favourites, in a form that is safe to
// render during SSR.
//
// Favourites are persisted, so they are rehydrated before the first client
// render while the server has none at all. Rendering a favourited deck as
// favourited on the client but not on the server is a mismatch, so the answer
// stays `false` until the component has mounted.
import { useEffect, useState } from 'react';
import { useFavouritesStore } from '~/stores/deck/favourites.store';

export function useIsFavourite(deckId: string): boolean {
    const favourited = useFavouritesStore((state) => Boolean(state.ids[deckId]));
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    return mounted && favourited;
}
