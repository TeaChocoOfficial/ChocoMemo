// -Path: 'client/app/components/edit/dockview/layoutStorage.ts'
import { PANEL_DEFS } from '../../pages/edit/panel/panels';
import type { DockviewApi } from 'dockview-react';

/** The serialized dockview layout, taken from the api so it stays in sync. */
type DockviewLayout = ReturnType<DockviewApi['toJSON']>;

/** Which of the two workspaces a layout belongs to. Desktop is a spatial
 *  multi-group arrangement; mobile is one locked group of tabs, so the two
 *  layouts are structurally incompatible and stored under separate keys. */
export type DockviewVariant = 'desktop' | 'mobile';

/** Bumped when the panel set or a panel's constraints change, so an old layout
 *  cannot reference a component that no longer exists or lock a panel at a size
 *  the new definition no longer allows. The mobile key is versioned on its own:
 *  it starts at v1 and would drift from the desktop key if shared. */
const STORAGE_KEYS: Record<DockviewVariant, string> = {
    desktop: 'choco-memo-edit-layout:v5',
    mobile: 'choco-memo-edit-layout-mobile:v1',
};

/**
 * Reads the saved dockview layout for a workspace variant from localStorage.
 *
 * @param variant - Which workspace's layout to read.
 * @returns The saved layout, or `null` on the server, when nothing is stored,
 *          or when the stored value is unreadable.
 */
export function readDockviewLayout(variant: DockviewVariant): DockviewLayout | null {
    if (typeof window === 'undefined') return null;
    try {
        const raw = window.localStorage.getItem(STORAGE_KEYS[variant]);
        return raw ? (JSON.parse(raw) as DockviewLayout) : null;
    } catch {
        return null;
    }
}

/**
 * Persists the dockview layout for a workspace variant to localStorage.
 *
 * @param layout - The layout from `api.toJSON()`.
 * @param variant - Which workspace's layout to write.
 */
export function saveDockviewLayout(layout: DockviewLayout, variant: DockviewVariant): void {
    if (typeof window === 'undefined') return;
    try {
        window.localStorage.setItem(STORAGE_KEYS[variant], JSON.stringify(layout));
    } catch {
        // Storage full or unavailable — the workspace still works, just uncached.
    }
}

/**
 * Adds every registered panel in its declared default layout.
 *
 * Desktop keeps the registry's declaration order, spatial `position` and width
 * constraints — a panel's `position` may only reference a panel declared
 * before it. Mobile passes only `{ id, component, title }` for the panels that
 * declare a `mobileOrder`, in ascending order, so each lands as a tab of the
 * one active group and the first added becomes the active tab.
 */
export function addDefaultPanels(
    api: DockviewApi,
    titles: Record<string, string>,
    variant: DockviewVariant,
): void {
    /** Mobile is a tab strip: only panels that declare `mobileOrder` are tabs,
     *  mounted in ascending order rather than the registry's declaration order. */
    const ordered =
        variant === 'mobile'
            ? PANEL_DEFS.filter((def) => def.mobileOrder !== undefined).sort(
                  (a, b) => (a.mobileOrder ?? 0) - (b.mobileOrder ?? 0),
              )
            : PANEL_DEFS.filter((def) => def.defaultLayout === true);

    for (const def of ordered) {
        if (variant === 'mobile') {
            api.addPanel({ id: def.id, component: def.id, title: titles[def.id] });
            continue;
        }
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
 *  restore those constraints and lock the panel at its old size.
 *
 *  Desktop-only: on mobile the single group is full-width, so the activity
 *  rail's 360px cap would clamp the whole workspace.
 *
 *  The GROUP api is used deliberately: `panel.api.setConstraints` fires an event
 *  that no dockview panel consumes, so it is a no-op. Only the group's own api
 *  writes the constraints the layout actually clamps against. A panel with no
 *  constraints in the registry leaves its group untouched. */
export function applyConstraints(api: DockviewApi): void {
    for (const def of PANEL_DEFS) {
        if (def.minimumWidth === undefined && def.maximumWidth === undefined) continue;
        api.getPanel(def.id)?.group.api.setConstraints({
            minimumWidth: def.minimumWidth,
            maximumWidth: def.maximumWidth,
        });
    }
}

/** Re-applies each panel's header visibility from the registry. `hideHeader` is
 *  a group option that is only honoured when the group is created, so a layout
 *  saved before a panel gained `hideHeader` would restore a visible tab bar.
 *
 *  Desktop-only: on mobile the activity panel shares the one group's tab bar,
 *  so hiding it would hide every tab. */
export function applyHeaderVisibility(api: DockviewApi): void {
    for (const def of PANEL_DEFS) {
        const panel = api.getPanel(def.id);
        if (panel) panel.group.header.hidden = def.hideHeader === true;
    }
}
