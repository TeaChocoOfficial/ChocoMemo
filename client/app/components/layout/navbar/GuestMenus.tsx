import { FaBars, FaSliders, FaXmark } from 'react-icons/fa6';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useClickOutside } from './useClickOutside';
import { AnimatePresence, motion } from 'framer-motion';
import Button from '../../custom/Button';
import MenuDropdown from './MenuDropdown';
import NavLinks from './NavLinks';
import MenuControls from './MenuControls';
import HideChromeButton from './HideChromeButton';

type GuestMenusProps = {
    onSignIn: () => void;
};

export default function GuestMenus({ onSignIn }: GuestMenusProps) {
    const { t } = useTranslation();
    const menuRef = useRef<HTMLDivElement>(null);
    const settingsRef = useRef<HTMLDivElement>(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const [settingsOpen, setSettingsOpen] = useState(false);

    useClickOutside(menuRef, () => setMenuOpen(false), menuOpen);
    useClickOutside(settingsRef, () => setSettingsOpen(false), settingsOpen);

    const handleHideChrome = () => {
        setMenuOpen(false);
        setSettingsOpen(false);
    };

    const handleSignIn = () => {
        setMenuOpen(false);
        onSignIn();
    };

    return (
        <>
            {/* Desktop: Sign In + settings */}
            <div className='items-center gap-1.5 flex shrink-0'>
                <div className='hidden sm:block'>
                    <Button variant='primary' size='sm' onClick={onSignIn}>
                        {t('auth.signIn')}
                    </Button>
                </div>

                {/* Settings button - consolidates theme, language, hide chrome */}
                <div className='relative' ref={settingsRef}>
                    <motion.button
                        whileTap={{ scale: 0.96 }}
                        type='button'
                        title={t('nav.settings')}
                        aria-label={t('nav.settings')}
                        onClick={() => setSettingsOpen((o) => !o)}
                        className={`inline-flex items-center justify-center rounded-sm p-2 text-sm transition-colors cursor-pointer ${
                            settingsOpen
                                ? 'bg-surface-overlay text-surface-foreground'
                                : 'text-surface-muted hover:text-surface-foreground hover:bg-surface-overlay'
                        }`}
                    >
                        <FaSliders className='h-4 w-4' />
                    </motion.button>

                    <MenuDropdown open={settingsOpen}>
                        <div className='sm:hidden border-b border-line px-3 py-3'>
                            <button
                                type='button'
                                onClick={handleSignIn}
                                className='flex w-full items-center justify-center gap-2 rounded-sm bg-accent px-3 py-2 text-sm font-medium text-accent-foreground transition-colors cursor-pointer hover:bg-accent-emphasis'
                            >
                                {t('auth.signIn')}
                            </button>
                        </div>
                        <NavLinks
                            onNavigate={() => setSettingsOpen(false)}
                            className='border-b border-line px-1.5 py-1.5'
                        />
                        <MenuControls className='p-3 space-y-3' />
                        <HideChromeButton
                            onHide={handleHideChrome}
                            className='border-t border-line'
                            buttonClassName='rounded-b-sm'
                        />
                    </MenuDropdown>
                </div>
            </div>
        </>
    );
}
