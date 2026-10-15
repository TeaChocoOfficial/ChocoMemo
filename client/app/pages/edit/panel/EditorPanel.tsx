// -Path: 'client/app/components/edit/EditorPanel.tsx'
import DeckEditPanel from './DeckEditPanel';
import { useEditor } from '../components/EditorContext';
import type { IDockviewPanelProps } from 'dockview-react';

/**
 * Dockview panel that renders the form for the selected deck. Keyed by deck id
 * so switching decks resets the form drafts instead of syncing them by effect.
 */
export default function EditorPanel(_props: IDockviewPanelProps) {
    const { selected, remove, update } = useEditor();

    return (
        <DeckEditPanel
            key={selected?.id ?? 'empty'}
            deck={selected}
            onSave={update}
            onDelete={() => remove()}
        />
    );
}
