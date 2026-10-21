// -Path: 'client/app/pages/characters/th/components/ThaiGrid.tsx'
import ThaiCard from './ThaiCard';
import type { ReadableChar } from '~/types/characters';
import { useCharacterToolbar } from '~/hooks/characters/useChacterToolbar';

/** Props for {@link ThaiGrid}. */
interface ThaiGridProps {
    /** The letter the reader is currently on, tinted in the grid. */
    activeChar?: string | null;
    /** Notifies the reader that a card was tapped. */
    onRead?: (letter: ReadableChar, index: number) => void;
}

/**
 * The responsive card grid for one Thai set — the Thai twin of the letter
 * grid. Six columns fit the 44-consonant set without leaving half-empty rows.
 *
 * @param props - ThaiGrid props.
 * @returns The rendered Thai grid.
 */
export default function ThaiGrid({ activeChar = null, onRead }: ThaiGridProps) {
    const { items, activeSet, activeGroup } = useCharacterToolbar('th');
    const gridCols = activeSet === 'tones' ? 'grid-cols-4' : 'grid-cols-6';

    return (
        <div
            className={`grid ${activeGroup === 'headless' ? 'font-thai' : ''} ${gridCols} gap-3 sm:gap-4`}
        >
            {items.map((letter, index) =>
                letter.char ? (
                    <ThaiCard
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
