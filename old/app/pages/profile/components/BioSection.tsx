import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '~/stores/config/auth.store';

/**
 * The profile bio as its own section.
 *
 * Lives below the hero rather than inside it: the hero carries the identity
 * essentials (avatar, name, name tag), and a 160-character bio needs a full
 * block of its own instead of being squeezed under the handle. Editing still
 * happens through the hero's "Edit profile" modal, which covers name tag and
 * bio together.
 */
export default function BioSection() {
    const { t } = useTranslation();
    const { user } = useAuthStore();
    const bio = user?.bio?.trim();

    return (
        <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
        >
            <div className='mb-5 flex items-center gap-3'>
                <span className='font-mono text-xs font-bold tracking-[0.14em] text-primary'>
                    01
                </span>
                <span className='h-px w-10 bg-line-strong' />
                <h2 className='text-lg font-bold tracking-tight text-surface-foreground sm:text-xl'>
                    {t('profile.details.bio')}
                </h2>
            </div>
            <div className='rounded-sm border border-line bg-surface p-4 sm:p-5'>
                {bio ? (
                    <p className='text-sm leading-relaxed whitespace-pre-line text-surface-foreground/90'>
                        {bio}
                    </p>
                ) : (
                    <p className='text-sm text-surface-muted'>
                        {t('profile.details.bioPlaceholder')}
                    </p>
                )}
            </div>
        </motion.section>
    );
}
