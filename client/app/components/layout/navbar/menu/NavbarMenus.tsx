import Skeleton from '../../../custom/Skeleton';
import GuestMenus from './GuestMenus';
import { motion } from 'framer-motion';
import ProfileDropdown from './ProfileDropdown';
import ProfileMenu from './ProfileMenu';
import { useAuthStore } from '~/stores/config/auth.store';
import { useClickOutside } from './useClickOutside';
import { useRef, useState } from 'react';
import MenuButton from './MenuButton';

export default function NavbarMenus() {
    const { user, loading } = useAuthStore();
    const profileRef = useRef<HTMLDivElement>(null);
    const [profileOpen, setProfileOpen] = useState(false);

    useClickOutside(profileRef, () => setProfileOpen(false), profileOpen);

    const isAuthenticated = user !== null && user !== undefined;

    return (
        <div className='relative' ref={profileRef}>
            <div className='flex shrink-0 items-center gap-1.5'>
                {loading ? (
                    <div className='hidden items-center gap-1.5 sm:flex'>
                        <Skeleton className='h-8 w-20' />
                    </div>
                ) : isAuthenticated ? (
                    <ProfileMenu />
                ) : (
                    <GuestMenus />
                )}
                {!isAuthenticated && <MenuButton open={profileOpen} setOpen={setProfileOpen} />}
                <ProfileDropdown open={profileOpen} setOpen={setProfileOpen} />
            </div>
        </div>
    );
}
