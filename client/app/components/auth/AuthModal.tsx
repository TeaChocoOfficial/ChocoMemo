import { FaAt, FaLock, FaUser, FaEnvelope, FaShieldHalved } from 'react-icons/fa6';
import axios from 'axios';
import { useSwal } from '~/hooks/useSwal';
import PasswordInput from './PasswordInput';
import React, { useEffect, useState } from 'react';
import { AuthProvider } from '~/types/auth';
import { usePathname } from '~/i18n/routing';
import { useTranslation } from 'react-i18next';
import Button from '~/components/custom/Button';
import { useAuthStore } from '~/stores/auth.store';
import { authAPI, nameTagField } from '~/services/auth';
import { getProviderMeta } from '~/constants/identityProviders';
import { Modal, ModalHeader, ModalBody } from '~/components/custom/Modal';
import { PROVIDER_ACTIONS } from './providerActions';

const RESEND_COOLDOWN = 30;

export default function AuthModal() {
    const swal = useSwal();
    const { t } = useTranslation();
    const pathname = usePathname();
    const [mode, setMode] = useState('signin');
    const [resendIn, setResendIn] = useState(0);
    const [loading, setLoading] = useState(false);
    const { setUser, open, setOpen } = useAuthStore();
    const [verifyingEmail, setVerifyingEmail] = useState('');
    const [resetToken, setResetToken] = useState<string | null>(null);
    const [signupToken, setSignupToken] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState<Record<string, boolean>>({});
    const [form, setForm] = useState({
        name: '',
        nameTag: '',
        email: '',
        password: '',
        confirmPassword: '',
        newPassword: '',
        confirmNewPassword: '',
        code: '',
    });

    useEffect(() => {
        if (resendIn <= 0) return;
        const id = setInterval(() => setResendIn((s) => Math.max(0, s - 1)), 1000);
        return () => clearInterval(id);
    }, [resendIn]);

    const isEmailNotVerified = (err: unknown) =>
        axios.isAxiosError(err) &&
        (err.response?.data as { message?: string } | undefined)?.message === 'EMAIL_NOT_VERIFIED';

    const isEmailNotFound = (err: unknown) =>
        axios.isAxiosError(err) &&
        (err.response?.data as { message?: string } | undefined)?.message === 'EMAIL_NOT_FOUND';

    const isNameTagTaken = (err: unknown) =>
        axios.isAxiosError(err) &&
        (err.response?.data as { message?: string } | undefined)?.message === 'NAME_TAG_TAKEN';

    const resetForm = () =>
        setForm({
            name: '',
            nameTag: '',
            email: '',
            password: '',
            confirmPassword: '',
            newPassword: '',
            confirmNewPassword: '',
            code: '',
        });

    const handleClose = () => {
        resetForm();
        setSignupToken(null);
        setResetToken(null);
        setResendIn(0);
        setVerifyingEmail('');
        setMode('signin');
        setOpen(false);
    };

    const startVerification = async (email: string) => {
        const res = await authAPI.resendOtp({ email });
        setSignupToken(res.data.access_token);
        setVerifyingEmail(email);
        setResendIn(RESEND_COOLDOWN);
        setMode('verify');
        swal.success(t('auth.otpSent', { email }));
    };

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await authAPI.login({ email: form.email, password: form.password });
            setUser(res.data.user);
            swal.success(t('auth.welcome', { name: res.data.user?.name ?? '' }));
            handleClose();
        } catch (err) {
            if (isEmailNotVerified(err)) {
                try {
                    await startVerification(form.email);
                } catch (error) {
                    swal.error(t('auth.error.invalidCredentials'), { error });
                }
            } else {
                swal.error(t('auth.error.invalidCredentials'), { error: err });
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (form.password !== form.confirmPassword)
            return swal.error(t('auth.error.passwordMismatch'));

        if (!nameTagField.safeParse(form.nameTag).success)
            return swal.error(t('auth.error.nameTagInvalid'));

        setLoading(true);
        try {
            const res = await authAPI.register({
                name: form.name,
                nameTag: form.nameTag,
                email: form.email,
                password: form.password,
            });
            setSignupToken(res.data.access_token);
            setVerifyingEmail(form.email);
            setResendIn(RESEND_COOLDOWN);
            setMode('verify');
            swal.success(t('auth.otpSent', { email: form.email }));
        } catch (err) {
            console.error(err);
            if (isNameTagTaken(err)) swal.error(t('auth.error.nameTagTaken'), { error: err });
            else swal.error(t('auth.error.emailInUse'), { error: err });
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!signupToken) return;
        setLoading(true);
        try {
            const res = await authAPI.verifyOtp({ token: signupToken, code: form.code });
            setUser(res.data.user);
            swal.success(t('auth.verifySuccess', { name: res.data.user?.name ?? '' }));
            handleClose();
        } catch (error) {
            if (isNameTagTaken(error)) swal.error(t('auth.error.nameTagTaken'), { error });
            else swal.error(t('auth.error.invalidOtp'), { error });
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        if (resendIn > 0) return;
        setLoading(true);
        try {
            const res = await authAPI.resendOtp({ email: verifyingEmail });
            setSignupToken(res.data.access_token);
            setResendIn(RESEND_COOLDOWN);
            swal.success(t('auth.otpResent'));
        } catch (error) {
            swal.error(t('auth.error.resendFailed'), { error });
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await authAPI.forgotPassword({ email: form.email });
            setResetToken(res.data.access_token);
            setVerifyingEmail(form.email);
            setResendIn(RESEND_COOLDOWN);
            swal.success(t('auth.resetCodeSent', { email: form.email }));
        } catch (err) {
            if (isEmailNotFound(err)) {
                swal.error(t('auth.error.emailNotFound'), { error: err });
            } else {
                swal.error(t('auth.error.resetFailed'), { error: err });
            }
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!resetToken) return;
        if (form.newPassword !== form.confirmNewPassword)
            return swal.error(t('auth.error.passwordMismatch'));

        setLoading(true);
        try {
            const res = await authAPI.resetPassword({
                token: resetToken,
                code: form.code,
                newPassword: form.newPassword,
            });
            setUser(res.data.user);
            swal.success(t('auth.resetSuccess'));
            handleClose();
        } catch (error) {
            swal.error(t('auth.error.resetFailed'), { error });
        } finally {
            setLoading(false);
        }
    };

    const handleResendResetCode = async () => {
        if (resendIn > 0) return;
        setLoading(true);
        try {
            const res = await authAPI.forgotPassword({ email: verifyingEmail });
            setResetToken(res.data.access_token);
            setResendIn(RESEND_COOLDOWN);
            swal.success(t('auth.otpResent'));
        } catch (error) {
            swal.error(t('auth.error.resendFailed'), { error });
        } finally {
            setLoading(false);
        }
    };

    const inputClass =
        'w-full rounded-sm border border-line bg-surface px-3 py-2.5 text-sm text-surface-foreground placeholder:text-surface-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary';

    const renderPasswordField = (
        key: string,
        value: string,
        placeholder: string,
        onChange: (value: string) => void,
    ) => {
        const visible = showPassword[key];
        return (
            <PasswordInput
                value={value}
                visible={visible}
                onChange={onChange}
                className={inputClass}
                placeholder={placeholder}
                onToggle={() => setShowPassword((s) => ({ ...s, [key]: !s[key] }))}
            />
        );
    };

    return (
        <Modal isOpen={open} onClose={handleClose} size='sm'>
            {mode === 'forgot' ? (
                resetToken ? (
                    <>
                        <ModalHeader title={t('auth.resetPassword')} onClose={handleClose} />
                        <ModalBody>
                            <div className='mb-4 flex flex-col items-center text-center'>
                                <FaLock className='h-8 w-8 text-primary' />
                                <p className='mt-2 text-sm text-surface-muted'>
                                    {t('auth.resetHint', { email: verifyingEmail })}
                                </p>
                            </div>
                            <form onSubmit={handleResetPassword} className='space-y-4'>
                                <div>
                                    <label className='mb-1 block text-xs font-medium text-surface-muted'>
                                        {t('auth.verificationCode')}
                                    </label>
                                    <input
                                        type='text'
                                        inputMode='numeric'
                                        autoComplete='one-time-code'
                                        maxLength={6}
                                        required
                                        autoFocus
                                        value={form.code}
                                        onChange={(e) =>
                                            setForm((f) => ({
                                                ...f,
                                                code: e.target.value.replace(/\D/g, '').slice(0, 6),
                                            }))
                                        }
                                        className={`${inputClass} text-center text-xl tracking-[0.5em]`}
                                        placeholder='••••••'
                                    />
                                </div>
                                <div>
                                    <label className='mb-1 block text-xs font-medium text-surface-muted'>
                                        {t('auth.newPassword')}
                                    </label>
                                    {renderPasswordField(
                                        'newPassword',
                                        form.newPassword,
                                        t('auth.newPassword'),
                                        (value) => setForm((f) => ({ ...f, newPassword: value })),
                                    )}
                                </div>
                                <div>
                                    <label className='mb-1 block text-xs font-medium text-surface-muted'>
                                        {t('auth.confirmPassword')}
                                    </label>
                                    {renderPasswordField(
                                        'confirmNewPassword',
                                        form.confirmNewPassword,
                                        t('auth.confirmPassword'),
                                        (value) =>
                                            setForm((f) => ({ ...f, confirmNewPassword: value })),
                                    )}
                                </div>
                                <Button type='submit' className='w-full' disabled={loading}>
                                    {loading ? '...' : t('auth.updatePassword')}
                                </Button>
                            </form>
                            <div className='mt-4 flex items-center justify-between'>
                                <Button
                                    type='button'
                                    variant='ghost'
                                    size='sm'
                                    onClick={() => {
                                        resetForm();
                                        setResetToken(null);
                                        setMode('signin');
                                    }}
                                >
                                    {t('auth.backToSignIn')}
                                </Button>
                                <Button
                                    type='button'
                                    variant='outline'
                                    size='sm'
                                    disabled={resendIn > 0 || loading}
                                    onClick={handleResendResetCode}
                                >
                                    {resendIn > 0
                                        ? t('auth.resendInSeconds', { seconds: resendIn })
                                        : t('auth.resendCode')}
                                </Button>
                            </div>
                        </ModalBody>
                    </>
                ) : (
                    <>
                        <ModalHeader title={t('auth.resetPassword')} onClose={handleClose} />
                        <ModalBody>
                            <div className='mb-4 flex flex-col items-center text-center'>
                                <FaLock className='h-8 w-8 text-primary' />
                                <p className='mt-2 text-sm text-surface-muted'>
                                    {t('auth.forgotHint')}
                                </p>
                            </div>
                            <form onSubmit={handleForgotPassword} className='space-y-4'>
                                <div>
                                    <label className='mb-1 block text-xs font-medium text-surface-muted'>
                                        {t('auth.email')}
                                    </label>
                                    <div className='relative'>
                                        <FaEnvelope className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-muted' />
                                        <input
                                            type='email'
                                            required
                                            autoFocus
                                            value={form.email}
                                            onChange={(e) =>
                                                setForm((f) => ({ ...f, email: e.target.value }))
                                            }
                                            className={`${inputClass} pl-10`}
                                            placeholder={t('auth.email')}
                                        />
                                    </div>
                                </div>
                                <Button type='submit' className='w-full' disabled={loading}>
                                    {loading ? '...' : t('auth.sendResetCode')}
                                </Button>
                            </form>
                            <Button
                                type='button'
                                variant='ghost'
                                size='sm'
                                className='mt-4 w-full'
                                onClick={() => {
                                    resetForm();
                                    setMode('signin');
                                }}
                            >
                                {t('auth.backToSignIn')}
                            </Button>
                        </ModalBody>
                    </>
                )
            ) : mode === 'verify' ? (
                <>
                    <ModalHeader title={t('auth.verifyEmail')} onClose={handleClose} />
                    <ModalBody>
                        <div className='mb-4 flex flex-col items-center text-center'>
                            <FaShieldHalved className='h-8 w-8 text-primary' />
                            <p className='mt-2 text-sm text-surface-muted'>
                                {t('auth.verifyHint', { email: verifyingEmail })}
                            </p>
                        </div>
                        <form onSubmit={handleVerifyOtp} className='space-y-4'>
                            <div>
                                <label className='mb-1 block text-xs font-medium text-surface-muted'>
                                    {t('auth.verificationCode')}
                                </label>
                                <input
                                    type='text'
                                    inputMode='numeric'
                                    autoComplete='one-time-code'
                                    maxLength={6}
                                    required
                                    autoFocus
                                    value={form.code}
                                    onChange={(e) =>
                                        setForm((f) => ({
                                            ...f,
                                            code: e.target.value.replace(/\D/g, '').slice(0, 6),
                                        }))
                                    }
                                    className={`${inputClass} text-center text-xl tracking-[0.5em]`}
                                    placeholder='••••••'
                                />
                            </div>
                            <Button type='submit' className='w-full' disabled={loading}>
                                {loading ? '...' : t('auth.verify')}
                            </Button>
                        </form>
                        <div className='mt-4 flex items-center justify-between'>
                            <Button
                                type='button'
                                variant='ghost'
                                size='sm'
                                onClick={() => {
                                    resetForm();
                                    setSignupToken(null);
                                    setMode('signin');
                                }}
                            >
                                {t('auth.backToSignIn')}
                            </Button>
                            <Button
                                type='button'
                                variant='outline'
                                size='sm'
                                disabled={resendIn > 0 || loading}
                                onClick={handleResendOtp}
                            >
                                {resendIn > 0
                                    ? t('auth.resendInSeconds', { seconds: resendIn })
                                    : t('auth.resendCode')}
                            </Button>
                        </div>
                    </ModalBody>
                </>
            ) : (
                <>
                    <ModalHeader
                        title={mode === 'signin' ? t('auth.signIn') : t('auth.signUp')}
                        onClose={handleClose}
                    />
                    <ModalBody>
                        <form
                            onSubmit={mode === 'signin' ? handleSignIn : handleSignUp}
                            className='space-y-4'
                        >
                            {mode === 'signup' && (
                                <div>
                                    <label className='mb-1 block text-xs font-medium text-surface-muted'>
                                        {t('auth.name')}
                                    </label>
                                    <div className='relative'>
                                        <FaUser className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-muted' />
                                        <input
                                            type='text'
                                            required
                                            value={form.name}
                                            onChange={(e) =>
                                                setForm((f) => ({ ...f, name: e.target.value }))
                                            }
                                            className={`${inputClass} pl-10`}
                                            placeholder={t('auth.name')}
                                        />
                                    </div>
                                </div>
                            )}

                            {mode === 'signup' && (
                                <div>
                                    <label className='mb-1 block text-xs font-medium text-surface-muted'>
                                        {t('auth.nameTag')}
                                    </label>
                                    <div className='relative'>
                                        <FaAt className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-muted' />
                                        <input
                                            type='text'
                                            required
                                            value={form.nameTag}
                                            onChange={(e) =>
                                                setForm((f) => ({
                                                    ...f,
                                                    nameTag: e.target.value
                                                        .replace(/[^A-Za-z0-9_-]/g, '')
                                                        .slice(0, 30)
                                                        .toLowerCase(),
                                                }))
                                            }
                                            className={`${inputClass} pl-10`}
                                            placeholder={t('auth.nameTag')}
                                        />
                                    </div>
                                    <p className='mt-1 text-xs text-surface-muted'>
                                        {t('auth.nameTagHint')}
                                    </p>
                                </div>
                            )}

                            <div>
                                <label className='mb-1 block text-xs font-medium text-surface-muted'>
                                    {t('auth.email')}
                                </label>
                                <div className='relative'>
                                    <FaEnvelope className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-muted' />
                                    <input
                                        type='email'
                                        required
                                        value={form.email}
                                        onChange={(e) =>
                                            setForm((f) => ({ ...f, email: e.target.value }))
                                        }
                                        className={`${inputClass} pl-10`}
                                        placeholder={t('auth.email')}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className='mb-1 block text-xs font-medium text-surface-muted'>
                                    {t('auth.password')}
                                </label>
                                {renderPasswordField(
                                    'password',
                                    form.password,
                                    t('auth.password'),
                                    (value) => setForm((f) => ({ ...f, password: value })),
                                )}
                            </div>

                            {mode === 'signup' && (
                                <div>
                                    <label className='mb-1 block text-xs font-medium text-surface-muted'>
                                        {t('auth.confirmPassword')}
                                    </label>
                                    {renderPasswordField(
                                        'confirmPassword',
                                        form.confirmPassword,
                                        t('auth.confirmPassword'),
                                        (value) =>
                                            setForm((f) => ({ ...f, confirmPassword: value })),
                                    )}
                                </div>
                            )}

                            {mode === 'signin' && (
                                <button
                                    type='button'
                                    className='text-xs text-primary hover:underline cursor-pointer'
                                    onClick={() => setMode('forgot')}
                                >
                                    {t('auth.forgotPassword')}
                                </button>
                            )}

                            <Button type='submit' className='w-full' disabled={loading}>
                                {loading
                                    ? '...'
                                    : mode === 'signin'
                                      ? t('auth.signIn')
                                      : t('auth.signUp')}
                            </Button>
                        </form>

                        <p className='mt-4 text-center text-xs text-surface-muted'>
                            {mode === 'signin' ? t('auth.noAccount') : t('auth.hasAccount')}{' '}
                            <button
                                type='button'
                                className='text-primary hover:underline cursor-pointer'
                                onClick={() => {
                                    resetForm();
                                    setMode(mode === 'signin' ? 'signup' : 'signin');
                                }}
                            >
                                {mode === 'signin' ? t('auth.signUp') : t('auth.signIn')}
                            </button>
                        </p>

                        <div className='mt-6 flex items-center gap-3'>
                            <div className='h-px flex-1 bg-line' />
                            <span className='text-xs text-surface-muted'>
                                {t('auth.orContinueWith')}
                            </span>
                            <div className='h-px flex-1 bg-line' />
                        </div>

                        {Object.values(AuthProvider).map((value) => {
                            const providerMeta = getProviderMeta(value);
                            if (value !== AuthProvider.LOCAL && providerMeta)
                                return (
                                    <Button
                                        variant='outline'
                                        className='mt-4 w-full'
                                        brandColor={providerMeta.color ?? 'foreground'}
                                        onClick={() => PROVIDER_ACTIONS[value].login(pathname)}
                                    >
                                        {React.createElement(providerMeta.icon, {
                                            className: 'h-4 w-4',
                                        })}
                                        {t(`auth.${value}`)}
                                    </Button>
                                );
                        })}
                    </ModalBody>
                </>
            )}
        </Modal>
    );
}
