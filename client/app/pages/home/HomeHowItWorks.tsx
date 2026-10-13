// -Path: 'client/app/pages/home/HomeHowItWorks.tsx'
import { Link } from '~/i18n/routing';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import HomeSection from './HomeSection';
import SectionPill from './SectionPill';
import { FaArrowsRotate, FaBolt, FaGlobe, FaPenNib } from 'react-icons/fa6';

/** Whether creating decks is live yet; step 4 stays upcoming until it is. */
const CREATE_DECK = false;

/**
 * The "how it works" walk-through: four numbered cards. Step 4 is where decks
 * get written, so it carries the shared "Coming soon" pill until creating decks
 * ships (`CREATE_DECK`).
 */
export default function HomeHowItWorks() {
    const { t } = useTranslation();

    const steps = [
        { id: 'step1', to: '#languages', icon: <FaGlobe className='h-5 w-5' /> },
        {
            id: 'step2',
            to: '/review',
            icon: <span className='text-2xl font-black leading-none'>本</span>,
        },
        { id: 'step3', to: '/drill/ja', icon: <FaBolt className='h-5 w-5' /> },
        {
            id: 'step4',
            to: '/auth',
            icon: <FaPenNib className='h-5 w-5' />,
            comingSoon: !CREATE_DECK,
        },
    ] as const;

    return (
        <HomeSection
            index='05'
            id='how-it-works'
            badge={t('home.how.badge')}
            title={t('home.how.title')}
            hint={t('home.how.hint')}
        >
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
                {steps.map((step, index) => (
                    <motion.div
                        key={step.id}
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ margin: '-100px' }}
                        transition={{ duration: 0.5, delay: index * 0.08 }}
                        className='h-full'
                    >
                        <Link
                            to={step.to}
                            className='group flex h-full flex-col rounded-sm border border-line bg-surface p-5 transition-colors duration-200 hover:border-primary hover:bg-surface-overlay'
                        >
                            <div className='mb-5 flex items-center justify-between'>
                                <span className='flex h-11 w-11 items-center justify-center rounded-sm bg-primary text-primary-foreground transition-colors duration-200 group-hover:bg-primary-emphasis'>
                                    {step.icon}
                                </span>
                                <span className='font-mono text-xs font-bold tracking-[0.14em] text-surface-muted tabular-nums'>
                                    0{index + 1}
                                </span>
                            </div>
                            <h3 className='text-base font-bold tracking-tight text-surface-foreground'>
                                {t(`home.how.${step.id}.title`)}
                            </h3>
                            <p className='mt-1.5 flex-1 text-sm leading-relaxed text-surface-muted'>
                                {t(`home.how.${step.id}.hint`)}
                            </p>
                            {'comingSoon' in step && step.comingSoon && <SectionPill />}
                        </Link>
                    </motion.div>
                ))}
            </div>
        </HomeSection>
    );
}
