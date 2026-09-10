import { motion } from 'framer-motion';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '~/components/custom/Button';
import { useAuthStore } from '~/stores/auth.store';
import { authAPI } from '~/services/auth';
import toast from 'react-hot-toast';
import { FaRightFromBracket } from 'react-icons/fa6';

export default function AccountDetails() {
    const { t } = useTranslation();
    const { user, setUser } = useAuthStore();
    const [name, setName] = useState(user?.name ?? '');
    const [email, setEmail] = useState(user?.email ?? '');
    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        setSaving(true);
        try {
            const updated = await authAPI.updateUser({
                name: name.trim() || undefined,
                email: email.trim().toLowerCase() || undefined,
            });
            setUser(updated.data);
            toast.success(t('profile.details.saved'));
        } catch {
            toast.error(t('profile.details.updateError'));
        } finally {
            setSaving(false);
        }
    };

    const handleSignOut = async () => {
        try {
            await authAPI.logout();
            setUser(null);
            toast.success(t('auth.signOut'));
        } catch {
            toast.error(t('auth.error.generic'));
        }
    };

    const inputClass =
        'w-full rounded-sm border border-line bg-surface px-3 py-2 text-sm text-surface-foreground placeholder:text-surface-muted/60 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-colors';

    return (
        <>
            <motion.section
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
            >
                <div className='mb-5 flex items-center gap-3'>
                    <span className='font-mono text-xs font-bold tracking-[0.14em] text-accent'>
                        02
                    </span>
                    <span className='h-px w-10 bg-line-strong' />
                    <h2 className='text-lg sm:text-xl font-bold tracking-tight text-surface-foreground'>
                        {t('profile.details.label')}
                    </h2>
                </div>

                <div className='rounded-sm border border-line bg-surface p-5 sm:p-6'>
                    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                        <div>
                            <label className='mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-surface-muted'>
                                {t('profile.details.name')}
                            </label>
                            <input
                                type='text'
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder={t('profile.details.namePlaceholder')}
                                className={inputClass}
                            />
                        </div>
                        <div>
                            <label className='mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-surface-muted'>
                                {t('profile.details.email')}
                            </label>
                            <input
                                type='email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder={t('profile.details.emailPlaceholder')}
                                className={inputClass}
                            />
                        </div>
                    </div>
                    <div className='mt-5 flex justify-end'>
                        <Button
                            variant='primary'
                            onClick={handleSave}
                            disabled={saving || (!name.trim() && !email.trim())}
                        >
                            {saving ? t('profile.details.saving') : t('profile.details.save')}
                        </Button>
                    </div>
                </div>
            </motion.section>

            <motion.section
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.15 }}
            >
                <div className='mb-5 flex items-center gap-3'>
                    <span className='font-mono text-xs font-bold tracking-[0.14em] text-error'>
                        03
                    </span>
                    <span className='h-px w-10 bg-error/40' />
                    <h2 className='text-lg sm:text-xl font-bold tracking-tight text-error'>
                        {t('profile.danger.label')}
                    </h2>
                </div>

                <div className='rounded-sm border border-error/30 bg-error/5 p-5 sm:p-6'>
                    <p className='text-sm leading-relaxed text-surface-muted'>
                        {t('profile.danger.hint')}
                    </p>
                    <div className='mt-4 flex justify-end'>
                        <Button variant='ghost' onClick={handleSignOut}>
                            <FaRightFromBracket className='h-3.5 w-3.5 text-error' />
                            <span className='text-error'>{t('auth.signOut')}</span>
                        </Button>
                    </div>
                </div>
            </motion.section>
        </>
    );
}