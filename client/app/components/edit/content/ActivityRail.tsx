// -Path: 'client/app/components/edit/ActivityRail.tsx'
import { Link } from '~/i18n/routing';
import { useEditor } from '../components/EditorContext';
import { useTranslation } from 'react-i18next';
import type { DeckView } from '../../../hooks/edito/useDeckEditor';
import type { ReactNode } from 'react';
import { THEMES, useThemeStore } from '~/stores/config/theme.store';
import type { ThemeName } from '~/stores/config/theme.store';
import { FaClock, FaGear, FaHeart, FaMoon, FaSun, FaLayerGroup } from 'react-icons/fa6';

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

const BUTTON =
    'relative flex h-11 w-11 items-center justify-center rounded-sm transition-colors';

/**
 * VS Code-style activity rail for the deck editor. The top group switches the
 * explorer's view (all decks, favourites, recent); the bottom group holds
 * app-level actions (theme light/dark toggle, settings).
 */
export default function ActivityRail() {
    const { t } = useTranslation();
    const { view, setView } = useEditor();
    const { theme, isDark, setTheme } = useThemeStore();

    /** Label for a view button, from the shared i18n keys. */
    const viewLabel = (id: DeckView) =>
        id === 'all'
            ? t('deck.edit.viewAll')
            : id === 'favourites'
              ? t('deck.edit.viewFavourites')
              : t('deck.edit.viewRecent');

    /** Flips between the light and dark variant of the current theme family. */
    const toggleTheme = () => {
        const flipped = (
            isDark ? theme.replace('dark-', 'light-') : theme.replace('light-', 'dark-')
        ) as ThemeName;
        setTheme(THEMES.some((item) => item.id === flipped) ? flipped : isDark ? 'light-choco' : 'dark-choco');
    };

    return (
        <nav
            aria-label={t('deck.edit.views')}
            className='flex shrink-0 flex-col items-center justify-between border-r border-line bg-surface-sunken py-1.5'
        >
            <div className='flex flex-col items-center gap-1'>
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
                                <span className='absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-primary' />
                            )}
                        </button>
                    );
                })}
            </div>

            <div className='flex flex-col items-center gap-1'>
                <button
                    type='button'
                    title={t('nav.theme')}
                    aria-label={t('nav.theme')}
                    onClick={toggleTheme}
                    className={`${BUTTON} text-surface-muted hover:bg-surface-overlay hover:text-surface-foreground`}
                >
                    {isDark ? <FaSun className='h-4 w-4' /> : <FaMoon className='h-4 w-4' />}
                </button>

                <Link
                    to='/settings'
                    title={t('nav.settings')}
                    aria-label={t('nav.settings')}
                    className={`${BUTTON} text-surface-muted hover:bg-surface-overlay hover:text-surface-foreground`}
                >
                    <FaGear className='h-4 w-4' />
                </Link>
            </div>
        </nav>
    );
}
