// -Path: 'client/app/components/edit/dockview/Dockviews.tsx'
import './dockview-theme.css';
import { resolveDockviewTheme } from './theme';
import { useTranslation } from 'react-i18next';
import AddPanelActions from './AddPanelActions';
import Button from '~/components/custom/Button';
import 'dockview-react/dist/styles/dockview.css';
import { TAB_CONTEXT_MENU } from './tabContextMenu';
import { useMemo, useRef, useState, useEffect } from 'react';
import { PANEL_DEFS, PANEL_COMPONENTS } from '../panel/panels';
import { useThemeStore } from '~/stores/config/theme.store';
import { useDockviewStore } from '~/stores/config/dockview.store';
import { dockviewApiRef } from '~/stores/config/dockviewApi.store';
import { readDockviewLayout, saveDockviewLayout } from './layoutStorage';
import { DockviewReact, type DockviewApi, type DockviewReadyEvent } from 'dockview-react';

/** Debounce before writing the layout, so a drag does not save every frame. */
const SAVE_DELAY = 300;

/** Adds every registered panel in its declared default position. */
function addDefaultPanels(api: DockviewApi, titles: Record<string, string>): void {
    for (const def of PANEL_DEFS) {
        if (def.defaultLayout !== true) continue;
        api.addPanel({
            id: def.id,
            component: def.id,
            title: titles[def.id],
            initialWidth: def.initialWidth,
            minimumWidth: def.minimumWidth,
            maximumWidth: def.maximumWidth,
            position: def.position,
        });
    }
}

/** Re-applies each panel's width constraints from the registry. A layout saved
 *  under older constraints (e.g. the activity rail's fixed 56px) would otherwise
 *  restore those constraints and lock the panel at its old size. */
function applyConstraints(api: DockviewApi): void {
    for (const def of PANEL_DEFS) {
        api.getPanel(def.id)?.api.setConstraints({
            minimumWidth: def.minimumWidth,
            maximumWidth: def.maximumWidth,
        });
    }
}

/**
 * The dockview workspace. The panels come from the `PANEL_DEFS` registry, so
 * adding a dockable component is a one-line change there. The header "+" action
 * re-opens any panel the user closed. The arrangement is restored from
 * localStorage and saved back whenever it changes; the theme follows the app
 * theme and the spaced toggle comes from the dockview store.
 */
export default function Dockviews() {
    const { t } = useTranslation();
    const { isDark } = useThemeStore();
    const { spaced } = useDockviewStore();
    const [isEmpty, setIsEmpty] = useState(false);
    const saveTimer = useRef<number | null>(null);

    const theme = useMemo(() => resolveDockviewTheme(isDark, spaced), [isDark, spaced]);

    /** Debounced layout save, so a drag does not write on every frame. */
    const scheduleSave = (api: DockviewApi) => {
        if (saveTimer.current !== null) window.clearTimeout(saveTimer.current);
        saveTimer.current = window.setTimeout(() => saveDockviewLayout(api.toJSON()), SAVE_DELAY);
    };

    /** Restores the default panel layout after every panel has been closed. */
    const resetLayout = () => {
        const api = dockviewApiRef.current;
        if (!api) return;
        api.clear();
        const titles = Object.fromEntries(PANEL_DEFS.map((def) => [def.id, t(def.titleKey)]));
        addDefaultPanels(api, titles);
        applyConstraints(api);
    };

    const onReady = (event: DockviewReadyEvent) => {
        const { api } = event;
        dockviewApiRef.current = api;
        const titles = Object.fromEntries(PANEL_DEFS.map((def) => [def.id, t(def.titleKey)]));

        const saved = readDockviewLayout();
        if (saved) {
            try {
                api.fromJSON(saved);
            } catch {
                addDefaultPanels(api, titles);
            }
        } else addDefaultPanels(api, titles);

        // A restored layout carries the constraints it was saved with, so the
        // registry's current constraints are re-applied on top.
        applyConstraints(api);

        // Track emptiness so the reset affordance appears once the last panel
        // is closed.
        const syncEmpty = () => setIsEmpty(api.panels.length === 0);
        api.onDidAddPanel(syncEmpty);
        api.onDidRemovePanel(syncEmpty);
        syncEmpty();

        // Save the resolved layout straight away, then on every later change, so
        // a first visit persists even before the user drags anything.
        api.onDidLayoutChange(() => scheduleSave(api));
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
    // so they are skipped.
    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            if (!event.altKey || event.ctrlKey || event.metaKey) return;
            if (event.key.toLowerCase() !== 'w') return;

            const panel = dockviewApiRef.current?.activePanel;
            if (!panel) return;

            const def = PANEL_DEFS.find((item) => item.id === panel.id);
            if (def?.addable === false) return;

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
                pinnedTabs={{ enabled: true }}
                leftHeaderActionsComponent={AddPanelActions}
                getTabContextMenuItems={() => TAB_CONTEXT_MENU}
            />

            {isEmpty && (
                <div className='z-10 absolute inset-0 flex items-center justify-center'>
                    <Button onClick={resetLayout}>{t('deck.edit.resetLayout')}</Button>
                </div>
            )}
        </div>
    );
}
