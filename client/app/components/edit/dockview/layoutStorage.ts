// -Path: 'client/app/components/edit/dockview/layoutStorage.ts'
import type { DockviewApi } from 'dockview-react';

/** The serialized dockview layout, taken from the api so it stays in sync. */
type DockviewLayout = ReturnType<DockviewApi['toJSON']>;

/** Bumped when the panel set changes, so an old layout cannot reference a
 *  component that no longer exists. */
const STORAGE_KEY = 'choco-memo-edit-layout:v2';

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
