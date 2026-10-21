// -Path: 'client/app/pages/characters/en/EnChart.tsx'
import LetterGrid from './components/LetterGrid';
import CharactersPage from '../components/CharactersPage';
import { useCharacterReader } from '~/hooks/characters/useCharacterReader';

/**
 * The English alphabet chart: the twin of the Japanese kana page — hero,
 * stats, a sticky toolbar with the reading console, then the letter grid for
 * the active set (upper/lowercase) and group (vowels/consonants).
 *
 * @returns The rendered alphabet chart page.
 */
export default function EnChartPage() {
    const lang = 'en';
    const characterReader = useCharacterReader({ targetLang: lang });
    const { readingChar, handleCardRead } = characterReader;

    return (
        <CharactersPage lang={lang} characterReader={characterReader}>
            <LetterGrid activeChar={readingChar} onRead={handleCardRead} />
        </CharactersPage>
    );
}
