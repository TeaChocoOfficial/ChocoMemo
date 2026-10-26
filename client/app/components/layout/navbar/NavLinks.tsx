// -Path: 'client/app/components/layout/navbar/NavLinks.tsx'
import { useTranslation } from 'react-i18next';
import { Link, usePathname } from '~/i18n/routing';
import { getPrimaryNavItems, isNavItemActive } from './utils';

type NavLinksProps = {
    className?: string;
    onNavigate: () => void;
};

/** Mobile sheet contents: the same links as the desktop bar, stacked. */
export default function NavLinks({ onNavigate, className = '' }: NavLinksProps) {
    const { t } = useTranslation();
    const pathname = usePathname();
    const primary = getPrimaryNavItems();

    const linkClass = (active: boolean) =>
        `flex items-center gap-2.5 rounded-sm px-2.5 py-2 text-sm font-medium transition-colors ${
            active
                ? 'bg-primary/8 text-primary'
                : 'text-surface-foreground hover:bg-surface-overlay'
        }`;

    return (
        <div className={className}>
            {primary.map((item) => (
                <Link
                    key={item.to}
                    to={item.to}
                    onClick={onNavigate}
                    className={linkClass(isNavItemActive(item, pathname))}
                >
                    <item.icon className='h-3.5 w-3.5 shrink-0 opacity-70' />
                    {t(item.label)}
                </Link>
            ))}
        </div>
    );
}
