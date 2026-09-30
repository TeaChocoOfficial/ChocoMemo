// The body of a deck-list page: a source selector, a toolbar of view controls
// and filters, and a grid that fills in a screenful at a time.
//
// The view state lives in the URL — this component never owns tab, search,
// sort, density, nsfw or tags. It renders what `useDeckListQuery` hands down and
// calls its setters, so the address bar stays the single source of truth for
// what the viewer is looking at and every control on this page is shareable.
//
// The source selector and the options bar share one row: the tab strip sets the
// scope, the options refine it, and keeping them adjacent is what makes the
// page read as a single control surface rather than two stacked widgets.
import { useTranslation } from 'react-i18next';
import DeckCard from '~/components/container/DeckCard/DeckCard';
import type { DeckListQueryControls } from '~/hooks/useDeckListQuery';
import DeckListEmpty from './DeckListEmpty';
import DeckListSkeleton from './DeckListSkeleton';
import SourceTally from './SourceTally';
import DeckListSearch from './DeckListSearch';
import DeckTagFilter from './DeckTagFilter';
import DeckListOptions from './DeckListOptions';
import { useDeckCounts } from '~/hooks/useDecksForTab';
import { useDeckListActions } from './DeckListActions';
import { useDeckListDecks } from '~/hooks/useDeckListDecks';
import { useAuthStore } from '~/stores/config/auth.store';
import type { DeckType } from '~/types/deck';
import type { DeckListQuery } from '~/types/deckList';
import type { Languages } from '~/data/language';

/** Details page for a deck. Shared by every type and language, so the list
 *  never has to know that a session lives behind a different route. */
const deckPath = (language: Languages) => `/${language}/decks/`;

/** Column count per density. Comfortable is the roomy default; compact trades
 *  card size for a denser scan, which is why it also tightens the gutters. */
const GRID = {
    comfortable: 'grid-cols-1 gap-x-4 gap-y-9 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
    compact: 'grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6',
} as const;

export default function DeckList({
    type,
    language,
    query,
    controls,
}: {
    type: DeckType;
    language: Languages;
    /** The view state parsed out of the URL by `useDeckListQuery`. */
    query: DeckListQuery;
    /** The setters from the same hook, forwarded so the page shell owns the URL
     *  and this component never reaches for the router itself. */
    controls: DeckListQueryControls;
}) {
    const { t } = useTranslation();
    const { setTab, setSearch, setSort, setDensity, setNsfw, toggleTag, reset } = controls;
    const counts = useDeckCounts(language, type);
    const actions = useDeckListActions(language, type);
    const {
        visible,
        matched,
        total,
        availableTags,
        isLoading,
        isNarrowedEmpty,
        sentinelRef,
    } = useDeckListDecks(language, type, query);

    // `user` is `undefined` while the session is still being fetched, which
    // reads as signed out — the same as the server, so the first render on
    // either side agrees and React reports no hydration mismatch.
    const isSignedIn = useAuthStore((state) => state.user != null);

    // Three genuinely different problems, so three different explanations.
    // A tab that simply has nothing in it, a query that hid everything, and a
    // cloud tab that is empty *because* there is no session are not the same
    // message, and only the last one has something to offer.
    const emptyCopy = isNarrowedEmpty
        ? 'deck.empty.filtered'
        : !query.search.trim() && query.tags.length === 0
          ? query.tab === 'cloud' && isSignedIn
              ? 'deck.empty.cloudSignedIn'
              : `deck.empty.${query.tab}`
          : 'deck.noResults';

    // Only offer a way out where there is one, and only while it would work. A
    // narrowed list can always be widened. A local tab can hand the viewer the
    // bundled decks, which is a tab away. A cloud tab can open the sign-in
    // modal — the app's actual sign-in surface, mounted by the navbar; there is
    // no sign-in page, `/:lang/auth` is the OAuth callback that lands back
    // home. The other tabs are simply empty for now, and an empty state with no
    // exit is honest.
    const emptyAction = isNarrowedEmpty
        ? { label: t('deck.empty.filtered.action'), onClick: reset }
        : query.tab === 'local'
          ? { label: t('deck.empty.local.action'), onClick: () => setTab('official') }
          : query.tab === 'cloud' && !isSignedIn
            ? {
                  label: t('deck.empty.cloud.action'),
                  onClick: () => useAuthStore.getState().setOpen(true),
              }
            : undefined;

    return (
        <div className='mt-8'>
            <SourceTally counts={counts} active={query.tab} onSelect={setTab} />

            <div className='my-4 flex flex-col gap-3'>
                <DeckListSearch
                    value={query.search}
                    onChange={setSearch}
                    onClear={() => setSearch('')}
                />
                <DeckListOptions
                    query={query}
                    onSortChange={setSort}
                    onDensityChange={setDensity}
                    onNsfwChange={setNsfw}
                    actions={actions}
                />
                <DeckTagFilter
                    tags={availableTags}
                    selected={query.tags}
                    onToggle={toggleTag}
                    onClear={() => controls.push({ tags: [] })}
                />
            </div>

            {isLoading ? (
                <DeckListSkeleton />
            ) : matched === 0 ? (
                <DeckListEmpty copy={emptyCopy} action={emptyAction} />
            ) : (
                <>
                    <p className='sr-only' role='status' aria-live='polite'>
                        {t('deck.resultCount', { matched, total })}
                    </p>
                    <div className={`grid ${GRID[query.density]}`}>
                        {visible.map((deck, index) => (
                            <DeckCard key={deck.id} to={deckPath(language)} deck={deck} index={index} />
                        ))}
                    </div>
                    {/* The sentinel is what the observer watches: as it nears the
                        viewport, the next page is appended. */}
                    {sentinelRef && <div ref={sentinelRef} aria-hidden='true' className='h-px w-full' />}
                </>
            )}
        </div>
    );
}