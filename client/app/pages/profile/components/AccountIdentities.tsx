import { useState } from 'react';
import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { authAPI } from '~/services/auth';
import { AuthProvider } from '~/types/auth';
import Badge from '~/components/custom/Badge';
import { useTranslation } from 'react-i18next';
import { getAccountEmail } from '~/types/auth';
import Button from '~/components/custom/Button';
import ChangeEmailModal from './ChangeEmailModal';
import { useAuthStore } from '~/stores/auth.store';
import { FaEnvelope, FaPlug } from 'react-icons/fa6';
import ChangePasswordModal from './ChangePasswordModal';
import { Modal, ModalBody, ModalFooter, ModalHeader } from '~/components/custom/Modal';
import { PROVIDER_META, getProviderMeta, type ProviderMeta } from '~/constants/identityProviders';

type PillVariant = 'default' | 'success' | 'error' | 'warning' | 'info';

/** Small status pill with a leading dot; the Badge variant drives the color. */
function StatusPill({
    children,
    variant = 'default',
}: {
    children: ReactNode;
    variant?: PillVariant;
}) {
    return (
        <Badge variant={variant} className='gap-1.5'>
            <span className='h-1.5 w-1.5 shrink-0 rounded-full bg-current' />
            {children}
        </Badge>
    );
}

/**
 * One row of the linked-provider list: tinted icon (with a success dot when
 * the provider is connected), name, status subtitle, and a status pill plus
 * optional action slot on the right.
 */
function IdentityRow({
    action,
    status,
    subtitle,
    providerKey,
}: {
    subtitle: string;
    action?: ReactNode;
    providerKey: ProviderMeta['key'];
    status?: { variant: PillVariant; labelKey: string };
}) {
    const { t } = useTranslation();
    const meta = getProviderMeta(providerKey);
    if (!meta) return null;
    const Icon = meta.icon;

    return (
        <div className='flex items-center justify-between gap-3 rounded-sm border border-line bg-surface px-4 py-3.5 transition-colors hover:bg-surface-overlay'>
            <div className='flex min-w-0 items-center gap-3'>
                <span
                    className='relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full'
                    style={{ backgroundColor: `${meta.color}1a`, color: meta.color }}
                >
                    <Icon className='h-4 w-4' />
                </span>
                <div className='min-w-0'>
                    <p className='truncate text-sm font-semibold text-surface-foreground'>
                        {t(meta.labelKey)}
                    </p>
                    {subtitle && <p className='truncate text-xs text-surface-muted'>{subtitle}</p>}
                </div>
            </div>
            <div className='flex shrink-0 items-center gap-2'>
                {status && <StatusPill variant={status.variant}>{t(status.labelKey)}</StatusPill>}
                {action}
            </div>
        </div>
    );
}

/** Account email row: highlights the verified/unverified state for the account's address. */
function EmailRow({ onChange }: { onChange: () => void }) {
    const { t } = useTranslation();
    const { user } = useAuthStore();
    const accountEmail = getAccountEmail(user);

    return (
        <div className='flex items-center justify-between gap-3 rounded-sm border border-line bg-surface px-4 py-3.5 transition-colors hover:bg-surface-overlay'>
            <div className='flex min-w-0 items-center gap-3'>
                <span className='flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent'>
                    <FaEnvelope className='h-4 w-4' />
                </span>
                <div className='min-w-0'>
                    <p className='truncate text-sm font-semibold text-surface-foreground'>
                        {t('profile.identities.email')}
                    </p>
                    {accountEmail && (
                        <p className='truncate text-xs text-surface-muted'>{accountEmail}</p>
                    )}
                </div>
            </div>
            <div className='flex shrink-0 items-center gap-2'>
                <StatusPill variant={user?.emailVerified ? 'success' : 'warning'}>
                    {t(
                        user?.emailVerified
                            ? 'profile.identities.verified'
                            : 'profile.identities.unverified',
                    )}
                </StatusPill>
                <Button size='sm' variant='outline' onClick={onChange}>
                    {t('profile.identities.change')}
                </Button>
            </div>
        </div>
    );
}

