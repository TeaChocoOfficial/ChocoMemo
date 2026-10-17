// -Path: 'client/app/components/container/DeckList/DeckListOptions.tsx'
// The controls that decide *how* the list is shown: order, density, and which
// flagged decks are visible — plus the actions that add to the collection.
//
// Split out of `DeckList` because this is the one part of the page that is not
// about the decks already loaded. It owns the open/closed state of the actions
// menu, so the surrounding list stays purely a function of the URL.
//
// Density is a labelled toggle rather than a select because it has two states
// and an obvious word for each. Sort has five states and the flagged-deck
// control has three, so both keep a select — more than a toggle can express.
import {
    FaEye,
    FaBan,
    FaFire,
    FaClock,
    FaEyeSlash,
    FaDatabase,
    FaArrowUpAZ,
    FaTableCells,
    FaArrowDownWideShort,
} from 'react-icons/fa6';
import Button from '~/components/custom/Button';
import Select from '~/components/custom/Select';
import { useTranslation } from 'react-i18next';
import { DECK_SORTS, DECK_NSFW_FILTERS } from '~/utils/deck/deckListQuery';
import type { DeckDensity, DeckNsfwFilter, DeckSort } from '~/types/deckList';

/**
 * The deck-list toolbar: sort and flagged-deck selects, a density toggle, and
 * the page's add/import actions.
 *
 * @param props - The current options and their change handlers.
 * @returns The rendered toolbar.
 */
export default function DeckListOptions({
    query,
    onNsfwChange,
    onSortChange,
    onDensityChange,
}: {
    /** Only the three fields this component reads. */
    query: { sort: DeckSort; density: DeckDensity; nsfw: DeckNsfwFilter };
    onNsfwChange: (nsfw: DeckNsfwFilter) => void;
    onSortChange: (sort: DeckSort) => void;
    onDensityChange: (density: DeckDensity) => void;
    /** Add/import affordances for this page, or `null` where none apply. */
}) {
    const { t } = useTranslation();

    const sortOptions = DECK_SORTS.map((sort) => ({
        value: sort,
        label: t(`deck.options.sort.${sort}`),
        icon: <SortIcon sort={sort} />,
    }));

    const nsfwOptions = DECK_NSFW_FILTERS.map((filter) => ({
        value: filter,
        label: t(`deck.options.nsfw.${filter}`),
        icon: <NsfwIcon filter={filter} />,
    }));

    const isCompact = query.density === 'compact';

    return (
        <div className='flex flex-wrap items-center gap-2'>
            <Select
                size='sm'
                value={query.sort}
                options={sortOptions}
                onChange={onSortChange}
                className='w-40 sm:w-44'
                placeholder={t('deck.options.sortAria')}
            />

            <Select
                size='sm'
                value={query.nsfw}
                options={nsfwOptions}
                onChange={onNsfwChange}
                className='w-40 sm:w-44'
                placeholder={t('deck.options.nsfw.label')}
            />

            <Button
                size='sm'
                variant='outline'
                aria-pressed={isCompact}
                title={t(`deck.options.density.${query.density}`)}
                onClick={() => onDensityChange(isCompact ? 'comfortable' : 'compact')}
            >
                {isCompact ? (
                    <FaTableCells className='h-3.5 w-3.5' />
                ) : (
                    <FaArrowUpAZ className='h-3.5 w-3.5' />
                )}
                <span className='sr-only sm:not-sr-only'>
                    {t(`deck.options.density.${query.density}`)}
                </span>
            </Button>
        </div>
    );
}

/**
 * Picks the icon for one flagged-deck filter.
 *
 * @param props - The filter the icon stands for.
 * @returns The matching Font Awesome icon.
 */
function NsfwIcon({ filter }: { filter: DeckNsfwFilter }) {
    switch (filter) {
        case 'only':
            return <FaEyeSlash className='h-3.5 w-3.5' />;
        case 'hide':
            return <FaBan className='h-3.5 w-3.5' />;
        default:
            return <FaEye className='h-3.5 w-3.5' />;
    }
}

function SortIcon({ sort }: { sort: DeckSort }) {
    switch (sort) {
        case 'name':
            return <FaArrowDownWideShort className='h-3.5 w-3.5' />;
        case 'recent':
            return <FaClock className='h-3.5 w-3.5' />;
        case 'popular':
            return <FaFire className='h-3.5 w-3.5' />;
        case 'size':
            return <FaDatabase className='h-3.5 w-3.5' />;
        default:
            return <FaArrowDownWideShort className='h-3.5 w-3.5 rotate-180' />;
    }
}
