import Skeleton from '../../custom/Skeleton';
import GuestMenus from './GuestMenus';
import ProfileMenu from './ProfileMenu';
import { useAuthStore } from '~/stores/auth.store';

type NavbarMenusProps = {
    onSignIn: () => void;
};

export default function NavbarMenus({ onSignIn }: NavbarMenusProps) {
    const { user, loading } = useAuthStore();

    const isAuthenticated = user !== null && user !== undefined;

    if (loading) {
        return (
            <div className='flex shrink-0 items-center gap-1.5'>
                <div className='hidden items-center gap-1.5 sm:flex'>
                    <Skeleton className='h-8 w-20' />
                </div>
                <div className='flex items-center gap-1.5'>
                    <Skeleton className='h-7 w-7 rounded-full' />
                    <Skeleton className='h-3 w-3' />
                </div>
            </div>
        );
    }

    return isAuthenticated ? <ProfileMenu /> : <GuestMenus onSignIn={onSignIn} />;
}
