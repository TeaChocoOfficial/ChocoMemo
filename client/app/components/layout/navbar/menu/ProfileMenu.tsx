import { getInitials } from '../utils';
import { motion } from 'framer-motion';
import { useRef, useState } from 'react';
import ProfileDropdown from './ProfileDropdown';
import { FaChevronDown } from 'react-icons/fa6';
import { useAuthStore } from '~/stores/auth.store';
import { useClickOutside } from './useClickOutside';

export default function ProfileMenu() {
    const { user } = useAuthStore();
    const profileRef = useRef<HTMLDivElement>(null);
    const [profileOpen, setProfileOpen] = useState(false);

    useClickOutside(profileRef, () => setProfileOpen(false), profileOpen);

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
                    <span className='flex h-7 w-7 items-center justify-center rounded-sm bg-primary/15 text-xs font-bold text-primary'>
                        {getInitials(user?.name)}
                    </span>
                )}
                <FaChevronDown
                    className={`h-3 w-3 text-surface-muted transition-transform duration-200 ${
                        profileOpen ? 'rotate-180' : ''
                    }`}
                />
            </motion.button>

            <ProfileDropdown open={profileOpen} setOpen={setProfileOpen} />
        </div>
    );
}
