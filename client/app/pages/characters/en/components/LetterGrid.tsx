// -Path: 'client/app/pages/characters/en/components/LetterGrid.tsx'
import LetterCard from './LetterCard';
import type { ReadableChar } from '~/types/characters';
import { useCharacterToolbar } from '~/hooks/characters/useChacterToolbar';

/** Props for {@link LetterGrid}. */
interface LetterGridProps {
    /** Grid columns for the group (the alphabet uses five everywhere). */
    columns?: number;
    /** The letter the reader is currently on, tinted in the grid. */
    activeChar?: string | null;
    /** Notifies the reader that a card was tapped. */
    onRead?: (letter: ReadableChar, index: number) => void;
}

/**
 * The responsive card grid for one letter group — the alphabet twin of the
 * kana grid.
 *
 * @param props - LetterGrid props.
 * @returns The rendered letter grid.
 */
export default function LetterGrid({ columns = 5, activeChar = null, onRead }: LetterGridProps) {
    const { items } = useCharacterToolbar('en');
    const gridCols = columns === 3 ? 'grid-cols-3' : 'grid-cols-5';

    return (
        <div className={`grid ${gridCols} gap-3 sm:gap-4`}>
            {items.map((letter, index) =>
                letter.char ? (
                    <LetterCard
                        key={letter.char + index}
                        letter={letter}
                        index={index}
                        active={letter.char === activeChar}
                        onRead={onRead}
                    />
                ) : (
                    <div key={`empty-${index}`} className='invisible' aria-hidden='true' />
                ),
            )}
        </div>
    );
}
