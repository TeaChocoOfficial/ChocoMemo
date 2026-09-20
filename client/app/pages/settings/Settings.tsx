import { motion } from 'framer-motion';
import { useState } from 'react';
import { Link } from '~/i18n/routing';
import { useTranslation } from 'react-i18next';
import Section from '~/components/custom/Section';
import LanguageSwitcher from '~/components/config/LanguageSwitcher';
import VoicePicker from '~/components/config/VoicePicker';
import AuthModal from '~/components/auth/AuthModal';
import Switch from '~/components/custom/Switch';
import Button from '~/components/custom/Button';
import ThemeGrid from './ThemeGrid';
import { useChromeStore } from '~/stores/chrome.store';
import { useAuthStore } from '~/stores/auth.store';
import { authAPI } from '~/services/auth';
import toast from 'react-hot-toast';
import { FaArrowLeft, FaUser, FaRightFromBracket, FaSliders } from 'react-icons/fa6';
import { useSignOut } from '~/components/layout/navbar/useSignOut';

function SectionHeading({ step, label, hint }: { step: string; label: string; hint: string }) {
    return (
        <div className='mb-5'>
            <div className='flex items-center gap-3'>
                <span className='font-mono text-xs font-bold tracking-[0.14em] text-accent'>
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
    const signOut = useSignOut();
    const { t } = useTranslation();
    const { user } = useAuthStore();
    const isAuthenticated = Boolean(user);
    const { showChrome, setShowChrome } = useChromeStore();

    const [authModalOpen, setAuthModalOpen] = useState(false);

    const sections = [
        { id: 'appearance', label: t('settings.nav.appearance') },
        { id: 'language', label: t('settings.nav.language') },
        { id: 'voice', label: t('settings.nav.voice') },
        { id: 'interface', label: t('settings.nav.interface') },
        { id: 'account', label: t('settings.nav.account') },
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
                    className='inline-flex items-center gap-2 mb-6 text-sm font-medium text-surface-muted hover:text-accent transition-colors'
                >
                    <FaArrowLeft className='w-3.5 h-3.5' />
                    {t('settings.back')}
                </Link>

                <div className='mb-10 flex items-center gap-4'>
                    <span className='flex h-12 w-12 items-center justify-center rounded-sm bg-accent/12 text-accent'>
                        <FaSliders className='h-5 w-5' />
                    </span>
                    <div>
                        <span className='font-mono text-xs font-bold tracking-[0.14em] text-accent'>
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

                        <motion.section
                            id='settings-account'
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.25 }}
                            className='rounded-sm border border-line bg-surface p-5 sm:p-6'
                        >
                            <SectionHeading
                                step='05'
                                label={t('settings.nav.account')}
                                hint={
                                    isAuthenticated
                                        ? t('settings.account.signedInHint', {
                                              name: user?.name ?? '',
                                          })
                                        : t('settings.account.signedOutHint')
                                }
                            />
                            {isAuthenticated ? (
                                <div className='flex flex-wrap items-center gap-3'>
                                    <Link
                                        to='/profile'
                                        className='inline-flex items-center gap-2 rounded-sm border border-line-strong px-4 py-2 text-sm font-semibold text-surface-foreground transition-colors cursor-pointer hover:border-accent hover:bg-accent-subtle'
                                    >
                                        <FaUser className='h-3.5 w-3.5' />
                                        {t('settings.account.goToProfile')}
                                    </Link>
                                    <Button variant='ghost' onClick={signOut}>
                                        <FaRightFromBracket className='h-3.5 w-3.5 text-error' />
                                        <span className='text-error'>{t('auth.signOut')}</span>
                                    </Button>
                                </div>
                            ) : (
                                <Button variant='primary' onClick={() => setAuthModalOpen(true)}>
                                    {t('settings.account.signIn')}
                                </Button>
                            )}
                        </motion.section>
                    </div>
                </div>
            </div>
            <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
        </Section>
    );
}
