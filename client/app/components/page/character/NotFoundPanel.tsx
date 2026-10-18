// -Path: 'client/app/pages/characters/components/NotFoundPanel.tsx'
import { motion } from 'framer-motion';
import Badge from '~/components/custom/Badge';
import { useTranslation } from 'react-i18next';
import FallbackActions from './FallbackActions';
import Section from '~/components/custom/Section';

/**
 * The honest "not found" panel for a character route whose `:target` is not a
 * language ChocoMemo knows (unknown code, or the deck-only "all" filter). A
 * ghosted question mark stands in for the missing glyph; the only action is
 * the way back to the study hub.
 *
 * @returns The rendered not-found panel.
 */
export default function NotFoundPanel() {
    const { t } = useTranslation();

    return (
        <Section className='items-start justify-center'>
            <div className='mx-auto w-full max-w-2xl px-4 text-center sm:px-6'>
                <motion.div
                    animate={{ opacity: 1, y: 0 }}
                    initial={{ opacity: 0, y: 24 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                >
                    {/** Ghosted stand-in for the glyph this route never had. */}
                    <span
                        aria-hidden='true'
                        className='block select-none text-[8rem] font-black leading-none tracking-tighter text-surface-foreground/10 sm:text-[10rem]'
                    >
                        ?
                    </span>

                    <Badge variant='error' className='mt-2'>
                        {t('characters.notFound.badge')}
                    </Badge>

                    <h1 className='mt-4 text-4xl font-black tracking-tighter text-surface-foreground sm:text-5xl'>
                        {t('characters.notFound.title')}
                    </h1>

                    <p className='mx-auto mt-4 max-w-xl text-base leading-relaxed text-surface-subtle sm:text-lg'>
                        {t('characters.notFound.body')}
                    </p>

                    <FallbackActions className='mt-8' />
                </motion.div>
            </div>
        </Section>
    );
}
