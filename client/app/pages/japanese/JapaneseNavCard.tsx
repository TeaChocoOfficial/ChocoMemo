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
    accentClass?: string;
}

interface JapaneseNavCardProps {
    item: JapaneseNavItem;
    index: number;
}

export default function JapaneseNavCard({ item, index }: JapaneseNavCardProps) {
    const { to, icon, title, description, action, accentClass = 'from-primary to-secondary' } =
        item;

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.12 }}
        >
            <Link
                to={to}
                className='group relative flex flex-col h-full rounded-2xl border border-border bg-surface-elevated p-6 transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1'
            >
                <div
                    className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br ${accentClass} text-primary-foreground shadow-lg transition-transform duration-300 group-hover:scale-110`}
                >
                    {icon}
                </div>

                <h3 className='mb-2 text-lg font-bold tracking-tight text-surface-foreground'>
                    {title}
                </h3>
                <p className='text-sm leading-relaxed text-surface-muted flex-1'>{description}</p>

                <div className='mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary transition-all duration-300 group-hover:gap-3'>
                    {action}
                    <FaArrowRight className='w-3.5 h-3.5' />
                </div>
            </Link>
        </motion.div>
    );
}
