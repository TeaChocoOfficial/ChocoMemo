// -Path: 'client/app/pages/edit/panel/PanelChooser.tsx'
import { PANEL_DEFS } from './panels';
import { FaPlus } from 'react-icons/fa6';
import { useTranslation } from 'react-i18next';
import { useOpenPanel } from '~/hooks/editor/useOpenPanel';

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
    onAdd,
    referenceId,
    direction = 'right',
}: {
    /** Fired after a panel is added, so the drawer can close itself. */
    onAdd?: () => void;
    /** The panel a new panel docks beside when no other panel has been active.
     *  Omitted in the mobile drawer, where the chooser falls back to the active
     *  panel or the active group. */
    referenceId?: string;
    /** How a panel docks beside the fallback reference. `'right'` opens a new
     *  column (desktop); `'within'` opens a tab in the same group (mobile,
     *  where the workspace is a single locked group). */
    direction?: 'within' | 'right';
}) {
    const { t } = useTranslation();
    const open = useOpenPanel({ referenceId, direction });

    // Read the registry inside the component: `panels.tsx` imports this file
    // (via `ActivityPanel`), so touching `PANEL_DEFS` at module scope would run
    // before the registry is initialized.
    const addable = PANEL_DEFS.filter((def) => def.addable !== false);

    return (
        <div className='flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto p-2'>
            {addable.map((def) => (
                <button
                    key={def.id}
                    type='button'
                    onClick={() => {
                        open(def);
                        onAdd?.();
                    }}
                    className='flex items-center gap-2 rounded-sm px-3 py-2 text-left text-sm text-surface-foreground transition-colors hover:bg-surface-overlay'
                >
                    <FaPlus className='h-3 w-3 shrink-0 text-surface-muted' />
                    {t(def.titleKey)}
                </button>
            ))}
        </div>
    );
}
