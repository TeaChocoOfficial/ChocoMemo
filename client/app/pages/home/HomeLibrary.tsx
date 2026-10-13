// -Path: 'client/app/pages/home/HomeLibrary.tsx'
import { Link } from '~/i18n/routing';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import HomeSection from './HomeSection';
import SectionPill from './SectionPill';
import { FaArrowsRotate, FaBolt, FaListCheck, FaPenNib } from 'react-icons/fa6';

/** Which shelf items are live yet; the rest carry the "Coming soon" pill. */
const ITEM_READY = { decks: false, exam: false, kana: true, review: false } as const;

const ITEMS = [
    { id: 'decks', to: '/review', icon: <FaPenNib className='h-5 w-5' /> },
    { id: 'exam', to: '/exam', icon: <FaListCheck className='h-5 w-5' /> },
    { id: 'kana', to: '/drill/ja', icon: <FaBolt className='h-5 w-5' /> },
    { id: 'review', to: '/review', icon: <FaArrowsRotate className='h-5 w-5' /> },
] as const;

/**
 * The deck shelf: one card per kind of study set. A card whose feature is not
 * live yet carries the shared "Coming soon" pill, so the shelf tells the truth
 * without a per-card badge block.
 */
export default function HomeLibrary() {
    const { t } = useTranslation();

    return (
        <HomeSection
            index='03'
            badge={t('home.library.badge')}
            title={t('home.library.title')}
            hint={t('home.library.hint')}
        >
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                {ITEMS.map((item, index) => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ margin: '-100px' }}
                        transition={{ duration: 0.5, delay: index * 0.08 }}
                        className='h-full'
                    >
                        <Link
                            to={item.to}
                            className='group flex h-full flex-col rounded-sm border border-line bg-surface p-6 transition-colors duration-200 hover:border-primary hover:bg-surface-overlay'
                        >
                            <div className='flex items-start justify-between gap-4'>
                                <span className='flex h-11 w-11 shrink-0 items-center justify-center rounded-sm bg-primary text-primary-foreground transition-colors duration-200 group-hover:bg-primary-emphasis'>
                                    {item.icon}
                                </span>
                                <span className='font-mono text-xs font-bold tracking-[0.14em] text-surface-muted tabular-nums'>
                                    0{index + 1}
                                </span>
                            </div>

                            <h3 className='mt-5 text-lg font-bold tracking-tight text-surface-foreground'>
                                {t(`home.library.items.${item.id}.title`)}
                            </h3>
                            <p className='mt-1.5 flex-1 text-sm leading-relaxed text-surface-subtle'>
                                {t(`home.library.items.${item.id}.hint`)}
                            </p>

                            {!ITEM_READY[item.id] && <SectionPill />}
                        </Link>
                    </motion.div>
                ))}
            </div>
        </HomeSection>
    );
}
