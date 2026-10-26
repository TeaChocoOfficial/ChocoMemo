// -Path: 'client/app/pages/edit/panel/ActivityPanel.tsx'
import ActivityContent from './ActivityContent';
import type { IDockviewPanelProps } from 'dockview-react';

/**
 * The activity panel: a thin dockview adapter that renders the shared activity
 * content (the explorer rail and the panel chooser) inside a dock panel.
 *
 * @param props - The dockview panel props, used to dock new panels.
 */
export default function ActivityPanel({ api }: IDockviewPanelProps) {
    return <ActivityContent referenceId={api.id} />;
}
