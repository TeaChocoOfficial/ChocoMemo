import NavLinks from '../NavLinks';
import { Link } from '~/i18n/routing';
import { useSwal } from '~/hooks/useSwal';
import { authAPI } from '~/services/auth';
import MenuControls from './MenuControls';
import type { SetState } from '~/types/type';
import { useTranslation } from 'react-i18next';
import { getAccountEmail } from '~/utils/auth';
import HideChromeButton from './HideChromeButton';
import { useAuthStore } from '~/stores/config/auth.store';
import MenuDropdown from '~/components/custom/MenuDropdown';
import { FaGear, FaRightFromBracket, FaUser } from 'react-icons/fa6';

export default function ProfileDropdown({
    open,
    setOpen,
}: {
    open: boolean;
    setOpen: SetState<boolean>;
}) {
    const swal = useSwal();
    const { t } = useTranslation();
    const { user, setUser } = useAuthStore();
    const { setOpen: setAuthOpen } = useAuthStore();

    const handleSignOut = async () => {
        setOpen(false);
        try {
            await authAPI.logout();
            swal.success(t('auth.signOut'));
            setUser(null);
        } catch (error) {
            swal.error(t('auth.error.generic'), { error });
        }
    };

    const handleSignIn = () => {
        setOpen(false);
        setAuthOpen(true);
    };

    return (
        <MenuDropdown
            open={open}
            className='overflow-hidden max-h-[calc(100dvh-4.5rem)] overflow-y-auto'
        >
            {user ? (
                <div className='border-b border-line px-3 py-2.5'>
                    <p className='truncate text-sm font-medium text-surface-foreground'>
                        {user.name}
                    </p>
                    <p className='truncate text-xs text-surface-muted'>{getAccountEmail(user)}</p>
                </div>
            ) : (
                <div className='sm:hidden border-b border-line px-3 py-3'>
                    <button
                        type='button'
                        onClick={handleSignIn}
                        className='flex w-full items-center justify-center gap-2 rounded-sm bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-colors cursor-pointer hover:bg-primary-emphasis'
                    >
                        {t('auth.signIn')}
                    </button>
                </div>
            )}
            <NavLinks
                onNavigate={() => setOpen(false)}
                className='block lg:hidden border-b border-line px-1.5 py-1.5'
            />

            <MenuControls className='border-b border-line px-3 py-3 space-y-3' />

            <HideChromeButton onHide={() => setOpen(false)} />

            <Link
                to='/profile'
                onClick={() => setOpen(false)}
                className='flex items-center gap-2 px-3 py-2 text-sm text-surface-foreground transition-colors cursor-pointer hover:bg-surface-overlay'
            >
                <FaUser className='h-3.5 w-3.5 text-surface-muted' />
                {t('auth.profile')}
            </Link>
            <Link
                to='/settings'
                onClick={() => setOpen(false)}
                className='flex items-center gap-2 px-3 py-2 text-sm text-surface-foreground transition-colors cursor-pointer hover:bg-surface-overlay'
            >
                <FaGear className='h-3.5 w-3.5 text-surface-muted' />
                {t('auth.settings')}
            </Link>

            {user && (
                <button
                    type='button'
                    onClick={handleSignOut}
                    className='flex w-full items-center gap-2 px-3 py-2 text-sm text-error transition-colors cursor-pointer hover:bg-error/8 border-t border-line'
                >
                    <FaRightFromBracket className='h-3.5 w-3.5' />
                    {t('auth.signOut')}
                </button>
            )}
        </MenuDropdown>
    );
}
