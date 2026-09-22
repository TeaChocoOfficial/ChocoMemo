import NavLinks from './NavLinks';
import { Link } from '~/i18n/routing';
import { getInitials } from './utils';
import { motion } from 'framer-motion';
import { useRef, useState } from 'react';
import { useSignOut } from './useSignOut';
import MenuControls from './MenuControls';
import MenuDropdown from './MenuDropdown';
import { useTranslation } from 'react-i18next';
import { getAccountEmail } from '~/types/auth';
import HideChromeButton from './HideChromeButton';
import { useAuthStore } from '~/stores/auth.store';
import { useClickOutside } from './useClickOutside';
import { FaChevronDown, FaGear, FaRightFromBracket, FaUser } from 'react-icons/fa6';

export default function ProfileMenu() {
    const signOut = useSignOut();
    const { t } = useTranslation();
    const { user } = useAuthStore();
    const profileRef = useRef<HTMLDivElement>(null);
    const [profileOpen, setProfileOpen] = useState(false);

    useClickOutside(profileRef, () => setProfileOpen(false), profileOpen);

    const handleHideChrome = () => {
        setProfileOpen(false);
    };

    const handleSignOut = () => {
        setProfileOpen(false);
        signOut();
    };

    return (
        <div className='relative' ref={profileRef}>
            <motion.button
                whileTap={{ scale: 0.97 }}
                type='button'
                onClick={() => setProfileOpen((o) => !o)}
                className={`flex items-center gap-1.5 rounded-sm py-1 pl-1 pr-2 transition-colors cursor-pointer ${
                    profileOpen ? 'bg-surface-overlay' : 'hover:bg-surface-overlay'
                }`}
            >
                {user?.avatar ? (
                    <img src={user.avatar} alt='' className='h-7 w-7 rounded-sm object-cover' />
                ) : (
                    <span className='flex h-7 w-7 items-center justify-center rounded-sm bg-accent/15 text-xs font-bold text-accent'>
                        {getInitials(user?.name)}
                    </span>
                )}
                <FaChevronDown
                    className={`h-3 w-3 text-surface-muted transition-transform duration-200 ${
                        profileOpen ? 'rotate-180' : ''
                    }`}
                />
            </motion.button>

            <MenuDropdown
                open={profileOpen}
                className='overflow-hidden max-h-[calc(100dvh-4.5rem)] overflow-y-auto'
            >
                <div className='border-b border-line px-3 py-2.5'>
                    <p className='truncate text-sm font-medium text-surface-foreground'>
                        {user?.name}
                    </p>
                    <p className='truncate text-xs text-surface-muted'>{getAccountEmail(user)}</p>
                </div>

                <NavLinks
                    onNavigate={() => setProfileOpen(false)}
                    className='block lg:hidden border-b border-line px-1.5 py-1.5'
                />

                <MenuControls className='border-b border-line px-3 py-3 space-y-3' />

                <HideChromeButton onHide={handleHideChrome} className='border-b border-line' />

                <Link
                    to='/profile'
                    onClick={() => setProfileOpen(false)}
                    className='flex items-center gap-2 px-3 py-2 text-sm text-surface-foreground transition-colors cursor-pointer hover:bg-surface-overlay'
                >
                    <FaUser className='h-3.5 w-3.5 text-surface-muted' />
                    {t('auth.profile')}
                </Link>
                <Link
                    to='/settings'
                    onClick={() => setProfileOpen(false)}
                    className='flex items-center gap-2 px-3 py-2 text-sm text-surface-foreground transition-colors cursor-pointer hover:bg-surface-overlay'
                >
                    <FaGear className='h-3.5 w-3.5 text-surface-muted' />
                    {t('auth.settings')}
                </Link>
                <div className='border-t border-line' />
                <button
                    type='button'
                    onClick={handleSignOut}
                    className='flex w-full items-center gap-2 px-3 py-2 text-sm text-error transition-colors cursor-pointer hover:bg-error/8'
                >
                    <FaRightFromBracket className='h-3.5 w-3.5' />
                    {t('auth.signOut')}
                </button>
            </MenuDropdown>
        </div>
    );
}
