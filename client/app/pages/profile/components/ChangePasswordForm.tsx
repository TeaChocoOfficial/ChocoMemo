import { useState } from 'react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Button from '~/components/custom/Button';
import PasswordInput from '~/components/auth/PasswordInput';
import { authAPI } from '~/services/auth';
import { useAuthStore } from '~/stores/auth.store';
import { AuthProvider } from '~/types/auth';

interface PasswordFieldProps {
    label: string;
    placeholder: string;
    value: string;
    onChange: (value: string) => void;
    show: boolean;
    onToggleShow: () => void;
    error?: string;
    autoComplete?: string;
}

function PasswordField({
    label,
    placeholder,
    value,
    onChange,
    show,
    onToggleShow,
    error,
    autoComplete,
}: PasswordFieldProps) {
    const inputClass =
        'w-full rounded-sm border border-line bg-surface px-3 py-2 text-sm text-surface-foreground placeholder:text-surface-muted/60 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-colors pr-12';

    return (
        <div className='relative'>
            <label className='mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-surface-muted'>
                {label}
            </label>
            <PasswordInput
                value={value}
                visible={show}
                onChange={onChange}
                className={inputClass}
                onToggle={onToggleShow}
                placeholder={placeholder}
            />
            {error && <p className='mt-1 text-xs text-error'>{error}</p>}
        </div>
    );
}

/**
 * Change-password form.
 *
 * `changePasswordPayloadSchema` on the backend requires `currentPassword`
 * unconditionally, so there is currently no "set your first password"
 * flow for accounts that signed up via Google only. When the account has
 * no local password yet (`hasPassword === false`), this form shows an
 * informational message instead of a broken submit button — wire up a
 * dedicated "set password" endpoint (one that doesn't require a current
 * password) to enable that case.
 */
export default function ChangePasswordForm() {
    const { t } = useTranslation();
    const { user } = useAuthStore();
    const localIdentity = user?.identities?.find((identity) => identity.provider === AuthProvider.LOCAL);
    const hasPassword = localIdentity?.hasPassword ?? true;

    const [changingPassword, setChangingPassword] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
    const [errors, setErrors] = useState<{
        currentPassword?: string;
        newPassword?: string;
        confirmNewPassword?: string;
    }>({});

    const validate = () => {
        const nextErrors: typeof errors = {};
        if (!currentPassword) {
            nextErrors.currentPassword = t('profile.password.currentRequired');
        }
        if (!newPassword) {
            nextErrors.newPassword = t('profile.password.newRequired');
        } else if (newPassword.length < 6) {
            nextErrors.newPassword = t('profile.password.tooShort');
        }
        if (newPassword !== confirmNewPassword) {
            nextErrors.confirmNewPassword = t('profile.password.mismatch');
        }
        setErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    };

    const resetForm = () => {
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
        setShowCurrentPassword(false);
        setShowNewPassword(false);
        setShowConfirmNewPassword(false);
        setErrors({});
    };

    const handleSubmit = async () => {
        if (!validate()) return;
        setChangingPassword(true);
        try {
            await authAPI.changePassword({ currentPassword, newPassword });
            toast.success(t('profile.password.changed'));
            resetForm();
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : '';
            if (message.includes('incorrect') || message.includes('wrong')) {
                setErrors({ currentPassword: t('profile.password.incorrect') });
            } else {
                toast.error(t('profile.password.changeError'));
            }
        } finally {
            setChangingPassword(false);
        }
    };

    return (
        <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
        >
            <div className='mb-5 flex items-center gap-3'>
                <span className='font-mono text-xs font-bold tracking-[0.14em] text-accent'>04</span>
                <span className='h-px w-10 bg-line-strong' />
                <h2 className='text-lg font-bold tracking-tight text-surface-foreground sm:text-xl'>
                    {t('profile.password.label')}
                </h2>
            </div>

            <div className='rounded-sm border border-line bg-surface p-5 sm:p-6'>
                {hasPassword ? (
                    <>
                        <p className='mb-5 text-sm leading-relaxed text-surface-muted'>
                            {t('profile.password.hint')}
                        </p>
                        <div className='max-w-md space-y-4'>
                            <PasswordField
                                label={t('profile.password.current')}
                                placeholder={t('profile.password.currentPlaceholder')}
                                value={currentPassword}
                                onChange={setCurrentPassword}
                                show={showCurrentPassword}
                                onToggleShow={() => setShowCurrentPassword((v) => !v)}
                                error={errors.currentPassword}
                                autoComplete='current-password'
                            />
                            <PasswordField
                                label={t('profile.password.new')}
                                placeholder={t('profile.password.newPlaceholder')}
                                value={newPassword}
                                onChange={setNewPassword}
                                show={showNewPassword}
                                onToggleShow={() => setShowNewPassword((v) => !v)}
                                error={errors.newPassword}
                                autoComplete='new-password'
                            />
                            <PasswordField
                                label={t('profile.password.confirm')}
                                placeholder={t('profile.password.confirmPlaceholder')}
                                value={confirmNewPassword}
                                onChange={setConfirmNewPassword}
                                show={showConfirmNewPassword}
                                onToggleShow={() => setShowConfirmNewPassword((v) => !v)}
                                error={errors.confirmNewPassword}
                                autoComplete='new-password'
                            />
                        </div>
                        <div className='mt-5 flex justify-end'>
                            <Button variant='primary' onClick={handleSubmit} disabled={changingPassword}>
                                {changingPassword ? t('profile.password.changing') : t('profile.password.change')}
                            </Button>
                        </div>
                    </>
                ) : (
                    <p className='text-sm leading-relaxed text-surface-muted'>
                        {t('profile.password.noPasswordYetHint')}
                    </p>
                )}
            </div>
        </motion.section>
    );
}