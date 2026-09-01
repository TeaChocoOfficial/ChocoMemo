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
            className='group flex flex-col items-center justify-center rounded-sm border border-line bg-surface p-4 transition-colors duration-200 hover:border-accent hover:bg-surface-overlay'
        >
            <span className='text-4xl sm:text-5xl font-bold text-surface-foreground mb-3 transition-colors duration-200 group-hover:text-accent'>
                {kana.char}
            </span>
            <span className='text-sm font-mono uppercase tracking-wider text-accent'>
                {kana.romaji}
            </span>
        </motion.div>
    );
}
