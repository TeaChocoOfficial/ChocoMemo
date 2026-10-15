// -Path: 'client/app/components/edit/dockview/layoutStorage.ts'
import { PANEL_DEFS } from '../panel/panels';
import type { DockviewApi } from 'dockview-react';

/** The serialized dockview layout, taken from the api so it stays in sync. */
type DockviewLayout = ReturnType<DockviewApi['toJSON']>;

/** Bumped when the panel set or a panel's constraints change, so an old layout
 *  cannot reference a component that no longer exists or lock a panel at a size
 *  the new definition no longer allows. */
const STORAGE_KEY = 'choco-memo-edit-layout:v4';

/**
 * Reads the saved dockview layout from localStorage.
 *
 * @returns The saved layout, or `null` on the server, when nothing is stored,
 *          or when the stored value is unreadable.
 */
export function readDockviewLayout(): DockviewLayout | null {
    if (typeof window === 'undefined') return null;
    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        return raw ? (JSON.parse(raw) as DockviewLayout) : null;
    } catch {
        return null;
    }
}

/**
 * Persists the dockview layout to localStorage.
 *
 * @param layout - The layout from `api.toJSON()`.
 */
export function saveDockviewLayout(layout: DockviewLayout): void {
    if (typeof window === 'undefined') return;
    try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(layout));
    } catch {
        // Storage full or unavailable — the workspace still works, just uncached.
    }
}



/** Adds every registered panel in its declared default position. */
export function addDefaultPanels(api: DockviewApi, titles: Record<string, string>): void {
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
export function applyConstraints(api: DockviewApi): void {
    for (const def of PANEL_DEFS) {
        api.getPanel(def.id)?.api.setConstraints({
            minimumWidth: def.minimumWidth,
            maximumWidth: def.maximumWidth,
        });
    }
}
