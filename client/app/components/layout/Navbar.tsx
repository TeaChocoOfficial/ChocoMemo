// -Path: 'client/app/components/layout/Navbar.tsx'
import { useEffect, useRef, useState } from 'react';
import { Link } from '~/i18n/routing';
import { getAssetUrl } from '~/utils/url';
import { useTranslation } from 'react-i18next';
import { FaBars, FaXmark, FaEyeSlash } from 'react-icons/fa6';
import { AnimatePresence, motion } from 'framer-motion';
import ThemePicker from '../config/ThemePicker';
import LanguageSwitcher from '../config/LanguageSwitcher';
import { useChromeStore } from '~/stores/chrome.store';

export default function Navbar() {
    const { t } = useTranslation();
    const setShowChrome = useChromeStore((s) => s.setShowChrome);
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    // Close the dropdown when clicking outside of it
    useEffect(() => {
        if (!menuOpen) return;
        const handleClickOutside = (event: MouseEvent) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target as Node) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target as Node)
            ) {
                setMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [menuOpen]);

    const handleHideChrome = () => {
        setMenuOpen(false);
        setShowChrome(false);
    };

    return (
        <nav className='fixed w-full top-0 z-50 border-b border-line bg-surface'>
            <div className='mx-auto max-w-6xl px-4 sm:px-6'>
                <div className='flex h-16 items-center justify-between'>
                    <Link to='/' className='flex items-center gap-3 group'>
                        <img src={getAssetUrl('/icon.svg')} alt='Choco' className='h-12 w-12 shrink-0' />
                        <span className='flex flex-col leading-tight'>
                            <span className='text-lg font-extrabold tracking-tight text-accent'>
                                ChocoMemo
                            </span>
                            <span className='hidden text-[10px] font-medium uppercase tracking-[0.18em] text-surface-muted sm:block'>
                                {t('nav.tagline')}
                            </span>
                        </span>
                    </Link>

                    {/* Desktop: inline right controls */}
                    <div className='hidden items-center gap-3 sm:flex'>
                        <button
                            type='button'
                            title={t('chrome.hide')}
                            aria-label={t('chrome.hide')}
                            onClick={() => setShowChrome(false)}
                            className='inline-flex items-center gap-1.5 rounded-sm px-3 py-2 text-sm font-bold text-surface-muted transition-colors hover:text-error cursor-pointer'
                        >
                            <FaEyeSlash className='w-4 h-4' />
                            <span className='hidden md:inline'>{t('chrome.hide')}</span>
                        </button>
                        <LanguageSwitcher />
                        <ThemePicker />
                    </div>

                    {/* Mobile: hamburger to open the right-control dropdown */}
                    <div className='relative sm:hidden' ref={menuRef}>
                        <button
                            ref={buttonRef}
                            type='button'
                            title={t('nav.menu')}
                            aria-label={t('nav.menu')}
                            aria-expanded={menuOpen}
                            aria-controls='navbar-mobile-menu'
                            onClick={() => setMenuOpen((open) => !open)}
                            className='inline-flex h-10 w-10 items-center justify-center rounded-sm border border-line text-surface-foreground transition-colors cursor-pointer hover:border-accent hover:text-accent'
                        >
                            {menuOpen ? (
                                <FaXmark className='w-4 h-4' />
                            ) : (
                                <FaBars className='w-4 h-4' />
                            )}
                        </button>

                        <AnimatePresence>
                            {menuOpen && (
                                <motion.div
                                    id='navbar-mobile-menu'
                                    initial={{ opacity: 0, y: 6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 6 }}
                                    transition={{ duration: 0.15 }}
                                    className='absolute right-0 top-full z-50 mt-2 w-64 rounded-sm border border-line bg-surface-elevated p-4 shadow-lg'
                                >
                                    <button
                                        type='button'
                                        onClick={handleHideChrome}
                                        className='flex w-full items-center gap-2 rounded-sm border border-line bg-surface px-3 py-2 text-sm font-bold text-surface-muted transition-colors cursor-pointer hover:border-error hover:text-error'
                                    >
                                        <FaEyeSlash className='w-4 h-4' />
                                        {t('chrome.hide')}
                                    </button>
                                    <div className='mt-3 space-y-3'>
                                        <LanguageSwitcher />
                                        <ThemePicker />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </nav>
    );
}