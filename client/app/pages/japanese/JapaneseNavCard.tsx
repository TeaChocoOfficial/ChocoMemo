// -Path: 'client/app/pages/japanese/JapaneseNavCard.tsx'
import { motion } from 'framer-motion';
import { Link } from '~/i18n/routing';
import { FaArrowRight } from 'react-icons/fa6';

export interface JapaneseNavItem {
    to: string;
    icon: React.ReactNode;
    title: string;
    description: string;
    action: string;
}

interface JapaneseNavCardProps {
    item: JapaneseNavItem;
    index: number;
}

export default function JapaneseNavCard({ item, index }: JapaneseNavCardProps) {
    const { to, icon, title, description, action } = item;

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.12 }}
        >
            <Link
                to={to}
                className='group relative flex flex-col h-full rounded-sm border border-line bg-surface p-6 transition-colors duration-200 hover:border-accent hover:bg-surface-overlay'
            >
                <div className='mb-4 flex h-12 w-12 items-center justify-center rounded-sm bg-accent text-accent-foreground transition-colors duration-200 group-hover:bg-accent-emphasis'>
                    {icon}
                </div>

                <h3 className='mb-2 text-lg font-bold tracking-tight text-surface-foreground'>
                    {title}
                </h3>
                <p className='text-sm leading-relaxed text-surface-muted flex-1'>{description}</p>

                <div className='mt-6 inline-flex items-center gap-2 text-sm font-semibold text-accent'>
                    {action}
                    <FaArrowRight className='w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1' />
                </div>
            </Link>
        </motion.div>
    );
}
