// -Path: 'Vite-React-TypeScript/src/pages/auth/RegisterForm.tsx'
import {
    FaLock,
    FaUser,
    FaSpinner,
    FaEnvelope,
    FaUserPlus,
    FaCircleXmark,
    FaCircleCheck,
} from 'react-icons/fa6';
import { motion } from 'framer-motion';
import type { Message } from '../../type';
import { useTranslation } from 'react-i18next';
import Button from '~/components/custom/Button';
import type { RegisterPayload } from '~/services/auth';

interface RegisterFormProps {
    form: RegisterPayload;
    loading: boolean;
    message: Message | null;
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function RegisterForm({
    form,
    loading,
    message,
    onSubmit,
    onChange,
}: RegisterFormProps) {
    const { t } = useTranslation();

    return (
        <>
            <div className='flex items-center gap-3 mb-6'>
                <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/10 text-secondary'>
                    <FaUserPlus className='w-5 h-5' />
                </div>
                <h2 className='text-xl font-bold text-surface-foreground'>
                    {t('auth.register_title')}
                </h2>
            </div>

            <form onSubmit={onSubmit} className='space-y-5'>
                {message && (
                    <motion.div
                        animate={{ opacity: 1, y: 0 }}
                        initial={{ opacity: 0, y: -10 }}
                        className={`rounded-xl p-4 border ${
                            message.type === 'success'
                                ? 'bg-success-subtle border-success/20 text-success'
                                : 'bg-error-subtle border-error/20 text-error'
                        }`}
                    >
                        <div className='flex items-center gap-2'>
                            {message.type === 'success' ? (
                                <FaCircleCheck className='w-4 h-4 shrink-0' />
                            ) : (
                                <FaCircleXmark className='w-4 h-4 shrink-0' />
                            )}
                            <span className='text-sm font-medium'>{message.text}</span>
                        </div>
                    </motion.div>
                )}
                <div>
                    <label
                        htmlFor='register-name'
                        className='block text-sm font-medium text-surface-muted mb-2'
                    >
                        {t('auth.name')}
                    </label>
                    <div className='relative'>
                        <FaUser className='absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-muted' />
                        <input
                            id='register-name'
                            type='text'
                            name='name'
                            autoComplete='name'
                            value={form.name}
                            onChange={onChange}
                            placeholder={t('auth.name_placeholder')}
                            required
                            className='w-full pl-11 pr-4 py-3 rounded-xl border border-border bg-surface-elevated text-surface-foreground placeholder:text-surface-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300'
                        />
                    </div>
                </div>

                <div>
                    <label
                        htmlFor='register-email'
                        className='block text-sm font-medium text-surface-muted mb-2'
                    >
                        {t('auth.email')}
                    </label>
                    <div className='relative'>
                        <FaEnvelope className='absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-muted' />
                        <input
                            id='register-email'
                            type='email'
                            name='email'
                            autoComplete='email'
                            value={form.email}
                            onChange={onChange}
                            placeholder={t('auth.email_placeholder')}
                            required
                            className='w-full pl-11 pr-4 py-3 rounded-xl border border-border bg-surface-elevated text-surface-foreground placeholder:text-surface-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300'
                        />
                    </div>
                </div>

                <div>
                    <label
                        htmlFor='register-password'
                        className='block text-sm font-medium text-surface-muted mb-2'
                    >
                        {t('auth.password')}
                    </label>
                    <div className='relative'>
                        <FaLock className='absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-muted' />
                        <input
                            id='register-password'
                            type='password'
                            name='password'
                            autoComplete='new-password'
                            value={form.password}
                            onChange={onChange}
                            placeholder={t('auth.password_placeholder')}
                            required
                            className='w-full pl-11 pr-4 py-3 rounded-xl border border-border bg-surface-elevated text-surface-foreground placeholder:text-surface-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300'
                        />
                    </div>
                </div>

                <Button type='submit' variant='secondary' disabled={loading} className='w-full'>
                    {loading ? (
                        <FaSpinner className='w-4 h-4 animate-spin' />
                    ) : (
                        <FaUserPlus className='w-4 h-4' />
                    )}
                    {t('auth.register_button')}
                </Button>
            </form>
        </>
    );
}
