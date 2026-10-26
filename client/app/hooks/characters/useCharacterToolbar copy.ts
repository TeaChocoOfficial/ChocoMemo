// -Path: 'client/app/hooks/characters/useChacterToolbar.ts'
import type {
    CharLang,
    ActiveSet,
    OptionItem,
    OptionsItem,
    ActiveGroups,
} from '~/types/characters';
import useTargetLang from './useTargetLang';
import { useEffect, useState } from 'react';
import { useCharacterToolbarStore } from '~/stores/characters/characterToolbar.store';
import { characterToolOptions, type CharacterToolOptions } from '~/data/characters';

/**
 * The persisted chart-toolbar sticky preference, read only after mount. The
 * server render and the client's first paint agree on the default (off)
 * instead of flashing a stored preference and tripping a hydration mismatch.
 *
 * @returns The sticky state and its setter.
 */
export function useCharacterToolbar<Lang extends CharLang, Items extends OptionItem<Lang>>(): {
    lang: Lang;
    items: Items;
    options: CharacterToolOptions[Lang];
    isResume: boolean;
    readSoFar: number;
    groupList: Items;
    isReading: boolean;
    groupTotal: number;
    percentRead: number;
    displayChar: string;
    stickyEnabled: boolean;
    activeSet: ActiveSet[Lang];
    readingChar: string | null;
    activeGroup: ActiveGroups[Lang];
    stopReading: () => void;
    startReading: () => void;
    setStickyEnabled: (enabled: boolean) => void;
    setActiveSet: (value: ActiveSet[Lang]) => void;
    setActiveGroup: (value: ActiveGroups[Lang]) => void;
} {
    const {
        stickyEnabled,
        getActiveSet,
        setActiveSet,
        getActiveGroup,
        setActiveGroup,
        setStickyEnabled,
    } = useCharacterToolbarStore();
    const { code } = useTargetLang();
    if ([undefined, 'other'].includes(code)) throw Error('code is undefined');
    const lang = code as Lang;
    const activeSet = getActiveSet(lang);
    const activeGroup = getActiveGroup(lang);
    const [hydrated, setHydrated] = useState(false);
    const options = characterToolOptions[lang];
    const items = (options.items as OptionsItem<Lang>)[activeSet][activeGroup] as Items;

    const isResume: boolean = false;
    const isReading: boolean = false;
    const readSoFar: number = 0;
    const groupTotal: number = 0;
    const percentRead: number = 0;
    const displayChar: string = '';
    const groupList = items as Items;
    const readingChar: string | null = null;

    const stopReading = () => {};
    const startReading = () => {};

    useEffect(() => setHydrated(true), []);

    return {
        lang,
        items,
        options,
        isResume,
        activeSet,
        isReading,
        readSoFar,
        groupList,
        groupTotal,
        activeGroup,
        displayChar,
        readingChar,
        percentRead,
        stopReading,
        startReading,
        setStickyEnabled,
        stickyEnabled: hydrated ? stickyEnabled : false,
        setActiveSet: (value: ActiveSet[Lang]) => setActiveSet(lang, value),
        setActiveGroup: (value: ActiveGroups[Lang]) => setActiveGroup(lang, value),
    };
}
