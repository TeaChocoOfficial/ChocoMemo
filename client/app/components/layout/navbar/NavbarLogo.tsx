import { Link } from '~/i18n/routing';
import { motion } from 'framer-motion';
import { getAssetUrl } from '~/utils/url';
import { useTranslation } from 'react-i18next';

export default function NavbarLogo() {
    const { t } = useTranslation();

    return (
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
    );
}