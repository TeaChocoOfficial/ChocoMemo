import axios from 'axios';
import { useEffect, useState } from 'react';
import { useSwal } from '~/hooks/useSwal';
import { useTranslation } from 'react-i18next';
import Button from '~/components/custom/Button';
import OtpInput from '~/components/auth/OtpInput';
import { Modal, ModalBody, ModalFooter, ModalHeader } from '~/components/custom/Modal';
import { authAPI } from '~/services/auth';
import { useAuthStore } from '~/stores/auth.store';
import { getAccountEmail } from '~/utils/auth';
import { FaEnvelope, FaShieldHalved } from 'react-icons/fa6';

const RESEND_COOLDOWN = 30;

const inputClass =
    'w-full rounded-sm border border-line bg-surface px-3 py-2 text-sm text-surface-foreground placeholder:text-surface-muted/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const serverMessage = (err: unknown): string | undefined => {
    if (axios.isAxiosError(err)) {
        return (err.response?.data as { message?: string } | undefined)?.message;
    }
    return undefined;
};

type Step = 'form' | 'otp';

/**
 * Modal for changing the account email (with OTP verification).
 *
 * Step 1 asks for the new email. Step 2 verifies the account by entering the
 * 6-digit code emailed to the NEW address (via `change-email/request` +
 * `change-email/confirm`).
 */
export default function ChangeEmailModal({
    isOpen,
    onClose,
}: {
    isOpen: boolean;
    onClose: () => void;
}) {
    const swal = useSwal();
    const { t } = useTranslation();
    const [code, setCode] = useState('');
    const [email, setEmail] = useState('');
    const [token, setToken] = useState('');
    const { user, setUser } = useAuthStore();
    const [saving, setSaving] = useState(false);
    const [resendIn, setResendIn] = useState(0);
    const [step, setStep] = useState<Step>('form');
    const [error, setError] = useState<string | undefined>(undefined);

    useEffect(() => {
        setResendIn(0);
        if (isOpen) {
            setStep('form');
            setEmail(getAccountEmail(user) ?? '');
            setCode('');
            setToken('');
            setError(undefined);
        }
    }, [isOpen, user?.identities]);

    useEffect(() => {
        if (resendIn <= 0) return;
        const id = setInterval(() => setResendIn((s) => Math.max(0, s - 1)), 1000);
        return () => clearInterval(id);
    }, [resendIn]);

    const requestCode = async () => {
        const trimmed = email.trim().toLowerCase();
        if (!emailPattern.test(trimmed)) return setError(t('profile.email.invalid'));
        setSaving(true);
        try {
            const res = await authAPI.requestEmailChange({ newEmail: trimmed });
            setToken(res.data.token);
            setStep('otp');
            setError(undefined);
            setResendIn(RESEND_COOLDOWN);
            swal.success(t('profile.otp.codeSent'));
        } catch (err) {
            const message = serverMessage(err);
            if (message === 'EMAIL_TAKEN') setError(t('profile.otp.emailTaken'));
            else if (message === 'EMAIL_SAME_AS_CURRENT') setError(t('profile.otp.emailSame'));
            else setError(t('profile.otp.sendFailed'));
        } finally {
            setSaving(false);
        }
    };

    const resend = async () => {
        if (resendIn > 0) return;
        setSaving(true);
        try {
            const res = await authAPI.requestEmailChange({ newEmail: email.trim().toLowerCase() });
            setToken(res.data.token);
            setCode('');
            setResendIn(RESEND_COOLDOWN);
            swal.success(t('profile.otp.codeResent'));
        } catch (error) {
            swal.error(t('profile.otp.resendFailed'), { error });
        } finally {
            setSaving(false);
        }
    };

    const verify = async () => {
        if (code.length !== 6 || !token) return;
        setSaving(true);
        try {
            const res = await authAPI.confirmEmailChange({ token, code });
            setUser(res.data.user);
            swal.success(t('profile.email.saved'));
            onClose();
        } catch (error) {
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
                title={step === 'otp' ? t('profile.otp.confirmEmail') : t('profile.email.label')}
                icon={<FaEnvelope className='h-4 w-4' />}
                onClose={onClose}
            />
            <ModalBody>
                {step === 'otp' ? (
                    <>
                        <div className='mb-4 flex flex-col items-center text-center'>
                            <FaShieldHalved className='h-8 w-8 text-primary' />
                            <p className='mt-2 text-sm text-surface-muted'>
                                {t('profile.otp.codeSentTo', { email: email.trim() })}
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
                            {t('profile.email.hint')}
                        </p>
                        <label className='mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-surface-muted'>
                            {t('profile.identities.email')}
                        </label>
                        <input
                            type='email'
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                setError(undefined);
                            }}
                            placeholder={t('profile.email.placeholder')}
                            disabled={saving}
                            aria-invalid={Boolean(error)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') void requestCode();
                            }}
                            className={inputClass}
                        />
                        {error && <p className='mt-1 text-xs text-error'>{error}</p>}
                    </>
                )}
            </ModalBody>
            <ModalFooter>
                <Button
                    variant='ghost'
                    disabled={saving}
                    onClick={step === 'otp' ? backToForm : onClose}
                >
                    {t('profile.avatar.cancel')}
                </Button>
                {step === 'otp' ? (
                    <Button
                        onClick={verify}
                        variant='primary'
                        disabled={saving || code.length !== 6}
                    >
                        {saving ? t('profile.otp.verifying') : t('profile.otp.verifySave')}
                    </Button>
                ) : (
                    <Button
                        variant='primary'
                        onClick={requestCode}
                        disabled={saving || !email.trim()}
                    >
                        {saving ? t('profile.otp.sending') : t('profile.otp.sendCode')}
                    </Button>
                )}
            </ModalFooter>
        </Modal>
    );
}
