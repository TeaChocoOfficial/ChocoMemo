// -Path: 'client/app/hooks/editor/useOpenPanel.ts'
import { useTranslation } from 'react-i18next';
import type { IDockviewPanel } from 'dockview-react';
import { useCallback, useEffect, useRef } from 'react';
import { dockviewApiRef } from '~/stores/edit/dockviewApi.store';
import type { PanelDefinition } from '~/pages/edit/panel/panels';

/** A subscription that can be released (dockview's event disposables). */
interface Disposable {
    dispose: () => void;
}

/** Options for {@link useOpenPanel}. */
interface OpenPanelOptions {
    /** The panel a new panel docks beside when no other panel has been active. */
    referenceId?: string;
    /** How a new panel docks beside that fallback: a new column, or a tab. */
    direction?: 'within' | 'right';
}

/**
 * Docks a registered panel in the editor workspace, from any component.
 *
 * The dockview api is looked up through `dockviewApiRef` **inside** the
 * handlers, never at render: components outside the workspace (the title bar,
 * the activity rail, a route) mount before the workspace is ready, so a value
 * captured at render would stay `null` forever. The "last active panel" tracker
 * is bound lazily for the same reason, and re-bound if the workspace remounts.
 *
 * Panels are singletons: opening one that is already docked activates it
 * instead of adding a second copy (ids from older layouts are `<def.id>-<time>`,
 * so the id prefix is the lookup key). A panel that is not open yet is added as
 * a tab of the last active panel, or beside `referenceId` when nothing else has
 * been active; without either, dockview docks it in the active group.
 *
 * @param options - Fallback reference panel and dock direction.
 * @returns A function that opens a panel definition and returns the panel that
 *          ended up active, if the workspace is ready.
 */

export function useAddPanel() {}
export function useOpenPanel({ referenceId, direction = 'right' }: OpenPanelOptions = {}) {
    const { t } = useTranslation();
    const targetRef = useRef<string | null>(null);
    const boundApiRef = useRef<unknown>(null);
    const disposableRef = useRef<Disposable | null>(null);

    /**
     * Follows the active panel of the live workspace, so a panel opened later
     * lands beside the one the user was working in. Safe to call when the
     * workspace is not mounted yet: it subscribes on the first call that finds
     * one, and re-subscribes if the api instance was replaced.
     */
    const bind = useCallback(() => {
        const api = dockviewApiRef.current;
        if (!api) return null;
        if (boundApiRef.current !== api) {
            disposableRef.current?.dispose();
            boundApiRef.current = api;
            disposableRef.current = api.onDidActivePanelChange((event) => {
                if (event.panel && event.panel.id !== referenceId) {
                    targetRef.current = event.panel.id;
                }
            });
        }
        return api;
    }, [referenceId]);

    // Subscribe as soon as the workspace is reachable, and let go on unmount.
    useEffect(() => {
        bind();
        return () => {
            disposableRef.current?.dispose();
            disposableRef.current = null;
            boundApiRef.current = null;
        };
    }, [bind]);

    const open = useCallback(
        (def: PanelDefinition): IDockviewPanel | undefined => {
            const api = bind();
            if (!api) return undefined;

            const open = api.panels.find(
                (panel) => panel.id === def.id || panel.id.startsWith(`${def.id}-`),
            );
            if (open) {
                open.api.setActive();
                return open;
            }

            // The remembered target may have been closed since it was last active.
            const remembered = targetRef.current;
            const target = remembered && api.getPanel(remembered) ? remembered : null;
            const reference = referenceId ?? api.activePanel?.id;

            return api.addPanel({
                id: def.id,
                component: def.id,
                title: t(def.titleKey),
                initialWidth: def.initialWidth,
                minimumWidth: def.minimumWidth,
                maximumWidth: def.maximumWidth,
                position: target
                    ? { referencePanel: target, direction: 'within' }
                    : reference
                      ? { referencePanel: reference, direction }
                      : undefined,
            });
        },
        [bind, direction, referenceId, t],
    );

    return open;
}
