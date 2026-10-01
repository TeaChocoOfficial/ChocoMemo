import { Languages } from '~/data/language';
import { useTranslation } from 'react-i18next';
import { FaChevronDown } from 'react-icons/fa6';
import { Link, usePathname } from '~/i18n/routing';
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useClickOutside } from './menu/useClickOutside';
import { getTrackNavItems, type NavItem } from './utils';

interface TrackDropdownProps {
    language: Languages;
    /** Desktop sits on one row; mobile stacks and drops the absolute panel. */
    onNavigate?: () => void;
    variant: 'desktop' | 'mobile';
}

/** A language track and its features, as one collapsible group.
 *
 * Shared by the desktop bar and the mobile sheet, which previously kept two
 * copies of this markup and had already drifted apart. */
export default function TrackDropdown({ language, variant, onNavigate }: TrackDropdownProps) {
    const { t } = useTranslation();
    const pathname = usePathname();
    const isDesktop = variant === 'desktop';
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const links: NavItem[] = getTrackNavItems(language, t);
    const { glyph } = links[0];

    useClickOutside(ref, () => setOpen(false), open);

    // Keep the group expanded when navigating within it, so a sub-page doesn't
    // collapse the list the user is moving through.
    const hasActive = links.some((link) => pathname === link.to);
    useEffect(() => {
        if (hasActive && !isDesktop) setOpen(true);
    }, [hasActive]);

    const trigger = (
        <button
            type='button'
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
            className={
                isDesktop
                    ? `relative flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium transition-colors cursor-pointer rounded-sm ${
                          hasActive
                              ? 'text-primary'
                              : 'text-surface-muted hover:text-surface-foreground hover:bg-surface-overlay'
                      }`
                    : `flex w-full items-center justify-between gap-2 rounded-sm px-2.5 py-2 text-sm font-medium transition-colors cursor-pointer ${
                          hasActive
                              ? 'text-primary'
                              : 'text-surface-muted hover:bg-surface-overlay hover:text-surface-foreground'
                      }`
            }
        >
            <span className='flex items-center gap-1.5'>
                <span
                    aria-hidden='true'
                    className='w-5 text-center text-base leading-none font-black'
                >
                    {glyph}
                </span>
                {t(`nav.${language}`)}
            </span>
            {isDesktop ? (
                <motion.span
                    animate={{ rotate: open ? 180 : 0 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 24 }}
                    className='text-surface-muted'
                >
                    <FaChevronDown className='h-3 w-3' />
                </motion.span>
            ) : (
                <FaChevronDown
                    className={`h-3 w-3 shrink-0 transition-transform duration-200 ${
                        open ? 'rotate-180' : ''
                    }`}
                />
            )}
        </button>
    );

    const rowClass = (active: boolean) =>
        isDesktop
            ? `flex items-center gap-2.5 px-3 py-2 text-sm transition-colors cursor-pointer ${
                  active
                      ? 'bg-primary/8 font-medium text-primary'
                      : 'text-surface-foreground hover:bg-surface-overlay'
              }`
            : `flex items-center gap-2.5 rounded-sm px-2.5 py-2 text-sm transition-colors ${
                  active
                      ? 'bg-primary/8 font-medium text-primary'
                      : 'text-surface-foreground hover:bg-surface-overlay'
              }`;

    const rows = links.map((link) => {
        const LinkIcon = link.icon;
        return (
            <Link
                key={link.to}
                to={link.to}
                onClick={() => {
                    onNavigate?.();
                    if (isDesktop) setOpen(false);
                }}
                className={rowClass(pathname === link.to)}
            >
                {link.glyph ? (
                    <span
                        aria-hidden='true'
                        className='h-3.5 w-3.5 shrink-0 text-center text-base leading-none font-black opacity-80'
                    >
                        {link.glyph}
                    </span>
                ) : (
                    <LinkIcon className='h-3.5 w-3.5 shrink-0 opacity-70' />
                )}
                {link.label}
            </Link>
        );
    });

    if (!isDesktop) {
        return (
            <div>
                {trigger}
                <AnimatePresence initial={false}>
                    {open && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.16, ease: 'easeOut' }}
                            className='overflow-hidden'
                        >
                            <div className='pb-1.5'>{rows}</div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        );
    }

    return (
        <div ref={ref} className='relative'>
            {trigger}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }}
                        transition={{ duration: 0.14, ease: 'easeOut' }}
                        className='absolute left-0 top-full z-50 mt-1.5 w-56 overflow-hidden rounded-sm border border-line bg-surface-elevated shadow-xl shadow-black/8'
                    >
                        {rows}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
