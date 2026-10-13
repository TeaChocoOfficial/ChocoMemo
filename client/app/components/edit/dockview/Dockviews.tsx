// -Path: 'client/app/components/edit/dockview/Dockviews.tsx'
import './dockview-theme.css';
import { resolveDockviewTheme } from './theme';
import { useTranslation } from 'react-i18next';
import AddPanelActions from './AddPanelActions';
import 'dockview-react/dist/styles/dockview.css';
import { useMemo, useRef, useEffect } from 'react';
import { PANEL_DEFS, PANEL_COMPONENTS } from '../panel/panels';
import { useThemeStore } from '~/stores/config/theme.store';
import { useDockviewStore } from '~/stores/config/dockview.store';
import { readDockviewLayout, saveDockviewLayout } from './layoutStorage';
import { DockviewReact, type DockviewApi, type DockviewReadyEvent } from 'dockview-react';

/** Debounce before writing the layout, so a drag does not save every frame. */
const SAVE_DELAY = 300;

/** Adds every registered panel in its declared default position. */
function addDefaultPanels(api: DockviewApi, titles: Record<string, string>): void {
    for (const def of PANEL_DEFS) {
        const panel = api.addPanel({
            id: def.id,
            component: def.id,
            title: titles[def.id],
            initialWidth: def.initialWidth,
            minimumWidth: def.minimumWidth,
            maximumWidth: def.maximumWidth,
            position: def.position,
        });
        // Icon rails and the status bar read as chrome, not panels.
        if (def.hideHeader) panel.group.header.hidden = true;
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
    const isDark = useThemeStore((state) => state.isDark);
    const spaced = useDockviewStore((state) => state.spaced);
    const saveTimer = useRef<number | null>(null);

    const theme = useMemo(() => resolveDockviewTheme(isDark, spaced), [isDark, spaced]);

    /** Debounced layout save, so a drag does not write on every frame. */
    const scheduleSave = (api: DockviewApi) => {
        if (saveTimer.current !== null) window.clearTimeout(saveTimer.current);
        saveTimer.current = window.setTimeout(() => saveDockviewLayout(api.toJSON()), SAVE_DELAY);
    };

    const onReady = (event: DockviewReadyEvent) => {
        const { api } = event;
        const titles = Object.fromEntries(PANEL_DEFS.map((def) => [def.id, t(def.titleKey)]));

        const saved = readDockviewLayout();
        if (saved) {
            try {
                api.fromJSON(saved);
            } catch {
                addDefaultPanels(api, titles);
            }
        } else {
            addDefaultPanels(api, titles);
        }

        // Save the resolved layout straight away, then on every later change, so
        // a first visit persists even before the user drags anything.
        api.onDidLayoutChange(() => scheduleSave(api));
        scheduleSave(api);
    };

    useEffect(
        () => () => {
            if (saveTimer.current !== null) window.clearTimeout(saveTimer.current);
        },
        [],
    );

    return (
        <DockviewReact
            theme={theme}
            onReady={onReady}
            components={PANEL_COMPONENTS}
            rightHeaderActionsComponent={AddPanelActions}
            className='h-full w-full'
        />
    );
}
