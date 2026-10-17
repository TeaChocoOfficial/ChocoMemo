// -Path: 'client/app/hooks/editor/useEditor.ts'
import { useTargetLang } from '~/hooks/base/useTargetLang';
import { useDeckEditor, type DeckEditor } from './useDeckEditor';

/**
 * The deck-editor surface for the mounted workspace. The target language comes
 * from the same URL/store source the page uses, so every dockview panel can
 * subscribe to the editor stores directly instead of receiving the surface
 * through React context.
 *
 * @returns The editor surface for the active target language.
 */
export function useEditor(): DeckEditor {
    return useDeckEditor(useTargetLang());
}
