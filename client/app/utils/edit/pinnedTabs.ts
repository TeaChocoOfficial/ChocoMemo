// -Path: 'client/app/utils/edit/pinnedTabs.ts'
import type { DockviewApi } from 'dockview-react';

/**
 * Reorders every group so its pinned panels come first, in `pinnedIds` order,
 * followed by the remaining panels in their current order. Only panels that are
 * out of place are moved, so the call is idempotent and never fights a user
 * drag.
 *
 * @param api - The live dockview api.
 * @param pinnedIds - The pinned panel ids, in pin order.
 */
export function orderPinnedFirst(api: DockviewApi, pinnedIds: string[]): void {
    for (const group of api.groups) {
        const current = group.panels.map((panel) => panel.id);
        const pinned = pinnedIds.filter((id) => current.includes(id));
        const rest = current.filter((id) => !pinned.includes(id));
        const desired = [...pinned, ...rest];

        desired.forEach((id, index) => {
            // Re-read the live order: each move shifts the panels after it, so a
            // stale snapshot would move panels that are already in place.
            if (group.panels[index]?.id === id) return;
            api.getPanel(id)?.api.moveTo({ group, position: 'center', index });
        });
    }
}

/**
 * Filters the pinned ids down to the panels that still exist.
 *
 * @param api - The live dockview api.
 * @param pinnedIds - The pinned panel ids to filter.
 * @returns The pinned ids whose panel is still open, in their original order.
 */
export function prunePinnedIds(api: DockviewApi, pinnedIds: string[]): string[] {
    const existing = new Set(api.panels.map((panel) => panel.id));
    return pinnedIds.filter((id) => existing.has(id));
}
