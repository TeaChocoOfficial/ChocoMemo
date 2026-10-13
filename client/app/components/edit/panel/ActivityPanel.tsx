// -Path: 'client/app/components/edit/ActivityPanel.tsx'
import ActivityRail from '../content/ActivityRail';
import type { IDockviewPanelProps } from 'dockview-react';

/**
 * Dockview panel that hosts the activity rail, so the rail is a first-class
 * dock item rather than fixed chrome. The rail itself reads the editor state
 * from context.
 */
export default function ActivityPanel(_props: IDockviewPanelProps) {
    return <ActivityRail />;
}
