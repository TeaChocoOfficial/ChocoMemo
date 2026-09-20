import { Link } from '~/i18n/routing';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '~/components/custom/Button';
import Section from '~/components/custom/Section';
import AuthModal from '~/components/auth/AuthModal';
import { useAuthStore } from '~/stores/auth.store';
import ProfileHero from './components/ProfileHero';
import StatsSection from './components/StatsSection';
import { FaArrowLeft, FaUser } from 'react-icons/fa6';
import AccountDetails from './components/AccountDetails';
import AccountIdentities from './components/AccountIdentities';

export default function ProfilePage() {
    const { t } = useTranslation();
    const { user } = useAuthStore();
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

    if (!user) {
        return (
            <Section className='items-center justify-center'>
                <div className='mx-auto flex max-w-xl flex-col items-center px-4 text-center sm:px-6'>
                    <span className='mb-6 flex h-16 w-16 items-center justify-center rounded-sm bg-accent/12 text-accent'>
                        <FaUser className='h-7 w-7' />
                    </span>
                    <h1 className='text-2xl font-black tracking-tight text-surface-foreground sm:text-3xl'>
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

    return (
        <Section className='items-start justify-center'>
            <div className='mx-auto w-full max-w-5xl px-4 sm:px-6'>
                <Link
                    to='/'
                    className='mb-6 inline-flex items-center gap-2 text-sm font-medium text-surface-muted transition-colors hover:text-accent'
                >
                    <FaArrowLeft className='h-3.5 w-3.5' />
                    {t('profile.back')}
                </Link>

                <ProfileHero memberSince={memberSince} />

                <div className='space-y-12'>
                    <StatsSection />
                    <AccountIdentities />
                    <AccountDetails />
                </div>
            </div>
            <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
        </Section>
    );
}
