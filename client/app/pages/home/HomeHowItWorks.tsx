// -Path: 'client/app/pages/home/HomeHowItWorks.tsx'
import { Link } from '~/i18n/routing';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FaArrowsRotate, FaBolt, FaCircleRight, FaGlobe } from 'react-icons/fa6';
import Section from '~/components/custom/Section';

export default function HomeHowItWorks() {
    const { t } = useTranslation();

    const steps = [
        {
            to: '/language-select',
            icon: <FaGlobe className='h-5 w-5' />,
            title: t('home.how.step1.title'),
            hint: t('home.how.step1.hint'),
            step: '01',
        },
        {
            to: '/japanese/kana',
            icon: <span className='text-2xl font-black leading-none'>あ</span>,
            title: t('home.how.step2.title'),
            hint: t('home.how.step2.hint'),
            step: '02',
        },
        {
            to: '/japanese/kana-drill',
            icon: <FaBolt className='h-5 w-5' />,
            title: t('home.how.step3.title'),
            hint: t('home.how.step3.hint'),
            step: '03',
        },
        {
            to: '/japanese/review',
            icon: <FaArrowsRotate className='h-5 w-5' />,
            title: t('home.how.step4.title'),
            hint: t('home.how.step4.hint'),
            step: '04',
        },
    ];

    return (
        <Section className='items-center' >
            <div id='how-it-works' className='mx-auto w-full max-w-5xl px-4 sm:px-6'>
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ margin: '-100px' }}
                    transition={{ duration: 0.5 }}
                    className='mb-10'
                >
                    <div className='flex items-center gap-3'>
                        <span className='font-mono text-xs font-bold tracking-[0.14em] text-accent'>
                            {t('home.how.badge')}
                        </span>
                        <span className='h-px w-10 bg-line-strong' />
                    </div>
                    <h2 className='mt-3 text-2xl sm:text-3xl font-bold tracking-tight text-surface-foreground'>
                        {t('home.how.title')}
                    </h2>
                    <p className='mt-2 max-w-xl text-sm sm:text-base leading-relaxed text-surface-muted'>
                        {t('home.how.hint')}
                    </p>
                </motion.div>

                <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
                    {steps.map((step, index) => (
                        <motion.div
                            key={step.to}
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ margin: '-100px' }}
                            transition={{ duration: 0.5, delay: index * 0.08 }}
                        >
                            <Link
                                to={step.to}
                                className='flex h-full flex-col rounded-sm border border-line bg-surface p-5 transition-colors duration-200 hover:border-accent hover:bg-surface-overlay'
                            >
                                <div className='mb-4 flex items-center justify-between'>
                                    <span className='flex h-11 w-11 items-center justify-center rounded-sm bg-accent text-accent-foreground'>
                                        {step.icon}
                                    </span>
                                    <span className='font-mono text-xs font-bold tracking-[0.14em] text-surface-muted'>
                                        {step.step}
                                    </span>
                                </div>
                                <h3 className='mb-1.5 text-base font-bold tracking-tight text-surface-foreground'>
                                    {step.title}
                                </h3>
                                <p className='text-sm leading-relaxed text-surface-muted'>
                                    {step.hint}
                                </p>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ margin: '-100px' }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className='mt-12 flex justify-center'
                >
                    <Link
                        to='/language-select'
                        className='inline-flex items-center gap-2 rounded-sm bg-accent px-7 py-3.5 text-base font-semibold text-accent-foreground transition-colors duration-200 hover:bg-accent-emphasis'
                    >
                        {t('home.ctaStart')}
                        <FaCircleRight className='h-4 w-4' />
                    </Link>
                </motion.div>
            </div>
        </Section>
    );
}