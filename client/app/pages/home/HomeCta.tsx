// -Path: 'client/app/pages/home/HomeCta.tsx'
import { Link } from '~/i18n/routing';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Section from '~/components/custom/Section';
import { FaCircleRight, FaPenNib } from 'react-icons/fa6';

/** Whether creating decks is live yet; flip to reveal the second CTA. */
const CREATE_DECK = false;

const CTA =
    'inline-flex w-full items-center justify-center gap-2 rounded-sm px-7 py-3.5 text-base font-semibold transition-colors duration-200 sm:w-auto';
const CTA_PRIMARY = `${CTA} bg-primary text-primary-foreground hover:bg-primary-emphasis`;
const CTA_GHOST = `${CTA} border border-line-strong text-surface-foreground hover:border-primary hover:text-primary`;

/**
 * The closing call to action: a hairline-ruled banner that ends the document.
 * The secondary "Create a deck" button is hidden until creating decks ships
 * (`CREATE_DECK`); with one button the row stays centred.
 */
export default function HomeCta() {
    const { t } = useTranslation();

    return (
        <Section className='items-center justify-center'>
            <div className='mx-auto w-full max-w-5xl px-4 sm:px-6'>
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ margin: '-100px' }}
                    transition={{ duration: 0.5 }}
                    className='rounded-sm bg-surface px-6 py-12 text-center sm:px-12 sm:py-16'
                >
                    <h2 className='mx-auto max-w-2xl text-3xl font-black tracking-tighter text-surface-foreground sm:text-4xl'>
                        {t('home.cta.title')}
                    </h2>
                    <p className='mx-auto mt-4 max-w-xl text-base leading-relaxed text-surface-subtle'>
                        {t('home.cta.hint')}
                    </p>

                    <div className='mt-9 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center'>
                        <Link to='/study' className={CTA_PRIMARY}>
                            {t('home.cta.primary')}
                            <FaCircleRight className='h-4 w-4' />
                        </Link>
                        {/* Hidden until creating decks is live. */}
                        {CREATE_DECK && (
                            <Link to='/vocab' className={CTA_GHOST}>
                                <FaPenNib className='h-4 w-4' />
                                {t('home.cta.secondary')}
                            </Link>
                        )}
                    </div>
                </motion.div>
            </div>
        </Section>
    );
}
