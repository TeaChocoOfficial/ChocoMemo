// Reveals a long list a screenful at a time, the way a video feed does:
// the first page renders immediately and the rest appear as the sentinel at
// the bottom scrolls into view. Nothing is fetched — this only decides how
// much of an already-loaded list to hand to the DOM, which is what keeps a
// 200-deck library from paying for 200 cards on first paint.
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

/** How many items one page holds. */
const PAGE_SIZE = 12;

/** Distance from the sentinel at which the next page is already queued, so a
 *  fast scroll does not visibly stall between pages. */
const ROOT_MARGIN = '600px';

export interface IncrementalList<T> {
    /** The slice to render. */
    visible: T[];
    /** True while items remain, so the caller can mount the sentinel. */
    hasMore: boolean;
    /** Attach to the element below the list. */
    sentinelRef: (node: HTMLElement | null) => void;
}

/**
 * @param items The full list, already filtered.
 * @param resetKey Changing this drops back to the first page. A tab switch or
 *  a new search should start over; pass something like `` `${tab}:${search}` ``
 *  rather than an array, which would be a new reference on every render.
 */
export function useIncrementalList<T>(items: T[], resetKey: string): IncrementalList<T> {
    const [page, setPage] = useState(1);
    const observerRef = useRef<IntersectionObserver | null>(null);

    useEffect(() => {
        setPage(1);
    }, [resetKey]);

    const visible = useMemo(() => items.slice(0, page * PAGE_SIZE), [items, page]);
    const hasMore = visible.length < items.length;

    const sentinelRef = useCallback(
        (node: HTMLElement | null) => {
            observerRef.current?.disconnect();
            if (!node) return;

            // No observer (older browser, or a test environment without one):
            // show everything rather than stranding the list behind a sentinel
            // that will never fire.
            if (typeof IntersectionObserver === 'undefined') {
                setPage(Number.MAX_SAFE_INTEGER);
                return;
            }

            observerRef.current = new IntersectionObserver(
                (entries) => {
                    if (entries.some((entry) => entry.isIntersecting)) {
                        setPage((current) => current + 1);
                    }
                },
                { rootMargin: ROOT_MARGIN },
            );
            observerRef.current.observe(node);
        },
        // Re-subscribing on `resetKey` matters: a new list resets to page one
        // while the sentinel may still be on screen, and an observer only
        // reports the transition into view, so a reused one would sit silent.
        [resetKey],
    );

    useEffect(() => () => observerRef.current?.disconnect(), []);

    return { visible, hasMore, sentinelRef };
}
