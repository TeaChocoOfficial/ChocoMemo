// -Path: 'client/app/components/layout/Navbar.tsx'
import { Link } from '~/i18n/routing';
import { useTranslation } from 'react-i18next';
import ThemePicker from '../config/ThemePicker';
import LanguageSwitcher from '../config/LanguageSwitcher';

export default function Navbar() {
    const { t } = useTranslation();

    return (
        <nav className='fixed w-full top-0 z-50 border-b border-line bg-surface'>
            <div className='mx-auto max-w-6xl px-4 sm:px-6'>
                <div className='flex h-16 items-center justify-between'>
                    <Link to='/' className='flex items-center gap-3 group'>
                        <div className='flex h-9 w-9 items-center justify-center rounded-sm bg-accent'>
                            <span className='text-lg font-black leading-none text-accent-foreground'>
                                茶
                            </span>
                        </div>
                        <span className='flex flex-col leading-tight'>
                            <span className='text-lg font-extrabold tracking-tight text-surface-foreground'>
                                Choco
                                <span className='text-accent'>.</span>
                            </span>
                            <span className='hidden text-[10px] font-medium uppercase tracking-[0.18em] text-surface-muted sm:block'>
                                {t('nav.tagline')}
                            </span>
                        </span>
                    </Link>

                    <div className='flex items-center gap-3'>
                        <LanguageSwitcher />
                        <ThemePicker />
                    </div>
                </div>
            </div>
        </nav>
    );
}
