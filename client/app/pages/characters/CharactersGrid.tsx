import CharacterCard from './components/CharacterCard';
import { useCharacterToolbar } from '~/hooks/characters/useCharacterToolbar';

export default function CharactersGrid() {
    const { items, readingChar } = useCharacterToolbar();

    return items.map((item, index) =>
        item.char ? (
            <CharacterCard
                key={item.char + index}
                char={item}
                index={index}
                active={item.char === readingChar}
            />
        ) : (
            <div key={`empty-${index}`} className='invisible' aria-hidden='true' />
        ),
    );
}
