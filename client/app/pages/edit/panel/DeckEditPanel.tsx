// -Path: 'client/app/components/edit/DeckEditPanel.tsx'
import DeckEdit from '../content/DeckEdit';
import { useEditor } from '~/hooks/editor/useEditor';
import type { IDockviewPanelProps } from 'dockview-react';

/**
 * Dockview panel that renders the form for the selected deck. The form is keyed
 * by deck id (and by draft mode) so moving to another row starts from that
 * deck's values, instead of keeping the previous deck's drafts in place.
 *
 * @returns The deck form for the current selection.
 */
export default function DeckEditPanel(_props: IDockviewPanelProps) {
    const { creating, selected } = useEditor();
    return <DeckEdit key={creating ? 'draft' : (selected?.id ?? 'empty')} />;
}
