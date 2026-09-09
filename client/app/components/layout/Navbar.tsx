// -Path: 'client/app/components/layout/Navbar.tsx'
import { useEffect, useRef, useState } from 'react';
import { Link, usePathname } from '~/i18n/routing';
import { getAssetUrl } from '~/utils/url';
import { useTranslation } from 'react-i18next';
import {
    FaBars,
    FaXmark,
    FaEyeSlash,
    FaRightFromBracket,
    FaUser,
    FaGear,
    FaChevronDown,
    FaSliders,
} from 'react-icons/fa6';
import { AnimatePresence, motion } from 'framer-motion';
import ThemePicker from '../config/ThemePicker';
import LanguageSwitcher from '../config/LanguageSwitcher';
import Button from '../custom/Button';
import { useChromeStore } from '~/stores/chrome.store';
import { useAuthStore } from '~/stores/auth.store';
import { authAPI } from '~/services/auth';
import AuthModal from '../auth/AuthModal';
import toast from 'react-hot-toast';

type NavItem = { label: string; to: string };

export default function Navbar() {
    const { t } = useTranslation();
    const pathname = usePathname();
    const { setShowChrome } = useChromeStore();
    const { user, setUser } = useAuthStore();
    const menuRef = useRef<HTMLDivElement>(null);
    const navRef = useRef<HTMLDivElement>(null);
    const profileRef = useRef<HTMLDivElement>(null);
    const settingsRef = useRef<HTMLDivElement>(null);
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [japaneseOpen, setJapaneseOpen] = useState(false);
    const [authModalOpen, setAuthModalOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 8);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        if (!menuOpen) return;
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node))
                setMenuOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [menuOpen]);

    useEffect(() => {
        if (!profileOpen) return;
        const handleClickOutside = (event: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(event.target as Node))
                setProfileOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [profileOpen]);

    useEffect(() => {
        if (!settingsOpen) return;
        const handleClickOutside = (event: MouseEvent) => {
            if (settingsRef.current && !settingsRef.current.contains(event.target as Node))
                setSettingsOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [settingsOpen]);

    useEffect(() => {
        if (!japaneseOpen) return;
        const handleClickOutside = (event: MouseEvent) => {
            if (navRef.current && !navRef.current.contains(event.target as Node))
                setJapaneseOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [japaneseOpen]);

    const handleHideChrome = () => {
        setMenuOpen(false);
        setSettingsOpen(false);
        setShowChrome(false);
    };

    const handleSignOut = async () => {
        setProfileOpen(false);
        setMenuOpen(false);
        try {
            await authAPI.logout();
            toast.success(t('auth.signOut'));
        } catch {
            toast.error(t('auth.error.generic'));
        } finally {
            setUser(null);
        }
    };

    const getInitials = (name?: string) => {
        if (!name) return '?';
        return name
            .split(' ')
            .map((w) => w[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const isAuthenticated = user !== null && user !== undefined;

    const japaneseLinks: NavItem[] = [
        { label: t('nav.japanese'), to: '/japanese' },
        { label: t('japanese.kana.title'), to: '/japanese/kana' },
        { label: t('japanese.kanaDrill.title'), to: '/japanese/kana-drill' },
        { label: t('japanese.exams.title'), to: '/japanese/exams' },
        { label: t('japanese.vocabularyReview.title'), to: '/japanese/review' },
    ];

    const isJapaneseActive = pathname.startsWith('/japanese');

    const navLink = (label: string, to: string, active: boolean) => (
        <Link
            to={to}
            className={`relative px-3 py-1.5 text-sm font-medium transition-colors cursor-pointer rounded-sm ${
                active ? 'text-accent' : 'text-surface-muted hover:text-surface-foreground hover:bg-surface-overlay'
            }`}
        >
            {label}
        </Link>
    );

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
                        {/* Left: logo */}
                        <Link to='/' className='flex shrink-0 items-center gap-2.5 group'>
                            <motion.img
                                src={getAssetUrl('/icon.svg')}
                                alt='Choco'
                                whileHover={{ rotate: -6, scale: 1.04 }}
                                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                                className='h-9 w-9 shrink-0'
                            />
                            <span className='hidden flex-col leading-tight sm:flex'>
                                <span className='text-base font-extrabold tracking-tight text-accent'>
                                    ChocoMemo
                                </span>
                                <span className='text-[10px] font-medium uppercase tracking-[0.16em] text-surface-muted'>
                                    {t('nav.tagline')}
                                </span>
                            </span>
                        </Link>

                        {/* Center: desktop nav links */}
                        <div ref={navRef} className='hidden items-center gap-0.5 lg:flex'>
                            {navLink(t('nav.home'), '/', pathname === '/')}
                            {navLink(
                                t('nav.languages'),
                                '/language-select',
                                pathname === '/language-select',
                            )}

                            {/* Japanese dropdown */}
                            <div className='relative'>
                                <button
                                    type='button'
                                    onClick={() => setJapaneseOpen((o) => !o)}
                                    className={`relative flex items-center gap-1 px-3 py-1.5 text-sm font-medium transition-colors cursor-pointer rounded-sm ${
                                        isJapaneseActive
                                            ? 'text-accent'
                                            : 'text-surface-muted hover:text-surface-foreground hover:bg-surface-overlay'
                                    }`}
                                >
                                    {t('nav.japanese')}
                                    <motion.span
                                        animate={{ rotate: japaneseOpen ? 180 : 0 }}
                                        transition={{ type: 'spring', stiffness: 400, damping: 24 }}
                                        className='text-surface-muted'
                                    >
                                        <FaChevronDown className='h-3 w-3' />
                                    </motion.span>
                                </button>
                                <AnimatePresence>
                                    {japaneseOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 6 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 6 }}
                                            transition={{ duration: 0.14, ease: 'easeOut' }}
                                            className='absolute left-0 top-full z-50 mt-1.5 w-52 overflow-hidden rounded-sm border border-line bg-surface-elevated shadow-xl shadow-black/8'
                                        >
                                            {japaneseLinks.map((link) => {
                                                const active = pathname === link.to;
                                                return (
                                                    <Link
                                                        key={link.to}
                                                        to={link.to}
                                                        onClick={() => setJapaneseOpen(false)}
                                                        className={`block px-3 py-2 text-sm transition-colors cursor-pointer ${
                                                            active
                                                                ? 'bg-accent/8 font-medium text-accent'
                                                                : 'text-surface-foreground hover:bg-surface-overlay'
                                                        }`}
                                                    >
                                                        {link.label}
                                                    </Link>
                                                );
                                            })}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Right: controls + auth */}
                        <div className='hidden items-center gap-1.5 sm:flex shrink-0'>
                            {/* Profile / Sign-in */}
                            {isAuthenticated ? (
                                <div className='relative' ref={profileRef}>
                                    <motion.button
                                        whileTap={{ scale: 0.97 }}
                                        type='button'
                                        onClick={() => setProfileOpen((o) => !o)}
                                        className={`flex items-center gap-1.5 rounded-sm py-1 pl-1 pr-2 transition-colors cursor-pointer ${
                                            profileOpen
                                                ? 'bg-surface-overlay'
                                                : 'hover:bg-surface-overlay'
                                        }`}
                                    >
                                        {user?.avatar ? (
                                            <img
                                                src={user.avatar}
                                                alt=''
                                                className='h-7 w-7 rounded-sm object-cover'
                                            />
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

                                    <AnimatePresence>
                                        {profileOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 6 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 6 }}
                                                transition={{ duration: 0.14, ease: 'easeOut' }}
                                                className='absolute right-0 top-full z-50 mt-1.5 w-56 overflow-hidden rounded-sm border border-line bg-surface-elevated shadow-xl shadow-black/8'
                                            >
                                                <div className='border-b border-line px-3 py-2.5'>
                                                    <p className='truncate text-sm font-medium text-surface-foreground'>
                                                        {user?.name}
                                                    </p>
                                                    <p className='truncate text-xs text-surface-muted'>
                                                        {user?.email}
                                                    </p>
                                                </div>
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
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ) : (
                                <Button
                                    variant='primary'
                                    size='sm'
                                    onClick={() => setAuthModalOpen(true)}
                                >
                                    {t('auth.signIn')}
                                </Button>
                            )}

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
                                <AnimatePresence>
                                    {settingsOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 6 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 6 }}
                                            transition={{ duration: 0.14, ease: 'easeOut' }}
                                            className='absolute right-0 top-full z-50 mt-1.5 w-64 rounded-sm border border-line bg-surface-elevated shadow-xl shadow-black/8'
                                        >
                                            <div className='p-3 space-y-3'>
                                                <div>
                                                    <span className='block text-[10px] font-bold uppercase tracking-[0.16em] text-surface-muted mb-1.5 px-0.5'>
                                                        {t('nav.language')}
                                                    </span>
                                                    <LanguageSwitcher />
                                                </div>
                                                <div>
                                                    <span className='block text-[10px] font-bold uppercase tracking-[0.16em] text-surface-muted mb-1.5 px-0.5'>
                                                        {t('nav.theme')}
                                                    </span>
                                                    <ThemePicker />
                                                </div>
                                            </div>
                                            <div className='border-t border-line'>
                                                <button
                                                    type='button'
                                                    onClick={handleHideChrome}
                                                    className='flex w-full items-center gap-2 rounded-b-sm px-3 py-2.5 text-sm text-surface-muted transition-colors cursor-pointer hover:bg-surface-overlay hover:text-error'
                                                >
                                                    <FaEyeSlash className='h-3.5 w-3.5' />
                                                    {t('chrome.hide')}
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Mobile: hamburger */}
                        <div className='relative sm:hidden' ref={menuRef}>
                            <motion.button
                                whileTap={{ scale: 0.9 }}
                                type='button'
                                title={t('nav.menu')}
                                aria-label={t('nav.menu')}
                                aria-expanded={menuOpen}
                                aria-controls='navbar-mobile-menu'
                                onClick={() => setMenuOpen((open) => !open)}
                                className='inline-flex h-9 w-9 items-center justify-center rounded-sm text-surface-muted transition-colors cursor-pointer hover:text-surface-foreground hover:bg-surface-overlay'
                            >
                                <AnimatePresence mode='wait' initial={false}>
                                    <motion.span
                                        key={menuOpen ? 'x' : 'bars'}
                                        initial={{ opacity: 0, rotate: -90, scale: 0.6 }}
                                        animate={{ opacity: 1, rotate: 0, scale: 1 }}
                                        exit={{ opacity: 0, rotate: 90, scale: 0.6 }}
                                        transition={{ duration: 0.12 }}
                                        className='inline-flex'
                                    >
                                        {menuOpen ? (
                                            <FaXmark className='h-4 w-4' />
                                        ) : (
                                            <FaBars className='h-4 w-4' />
                                        )}
                                    </motion.span>
                                </AnimatePresence>
                            </motion.button>

                            <AnimatePresence>
                                {menuOpen && (
                                    <motion.div
                                        id='navbar-mobile-menu'
                                        initial={{ opacity: 0, y: 6 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 6 }}
                                        transition={{ duration: 0.14, ease: 'easeOut' }}
                                        className='absolute right-0 top-full z-50 mt-1.5 w-64 origin-top-right overflow-hidden rounded-sm border border-line bg-surface-elevated shadow-xl shadow-black/8 max-h-[calc(100dvh-4.5rem)] overflow-y-auto'
                                    >
                                        {/* Auth section at top */}
                                        <div className='border-b border-line px-3 py-3'>
                                            {isAuthenticated ? (
                                                <div className='flex items-center gap-2.5'>
                                                    {user?.avatar ? (
                                                        <img
                                                            src={user.avatar}
                                                            alt=''
                                                            className='h-8 w-8 rounded-sm object-cover'
                                                        />
                                                    ) : (
                                                        <span className='flex h-8 w-8 items-center justify-center rounded-sm bg-accent/15 text-xs font-bold text-accent'>
                                                            {getInitials(user?.name)}
                                                        </span>
                                                    )}
                                                    <div className='min-w-0'>
                                                        <p className='truncate text-sm font-medium text-surface-foreground'>
                                                            {user?.name}
                                                        </p>
                                                        <p className='truncate text-xs text-surface-muted'>
                                                            {user?.email}
                                                        </p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <button
                                                    type='button'
                                                    onClick={() => {
                                                        setMenuOpen(false);
                                                        setAuthModalOpen(true);
                                                    }}
                                                    className='flex w-full items-center justify-center gap-2 rounded-sm bg-accent px-3 py-2 text-sm font-medium text-accent-foreground transition-colors cursor-pointer hover:bg-accent-emphasis'
                                                >
                                                    {t('auth.signIn')}
                                                </button>
                                            )}
                                        </div>

                                        {/* Navigation */}
                                        <div className='px-1.5 py-1.5'>
                                            <Link
                                                to='/'
                                                onClick={() => setMenuOpen(false)}
                                                className={`block rounded-sm px-2.5 py-2 text-sm font-medium transition-colors ${
                                                    pathname === '/'
                                                        ? 'bg-accent/8 text-accent'
                                                        : 'text-surface-foreground hover:bg-surface-overlay'
                                                }`}
                                            >
                                                {t('nav.home')}
                                            </Link>
                                            <Link
                                                to='/language-select'
                                                onClick={() => setMenuOpen(false)}
                                                className={`block rounded-sm px-2.5 py-2 text-sm font-medium transition-colors ${
                                                    pathname === '/language-select'
                                                        ? 'bg-accent/8 text-accent'
                                                        : 'text-surface-foreground hover:bg-surface-overlay'
                                                }`}
                                            >
                                                {t('nav.languages')}
                                            </Link>

                                            <div className='pt-2 pb-1 px-2.5 text-[10px] font-bold uppercase tracking-[0.16em] text-surface-muted'>
                                                {t('nav.japanese')}
                                            </div>
                                            {japaneseLinks.map((link) => (
                                                <Link
                                                    key={link.to}
                                                    to={link.to}
                                                    onClick={() => setMenuOpen(false)}
                                                    className={`block rounded-sm px-2.5 py-2 text-sm font-medium transition-colors ${
                                                        pathname === link.to
                                                            ? 'bg-accent/8 text-accent'
                                                            : 'text-surface-foreground hover:bg-surface-overlay'
                                                    }`}
                                                >
                                                    {link.label}
                                                </Link>
                                            ))}
                                        </div>

                                        {/* Controls */}
                                        <div className='border-t border-line px-3 py-2.5 space-y-2.5'>
                                            <LanguageSwitcher />
                                            <ThemePicker />
                                        </div>

                                        {/* Profile actions */}
                                        {isAuthenticated && (
                                            <div className='border-t border-line px-1.5 py-1.5'>
                                                <Link
                                                    to='/profile'
                                                    onClick={() => setMenuOpen(false)}
                                                    className='flex items-center gap-2 rounded-sm px-2.5 py-2 text-sm font-medium text-surface-foreground transition-colors cursor-pointer hover:bg-surface-overlay'
                                                >
                                                    <FaUser className='h-3.5 w-3.5 text-surface-muted' />
                                                    {t('auth.profile')}
                                                </Link>
                                                <Link
                                                    to='/settings'
                                                    onClick={() => setMenuOpen(false)}
                                                    className='flex items-center gap-2 rounded-sm px-2.5 py-2 text-sm font-medium text-surface-foreground transition-colors cursor-pointer hover:bg-surface-overlay'
                                                >
                                                    <FaGear className='h-3.5 w-3.5 text-surface-muted' />
                                                    {t('auth.settings')}
                                                </Link>
                                                <button
                                                    type='button'
                                                    onClick={handleSignOut}
                                                    className='flex w-full items-center gap-2 rounded-sm px-2.5 py-2 text-sm font-medium text-error transition-colors cursor-pointer hover:bg-error/8'
                                                >
                                                    <FaRightFromBracket className='h-3.5 w-3.5' />
                                                    {t('auth.signOut')}
                                                </button>
                                            </div>
                                        )}

                                        {/* Hide chrome */}
                                        <div className='border-t border-line px-1.5 py-1.5'>
                                            <button
                                                type='button'
                                                onClick={handleHideChrome}
                                                className='flex w-full items-center gap-2 rounded-sm px-2.5 py-2 text-sm text-surface-muted transition-colors cursor-pointer hover:bg-surface-overlay hover:text-error'
                                            >
                                                <FaEyeSlash className='h-3.5 w-3.5' />
                                                {t('chrome.hide')}
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </nav>

            <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
        </>
    );
}
