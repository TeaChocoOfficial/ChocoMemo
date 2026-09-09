import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaGoogle, FaEnvelope, FaLock, FaUser } from 'react-icons/fa6';
import { Modal, ModalHeader, ModalBody } from '~/components/custom/Modal';
import Button from '~/components/custom/Button';
import { authAPI } from '~/services/auth';
import { useAuthStore } from '~/stores/auth.store';
import toast from 'react-hot-toast';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialMode?: 'signin' | 'signup' | 'forgot';
}

export default function AuthModal({ isOpen, onClose, initialMode = 'signin' }: AuthModalProps) {
    const { t } = useTranslation();
    const { setUser } = useAuthStore();
    const [mode, setMode] = useState(initialMode);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({ name: '', email: '', password: '' });

    const resetForm = () => setForm({ name: '', email: '', password: '' });

    const handleClose = () => {
        resetForm();
        setMode('signin');
        onClose();
    };

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await authAPI.login({ email: form.email, password: form.password });
            setUser(res.data.user);
            toast.success(t('auth.welcome', { name: res.data.user?.name ?? '' }));
            handleClose();
        } catch {
            toast.error(t('auth.error.invalidCredentials'));
        } finally {
            setLoading(false);
        }
    };

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await authAPI.register({
                name: form.name,
                email: form.email,
                password: form.password,
            });
            setUser(res.data.user);
            toast.success(t('auth.welcome', { name: res.data.user?.name ?? '' }));
            handleClose();
        } catch {
            toast.error(t('auth.error.emailInUse'));
        } finally {
            setLoading(false);
        }
    };

    const handleGoogle = () => {
        authAPI.googleLogin();
    };

    const inputClass =
        'w-full rounded-sm border border-line bg-surface px-3 py-2.5 text-sm text-surface-foreground placeholder:text-surface-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent';

    return (
        <Modal isOpen={isOpen} onClose={handleClose} size='sm'>
            {mode === 'forgot' ? (
                <>
                    <ModalHeader title={t('auth.resetPassword')} onClose={handleClose} />
                    <ModalBody>
                        <p className='mb-4 text-sm text-surface-muted'>{t('auth.resetSent')}</p>
                        <Button variant='outline' className='w-full' onClick={() => setMode('signin')}>
                            {t('auth.backToSignIn')}
                        </Button>
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
                                <div className='relative'>
                                    <FaLock className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-muted' />
                                    <input
                                        type='password'
                                        required
                                        value={form.password}
                                        onChange={(e) =>
                                            setForm((f) => ({ ...f, password: e.target.value }))
                                        }
                                        className={`${inputClass} pl-10`}
                                        placeholder={t('auth.password')}
                                    />
                                </div>
                            </div>

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
