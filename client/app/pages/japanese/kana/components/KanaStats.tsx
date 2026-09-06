// -Path: 'client/app/pages/japanese/kana/components/KanaStats.tsx'
import { motion } from 'framer-motion';

export interface Stat {
    label: string;
    value: string;
}

export default function KanaStats({ stats }: { stats: Stat[] }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className='grid grid-cols-3 gap-4 mb-6'
        >
            {stats.map((stat) => (
                <div
                    key={stat.label}
                    className='rounded-sm border border-line bg-surface-overlay px-5 py-4'
                >
                    <p className='text-2xl sm:text-3xl font-black tracking-tight text-surface-foreground'>
                        {stat.value}
                    </p>
                    <p className='mt-1.5 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-surface-muted'>
                        {stat.label}
                    </p>
                </div>
            ))}
        </motion.div>
    );
}
