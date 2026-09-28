import { useState } from 'react';
import {
    PROVIDER_META,
    getProviderMeta,
    type ProviderMeta,
    resolveProviderColor,
} from '~/constants/identityProviders';
import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { AuthProvider } from '~/types/auth';
import Badge from '~/components/custom/Badge';
import { useTranslation } from 'react-i18next';
import { getAccountEmail } from '~/utils/auth';
import Button from '~/components/custom/Button';
import ChangeEmailModal from './ChangeEmailModal';
import { useAuthStore } from '~/stores/config/auth.store';
import { FaEnvelope, FaPlug } from 'react-icons/fa6';
import ChangePasswordModal from './ChangePasswordModal';
import { PROVIDER_ACTIONS } from '~/components/auth/providerActions';
import { Modal, ModalBody, ModalFooter, ModalHeader } from '~/components/custom/Modal';

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
    // `color-mix` rather than appending an alpha suffix, because a resolved
    // `var()` color can't take one.
    const tint = resolveProviderColor(meta.color);

    return (
        <div className='flex items-center justify-between gap-3 rounded-sm border border-line bg-surface px-4 py-3.5 transition-colors hover:bg-surface-overlay'>
            <div className='flex min-w-0 items-center gap-3'>
                <span
                    className='relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full'
                    style={
                        tint
                            ? {
                                  backgroundColor: `color-mix(in srgb, ${tint} 10%, transparent)`,
                                  color: tint,
                              }
                            : undefined
                    }
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
                <span className='flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary'>
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

/** Providers with a live OAuth flow, excluding the password account. */
const LINKABLE_PROVIDERS = PROVIDER_META.filter(
    (meta) => meta.available && meta.key !== AuthProvider.LOCAL,
);

/**
 * "Linked accounts" section.
 *
 * The account's email (read from the identities) sits on top with its
 * verification state. Below it, sign-in methods are listed as rows — the
 * local password account (marked as the primary identity, with a Change
 * button for its OTP-guarded password flow), then every provider with a live
 * OAuth flow, each connected or not.
 */
export default function AccountIdentities() {
    const { t } = useTranslation();
    const { user } = useAuthStore();
    const identities = user?.identities ?? [];

    const [emailModalOpen, setEmailModalOpen] = useState(false);
    const [passwordModalOpen, setPasswordModalOpen] = useState(false);
    const [disconnectProvider, setDisconnectProvider] = useState<AuthProvider | null>(null);

    const localIdentity = identities.find((identity) => identity.provider === AuthProvider.LOCAL);

    return (
        <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
        >
            <div className='mb-5 flex items-center gap-3'>
                <span className='font-mono text-xs font-bold tracking-[0.14em] text-primary'>
                    03
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

                {LINKABLE_PROVIDERS.map((meta) => {
                    const identity = identities.find((entry) => entry.provider === meta.key);
                    const actions = PROVIDER_ACTIONS[meta.key];
                    return (
                        <IdentityRow
                            key={meta.key}
                            providerKey={meta.key}
                            subtitle={
                                identity
                                    ? (identity.providerEmail ?? t('profile.identities.connected'))
                                    : ''
                            }
                            status={
                                identity
                                    ? {
                                          variant: 'success',
                                          labelKey: 'profile.identities.connected',
                                      }
                                    : {
                                          variant: 'default',
                                          labelKey: 'profile.identities.notConnected',
                                      }
                            }
                            action={
                                identity ? (
                                    <Button
                                        size='sm'
                                        variant='outline'
                                        onClick={() => setDisconnectProvider(meta.key)}
                                        className='border-error text-error hover:bg-error/10'
                                    >
                                        {t('profile.identities.disconnect')}
                                    </Button>
                                ) : (
                                    <Button
                                        size='sm'
                                        variant='outline'
                                        onClick={() => actions.login('profile')}
                                        className='border-success text-success hover:bg-success/10'
                                    >
                                        {t('profile.identities.connect')}
                                    </Button>
                                )
                            }
                        />
                    );
                })}
            </div>

            <ChangeEmailModal isOpen={emailModalOpen} onClose={() => setEmailModalOpen(false)} />
            <ChangePasswordModal
                isOpen={passwordModalOpen}
                onClose={() => setPasswordModalOpen(false)}
            />

            <Modal
                size='sm'
                isOpen={disconnectProvider !== null}
                onClose={() => setDisconnectProvider(null)}
            >
                <ModalHeader
                    icon={<FaPlug className='h-4 w-4' />}
                    title={t('profile.identities.disconnectTitle')}
                    onClose={() => setDisconnectProvider(null)}
                />
                <ModalBody>
                    <p className='text-sm leading-relaxed text-surface-muted'>
                        {t('profile.identities.disconnectHint')}
                    </p>
                </ModalBody>
                <ModalFooter>
                    <Button variant='ghost' onClick={() => setDisconnectProvider(null)}>
                        {t('profile.avatar.cancel')}
                    </Button>
                    <Button
                        variant='primary'
                        onClick={() => {
                            const provider = disconnectProvider;
                            setDisconnectProvider(null);
                            if (provider) PROVIDER_ACTIONS[provider].disconnect('profile');
                        }}
                    >
                        {t('profile.identities.disconnect')}
                    </Button>
                </ModalFooter>
            </Modal>
        </motion.section>
    );
}
