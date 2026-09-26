import { useRef, useState } from 'react';
import { getJapaneseNavItems } from './utils';
import { useTranslation } from 'react-i18next';
import { FaChevronDown } from 'react-icons/fa6';
import { Link, usePathname } from '~/i18n/routing';
import { useClickOutside } from './menu/useClickOutside';
import { AnimatePresence, motion } from 'framer-motion';

export default function DesktopNav() {
    const { t } = useTranslation();
    const pathname = usePathname();
    const navRef = useRef<HTMLDivElement>(null);
    const [japaneseOpen, setJapaneseOpen] = useState(false);

    useClickOutside(navRef, () => setJapaneseOpen(false), japaneseOpen);

    const japaneseLinks = getJapaneseNavItems(t);
    const isJapaneseActive = pathname.startsWith('/japanese');

    const navLink = (label: string, to: string, active: boolean) => (
        <Link
            to={to}
            className={`relative px-3 py-1.5 text-sm font-medium transition-colors cursor-pointer rounded-sm ${
                active ? 'text-primary' : 'text-surface-muted hover:text-surface-foreground hover:bg-surface-overlay'
            }`}
        >
            {label}
        </Link>
    );

    return (
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
                            ? 'text-primary'
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
                                                ? 'bg-primary/8 font-medium text-primary'
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
    );
}