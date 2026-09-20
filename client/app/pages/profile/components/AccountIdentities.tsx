import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Badge from '~/components/custom/Badge';
import Button from '~/components/custom/Button';
import { useAuthStore } from '~/stores/auth.store';
import { authAPI } from '~/services/auth';
import { AuthProvider } from '~/types/auth';
import { PROVIDER_META, getProviderMeta, type ProviderMeta } from '~/constants/identityProviders';

/** One row of the linked-accounts list: icon, subtitle, connected badge, action slot. */
function IdentityRow({
    providerKey,
    subtitle,
    connected,
    action,
}: {
    providerKey: ProviderMeta['key'];
    subtitle: string;
    connected: boolean;
    action: ReactNode;
}) {
    const { t } = useTranslation();
    const meta = getProviderMeta(providerKey);
    if (!meta) return null;
    const Icon = meta.icon;

    return (
        <div className='flex items-center justify-between gap-3 rounded-sm border border-line bg-surface px-4 py-3'>
            <div className='flex min-w-0 items-center gap-3'>
                <span
                    className='flex h-9 w-9 shrink-0 items-center justify-center rounded-full'
                    style={{ backgroundColor: `${meta.color}1a`, color: meta.color }}
                >
                    <Icon className='h-4 w-4' />
                </span>
                <div className='min-w-0'>
                    <p className='truncate text-sm font-semibold text-surface-foreground'>{t(meta.labelKey)}</p>
                    <p className='truncate text-xs text-surface-muted'>{subtitle}</p>
                </div>
            </div>
            <div className='flex shrink-0 items-center gap-2'>
                {connected && <Badge>{t('profile.identities.connected')}</Badge>}
                {action}
            </div>
        </div>
    );
}

/**
 * "Linked accounts" section.
 *
 * Only Google is wired to a real connect flow right now, via
 * `authAPI.googleLogin()` (a straight redirect — signing in with the same
 * Google account again is expected to link it to the current user on the
 * backend). There is no unlink/disconnect endpoint yet, so that action is
 * shown disabled as a placeholder for when the backend adds one. The local
 * password isn't "connected" from here — it's managed in the password
 * section below. Discord/Line/Facebook/X are listed as coming soon.
 */
export default function AccountIdentities() {
    const { t } = useTranslation();
    const { user } = useAuthStore();
    const identities = user?.identities ?? [];

    const localIdentity = identities.find((identity) => identity.provider === AuthProvider.LOCAL);
    const googleIdentity = identities.find((identity) => identity.provider === AuthProvider.GOOGLE);
    const comingSoonProviders = PROVIDER_META.filter((meta) => !meta.available);

    return (
        <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
        >
            <div className='mb-5 flex items-center gap-3'>
                <span className='font-mono text-xs font-bold tracking-[0.14em] text-accent'>02</span>
                <span className='h-px w-10 bg-line-strong' />
                <h2 className='text-lg font-bold tracking-tight text-surface-foreground sm:text-xl'>
                    {t('profile.identities.label')}
                </h2>
            </div>

            <div className='space-y-2'>
                <IdentityRow
                    providerKey={AuthProvider.LOCAL}
                    connected={Boolean(localIdentity?.hasPassword)}
                    subtitle={
                        localIdentity?.hasPassword
                            ? t('profile.identities.passwordSet')
                            : t('profile.identities.passwordNotSet')
                    }
                    action={null}
                />

                <IdentityRow
                    providerKey={AuthProvider.GOOGLE}
                    connected={Boolean(googleIdentity)}
                    subtitle={
                        googleIdentity
                            ? (googleIdentity.providerEmail ?? t('profile.identities.connected'))
                            : t('profile.identities.notConnected')
                    }
                    action={
                        googleIdentity ? (
                            <Button variant='ghost' disabled title={t('profile.identities.disconnectUnavailable')}>
                                {t('profile.identities.disconnect')}
                            </Button>
                        ) : (
                            <Button variant='outline' onClick={() => authAPI.googleLogin()}>
                                {t('profile.identities.connect')}
                            </Button>
                        )
                    }
                />

                {comingSoonProviders.map((meta) => (
                    <IdentityRow
                        key={meta.key}
                        providerKey={meta.key}
                        connected={false}
                        subtitle={t('profile.identities.comingSoon')}
                        action={<Badge>{t('profile.identities.comingSoon')}</Badge>}
                    />
                ))}
            </div>
        </motion.section>
    );
}