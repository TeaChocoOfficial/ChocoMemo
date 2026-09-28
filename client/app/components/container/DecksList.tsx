// -Path: 'client/app/components/container/DecksList.tsx'
// Shared layout for a decks list page that is split into Local / Cloud /
// Community tabs with a search bar and a responsive card grid. Cloud and
// community have no backend yet, so those tabs render a "coming soon" empty
// state instead of a search bar or grid.
//
// The visual language is a "tea tasting note" desk: a warm paper sheet with a
// faint dot grid, a tea-label title, underline tabs and a ruled search line.
// Every deck is rendered by the same DeckCard, so the list only differs in
// which decks it is handed and where the card links to.
import { useState } from 'react';
import DeckCard from './DeckCard';
import type { DeckData, DeckType } from '~/types/deck';
import { defaultDecks } from '~/data/japanese/deckDefaults';
import { useTranslation } from 'react-i18next';
import { FaMagnifyingGlass } from 'react-icons/fa6';
import type { CollectionTab } from '~/types/collection';
import { useCollectionFilter } from '~/hooks/useCollectionFilter';
import SetTabs, { type SetTabOption } from '~/components/custom/SetTabs';
import type { Languages } from '~/data/language';
import { useLangText } from '~/hooks/useLangText';
import { localDecksOfType, useDeckListLocalStore } from '~/stores/deck/deckListLocal.store';
import { useDeckListCloudStore } from '~/stores/deck/deckListCloud.store';
import { useDeckListCommunityStore } from '~/stores/deck/deckListCommunity.store';

interface DecksListProps {
    type: DeckType;
    language: Languages;
}

const TAB_OPTIONS: SetTabOption<string, CollectionTab>[] = [
    { id: 'local' },
    { id: 'cloud' },
    { id: 'community' },
];

export default function DecksList({ type, language }: DecksListProps) {
    useDeckListLocalStore();
    const locale = useLangText();
    const { t } = useTranslation();
    const { deckLists: cloudLists } = useDeckListCloudStore();
    const { deckLists: communityLists } = useDeckListCommunityStore();
    const [activeTab, setActiveTab] = useState<CollectionTab>('local');

    const tabOptions: SetTabOption<string, CollectionTab>[] = TAB_OPTIONS.map((option) => ({
        ...option,
        label: t('common.tabs.' + option.id),
    }));

    // Built-ins belong to the local tab: they ship with the app, so they are
    // neither synced nor community content.
    const local = [...defaultDecks(language), ...localDecksOfType(language, type)];
    const items: Record<CollectionTab, DeckData[]> = {
        local: local.filter((deck) => deck.type === type),
        cloud: (cloudLists[language] ?? []).filter((deck) => deck.type === type),
        community: (communityLists[language] ?? []).filter((deck) => deck.type === type),
    };
    const visible = items[activeTab];

    const { search, setSearch, filtered } = useCollectionFilter(visible, (deck) =>
        [locale(deck.name), deck.description ? locale(deck.description) : ''].join(' '),
    );

    return (
        <>
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
                    placeholder={t(`${language}.${type}.search`)}
                    className='w-full border-b border-line-strong bg-transparent py-2 pl-6 pr-2 font-mono text-sm text-surface-foreground placeholder:text-surface-muted outline-none transition-colors focus:border-primary'
                />
            </div>

            {filtered.length === 0 ? (
                <p className='border border-dashed border-line-strong py-16 text-center text-sm text-surface-muted'>
                    {t(`deck.${type}.empty`)}
                </p>
            ) : (
                <div className='grid gap-6 sm:grid-cols-2'>
                    {filtered.map((item, index) => (
                        <DeckCard
                            key={item.id}
                            to={`/${language}/${type}/`}
                            deck={item}
                            index={index}
                        />
                    ))}
                </div>
            )}
        </>
    );
}
