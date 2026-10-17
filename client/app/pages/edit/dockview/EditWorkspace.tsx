// -Path: 'client/app/components/edit/EditWorkspace.tsx'
import Dockviews from './Dockviews';
import { useEffect, useState } from 'react';
import { Languages } from '~/data/language';
import ActivityDrawer from './ActivityDrawer';
import StatusPanel from '../panel/StatusPanel';
import DeckTitleBar from '../content/DeckTitleBar';
import { useMediaQuery } from '~/hooks/editor/useMediaQuery';
import DeckEditorSkeleton from '../components/DeckEditorSkeleton';
import { useDeckStoreHydrated } from '../../../hooks/editor/useDeckStoreHydrated';

/** Props for {@link EditWorkspace}. */
interface EditWorkspaceProps {
    language: Languages;
}

/**
 * The deck manager, laid out like a VS Code window: a title bar, the dockview
 * workspace (deck explorer, editing form, and the other panels as tabs), and a
 * status bar. Independent of any language track, so every track mounts it with
 * only a `language` prop.
 *
 * Both breakpoints mount the same dockview workspace; the media query only
 * picks the variant. Below `md` it is a locked single group of tabs, above it
 * the full spatial arrangement. Dockview only mounts on the client: the media
 * query resolves to `false` on the server, so SSR renders the mobile variant
 * and there is nothing to hydrate on the docking tree. Until the deck store
 * hydrates a skeleton mirrors the same two variants in pure CSS.
 *
 * @param props - The track whose decks are managed.
 */
export default function EditWorkspace({ language }: EditWorkspaceProps) {
    const isDesktop = useMediaQuery('(min-width: 768px)');
    const hydrated = useDeckStoreHydrated();
    const [menuOpen, setMenuOpen] = useState(false);

    /** The drawer is mobile-only chrome; close it if the viewport grows. */
    useEffect(() => {
        if (isDesktop) setMenuOpen(false);
    }, [isDesktop]);

    if (!hydrated) return <DeckEditorSkeleton />;

    return (
        <div className='flex h-full flex-col'>
            <DeckTitleBar
                language={language}
                onMenuClick={isDesktop ? undefined : () => setMenuOpen(true)}
            />
            <div className='relative min-h-0 flex-1'>
                <Dockviews variant={isDesktop ? 'desktop' : 'mobile'} />
                <ActivityDrawer open={menuOpen} onClose={() => setMenuOpen(false)} />
            </div>
            <StatusPanel />
        </div>
    );
}