/**
 * "Linked accounts" section.
 *
 * The account's email (read from the identities) sits on top with its
 * verification state. Below it, sign-in methods are listed as rows — the
 * local password account (marked as the primary identity, with a Change
 * button for its OTP-guarded password flow), Google (Connect runs the Google
 * OAuth link; Disconnect re-verifies with Google before unlinking), and
 * Discord/Line/Facebook/X as coming soon.
 */
export default function AccountIdentities() {
    const { t } = useTranslation();
    const { user } = useAuthStore();
    const identities = user?.identities ?? [];

    const [emailModalOpen, setEmailModalOpen] = useState(false);
    const [passwordModalOpen, setPasswordModalOpen] = useState(false);
    const [disconnectConfirmOpen, setDisconnectConfirmOpen] = useState(false);

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
                <span className='font-mono text-xs font-bold tracking-[0.14em] text-accent'>
                    02
                </span>
                <span className='h-px w-10 bg-line-strong' />
                <h2 className='text-lg font-bold tracking-tight text-surface-foreground sm:text-xl'>
                    {t('profile.identities.label')}
                </h2>
            </div>

            <div className='space-y-2'>
                <EmailRow onChange={() => setEmailModalOpen(true)} />

                <IdentityRow
                    providerKey={AuthProvider.LOCAL}
                    subtitle={
                        localIdentity?.hasPassword
                            ? t('profile.identities.passwordSet')
                            : t('profile.identities.passwordNotSet')
                    }
                    status={{ variant: 'info', labelKey: 'profile.identities.primary' }}
                    action={
                        <Button
                            size='sm'
                            variant='outline'
                            onClick={() => setPasswordModalOpen(true)}
                        >
                            {t('profile.identities.change')}
                        </Button>
                    }
                />

                <IdentityRow
                    providerKey={AuthProvider.GOOGLE}
                    subtitle={
                        googleIdentity
                            ? (googleIdentity.providerEmail ?? t('profile.identities.connected'))
                            : ''
                    }
                    status={
                        googleIdentity
                            ? { variant: 'success', labelKey: 'profile.identities.connected' }
                            : { variant: 'default', labelKey: 'profile.identities.notConnected' }
                    }
                    action={
                        googleIdentity ? (
                            <Button
                                size='sm'
                                variant='outline'
                                onClick={() => setDisconnectConfirmOpen(true)}
                                className='border-error text-error hover:bg-error/10'
                            >
                                {t('profile.identities.disconnect')}
                            </Button>
                        ) : (
                            <Button
                                size='sm'
                                variant='outline'
                                onClick={() => authAPI.googleLogin('profile')}
                                className='border-success text-success hover:bg-success/10'
                            >
                                {t('profile.identities.connect')}
                            </Button>
                        )
                    }
                />

                {comingSoonProviders.map((meta) => (
                    <IdentityRow
                        key={meta.key}
                        providerKey={meta.key}
                        subtitle=''
                        status={{ variant: 'info', labelKey: 'profile.identities.comingSoon' }}
                        action={null}
                    />
                ))}
            </div>

            <ChangeEmailModal isOpen={emailModalOpen} onClose={() => setEmailModalOpen(false)} />
            <ChangePasswordModal
                isOpen={passwordModalOpen}
                onClose={() => setPasswordModalOpen(false)}
            />

            <Modal
                size='sm'
                isOpen={disconnectConfirmOpen}
                onClose={() => setDisconnectConfirmOpen(false)}
            >
                <ModalHeader
                    icon={<FaPlug className='h-4 w-4' />}
                    title={t('profile.identities.disconnectTitle')}
                    onClose={() => setDisconnectConfirmOpen(false)}
                />
                <ModalBody>
                    <p className='text-sm leading-relaxed text-surface-muted'>
                        {t('profile.identities.disconnectHint')}
                    </p>
                </ModalBody>
                <ModalFooter>
                    <Button variant='ghost' onClick={() => setDisconnectConfirmOpen(false)}>
                        {t('profile.avatar.cancel')}
                    </Button>
                    <Button
                        variant='primary'
                        onClick={() => {
                            setDisconnectConfirmOpen(false);
                            authAPI.googleDisconnect('profile');
                        }}
                    >
                        {t('profile.identities.disconnect')}
                    </Button>
                </ModalFooter>
            </Modal>
        </motion.section>
    );
}
