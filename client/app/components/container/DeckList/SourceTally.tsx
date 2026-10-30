// -Path: 'client/app/components/container/DeckList/SourceTally.tsx'
import { useTranslation } from 'react-i18next';
import type { DeckSource } from '~/types/deck';
import SetTabs from '~/components/custom/SetTabs';
import { DECK_SOURCE_SOURCES } from '~/utils/deck/deckListQuery';

/** Props for {@link SourceTally}. */
interface SourceTallyProps {
    /** Deck count per source, from `useDeckCounts`. */
    counts: Record<DeckSource, number>;
    /** The source currently on screen. */
    active: DeckSource;
    /** Fired with the source the viewer picked. */
    onSelect: (source: DeckSource) => void;
}

/**
 * The source selector: the shared `SetTabs` strip in its underline shape, one
 * tab per deck source with its live count as the trailing hint.
 *
 * This used to be two controls — a grid of big figures above a separate tab bar
 * — which spent a screen's worth of space saying the same words twice. As one
 * strip a source is a single affordance: click the tab to see those decks, and
 * the rule under it marks where you are. The count stays visible while a source
 * is still loading, because the number is what tells the viewer the tab is
 * worth clicking at all.
 *
 * @param props - The counts, the active source, and the select handler.
 * @returns The rendered source tabs.
 */
export default function SourceTally({ counts, active, onSelect }: SourceTallyProps) {
    const { t } = useTranslation();

    return (
        <SetTabs
            variant='underline'
            active={active}
            ariaLabel={t('deck.tallyAria')}
            className='-mb-px w-full overflow-x-auto whitespace-nowrap'
            options={DECK_SOURCE_SOURCES.map((source) => ({
                id: source,
                label: t(`deck.source.${source}`),
                hint: (
                    <span className='font-mono text-xs tabular-nums opacity-60'>
                        {counts[source]}
                    </span>
                ),
            }))}
            onChange={(option) => onSelect(option.id)}
        />
    );
}
