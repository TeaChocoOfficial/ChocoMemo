import axios from 'axios';
import toast from 'react-hot-toast';
import { authAPI } from '~/services/auth';
import PasswordInput from './PasswordInput';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '~/components/custom/Button';
import { useAuthStore } from '~/stores/auth.store';
import { FaLock, FaUser, FaGoogle, FaEnvelope, FaShieldHalved } from 'react-icons/fa6';
import { Modal, ModalHeader, ModalBody } from '~/components/custom/Modal';
import { usePathname } from '~/i18n/routing';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialMode?: 'signin' | 'signup' | 'forgot' | 'verify';
}

const RESEND_COOLDOWN = 30;

export default function AuthModal({ isOpen, onClose, initialMode = 'signin' }: AuthModalProps) {
    const { t } = useTranslation();
    const pathname = usePathname();
    const { setUser } = useAuthStore();
    const [mode, setMode] = useState(initialMode);
    const [loading, setLoading] = useState(false);
    const [resendIn, setResendIn] = useState(0);
    const [showPassword, setShowPassword] = useState<Record<string, boolean>>({});
    const [verifyingEmail, setVerifyingEmail] = useState('');
    const [signupToken, setSignupToken] = useState<string | null>(null);
    const [resetToken, setResetToken] = useState<string | null>(null);
    const [form, setForm] = useState({
        name: '',
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

    const resetForm = () =>
        setForm({
            name: '',
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
        onClose();
    };

    const startVerification = async (email: string) => {
        const res = await authAPI.resendOtp({ email });
        setSignupToken(res.data.access_token);
        setVerifyingEmail(email);
        setResendIn(RESEND_COOLDOWN);
        setMode('verify');
        toast.success(t('auth.otpSent', { email }));
    };

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await authAPI.login({ email: form.email, password: form.password });
            setUser(res.data.user);
            toast.success(t('auth.welcome', { name: res.data.user?.name ?? '' }));
            handleClose();
        } catch (err) {
            if (isEmailNotVerified(err)) {
                try {
                    await startVerification(form.email);
                } catch {
                    toast.error(t('auth.error.invalidCredentials'));
                }
            } else {
                toast.error(t('auth.error.invalidCredentials'));
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (form.password !== form.confirmPassword) {
            toast.error(t('auth.error.passwordMismatch'));
            return;
        }
        setLoading(true);
        try {
            const res = await authAPI.register({
                name: form.name,
                email: form.email,
                password: form.password,
            });
            setSignupToken(res.data.access_token);
            setVerifyingEmail(form.email);
            setResendIn(RESEND_COOLDOWN);
            setMode('verify');
            toast.success(t('auth.otpSent', { email: form.email }));
        } catch {
            toast.error(t('auth.error.emailInUse'));
        } finally {
            setLoading(false);
        }
    };

    const handleGoogle = () => {
        authAPI.googleLogin(pathname);
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!signupToken) return;
        setLoading(true);
        try {
            const res = await authAPI.verifyOtp({ token: signupToken, code: form.code });
            setUser(res.data.user);
            toast.success(t('auth.verifySuccess', { name: res.data.user?.name ?? '' }));
            handleClose();
        } catch {
            toast.error(t('auth.error.invalidOtp'));
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
            toast.success(t('auth.otpResent'));
        } catch {
            toast.error(t('auth.error.resendFailed'));
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
            toast.success(t('auth.resetCodeSent', { email: form.email }));
        } catch (err) {
            if (isEmailNotFound(err)) {
                toast.error(t('auth.error.emailNotFound'));
            } else {
                toast.error(t('auth.error.resetFailed'));
            }
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!resetToken) return;
        if (form.newPassword !== form.confirmNewPassword) {
            toast.error(t('auth.error.passwordMismatch'));
            return;
        }
        setLoading(true);
        try {
            const res = await authAPI.resetPassword({
                token: resetToken,
                code: form.code,
                newPassword: form.newPassword,
            });
            setUser(res.data.user);
            toast.success(t('auth.resetSuccess'));
            handleClose();
        } catch {
            toast.error(t('auth.error.resetFailed'));
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
            toast.success(t('auth.otpResent'));
        } catch {
            toast.error(t('auth.error.resendFailed'));
        } finally {
            setLoading(false);
        }
    };

    const inputClass =
        'w-full rounded-sm border border-line bg-surface px-3 py-2.5 text-sm text-surface-foreground placeholder:text-surface-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent';

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
        <Modal isOpen={isOpen} onClose={handleClose} size='sm'>
            {mode === 'forgot' ? (
                resetToken ? (
                    <>
                        <ModalHeader title={t('auth.resetPassword')} onClose={handleClose} />
                        <ModalBody>
                            <div className='mb-4 flex flex-col items-center text-center'>
                                <FaLock className='h-8 w-8 text-accent' />
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
                                <FaLock className='h-8 w-8 text-accent' />
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
                            <FaShieldHalved className='h-8 w-8 text-accent' />
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
                                    className='text-xs text-accent hover:underline cursor-pointer'
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

                        <div className='mt-4 flex items-center gap-3'>
                            <div className='h-px flex-1 bg-line' />
                            <span className='text-xs text-surface-muted'>
                                {t('auth.orContinueWith')}
                            </span>
                            <div className='h-px flex-1 bg-line' />
                        </div>

                        <Button variant='outline' className='mt-4 w-full' onClick={handleGoogle}>
                            <FaGoogle className='h-4 w-4' />
                            {t('auth.google')}
                        </Button>

                        <p className='mt-4 text-center text-xs text-surface-muted'>
                            {mode === 'signin' ? t('auth.noAccount') : t('auth.hasAccount')}{' '}
                            <button
                                type='button'
                                className='text-accent hover:underline cursor-pointer'
                                onClick={() => {
                                    resetForm();
                                    setMode(mode === 'signin' ? 'signup' : 'signin');
                                }}
                            >
                                {mode === 'signin' ? t('auth.signUp') : t('auth.signIn')}
                            </button>
                        </p>
                    </ModalBody>
                </>
            )}
        </Modal>
    );
}
