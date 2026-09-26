// -Path: 'client/app/pages/home/HomeLanguages.tsx'
import { Link } from '~/i18n/routing';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Section from '~/components/custom/Section';
import { FaArrowRight, FaCircleRight, FaLock } from 'react-icons/fa6';

/** Alphabetical by language code, matching the hero's script band. */
const LANGUAGES = [
    { id: 'english', code: 'en', glyph: 'A', scriptLang: 'en', available: false },
    { id: 'japanese', code: 'ja', glyph: 'あ', scriptLang: 'ja', available: true },
    { id: 'korean', code: 'ko', glyph: '한', scriptLang: 'ko', available: false },
    { id: 'thai', code: 'th', glyph: 'ก', scriptLang: 'th', available: false },
    { id: 'chinese', code: 'zh', glyph: '字', scriptLang: 'zh', available: false },
] as const;

export default function HomeLanguages() {
    const { t } = useTranslation();

    return (
        <Section className='items-center'>
            <div className='mx-auto w-full max-w-6xl px-4 sm:px-6'>
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ margin: '-100px' }}
                    transition={{ duration: 0.5 }}
                    className='mb-10 max-w-2xl'
                >
                    <div className='flex items-center gap-3'>
                        <span className='font-mono text-xs font-bold uppercase tracking-[0.14em] text-primary'>
                            {t('home.languages.badge')}
                        </span>
                        <span className='h-px w-10 bg-line-strong' />
                    </div>
                    <h2 className='mt-3 text-2xl font-bold tracking-tight text-surface-foreground sm:text-3xl'>
                        {t('home.languages.title')}
                    </h2>
                    <p className='mt-2 text-sm leading-relaxed text-surface-muted sm:text-base'>
                        {t('home.languages.hint')}
                    </p>
                </motion.div>

                <div className='grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5'>
                    {LANGUAGES.map((language, index) => {
                        const body = (
                            <>
                                <div className='flex items-start justify-between gap-2'>
                                    <span
                                        lang={language.scriptLang}
                                        className='text-4xl font-black leading-none text-surface-subtle'
                                    >
                                        {language.glyph}
                                    </span>
                                    {language.available ? (
                                        <span className='mt-1 h-2 w-2 shrink-0 rounded-full bg-success' />
                                    ) : (
                                        <FaLock className='mt-1 h-3.5 w-3.5 shrink-0 text-surface-muted' />
                                    )}
                                </div>

                                <h3 className='mt-5 text-base font-bold tracking-tight text-surface-foreground'>
                                    {t(`home.languages.items.${language.id}.name`)}
                                </h3>
                                <p className='mt-1 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-primary'>
                                    {language.code}
                                </p>
                                <p className='mt-3 text-sm leading-relaxed text-surface-muted'>
                                    {t(`home.languages.items.${language.id}.description`)}
                                </p>
                            </>
                        );

                        return (
                            <motion.div
                                key={language.id}
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ margin: '-100px' }}
                                transition={{ duration: 0.5, delay: index * 0.07 }}
                                className='h-full'
                            >
                                {language.available ? (
                                    <Link
                                        to='/japanese'
                                        className='group flex h-full flex-col rounded-sm border border-line bg-surface p-5 transition-colors duration-200 hover:border-primary hover:bg-surface-overlay'
                                    >
                                        {body}
                                        <span className='mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-primary'>
                                            {t('home.languages.available')}
                                            <FaArrowRight className='h-3 w-3 transition-transform duration-200 group-hover:translate-x-1' />
                                        </span>
                                    </Link>
                                ) : (
                                    <div className='flex h-full flex-col rounded-sm border border-line bg-surface p-5 opacity-70'>
                                        {body}
                                        <span className='mt-5 inline-flex items-center gap-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-surface-muted'>
                                            <FaLock className='h-3 w-3' />
                                            {t('home.languages.comingSoon')}
                                        </span>
                                    </div>
                                )}
                            </motion.div>
                        );
                    })}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ margin: '-100px' }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className='mt-10 flex justify-center'
                >
                    <Link
                        to='/language-select'
                        className='group inline-flex items-center gap-2 text-sm font-semibold text-primary underline-offset-4 hover:underline'
                    >
                        {t('home.languages.toAll')}
                        <FaCircleRight className='h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1' />
                    </Link>
                </motion.div>
            </div>
        </Section>
    );
}
