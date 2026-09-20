import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Button from '~/components/custom/Button';
import { FaRightFromBracket } from 'react-icons/fa6';
import { useSignOut } from '~/components/layout/navbar/useSignOut';

/** Sign-out / destructive actions section. */
export default function DangerZoneSection() {
    const { t } = useTranslation();
    const signOut = useSignOut();

    return (
        <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
        >
            <div className='mb-5 flex items-center gap-3'>
                <span className='font-mono text-xs font-bold tracking-[0.14em] text-error'>05</span>
                <span className='h-px w-10 bg-error/40' />
                <h2 className='text-lg font-bold tracking-tight text-error sm:text-xl'>
                    {t('profile.danger.label')}
                </h2>
            </div>

            <div className='rounded-sm border border-error/30 bg-error/5 p-5 sm:p-6'>
                <p className='text-sm leading-relaxed text-surface-muted'>{t('profile.danger.hint')}</p>
                <div className='mt-4 flex justify-end'>
                    <Button variant='ghost' onClick={signOut}>
                        <FaRightFromBracket className='h-3.5 w-3.5 text-error' />
                        <span className='text-error'>{t('auth.signOut')}</span>
                    </Button>
                </div>
            </div>
        </motion.section>
    );
}
