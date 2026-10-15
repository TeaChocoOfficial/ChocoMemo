// -Path: 'client/app/pages/characters/CharacterChart.tsx'
import { useParams } from 'react-router';
import { ALL_TARGETS, targetLanguage } from '~/data/language';
import { targetFromCode } from '~/utils/targetLang';
import KanaChart from './kana/Kana';
import CharacterComingSoon from './CharacterComingSoon';

/**
 * The character chart for `:target`. The target language's capabilities decide
 * which chart to show; only kana exists today, so every other language (and an
 * unknown target) falls through to the coming-soon notice. The route carries a
 * concrete target, so the deck-list "all languages" filter is dropped here.
 */
export default function CharacterChart() {
    const { target } = useParams();
    const targetLang = targetFromCode(target);
    const language = targetLang === ALL_TARGETS ? undefined : targetLang;
    const set = language ? targetLanguage(language)?.characters?.id : undefined;

    if (set === 'kana') return <KanaChart />;
    return <CharacterComingSoon targetLang={language} />;
}
