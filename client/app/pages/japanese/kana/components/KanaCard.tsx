// -Path: 'client/app/pages/japanese/kana/components/KanaCard.tsx'
import { motion } from 'framer-motion';
import { useSpeak } from '~/hooks/useSpeak';
import { FaVolumeHigh } from 'react-icons/fa6';
import type { Kana } from '~/data/japanese/kana';

interface KanaCardProps {
    kana: Kana;
    index: number;
    active?: boolean;
    onRead?: (kana: Kana, index: number) => void;
}

export default function KanaCard({ kana, index, active = false, onRead }: KanaCardProps) {
    const speak = useSpeak();

    return (
        <motion.button
            type='button'
            whileTap={{ scale: 0.95 }}
            onClick={() => {
                onRead?.(kana, index);
                speak(kana.char);
            }}
            animate={{ opacity: 1, scale: 1 }}
            initial={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3, delay: index * 0.02 }}
            className={`group flex flex-col items-center justify-center rounded-sm border p-3 sm:p-4 aspect-square transition-colors duration-200 cursor-pointer ${
                active
                    ? 'border-primary bg-primary-subtle'
                    : 'border-line bg-surface hover:border-primary hover:bg-surface-overlay'
            }`}
        >
            <span className={`text-3xl sm:text-4xl md:text-5xl font-bold mb-1 sm:mb-3 leading-none transition-colors duration-200 ${
                active ? 'text-primary' : 'text-surface-foreground group-hover:text-primary'
            }`}>
                {kana.char}
            </span>
            <span className='flex items-center gap-1.5 text-[10px] sm:text-sm font-mono uppercase tracking-wider text-primary whitespace-nowrap'>
                <FaVolumeHigh className='w-2.5 h-2.5 sm:w-3.5 sm:h-3.5' />
                {kana.romaji}
            </span>
        </motion.button>
    );
}
