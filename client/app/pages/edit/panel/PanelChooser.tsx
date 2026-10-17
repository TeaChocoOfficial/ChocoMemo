// -Path: 'client/app/pages/edit/panel/PanelChooser.tsx'
import { FaPlus } from 'react-icons/fa6';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import type { DockviewApi } from 'dockview-react';
import { PANEL_DEFS, type PanelDefinition } from './panels';

/**
 * The workspace's "add panel" menu: one row per registered panel. Clicking a
 * row docks a fresh instance as a tab in the panel that was active before the
 * menu was opened, or beside the chooser itself when no other panel has been
 * active. The same component can be opened more than once without id
 * collisions.
 *
 * @param props - The dockview api, an optional reference panel id, and an
 *                optional callback fired after a panel is added.
 */
export default function PanelChooser({
    referenceId,
    containerApi,
    onAdd,
    direction = 'right',
}: {
    /** The panel a new panel docks beside when no other panel has been active.
     *  Omitted in the mobile drawer, where the chooser falls back to the active
     *  panel or the active group. */
    referenceId?: string;
    containerApi: DockviewApi;
    /** Fired after a panel is added, so the drawer can close itself. */
    onAdd?: () => void;
    /** How a panel docks beside the fallback reference. `'right'` opens a new
     *  column (desktop); `'within'` opens a tab in the same group (mobile,
     *  where the workspace is a single locked group). */
    direction?: 'within' | 'right';
}) {
    const { t } = useTranslation();

    // The chooser is itself a panel, so clicking a row makes it the active one.
    // Remember the last active panel that is not the chooser, so a new panel
    // lands where the user was working rather than beside the chooser.
    const targetRef = useRef<string | null>(null);

    useEffect(() => {
        const disposable = containerApi.onDidActivePanelChange((event) => {
            if (event.panel && event.panel.id !== referenceId) targetRef.current = event.panel.id;
        });
        return () => disposable.dispose();
    }, [containerApi, referenceId]);

    // Read the registry inside the component: `panels.tsx` imports this file
    // (via `ActivityPanel`), so touching `PANEL_DEFS` at module scope would run
    // before the registry is initialized.
    const addable = PANEL_DEFS.filter((def) => def.addable !== false);

    /** Docks a new instance of `def`: as a tab in the last active panel, or
     *  beside the chooser when no other panel has been active. */
    const add = (def: PanelDefinition) => {
        const id = `${def.id}-${Date.now().toString(36)}`;
        // The remembered target may have been closed since it was last active.
        const remembered = targetRef.current;
        const target = remembered && containerApi.getPanel(remembered) ? remembered : null;
        // The drawer passes no reference id, so fall back to the active panel; when
        // there is none either, omit `position` and dockview adds the panel to the
        // active group.
        const reference = referenceId ?? containerApi.activePanel?.id;

        containerApi.addPanel({
            id,
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

        onAdd?.();
    };

    return (
        <div className='flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto p-2'>
            {addable.map((def) => (
                <button
                    key={def.id}
                    type='button'
                    onClick={() => add(def)}
                    className='flex items-center gap-2 rounded-sm px-3 py-2 text-left text-sm text-surface-foreground transition-colors hover:bg-surface-overlay'
                >
                    <FaPlus className='h-3 w-3 shrink-0 text-surface-muted' />
                    {t(def.titleKey)}
                </button>
            ))}
        </div>
    );
}
