// -Path: 'client/app/pages/home/HomeHero.tsx'
import env from '~/secure/env';
import { Link } from '~/i18n/routing';
import { motion } from 'framer-motion';
import { getAssetUrl } from '~/utils/url';
import Badge from '~/components/custom/Badge';
import { useTranslation } from 'react-i18next';
import Section from '~/components/custom/Section';
import { FaCircleRight, FaGithub, FaPenNib } from 'react-icons/fa6';
import { languages } from '~/data/language';

export default function HomeHero() {
    const { t } = useTranslation();

    return (
        <Section className='items-center justify-center'>
            <div className='mx-auto w-full max-w-4xl px-4 text-center sm:px-6'>
                <motion.div
                    animate={{ opacity: 1, y: 0 }}
                    initial={{ opacity: 0, y: 32 }}
                    transition={{ duration: 0.7, ease: 'easeOut' }}
                >
                    {/* Poster mark */}
                    <div className='mx-auto w-fit'>
                        <motion.img
                            initial={{ opacity: 0, scale: 0.88 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
                            alt='ChocoMemo'
                            src={getAssetUrl('/logo.png')}
                            className='h-40 w-40 sm:h-52 sm:w-52 lg:h-60 lg:w-60'
                        />
                    </div>

                    <div className='mt-6 flex flex-wrap items-center justify-center gap-2'>
                        <Badge variant='info'>{t('home.badge')}</Badge>
                        <a
                            href='https://github.com/TeaChocoOfficial/ChocoMemo'
                            target='_blank'
                            rel='noopener noreferrer'
                            title={`v${env.VERSION}`}
                            className='inline-flex items-center gap-1.5 rounded-sm border border-line bg-surface px-2.5 py-1 font-mono text-[11px] font-semibold text-surface-subtle transition-colors hover:border-primary hover:text-primary'
                        >
                            <FaGithub aria-hidden='true' />v{env.VERSION}
                        </a>
                    </div>

                    <h1 className='mx-auto mt-6 max-w-4xl text-3xl font-black leading-[1.05] tracking-tighter text-surface-foreground sm:text-4xl lg:text-5xl'>
                        {t('home.title')}{' '}
                        <span className='text-primary'>{t('home.titleAccent')}</span>
                    </h1>

                    <p className='mx-auto mt-6 max-w-2xl text-base leading-relaxed text-surface-subtle sm:text-lg'>
                        {t('home.subtitle')}
                    </p>

                    <div className='mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row'>
                        <Link
                            to='/language-select'
                            className='inline-flex w-full items-center justify-center gap-2 rounded-sm bg-primary px-7 py-3.5 text-base font-semibold text-primary-foreground transition-colors duration-200 hover:bg-primary-emphasis sm:w-auto'
                        >
                            {t('home.ctaStart')}
                            <FaCircleRight className='h-4 w-4' />
                        </Link>
                        <Link
                            to='/auth'
                            className='inline-flex w-full items-center justify-center gap-2 rounded-sm border border-line-strong px-7 py-3.5 text-base font-semibold text-surface-foreground transition-colors duration-200 hover:border-primary hover:text-primary sm:w-auto'
                        >
                            <FaPenNib className='h-4 w-4' />
                            {t('home.ctaCreate')}
                        </Link>
                    </div>

                    <Link
                        to='#how-it-works'
                        className='mt-7 inline-flex items-center gap-2 text-sm font-medium text-surface-muted underline-offset-4 transition-colors hover:text-primary hover:underline'
                    >
                        {t('home.ctaHow')}
                    </Link>
                </motion.div>

                {/* The shelf: one cell per language script */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: 'easeOut', delay: 0.35 }}
                    className='mt-14'
                >
                    <p className='font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-surface-muted'>
                        {t('home.scriptsLabel')}
                    </p>
                    <ul className='mt-4 grid grid-cols-5 divide-x divide-line overflow-hidden rounded-sm border border-line'>
                        {languages.map((language) => (
                            <li key={language.code} className='px-2 py-5'>
                                <span
                                    lang={language.code}
                                    className='block text-2xl font-black leading-none text-surface-foreground sm:text-3xl'
                                >
                                    {language.glyph}
                                </span>
                                <span className='mt-2 block font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-primary'>
                                    {language.code}
                                </span>
                            </li>
                        ))}
                    </ul>
                </motion.div>
            </div>
        </Section>
    );
}
