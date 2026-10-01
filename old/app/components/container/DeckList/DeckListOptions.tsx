// -Path: 'client/app/components/container/DeckList/DeckListOptions.tsx'
// The controls that decide *how* the list is shown: order, density, and whether
// flagged decks are visible — plus the actions that add to the collection.
//
// Split out of `DeckList` because this is the one part of the page that is not
// about the decks already loaded. It owns the open/closed state of the actions
// menu, so the surrounding list stays purely a function of the URL.
//
// Density is a labelled toggle rather than a select because it has two states
// and an obvious word for each. Sort genuinely has five, so it keeps a select.
import { useEffect, useId, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    FaArrowDownWideShort,
    FaArrowUpAZ,
    FaClock,
    FaEye,
    FaEyeSlash,
    FaFire,
    FaTableCells,
    FaDatabase,
} from 'react-icons/fa6';
import Select from '~/components/custom/Select';
import MenuDropdown from '~/components/custom/MenuDropdown';
import Button from '~/components/custom/Button';
import { DECK_SORTS } from '~/utils/deckListQuery';
import type { DeckDensity, DeckSort } from '~/types/deckList';
import type { DeckListActions } from './DeckListActions';

export default function DeckListOptions({
    query,
    onSortChange,
    onDensityChange,
    onNsfwChange,
    actions,
}: {
    /** Only the three fields this component reads. */
    query: { sort: DeckSort; density: DeckDensity; nsfw: boolean };
    onSortChange: (sort: DeckSort) => void;
    onDensityChange: (density: DeckDensity) => void;
    onNsfwChange: (nsfw: boolean) => void;
    /** Add/import affordances for this page, or `null` where none apply. */
    actions: DeckListActions | null;
}) {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const menuId = useId();

    // `MenuDropdown` is a bare absolutely-positioned panel with no dismiss of its
    // own, so leaving it is this component's job. Escape as well as an outside
    // click: a keyboard viewer must be able to back out without hunting for
    // empty space to click.
    useEffect(() => {
        if (!open) return;

        const onPointerDown = (event: MouseEvent) => {
            if (!wrapperRef.current?.contains(event.target as Node)) setOpen(false);
        };
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') setOpen(false);
        };

        document.addEventListener('mousedown', onPointerDown);
        document.addEventListener('keydown', onKeyDown);
        return () => {
            document.removeEventListener('mousedown', onPointerDown);
            document.removeEventListener('keydown', onKeyDown);
        };
    }, [open]);

    const sortOptions = DECK_SORTS.map((sort) => ({
        value: sort,
        label: t(`deck.options.sort.${sort}`),
        icon: <SortIcon sort={sort} />,
    }));

    const isCompact = query.density === 'compact';

    return (
        <div className='flex flex-wrap items-center gap-2'>
            <div className='w-40 sm:w-44'>
                <Select
                    value={query.sort}
                    options={sortOptions}
                    onChange={onSortChange}
                    placeholder={t('deck.options.sortAria')}
                />
            </div>

            <Button
                variant='outline'
                size='sm'
                onClick={() => onDensityChange(isCompact ? 'comfortable' : 'compact')}
                aria-pressed={isCompact}
                title={t(`deck.options.density.${query.density}`)}
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

            <Button
                variant='outline'
                size='sm'
                onClick={() => onNsfwChange(!query.nsfw)}
                aria-pressed={query.nsfw}
                title={t(`deck.options.nsfw.${query.nsfw ? 'on' : 'off'}`)}
            >
                {query.nsfw ? (
                    <FaEyeSlash className='h-3.5 w-3.5' />
                ) : (
                    <FaEye className='h-3.5 w-3.5' />
                )}
                <span className='sr-only sm:not-sr-only'>{t('deck.options.nsfw.label')}</span>
            </Button>

            {actions && (
                <div className='relative' ref={wrapperRef}>
                    {actions.create ? (
                        <>
                            <Button
                                variant='primary'
                                size='sm'
                                onClick={() => setOpen((previous) => !previous)}
                                aria-expanded={open}
                                aria-haspopup='menu'
                                aria-controls={open ? menuId : undefined}
                            >
                                {actions.createIcon}
                                <span className='sr-only sm:not-sr-only'>{actions.createLabel}</span>
                            </Button>

                            <MenuDropdown id={menuId} open={open} className='w-64 p-1'>
                                <p className='px-3 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-surface-muted'>
                                    {t('deck.options.importHeading')}
                                </p>
                                {actions.import ? (
                                    <div onClick={() => setOpen(false)}>{actions.import}</div>
                                ) : (
                                    <p className='px-3 py-2 text-sm text-surface-subtle'>
                                        {t('deck.options.importUnavailable')}
                                    </p>
                                )}
                                <p className='border-t border-line px-3 py-2.5 text-xs leading-relaxed text-surface-muted'>
                                    {t('deck.options.importHint')}
                                </p>
                            </MenuDropdown>
                        </>
                    ) : actions.import ? (
                        <div>{actions.import}</div>
                    ) : null}
                </div>
            )}
        </div>
    );
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