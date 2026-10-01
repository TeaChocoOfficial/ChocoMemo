import { Link } from '~/i18n/routing';
import { useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import Button from '~/components/custom/Button';
import Section from '~/components/custom/Section';
import { useAuthStore } from '~/stores/config/auth.store';
import { useSwal } from '~/hooks/useSwal';
import ProfileHero from './components/ProfileHero';
import StatsSection from './components/StatsSection';
import { FaArrowLeft, FaUser } from 'react-icons/fa6';
import AccountIdentities from './components/AccountIdentities';
import BioSection from './components/BioSection';

/** Server error codes returned by the Google OAuth callback (`?error=...`). */
const DISCONNECT_ERROR_KEYS: Record<string, string> = {
    LAST_SIGNIN_METHOD: 'profile.identities.lastSigninMethod',
    SESSION_EXPIRED: 'profile.identities.disconnectSession',
    INVALID_SESSION: 'profile.identities.disconnectSession',
    GOOGLE_VERIFY_FAILED: 'profile.identities.disconnectVerifyFailed',
    IDENTITY_NOT_LINKED: 'profile.identities.disconnectVerifyFailed',
    access_denied: 'profile.identities.disconnectCancelled',
};

export default function ProfilePage() {
    const swal = useSwal();
    const { t } = useTranslation();
    const { user } = useAuthStore();
    const [searchParams] = useSearchParams();
    const { open, setOpen } = useAuthStore();

    // Surfaced after an OAuth round trip started from this page (connect or
    // disconnect re-auth): `?disconnected=1` on success, `?error=...` on
    // failure. Sign-in failures are handled globally by
    // `useOAuthCallbackNotice`, so only `source=disconnect` is read here.
    useEffect(() => {
        const disconnected = searchParams.get('disconnected');
        const error = searchParams.get('error');
        const source = searchParams.get('source');
        if (disconnected === '1') {
            swal.success(t('profile.identities.disconnectSuccess'));
        } else if (error && source === 'disconnect') {
            const messageKey = DISCONNECT_ERROR_KEYS[error];
            const message = messageKey
                ? t(messageKey)
                : t('profile.identities.disconnectError', { reason: error });
            swal.error(message, { error });
        }
        if (disconnected === '1' || error) {
            window.history.replaceState({}, '', window.location.pathname);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams]);

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

    return (
        <Section className='items-start justify-center'>
            <div className='mx-auto w-full max-w-5xl px-4 sm:px-6'>
                <Link
                    to='/'
                    className='mb-6 inline-flex items-center gap-2 text-sm font-medium text-surface-muted transition-colors hover:text-primary'
                >
                    <FaArrowLeft className='h-3.5 w-3.5' />
                    {t('profile.back')}
                </Link>
                <ProfileHero memberSince={memberSince} />
                {user?.nameTag && (
                    <div className='mb-6'>
                        <Link
                            to={`/profile/${user.nameTag}`}
                            className='inline-flex items-center gap-2 text-sm font-medium text-surface-muted transition-colors hover:text-primary'
                        >
                            <FaUser className='h-3.5 w-3.5' />
                            {t('profile.public.viewPublic')}
                        </Link>
                    </div>
                )}
                {!user ? (
                    <div className='mx-auto flex max-w-xl flex-col items-center px-4 text-center sm:px-6'>
                        <span className='mb-6 flex h-16 w-16 items-center justify-center rounded-sm bg-primary/12 text-primary'>
                            <FaUser className='h-7 w-7' />
                        </span>
                        <h1 className='text-2xl font-black tracking-tight text-surface-foreground sm:text-3xl'>
                            {t('profile.notSignedInTitle')}
                        </h1>
                        <p className='mt-3 max-w-md text-sm leading-relaxed text-surface-muted'>
                            {t('profile.notSignedInHint')}
                        </p>
                        <Button variant='primary' className='mt-8' onClick={() => setOpen(true)}>
                            {t('profile.signIn')}
                        </Button>
                    </div>
                ) : (
                    <div className='space-y-12'>
                        <BioSection />
                        <StatsSection />
                        <AccountIdentities />
                    </div>
                )}
            </div>
        </Section>
    );
}
