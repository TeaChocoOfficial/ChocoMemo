// -Path: 'client/app/pages/language-select/LanguageCard.tsx'
import { motion } from 'framer-motion';
import Badge from '~/components/custom/Badge';
import { useTranslation } from 'react-i18next';
import { Link } from '~/i18n/routing';
import { FaLock } from 'react-icons/fa6';
import type { AvailableLanguage } from '~/data/language';

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
                to={`/${id}`}
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

/**
 * Row for a language that isn't ready yet.
 *
 * Deliberately not interactive and far quieter than the available row: no
 * border of its own, no description, no call to action. It sits inside the
 * "Coming soon" group so the page reads as "one thing to do, four to wait for"
 * rather than as a wall of locked tiles.
 */
export function LanguageLockedRow({ language, index }: LanguageCardProps) {
    const { t } = useTranslation();
    const { id, code, glyph } = language;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className='flex items-center gap-4 px-4 py-3 sm:px-5'
        >
            <span className='w-8 shrink-0 text-center text-xl font-black text-surface-subtle/60'>
                {glyph}
            </span>
            <span className='min-w-0 flex-1 truncate text-sm font-semibold text-surface-muted'>
                {t(`languageSelect.languages.${id}.name`)}
            </span>
            <span className='shrink-0 font-mono text-[11px] uppercase tracking-[0.14em] text-surface-muted/70'>
                {code}
            </span>
            <span className='inline-flex shrink-0 items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-surface-muted'>
                <FaLock className='h-3 w-3' />
                <span className='hidden sm:inline'>{t('languageSelect.status.comingSoon')}</span>
            </span>
        </motion.div>
    );
}
