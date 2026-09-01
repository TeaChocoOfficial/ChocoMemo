// -Path: 'Vite-React-Router-TypeScript/app/components/layout/Navbar.tsx'
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ThemeToggle from '../config/ThemeToggle';
import { FaBars, FaXmark } from 'react-icons/fa6';
import { Link, usePathname } from '~/i18n/routing';
import { motion, AnimatePresence } from 'framer-motion';
import LanguageSwitcher from '../config/LanguageSwitcher';

interface NavLinkProps {
    to: string;
    label: string;
    isActive: boolean;
    onClick?: () => void;
    isMobile?: boolean;
}

function NavLink({ to, label, onClick, isActive, isMobile }: NavLinkProps) {
    return (
        <Link
            to={to}
            onClick={onClick}
            className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                isActive
                    ? 'text-primary bg-primary/10 hover:bg-primary/20'
                    : 'text-surface-foreground hover:bg-primary/20'
            }`}
        >
            {label}
            {isActive && (
                <motion.span
                    layoutId={`nav-indicator-${isMobile ? 'mobile' : 'desktop'}`}
                    className='absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-primary rounded-full'
                />
            )}
        </Link>
    );
}

export default function Navbar() {
    const pathname = usePathname();
    const { t } = useTranslation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navLinks = [
        { to: '/', label: t('nav.home') },
        { to: '/about', label: t('nav.about') },
        { to: '/auth', label: t('nav.auth') },
        { to: '/socket', label: t('nav.socket') },
        { to: '/threejs', label: t('nav.threejs') },
    ];

    return (
        <nav className='fixed w-full top-0 z-50 border-b border-border/50 bg-surface-overlay/80 backdrop-blur-xl'>
            <div className='mx-auto max-w-6xl px-4 sm:px-6'>
                <div className='flex h-16 items-center justify-between'>
                    <Link to='/' className='flex items-center gap-3 group'>
                        <div className='flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-primary to-secondary shadow-lg shadow-primary/25 transition-transform duration-300 group-hover:scale-110'>
                            <span className='text-lg font-black text-primary-foreground'>V</span>
                        </div>
                        <span className='text-lg font-bold tracking-tight text-surface-foreground hidden sm:block'>
                            Vite Router
                        </span>
                    </Link>

                    <div className='hidden md:flex items-center gap-1'>
                        {navLinks.map((link) => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                label={link.label}
                                isActive={pathname === link.to}
                            />
                        ))}
                    </div>

                    <div className='flex items-center gap-3'>
                        <LanguageSwitcher />
                        <ThemeToggle />
                        <button
                            className='md:hidden flex items-center justify-center w-9 h-9 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer'
                            onClick={() => setIsMenuOpen((prev) => !prev)}
                        >
                            {isMenuOpen ? (
                                <FaXmark className='w-5 h-5' />
                            ) : (
                                <FaBars className='w-5 h-5' />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className='md:hidden border-t border-border/50 bg-background/95 backdrop-blur-xl overflow-hidden'
                    >
                        <div className='flex flex-col gap-1 p-4'>
                            {navLinks.map((link) => (
                                <NavLink
                                    key={link.to}
                                    to={link.to}
                                    label={link.label}
                                    isActive={pathname === link.to}
                                    onClick={() => setIsMenuOpen(false)}
                                    isMobile
                                />
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
