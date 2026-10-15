// -Path: 'client/app/components/edit/EditorContext.tsx'
import type { ReactNode } from 'react';
import type { DeckEditor } from '../../../hooks/edito/useDeckEditor';
import { createContext, useContext } from 'react';

/** The shared deck-editor surface; `null` until a provider supplies one. */
const EditorContext = createContext<DeckEditor | null>(null);

/**
 * Publishes one `useDeckEditor` instance to the panels dockview renders, so a
 * panel reads the editor state from context rather than receiving it through
 * dockview's panel parameters.
 *
 * @param props - The editor surface and the dockview tree to wrap.
 */
export function EditorProvider({ value, children }: { value: DeckEditor; children: ReactNode }) {
    return <EditorContext.Provider value={value}>{children}</EditorContext.Provider>;
}

/**
 * Reads the deck-editor surface from context.
 *
 * @returns The editor surface shared by {@link EditorProvider}.
 * @throws When called outside an {@link EditorProvider}.
 */
export function useEditor(): DeckEditor {
    const editor = useContext(EditorContext);
    if (!editor) throw new Error('useEditor must be used inside an EditorProvider');
    return editor;
}
