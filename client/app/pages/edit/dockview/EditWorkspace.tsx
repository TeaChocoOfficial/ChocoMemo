// -Path: 'client/app/components/edit/EditWorkspace.tsx'
import './dockview-theme.css';
import Dockviews from './Dockviews';
import DeckEditList from '../content/DeckEditList';
import { Languages } from '~/data/language';
import DeckEditPanel from '../panel/DeckEditPanel';
import StatusPanel from '../panel/StatusPanel';
import { useTranslation } from 'react-i18next';
import DeckActivityBar from '../components/DeckActivityBar';
import { useDeckEditor } from '../../../hooks/edito/useDeckEditor';
import DeckEditorSkeleton from '../components/DeckEditorSkeleton';
import { EditorProvider } from '../components/EditorContext';
import 'dockview-react/dist/styles/dockview.css';
import { useMediaQuery } from '~/hooks/useMediaQuery';
import { useDeckStoreHydrated } from '../../../hooks/edito/useDeckStoreHydrated';

/** Props for {@link EditWorkspace}. */
interface EditWorkspaceProps {
    language: Languages;
}

/**
 * The deck manager, laid out like a VS Code window: an activity rail of deck
 * type filters, an explorer of decks, a tabbed dockview area holding the list
 * and the editing form, and a status bar. Independent of any language track, so
 * every track mounts it with only a `language` prop.
 *
 * Dockview only mounts on the client: the media query resolves to `false` on
 * the server, so SSR renders the stacked branch and there is nothing to hydrate
 * on the docking tree. On mobile the rail becomes a horizontal strip and the
 * panes stack.
 *
 * @param props - The track whose decks are managed.
 */
export default function EditWorkspace({ language }: EditWorkspaceProps) {
    const { t } = useTranslation();
    const editor = useDeckEditor(language);
    const hydrated = useDeckStoreHydrated();
    const isDesktop = useMediaQuery('(min-width: 768px)');

    if (!hydrated) return <DeckEditorSkeleton />;

    if (!isDesktop) {
        return (
            <div className='flex h-full flex-col gap-3 overflow-y-auto p-3'>
                <DeckActivityBar
                    direction='horizontal'
                    value={editor.typeFilter}
                    counts={editor.typeCounts}
                    onChange={editor.setTypeFilter}
                />
                <p className='rounded-sm border border-dashed border-line-strong px-4 py-3 text-center text-xs text-surface-muted'>
                    {t('deck.edit.mobileHint')}
                </p>
                <div className='rounded-sm border border-line'>
                    <DeckEditList
                        onDelete={editor.remove}
                        onSelect={editor.select}
                        onReorder={editor.reorder}
                        decks={editor.visibleDecks}
                        selectedId={editor.selectedId}
                    />
                </div>
                <div className='rounded-sm border border-line'>
                    <DeckEditPanel
                        key={editor.selected?.id ?? 'empty'}
                        deck={editor.selected}
                        onSave={editor.update}
                        onDelete={() => editor.remove()}
                    />
                </div>
            </div>
        );
    }

    return (
        <EditorProvider value={editor}>
            <div className='flex h-full flex-col'>
                <div className='min-h-0 flex-1'>
                    <Dockviews />
                </div>
                <StatusPanel />
            </div>
        </EditorProvider>
    );
}
