import { useEffect, useState } from 'react';
import { FaChevronDown } from 'react-icons/fa6';
import { Link, usePathname } from '~/i18n/routing';
import { useTranslation } from 'react-i18next';
import { getJapaneseNavItems } from './utils';
import { AnimatePresence, motion } from 'framer-motion';

type NavLinksProps = {
    onNavigate: () => void;
    className?: string;
};

export default function NavLinks({ onNavigate, className = '' }: NavLinksProps) {
    const { t } = useTranslation();
    const pathname = usePathname();
    const [japaneseOpen, setJapaneseOpen] = useState(false);
    const japaneseLinks = getJapaneseNavItems(t);

    const hasActiveJapanese = japaneseLinks.some((link) => pathname === link.to);

    useEffect(() => {
        if (hasActiveJapanese) setJapaneseOpen(true);
    }, [hasActiveJapanese]);

    const linkClass = (active: boolean) =>
        `block rounded-sm px-2.5 py-2 text-sm font-medium transition-colors ${
            active ? 'bg-accent/8 text-accent' : 'text-surface-foreground hover:bg-surface-overlay'
        }`;

    return (
        <div className={className}>
            <Link to='/' onClick={onNavigate} className={linkClass(pathname === '/')}>
                {t('nav.home')}
            </Link>
            <Link
                to='/language-select'
                onClick={onNavigate}
                className={linkClass(pathname === '/language-select')}
            >
                {t('nav.languages')}
            </Link>

            {/* Japanese dropdown */}
            <div>
                <button
                    type='button'
                    onClick={() => setJapaneseOpen((o) => !o)}
                    aria-expanded={japaneseOpen}
                    className={`flex w-full items-center justify-between gap-2 rounded-sm px-2.5 py-2 text-sm font-medium transition-colors cursor-pointer ${
                        hasActiveJapanese
                            ? 'text-accent'
                            : 'text-surface-muted hover:bg-surface-overlay hover:text-surface-foreground'
                    }`}
                >
                    {t('nav.japanese')}
                    <FaChevronDown
                        className={`h-3 w-3 shrink-0 transition-transform duration-200 ${
                            japaneseOpen ? 'rotate-180' : ''
                        }`}
                    />
                </button>
                <AnimatePresence initial={false}>
                    {japaneseOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.16, ease: 'easeOut' }}
                            className='overflow-hidden'
                        >
                            <div className='pb-1.5'>
                                {japaneseLinks.map((link) => (
                                    <Link
                                        key={link.to}
                                        to={link.to}
                                        onClick={onNavigate}
                                        className={linkClass(pathname === link.to)}
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}