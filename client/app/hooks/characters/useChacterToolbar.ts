// -Path: 'client/app/hooks/characters/useChacterToolbar.ts'
import type {
    CharLang,
    ActiveSet,
    OptionItem,
    OptionsItem,
    ActiveGroups,
} from '~/types/characters';
import { useEffect, useState } from 'react';
import { useCharacterToolbarStore } from '~/stores/config/characterToolbar.store';
import { characterToolOptions, type CharacterToolOptions } from '~/data/characters';

/**
 * The persisted chart-toolbar sticky preference, read only after mount. The
 * server render and the client's first paint agree on the default (off)
 * instead of flashing a stored preference and tripping a hydration mismatch.
 *
 * @returns The sticky state and its setter.
 */
export function useCharacterToolbar<Lang extends CharLang, Items extends OptionItem<Lang>>(
    lang: Lang,
): {
    items: Items;
    options: CharacterToolOptions[Lang];
    stickyEnabled: boolean;
    activeSet: ActiveSet[Lang];
    activeGroup: ActiveGroups[Lang];
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
    const activeSet = getActiveSet(lang);
    const activeGroup = getActiveGroup(lang);
    const [hydrated, setHydrated] = useState(false);
    const options = characterToolOptions[lang];
    const items = (options.items as OptionsItem<Lang>)[activeSet][activeGroup] as Items;

    useEffect(() => setHydrated(true), []);

    return {
        items,
        options,
        activeSet,
        activeGroup,
        setStickyEnabled,
        stickyEnabled: hydrated ? stickyEnabled : false,
        setActiveSet: (value: ActiveSet[Lang]) => setActiveSet(lang, value),
        setActiveGroup: (value: ActiveGroups[Lang]) => setActiveGroup(lang, value),
    };
}
