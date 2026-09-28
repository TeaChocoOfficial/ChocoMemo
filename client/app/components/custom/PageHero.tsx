// -Path: 'client/app/components/custom/PageHero.tsx'
import { motion } from 'framer-motion';
import Badge from './Badge';

/** Centered page header: an eyebrow badge, a display title, a lead paragraph,
 *  and a short accent rule.
 *
 * Was copy-pasted as `JapaneseHero`, `KanaHero` and `LanguageSelectHero`, which
 * had drifted apart (one lost the accent rule, another changed its bottom
 * margin). */
export default function PageHero({
    badge,
    title,
    description,
    accent = true,
}: {
    badge?: string;
    title: string;
    description?: string;
    accent?: boolean;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className='text-center mb-10'
        >
            {badge && (
                <Badge variant='info' className='mb-6'>
                    {badge}
                </Badge>
            )}
            <h1 className='mb-4 text-4xl font-black tracking-tighter text-surface-foreground sm:text-5xl lg:text-6xl'>
                {title}
            </h1>
            {description && (
                <p className='mx-auto max-w-2xl text-lg leading-relaxed text-surface-subtle'>
                    {description}
                </p>
            )}
            {accent && <div className='mx-auto mt-8 h-px w-16 bg-primary' />}
        </motion.div>
    );
}
