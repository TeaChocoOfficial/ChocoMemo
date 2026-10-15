// -Path: 'client/app/pages/edit/panel/PanelChooser.tsx'
import { FaPlus } from 'react-icons/fa6';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { PANEL_DEFS, type PanelDefinition } from './panels';
import type { DockviewApi } from 'dockview-react';

/**
 * The workspace's "add panel" menu: one row per registered panel. Clicking a
 * row docks a fresh instance beside the panel that was active before the menu
 * was opened, so the same component can be opened more than once without id
 * collisions.
 *
 * @param props - The dockview api and the chooser panel's own id.
 */
export default function PanelChooser({
    containerApi,
    referenceId,
}: {
    containerApi: DockviewApi;
    referenceId: string;
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

    /** Docks a new instance of `def` beside the last active panel. */
    const add = (def: PanelDefinition) => {
        const id = `${def.id}-${Date.now().toString(36)}`;
        const reference = targetRef.current ?? referenceId;
        containerApi.addPanel({
            id,
            component: def.id,
            title: t(def.titleKey),
            initialWidth: def.initialWidth,
            minimumWidth: def.minimumWidth,
            maximumWidth: def.maximumWidth,
            position: { referencePanel: reference, direction: 'right' },
        });
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
