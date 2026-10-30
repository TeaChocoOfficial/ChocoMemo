// -Path: 'client/app/stores/config/deckEditor.store.ts'
import { create } from 'zustand';
import { Languages } from '~/data/language';
import { persist } from 'zustand/middleware';
import type { DeckFilter, DeckSource, DeckView } from '~/types/deck';
import type { DeckDensity, DeckNsfwFilter, DeckSort, DeckListQuery } from '~/types/deckList';

export type DeckEditorData = DeckListQuery & {
    view: DeckView;
    filter: DeckFilter;
    /** Whether the form is drafting a deck that does not exist yet. */
    creating: boolean;
    selectedId: string | null;
};

interface DeckEditorState {
    datas: Record<Languages, DeckEditorData>;
    clearTags: (language: Languages) => void;
    toggleTag: (language: Languages, tag: string) => void;
    setSort: (language: Languages, sort: DeckSort) => void;
    setView: (language: Languages, view: DeckView) => void;
    setSearch: (language: Languages, value: string) => void;
    setNsfw: (language: Languages, nsfw: DeckNsfwFilter) => void;
    setSource: (language: Languages, source: DeckSource) => void;
    setFilter: (language: Languages, filter: DeckFilter) => void;
    setDensity: (language: Languages, density: DeckDensity) => void;
    setCreating: (language: Languages, creating: boolean) => void;
    setSelectedId: (language: Languages, id: string | null) => void;
}

const defaultData: DeckEditorData = {
    tags: [],
    search: '',
    view: 'all',
    nsfw: 'all',
    filter: 'all',
    creating: false,
    sort: 'default',
    source: 'local',
    selectedId: null,
    density: 'comfortable',
};

const defaultDatas = Object.values(Languages).reduce(
    (acc, value) => ({ ...acc, [value]: defaultData }),
    {} as Record<Languages, DeckEditorData>,
) satisfies Record<Languages, DeckEditorData>;

const setDatas =
    <Key extends keyof DeckEditorData>(language: Languages, key: Key, data: DeckEditorData[Key]) =>
    (state: DeckEditorState) => ({
        datas: { ...state.datas, [language]: { ...state.datas[language], [key]: data } },
    });

/**
 * Persisted, per-track UI state for the deck editor: which filter is active and
 * which deck is selected. Kept out of `useDeckEditor`'s local state, and stored
 * beside the dockview layout and theme, so the editor reopens on the same deck
 * after a reload.
 */
export const useDeckEditorStore = create<DeckEditorState>()(
    persist(
        (set) => ({
            datas: defaultDatas,
            toggleTag: (languages, tag) =>
                set((state) => {
                    const tags = state.datas[languages].tags;
                    return setDatas(
                        languages,
                        'tags',
                        tags.includes(tag) ? tags.filter((each) => each !== tag) : [...tags, tag],
                    )(state);
                }),
            clearTags: (languages) => set(setDatas(languages, 'tags', [])),
            setSort: (languages, sort) => set(setDatas(languages, 'sort', sort)),
            setNsfw: (languages, nsfw) => set(setDatas(languages, 'nsfw', nsfw)),
            setView: (languages, view) => set(setDatas(languages, 'view', view)),
            setSearch: (languages, search) => set(setDatas(languages, 'search', search)),
            setSource: (languages, source) => set(setDatas(languages, 'source', source)),
            setFilter: (languages, filter) => set(setDatas(languages, 'filter', filter)),
            setDensity: (languages, density) => set(setDatas(languages, 'density', density)),
            setCreating: (languages, creating) => set(setDatas(languages, 'creating', creating)),
            setSelectedId: (languages, selectedId) =>
                set(setDatas(languages, 'selectedId', selectedId)),
        }),
        {
            name: 'choco-memo-deck-editor',
        },
    ),
);
