// -Path: 'client/app/components/layout/navbar/DesktopNav.tsx'
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link, usePathname } from '~/i18n/routing';
import { getPrimaryNavItems, isNavItemActive } from './utils';

/**
 * Desktop primary navigation: the top-level destinations as a segmented control
 * with an animated active marker. Hidden below `lg`, where the mobile sheet
 * takes over.
 */
export default function DesktopNav() {
    const { t } = useTranslation();
    const pathname = usePathname();
    const primary = getPrimaryNavItems();

    return (
        <div className='hidden items-center gap-0.5 p-0.5 lg:flex'>
            {primary.map((item) => {
                const Icon = item.icon;
                const active = isNavItemActive(item, pathname);
                return (
                    <Link
                        key={item.to}
                        to={item.to}
                        aria-current={active ? 'page' : undefined}
                        className={`relative flex items-center gap-1.5 px-3.5 py-1.5 text-sm font-medium transition-colors ${
                            active
                                ? 'text-primary-foreground'
                                : 'text-surface-muted hover:text-surface-foreground'
                        }`}
                    >
                        {active && (
                            <motion.span
                                className='absolute inset-0 rounded-sm bg-primary'
                                transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                            />
                        )}
                        <Icon className='relative z-10 h-3.5 w-3.5' />
                        <span className='relative z-10'>{t(item.label)}</span>
                    </Link>
                );
            })}
        </div>
    );
}
