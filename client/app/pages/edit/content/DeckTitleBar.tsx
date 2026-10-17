// -Path: 'client/app/pages/edit/content/DeckTitleBar.tsx'
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import type { Languages } from '~/data/language';
import { FaArrowLeft, FaBars, FaLayerGroup } from 'react-icons/fa6';

/** Props for {@link DeckTitleBar}. */
interface DeckTitleBarProps {
    language: Languages;
    onMenuClick?: () => void;
}

/**
 * VS Code-style title bar for the deck editor: a back button on the left (the
 * editor is full-screen, so the site navbar is not there to leave it), the
 * workspace name beside it, and the target language on the right.
 * Language-agnostic — each track passes its own language in.
 *
 * @param props - The target language whose decks are being edited, and an
 *                optional callback to open the mobile menu.
 */
export default function DeckTitleBar({ language, onMenuClick }: DeckTitleBarProps) {
    const { t } = useTranslation();
    const navigate = useNavigate();

    return (
        <div className='flex h-9 shrink-0 items-center justify-between gap-4 border-b border-line bg-surface-overlay px-3'>
            <div className='flex min-w-0 items-center gap-2'>
                {onMenuClick && (
                    <button
                        type='button'
                        title={t('deck.edit.openMenu')}
                        onClick={onMenuClick}
                        aria-label={t('deck.edit.openMenu')}
                        className='flex h-6 w-6 shrink-0 items-center justify-center rounded-sm text-surface-muted transition-colors hover:bg-surface-overlay hover:text-surface-foreground'
                    >
                        <FaBars className='h-3 w-3' />
                    </button>
                )}

                <button
                    type='button'
                    title={t('deck.edit.back')}
                    onClick={() => navigate(-1)}
                    aria-label={t('deck.edit.back')}
                    className='flex h-6 w-6 shrink-0 items-center justify-center rounded-sm text-surface-muted transition-colors hover:bg-surface-overlay hover:text-surface-foreground'
                >
                    <FaArrowLeft className='h-3 w-3' />
                </button>

                <FaLayerGroup className='h-3.5 w-3.5 shrink-0 text-primary' />
                <span className='truncate text-xs font-bold tracking-tight text-surface-foreground'>
                    {t('deck.edit.title')}
                </span>
            </div>

            <span className='shrink-0 rounded-sm bg-primary-subtle px-2 py-0.5 text-[11px] font-medium text-primary'>
                {t(`language.${language}`)}
            </span>
        </div>
    );
}
