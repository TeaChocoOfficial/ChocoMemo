// -Path: 'client/app/pages/japanese/characters/components/CharacterGrid.tsx'
import CharacterCard from './CharacterCard';
import type { Kana } from '~/data/japanese/kana';

interface CharacterGridProps {
    kanaList: Kana[];
}

export default function CharacterGrid({ kanaList }: CharacterGridProps) {
    return (
        <div className='grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3 sm:gap-4'>
            {kanaList.map((kana, index) => (
                <CharacterCard key={kana.char} kana={kana} index={index} />
            ))}
        </div>
    );
}
