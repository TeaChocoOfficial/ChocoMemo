// -Path: 'client/app/pages/home/HomeHero.tsx'
import { Link } from '~/i18n/routing';
import { motion } from 'framer-motion';
import Badge from '~/components/custom/Badge';
import { getAssetUrl } from '~/utils/url';
import { useTranslation } from 'react-i18next';
import { FaCircleRight } from 'react-icons/fa6';

export default function HomeHero() {
    const { t } = useTranslation();

    return (
        <section className='relative min-h-dvh flex items-center justify-center overflow-hidden py-28'>
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className='relative mx-auto max-w-4xl px-4 sm:px-6 text-center'
            >
                <motion.img
                    src={getAssetUrl('/icon.svg')}
                    alt='Choco'
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.7, ease: 'easeOut' }}
                    className='mx-auto mb-8 h-28 w-28 sm:h-36 sm:w-36 drop-shadow-lg'
                />

                <Badge variant='info' className='mb-6'>
                    {t('home.badge')}
                </Badge>

                <h1 className='text-5xl sm:text-6xl lg:text-7xl font-black tracking-tighter leading-[1.05] text-surface-foreground mb-6'>
                    {t('home.title')} <span className='text-accent'>{t('home.titleAccent')}</span>
                </h1>

                <p className='mx-auto max-w-2xl text-lg sm:text-xl text-surface-subtle leading-relaxed mb-10'>
                    {t('home.subtitle')}
                </p>

                <div className='flex flex-col sm:flex-row items-center justify-center gap-4'>
                    <Link
                        to='/language-select'
                        className='inline-flex items-center gap-2 rounded-sm bg-accent px-7 py-3.5 text-base font-semibold text-accent-foreground transition-colors duration-200 hover:bg-accent-emphasis'
                    >
                        {t('home.ctaStart')}
                        <FaCircleRight className='w-4 h-4' />
                    </Link>
                    <Link
                        to='/japanese/characters'
                        className='inline-flex items-center gap-2 rounded-sm border border-line-strong px-7 py-3.5 text-base font-semibold text-surface-foreground transition-colors duration-200 hover:border-accent hover:text-accent'
                    >
                        {t('home.ctaBrowse')}
                    </Link>
                </div>
            </motion.div>
        </section>
    );
}