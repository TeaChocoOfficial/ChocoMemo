// -Path: 'client/app/pages/home/LanguageCard.tsx'
import { motion } from 'framer-motion';
import Badge from '~/components/custom/Badge';
import { useTranslation } from 'react-i18next';
import { Link } from '~/i18n/routing';
import type { AvailableLanguage } from '~/data/language';
import { withTarget } from '~/utils/config/targetLang';

interface LanguageCardProps {
    language: AvailableLanguage;
    index: number;
}

/**
 * Row for a language that can be started.
 *
 * A horizontal band rather than a tile: the list is read top to bottom, so the
 * glyph, the name and the call to action sit on one line and the whole row is
 * the hit target.
 */
export default function LanguageCard({ language, index }: LanguageCardProps) {
    const { t } = useTranslation();
    const { id, glyph, code } = language;

    return (
        <motion.div
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.4, delay: index * 0.08 }}
        >
            <Link
                to={withTarget('/vocab', id)}
                className='group flex items-center gap-5 rounded-sm border border-line bg-surface p-5 transition-colors duration-200 hover:border-primary hover:bg-surface-overlay sm:gap-6 sm:p-6'
            >
                <span className='text-5xl font-black leading-none text-surface-subtle transition-colors duration-200 group-hover:text-primary sm:text-6xl'>
                    {glyph}
                </span>

                <div className='min-w-0 flex-1'>
                    <div className='flex flex-wrap items-center gap-x-3 gap-y-1'>
                        <h3 className='text-xl font-black tracking-tight text-surface-foreground sm:text-2xl'>
                            {t(`languageSelect.languages.${id}.name`)}
                        </h3>
                        <Badge variant='success'>{t('languageSelect.status.available')}</Badge>
                    </div>
                    <p className='mt-1 font-mono text-[11px] uppercase tracking-[0.14em] text-primary'>
                        {code}
                    </p>
                    <p className='mt-2 text-sm leading-relaxed text-surface-muted'>
                        {t(`languageSelect.languages.${id}.description`)}
                    </p>
                </div>

                <span className='hidden shrink-0 items-center gap-2 rounded-sm bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors duration-200 group-hover:bg-primary-emphasis sm:inline-flex'>
                    {t('languageSelect.cta.start')}
                </span>
            </Link>
        </motion.div>
    );
}
