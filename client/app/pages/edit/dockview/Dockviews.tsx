// -Path: 'client/app/components/edit/dockview/Dockviews.tsx'
import {
    addDefaultPanels,
    applyConstraints,
    applyHeaderVisibility,
    readDockviewLayout,
    saveDockviewLayout,
} from '~/utils/edit/editStorage';
import { useTranslation } from 'react-i18next';
import AddPanelActions from './AddPanelActions';
import EmptyLayout from './EmptyLayout';
import PinnedTab from './PinnedTab';
import { resolveDockviewTheme } from '~/utils/edit/theme';
import { useThemeStore } from '~/stores/config/theme.store';
import { useMemo, useRef, useState, useEffect } from 'react';
import { PANEL_DEFS, PANEL_COMPONENTS } from '../panel/panels';
import { orderPinnedFirst, prunePinnedIds } from '~/utils/edit/pinnedTabs';
import { useDockviewStore } from '~/stores/edit/dockview.store';
import { usePinnedTabsStore } from '~/stores/edit/pinnedTabs.store';
import { dockviewApiRef } from '~/stores/edit/dockviewApi.store';
import type { DockviewVariant } from '~/utils/edit/editStorage';
import { buildTabContextMenu, TAB_GROUP_CONTEXT_MENU } from '~/utils/edit/tabContextMenu';
import { DockviewReact, type DockviewApi, type DockviewReadyEvent } from 'dockview-react';

/** Debounce before writing the layout, so a drag does not save every frame. */
const SAVE_DELAY = 300;

/** Props for {@link Dockviews}. */
interface DockviewsProps {
    /** Which workspace variant to mount: the spatial desktop arrangement, or
     *  the mobile one-group tab strip. Controls the storage key, the default
     *  panel order and which dockview mutations stay enabled. */
    variant?: DockviewVariant;
}

/**
 * The dockview workspace. The panels come from the `PANEL_DEFS` registry, so
 * adding a dockable component is a one-line change there. The header "+" action
 * re-opens any panel the user closed. The arrangement is restored from
 * localStorage and saved back whenever it changes; the theme follows the app
 * theme and the spaced toggle comes from the dockview store.
 *
 * The same component serves both breakpoints. On mobile (`variant='mobile'`)
 * every panel mounts as a tab of one full-width group, drag-and-drop, group
 * locking and floating groups are disabled, and the registry's width
 * constraints and `hideHeader` are never applied — either would fight the
 * single tab strip.
 *
 * @param props - The workspace variant to mount.
 */
export default function Dockviews({ variant = 'desktop' }: DockviewsProps) {
    const { t } = useTranslation();
    const reordering = useRef(false);
    const { isDark } = useThemeStore();
    const { spaced } = useDockviewStore();
    const [isEmpty, setIsEmpty] = useState(false);
    const saveTimer = useRef<number | null>(null);

    /** Whether this mount is the locked single-group mobile workspace. */
    const isMobile = variant === 'mobile';

    const theme = useMemo(() => resolveDockviewTheme(isDark, spaced), [isDark, spaced]);

    /** Debounced layout save, so a drag does not write on every frame. */
    const scheduleSave = (api: DockviewApi) => {
        if (saveTimer.current !== null) window.clearTimeout(saveTimer.current);
        saveTimer.current = window.setTimeout(
            () => saveDockviewLayout(api.toJSON(), variant),
            SAVE_DELAY,
        );
    };

    /** Restores the default panel layout after every panel has been closed. */
    const resetLayout = () => {
        const api = dockviewApiRef.current;
        if (!api) return;
        api.clear();
        const titles = Object.fromEntries(PANEL_DEFS.map((def) => [def.id, t(def.titleKey)]));
        addDefaultPanels(api, titles, variant);
        if (!isMobile) {
            applyConstraints(api);
            applyHeaderVisibility(api);
        }
    };

    const onReady = (event: DockviewReadyEvent) => {
        const { api } = event;
        dockviewApiRef.current = api;
        const titles = Object.fromEntries(PANEL_DEFS.map((def) => [def.id, t(def.titleKey)]));

        const saved = readDockviewLayout(variant);
        if (saved) {
            try {
                api.fromJSON(saved);
            } catch {
                addDefaultPanels(api, titles, variant);
            }
        } else addDefaultPanels(api, titles, variant);

        // A restored layout carries the constraints it was saved with, so the
        // registry's current constraints are re-applied on top. Mobile skips
        // both passes: the activity rail's 360px cap would clamp the whole
        // full-width group, and hiding the activity header would hide the only
        // tab bar.
        if (!isMobile) {
            applyConstraints(api);
            applyHeaderVisibility(api);
        }

        // Drop pinned ids whose panel no longer exists, then put the pinned tabs
        // first in their group.
        const stored = usePinnedTabsStore.getState().pinnedIds;
        const pinnedIds = prunePinnedIds(api, stored);
        if (pinnedIds.length !== stored.length) usePinnedTabsStore.getState().prune(pinnedIds);
        orderPinnedFirst(api, pinnedIds);

        // Track emptiness so the reset affordance appears once the last panel
        // is closed.
        const syncEmpty = () => setIsEmpty(api.panels.length === 0);
        api.onDidAddPanel(syncEmpty);
        api.onDidRemovePanel(syncEmpty);
        syncEmpty();

        // Save the resolved layout straight away, then on every later change, so
        // a first visit persists even before the user drags anything. The
        // pinned-first order is re-asserted on every change so a drag cannot
        // move a pinned tab behind an unpinned one. `onDidLayoutChange` is
        // microtask-buffered, so our own moves land in a later pass rather than
        // re-entering here; that pass is harmless because `orderPinnedFirst`
        // only moves panels that are actually out of place. The flag is a
        // belt-and-braces guard for a synchronous fire.
        api.onDidLayoutChange(() => {
            if (!reordering.current) {
                reordering.current = true;
                orderPinnedFirst(api, usePinnedTabsStore.getState().pinnedIds);
                reordering.current = false;
            }
            scheduleSave(api);
        });
        scheduleSave(api);
    };

    useEffect(
        () => () => {
            if (saveTimer.current !== null) window.clearTimeout(saveTimer.current);
            dockviewApiRef.current = null;
        },
        [],
    );

    // Alt+W closes the active tab, like an editor. Ctrl+W is a browser-reserved
    // shortcut that cannot be intercepted, so the workspace uses Alt+W instead.
    // Chrome panels (the activity chooser and the status bar) are not closable,
    // and neither is a pinned tab, so both are skipped.
    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            if (!event.altKey || event.ctrlKey || event.metaKey) return;
            if (event.key.toLowerCase() !== 'w') return;

            const panel = dockviewApiRef.current?.activePanel;
            if (!panel) return;

            const def = PANEL_DEFS.find((item) => item.id === panel.id);
            if (def?.addable === false) return;
            if (usePinnedTabsStore.getState().pinnedIds.includes(panel.id)) return;

            event.preventDefault();
            panel.api.close();
        };

        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, []);

    return (
        <div className='relative h-full w-full'>
            <DockviewReact
                theme={theme}
                onReady={onReady}
                className='h-full w-full'
                components={PANEL_COMPONENTS}
                defaultTabComponent={PinnedTab}
                leftHeaderActionsComponent={AddPanelActions}
                getTabGroupChipContextMenuItems={() => TAB_GROUP_CONTEXT_MENU}
                getTabContextMenuItems={({ panel }) => buildTabContextMenu(t, panel)}
            />

            {isEmpty && <EmptyLayout onReset={resetLayout} />}
        </div>
    );
}
