// -Path: 'client/app/pages/edit/panel/ActivityPanel.tsx'
import PanelChooser from './PanelChooser';
import ActivityRail from '../content/ActivityRail';
import type { IDockviewPanelProps } from 'dockview-react';

/**
 * The activity panel: a full dock panel that hosts the workspace's panel
 * chooser. The rail strip on top keeps the explorer views and app actions; the
 * list below adds a fresh instance of any registered panel.
 *
 * @param props - The dockview panel props, used to dock new panels.
 */
export default function ActivityPanel({ containerApi, api }: IDockviewPanelProps) {
    return (
        <div className='flex h-full flex-col'>
            <ActivityRail />
            <PanelChooser containerApi={containerApi} referenceId={api.id} />
        </div>
    );
}
