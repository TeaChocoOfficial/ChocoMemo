// -Path: 'client/app/pages/home/HomeCta.tsx'
import { Link } from '~/i18n/routing';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Section from '~/components/custom/Section';
import { FaCircleRight, FaPenNib } from 'react-icons/fa6';

export default function HomeCta() {
    const { t } = useTranslation();

    return (
        <Section className='items-center justify-center'>
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ margin: '-100px' }}
                transition={{ duration: 0.5 }}
                className='mx-auto w-full max-w-3xl px-4 text-center sm:px-6'
            >
                <span className='mx-auto block h-px w-16 bg-primary' />

                <h2 className='mt-8 text-3xl font-black tracking-tighter text-surface-foreground sm:text-4xl'>
                    {t('home.cta.title')}
                </h2>
                <p className='mx-auto mt-4 max-w-xl text-base leading-relaxed text-surface-subtle'>
                    {t('home.cta.hint')}
                </p>

                <div className='mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row'>
                    <Link
                        to='/language-select'
                        className='inline-flex w-full items-center justify-center gap-2 rounded-sm bg-primary px-7 py-3.5 text-base font-semibold text-primary-foreground transition-colors duration-200 hover:bg-primary-emphasis sm:w-auto'
                    >
                        {t('home.cta.primary')}
                        <FaCircleRight className='h-4 w-4' />
                    </Link>
                    <Link
                        to='/auth'
                        className='inline-flex w-full items-center justify-center gap-2 rounded-sm border border-line-strong px-7 py-3.5 text-base font-semibold text-surface-foreground transition-colors duration-200 hover:border-primary hover:text-primary sm:w-auto'
                    >
                        <FaPenNib className='h-4 w-4' />
                        {t('home.cta.secondary')}
                    </Link>
                </div>
            </motion.div>
        </Section>
    );
}
