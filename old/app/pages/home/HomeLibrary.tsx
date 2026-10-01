// -Path: 'client/app/pages/home/HomeLibrary.tsx'
import { Link } from '~/i18n/routing';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Section from '~/components/custom/Section';
import { FaArrowsRotate, FaBolt, FaCircleRight, FaListCheck, FaPenNib } from 'react-icons/fa6';

const ITEMS = [
    {
        id: 'decks',
        to: '/japanese/review',
        icon: <FaPenNib className='h-5 w-5' />,
        tone: '#e8c47a',
    },
    {
        id: 'exam',
        to: '/japanese/exam',
        icon: <FaListCheck className='h-5 w-5' />,
        tone: '#b8d8af',
    },
    {
        id: 'kana',
        to: '/japanese/drill',
        icon: <FaBolt className='h-5 w-5' />,
        tone: '#9ec8e0',
    },
    {
        id: 'review',
        to: '/japanese/review',
        icon: <FaArrowsRotate className='h-5 w-5' />,
        tone: '#d8c0e8',
    },
] as const;

export default function HomeLibrary() {
    const { t } = useTranslation();

    return (
        <Section className='items-center'>
            <div className='mx-auto w-full max-w-6xl px-4 sm:px-6'>
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ margin: '-100px' }}
                    transition={{ duration: 0.5 }}
                    className='mb-10 max-w-2xl'
                >
                    <div className='flex items-center gap-3'>
                        <span className='font-mono text-xs font-bold uppercase tracking-[0.14em] text-primary'>
                            {t('home.library.badge')}
                        </span>
                        <span className='h-px w-10 bg-line-strong' />
                    </div>
                    <h2 className='mt-3 text-2xl font-bold tracking-tight text-surface-foreground sm:text-3xl'>
                        {t('home.library.title')}
                    </h2>
                    <p className='mt-2 text-sm leading-relaxed text-surface-muted sm:text-base'>
                        {t('home.library.hint')}
                    </p>
                </motion.div>

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
                                className='group relative flex h-full flex-col rounded-[3px] border border-line-strong bg-surface-elevated px-6 pb-6 pt-8 transition-colors duration-200 hover:border-primary'
                            >
                                <span
                                    aria-hidden='true'
                                    className='pointer-events-none absolute -top-2.5 left-5 z-10 flex h-5 -rotate-2 items-center rounded-[2px] border border-line-strong/50 px-3'
                                    style={{ backgroundColor: `${item.tone}cc` }}
                                >
                                    <span className='font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-surface-foreground/75'>
                                        0{index + 1}
                                    </span>
                                </span>

                                <div className='flex items-start gap-4'>
                                    <span className='flex h-11 w-11 shrink-0 items-center justify-center rounded-sm bg-primary text-primary-foreground'>
                                        {item.icon}
                                    </span>
                                    <div className='min-w-0 flex-1'>
                                        <h3 className='text-lg font-bold tracking-tight text-surface-foreground'>
                                            {t(`home.library.items.${item.id}.title`)}
                                        </h3>
                                        <p className='mt-1.5 text-sm leading-relaxed text-surface-subtle'>
                                            {t(`home.library.items.${item.id}.hint`)}
                                        </p>
                                    </div>
                                    <FaCircleRight className='mt-1 h-4 w-4 shrink-0 text-surface-muted transition-transform duration-200 group-hover:translate-x-1 group-hover:text-primary' />
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </Section>
    );
}
