// -Path: 'client/app/pages/language-select/LanguageCard.tsx'
import { motion } from 'framer-motion';
import Badge from '~/components/custom/Badge';
import { useTranslation } from 'react-i18next';
import { Link } from '~/i18n/routing';
import { FaLock } from 'react-icons/fa6';

export interface AvailableLanguage {
    id: string;
    code: string;
    name: string;
    glyph: string;
    description: string;
    available: boolean;
    to?: string;
}

interface LanguageCardProps {
    language: AvailableLanguage;
    index: number;
}

export default function LanguageCard({ language, index }: LanguageCardProps) {
    const { t } = useTranslation();
    const { id, glyph, name, code, description, available, to } = language;

    const inner = (
        <>
            <div className='flex items-start justify-between gap-4 mb-6'>
                <span className='text-5xl font-black leading-none text-surface-subtle'>{glyph}</span>
                {available ? (
                    <Badge variant='success'>{t('languageSelect.status.available')}</Badge>
                ) : (
                    <span className='inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-[0.14em] text-surface-muted'>
                        <FaLock className='w-3 h-3' /> {t('languageSelect.status.comingSoon')}
                    </span>
                )}
            </div>

            <h3 className='text-2xl font-black tracking-tight text-surface-foreground mb-1'>
                {name}
            </h3>
            <p className='text-sm font-mono uppercase tracking-widest text-accent mb-4'>{code}</p>
            <p className='text-sm leading-relaxed text-surface-muted flex-1'>{description}</p>

            <div className='mt-8'>
                {available ? (
                    <span className='inline-flex items-center gap-2 px-5 py-2.5 rounded-sm bg-accent text-accent-foreground text-sm font-semibold group-hover:bg-accent-emphasis transition-colors duration-200'>
                        {t('languageSelect.cta.start')}
                    </span>
                ) : (
                    <span className='inline-flex items-center gap-2 px-5 py-2.5 rounded-sm border border-line text-surface-muted text-sm font-semibold cursor-not-allowed'>
                        <FaLock className='w-3.5 h-3.5' /> {t('languageSelect.cta.unavailable')}
                    </span>
                )}
            </div>
        </>
    );

    const className =
        'group relative flex flex-col rounded-sm border p-6 transition-colors duration-200 h-full';

    if (!available) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`${className} border-line bg-surface opacity-70 cursor-not-allowed`}
            >
                {inner}
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
        >
            <Link
                to={to!}
                className={`${className} border-line bg-surface hover:border-accent hover:bg-surface-overlay`}
            >
                {inner}
            </Link>
        </motion.div>
    );
}