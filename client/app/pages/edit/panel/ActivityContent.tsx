// -Path: 'client/app/pages/edit/panel/ActivityContent.tsx'
import PanelChooser from './PanelChooser';
import type { DockviewApi } from 'dockview-react';
import ActivityRail from '../content/ActivityRail';

/** Props for {@link ActivityContent}. */
interface ActivityContentProps {
    /** The panel a new panel docks beside when no other panel has been active.
     *  Omitted in the mobile drawer, where the chooser falls back to the active
     *  panel or the active group. */
    referenceId?: string;
    containerApi: DockviewApi;
    /** Fired after a panel is added, so the drawer can close itself. */
    onAdd?: () => void;
    /** How a panel docks beside the fallback reference: a new column on desktop,
     *  a tab in the same group on mobile. */
    direction?: 'within' | 'right';
}

/**
 * The activity panel's body: the explorer rail above the "add panel" chooser.
 * Shared by the docked activity panel on desktop and the mobile drawer, so both
 * render the same content without duplicating it.
 *
 * @param props - The dockview api, an optional reference panel id, an optional
 *                callback fired after a panel is added, and the fallback dock
 *                direction.
 * @returns The rendered activity content.
 */
export default function ActivityContent({
    referenceId,
    containerApi,
    onAdd,
    direction,
}: ActivityContentProps) {
    return (
        <div className='flex h-full flex-col'>
            <ActivityRail />
            <PanelChooser
                referenceId={referenceId}
                containerApi={containerApi}
                onAdd={onAdd}
                direction={direction}
            />
        </div>
    );
}
