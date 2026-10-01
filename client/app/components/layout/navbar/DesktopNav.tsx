import { Languages } from '~/data/language';
import TrackDropdown from './TrackDropdown';
import { getPrimaryNavItems } from './utils';
import { useTranslation } from 'react-i18next';
import { Link, usePathname } from '~/i18n/routing';

export default function DesktopNav() {
    const { t } = useTranslation();
    const pathname = usePathname();
    const primary = getPrimaryNavItems(t);

    return (
        <div className='hidden items-center gap-0.5 lg:flex'>
            {primary.map((item) => {
                const Icon = item.icon;
                return (
                    <Link
                        key={item.to}
                        to={item.to}
                        className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium transition-colors cursor-pointer rounded-sm ${
                            pathname === item.to
                                ? 'text-primary'
                                : 'text-surface-muted hover:text-surface-foreground hover:bg-surface-overlay'
                        }`}
                    >
                        <Icon className='h-3.5 w-3.5' />
                        {item.label}
                    </Link>
                );
            })}

            <TrackDropdown language={Languages.en} variant='desktop' />
            <TrackDropdown language={Languages.ja} variant='desktop' />
        </div>
    );
}
