// -Path: 'client/app/pages/home/HomeSpace.tsx'
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import HomeSection from './HomeSection';
import SectionPill from './SectionPill';

/** Whether the storage allowance and the shop are live yet. */
const STORAGE = false;

/** The two storage panels, in the order they read. */
const ITEMS = ['included', 'rent'] as const;

/**
 * The Space section: the storage allowance and the shop. Both are upcoming, so
 * the section carries one "Coming soon" pill driven by `STORAGE`.
 * No CTA until a shop route exists, and no numbers, prices or durations.
 */
export default function HomeSpace() {
    const { t } = useTranslation();

    return (
        <HomeSection
            index='04'
            badge={t('home.space.badge')}
            title={t('home.space.title')}
            hint={t('home.space.hint')}
            pill={!STORAGE ? <SectionPill /> : undefined}
        >
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                {ITEMS.map((id, index) => (
                    <motion.div
                        key={id}
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ margin: '-100px' }}
                        transition={{ duration: 0.5, delay: index * 0.08 }}
                    >
                        <div className='flex h-full flex-col rounded-sm border border-line bg-surface p-6'>
                            <h3 className='text-lg font-bold tracking-tight text-surface-foreground'>
                                {t(`home.space.items.${id}.title`)}
                            </h3>
                            <p className='mt-1.5 text-sm leading-relaxed text-surface-muted'>
                                {t(`home.space.items.${id}.hint`)}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </HomeSection>
    );
}
