// -Path: 'client/app/pages/characters/ja/JaChart.tsx'
import KanaGrid from './components/KanaGrid';
import CharactersPage from '../components/CharactersPage';
import { useCharacterReader } from '~/hooks/characters/useCharacterReader';

export default function JaChartPage() {
    const lang = 'ja';
    const characterReader = useCharacterReader({ targetLang: lang });
    const { readingChar, groupList, handleCardRead } = characterReader;

    return (
        <CharactersPage lang={lang} characterReader={characterReader}>
            <KanaGrid activeChar={readingChar} onRead={handleCardRead} />
        </CharactersPage>
    );
}
