// -Path: 'client/app/pages/japanese/characters/components/CharacterCard.tsx'
import { motion } from 'framer-motion';
import { FaVolumeHigh } from 'react-icons/fa6';
import { useSpeak } from '~/hooks/useSpeak';
import type { Kana } from '~/data/japanese/kana';

interface CharacterCardProps {
    kana: Kana;
    index: number;
}

export default function CharacterCard({ kana, index }: CharacterCardProps) {
    const speak = useSpeak();

    return (
        <motion.button
            type='button'
            onClick={() => speak(kana.char)}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.02 }}
            whileTap={{ scale: 0.95 }}
            className='group flex flex-col items-center justify-center rounded-sm border border-line bg-surface p-3 sm:p-4 aspect-square transition-colors duration-200 hover:border-accent hover:bg-surface-overlay cursor-pointer'
        >
            <span className='text-3xl sm:text-4xl md:text-5xl font-bold text-surface-foreground mb-1 sm:mb-3 leading-none transition-colors duration-200 group-hover:text-accent'>
                {kana.char}
            </span>
            <span className='flex items-center gap-1.5 text-[10px] sm:text-sm font-mono uppercase tracking-wider text-accent whitespace-nowrap'>
                <FaVolumeHigh className='w-2.5 h-2.5 sm:w-3.5 sm:h-3.5' />
                {kana.romaji}
            </span>
        </motion.button>
    );
}
