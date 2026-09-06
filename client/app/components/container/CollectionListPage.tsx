// -Path: 'client/app/components/container/CollectionListPage.tsx'
// Shared layout for a list page that is split into Local / Cloud / Community
// tabs with a search bar and a responsive card grid. Cloud and community have
// no backend yet, so those tabs render a "coming soon" empty state instead of
// a search bar or grid.
//
// The visual language is a "tea tasting note" desk: a warm paper sheet with a
// faint dot grid, a serif tea-label title, underline tabs and a ruled search
// line. Cards are rendered by the caller (index cards with washi tape).
import { Fragment, useState } from 'react';
import { FaMagnifyingGlass } from 'react-icons/fa6';
import SetTabs, { type SetTabOption } from '~/components/custom/SetTabs';
import { useCollectionFilter } from '~/hooks/useCollectionFilter';
import type { CollectionTab } from '~/types/collection';

interface CollectionListPageProps<T> {
    eyebrow?: string;
    title: string;
    description?: string;
    searchPlaceholder: string;
    localItems: T[];
    cloudItems: T[] | null;
    communityItems: T[] | null;
    getSearchText: (item: T) => string;
    renderItem: (item: T) => React.ReactNode;
    emptyStateLabel: string;
    headerAction?: React.ReactNode;
}

const TAB_OPTIONS: SetTabOption<string, CollectionTab>[] = [
    { id: 'local', label: 'Local' },
    { id: 'cloud', label: 'Cloud' },
    { id: 'community', label: 'Community' },
];

const COMING_SOON: Record<Exclude<CollectionTab, 'local'>, string> = {
    cloud: 'Cloud sync coming soon, sign in required',
    community: "Browsing community sets isn't available yet",
};

export default function CollectionListPage<T>({
    eyebrow,
    title,
    description,
    searchPlaceholder,
    localItems,
    cloudItems,
    communityItems,
    getSearchText,
    renderItem,
    emptyStateLabel,
    headerAction,
}: CollectionListPageProps<T>) {
    const [activeTab, setActiveTab] = useState<CollectionTab>('local');

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
                            <p className='font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-accent'>
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
                    options={TAB_OPTIONS}
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
                        className='w-full border-b border-line-strong bg-transparent py-2 pl-6 pr-2 font-mono text-sm text-surface-foreground placeholder:text-surface-muted outline-none transition-colors focus:border-accent'
                    />
                </div>

                {!isAvailable ? (
                    <p className='border border-dashed border-line-strong py-16 text-center text-sm text-surface-muted'>
                        {COMING_SOON[activeTab as Exclude<CollectionTab, 'local'>]}
                    </p>
                ) : filtered.length === 0 ? (
                    <p className='border border-dashed border-line-strong py-16 text-center text-sm text-surface-muted'>
                        {emptyStateLabel}
                    </p>
                ) : (
                    <div className='grid gap-6 sm:grid-cols-2'>
                        {filtered.map((item, index) => (
                            <Fragment key={index}>{renderItem(item)}</Fragment>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
