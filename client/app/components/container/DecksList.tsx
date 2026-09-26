// -Path: 'client/app/components/container/DecksList.tsx'
// Shared layout for a decks list page that is split into Local / Cloud /
// Community tabs with a search bar and a responsive card grid. Cloud and
// community have no backend yet, so those tabs render a "coming soon" empty
// state instead of a search bar or grid.
//
// The visual language is a "tea tasting note" desk: a warm paper sheet with a
// faint dot grid, a tea-label title, underline tabs and a ruled search line.
// Cards are rendered by the caller (index cards with washi tape).
import { useState } from 'react';
import DeckCard from './DeckCard';
import type { DeckData } from '~/types/type';
import { useTranslation } from 'react-i18next';
import { FaMagnifyingGlass } from 'react-icons/fa6';
import type { CollectionTab } from '~/types/collection';
import { useCollectionFilter } from '~/hooks/useCollectionFilter';
import SetTabs, { type SetTabOption } from '~/components/custom/SetTabs';

interface DecksListProps<Item> {
    title: string;
    eyebrow?: string;
    localItems: Item[];
    description?: string;
    cloudItems: Item[] | null;
    emptyStateLabel: string;
    searchPlaceholder: string;
    communityItems: Item[] | null;
    headerAction?: React.ReactNode;
    getSearchText: (item: Item) => string;
    /** Renders one card. Defaults to the vocabulary DeckCard, which also
     *  needs `to` + the three handlers; collections with their own card
     *  (exam sets) pass `renderItem` instead. */
    renderItem?: (item: Item, index: number) => React.ReactNode;
    to?: string;
    onExport?: (item: Item) => void;
    onDelete?: (item: Item) => void;
    onDownload?: (item: Item) => void;
}

const TAB_OPTIONS: SetTabOption<string, CollectionTab>[] = [
    { id: 'local' },
    { id: 'cloud' },
    { id: 'community' },
];

export default function DecksList<Item extends { id: string }>({
    to,
    title,
    eyebrow,
    onExport,
    onDelete,
    onDownload,
    localItems,
    cloudItems,
    description,
    headerAction,
    getSearchText,
    renderItem,
    communityItems,
    emptyStateLabel,
    searchPlaceholder,
}: DecksListProps<Item>) {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState<CollectionTab>('local');

    const tabOptions: SetTabOption<string, CollectionTab>[] = TAB_OPTIONS.map((option) => ({
        ...option,
        label: t('common.tabs.' + option.id),
    }));

    const items =
        activeTab === 'local' ? localItems : activeTab === 'cloud' ? cloudItems : communityItems;

    const { search, setSearch, filtered } = useCollectionFilter(items ?? [], getSearchText);

    const isAvailable = items !== null;

    return (
        <div className='relative overflow-hidden rounded-sm border border-line bg-surface shadow-[0_18px_40px_-24px_rgba(0,0,0,0.35)]'>
            {/* Faint dot grid — reads as ruled paper in every theme */}
            <div
                aria-hidden='true'
                className='pointer-events-none absolute inset-0 bg-[radial-gradient(circle,var(--color-border)_1px,transparent_1px)] bg-size-[18px_18px] opacity-40'
            />

            <div className='relative px-5 py-8 sm:px-8 sm:py-10'>
                <header className='flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between'>
                    <div className='max-w-2xl'>
                        {eyebrow && (
                            <p className='font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-primary'>
                                {eyebrow}
                            </p>
                        )}
                        <h1 className='mt-2 font-sans text-3xl font-black tracking-tight text-surface-foreground sm:text-4xl'>
                            {title}
                        </h1>
                        {description && (
                            <p className='mt-2 text-sm leading-relaxed text-surface-subtle'>
                                {description}
                            </p>
                        )}
                    </div>
                    {headerAction && <div className='shrink-0'>{headerAction}</div>}
                </header>

                <SetTabs
                    active={activeTab}
                    options={tabOptions}
                    onChange={(option) => setActiveTab(option.id)}
                    variant='underline'
                    className='mt-8 mb-8 w-full sm:w-auto'
                />

                <div className='relative mb-8'>
                    <FaMagnifyingGlass className='pointer-events-none absolute left-0 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-muted' />
                    <input
                        type='search'
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder={searchPlaceholder}
                        className='w-full border-b border-line-strong bg-transparent py-2 pl-6 pr-2 font-mono text-sm text-surface-foreground placeholder:text-surface-muted outline-none transition-colors focus:border-primary'
                    />
                </div>

                {!isAvailable ? (
                    <p className='border border-dashed border-line-strong py-16 text-center text-sm text-surface-muted'>
                        {t('common.comingSoon.' + (activeTab as Exclude<CollectionTab, 'local'>))}
                    </p>
                ) : filtered.length === 0 ? (
                    <p className='border border-dashed border-line-strong py-16 text-center text-sm text-surface-muted'>
                        {emptyStateLabel}
                    </p>
                ) : (
                    <div className='grid gap-6 sm:grid-cols-2'>
                        {filtered.map((item, index) => (
                            <div key={item.id} className='h-full'>
                                {renderItem ? (
                                    renderItem(item, index)
                                ) : (
                                    <DeckCard
                                        to={to ?? ''}
                                        deck={item as unknown as DeckData}
                                        index={index}
                                        onExport={() => onExport?.(item)}
                                        onDelete={() => onDelete?.(item)}
                                        onDownload={() => onDownload?.(item)}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
