// -Path: 'client/app/pages/characters/components/CharacterCard.tsx'
import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaVolumeHigh } from 'react-icons/fa6';
import type { ReadableChar } from '~/types/characters';
import { useCharacterToolbar } from '~/hooks/characters/useCharacterToolbar';

/** Props for {@link CharacterCard}. */
interface CharacterCardProps {
    /** The character this card shows. */
    char: ReadableChar;
    /** Position in the group, used for the entrance stagger. */
    index: number;
    /** Whether the reader is currently on this character. */
    active?: boolean;
}

/**
 * One character tile, shared by every chart (kana, alphabet, Thai). The picture
 * declared by the character fills the card and the glyph rides over it as a
 * corner badge, so the letter itself is never lost behind the illustration;
 * without a picture — or when the file is missing — the glyph takes the whole
 * area instead. A hairline footer carries the reading and the speaker mark.
 * Tapping marks the tile as the resume point and plays its shipped clip.
 *
 * @param props - CharacterCard props.
 * @returns The rendered character tile.
 */
export default function CharacterCard({ char, index, active = false }: CharacterCardProps) {
    const { speak, handleCardRead } = useCharacterToolbar();
    const [loaded, setLoaded] = useState(false);
    const [failed, setFailed] = useState(false);
    const image = char.image;
    const showImage = image !== '' && !failed;

    return (
        <motion.button
            type='button'
            aria-pressed={active}
            aria-label={`${char.char} ${char.read}`}
            whileHover={{ y: -2, transition: { duration: 0.15 } }}
            whileTap={{ scale: 0.97, transition: { duration: 0.1 } }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            initial={{ opacity: 0, scale: 0.94 }}
            transition={{ duration: 0.28, delay: index * 0.015 }}
            onClick={() => {
                handleCardRead(char, index);
                speak(char.sound);
            }}
            className={`group relative flex aspect-square flex-col overflow-hidden rounded-sm border outline-none transition-colors duration-200 cursor-pointer focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface ${
                active
                    ? 'border-primary bg-primary-subtle shadow-sm shadow-primary/15'
                    : 'border-line bg-surface hover:border-primary/60 hover:bg-surface-overlay'
            }`}
        >
            <span
                aria-hidden='true'
                className={`absolute inset-x-0 top-0 z-10 h-0.5 transition-colors duration-200 ${
                    active ? 'bg-primary' : 'bg-transparent'
                }`}
            />

            <span className='relative flex min-h-0 flex-1 items-center justify-center overflow-hidden bg-surface-overlay'>
                <span
                    className={`text-2xl leading-none font-bold transition-colors duration-200 sm:text-4xl md:text-5xl ${
                        active
                            ? 'text-primary'
                            : 'text-surface-foreground group-hover:text-primary'
                    } ${loaded && showImage ? 'opacity-0' : 'opacity-100'}`}
                >
                    {char.char}
                </span>

                {showImage && (
                    <img
                        src={image}
                        alt=''
                        draggable={false}
                        loading='lazy'
                        onLoad={() => setLoaded(true)}
                        onError={() => setFailed(true)}
                        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
                            loaded ? 'opacity-100' : 'opacity-0'
                        }`}
                    />
                )}

                {showImage && loaded && (
                    <span
                        aria-hidden='true'
                        className={`absolute top-1 left-1 z-10 rounded-sm px-1 text-sm leading-tight font-bold sm:text-lg ${
                            active ? 'bg-primary text-primary-foreground' : 'bg-surface/90 text-surface-foreground'
                        }`}
                    >
                        {char.char}
                    </span>
                )}
            </span>

            <span
                className={`relative z-10 flex min-w-0 items-center gap-1 border-t px-2 pt-1 pb-1.5 font-mono text-[9px] font-semibold tracking-wider transition-colors duration-200 sm:text-[11px] ${
                    active
                        ? 'border-primary/30 bg-primary-subtle text-primary'
                        : 'border-line bg-surface text-surface-muted group-hover:text-primary'
                }`}
            >
                <FaVolumeHigh
                    className={`h-2 w-2 shrink-0 transition-opacity duration-200 sm:h-3 sm:w-3 ${
                        active ? 'opacity-100' : 'opacity-50 group-hover:opacity-100'
                    }`}
                />
                <span className='min-w-0 overflow-hidden text-ellipsis whitespace-nowrap'>
                    {char.read}
                </span>
            </span>
        </motion.button>
    );
}
