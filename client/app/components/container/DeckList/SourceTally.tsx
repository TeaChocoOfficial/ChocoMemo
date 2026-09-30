// -Path: 'client/app/components/container/DeckList/SourceTally.tsx'
// The source selector: one tab per source, each carrying its own live count.
//
// This used to be two controls — a grid of big figures above a separate
// underlined tab bar — which spent a full screen's worth of vertical space
// saying the same four words twice and asked the viewer to learn that the
// figure and the tab below it were the same thing. Collapsed into one strip, a
// source is a single affordance: click the number to see those decks, and the
// underline marks where you are.
//
// The counts stay visible even for a source that is still loading, because the
// number is what tells the viewer the tab is worth clicking at all.
import { useTranslation } from 'react-i18next';
import { DECK_SOURCE_TABS } from '~/utils/deckListQuery';
import type { DeckSource, DeckSourceTab } from '~/types/deck';

export default function SourceTally({
    counts,
    active,
    onSelect,
}: {
    /** Deck count per source, from `useDeckCounts`. */
    counts: Record<DeckSource, number>;
    /** The source currently on screen. */
    active: DeckSourceTab;
    onSelect: (source: DeckSourceTab) => void;
}) {
    const { t } = useTranslation();

    return (
        <div
            role='tablist'
            aria-label={t('deck.tallyAria')}
            className='-mb-px flex items-end gap-1 overflow-clip overflow-x-auto border-b border-line'
        >
            {DECK_SOURCE_TABS.map((source) => {
                const count = counts[source];
                const isActive = source === active;

                return (
                    <button
                        key={source}
                        type='button'
                        role='tab'
                        aria-selected={isActive}
                        onClick={() => onSelect(source)}
                        className={`relative flex shrink-0 cursor-pointer items-baseline gap-2 px-3 py-2.5 transition-colors duration-200 ${
                            isActive
                                ? 'text-primary'
                                : 'text-surface-muted hover:text-surface-foreground'
                        }`}
                    >
                        <span className='text-sm font-semibold tracking-tight'>
                            {t(`common.tabs.${source}`)}
                        </span>
                        {/* The count is the value, so it is announced as part of
                            the tab rather than as a separate list item. */}
                        <span
                            className={`font-mono text-xs tabular-nums ${
                                isActive ? 'text-primary' : 'text-surface-muted'
                            }`}
                        >
                            {count}
                        </span>
                        {/* Sits on the container's border rather than inside
                            the button, so the active tab reads as continuous
                            with the rule below it instead of underlined by a
                            second line. */}
                        {isActive && (
                            <span
                                aria-hidden='true'
                                className='absolute inset-x-0 -bottom-px h-0.5 bg-primary'
                            />
                        )}
                    </button>
                );
            })}
        </div>
    );
}