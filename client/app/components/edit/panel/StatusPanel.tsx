// -Path: 'client/app/components/edit/StatusPanel.tsx'
import DeckStatusBar from '../content/DeckStatusBar';
import { useEditor } from '../components/EditorContext';
import type { IDockviewPanelProps } from 'dockview-react';

/** Dockview panel that renders the editor status bar. */
export default function StatusPanel(_props: IDockviewPanelProps) {
    const { decks, visibleDecks, selected } = useEditor();

    return (
        <DeckStatusBar
            total={decks.length}
            visible={visibleDecks.length}
            selected={selected}
        />
    );
}
