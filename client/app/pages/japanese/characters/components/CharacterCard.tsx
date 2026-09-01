// -Path: 'client/app/pages/japanese/characters/components/CharacterCard.tsx'
import { motion } from 'framer-motion';
import type { Kana } from '~/data/japanese/kana';

interface CharacterCardProps {
    kana: Kana;
    index: number;
}

export default function CharacterCard({ kana, index }: CharacterCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.02 }}
            className='group flex flex-col items-center justify-center rounded-2xl border border-border bg-surface-elevated p-4 transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1'
        >
            <span className='text-4xl sm:text-5xl font-bold text-surface-foreground mb-3 transition-transform duration-300 group-hover:scale-110'>
                {kana.char}
            </span>
            <span className='text-sm font-mono uppercase tracking-wider text-primary'>
                {kana.romaji}
            </span>
        </motion.div>
    );
}
