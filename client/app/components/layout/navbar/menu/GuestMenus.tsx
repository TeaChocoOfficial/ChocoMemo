import { motion } from 'framer-motion';
import Button from '../../../custom/Button';
import { useRef, useState } from 'react';
import { FaSliders } from 'react-icons/fa6';
import { useTranslation } from 'react-i18next';
import ProfileDropdown from './ProfileDropdown';
import { useAuthStore } from '~/stores/auth.store';
import { useClickOutside } from './useClickOutside';

export default function GuestMenus() {
    const { t } = useTranslation();
    const { setOpen } = useAuthStore();
    const settingsRef = useRef<HTMLDivElement>(null);
    const [settingsOpen, setSettingsOpen] = useState(false);

    useClickOutside(settingsRef, () => setSettingsOpen(false), settingsOpen);

    return (
        <>
            {/* Desktop: Sign In + settings */}
            <div className='items-center gap-1.5 flex shrink-0'>
                <div className='hidden sm:block'>
                    <Button variant='primary' size='sm' onClick={() => setOpen(true)}>
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

                    <ProfileDropdown open={settingsOpen} setOpen={setSettingsOpen} />
                </div>
            </div>
        </>
    );
}
