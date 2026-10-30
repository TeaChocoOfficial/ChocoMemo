// -Path: 'client/app/components/edit/DeckListPanel.tsx'
import DeckList from '../content/DeckList';
import type { IDockviewPanelProps } from 'dockview-react';

/**
 * Dockview panel that renders the explorer: the deck list, narrowed by the
 * view and type filter chosen on the activity rail. The list stays a plain
 * component; dockview owns its tab, size and placement, and the panel reads the
 * editor state from the editor stores.
 */
export default function DeckListPanel(_props: IDockviewPanelProps) {
    return <DeckList />;
}
