// -Path: 'client/app/components/edit/ActivityRail.tsx'
import { FaClock, FaHeart, FaLayerGroup } from 'react-icons/fa6';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useEditor } from '~/hooks/editor/useEditor';
import type { DeckView } from '~/stores/config/deckEditor.store';

/** One selectable explorer view. */
interface ViewItem {
    id: DeckView;
    icon: ReactNode;
}

const VIEWS: ViewItem[] = [
    { id: 'all', icon: <FaLayerGroup className='h-4 w-4' /> },
    { id: 'favourites', icon: <FaHeart className='h-4 w-4' /> },
    { id: 'recent', icon: <FaClock className='h-4 w-4' /> },
];

const BUTTON = 'relative flex h-11 w-11 items-center justify-center rounded-sm transition-colors';

/**
 * VS Code-style activity rail for the deck editor: one button per explorer view
 * (all decks, favourites, recent), with the active one underlined.
 */
export default function ActivityRail() {
    const { t } = useTranslation();
    const { view, setView } = useEditor();

    /** Label for a view button, from the shared i18n keys. */
    const viewLabel = (id: DeckView) =>
        id === 'all'
            ? t('deck.edit.viewAll')
            : id === 'favourites'
              ? t('deck.edit.viewFavourites')
              : t('deck.edit.viewRecent');

    return (
        <nav
            aria-label={t('deck.edit.views')}
            className='flex shrink-0 items-center gap-1 border-b border-line bg-surface-sunken px-1.5 py-1'
        >
            <div className='flex items-center gap-1'>
                {VIEWS.map((item) => {
                    const active = item.id === view;
                    const label = viewLabel(item.id);

                    return (
                        <button
                            key={item.id}
                            type='button'
                            title={label}
                            aria-label={label}
                            aria-pressed={active}
                            onClick={() => setView(item.id)}
                            className={`${BUTTON} ${
                                active
                                    ? 'bg-surface-overlay text-primary'
                                    : 'text-surface-muted hover:bg-surface-overlay hover:text-surface-foreground'
                            }`}
                        >
                            {item.icon}
                            {active && (
                                <span className='absolute bottom-0 left-1/2 h-0.5 w-5 -translate-x-1/2 rounded-full bg-primary' />
                            )}
                        </button>
                    );
                })}
            </div>
        </nav>
    );
}
