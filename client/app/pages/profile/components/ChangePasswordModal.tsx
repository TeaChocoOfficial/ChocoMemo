import axios from 'axios';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import Button from '~/components/custom/Button';
import PasswordInput from '~/components/auth/PasswordInput';
import OtpInput from '~/components/auth/OtpInput';
import { Modal, ModalBody, ModalFooter, ModalHeader } from '~/components/custom/Modal';
import { authAPI } from '~/services/auth';
import { useAuthStore } from '~/stores/auth.store';
import { AuthProvider } from '~/types/auth';
import { getAccountEmail } from '~/types/auth';
import { FaKey, FaShieldHalved } from 'react-icons/fa6';

const RESEND_COOLDOWN = 30;

const serverMessage = (err: unknown): string | undefined => {
    if (axios.isAxiosError(err)) {
        return (err.response?.data as { message?: string } | undefined)?.message;
    }
    return undefined;
};

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
        'w-full rounded-sm border border-line bg-surface px-3 py-2 text-sm text-surface-foreground placeholder:text-surface-muted/60 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-colors';

    return (
        <div>
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

type Step = 'form' | 'otp';

/**
 * Modal for setting / changing the account password (with OTP verification).
 *
 * Step 1 collects the new password (plus the current one when one already
 * exists — first-time password accounts set it directly). Step 2 verifies the
 * 6-digit code emailed to the account before the change is committed
 * (via `change-password/request` + `change-password/confirm`).
 */
export default function ChangePasswordModal({
    isOpen,
    onClose,
}: {
    isOpen: boolean;
    onClose: () => void;
}) {
    const { t } = useTranslation();
    const { user } = useAuthStore();
    const [code, setCode] = useState('');
    const [token, setToken] = useState('');
    const [resendIn, setResendIn] = useState(0);
    const [saving, setSaving] = useState(false);
    const [step, setStep] = useState<Step>('form');
    const [newPassword, setNewPassword] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
    const [error, setError] = useState<string | undefined>(undefined);
    const [errors, setErrors] = useState<{
        currentPassword?: string;
        newPassword?: string;
        confirmNewPassword?: string;
    }>({});
    const localIdentity = user?.identities?.find(
        (identity) => identity.provider === AuthProvider.LOCAL,
    );
    const hasLocalSlot = Boolean(localIdentity);
    const hasPassword = Boolean(localIdentity?.hasPassword);

    useEffect(() => {
        if (isOpen) {
            setStep('form');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmNewPassword('');
            setShowCurrentPassword(false);
            setShowNewPassword(false);
            setShowConfirmNewPassword(false);
            setCode('');
            setToken('');
            setError(undefined);
            setErrors({});
            setResendIn(0);
        }
    }, [isOpen]);

    useEffect(() => {
        if (resendIn <= 0) return;
        const id = setInterval(() => setResendIn((s) => Math.max(0, s - 1)), 1000);
        return () => clearInterval(id);
    }, [resendIn]);

    const validate = () => {
        const nextErrors: typeof errors = {};
        if (hasPassword && !currentPassword) {
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

    const requestCode = async () => {
        if (!validate()) return;
        setSaving(true);
        try {
            const res = await authAPI.requestPasswordChange({
                currentPassword: hasPassword ? currentPassword : undefined,
            });
            setToken(res.data.token);
            setStep('otp');
            setErrors({});
            setError(undefined);
            setResendIn(RESEND_COOLDOWN);
            toast.success(t('profile.otp.codeSent'));
        } catch (err) {
            const message = serverMessage(err);
            if (message === 'WRONG_CURRENT_PASSWORD' || message === 'NO_LOGIN_PASSWORD') {
                setErrors({ currentPassword: t('profile.otp.wrongCurrentPassword') });
            } else {
                setError(t('profile.otp.sendFailed'));
            }
        } finally {
            setSaving(false);
        }
    };

    const resend = async () => {
        if (resendIn > 0) return;
        setSaving(true);
        try {
            const res = await authAPI.requestPasswordChange({
                currentPassword: hasPassword ? currentPassword : undefined,
            });
            setToken(res.data.token);
            setCode('');
            setResendIn(RESEND_COOLDOWN);
            toast.success(t('profile.otp.codeResent'));
        } catch {
            toast.error(t('profile.otp.resendFailed'));
        } finally {
            setSaving(false);
        }
    };

    const verify = async () => {
        if (code.length !== 6 || !token) return;
        setSaving(true);
        try {
            await authAPI.confirmPasswordChange({
                token,
                code,
                currentPassword: hasPassword ? currentPassword : undefined,
                newPassword,
            });
            toast.success(t('profile.password.changed'));
            onClose();
        } catch {
            setError(t('profile.otp.invalidCode'));
        } finally {
            setSaving(false);
        }
    };

    const backToForm = () => {
        setStep('form');
        setCode('');
        setError(undefined);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size='sm'>
            <ModalHeader
                title={
                    step === 'otp' ? t('profile.otp.confirmPassword') : t('profile.password.label')
                }
                icon={<FaKey className='h-4 w-4' />}
                onClose={onClose}
            />
            <ModalBody>
                {!hasLocalSlot ? (
                    <p className='text-sm leading-relaxed text-surface-muted'>
                        {t('profile.password.noPasswordYetHint')}
                    </p>
                ) : step === 'otp' ? (
                    <>
                        <div className='mb-4 flex flex-col items-center text-center'>
                            <FaShieldHalved className='h-8 w-8 text-accent' />
                            <p className='mt-2 text-sm text-surface-muted'>
                                {t('profile.otp.codeSentTo', {
                                    email: getAccountEmail(user) ?? '',
                                })}
                            </p>
                        </div>
                        <label className='mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-surface-muted'>
                            {t('auth.verificationCode')}
                        </label>
                        <OtpInput value={code} onChange={setCode} disabled={saving} autoFocus />
                        {error && <p className='mt-2 text-xs text-error'>{error}</p>}
                        <div className='mt-4 flex items-center justify-between'>
                            <Button type='button' variant='ghost' size='sm' onClick={backToForm}>
                                {t('profile.otp.back')}
                            </Button>
                            <Button
                                type='button'
                                variant='outline'
                                size='sm'
                                disabled={resendIn > 0 || saving}
                                onClick={resend}
                            >
                                {resendIn > 0
                                    ? t('auth.resendInSeconds', { seconds: resendIn })
                                    : t('auth.resendCode')}
                            </Button>
                        </div>
                    </>
                ) : (
                    <>
                        <p className='mb-4 text-sm leading-relaxed text-surface-muted'>
                            {hasPassword
                                ? t('profile.password.hint')
                                : t('profile.password.setHint')}
                        </p>
                        <div className='space-y-4'>
                            {hasPassword && (
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
                            )}
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
                    </>
                )}
            </ModalBody>
            {hasLocalSlot && (
                <ModalFooter>
                    <Button
                        variant='ghost'
                        onClick={step === 'otp' ? backToForm : onClose}
                        disabled={saving}
                    >
                        {t('profile.avatar.cancel')}
                    </Button>
                    {step === 'otp' ? (
                        <Button
                            variant='primary'
                            onClick={verify}
                            disabled={saving || code.length !== 6}
                        >
                            {saving ? t('profile.otp.verifying') : t('profile.otp.verifySave')}
                        </Button>
                    ) : (
                        <Button variant='primary' onClick={requestCode} disabled={saving}>
                            {saving ? t('profile.otp.sending') : t('profile.otp.sendCode')}
                        </Button>
                    )}
                </ModalFooter>
            )}
        </Modal>
    );
}
