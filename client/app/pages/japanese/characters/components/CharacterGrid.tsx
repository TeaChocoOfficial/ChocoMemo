// -Path: 'client/app/pages/japanese/characters/components/CharacterGrid.tsx'
import CharacterCard from './CharacterCard';
import type { Kana } from '~/data/japanese/kana';

interface CharacterGridProps {
    kanaList: Kana[];
    columns?: number;
}

export default function CharacterGrid({ kanaList, columns = 5 }: CharacterGridProps) {
    const gridCols =
        columns === 3 ? 'grid-cols-3' : 'grid-cols-5';

    return (
        <div className={`grid ${gridCols} gap-3 sm:gap-4`}>
            {kanaList.map((kana, index) =>
                kana.char ? (
                    <CharacterCard key={kana.char + index} kana={kana} index={index} />
                ) : (
                    <div key={`empty-${index}`} className='invisible' aria-hidden='true' />
                ),
            )}
        </div>
    );
}
