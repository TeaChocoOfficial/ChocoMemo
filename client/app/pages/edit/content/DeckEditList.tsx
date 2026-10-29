// -Path: 'client/app/components/edit/DeckEditList.tsx'
import Badge from '~/components/custom/Badge';
import { useTranslation } from 'react-i18next';
import type { DeckFilter } from '~/types/deck';
import Select from '~/components/custom/Select';
import { useEditor } from '~/hooks/editor/useEditor';
import SortableList from '../components/SortableList';
import { useLangText } from '~/hooks/config/useLangText';
import { FaTrash, FaGripVertical } from 'react-icons/fa6';
import { useTargetLang } from '~/hooks/base/useTargetLang';
import { useDeckListDecks } from '~/hooks/deck/useDeckListDecks';
import { DECK_SOURCE_SOURCES } from '~/utils/deck/deckListQuery';
import TargetLangSelect from '~/components/container/TargetLangSelect';
import DeckTagFilter from '~/components/container/DeckList/DeckTagFilter';
import DeckListSearch from '~/components/container/DeckList/DeckListSearch';
import DeckListOptions from '~/components/container/DeckList/DeckListOptions';

/** The type filters offered in the explorer header. */
const FILTERS: DeckFilter[] = ['all', 'vocab', 'render', 'review', 'exam'];

const ROW = 'group/row flex items-center gap-1 rounded-sm px-2 py-1.5 transition-colors';
const ROW_IDLE = 'hover:bg-surface-overlay';
const ROW_ACTIVE = 'bg-primary-subtle';
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
export default function DeckEditList() {
    const {
        data,
        visibleDecks,
        select,
        remove,
        reorder,
        setSort,
        setNsfw,
        setSource,
        setSearch,
        setFilter,
        clearTags,
        toggleTag,
        setDensity,
    } = useEditor();
    const locale = useLangText();
    const { t } = useTranslation();
    const language = useTargetLang();
    const { availableTags } = useDeckListDecks(language, data.filter, data);
    // const counts = useDeckCounts(targetLang, type);

    return (
        <section className='flex h-full flex-col gap-2 p-4'>
            <div className='flex gap-2 overflow-x-auto'>
                <TargetLangSelect allowAll className='py-2.5!' />
                <Select
                    value={data.filter}
                    aria-label={t('deck.edit.filters')}
                    onChange={(value) => setFilter(value)}
                    options={FILTERS.map((filter) => ({
                        value: filter,
                        label: (
                            <div className='flex gap-2 items-center'>
                                {filter === 'all'
                                    ? t('deck.edit.filterAll')
                                    : t(`deck.type.${filter}`)}
                                <span className='font-mono text-xs tabular-nums opacity-60'>0</span>
                            </div>
                        ),
                    }))}
                />
                <Select
                    value={data.source}
                    aria-label={t('deck.tallyAria')}
                    onChange={(value) => setSource(value)}
                    options={DECK_SOURCE_SOURCES.map((source) => ({
                        value: source,
                        label: (
                            <div className='flex gap-2 items-center'>
                                {t(`common.tabs.${source}`)}
                                <span className='font-mono text-xs tabular-nums opacity-60'>0</span>
                            </div>
                        ),
                        // icon: (
                        //     <span className='font-mono text-xs tabular-nums opacity-60'>
                        //         {/* {counts[source]} */}0
                        //     </span>
                        // ),
                    }))}
                />
            </div>
            <div className='min-w-0'>
                <DeckListSearch
                    value={data.search}
                    onChange={setSearch}
                    onClear={() => setSearch('')}
                />
            </div>
            <div className='flex flex-col gap-2 overflow-x-auto'>
                <DeckListOptions
                    query={data}
                    onSortChange={setSort}
                    onNsfwChange={setNsfw}
                    onDensityChange={setDensity}
                />
                <DeckTagFilter
                    onClear={clearTags}
                    tags={availableTags}
                    onToggle={toggleTag}
                    selected={data.tags}
                />
            </div>
            {visibleDecks.length === 0 ? (
                <p className='rounded-sm border border-dashed border-line-strong px-4 py-10 text-center text-sm text-surface-muted'>
                    {t('deck.edit.empty')}
                </p>
            ) : (
                <SortableList
                    items={visibleDecks}
                    onReorder={reorder}
                    className='m-0 flex list-none flex-col gap-1 p-0'
                    renderItem={(deck, { handleProps, isDragging }) => (
                        <div
                            className={`${ROW} ${deck.id === data.selectedId ? ROW_ACTIVE : ROW_IDLE} ${isDragging ? 'opacity-60' : ''}`}
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
                                className={SELECT}
                                onClick={() => select(deck.id)}
                            >
                                <span className='min-w-0 flex-1 truncate text-sm font-medium text-surface-foreground'>
                                    {locale(deck.name)}
                                </span>
                                <Badge>{t(`deck.type.${deck.type}`)}</Badge>
                            </button>
                            <button
                                type='button'
                                className={REMOVE}
                                onClick={() => remove(deck.id)}
                                aria-label={t('deck.deleteAria')}
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
