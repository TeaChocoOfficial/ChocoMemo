// -Path: 'client/app/components/edit/StatusPanel.tsx'
import DeckStatusBar from '../content/DeckStatusBar';
import { useEditor } from '../components/EditorContext';

/**
 * The editor status bar, rendered as fixed chrome below the dockview rather
 * than as a dockable panel. Reads the editor state from context.
 */
export default function StatusPanel() {
    const { decks, visibleDecks, selected } = useEditor();

    return <DeckStatusBar total={decks.length} visible={visibleDecks.length} selected={selected} />;
}
