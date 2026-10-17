// -Path: 'client/app/hooks/useMediaQuery.ts'
import { useCallback, useSyncExternalStore } from 'react';

/** The server has no viewport, so assume the mobile-first default (no match). */
const serverSnapshot = () => false;

/**
 * Subscribes to a CSS media query so a component can branch its *markup* on
 * viewport size, not just its styles — useful when a desktop-only layout (like
 * a resizable split) must not be mounted on a phone at all.
 *
 * @param query - A media query string, e.g. `(min-width: 768px)`.
 * @returns `true` while the query matches on the client.
 */
export function useMediaQuery(query: string): boolean {
    const subscribe = useCallback(
        (onChange: () => void) => {
            const list = window.matchMedia(query);
            list.addEventListener('change', onChange);
            return () => list.removeEventListener('change', onChange);
        },
        [query],
    );

    const getSnapshot = useCallback(() => window.matchMedia(query).matches, [query]);

    return useSyncExternalStore(subscribe, getSnapshot, serverSnapshot);
}
