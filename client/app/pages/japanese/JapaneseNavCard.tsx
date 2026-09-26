// -Path: 'client/app/pages/japanese/JapaneseNavCard.tsx'
import { motion } from 'framer-motion';
import { Link } from '~/i18n/routing';
import { FaArrowRight } from 'react-icons/fa6';
import { useTranslation } from 'react-i18next';

export interface JapaneseNavItem {
    to: string;
    icon: React.ReactNode;
    title: string;
    description: string;
    action: string;
    mode?: 'learn' | 'practice';
}

interface JapaneseNavCardProps {
    item: JapaneseNavItem;
    index: number;
}

const modeLabels: Record<'learn' | 'practice', string> = {
    learn: 'japanese.sections.learn',
    practice: 'japanese.sections.practice',
};

export default function JapaneseNavCard({ item, index }: JapaneseNavCardProps) {
    const { t } = useTranslation();
    const { to, icon, title, description, action, mode } = item;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className='h-full'
        >
            <Link
                to={to}
                className='group relative flex h-full flex-col rounded-sm border border-line bg-surface p-6 transition-colors duration-200 hover:border-primary hover:bg-surface-overlay'
            >
                {mode && (
                    <span className='absolute right-5 top-5 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-surface-muted transition-colors duration-200 group-hover:text-primary'>
                        {t(modeLabels[mode])}
                    </span>
                )}

                <div className='mb-4 flex h-14 w-14 items-center justify-center rounded-sm bg-primary text-primary-foreground transition-colors duration-200 group-hover:bg-primary-emphasis'>
                    {icon}
                </div>

                <h3 className='mb-2 pr-16 text-lg font-bold tracking-tight text-surface-foreground'>
                    {title}
                </h3>
                <p className='flex-1 text-sm leading-relaxed text-surface-muted'>{description}</p>

                <div className='mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary'>
                    {action}
                    <FaArrowRight className='w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1' />
                </div>
            </Link>
        </motion.div>
    );
}