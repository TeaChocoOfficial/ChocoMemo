// -Path: 'client/app/utils/edit/tabContextMenu.ts'
import type {
    IDockviewPanel,
    BuiltInContextMenuItem,
    ReactContextMenuItemConfig,
    BuiltInChipContextMenuItem,
} from 'dockview-react';
import type { TFunction } from 'i18next';
import { orderPinnedFirst } from './pinnedTabs';
import { dockviewApiRef } from '~/stores/config/dockviewApi.store';
import { usePinnedTabsStore } from '~/stores/config/pinnedTabs.store';

/**
 * Builds the tab right-click menu. The pin toggle and the close items are the
 * app's own: the free dockview build's built-in `'pin'` token is a no-op, and
 * its close items would happily close a pinned tab. Pinned tabs are never
 * closed — every close item skips them and disables when nothing is left to
 * close. The remaining items are dockview built-ins, so the library handles
 * their actions and disabled states.
 *
 * @param t - The translation function for the menu labels.
 * @param panel - The panel the menu was opened on.
 * @returns The context menu items.
 */
export function buildTabContextMenu(
    t: TFunction,
    panel: IDockviewPanel,
): (BuiltInContextMenuItem | ReactContextMenuItemConfig)[] {
    const { pinnedIds, toggle } = usePinnedTabsStore.getState();
    const isPinned = pinnedIds.includes(panel.id);
    const panels = panel.group.panels;
    const index = panels.indexOf(panel);

    /** Narrows a set of panels to the ones a close action may remove. */
    const closable = (candidates: IDockviewPanel[]) =>
        candidates.filter((candidate) => !pinnedIds.includes(candidate.id));

    const others = closable(panels.filter((candidate) => candidate !== panel));
    const all = closable(panels);
    const left = index > 0 ? closable(panels.slice(0, index)) : [];
    const right = index >= 0 ? closable(panels.slice(index + 1)) : [];

    /** Closes every panel in `targets`. */
    const closeAll = (targets: IDockviewPanel[]) =>
        targets.forEach((target) => target.api.close());

    return [
        {
            label: isPinned ? t('deck.edit.unpinTab') : t('deck.edit.pinTab'),
            action: () => {
                toggle(panel.id);
                const api = dockviewApiRef.current;
                if (api) orderPinnedFirst(api, usePinnedTabsStore.getState().pinnedIds);
            },
        },
        'separator',
        {
            label: t('deck.edit.closeTab'),
            disabled: isPinned,
            action: () => panel.api.close(),
        },
        {
            label: t('deck.edit.closeOthers'),
            disabled: others.length === 0,
            action: () => closeAll(others),
        },
        {
            label: t('deck.edit.closeAll'),
            disabled: all.length === 0,
            action: () => closeAll(all),
        },
        'separator',
        {
            label: t('deck.edit.closeLeft'),
            disabled: left.length === 0,
            action: () => closeAll(left),
        },
        {
            label: t('deck.edit.closeRight'),
            disabled: right.length === 0,
            action: () => closeAll(right),
        },
        'separator',
        'maximize',
        'separator',
        'float',
        'popout',
    ];
}

/** The tab-group chip right-click menu. Empty: no chip actions are offered. */
export const TAB_GROUP_CONTEXT_MENU: BuiltInChipContextMenuItem[] = [];
