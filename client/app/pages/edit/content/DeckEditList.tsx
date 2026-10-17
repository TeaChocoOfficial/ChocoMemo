// -Path: 'client/app/components/edit/DeckEditList.tsx'
import type { DeckData } from '~/types/deck';
import Badge from '~/components/custom/Badge';
import { useTranslation } from 'react-i18next';
import { useLangText } from '~/hooks/config/useLangText';
import SortableList from '../components/SortableList';
import { FaTrash, FaGripVertical } from 'react-icons/fa6';
import type { DeckFilter } from '~/stores/config/deckEditor.store';

/** Props for {@link DeckEditList}. */
interface DeckEditListProps {
    decks: DeckData[];
    selectedId: string | null;
    onDelete: (id: string) => void;
    onSelect: (id: string) => void;
    /** Receives the full id order after a drag, ready to persist. */
    onReorder: (ids: string[]) => void;
    /** When set, a type filter row is rendered under the heading. */
    typeFilter?: DeckFilter;
    onTypeFilterChange?: (value: DeckFilter) => void;
}

/** The type filters offered in the explorer header. */
const FILTERS: DeckFilter[] = ['all', 'vocab', 'render', 'review', 'exam'];

const ROW = 'group/row flex items-center gap-1 rounded-sm px-2 py-1.5 transition-colors';
const ROW_IDLE = 'hover:bg-surface-overlay';
const ROW_ACTIVE = 'bg-primary-subtle';
const CHIP = 'rounded-sm border px-2 py-1 text-[11px] font-semibold transition-colors';
const CHIP_IDLE = 'border-line text-surface-muted hover:bg-surface-overlay hover:text-surface-foreground';
const CHIP_ACTIVE = 'border-primary bg-primary-subtle text-primary';
const HANDLE =
    'flex h-8 w-7 shrink-0 cursor-grab items-center justify-center rounded-sm text-surface-muted transition-colors hover:bg-surface-sunken hover:text-surface-foreground focus-visible:outline-2 focus-visible:outline-primary active:cursor-grabbing';
const SELECT =
    'flex min-w-0 flex-1 items-center gap-2 rounded-sm px-1 py-0.5 text-left focus-visible:outline-2 focus-visible:outline-primary';
const REMOVE =
    'flex h-8 w-8 shrink-0 items-center justify-center rounded-sm text-surface-muted transition-colors hover:bg-error-subtle hover:text-error focus-visible:outline-2 focus-visible:outline-primary';

/**
 * Explorer pane of the deck editor: a heading, an optional type filter, then a
 * sortable list of the track's decks. Each row can be dragged to reorder,
 * clicked to select, or removed. Language-agnostic — it only knows deck ids,
 * names and types.
 *
 * @param props - Decks, selection, the reorder/select/delete sinks, and an
 *                optional type filter.
 * @returns The rendered deck list.
 */
export default function DeckEditList({
    decks,
    selectedId,
    onDelete,
    onSelect,
    onReorder,
    typeFilter,
    onTypeFilterChange,
}: DeckEditListProps) {
    const { t } = useTranslation();
    const locale = useLangText();

    return (
        <section className='flex h-full flex-col gap-3 p-4'>
            <h2 className='text-xs font-bold uppercase tracking-[0.14em] text-surface-subtle'>
                {t('deck.edit.listTitle')}
            </h2>

            {typeFilter && onTypeFilterChange && (
                <div
                    role='group'
                    aria-label={t('deck.edit.filters')}
                    className='flex flex-wrap gap-1'
                >
                    {FILTERS.map((filter) => {
                        const active = filter === typeFilter;
                        return (
                            <button
                                key={filter}
                                type='button'
                                aria-pressed={active}
                                onClick={() => onTypeFilterChange(filter)}
                                className={`${CHIP} ${active ? CHIP_ACTIVE : CHIP_IDLE}`}
                            >
                                {filter === 'all'
                                    ? t('deck.edit.filterAll')
                                    : t(`deck.type.${filter}`)}
                            </button>
                        );
                    })}
                </div>
            )}

            {decks.length === 0 ? (
                <p className='rounded-sm border border-dashed border-line-strong px-4 py-10 text-center text-sm text-surface-muted'>
                    {t('deck.edit.empty')}
                </p>
            ) : (
                <SortableList
                    items={decks}
                    onReorder={onReorder}
                    className='m-0 flex list-none flex-col gap-1 p-0'
                    renderItem={(deck, { handleProps, isDragging }) => (
                        <div
                            className={`${ROW} ${deck.id === selectedId ? ROW_ACTIVE : ROW_IDLE} ${isDragging ? 'opacity-60' : ''}`}
                        >
                            <button
                                type='button'
                                aria-label={t('deck.edit.dragHandle')}
                                className={HANDLE}
                                {...handleProps}
                            >
                                <FaGripVertical className='h-4 w-4' />
                            </button>
                            <button
                                type='button'
                                onClick={() => onSelect(deck.id)}
                                className={SELECT}
                            >
                                <span className='min-w-0 flex-1 truncate text-sm font-medium text-surface-foreground'>
                                    {locale(deck.name)}
                                </span>
                                <Badge>{t(`deck.type.${deck.type}`)}</Badge>
                            </button>
                            <button
                                type='button'
                                onClick={() => onDelete(deck.id)}
                                aria-label={t('deck.deleteAria')}
                                className={REMOVE}
                            >
                                <FaTrash className='h-3.5 w-3.5' />
                            </button>
                        </div>
                    )}
                />
            )}
        </section>
    );
}
