// -Path: 'client/app/pages/language-select/LanguageCard.tsx'
import { motion } from 'framer-motion';
import Badge from '~/components/custom/Badge';
import { Link } from '~/i18n/routing';
import { FaLock } from 'react-icons/fa6';

export interface AvailableLanguage {
    id: string;
    code: string;
    name: string;
    flag: string;
    description: string;
    available: boolean;
    to?: string;
}

interface LanguageCardProps {
    language: AvailableLanguage;
    index: number;
}

export default function LanguageCard({ language, index }: LanguageCardProps) {
    const { id, flag, name, code, description, available, to } = language;

    const inner = (
        <>
            <div className='flex items-center justify-between mb-6'>
                <span className='text-5xl'>{flag}</span>
                {available ? (
                    <Badge variant='success'>Available</Badge>
                ) : (
                    <Badge variant='warning'>
                        <FaLock className='w-3 h-3' /> Coming Soon
                    </Badge>
                )}
            </div>

            <h3 className='text-2xl font-black tracking-tight text-surface-foreground mb-1'>
                {name}
            </h3>
            <p className='text-sm font-mono uppercase tracking-widest text-primary mb-4'>{code}</p>
            <p className='text-sm leading-relaxed text-surface-muted flex-1'>{description}</p>

            <div className='mt-8'>
                {available ? (
                    <span className='inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold shadow-lg shadow-primary/25 group-hover:bg-primary/90 transition-all duration-300'>
                        Start Learning
                    </span>
                ) : (
                    <span className='inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-muted text-surface-muted text-sm font-semibold cursor-not-allowed group-hover:bg-muted/70 transition-all duration-300'>
                        <FaLock className='w-3.5 h-3.5' /> Not Available
                    </span>
                )}
            </div>
        </>
    );

    const className =
        'group relative flex flex-col rounded-2xl border bg-surface-elevated p-6 transition-all duration-300 h-full';

    if (!available) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`${className} border-border/60 opacity-80 cursor-not-allowed`}
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
                className={`${className} border-border hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1`}
            >
                {inner}
            </Link>
        </motion.div>
    );
}
