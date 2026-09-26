import { motion } from 'framer-motion';
import { Link } from '~/i18n/routing';
import { useTranslation } from 'react-i18next';
import Section from '~/components/custom/Section';
import LanguageSwitcher from '~/components/config/LanguageSwitcher';
import VoicePicker from '~/components/config/VoicePicker';
import Switch from '~/components/custom/Switch';

import ThemeGrid from './ThemeGrid';
import { useChromeStore } from '~/stores/chrome.store';
import { FaArrowLeft, FaSliders } from 'react-icons/fa6';

function SectionHeading({ step, label, hint }: { step: string; label: string; hint: string }) {
    return (
        <div className='mb-5'>
            <div className='flex items-center gap-3'>
                <span className='font-mono text-xs font-bold tracking-[0.14em] text-primary'>
                    {step}
                </span>
                <span className='h-px w-10 bg-line-strong' />
                <h2 className='text-lg sm:text-xl font-bold tracking-tight text-surface-foreground'>
                    {label}
                </h2>
            </div>
            <p className='mt-1.5 text-sm leading-relaxed text-surface-muted'>{hint}</p>
        </div>
    );
}

export default function SettingsPage() {
    const { t } = useTranslation();

    const { showChrome, setShowChrome } = useChromeStore();

    const sections = [
        { id: 'appearance', label: t('settings.nav.appearance') },
        { id: 'language', label: t('settings.nav.language') },
        { id: 'voice', label: t('settings.nav.voice') },
        { id: 'interface', label: t('settings.nav.interface') },
    ];

    const scrollTo = (id: string) =>
        document
            .getElementById(`settings-${id}`)
            ?.scrollIntoView({ behavior: 'smooth', block: 'start' });

    return (
        <Section className='items-start justify-center'>
            <div className='mx-auto max-w-5xl px-4 sm:px-6 w-full'>
                <Link
                    to='/'
                    className='inline-flex items-center gap-2 mb-6 text-sm font-medium text-surface-muted hover:text-primary transition-colors'
                >
                    <FaArrowLeft className='w-3.5 h-3.5' />
                    {t('settings.back')}
                </Link>

                <div className='mb-10 flex items-center gap-4'>
                    <span className='flex h-12 w-12 items-center justify-center rounded-sm bg-primary/12 text-primary'>
                        <FaSliders className='h-5 w-5' />
                    </span>
                    <div>
                        <span className='font-mono text-xs font-bold tracking-[0.14em] text-primary'>
                            {t('settings.nav.settings')}
                        </span>
                        <h1 className='text-2xl sm:text-3xl font-black tracking-tight text-surface-foreground'>
                            {t('settings.title')}
                        </h1>
                        <p className='mt-0.5 text-sm text-surface-muted'>
                            {t('settings.subtitle')}
                        </p>
                    </div>
                </div>

                <div className='grid grid-cols-1 gap-8 lg:grid-cols-[220px_1fr] lg:gap-10'>
                    {/* Section nav */}
                    <nav className='hidden lg:block'>
                        <div className='sticky top-20 space-y-0.5 border-l border-line'>
                            {sections.map((s) => (
                                <button
                                    key={s.id}
                                    type='button'
                                    onClick={() => scrollTo(s.id)}
                                    className='block w-full border-l border-transparent px-4 py-1.5 text-left text-sm font-medium text-surface-muted transition-colors cursor-pointer hover:text-surface-foreground -ml-px'
                                >
                                    {s.label}
                                </button>
                            ))}
                        </div>
                    </nav>

                    {/* Settings content */}
                    <div className='space-y-12'>
                        <motion.section
                            id='settings-appearance'
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.05 }}
                        >
                            <SectionHeading
                                step='01'
                                label={t('settings.nav.appearance')}
                                hint={t('settings.appearance.hint')}
                            />
                            <ThemeGrid />
                        </motion.section>

                        <motion.section
                            id='settings-language'
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.1 }}
                            className='rounded-sm border border-line bg-surface p-5 sm:p-6'
                        >
                            <SectionHeading
                                step='02'
                                label={t('settings.nav.language')}
                                hint={t('settings.language.hint')}
                            />
                            <div className='max-w-sm'>
                                <LanguageSwitcher />
                            </div>
                        </motion.section>

                        <motion.section
                            id='settings-voice'
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.15 }}
                            className='rounded-sm border border-line bg-surface p-5 sm:p-6'
                        >
                            <SectionHeading
                                step='03'
                                label={t('settings.nav.voice')}
                                hint={t('settings.voice.hint')}
                            />
                            <VoicePicker />
                        </motion.section>

                        <motion.section
                            id='settings-interface'
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.2 }}
                            className='rounded-sm border border-line bg-surface p-5 sm:p-6'
                        >
                            <SectionHeading
                                step='04'
                                label={t('settings.nav.interface')}
                                hint={t('settings.interface.hint')}
                            />
                            <Switch
                                checked={showChrome}
                                onCheckedChange={setShowChrome}
                                label={t('settings.interface.chromeLabel')}
                                description={t('settings.interface.chromeDescription')}
                            />
                        </motion.section>
                    </div>
                </div>
            </div>
        </Section>
    );
}
