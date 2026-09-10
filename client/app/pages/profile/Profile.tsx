import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { Link } from '~/i18n/routing';
import { useTranslation } from 'react-i18next';
import Section from '~/components/custom/Section';
import AuthModal from '~/components/auth/AuthModal';
import Badge from '~/components/custom/Badge';
import Button from '~/components/custom/Button';
import AccountDetails from './AccountDetails';
import { useAuthStore } from '~/stores/auth.store';
import { useKanaProgressStore } from '~/stores/kanaProgress.store';
import { useVocabProgressStore } from '~/stores/vocabProgress.store';
import { useVocabularyStore } from '~/stores/vocabulary.store';
import { FaArrowLeft, FaUser } from 'react-icons/fa6';

function Stat({ label, value }: { label: string; value: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className='rounded-sm border border-line bg-surface p-4 sm:p-5'
        >
            <div className='font-mono text-2xl sm:text-3xl font-black tabular-nums text-accent'>
                {value.toLocaleString()}
            </div>
            <div className='mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-surface-muted'>
                {label}
            </div>
        </motion.div>
    );
}

export default function ProfilePage() {
    const { t } = useTranslation();
    const { user, setUser } = useAuthStore();
    const kanaProgress = useKanaProgressStore((s) => s.progress);
    const vocabProgress = useVocabProgressStore((s) => s.progress);
    const totalVocabulary = useVocabularyStore((s) => s.all().length);

    const [authModalOpen, setAuthModalOpen] = useState(false);

    const memberSince = useMemo(() => {
        if (!user?.createdAt) return null;
        const date = new Date(user.createdAt);
        if (Number.isNaN(date.getTime())) return null;
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        }).format(date);
    }, [user?.createdAt]);

    const isAuthenticated = Boolean(user);

    if (!isAuthenticated) {
        return (
            <Section className='items-center justify-center'>
                <div className='mx-auto flex max-w-xl flex-col items-center px-4 text-center sm:px-6'>
                    <span className='mb-6 flex h-16 w-16 items-center justify-center rounded-sm bg-accent/12 text-accent'>
                        <FaUser className='h-7 w-7' />
                    </span>
                    <h1 className='text-2xl sm:text-3xl font-black tracking-tight text-surface-foreground'>
                        {t('profile.notSignedInTitle')}
                    </h1>
                    <p className='mt-3 max-w-md text-sm leading-relaxed text-surface-muted'>
                        {t('profile.notSignedInHint')}
                    </p>
                    <Button
                        variant='primary'
                        className='mt-8'
                        onClick={() => setAuthModalOpen(true)}
                    >
                        {t('profile.signIn')}
                    </Button>
                </div>
                <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
            </Section>
        );
    }

    const wordsLearned = Object.values(vocabProgress).filter((p) => p.reviewCount > 0).length;
    const dueForReview = Object.values(vocabProgress).filter((p) => p.dueAt > 0 && p.dueAt <= Date.now())
        .length;
    const kanaRead = Object.keys(kanaProgress).length;

    return (
        <Section className='items-start justify-center'>
            <div className='mx-auto max-w-5xl px-4 sm:px-6 w-full'>
                <Link
                    to='/'
                    className='inline-flex items-center gap-2 mb-6 text-sm font-medium text-surface-muted hover:text-accent transition-colors'
                >
                    <FaArrowLeft className='w-3.5 h-3.5' />
                    {t('profile.back')}
                </Link>

                {/* Profile hero */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className='mb-10 flex flex-col gap-6 rounded-sm border border-line bg-surface p-6 sm:p-8 sm:flex-row sm:items-center'
                >
                    <div className='flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border border-line-strong bg-secondary-muted text-3xl font-black text-secondary-foreground'>
                        {user?.avatar ? (
                            <img
                                src={user.avatar}
                                alt={user?.name ?? ''}
                                className='h-full w-full object-cover'
                            />
                        ) : (
                            <FaUser className='h-8 w-8' />
                        )}
                    </div>
                    <div className='min-w-0 flex-1'>
                        <div className='flex flex-wrap items-center gap-3'>
                            <h1 className='text-2xl sm:text-3xl font-black tracking-tight text-surface-foreground truncate'>
                                {user?.name || t('profile.anonymousName')}
                            </h1>
                            {user?.role && <Badge>{user.role}</Badge>}
                        </div>
                        {user?.email && (
                            <p className='mt-1 text-sm text-surface-muted truncate'>{user.email}</p>
                        )}
                        {memberSince && (
                            <p className='mt-1 text-xs text-surface-muted'>
                                {t('profile.memberSince')} · {memberSince}
                            </p>
                        )}
                    </div>
                </motion.div>

                <div className='space-y-12'>
                    {/* Stats */}
                    <section>
                        <div className='mb-5 flex items-center gap-3'>
                            <span className='font-mono text-xs font-bold tracking-[0.14em] text-accent'>
                                01
                            </span>
                            <span className='h-px w-10 bg-line-strong' />
                            <h2 className='text-lg sm:text-xl font-bold tracking-tight text-surface-foreground'>
                                {t('profile.stats.label')}
                            </h2>
                        </div>
                        <div className='grid grid-cols-2 gap-3 lg:grid-cols-4 sm:gap-4'>
                            <Stat label={t('profile.stats.kana')} value={kanaRead} />
                            <Stat label={t('profile.stats.vocabulary')} value={totalVocabulary} />
                            <Stat label={t('profile.stats.learned')} value={wordsLearned} />
                            <Stat label={t('profile.stats.due')} value={dueForReview} />
                        </div>
                    </section>

                    {/* Account details */}
                    <AccountDetails />
                </div>
            </div>
            <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
        </Section>
    );
}