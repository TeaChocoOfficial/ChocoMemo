// -Path: 'client/app/components/layout/navbar/Navbar.tsx'
import NavbarLogo from './NavbarLogo';
import DesktopNav from './DesktopNav';
import { useEffect, useState } from 'react';
import NavbarMenus from './menu/NavbarMenus';
import AuthModal from '../../auth/AuthModal';
import { useAuthStore } from '~/stores/auth.store';

export default function Navbar() {
    const { user } = useAuthStore();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 8);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <>
            <nav
                className={`fixed inset-x-0 top-0 z-50 transition-all duration-200 ${
                    scrolled
                        ? 'bg-surface/90 backdrop-blur-xl border-b border-line'
                        : 'bg-surface/60 backdrop-blur-md border-b border-transparent'
                }`}
            >
                <div className='mx-auto max-w-7xl px-4 sm:px-6'>
                    <div className='flex h-14 items-center justify-between gap-4'>
                        <NavbarLogo />

                        <DesktopNav />

                        <NavbarMenus />
                    </div>
                </div>
            </nav>

            {!user && <AuthModal />}
        </>
    );
}
