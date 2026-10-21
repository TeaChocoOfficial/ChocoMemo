// -Path: 'client/app/pages/characters/th/components/ThaiCard.tsx'
import { motion } from 'framer-motion';
import { FaVolumeHigh } from 'react-icons/fa6';
import { useThaiVoice } from '~/hooks/characters/useThaiVoice';
import type { ReadableChar } from '~/types/characters';

/** Props for {@link ThaiCard}. */
interface ThaiCardProps {
    /** The letter this card shows. */
    letter: ReadableChar;
    /** Position in the set, used for the entrance stagger. */
    index: number;
    /** Whether the reader is currently on this letter. */
    active?: boolean;
    /** Notifies the reader that this card was tapped. */
    onRead?: (letter: ReadableChar, index: number) => void;
}

/**
 * One Thai tile: the glyph dominates, the letter name sits underneath with
 * a volume mark, and tapping speaks it with the chosen Google Cloud TTS
 * voice. The reader's current letter is tinted with the primary color.
 *
 * @param props - ThaiCard props.
 * @returns The rendered letter tile.
 */
export default function ThaiCard({ letter, index, active = false, onRead }: ThaiCardProps) {
    const { speak } = useThaiVoice();

    return (
        <motion.button
            type='button'
            whileTap={{ scale: 0.95 }}
            onClick={() => {
                onRead?.(letter, index);
                speak(letter.sound, letter.read);
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
            <span
                className={`text-3xl sm:text-4xl md:text-5xl font-bold mb-1 sm:mb-3 leading-none transition-colors duration-200 ${
                    active ? 'text-primary' : 'text-surface-foreground group-hover:text-primary'
                }`}
            >
                {letter.char}
            </span>
            <span className='flex min-w-0 max-w-full items-center gap-1.5 text-[10px] sm:text-sm font-mono uppercase tracking-wider text-primary whitespace-nowrap'>
                <FaVolumeHigh className='w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 shrink-0' />
                <span className='min-w-0 overflow-hidden text-ellipsis'>{letter.read}</span>
            </span>
        </motion.button>
    );
}
