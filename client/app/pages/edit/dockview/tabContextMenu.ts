// -Path: 'client/app/pages/edit/dockview/tabContextMenu.ts'
import type { BuiltInContextMenuItem } from 'dockview-react';

/**
 * The tab right-click menu: pin the tab, then the close variants. All are
 * dockview built-in items, so the library handles their actions and disabled
 * states (e.g. "Close to the Left" is disabled on the first tab).
 */
export const TAB_CONTEXT_MENU: BuiltInContextMenuItem[] = [
    'pin',
    'separator',
    'close',
    'closeOthers',
    'closeAll',
    'separator',
    'closeLeft',
    'closeRight',
    'separator',
    'maximize',
    'separator',
    'float',
    'popout',
];
