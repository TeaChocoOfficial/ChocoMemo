// -Path: 'client/app/pages/home/HomeHero.tsx'
import env from '~/secure/env';
import { Link } from '~/i18n/routing';
import { motion } from 'framer-motion';
import { getAssetUrl } from '~/utils/url';
import Badge from '~/components/custom/Badge';
import { useTranslation } from 'react-i18next';
import { FaCircleRight } from 'react-icons/fa6';
import Section from '~/components/custom/Section';

export default function HomeHero() {
    const { t } = useTranslation();

    return (
        <Section className='items-center justify-center'>
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className='relative mx-auto max-w-4xl px-4 sm:px-6 text-center'
            >
                <motion.div
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.7, ease: 'easeOut' }}
                    className='mx-auto mb-8 h-28 w-28 sm:h-36 sm:w-36 drop-shadow-lg'
                >
                    <img
                        alt='ChocoMemo'
                        src={getAssetUrl('/icon.svg')}
                        className='h-full w-full drop-shadow-lg'
                    />
                    <span className='absolute -bottom-2 right-1 inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-overlay px-3 py-1 text-xs font-semibold text-surface-subtle shadow-lg transition-all'>
                        v{env.VERSION}
                    </span>
                </motion.div>

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
                        to='#how-it-works'
                        className='inline-flex items-center gap-2 rounded-sm border border-line-strong px-7 py-3.5 text-base font-semibold text-surface-foreground transition-colors duration-200 hover:border-accent hover:text-accent'
                    >
                        {t('home.ctaHow')}
                    </Link>
                </div>
            </motion.div>
        </Section>
    );
}
