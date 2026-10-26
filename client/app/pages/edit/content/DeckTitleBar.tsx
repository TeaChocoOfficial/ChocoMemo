// -Path: 'client/app/pages/edit/content/DeckTitleBar.tsx'
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import type { Languages } from '~/data/language';
import { PANEL_DEFS } from '~/pages/edit/panel/panels';
import { useOpenPanel } from '~/hooks/editor/useOpenPanel';
import { FaArrowLeft, FaBars, FaGear, FaLayerGroup } from 'react-icons/fa6';

/** The registry id of the workspace settings panel. */
const SETTING_PANEL_ID = 'setting';

/** Props for {@link DeckTitleBar}. */
interface DeckTitleBarProps {
    language: Languages;
    onMenuClick?: () => void;
}

/**
 * VS Code-style title bar for the deck editor: a back button on the left (the
 * editor is full-screen, so the site navbar is not there to leave it), the
 * workspace name beside it, and the target language plus a settings shortcut on
 * the right. Language-agnostic — each track passes its own language in.
 *
 * @param props - The target language whose decks are being edited, and an
 *                optional callback to open the mobile menu.
 */
export default function DeckTitleBar({ language, onMenuClick }: DeckTitleBarProps) {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const openPanel = useOpenPanel({ direction: 'within' });

    /** Opens the settings panel; it activates the open one instead of a copy. */
    const openSetting = () => {
        const def = PANEL_DEFS.find((panel) => panel.id === SETTING_PANEL_ID);
        if (def) openPanel(def);
    };

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

            <div className='flex gap-2'>
                <span className='shrink-0 rounded-sm bg-primary-subtle px-2 py-0.5 text-[11px] font-medium text-primary'>
                    {t(`language.${language}`)}
                </span>
                <button
                    type='button'
                    onClick={openSetting}
                    title={t('deck.edit.settingTitle')}
                    aria-label={t('deck.edit.settingTitle')}
                    className='flex h-6 w-6 shrink-0 items-center justify-center rounded-sm text-surface-muted transition-colors hover:bg-surface hover:text-surface-foreground'
                >
                    <FaGear className='h-3 w-3' />
                </button>
            </div>
        </div>
    );
}
